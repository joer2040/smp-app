import { markRecordConflict, markRecordSyncError, markRecordsAsSynced, updateRecord } from "@/lib/db";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { AppRecord, RecordValues } from "@/types/records";

type RemoteRecord = {
  values: RecordValues;
  updated_at: string | null;
  is_deleted: boolean | null;
  deleted_at: string | null;
  deleted_by: string | null;
  version: number | null;
};

type ResolveLocalPayload = {
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
  "Missing remote version for conflict resolution.";
const conflictResolutionChangedMessage =
  "Conflict resolution failed: remote version changed.";
const remoteRecordNotFoundMessage =
  "Remote conflict resolution failed: record not found or access denied.";

export async function resolveConflictWithLocalVersion(
  userId: string,
  formId: string,
  record: AppRecord
) {
  if (record.syncStatus !== "conflict") {
    return null;
  }

  if (typeof record.remoteVersion !== "number") {
    await markRecordSyncError(userId, record, missingRemoteVersionMessage);
    return null;
  }

  const supabase = createSupabaseBrowserClient();
  const now = new Date().toISOString();
  const nextRemoteVersion = record.remoteVersion + 1;
  const updatePayload: ResolveLocalPayload = {
    values: record.values,
    updated_at: now,
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
    .select("id, version")
    .maybeSingle();

  if (error || !data) {
    await markRecordConflict(
      userId,
      record,
      record.remoteVersion,
      conflictResolutionChangedMessage
    );
    return null;
  }

  const remoteVersion = data.version ?? nextRemoteVersion;
  await markRecordsAsSynced(userId, formId, [
    {
      id: record.id,
      remoteVersion
    }
  ]);

  return record.id;
}

export async function resolveConflictWithRemoteVersion(
  userId: string,
  record: AppRecord
) {
  if (record.syncStatus !== "conflict") {
    return null;
  }

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("records")
    .select("values, updated_at, is_deleted, deleted_at, deleted_by, version")
    .eq("id", record.id)
    .maybeSingle<RemoteRecord>();

  if (error || !data) {
    await markRecordSyncError(userId, record, remoteRecordNotFoundMessage);
    return null;
  }

  const now = new Date().toISOString();
  await updateRecord(userId, {
    ...record,
    values: data.values,
    updatedAt: data.updated_at ?? now,
    syncStatus: "synced",
    syncAction: null,
    syncError: null,
    remoteVersion: data.version ?? null,
    isDeleted: data.is_deleted ?? false,
    deletedAt: data.deleted_at ?? null,
    deletedBy: data.deleted_by ?? null
  });

  return record.id;
}
