"use client";

import { useState } from "react";

interface Props {
  show: boolean;
  onHide: () => void;
  onSubmit: (payload: { dateOfDeath: string; deathCertificate: File | null }) => Promise<void> | void;
  loading?: boolean;
  error?: Error | null;
}

export default function MarkDeceasedModal({ show, onHide, onSubmit, loading = false, error }: Props) {
  const [dateOfDeath, setDateOfDeath] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ dateOfDeath, deathCertificate: file });
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} aria-modal="true" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Mark as Deceased</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Date of Death</label>
                <input type="date" className="form-control" value={dateOfDeath} onChange={(e) => setDateOfDeath(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Death Certificate</label>
                <input type="file" className="form-control" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <div className="form-text">Optional file upload</div>
              </div>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error.message}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide} disabled={loading}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  "Mark as Deceased"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


