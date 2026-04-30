import type { AppRecord } from "@/types/records";

type RecordsTableProps = {
  records: AppRecord[];
  onEdit?: (record: AppRecord) => void;
  onDelete?: (record: AppRecord) => void;
  onSimulateSyncError?: (record: AppRecord) => void;
  onUseLocalVersion?: (record: AppRecord) => void;
  onUseRemoteVersion?: (record: AppRecord) => void;
  showDeleted?: boolean;
};

function getDisplayValue(record: AppRecord, key: string) {
  const value = record.values[key];

  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
}

function getLocalVersion(record: AppRecord) {
  const version = (record as AppRecord & { version?: unknown }).version;

  return typeof version === "number" ? version : null;
}

function getStatusBadgeClass(record: AppRecord) {
  if (record.syncStatus === "conflict") {
    return "border-amber-300 bg-amber-100 text-amber-900";
  }

  if (record.syncStatus === "sync_error") {
    return "border-red-300 bg-red-50 text-red-700";
  }

  if (record.syncStatus === "synced") {
    return "border-emerald-300 bg-emerald-50 text-emerald-700";
  }

  return "border-sky-300 bg-sky-50 text-sky-700";
}

function getStatusLabel(record: AppRecord) {
  return record.syncStatus === "conflict" ? "Conflict" : record.syncStatus;
}

export function RecordsTable({
  records,
  onDelete,
  onEdit,
  onUseLocalVersion,
  onUseRemoteVersion,
  onSimulateSyncError,
  showDeleted = false
}: RecordsTableProps) {
  const visibleRecords = showDeleted
    ? records
    : records.filter((record) => record.isDeleted !== true);
  const hasActions = Boolean(
    onEdit ||
      onDelete ||
      onSimulateSyncError ||
      onUseLocalVersion ||
      onUseRemoteVersion
  );

  if (visibleRecords.length === 0) {
    return <p className="text-sm text-slate-600">No saved records yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded border border-slate-200">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="border-b border-slate-200 px-3 py-2 font-medium">
              Created
            </th>
            <th className="border-b border-slate-200 px-3 py-2 font-medium">
              Sync Status
            </th>
            <th className="border-b border-slate-200 px-3 py-2 font-medium">
              Sync Action
            </th>
            <th className="border-b border-slate-200 px-3 py-2 font-medium">
              Sync Error
            </th>
            <th className="border-b border-slate-200 px-3 py-2 font-medium">
              Remote Version
            </th>
            <th className="border-b border-slate-200 px-3 py-2 font-medium">
              Local Version
            </th>
            <th className="border-b border-slate-200 px-3 py-2 font-medium">
              Date
            </th>
            <th className="border-b border-slate-200 px-3 py-2 font-medium">
              Concept
            </th>
            <th className="border-b border-slate-200 px-3 py-2 font-medium">
              Amount
            </th>
            <th className="border-b border-slate-200 px-3 py-2 font-medium">
              Deleted
            </th>
            {hasActions ? (
              <th className="border-b border-slate-200 px-3 py-2 font-medium">
                Actions
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {visibleRecords.map((record) => {
            const isConflict = record.syncStatus === "conflict";
            const localVersion = getLocalVersion(record);

            return (
              <tr
                className={
                  isConflict
                    ? "border-l-4 border-amber-500 bg-amber-50 text-amber-950"
                    : record.isDeleted
                      ? "bg-slate-100 text-slate-500"
                      : "odd:bg-white even:bg-slate-50"
                }
                key={record.id}
              >
                <td className="border-b border-slate-100 px-3 py-2 text-slate-700">
                  {new Date(record.createdAt).toLocaleString()}
                </td>
                <td className="border-b border-slate-100 px-3 py-2 text-slate-700">
                  <span
                    className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(record)}`}
                  >
                    {getStatusLabel(record)}
                  </span>
                </td>
                <td className="border-b border-slate-100 px-3 py-2 text-slate-700">
                  {record.syncAction ?? ""}
                </td>
                <td className="border-b border-slate-100 px-3 py-2 text-slate-700">
                  <div className="space-y-1">
                    {record.syncError ? <p>{record.syncError}</p> : null}
                    {isConflict ? (
                      <p className="font-medium text-amber-800">
                        Conflict detected: This record was modified elsewhere.
                        Review required.
                      </p>
                    ) : null}
                  </div>
                </td>
                <td className="border-b border-slate-100 px-3 py-2 text-slate-700">
                  {record.remoteVersion ?? ""}
                </td>
                <td className="border-b border-slate-100 px-3 py-2 text-slate-700">
                  {localVersion ?? ""}
                </td>
                <td className="border-b border-slate-100 px-3 py-2 text-slate-700">
                  {getDisplayValue(record, "date")}
                </td>
                <td className="border-b border-slate-100 px-3 py-2 text-slate-700">
                  {getDisplayValue(record, "concept")}
                </td>
                <td className="border-b border-slate-100 px-3 py-2 text-slate-700">
                  {getDisplayValue(record, "amount")}
                </td>
                <td className="border-b border-slate-100 px-3 py-2 text-slate-700">
                  {record.isDeleted ? "Yes" : "No"}
                </td>
                {hasActions ? (
                  <td className="border-b border-slate-100 px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      {isConflict && onUseLocalVersion ? (
                        <button
                          className="rounded border border-amber-400 px-3 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100"
                          type="button"
                          onClick={() => onUseLocalVersion(record)}
                        >
                          Use my version
                        </button>
                      ) : null}
                      {isConflict && onUseRemoteVersion ? (
                        <button
                          className="rounded border border-slate-400 px-3 py-1 text-xs font-medium text-slate-800 hover:bg-slate-100"
                          type="button"
                          onClick={() => onUseRemoteVersion(record)}
                        >
                          Use remote version
                        </button>
                      ) : null}
                    {onEdit ? (
                      <button
                        className="rounded border border-slate-300 px-3 py-1 text-xs font-medium text-slate-800 hover:bg-slate-100"
                        type="button"
                        onClick={() => onEdit(record)}
                      >
                        Edit
                      </button>
                    ) : null}
                    {onDelete ? (
                      <button
                        className="rounded border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                        type="button"
                        onClick={() => onDelete(record)}
                      >
                        Delete
                      </button>
                    ) : null}
                    {onSimulateSyncError ? (
                      <button
                        className="rounded border border-amber-300 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50"
                        type="button"
                        onClick={() => onSimulateSyncError(record)}
                      >
                        Simulate Sync Error
                      </button>
                    ) : null}
                    </div>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
