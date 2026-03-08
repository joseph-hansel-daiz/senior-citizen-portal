"use client";

import { useEffect, useMemo, useState } from "react";
import { useSeniorOptions } from "@/hooks/useSeniorOptions";
import { useHelpDeskRecordCategories } from "@/hooks/options";
import SearchableSelect from "@/components/SearchableSelect";

type Mode = "view" | "create" | "edit";

interface HelpdeskRecordModalProps {
  show: boolean;
  mode: Mode;
  onHide: () => void;
  initialData?: any | null;
  onSubmit?: (payload: { seniorId?: number; helpDeskRecordCategoryIds: number[]; details: string }) => Promise<void> | void;
}

export default function HelpdeskRecordModal({ show, mode, onHide, initialData, onSubmit }: HelpdeskRecordModalProps) {
  const isView = mode === "view";
  const isCreate = mode === "create";

  const { data: seniorOptionsList } = useSeniorOptions(isCreate ? "active" : undefined);
  const { data: categories } = useHelpDeskRecordCategories();

  const [form, setForm] = useState<{ seniorId: string; details: string }>(
    { seniorId: "", details: "" }
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const seniorOptions = useMemo(
    () =>
      (seniorOptionsList ?? []).map((s) => ({
        value: String(s.id),
        label: s.name,
      })),
    [seniorOptionsList]
  );

  useEffect(() => {
    if (initialData) {
      setForm({
        seniorId: String(initialData.seniorId ?? ""),
        details: String(initialData.details ?? ""),
      });
      
      // Handle categories - support both old single category and new array format
      if (initialData.HelpDeskRecordCategories && Array.isArray(initialData.HelpDeskRecordCategories)) {
        // New format: array of category objects
        setSelectedCategoryIds(initialData.HelpDeskRecordCategories.map((cat: { id: number }) => cat.id));
      } else if (initialData.helpDeskRecordCategory) {
        // Old format: single category ID (backward compatibility)
        setSelectedCategoryIds([Number(initialData.helpDeskRecordCategory)]);
      } else if (initialData.HelpDeskRecordCategory?.id) {
        // Old format: single category object (backward compatibility)
        setSelectedCategoryIds([initialData.HelpDeskRecordCategory.id]);
      } else {
        setSelectedCategoryIds([]);
      }
    } else {
      setForm({ seniorId: "", details: "" });
      setSelectedCategoryIds([]);
    }
  }, [initialData, show]);

  const title = useMemo(() => {
    if (isView) return "View Help Desk Record";
    if (isCreate) return "Create Help Desk Record";
    return "Edit Help Desk Record";
  }, [mode]);

  const handleCheckboxChange = (categoryId: number) => {
    if (isView) return;
    if (selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== categoryId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;
    
    if (selectedCategoryIds.length === 0) {
      alert("Please select at least one category");
      return;
    }
    
    await onSubmit({
      seniorId: form.seniorId ? Number(form.seniorId) : undefined,
      helpDeskRecordCategoryIds: selectedCategoryIds,
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
                  <SearchableSelect
                    options={seniorOptions}
                    value={form.seniorId}
                    onChange={(value) => setForm({ ...form, seniorId: value as string })}
                    placeholder="Select senior..."
                    disabled={isView}
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">
                  Categories <span className="text-danger">*</span>
                </label>
                <div className="border rounded p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {categories.map((c) => (
                    <div className="form-check" key={c.id}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={c.id}
                        id={`category-${c.id}`}
                        checked={selectedCategoryIds.includes(c.id)}
                        onChange={() => handleCheckboxChange(c.id)}
                        disabled={isView}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`category-${c.id}`}
                      >
                        {c.name}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedCategoryIds.length === 0 && !isView && (
                  <div className="form-text text-danger">
                    Please select at least one category
                  </div>
                )}
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


