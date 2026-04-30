import { syncPendingDeletes } from "./deleteRecords";
import { insertPendingCreates } from "./insertRecords";
import { syncPendingUpdates } from "./updateRecords";

export type SyncAllResult = {
  created: string[];
  updated: string[];
  deleted: string[];
};

export async function syncAll(
  userId: string,
  formId: string
): Promise<SyncAllResult> {
  const created = await insertPendingCreates(userId, formId);
  const updated = await syncPendingUpdates(userId, formId);
  const deleted = await syncPendingDeletes(userId, formId);

  return {
    created,
    updated,
    deleted
  };
}
