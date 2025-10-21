"use client";

interface Props {
  show: boolean;
  onHide: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
  error?: Error | null;
  title?: string;
  message?: string;
  confirmText?: string;
  confirmButtonClass?: string;
}

export default function DeleteConfirmModal({ 
  show, 
  onHide, 
  onConfirm, 
  loading = false, 
  error,
  title = "Delete Senior",
  message = "Are you sure you want to delete this senior?",
  confirmText = "Delete",
  confirmButtonClass = "btn-danger"
}: Props) {
  if (!show) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }} aria-modal="true" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error.message}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide} disabled={loading}>Cancel</button>
            <button type="button" className={`btn ${confirmButtonClass}`} onClick={handleConfirm} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


