"use client";
import { useMemo, useState } from "react";
import { useSeniors } from "@/hooks/useSeniors";
import { useOptions } from "@/hooks/options/useOptions";
import { deleteSeniorVaccine, upsertSeniorVaccine, useSeniorVaccines } from "@/hooks/seniorVaccines/useSeniorVaccines";
import { useAuth } from "@/context/AuthContext";
import DataTable from "@/components/DataTable";

export default function SeniorVaccinesPage() {
  const { token, user } = useAuth();
  const { data: seniors } = useSeniors();
  const [selectedSeniorId, setSelectedSeniorId] = useState<number | null>(null);

  const { data: vaccines } = useOptions("vaccines");
  const { data: seniorVaccines, refetch } = useSeniorVaccines(selectedSeniorId);

  // Filter out deceased and non-active seniors
  const activeSeniors = useMemo(() => {
    return seniors.filter((senior) => {
      // Filter out deceased seniors
      if (senior.DeathInfo) {
        return false;
      }

      // Filter out seniors without Active status
      if (senior.SeniorStatusHistories && senior.SeniorStatusHistories.length > 0) {
        // Check if any status history entry is 'Active'
        const hasActiveStatus = senior.SeniorStatusHistories.some(
          (history) => history.status === 'Active'
        );
        if (!hasActiveStatus) {
          return false;
        }
      } else {
        // If no status history, exclude the senior
        return false;
      }

      return true;
    });
  }, [seniors]);

  const selectedSenior = useMemo(() => activeSeniors.find((s) => s.id === selectedSeniorId) || null, [activeSeniors, selectedSeniorId]);

  const [showModal, setShowModal] = useState(false);
  const [modalVaccineId, setModalVaccineId] = useState<number | null>(null);
  const [modalDate, setModalDate] = useState<string>("");
  const [actionError, setActionError] = useState<string>("");

  // Prepare table data when a senior is selected
  const rows = useMemo(() => {
    if (!selectedSeniorId) return [] as Array<{ id: number; vaccine: string; lastVaccineDate: string }>; 
    return seniorVaccines.map((row: any) => ({
      id: row.VaccineId,
      vaccine: row.Vaccine?.name || String(row.VaccineId),
      lastVaccineDate: row.lastVaccineDate || "-",
    }));
  }, [selectedSeniorId, seniorVaccines]);

  const columns = [
    { label: "Vaccine", accessor: "vaccine" },
    { label: "Last Vaccine Date", accessor: "lastVaccineDate" },
  ];

  const renderActions = (row: { id: number }) => {
    if (user?.role === "viewOnly") {
      return <span className="text-muted">View only</span>;
    }
    const found = seniorVaccines.find((rv: any) => rv.VaccineId === row.id);
    return (
      <div className="d-grid gap-2">
        <button className="btn btn-secondary btn-sm w-100" onClick={() => found && openEdit(found)}>Edit</button>
        <button className="btn btn-danger btn-sm w-100" onClick={() => onDelete(row.id)}>Delete</button>
      </div>
    );
  };

  const openCreate = () => {
    setModalVaccineId(null);
    setModalDate("");
    setShowModal(true);
  };

  const openEdit = (row: any) => {
    setModalVaccineId(row.VaccineId);
    setModalDate(row.lastVaccineDate || "");
    setShowModal(true);
  };

  const onSave = async () => {
    if (!selectedSeniorId || modalVaccineId == null) return;
    setActionError("");
    try {
      await upsertSeniorVaccine({ seniorId: selectedSeniorId, vaccineId: modalVaccineId, lastVaccineDate: modalDate || null }, token || undefined);
      setShowModal(false);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || "Failed to save");
    }
  };

  const onDelete = async (vaccineId: number) => {
    if (!selectedSeniorId) return;
    setActionError("");
    try {
      await deleteSeniorVaccine(selectedSeniorId, vaccineId, token || undefined);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || "Failed to delete");
    }
  };

  return (
    <section>
      <div className="container py-4">
        <h2 className="mb-3">Senior Vaccines</h2>

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
              <button className="btn btn-primary" disabled={!selectedSenior} onClick={openCreate}>Add Vaccine to Senior</button>
            )}
          </div>
        </div>

        {selectedSenior && (
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Vaccines for {(() => {
                const info = selectedSenior.IdentifyingInformation;
                return info
                  ? `${info.firstname} ${info.middlename || ""} ${info.lastname}`.replace(/\s+/g, " ").trim()
                  : `Senior #${selectedSenior.id}`;
              })()}</h5>
            </div>

            <DataTable
              title="Vaccines"
              data={rows}
              columns={columns as any}
              searchableField="vaccine"
              renderActions={renderActions as any}
            />
          </div>
        )}

        {showModal && user?.role !== "viewOnly" && (
          <div className="modal d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{modalVaccineId == null ? "Add Vaccine" : "Edit Vaccine Date"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  {actionError && <div className="alert alert-danger">{actionError}</div>}
                  <div className="mb-3">
                    <label className="form-label">Vaccine</label>
                    <select
                      className="form-select"
                      value={modalVaccineId ?? ""}
                      onChange={(e) => setModalVaccineId(e.target.value ? Number(e.target.value) : null)}
                      disabled={modalVaccineId != null}
                    >
                      <option value="">-- Choose Vaccine --</option>
                      {vaccines.map((v) => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Vaccine Date</label>
                    <input type="date" className="form-control" value={modalDate} onChange={(e) => setModalDate(e.target.value)} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="button" className="btn btn-primary" disabled={!selectedSeniorId || modalVaccineId == null} onClick={onSave}>Save</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


