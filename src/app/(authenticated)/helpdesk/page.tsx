"use client";

import { useMemo, useState } from "react";
import DataTable from "@/components/DataTable";
import HelpdeskRecordModal from "@/components/HelpdeskRecordModal";
import {
  createHelpdeskRecord,
  deleteHelpdeskRecord,
  HelpdeskRecord,
  updateHelpdeskRecord,
  useHelpdeskRecords,
} from "@/hooks/helpdesk/useHelpdesk";
import { useAuth } from "@/context/AuthContext";

interface TableRow {
  id: number;
  seniorName: string;
  category: string;
  details: string;
  createdAt: string;
}

export default function HelpdeskPage() {
  const { token } = useAuth();
  const { data: records, loading, error, refetch } = useHelpdeskRecords();

  const [showCreate, setShowCreate] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState<HelpdeskRecord | null>(null);
  const [actionError, setActionError] = useState<string>("");

  const rows: TableRow[] = useMemo(
    () =>
      records.map((r) => {
        const info = r.Senior?.IdentifyingInformation;
        const seniorName = info
          ? `${info.lastname}, ${info.firstname}${
              info.middlename ? " " + info.middlename : ""
            }`
          : "N/A";

        return {
          id: r.id,
          seniorName,
          category:
            r.HelpDeskRecordCategory?.name ||
            String(r.helpDeskRecordCategory),
          details: r.details,
          createdAt: new Date(r.createdAt).toLocaleString(),
        };
      }),
    [records]
  );

  const columns = [
    { label: "Senior Name", accessor: "seniorName" },
    { label: "Category", accessor: "category" },
    { label: "Details", accessor: "details" },
    { label: "Created", accessor: "createdAt" },
  ];

  const handleCreate = async (payload: {
    seniorId?: number;
    helpDeskRecordCategory: number;
    details: string;
  }) => {
    setActionError("");
    try {
      if (!payload.seniorId) throw new Error("Senior is required");
      await createHelpdeskRecord({
        seniorId: payload.seniorId,
        helpDeskRecordCategory: payload.helpDeskRecordCategory,
        details: payload.details,
      }, token || undefined);
      setShowCreate(false);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || "Failed to create");
    }
  };

  const handleUpdate = async (payload: {
    helpDeskRecordCategory: number;
    details: string;
  }) => {
    setActionError("");
    try {
      if (!selected) return;
      await updateHelpdeskRecord(selected.id, payload, token || undefined);
      setShowEdit(false);
      setSelected(null);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || "Failed to update");
    }
  };

  const handleDelete = async (id: number) => {
    setActionError("");
    try {
      await deleteHelpdeskRecord(id, token || undefined);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || "Failed to delete");
    }
  };

  const renderActions = (row: TableRow) => (
    <div className="d-grid gap-2">
      <button
        className="btn btn-primary btn-sm w-100"
        onClick={() => {
          const rec = records.find((r) => r.id === row.id) || null;
          setSelected(rec);
          setShowView(true);
        }}
      >
        View
      </button>
      <button
        className="btn btn-secondary btn-sm w-100"
        onClick={() => {
          const rec = records.find((r) => r.id === row.id) || null;
          setSelected(rec);
          setShowEdit(true);
        }}
      >
        Edit
      </button>
      <button
        className="btn btn-danger btn-sm w-100"
        onClick={() => handleDelete(row.id)}
      >
        Delete
      </button>
    </div>
  );

  if (loading) {
    return (
      <section
        className="d-flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="alert alert-danger" role="alert">
          {error.message}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Help Desk</h2>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          New Record
        </button>
      </div>

      {actionError && (
        <div className="alert alert-danger" role="alert">
          {actionError}
        </div>
      )}

      <DataTable<TableRow>
        title="Help Desk Records"
        data={rows}
        columns={columns as any}
        searchableField="details"
        renderActions={renderActions}
      />

      <HelpdeskRecordModal
        show={showCreate}
        mode="create"
        onHide={() => setShowCreate(false)}
        onSubmit={(p) => handleCreate(p as any)}
      />

      <HelpdeskRecordModal
        show={showView}
        mode="view"
        onHide={() => {
          setShowView(false);
          setSelected(null);
        }}
        initialData={selected || undefined}
      />

      <HelpdeskRecordModal
        show={showEdit}
        mode="edit"
        onHide={() => {
          setShowEdit(false);
          setSelected(null);
        }}
        initialData={selected || undefined}
        onSubmit={(p) => handleUpdate(p as any)}
      />
    </section>
  );
}
