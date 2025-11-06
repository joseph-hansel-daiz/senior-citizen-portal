"use client";

import { useEffect, useState } from "react";
import { type AdminUserRow, type UserRole } from "@/hooks/users/useUsers";

type Mode = "view" | "edit";

const ROLES: UserRole[] = ["admin", "barangay", "osca", "viewOnly"];

interface UserModalProps {
  show: boolean;
  mode: Mode;
  user: AdminUserRow | null;
  barangays: Array<{ id: number; name: string }>;
  onHide: () => void;
  onSave?: (user: AdminUserRow, photoFile?: File) => Promise<void>;
  resolvePhotoToUrl: (photo: any) => Promise<string | null>;
  error?: Error | null;
}

export default function UserModal({
  show,
  mode,
  user,
  barangays,
  onHide,
  onSave,
  resolvePhotoToUrl,
  error,
}: UserModalProps) {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const [formUser, setFormUser] = useState<AdminUserRow | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoInputKey, setPhotoInputKey] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Initialize form when user changes
  useEffect(() => {
    if (user) {
      setFormUser({ ...user });
      setPhotoFile(null); // Reset photo file when user changes
    } else {
      setFormUser(null);
      setPhotoFile(null);
    }
  }, [user]);

  // Resolve photo when user or photoFile changes
  useEffect(() => {
    if (!show || !formUser) {
      setPhotoUrl(null);
      setPhotoFile(null);
      return;
    }

    let active = true;

    (async () => {
      // If there's a new photo file, use that
      if (photoFile) {
        const url = URL.createObjectURL(photoFile);
        if (active) {
          // Revoke previous URL if it was a blob
          if (photoUrl && photoUrl.startsWith("blob:")) {
            URL.revokeObjectURL(photoUrl);
          }
          setPhotoUrl(url);
        }
        return;
      }

      // Otherwise, try to resolve from user data
      const photoData = (formUser as any).photo;
      if (!photoData) {
        if (active) setPhotoUrl(null);
        return;
      }

      const url = await resolvePhotoToUrl(photoData);

      if (!active) {
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
        return;
      }

      setPhotoUrl(url);
    })();

    return () => {
      active = false;
    };
  }, [formUser, photoFile, show, resolvePhotoToUrl]);

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (photoUrl && photoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoUrl]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  const handleClose = () => {
    // Cleanup photo URLs when closing
    if (photoUrl && photoUrl.startsWith("blob:")) {
      URL.revokeObjectURL(photoUrl);
    }
    setPhotoFile(null);
    setPhotoUrl(null);
    setPhotoInputKey((k) => k + 1);
    onHide();
  };

  const handleSave = async () => {
    if (!formUser || !onSave) return;
    setLoading(true);
    try {
      await onSave(formUser, photoFile || undefined);
      handleClose();
    } catch (err) {
      // Error is handled by parent component via error prop
    } finally {
      setLoading(false);
    }
  };

  const title = isView ? "View User" : "Edit User";

  if (!show || !formUser) return null;

  return (
    <div className="modal d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={handleClose} />
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Photo</label>
              {photoUrl ? (
                <div className="mb-2">
                  <img
                    src={photoUrl}
                    alt="User Photo"
                    className="img-thumbnail"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML =
                          '<div class="text-muted">No photo available</div>';
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="mb-2 text-muted">No Photo</div>
              )}
              {isEdit && (
                <>
                  <input
                    key={photoInputKey}
                    type="file"
                    className="form-control"
                    accept="image/png, image/jpeg"
                    onChange={handlePhotoChange}
                  />
                  <div className="form-text">
                    Only JPG and PNG formats accepted.
                  </div>
                  {photoFile && (
                    <div className="mt-2">
                      <small className="text-muted">
                        Selected: {photoFile.name}
                      </small>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                value={formUser.username}
                disabled
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                value={formUser.name}
                onChange={(e) =>
                  setFormUser({ ...formUser, name: e.target.value })
                }
                disabled={isView}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={formUser.role}
                onChange={(e) =>
                  setFormUser({
                    ...formUser,
                    role: e.target.value as UserRole,
                  })
                }
                disabled={isView}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Barangay</label>
              <select
                className="form-select"
                value={formUser.barangayId === null ? "" : String(formUser.barangayId)}
                onChange={(e) =>
                  setFormUser({
                    ...formUser,
                    barangayId: e.target.value ? Number(e.target.value) : null,
                  })
                }
                disabled={isView || formUser.role !== "barangay"}
              >
                <option value="">— None —</option>
                {barangays.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error.message}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Close
            </button>
            {isEdit && (
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={loading}
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
                  "Save changes"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

