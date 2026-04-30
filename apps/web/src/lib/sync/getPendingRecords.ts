import { getRecords } from "@/lib/db";
import type { AppRecord, SyncStatus } from "@/types/records";

export async function getPendingRecords(
  userId: string,
  formId: string
): Promise<AppRecord[]> {
  const records = await getRecords(userId, formId);
  return records.filter((record) => record.syncStatus !== "synced");
}

export async function getRecordsByStatus(
  userId: string,
  formId: string,
  status: SyncStatus
): Promise<AppRecord[]> {
  const records = await getRecords(userId, formId);
  return records.filter((record) => record.syncStatus === status);
}
