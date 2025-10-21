"use client";

import { useState } from "react";

interface Props {
  show: boolean;
  onHide: () => void;
  onSubmit: (payload: { note?: string }) => Promise<void> | void;
  loading?: boolean;
  error?: Error | null;
}

export default function DeclineModal({ show, onHide, onSubmit, loading = false, error }: Props) {
  const [note, setNote] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ note: note || undefined });
  };

  const handleClose = () => {
    setNote("");
    onHide();
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} aria-modal="true" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Decline Senior Citizen</h5>
            <button type="button" className="btn-close" onClick={handleClose} disabled={loading}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <p>Are you sure you want to decline this senior citizen application?</p>
              <div className="mb-3">
                <label className="form-label">Reason for Decline (Optional)</label>
                <textarea 
                  className="form-control" 
                  rows={3}
                  value={note} 
                  onChange={(e) => setNote(e.target.value)} 
                  placeholder="Add a reason for declining this application"
                />
              </div>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error.message}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={loading}>Cancel</button>
              <button type="submit" className="btn btn-danger" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Declining...
                  </>
                ) : (
                  "Decline"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

