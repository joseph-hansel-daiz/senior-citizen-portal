"use client";

import { useEffect, useMemo, useState } from "react";
import DataTable from "@/components/DataTable";
import UserModal from "@/components/UserModal";
import PasswordModal from "@/components/PasswordModal";
import { useAuth } from "@/context/AuthContext";
import { createUser, deleteUser, updateUser, updateUserPassword, useUsers, type AdminUserRow, type UserRole } from "@/hooks/users/useUsers";
import { useOptions } from "@/hooks/options/useOptions";

const ROLES: UserRole[] = ["admin", "barangay", "osca", "viewOnly"];

export default function UsersPage() {
  const { token } = useAuth();
  const { data, loading, error, refetch } = useUsers();
  const { data: barangays } = useOptions("barangays");

  const rows = useMemo(() => data, [data]);
  const columns = [
    { label: "ID", accessor: "id" },
    { label: "Username", accessor: "username" },
    { label: "Name", accessor: "name" },
    { label: "Role", accessor: "role" },
    { label: "Barangay ID", accessor: "barangayId" },
  ];

  const [actionError, setActionError] = useState("");
  const [passwordError, setPasswordError] = useState<Error | null>(null);
  const [userEditError, setUserEditError] = useState<Error | null>(null);
  const [createForm, setCreateForm] = useState({
    username: "",
    password: "",
    name: "",
    role: "viewOnly" as UserRole,
    barangayId: null as number | null,
  });
  const [createPhotoFile, setCreatePhotoFile] = useState<File | null>(null);
  const [createPhotoUrl, setCreatePhotoUrl] = useState<string | null>(null);
  const [createPhotoInputKey, setCreatePhotoInputKey] = useState<number>(0);

  const [modalUser, setModalUser] = useState<AdminUserRow | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [passwordUser, setPasswordUser] = useState<AdminUserRow | null>(null);

  // Helper function to convert Buffer photo to data URL (from SeniorForm.tsx)
  const resolvePhotoToUrl = async (photo: any): Promise<string | null> => {
    if (!photo) {
      return null;
    }

    // If it's already a string (URL or file path), return it
    if (typeof photo === "string") {
      // If it's a file path, we might need to construct a full URL
      if (photo.startsWith("http") || photo.startsWith("data:")) {
        return photo;
      } else {
        // Assume it's a file path, construct URL
        return `http://localhost:8000/${photo}`;
      }
    }

    if (
      photo &&
      typeof photo === "object" &&
      (photo.type === "Buffer" || Array.isArray(photo.data))
    ) {
      try {
        const bytes: number[] = photo.type === "Buffer" ? photo.data : photo;
        const uint8 = new Uint8Array(bytes);
        const blob = new Blob([uint8.buffer], { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        return url;
      } catch (err) {
        console.warn("Failed to convert Buffer photo to blob URL", err);
        return null;
      }
    }

    // If it's already a Blob
    if (photo instanceof Blob) {
      return URL.createObjectURL(photo);
    }

    return null;
  };

  // Handle photo change for create form
  const handleCreatePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCreatePhotoFile(file);
      // Create preview URL for selected file
      const url = URL.createObjectURL(file);
      setCreatePhotoUrl(url);
    }
  };

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (createPhotoUrl && createPhotoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(createPhotoUrl);
      }
    };
  }, [createPhotoUrl]);

  const onCreate = async () => {
    setActionError("");
    try {
      if (!createForm.username.trim() || !createForm.password.trim() || !createForm.name.trim()) {
        throw new Error("Username, password, and name are required");
      }
      if (createForm.role === "barangay" && !createForm.barangayId) {
        throw new Error("Barangay is required for barangay role");
      }
      await createUser({ ...createForm, photo: createPhotoFile || undefined } as any, token || undefined);
      setCreateForm({ username: "", password: "", name: "", role: "viewOnly", barangayId: null });
      // Reset photo state and revoke blob URL
      if (createPhotoUrl && createPhotoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(createPhotoUrl);
      }
      setCreatePhotoFile(null);
      setCreatePhotoUrl(null);
      setCreatePhotoInputKey((k) => k + 1);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || "Failed to create user");
    }
  };

  const onSaveEdit = async (user: AdminUserRow, photoFile?: File) => {
    setUserEditError(null);
    try {
      if (!user.name.trim()) throw new Error("Name is required");
      if (user.role === "barangay" && !user.barangayId) {
        throw new Error("Barangay is required for barangay role");
      }
      await updateUser(user.id, {
        name: user.name,
        role: user.role,
        barangayId: user.role === "barangay" ? (user.barangayId ?? null) : null,
        photo: photoFile || undefined,
      } as any, token || undefined);
      await refetch();
    } catch (err: any) {
      const error = new Error(err.message || "Failed to update user");
      setUserEditError(error);
      throw error; // Re-throw so modal can handle it
    }
  };

  const onDelete = async (id: number) => {
    setActionError("");
    try {
      await deleteUser(id, token || undefined);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || "Failed to delete user");
    }
  };

  const onSavePassword = async (userId: number, password: string) => {
    setPasswordError(null);
    try {
      await updateUserPassword(userId, password, token || undefined);
      setPasswordUser(null);
    } catch (err: any) {
      const error = new Error(err.message || "Failed to update password");
      setPasswordError(error);
      throw error; // Re-throw so modal can handle it
    }
  };

  const renderActions = (row: AdminUserRow) => (
    <div className="d-grid gap-2">
      <button className="btn btn-info btn-sm w-100" onClick={() => { setModalUser(row); setModalMode("view"); }}>View</button>
      <button className="btn btn-secondary btn-sm w-100" onClick={() => { setModalUser(row); setModalMode("edit"); }}>Edit</button>
      <button className="btn btn-warning btn-sm w-100" onClick={() => setPasswordUser(row)}>Set Password</button>
      <button className="btn btn-danger btn-sm w-100" onClick={() => onDelete(row.id)}>Delete</button>
    </div>
  );

  // Lightweight cell component to render photo thumbnails
  function UserPhotoCell({ value, resolver }: { value: any; resolver: (v: any) => Promise<string | null> }) {
    const [url, setUrl] = useState<string | null>(null);
    useEffect(() => {
      let active = true;
      (async () => {
        const u = await resolver(value);
        if (!active) return;
        setUrl(u);
      })();
      return () => {
        active = false;
        if (url && url.startsWith("blob:")) {
          try { URL.revokeObjectURL(url); } catch {}
        }
      };
    }, [value]);
    if (!url) return <span className="text-muted">—</span> as any;
    return (
      <img
        src={url}
        alt="User"
        style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    ) as any;
  }

  return (
    <section>
      <div className="container p-4 card mb-3">
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label">Username</label>
            <input className="form-control" value={createForm.username} onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Name</label>
            <input className="form-control" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Role</label>
            <select className="form-select" value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as UserRole })}>
              {ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Barangay</label>
            <select
              className="form-select"
              value={createForm.barangayId === null ? "" : String(createForm.barangayId)}
              onChange={(e) => setCreateForm({ ...createForm, barangayId: e.target.value ? Number(e.target.value) : null })}
              disabled={createForm.role !== "barangay"}
            >
              <option value="">— None —</option>
              {barangays.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Photo</label>
            <input
              key={createPhotoInputKey}
              type="file"
              className="form-control"
              accept="image/png, image/jpeg"
              onChange={handleCreatePhotoChange}
            />
            <div className="form-text">
              Only JPG and PNG formats accepted.
            </div>
          </div>

          <div className="col-12">
            <div className="d-grid">
              <button className="btn btn-primary" onClick={onCreate}>Add User</button>
            </div>
          </div>
        </div>
      </div>

      {actionError && (
        <div className="container p-1">
          <div className="alert alert-danger" role="alert">{actionError}</div>
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
          <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">{error.message}</div>
      ) : (
        <DataTable<AdminUserRow>
          title="Users"
          data={rows}
          columns={columns as any}
          searchableField="username"
          renderActions={renderActions}
        />
      )}

      <UserModal
        show={!!modalUser}
        mode={modalMode}
        user={modalUser}
        barangays={barangays}
        onHide={() => {
          setModalUser(null);
          setModalMode("view");
          setUserEditError(null);
        }}
        onSave={modalMode === "edit" ? onSaveEdit : undefined}
        resolvePhotoToUrl={resolvePhotoToUrl}
        error={userEditError}
      />

      <PasswordModal
        show={!!passwordUser}
        user={passwordUser}
        onHide={() => {
          setPasswordUser(null);
          setPasswordError(null);
        }}
        onSave={onSavePassword}
        error={passwordError}
      />
    </section>
  );
}


