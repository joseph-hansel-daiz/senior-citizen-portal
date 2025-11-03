"use client";

import { useEffect, useMemo, useState } from "react";
import DataTable from "@/components/DataTable";
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
  const [createForm, setCreateForm] = useState({
    username: "",
    password: "",
    name: "",
    role: "viewOnly" as UserRole,
    barangayId: null as number | null,
  });

  const [editUser, setEditUser] = useState<AdminUserRow | null>(null);
  const [passwordUser, setPasswordUser] = useState<AdminUserRow | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const onCreate = async () => {
    setActionError("");
    try {
      if (!createForm.username.trim() || !createForm.password.trim() || !createForm.name.trim()) {
        throw new Error("Username, password, and name are required");
      }
      if (createForm.role === "barangay" && !createForm.barangayId) {
        throw new Error("Barangay is required for barangay role");
      }
      await createUser(createForm, token || undefined);
      setCreateForm({ username: "", password: "", name: "", role: "viewOnly", barangayId: null });
      await refetch();
    } catch (err: any) {
      setActionError(err.message || "Failed to create user");
    }
  };

  const onSaveEdit = async () => {
    if (!editUser) return;
    setActionError("");
    try {
      if (!editUser.name.trim()) throw new Error("Name is required");
      if (editUser.role === "barangay" && !editUser.barangayId) {
        throw new Error("Barangay is required for barangay role");
      }
      await updateUser(editUser.id, {
        name: editUser.name,
        role: editUser.role,
        barangayId: editUser.role === "barangay" ? (editUser.barangayId ?? null) : null,
      }, token || undefined);
      setEditUser(null);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || "Failed to update user");
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

  const onSavePassword = async () => {
    if (!passwordUser) return;
    setActionError("");
    try {
      if (!newPassword.trim()) throw new Error("Password is required");
      await updateUserPassword(passwordUser.id, newPassword.trim(), token || undefined);
      setNewPassword("");
      setPasswordUser(null);
    } catch (err: any) {
      setActionError(err.message || "Failed to update password");
    }
  };

  const renderActions = (row: AdminUserRow) => (
    <div className="d-grid gap-2">
      <button className="btn btn-secondary btn-sm w-100" onClick={() => setEditUser(row)}>Edit</button>
      <button className="btn btn-warning btn-sm w-100" onClick={() => { setPasswordUser(row); setNewPassword(""); }}>Set Password</button>
      <button className="btn btn-danger btn-sm w-100" onClick={() => onDelete(row.id)}>Delete</button>
    </div>
  );

  return (
    <section>
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-end mb-3">
        <div className="flex-grow-1" style={{ minWidth: 320 }}>
          <div className="row g-2">
            <div className="col-md-3">
              <label className="form-label">Username</label>
              <input className="form-control" value={createForm.username} onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Name</label>
              <input className="form-control" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Role</label>
              <select className="form-select" value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as UserRole })}>
                {ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
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
          </div>
        </div>
        <button className="btn btn-primary" onClick={onCreate}>Add User</button>
      </div>

      {actionError && (
        <div className="alert alert-danger" role="alert">{actionError}</div>
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

      {editUser && (
        <div className="modal d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={() => setEditUser(null)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input className="form-control" value={editUser.name} onChange={(e) => setEditUser({ ...(editUser as AdminUserRow), name: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select className="form-select" value={editUser.role} onChange={(e) => setEditUser({ ...(editUser as AdminUserRow), role: e.target.value as UserRole })}>
                    {ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Barangay</label>
                  <select
                    className="form-select"
                    value={editUser.barangayId === null ? "" : String(editUser.barangayId)}
                    onChange={(e) => setEditUser({ ...(editUser as AdminUserRow), barangayId: e.target.value ? Number(e.target.value) : null })}
                    disabled={editUser.role !== "barangay"}
                  >
                    <option value="">— None —</option>
                    {barangays.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditUser(null)}>Close</button>
                <button className="btn btn-primary" onClick={onSaveEdit}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {passwordUser && (
        <div className="modal d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Set Password for {passwordUser.username}</h5>
                <button type="button" className="btn-close" onClick={() => setPasswordUser(null)} />
              </div>
              <div className="modal-body">
                <label className="form-label">New Password</label>
                <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setPasswordUser(null)}>Close</button>
                <button className="btn btn-primary" onClick={onSavePassword}>Save Password</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


