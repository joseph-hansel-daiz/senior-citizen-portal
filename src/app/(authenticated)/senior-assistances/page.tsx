"use client";
import { useMemo, useState } from "react";
import { useSeniors } from "@/hooks/useSeniors";
import { useOptions } from "@/hooks/options/useOptions";
import { deleteSeniorAssistance, upsertSeniorAssistance, useSeniorAssistances } from "@/hooks/seniorAssistances/useSeniorAssistances";
import { useAuth } from "@/context/AuthContext";
import DataTable from "@/components/DataTable";

export default function SeniorAssistancesPage() {
  const { token, user } = useAuth();
  const { data: seniors } = useSeniors();
  const [selectedSeniorId, setSelectedSeniorId] = useState<number | null>(null);

  const { data: assistances } = useOptions("assistances");
  const { data: seniorAssistances, refetch } = useSeniorAssistances(selectedSeniorId);

  const activeSeniors = useMemo(() => {
    return seniors.filter((senior) => {
      if (senior.DeathInfo) {
        return false;
      }
      if (senior.SeniorStatusHistories && senior.SeniorStatusHistories.length > 0) {
        const hasActiveStatus = senior.SeniorStatusHistories.some(
          (history) => history.status === 'Active'
        );
        if (!hasActiveStatus) {
          return false;
        }
      } else {
        return false;
      }
      return true;
    });
  }, [seniors]);

  const selectedSenior = useMemo(() => activeSeniors.find((s) => s.id === selectedSeniorId) || null, [activeSeniors, selectedSeniorId]);

  const [showModal, setShowModal] = useState(false);
  const [modalRecordId, setModalRecordId] = useState<number | null>(null);
  const [modalAssistanceId, setModalAssistanceId] = useState<number | null>(null);
  const [modalDate, setModalDate] = useState<string>("");
  const [actionError, setActionError] = useState<string>("");

  const rows = useMemo(() => {
    if (!selectedSeniorId) return [] as Array<{ id: number; assistance: string; assistanceDate: string }>; 
    return seniorAssistances.map((row: any) => ({
      id: row.id,
      assistance: row.Assistance?.name || String(row.assistanceId),
      assistanceDate: row.assistanceDate || "-",
    }));
  }, [selectedSeniorId, seniorAssistances]);

  const columns = [
    { label: "Assistance", accessor: "assistance" },
    { label: "Assistance Date", accessor: "assistanceDate" },
  ];

  const renderActions = (row: { id: number }) => {
    if (user?.role === "viewOnly") {
      return <span className="text-muted">View only</span>;
    }
    const found = seniorAssistances.find((rv: any) => rv.id === row.id);
    return (
      <div className="d-grid gap-2">
        <button className="btn btn-secondary btn-sm w-100" onClick={() => found && openEdit(found)}>Edit</button>
        <button className="btn btn-danger btn-sm w-100" onClick={() => onDelete(row.id)}>Delete</button>
      </div>
    );
  };

  const openCreate = () => {
    setModalRecordId(null);
    setModalAssistanceId(null);
    setModalDate("");
    setShowModal(true);
  };

  const openEdit = (row: any) => {
    setModalRecordId(row.id);
    setModalAssistanceId(row.assistanceId);
    setModalDate(row.assistanceDate || "");
    setShowModal(true);
  };

  const onSave = async () => {
    if (!selectedSeniorId || modalAssistanceId == null) return;
    setActionError("");
    try {
      await upsertSeniorAssistance({ id: modalRecordId ?? undefined, seniorId: selectedSeniorId, assistanceId: modalAssistanceId, assistanceDate: modalDate || null } as any, token || undefined);
      setShowModal(false);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || "Failed to save");
    }
  };

  const onDelete = async (recordId: number) => {
    if (!selectedSeniorId) return;
    setActionError("");
    try {
      await deleteSeniorAssistance(selectedSeniorId, recordId, token || undefined);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || "Failed to delete");
    }
  };

  return (
    <section>
      <div className="container py-4">
        <h2 className="mb-3">Senior Assistances</h2>

        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <label className="form-label">Select Senior</label>
            <select
              className="form-select"
              value={selectedSeniorId ?? ""}
              onChange={(e) => setSelectedSeniorId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">-- Choose Senior --</option>
              {activeSeniors.map((s) => {
                const info = s.IdentifyingInformation;
                const name = info
                  ? `${info.firstname} ${info.middlename || ""} ${info.lastname}`.replace(/\s+/g, " ").trim()
                  : `Senior #${s.id}`;
                return (
                  <option key={s.id} value={s.id}>{name}</option>
                );
              })}
            </select>
          </div>
          <div className="col-md-6 text-end">
            {user?.role !== "viewOnly" && (
              <button className="btn btn-primary" disabled={!selectedSenior} onClick={openCreate}>Add Assistance to Senior</button>
            )}
          </div>
        </div>

        {selectedSenior && (
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Assistances for {(() => {
                const info = selectedSenior.IdentifyingInformation;
                return info
                  ? `${info.firstname} ${info.middlename || ""} ${info.lastname}`.replace(/\s+/g, " ").trim()
                  : `Senior #${selectedSenior.id}`;
              })()}</h5>
            </div>

            <DataTable
              title="Assistances"
              data={rows}
              columns={columns as any}
              searchableField="assistance"
              renderActions={renderActions as any}
            />
          </div>
        )}

        {showModal && user?.role !== "viewOnly" && (
          <div className="modal d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{modalAssistanceId == null ? "Add Assistance" : "Edit Assistance Date"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  {actionError && <div className="alert alert-danger">{actionError}</div>}
                  <div className="mb-3">
                    <label className="form-label">Assistance</label>
                    <select
                      className="form-select"
                      value={modalAssistanceId ?? ""}
                      onChange={(e) => setModalAssistanceId(e.target.value ? Number(e.target.value) : null)}
                      disabled={modalRecordId != null}
                    >
                      <option value="">-- Choose Assistance --</option>
                      {assistances.map((v) => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Assistance Date</label>
                    <input type="date" className="form-control" value={modalDate} onChange={(e) => setModalDate(e.target.value)} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="button" className="btn btn-primary" disabled={!selectedSeniorId || modalAssistanceId == null} onClick={onSave}>Save</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


