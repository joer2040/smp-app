import { markRecordsAsSynced } from "@/lib/db";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { AppRecord } from "@/types/records";
import { getPendingRecords } from "./getPendingRecords";

function logInsertError(recordId: string, error: unknown) {
  if (error && typeof error === "object") {
    const supabaseError = error as {
      code?: string;
      details?: string;
      hint?: string;
      message?: string;
    };

    console.warn("Failed to insert pending_create record", {
      id: recordId,
      code: supabaseError.code,
      message: supabaseError.message,
      details: supabaseError.details,
      hint: supabaseError.hint
    });
    return;
  }

  console.warn("Failed to insert pending_create record", {
    id: recordId,
    error
  });
}

export async function insertPendingCreates(userId: string, formId: string) {
  const supabase = createSupabaseBrowserClient();
  const pendingCreates = (await getPendingRecords(userId, formId)).filter(
    (record) => isCreateSyncRecord(record)
  );
  const insertedRecords: Array<{ id: string; remoteVersion: number | null }> = [];

  for (const record of pendingCreates) {
    const { data, error } = await supabase
      .from("records")
      .insert({
        id: record.id,
        form_id: record.formId,
        values: record.values,
        sync_status: "synced",
        created_at: record.createdAt,
        updated_at: record.updatedAt,
        created_by: userId,
        updated_by: userId,
        is_deleted: record.isDeleted ?? false,
        deleted_at: record.deletedAt ?? null,
        sync_error: null
      })
      .select("id, version")
      .single();

    if (error) {
      logInsertError(record.id, error);
      continue;
    }

    insertedRecords.push({
      id: record.id,
      remoteVersion: data.version ?? null
    });
  }

  await markRecordsAsSynced(userId, formId, insertedRecords);

  return insertedRecords.map((record) => record.id);
}

function isCreateSyncRecord(record: AppRecord) {
  return (
    record.syncStatus === "pending_create" ||
    (record.syncStatus === "sync_error" && record.syncAction === "create")
  );
}
