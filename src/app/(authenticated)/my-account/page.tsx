"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, login, logout } = useAuth();

  const [profile, setProfile] = useState<{
    id?: number;
    username?: string;
    name?: string;
    role?: string;
    barangayId?: number | null;
  } | null>(null);

  const [nameInput, setNameInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setProfile(user);
      setNameInput(user.name || "");
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(
          (payload && (payload.message || payload.error)) ||
            `GET /users/me failed (${res.status})`
        );
      }

      const data = await res.json();
      setProfile(data);
      setNameInput(data.name || "");

      if (token) {
        const ctxUser = {
          id: Number(data.id),
          username: data.username,
          name: data.name,
          role: data.role,
          barangayId: data.barangayId === null ? null : Number(data.barangayId),
        };
        login(ctxUser, token);
      }
    } catch (err: any) {
      console.error("fetchProfile error", err);
      setError(err.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nameInput.trim()) {
      setError("Name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("http://localhost:8000/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: nameInput.trim() }),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          (payload && (payload.message || payload.error)) ||
          `Update failed (${res.status})`;
        setError(msg);
        return;
      }

      const updated = payload;
      setProfile(updated);
      setSuccess("Profile updated successfully.");

      if (token) {
        const ctxUser = {
          id: Number(updated.id),
          username: updated.username,
          name: updated.name,
          role: updated.role,
          barangayId:
            updated.barangayId === null ? null : Number(updated.barangayId),
        };
        login(ctxUser, token);
      }
    } catch (err: any) {
      console.error("updateProfile error", err);
      setError(err.message || "Network error while updating profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="pt-4">
      <div className="container">
        <h1 className="h3 mb-4">My Profile</h1>

        {loading ? (
          <div className="card p-4">Loading profile...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="card p-4">
            <div className="mb-3">
              <small className="text-muted d-block">Username</small>
              <strong>{profile?.username || "—"}</strong>
            </div>

            <div className="mb-3">
              <small className="text-muted d-block">Role</small>
              <strong>{profile?.role || "—"}</strong>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="form-control"
                  placeholder="Your full name"
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setNameInput(profile?.name || "");
                    setError("");
                    setSuccess("");
                  }}
                >
                  Reset
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger ms-auto"
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                >
                  Sign out
                </button>
              </div>

              {success && (
                <div className="alert alert-success mt-3">{success}</div>
              )}
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
