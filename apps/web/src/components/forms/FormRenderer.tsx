"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { FormConfig, FormValues } from "@/types/forms";
import {
  getRecords,
  markAllAsSynced,
  markRecordDeleted,
  markRecordSyncError,
  saveRecord,
  updateRecord
} from "@/lib/db";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import {
  getPendingRecords,
  insertPendingCreates,
  resolveConflictWithLocalVersion,
  resolveConflictWithRemoteVersion,
  syncAll,
  syncPendingDeletes,
  syncPendingUpdates
} from "@/lib/sync";
import { useBackgroundSync } from "@/hooks";
import type { AppRecord, RecordValues } from "@/types/records";
import { RecordsTable } from "@/components/tables";

type FormRendererProps = {
  form: FormConfig;
};

type FormErrors = Record<string, string>;

function normalizeValues(form: FormConfig, values: FormValues): RecordValues {
  return form.fields.reduce<RecordValues>((normalizedValues, field) => {
    const value = values[field.name];

    if (field.type === "number") {
      const numberValue = Number(value);
      normalizedValues[field.name] =
        value.trim() && !Number.isNaN(numberValue) ? numberValue : null;
      return normalizedValues;
    }

    normalizedValues[field.name] = value;
    return normalizedValues;
  }, {});
}

function recordValuesToFormValues(form: FormConfig, record: AppRecord): FormValues {
  return form.fields.reduce<FormValues>((nextValues, field) => {
    const value = record.values[field.name];
    nextValues[field.name] = value === null || value === undefined ? "" : String(value);
    return nextValues;
  }, {});
}

function getBackgroundSyncLabel(
  status: "idle" | "syncing" | "synced" | "error"
) {
  if (status === "syncing") {
    return "Syncing...";
  }

  if (status === "synced") {
    return "Synced";
  }

  if (status === "error") {
    return "Sync failed";
  }

  return null;
}

export function FormRenderer({ form }: FormRendererProps) {
  const initialValues = useMemo(
    () =>
      form.fields.reduce<FormValues>((values, field) => {
        values[field.name] = "";
        return values;
      }, {}),
    [form.fields]
  );

  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);
  const [editingRecord, setEditingRecord] = useState<AppRecord | null>(null);
  const [savedRecords, setSavedRecords] = useState<AppRecord[]>([]);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [sendCreatesMessage, setSendCreatesMessage] = useState<string | null>(
    null
  );
  const [sendUpdatesMessage, setSendUpdatesMessage] = useState<string | null>(
    null
  );
  const [sendDeletesMessage, setSendDeletesMessage] = useState<string | null>(
    null
  );
  const [syncAllMessage, setSyncAllMessage] = useState<string | null>(null);
  const [conflictResolutionMessage, setConflictResolutionMessage] = useState<
    string | null
  >(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showConflictsOnly, setShowConflictsOnly] = useState(false);
  const displayedRecords = showConflictsOnly
    ? savedRecords.filter((record) => record.syncStatus === "conflict")
    : savedRecords;

  const refreshLocalRecords = useCallback(async () => {
    if (!userId) {
      setSavedRecords([]);
      setPendingSyncCount(0);
      return;
    }

    const [records, pendingRecords] = await Promise.all([
      getRecords(userId, form.id),
      getPendingRecords(userId, form.id)
    ]);

    setSavedRecords(records);
    setPendingSyncCount(pendingRecords.length);
  }, [form.id, userId]);

  const resetTransientState = useCallback(() => {
    setEditingRecord(null);
    setSubmittedData(null);
    setErrors({});
    setValues(initialValues);
    setSendCreatesMessage(null);
    setSendUpdatesMessage(null);
    setSendDeletesMessage(null);
    setSyncAllMessage(null);
    setConflictResolutionMessage(null);
  }, [initialValues]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let isMounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      resetTransientState();
      setUserId(data.user?.id ?? null);
      setIsSessionLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      resetTransientState();
      setUserId(session?.user.id ?? null);
      setIsSessionLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [resetTransientState]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshLocalRecords();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [form.id, refreshLocalRecords, userId]);

  const backgroundSyncStatus = useBackgroundSync({
    userId,
    formId: form.id,
    onSyncComplete: refreshLocalRecords
  });
  const backgroundSyncLabel = getBackgroundSyncLabel(backgroundSyncStatus);

  function requireUserId() {
    return userId;
  }

  function validate(nextValues: FormValues) {
    return form.fields.reduce<FormErrors>((nextErrors, field) => {
      if (field.required && !nextValues[field.name]?.trim()) {
        nextErrors[field.name] = `${field.label} is required`;
      }

      return nextErrors;
    }, {});
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentUserId = requireUserId();

    if (!currentUserId) {
      return;
    }

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmittedData(null);
      return;
    }

    const now = new Date().toISOString();
    const normalized = normalizeValues(form, values);
    const record: AppRecord = editingRecord
        ? {
          ...editingRecord,
          values: normalized,
          updatedAt: now,
          syncStatus: "pending_update",
          syncAction: "update"
        }
      : {
          id: crypto.randomUUID(),
          formId: form.id,
          values: normalized,
          createdAt: now,
          updatedAt: now,
          syncStatus: "pending_create",
          syncAction: "create",
          remoteVersion: null
        };

    console.log(record);
    if (editingRecord) {
      await updateRecord(currentUserId, record);
    } else {
      await saveRecord(currentUserId, record);
    }

    await refreshLocalRecords();
    setSubmittedData(values);
    setEditingRecord(null);
    setValues(initialValues);
  }

  function handleEdit(record: AppRecord) {
    if (!requireUserId()) {
      return;
    }

    setEditingRecord(record);
    setValues(recordValuesToFormValues(form, record));
    setSubmittedData(null);
    setErrors({});
  }

  async function handleDelete(record: AppRecord) {
    const currentUserId = requireUserId();

    if (!currentUserId) {
      return;
    }

    await markRecordDeleted(currentUserId, record, currentUserId);
    await refreshLocalRecords();

    if (editingRecord?.id === record.id) {
      setEditingRecord(null);
      setValues(initialValues);
      setErrors({});
    }
  }

  async function handleSyncNow() {
    const currentUserId = requireUserId();

    if (!currentUserId) {
      return;
    }

    await markAllAsSynced(currentUserId, form.id);
    await refreshLocalRecords();
  }

  async function handleSimulateSyncError(record: AppRecord) {
    const currentUserId = requireUserId();

    if (!currentUserId) {
      return;
    }

    await markRecordSyncError(currentUserId, record, "Simulated sync failure");
    await refreshLocalRecords();
  }

  async function handleSendPendingCreates() {
    const currentUserId = requireUserId();

    if (!currentUserId) {
      return;
    }

    setSendCreatesMessage(null);

    try {
      const insertedIds = await insertPendingCreates(currentUserId, form.id);
      await refreshLocalRecords();
      setSendCreatesMessage(`Inserted ${insertedIds.length} pending creates`);
    } catch (error) {
      console.warn("Failed to send pending creates", error);
      setSendCreatesMessage("Failed to send pending creates");
    }
  }

  async function handleSendPendingUpdates() {
    const currentUserId = requireUserId();

    if (!currentUserId) {
      return;
    }

    setSendUpdatesMessage(null);

    try {
      const updatedIds = await syncPendingUpdates(currentUserId, form.id);
      await refreshLocalRecords();
      setSendUpdatesMessage(`Updated ${updatedIds.length} pending updates`);
    } catch (error) {
      console.warn("Failed to send pending updates", error);
      setSendUpdatesMessage("Failed to send pending updates");
    }
  }

  async function handleSendPendingDeletes() {
    const currentUserId = requireUserId();

    if (!currentUserId) {
      return;
    }

    setSendDeletesMessage(null);

    try {
      const deletedIds = await syncPendingDeletes(currentUserId, form.id);
      await refreshLocalRecords();
      setSendDeletesMessage(`Deleted ${deletedIds.length} pending deletes`);
    } catch (error) {
      console.warn("Failed to send pending deletes", error);
      setSendDeletesMessage("Failed to send pending deletes");
    }
  }

  async function handleSyncAll() {
    const currentUserId = requireUserId();

    if (!currentUserId) {
      return;
    }

    setSyncAllMessage(null);

    try {
      const result = await syncAll(currentUserId, form.id);
      await refreshLocalRecords();
      setSyncAllMessage(
        `Synced ${result.created.length} creates, ${result.updated.length} updates, ${result.deleted.length} deletes`
      );
    } catch (error) {
      console.warn("Failed to sync all", error);
      setSyncAllMessage("Failed to sync all");
    }
  }

  async function handleUseLocalVersion(record: AppRecord) {
    const currentUserId = requireUserId();

    if (!currentUserId) {
      return;
    }

    setConflictResolutionMessage(null);

    try {
      const resolvedId = await resolveConflictWithLocalVersion(
        currentUserId,
        form.id,
        record
      );
      await refreshLocalRecords();
      setConflictResolutionMessage(
        resolvedId
          ? "Conflict resolved using local version"
          : "Conflict was not resolved"
      );
    } catch (error) {
      console.warn("Failed to resolve conflict with local version", error);
      await refreshLocalRecords();
      setConflictResolutionMessage("Failed to resolve conflict");
    }
  }

  async function handleUseRemoteVersion(record: AppRecord) {
    const currentUserId = requireUserId();

    if (!currentUserId) {
      return;
    }

    setConflictResolutionMessage(null);

    try {
      const resolvedId = await resolveConflictWithRemoteVersion(
        currentUserId,
        record
      );
      await refreshLocalRecords();
      setConflictResolutionMessage(
        resolvedId
          ? "Conflict resolved using remote version"
          : "Conflict was not resolved"
      );
    } catch (error) {
      console.warn("Failed to resolve conflict with remote version", error);
      await refreshLocalRecords();
      setConflictResolutionMessage("Failed to resolve conflict");
    }
  }

  return (
    <section className="w-full max-w-xl space-y-6 rounded border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">{form.title}</h1>
        <p className="mt-2 text-sm font-medium text-slate-700">
          Pending Sync: {pendingSyncCount} records
        </p>
        {backgroundSyncLabel ? (
          <p className="mt-1 text-sm font-medium text-slate-700">
            Background Sync: {backgroundSyncLabel}
          </p>
        ) : null}
        {!userId && !isSessionLoading ? (
          <p className="mt-2 text-sm font-medium text-red-700">
            Please log in to manage records.
          </p>
        ) : null}
        <button
          className="mt-3 rounded border border-slate-300 px-3 py-1 text-sm font-medium text-slate-800 hover:bg-slate-100"
          type="button"
          disabled={!userId}
          onClick={() => void handleSyncNow()}
        >
          Sync Now
        </button>
        <button
          className="ml-2 mt-3 rounded border border-slate-300 px-3 py-1 text-sm font-medium text-slate-800 hover:bg-slate-100"
          type="button"
          disabled={!userId}
          onClick={() => void handleSyncAll()}
        >
          Sync All
        </button>
        <button
          className="ml-2 mt-3 rounded border border-slate-300 px-3 py-1 text-sm font-medium text-slate-800 hover:bg-slate-100"
          type="button"
          disabled={!userId}
          onClick={() => void handleSendPendingCreates()}
        >
          Send Pending Creates
        </button>
        <button
          className="ml-2 mt-3 rounded border border-slate-300 px-3 py-1 text-sm font-medium text-slate-800 hover:bg-slate-100"
          type="button"
          disabled={!userId}
          onClick={() => void handleSendPendingUpdates()}
        >
          Send Pending Updates
        </button>
        <button
          className="ml-2 mt-3 rounded border border-slate-300 px-3 py-1 text-sm font-medium text-slate-800 hover:bg-slate-100"
          type="button"
          disabled={!userId}
          onClick={() => void handleSendPendingDeletes()}
        >
          Send Pending Deletes
        </button>
        {sendCreatesMessage ? (
          <p className="mt-2 text-sm text-slate-600">{sendCreatesMessage}</p>
        ) : null}
        {sendUpdatesMessage ? (
          <p className="mt-2 text-sm text-slate-600">{sendUpdatesMessage}</p>
        ) : null}
        {sendDeletesMessage ? (
          <p className="mt-2 text-sm text-slate-600">{sendDeletesMessage}</p>
        ) : null}
        {syncAllMessage ? (
          <p className="mt-2 text-sm text-slate-600">{syncAllMessage}</p>
        ) : null}
        {conflictResolutionMessage ? (
          <p className="mt-2 text-sm text-slate-600">
            {conflictResolutionMessage}
          </p>
        ) : null}
        {editingRecord ? (
          <p className="mt-2 text-sm text-slate-600">
            Editing record: {editingRecord.id}
          </p>
        ) : null}
      </div>

      <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
        {form.fields.map((field) => (
          <div className="space-y-2" key={field.name}>
            <label
              className="block text-sm font-medium text-slate-800"
              htmlFor={`${form.id}-${field.name}`}
            >
              {field.label}
            </label>
            <input
              className="w-full rounded border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
              id={`${form.id}-${field.name}`}
              name={field.name}
              required={field.required}
              type={field.type}
              value={values[field.name] ?? ""}
              disabled={!userId}
              onChange={(event) =>
                setValues((currentValues) => ({
                  ...currentValues,
                  [field.name]: event.target.value
                }))
              }
            />
            {errors[field.name] ? (
              <p className="text-sm text-red-700">{errors[field.name]}</p>
            ) : null}
          </div>
        ))}

        <button
          className="rounded bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          disabled={!userId}
          type="submit"
        >
          {editingRecord ? "Update Record" : "Create Record"}
        </button>
      </form>

      {submittedData ? (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-slate-800">Submitted Data</h2>
          <pre className="overflow-auto rounded bg-slate-950 p-4 text-sm text-slate-50">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      ) : null}

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-medium text-slate-800">Saved Records</h2>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                checked={showConflictsOnly}
                className="h-4 w-4"
                type="checkbox"
                onChange={(event) => setShowConflictsOnly(event.target.checked)}
              />
              Show conflicts only
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                checked={showDeleted}
                className="h-4 w-4"
                type="checkbox"
                onChange={(event) => setShowDeleted(event.target.checked)}
              />
              Show deleted records
            </label>
          </div>
        </div>
        <RecordsTable
          records={displayedRecords}
          onDelete={(record) => void handleDelete(record)}
          onEdit={handleEdit}
          onSimulateSyncError={(record) => void handleSimulateSyncError(record)}
          onUseLocalVersion={(record) => void handleUseLocalVersion(record)}
          onUseRemoteVersion={(record) => void handleUseRemoteVersion(record)}
          showDeleted={showDeleted}
        />
      </div>
    </section>
  );
}
