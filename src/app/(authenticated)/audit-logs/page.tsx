 "use client";

import { useMemo, useState } from "react";
import DataTable from "@/components/DataTable";
import { useAuditLogs, type AuditLogRow } from "@/hooks/useAuditLogs";
import SearchableSelect from "@/components/SearchableSelect";
import { useUsers } from "@/hooks/users/useUsers";
import { useSeniorOptions } from "@/hooks/useSeniorOptions";

export default function AuditLogsPage() {
  const { data, total, loading, error, refetch } = useAuditLogs();
  const { data: users } = useUsers();
  const { data: seniors } = useSeniorOptions("all");

  const [actorFilter, setActorFilter] = useState<number | null>(null);
  const [seniorFilter, setSeniorFilter] = useState<number | null>(null);

  const rows = useMemo(() => data, [data]);

  const columns = [
    { label: "ID", accessor: "id" },
    { label: "Timestamp", accessor: "createdAt" },
    { label: "Actor Name", accessor: "actorName" },
    { label: "Action", accessor: "action" },
    { label: "Entity Type", accessor: "entityType" },
    { label: "Entity ID", accessor: "entityId" },
    { label: "Senior", accessor: "seniorName" },
  ];

  const formatDateTime = (value: string) => {
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  const formattedRows = useMemo(() => {
    return rows.map((row: AuditLogRow) => {
      const seniorOption = seniors.find((s) => s.id === row.seniorId);
      const seniorName = seniorOption ? seniorOption.name : "";
      return {
        ...row,
        createdAt: formatDateTime(row.createdAt),
        actorName: row.actor ? row.actor.name : "",
        seniorName,
      };
    });
  }, [rows, seniors]);

  const actorOptions = useMemo(
    () => [
      { value: "", label: "All actors" },
      ...users.map((u) => ({
        value: u.id,
        label: `${u.name} (${u.username})`,
      })),
    ],
    [users]
  );

  const seniorOptions = useMemo(
    () => [
      { value: "", label: "All seniors" },
      ...seniors.map((s) => ({
        value: s.id,
        label: s.name,
      })),
    ],
    [seniors]
  );

  const handleApplyFilter = async () => {
    await refetch({
      actorId: actorFilter ?? undefined,
      seniorId: seniorFilter ?? undefined,
    });
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: 200 }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error.message}
      </div>
    );
  }

  return (
    <section>
      <div className="container p-4 card mb-3">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-label">Filter by Actor</label>
            <SearchableSelect
              options={actorOptions}
              value={actorFilter === null ? "" : actorFilter}
              onChange={(value) =>
                setActorFilter(value === "" || value === null ? null : Number(value))
              }
              placeholder="All actors"
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Filter by Senior</label>
            <SearchableSelect
              options={seniorOptions}
              value={seniorFilter === null ? "" : seniorFilter}
              onChange={(value) =>
                setSeniorFilter(value === "" || value === null ? null : Number(value))
              }
              placeholder="All seniors"
            />
          </div>
          <div className="col-12 col-md-4">
            <button className="btn btn-primary w-100" onClick={handleApplyFilter}>
              Apply Filters
            </button>
          </div>
        </div>
        <div className="mt-3 text-muted">
          <small>Total records: {total}</small>
        </div>
      </div>

      <DataTable<AuditLogRow>
        title="Audit Trail"
        data={formattedRows}
        columns={columns as any}
        searchableField="action"
      />
    </section>
  );
}

