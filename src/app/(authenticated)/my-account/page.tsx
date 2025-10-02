"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // update import if needed

type ProfileShape = {
  id?: number;
  username?: string;
  name?: string;
  role?: string;
  barangayId?: number | null;
  logo?: { type: "Buffer"; data: number[] } | null;
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, login, logout } = useAuth();

  const [profile, setProfile] = useState<ProfileShape | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [nameInput, setNameInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resolveLogoToUrl = async (logo: any): Promise<string | null> => {
    if (!logo) return null;

    if (
      logo &&
      typeof logo === "object" &&
      (logo.type === "Buffer" || Array.isArray(logo.data))
    ) {
      try {
        const bytes: number[] = logo.type === "Buffer" ? logo.data : logo;
        const uint8 = new Uint8Array(bytes);
        const blob = new Blob([uint8.buffer], { type: "image/png" });
        const url = URL.createObjectURL(blob);
        return url;
      } catch (err) {
        console.warn("Failed to convert Buffer logo to blob URL", err);
        return null;
      }
    }

    return null;
  };

  useEffect(() => {
    return () => {
      if (logoUrl && logoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, [logoUrl]);

  useEffect(() => {
    if (user) {
      setProfile(user);
      setNameInput(user.name || "");
    }
    fetchProfile();
  }, []);

  // whenever profile.logo changes, resolve it to a URL
  useEffect(() => {
    let active = true;
    (async () => {
      if (!profile?.logo) {
        setLogoUrl(null);
        return;
      }

      // revoke previous if blob
      if (logoUrl && logoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(logoUrl);
      }

      const url = await resolveLogoToUrl(profile.logo);
      if (!active) {
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
        return;
      }
      setLogoUrl(url);
    })();

    return () => {
      active = false;
    };
  }, [profile?.logo]);

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
          logo: data.logo
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

      fetchProfile();
      setSuccess("Profile updated successfully.");
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
            <div className="row g-3 align-items-center mb-3">
              <div className="col-auto">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="img-thumbnail"
                    style={{ width: 150, height: 150, objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center border rounded"
                    style={{ width: 150, height: 150 }}
                  >
                    <span className="text-muted">No logo</span>
                  </div>
                )}
              </div>

              <div className="col">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <input
                      value={profile?.role || "—"}
                      className="form-control"
                      placeholder="Your role"
                      disabled
                    />
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
                      {saving ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden
                          />
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
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
                  </div>

                  {success && (
                    <div className="alert alert-success mt-3">{success}</div>
                  )}
                  {error && (
                    <div className="alert alert-danger mt-3">{error}</div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
