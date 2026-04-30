"use client";

import { useEffect, useRef, useState } from "react";
import { getPendingRecords, syncAll } from "@/lib/sync";
import type { AppRecord } from "@/types/records";

type BackgroundSyncStatus = "idle" | "syncing" | "synced" | "error";

type UseBackgroundSyncOptions = {
  userId: string | null;
  formId: string;
  onSyncComplete?: () => void | Promise<void>;
};

function isBackgroundSyncRecord(record: AppRecord) {
  return (
    record.syncStatus === "pending_create" ||
    record.syncStatus === "pending_update" ||
    record.syncStatus === "pending_delete" ||
    record.syncStatus === "sync_error"
  );
}

export function useBackgroundSync({
  userId,
  formId,
  onSyncComplete
}: UseBackgroundSyncOptions) {
  const [backgroundSyncStatus, setBackgroundSyncStatus] =
    useState<BackgroundSyncStatus>("idle");
  const isSyncing = useRef(false);
  const timeoutId = useRef<number | null>(null);

  useEffect(() => {
    async function runBackgroundSync() {
      if (!userId || isSyncing.current || !window.navigator.onLine) {
        return;
      }

      const pendingRecords = (await getPendingRecords(userId, formId)).filter(
        isBackgroundSyncRecord
      );

      if (pendingRecords.length === 0) {
        return;
      }

      isSyncing.current = true;
      setBackgroundSyncStatus("syncing");

      try {
        await syncAll(userId, formId);
        await onSyncComplete?.();
        setBackgroundSyncStatus("synced");
      } catch (error) {
        console.warn("Background sync failed", error);
        await onSyncComplete?.();
        setBackgroundSyncStatus("error");
      } finally {
        isSyncing.current = false;
      }
    }

    function handleOnline() {
      if (timeoutId.current !== null) {
        window.clearTimeout(timeoutId.current);
      }

      timeoutId.current = window.setTimeout(() => {
        timeoutId.current = null;
        void runBackgroundSync();
      }, 500);
    }

    function handleOffline() {
      if (timeoutId.current !== null) {
        window.clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }

      setBackgroundSyncStatus("idle");
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      if (timeoutId.current !== null) {
        window.clearTimeout(timeoutId.current);
      }

      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [formId, onSyncComplete, userId]);

  return backgroundSyncStatus;
}
