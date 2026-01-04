"use client";

import { useState, useEffect } from "react";

interface ChangePasswordModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (password: string) => Promise<{ success: boolean; error?: string }>;
  error?: string | null;
}

export default function ChangePasswordModal({
  show,
  onHide,
  onSave,
  error,
}: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  // Reset password when modal opens/closes
  useEffect(() => {
    if (show) {
      setNewPassword("");
      setConfirmPassword("");
      setLocalError("");
    }
  }, [show]);

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setLocalError("");
    onHide();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!newPassword.trim()) {
      setLocalError("New password cannot be empty");
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await onSave(newPassword.trim());
      if (result.success) {
        handleClose();
      } else {
        setLocalError(result.error || "Failed to update password");
      }
    } catch (err: any) {
      setLocalError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  const displayError = localError || error;

  return (
    <div className="modal d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Change Password</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={loading}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              {displayError && (
                <div className="alert alert-danger" role="alert">
                  {displayError}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !newPassword.trim() || !confirmPassword.trim()}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

