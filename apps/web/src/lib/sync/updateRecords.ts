import {
  markRecordConflict,
  markRecordSyncError,
  markRecordsAsSynced
} from "@/lib/db";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { AppRecord } from "@/types/records";
import { getPendingRecords } from "./getPendingRecords";

type UpdatePayload = {
  values: AppRecord["values"];
  updated_at: string;
  updated_by: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
  sync_error: null;
  sync_status: "synced";
  version: number;
};

const missingRemoteVersionMessage =
  "Missing remote version for optimistic update.";
const notFoundUpdateMessage = "Remote update failed: not_found.";
const forbiddenUpdateMessage = "Remote update failed: forbidden.";

function isZeroAffectedRowsError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "PGRST116"
  );
}

type RemoteRecordVersion = {
  created_by: string | null;
  version: number | null;
};

function logUpdateError(recordId: string, error: unknown) {
  if (error && typeof error === "object") {
    const supabaseError = error as {
      code?: string;
      details?: string;
      hint?: string;
      message?: string;
    };

    console.warn("Failed to update pending_update record", {
      id: recordId,
      code: supabaseError.code,
      message: supabaseError.message,
      details: supabaseError.details,
      hint: supabaseError.hint
    });
    return;
  }

  console.warn("Failed to update pending_update record", {
    id: recordId,
    error
  });
}

export async function syncPendingUpdates(
  userId: string,
  formId: string
): Promise<string[]> {
  const supabase = createSupabaseBrowserClient();
  const pendingUpdates = (await getPendingRecords(userId, formId)).filter(
    (record) => isUpdateSyncRecord(record)
  );
  const updatedRecords: Array<{ id: string; remoteVersion: number | null }> = [];

  for (const record of pendingUpdates) {
    if (typeof record.remoteVersion !== "number") {
      await markRecordSyncError(userId, record, missingRemoteVersionMessage);
      continue;
    }

    const nextRemoteVersion = record.remoteVersion + 1;
    const updatePayload: UpdatePayload = {
      values: record.values,
      updated_at: record.updatedAt,
      updated_by: userId,
      is_deleted: record.isDeleted ?? false,
      deleted_at: record.deletedAt ?? null,
      deleted_by: record.deletedBy ?? null,
      sync_error: null,
      sync_status: "synced",
      version: nextRemoteVersion
    };

    const { data, error } = await supabase
      .from("records")
      .update(updatePayload)
      .eq("id", record.id)
      .eq("version", record.remoteVersion)
      .select("id")
      .maybeSingle();

    if (error) {
      if (isZeroAffectedRowsError(error)) {
        const remoteRecord = await getRemoteRecordVersion(record.id);

        if (!remoteRecord) {
          await markRecordSyncError(userId, record, notFoundUpdateMessage);
          continue;
        }

        if (remoteRecord.created_by !== userId) {
          await markRecordSyncError(userId, record, forbiddenUpdateMessage);
          continue;
        }

        await markRecordConflict(userId, record, remoteRecord.version);
        continue;
      }

      logUpdateError(record.id, error);
      continue;
    }

    if (!data) {
      const remoteRecord = await getRemoteRecordVersion(record.id);

      if (!remoteRecord) {
        await markRecordSyncError(userId, record, notFoundUpdateMessage);
        continue;
      }

      if (remoteRecord.created_by !== userId) {
        await markRecordSyncError(userId, record, forbiddenUpdateMessage);
        continue;
      }

      await markRecordConflict(userId, record, remoteRecord.version);
      continue;
    }

    updatedRecords.push({
      id: record.id,
      remoteVersion: nextRemoteVersion
    });
  }

  await markRecordsAsSynced(userId, formId, updatedRecords);

  return updatedRecords.map((record) => record.id);
}

function isUpdateSyncRecord(record: AppRecord) {
  return (
    record.syncStatus === "pending_update" ||
    (record.syncStatus === "sync_error" && record.syncAction === "update")
  );
}

async function getRemoteRecordVersion(
  recordId: string
): Promise<RemoteRecordVersion | null> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("records")
    .select("created_by, version")
    .eq("id", recordId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}
