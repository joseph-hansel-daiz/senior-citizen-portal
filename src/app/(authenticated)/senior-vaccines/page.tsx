"use client";
import { useMemo, useState } from "react";
import { useSeniors } from "@/hooks/useSeniors";
import { useOptions } from "@/hooks/options/useOptions";
import { deleteSeniorVaccine, upsertSeniorVaccine, useSeniorVaccines } from "@/hooks/seniorVaccines/useSeniorVaccines";

export default function SeniorVaccinesPage() {
  const { data: seniors } = useSeniors();
  const [selectedSeniorId, setSelectedSeniorId] = useState<number | null>(null);

  const { data: vaccines } = useOptions("vaccines");
  const { data: seniorVaccines, refetch } = useSeniorVaccines(selectedSeniorId);

  const selectedSenior = useMemo(() => seniors.find((s) => s.id === selectedSeniorId) || null, [seniors, selectedSeniorId]);

  const [showModal, setShowModal] = useState(false);
  const [modalVaccineId, setModalVaccineId] = useState<number | null>(null);
  const [modalDate, setModalDate] = useState<string>("");
  const [actionError, setActionError] = useState<string>("");

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
      await upsertSeniorVaccine({ seniorId: selectedSeniorId, vaccineId: modalVaccineId, lastVaccineDate: modalDate || null });
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
      await deleteSeniorVaccine(selectedSeniorId, vaccineId);
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
              {seniors.map((s) => {
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
            <button className="btn btn-primary" disabled={!selectedSenior} onClick={openCreate}>Add Vaccine to Senior</button>
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

            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Vaccine</th>
                    <th>Last Vaccine Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {seniorVaccines.map((row) => (
                    <tr key={`${row.seniorId}-${row.VaccineId}`}>
                      <td>{row.Vaccine?.name || row.VaccineId}</td>
                      <td>{row.lastVaccineDate || "-"}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-secondary me-2" onClick={() => openEdit(row)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => onDelete(row.VaccineId)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {seniorVaccines.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center text-muted">No vaccines yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showModal && (
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


