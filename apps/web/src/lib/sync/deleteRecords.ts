import {
  markRecordSyncError,
  markRecordsAsSynced
} from "@/lib/db";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { AppRecord } from "@/types/records";
import { getPendingRecords } from "./getPendingRecords";

const zeroAffectedDeleteMessage =
  "Remote delete affected 0 rows. Record may not exist or access is denied.";

function isZeroAffectedRowsError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "PGRST116"
  );
}

function logDeleteError(recordId: string, error: unknown) {
  if (error && typeof error === "object") {
    const supabaseError = error as {
      code?: string;
      details?: string;
      hint?: string;
      message?: string;
    };

    console.warn("Failed to sync pending_delete record", {
      id: recordId,
      code: supabaseError.code,
      message: supabaseError.message,
      details: supabaseError.details,
      hint: supabaseError.hint
    });
    return;
  }

  console.warn("Failed to sync pending_delete record", {
    id: recordId,
    error
  });
}

export async function syncPendingDeletes(
  userId: string,
  formId: string
): Promise<string[]> {
  const supabase = createSupabaseBrowserClient();
  const pendingDeletes = (await getPendingRecords(userId, formId)).filter(
    (record) => isDeleteSyncRecord(record)
  );
  const deletedIds: string[] = [];

  for (const record of pendingDeletes) {
    const { data, error } = await supabase
      .from("records")
      .update({
        is_deleted: true,
        deleted_at: record.deletedAt ?? null,
        deleted_by: record.deletedBy ?? userId,
        updated_at: record.updatedAt,
        updated_by: userId,
        sync_error: null,
        sync_status: "synced"
      })
      .eq("id", record.id)
      .select("id")
      .single();

    if (error) {
      if (isZeroAffectedRowsError(error)) {
        await markRecordSyncError(userId, record, zeroAffectedDeleteMessage);
        continue;
      }

      logDeleteError(record.id, error);
      continue;
    }

    if (!data) {
      await markRecordSyncError(userId, record, zeroAffectedDeleteMessage);
      continue;
    }

    deletedIds.push(record.id);
  }

  await markRecordsAsSynced(userId, formId, deletedIds);

  return deletedIds;
}

function isDeleteSyncRecord(record: AppRecord) {
  return (
    record.syncStatus === "pending_delete" ||
    (record.syncStatus === "sync_error" && record.syncAction === "delete")
  );
}
