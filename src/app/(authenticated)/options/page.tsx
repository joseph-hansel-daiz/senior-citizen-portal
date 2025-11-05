"use client";

import { useMemo, useState } from "react";
import DataTable from "@/components/DataTable";
import {
  createOption,
  deleteOption,
  updateOption,
  useOptions,
} from "@/hooks/options/useOptions";
import { useAuth } from "@/context/AuthContext";

type OptionKey =
  | "area-of-difficulties"
  | "aural-concerns"
  | "cohabitants"
  | "community-involvements"
  | "dental-concerns"
  | "health-problems"
  | "educational-attainments"
  | "income-sources"
  | "living-conditions"
  | "monthly-incomes"
  | "personal-properties"
  | "problems-needs"
  | "real-properties"
  | "social-emotional-concerns"
  | "technical-skills"
  | "visual-concerns"
  | "barangays"
  | "help-desk-record-categories"
  | "vaccines"
  | "assistances";

const OPTIONS: { key: OptionKey; label: string }[] = [
  { key: "area-of-difficulties", label: "Area of Difficulties" },
  { key: "aural-concerns", label: "Aural Concerns" },
  { key: "barangays", label: "Barangays" },
  { key: "cohabitants", label: "Cohabitants" },
  { key: "community-involvements", label: "Community Involvements" },
  { key: "dental-concerns", label: "Dental Concerns" },
  { key: "health-problems", label: "Health Problems/Ailments" },
  { key: "educational-attainments", label: "Highest Educational Attainments" },
  { key: "income-sources", label: "Income Assistance Sources" },
  { key: "living-conditions", label: "Living Conditions" },
  { key: "monthly-incomes", label: "Monthly Incomes" },
  { key: "personal-properties", label: "Personal Movable Properties" },
  { key: "problems-needs", label: "Problems/Needs Commonly Encountered" },
  { key: "real-properties", label: "Real/Immovable Properties" },
  { key: "social-emotional-concerns", label: "Social/Emotional Concerns" },
  { key: "technical-skills", label: "Specialization/Technical Skills" },
  { key: "visual-concerns", label: "Visual Concerns" },
  { key: "help-desk-record-categories", label: "Help Desk Record Categories" },
  { key: "vaccines", label: "Vaccines" },
  { key: "assistances", label: "Assistances" },
];

interface Row { id: number; name: string }

export default function OptionsPage() {
  const { token } = useAuth();
  const [selectedKey, setSelectedKey] = useState<OptionKey>("cohabitants");
  const { data, loading, error, refetch } = useOptions(selectedKey);

  const [actionError, setActionError] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const rows: Row[] = useMemo(() => data, [data]);
  const columns = [
    { label: "ID", accessor: "id" },
    { label: "Name", accessor: "name" },
  ];

  const onCreate = async () => {
    setActionError("");
    try {
      if (!newValue.trim()) throw new Error("Name is required");
      await createOption(selectedKey, newValue.trim(), token || undefined);
      setNewValue("");
      await refetch();
    } catch (err: any) {
      setActionError(err.message || "Failed to create");
    }
  };

  const onStartEdit = (row: Row) => {
    setEditId(row.id);
    setEditValue(row.name);
  };

  const onSaveEdit = async () => {
    if (editId == null) return;
    setActionError("");
    try {
      if (!editValue.trim()) throw new Error("Name is required");
      await updateOption(selectedKey, editId, editValue.trim(), token || undefined);
      setEditId(null);
      setEditValue("");
      await refetch();
    } catch (err: any) {
      setActionError(err.message || "Failed to update");
    }
  };

  const onDelete = async (id: number) => {
    setActionError("");
    try {
      await deleteOption(selectedKey, id, token || undefined);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || "Failed to delete");
    }
  };

  const renderActions = (row: Row) => (
    <div className="d-grid gap-2">
      <button className="btn btn-secondary btn-sm w-100" onClick={() => onStartEdit(row)}>Edit</button>
      <button className="btn btn-danger btn-sm w-100" onClick={() => onDelete(row.id)}>Delete</button>
    </div>
  );

  return (
    <section>
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-end mb-3">
        <div style={{ minWidth: 260 }}>
          <label className="form-label">Select Option Type</label>
          <select
            className="form-select"
            value={selectedKey}
            onChange={(e) => {
              setSelectedKey(e.target.value as OptionKey);
              setActionError("");
              setNewValue("");
              setEditId(null);
              setEditValue("");
            }}
          >
            {OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="d-flex align-items-end gap-2 flex-grow-1" style={{ minWidth: 280 }}>
          <div className="flex-grow-1">
            <label className="form-label">New Entry</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter name"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={onCreate}>Add</button>
        </div>
      </div>

      {actionError && (
        <div className="alert alert-danger" role="alert">{actionError}</div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
          <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">{error.message}</div>
      ) : (
        <DataTable<Row>
          title={OPTIONS.find(o => o.key === selectedKey)?.label || "Options"}
          data={rows}
          columns={columns as any}
          searchableField="name"
          renderActions={renderActions}
        />
      )}

      {editId != null && (
        <div className="modal d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Entry</h5>
                <button type="button" className="btn-close" onClick={() => { setEditId(null); setEditValue(""); }} />
              </div>
              <div className="modal-body">
                <label className="form-label">Name</label>
                <input className="form-control" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => { setEditId(null); setEditValue(""); }}>Close</button>
                <button className="btn btn-primary" onClick={onSaveEdit}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


