export type SyncStatus =
  | "pending_create"
  | "pending_update"
  | "pending_delete"
  | "synced"
  | "sync_error"
  | "conflict";

export type SyncAction = "create" | "update" | "delete" | null;

export type RecordValues = Record<string, string | number | boolean | null>;

export type AppRecord = {
  id: string;
  formId: string;
  values: RecordValues;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
  syncAction?: SyncAction;
  isDeleted?: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;
  syncError?: string | null;
  remoteVersion?: number | null;
};
