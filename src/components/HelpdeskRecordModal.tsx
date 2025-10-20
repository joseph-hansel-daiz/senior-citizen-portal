"use client";

import { useEffect, useMemo, useState } from "react";
import { useSeniors } from "@/hooks/useSeniors";
import { useHelpDeskRecordCategories } from "@/hooks/options";

type Mode = "view" | "create" | "edit";

interface HelpdeskRecordModalProps {
  show: boolean;
  mode: Mode;
  onHide: () => void;
  initialData?: any | null;
  onSubmit?: (payload: { seniorId?: number; helpDeskRecordCategory: number; details: string }) => Promise<void> | void;
}

export default function HelpdeskRecordModal({ show, mode, onHide, initialData, onSubmit }: HelpdeskRecordModalProps) {
  const isView = mode === "view";
  const isCreate = mode === "create";

  const { data: seniors } = useSeniors();
  const { data: categories } = useHelpDeskRecordCategories();

  const [form, setForm] = useState<{ seniorId: string; categoryId: string; details: string }>(
    { seniorId: "", categoryId: "", details: "" }
  );

  useEffect(() => {
    if (initialData) {
      setForm({
        seniorId: String(initialData.seniorId ?? ""),
        categoryId: String(initialData.helpDeskRecordCategory ?? initialData.HelpDeskRecordCategory?.id ?? ""),
        details: String(initialData.details ?? ""),
      });
    } else {
      setForm({ seniorId: "", categoryId: "", details: "" });
    }
  }, [initialData, show]);

  const title = useMemo(() => {
    if (isView) return "View Help Desk Record";
    if (isCreate) return "Create Help Desk Record";
    return "Edit Help Desk Record";
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;
    await onSubmit({
      seniorId: form.seniorId ? Number(form.seniorId) : undefined,
      helpDeskRecordCategory: Number(form.categoryId),
      details: form.details.trim(),
    });
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onHide} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {isCreate && (
                <div className="mb-3">
                  <label className="form-label">Senior</label>
                  <select
                    className="form-select"
                    value={form.seniorId}
                    onChange={(e) => setForm({ ...form, seniorId: e.target.value })}
                    disabled={isView}
                  >
                    <option value="">Select senior...</option>
                    {seniors.map((s) => {
                      const info = s.IdentifyingInformation;
                      const label = info
                        ? `${info.firstname} ${info.middlename || ""} ${info.lastname}`.replace(/\s+/g, " ").trim()
                        : `OSCA #${s.id}`;
                      return (
                        <option key={s.id} value={String(s.id)}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  disabled={isView}
                >
                  <option value="">Select category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Details</label>
                <textarea
                  className="form-control"
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  rows={4}
                  maxLength={100}
                  placeholder="Enter details (max 100 characters)"
                  disabled={isView}
                />
                <div className="form-text">{form.details.length}/100</div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide}>
                Close
              </button>
              {!isView && (
                <button type="submit" className="btn btn-primary">
                  {isCreate ? "Create" : "Save changes"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


