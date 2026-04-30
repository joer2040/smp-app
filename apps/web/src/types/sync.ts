import type { AppRecord } from "./records";

export type SyncRequest = {
  // Send full AppRecord so the server has identity, form, values, timestamps,
  // deletion flags, and sync intent in one durable payload.
  records: AppRecord[];
};

export type SyncSuccess = {
  id: string;
  status: "synced";
};

export type SyncError = {
  id: string;
  error: string;
};

export type SyncResponse = {
  success: SyncSuccess[];
  failed: SyncError[];
  serverTime: string;
};

// Server decision rule:
// - pending_create -> create remote row.
// - pending_update -> update remote row by id.
// - pending_delete or isDeleted -> mark/delete remote row according to server policy.
// Failed records stay pending on the client and can be retried or shown to the user.
