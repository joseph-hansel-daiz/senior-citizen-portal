"use client";

import { useState, useEffect } from "react";
import { type AdminUserRow } from "@/hooks/users/useUsers";

interface PasswordModalProps {
  show: boolean;
  user: AdminUserRow | null;
  onHide: () => void;
  onSave: (userId: number, password: string) => Promise<void>;
  error?: Error | null;
}

export default function PasswordModal({
  show,
  user,
  onHide,
  onSave,
  error,
}: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset password when modal opens/closes or user changes
  useEffect(() => {
    if (show && user) {
      setPassword("");
    }
  }, [show, user]);

  const handleClose = () => {
    setPassword("");
    onHide();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !password.trim()) return;

    setLoading(true);
    try {
      await onSave(user.id, password.trim());
      handleClose();
    } catch (err) {
      // Error is handled by parent component
    } finally {
      setLoading(false);
    }
  };

  if (!show || !user) return null;

  return (
    <div className="modal d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Set Password for {user.username}</h5>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error.message}
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
                disabled={loading || !password.trim()}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving...
                  </>
                ) : (
                  "Save Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

