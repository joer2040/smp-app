import { openDB, type DBSchema } from "idb";
import type { AppRecord } from "@/types/records";

const databaseName = "smp-offline-db";
const databaseVersion = 1;
const recordsStoreName = "records";

type StoredAppRecord = AppRecord & {
  userId: string;
};

interface SmpOfflineDb extends DBSchema {
  records: {
    key: string;
    value: StoredAppRecord;
    indexes: {
      userId: string;
      formId: string;
      syncStatus: AppRecord["syncStatus"];
      userId_formId: [string, string];
    };
  };
}

function getDatabase() {
  return openDB<SmpOfflineDb>(databaseName, databaseVersion, {
    upgrade(database) {
      if (database.objectStoreNames.contains(recordsStoreName)) {
        return;
      }

      const recordsStore = database.createObjectStore(recordsStoreName, {
        keyPath: "id"
      });

      recordsStore.createIndex("userId", "userId");
      recordsStore.createIndex("formId", "formId");
      recordsStore.createIndex("syncStatus", "syncStatus");
      recordsStore.createIndex("userId_formId", ["userId", "formId"]);
    }
  });
}

function toStoredRecord(userId: string, record: AppRecord): StoredAppRecord {
  return {
    ...record,
    userId
  };
}

function toAppRecord(record: StoredAppRecord): AppRecord {
  const { userId, ...appRecord } = record;
  void userId;

  return appRecord;
}

async function getStoredRecords(
  userId: string,
  formId: string
): Promise<StoredAppRecord[]> {
  const database = await getDatabase();
  return database.getAllFromIndex(
    recordsStoreName,
    "userId_formId",
    IDBKeyRange.only([userId, formId])
  );
}

async function getStoredRecordsForUser(userId: string) {
  const database = await getDatabase();
  return database.getAllFromIndex(recordsStoreName, "userId", userId);
}

export async function getRecords(
  userId: string,
  formId: string
): Promise<AppRecord[]> {
  const records = await getStoredRecords(userId, formId);
  return records.map(toAppRecord);
}

export async function saveRecord(userId: string, record: AppRecord) {
  const database = await getDatabase();
  await database.put(recordsStoreName, toStoredRecord(userId, record));
}

export async function updateRecord(userId: string, record: AppRecord) {
  const database = await getDatabase();
  const currentRecord = await database.get(recordsStoreName, record.id);

  if (currentRecord?.userId && currentRecord.userId !== userId) {
    return;
  }

  await database.put(recordsStoreName, toStoredRecord(userId, record));
}

export async function markRecordDeleted(
  userId: string,
  record: AppRecord,
  deletedBy?: string | null
) {
  const database = await getDatabase();
  const currentRecord = await database.get(recordsStoreName, record.id);

  if (!currentRecord || currentRecord.userId !== userId) {
    return;
  }

  const now = new Date().toISOString();
  await database.put(recordsStoreName, {
    ...currentRecord,
    isDeleted: true,
    deletedAt: now,
    deletedBy: deletedBy ?? null,
    updatedAt: now,
    syncStatus: "pending_delete",
    syncAction: "delete"
  });
}

export async function markAllAsSynced(userId: string, formId?: string) {
  const now = new Date().toISOString();
  const records = formId
    ? await getStoredRecords(userId, formId)
    : await getStoredRecordsForUser(userId);
  const database = await getDatabase();
  const transaction = database.transaction(recordsStoreName, "readwrite");

  await Promise.all(
    records.map((record) =>
      record.syncStatus !== "synced" && record.syncStatus !== "conflict"
        ? transaction.store.put({
            ...record,
            syncStatus: "synced",
            syncAction: null,
            syncError: null,
            updatedAt: now
          })
        : Promise.resolve()
    )
  );

  await transaction.done;
}

export async function markRecordsAsSynced(
  userId: string,
  formId: string,
  syncedRecords: Array<string | { id: string; remoteVersion?: number | null }>
) {
  const syncedRecordVersions = new Map(
    syncedRecords.map((record) =>
      typeof record === "string"
        ? [record, undefined]
        : [record.id, record.remoteVersion]
    )
  );
  const records = await getStoredRecords(userId, formId);
  const now = new Date().toISOString();
  const database = await getDatabase();
  const transaction = database.transaction(recordsStoreName, "readwrite");

  await Promise.all(
    records.map((record) =>
      syncedRecordVersions.has(record.id)
        ? transaction.store.put({
            ...record,
            syncStatus: "synced",
            syncAction: null,
            syncError: null,
            updatedAt: now,
            remoteVersion:
              syncedRecordVersions.get(record.id) ?? record.remoteVersion ?? null
          })
        : Promise.resolve()
    )
  );

  await transaction.done;
}

export async function markRecordConflict(
  userId: string,
  record: AppRecord,
  remoteVersion: number | null,
  error = "Version conflict detected"
) {
  const database = await getDatabase();
  const currentRecord = await database.get(recordsStoreName, record.id);

  if (!currentRecord || currentRecord.userId !== userId) {
    return;
  }

  const now = new Date().toISOString();
  await database.put(recordsStoreName, {
    ...currentRecord,
    syncStatus: "conflict",
    syncError: error,
    remoteVersion,
    updatedAt: now
  });
}

export async function markRecordSyncError(
  userId: string,
  record: AppRecord,
  error: string
) {
  const database = await getDatabase();
  const currentRecord = await database.get(recordsStoreName, record.id);

  if (!currentRecord || currentRecord.userId !== userId) {
    return;
  }

  const now = new Date().toISOString();
  await database.put(recordsStoreName, {
    ...currentRecord,
    syncStatus: "sync_error",
    syncError: error,
    updatedAt: now
  });
}
