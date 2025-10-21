"use client";

import { useState } from "react";

interface Props {
  show: boolean;
  onHide: () => void;
  onSubmit: (payload: { oscaId: string; note?: string }) => Promise<void> | void;
  loading?: boolean;
  error?: Error | null;
}

export default function ApproveModal({ show, onHide, onSubmit, loading = false, error }: Props) {
  const [oscaId, setOscaId] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ oscaId, note: note || undefined });
  };

  const handleClose = () => {
    setOscaId("");
    setNote("");
    onHide();
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} aria-modal="true" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Approve Senior Citizen</h5>
            <button type="button" className="btn-close" onClick={handleClose} disabled={loading}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">OSCA ID <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={oscaId} 
                  onChange={(e) => setOscaId(e.target.value)} 
                  placeholder="Enter OSCA ID"
                  required 
                />
                <div className="form-text">This will be assigned to the senior citizen</div>
              </div>
              <div className="mb-3">
                <label className="form-label">Note (Optional)</label>
                <textarea 
                  className="form-control" 
                  rows={3}
                  value={note} 
                  onChange={(e) => setNote(e.target.value)} 
                  placeholder="Add any notes about this approval"
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
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Approving...
                  </>
                ) : (
                  "Approve"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

