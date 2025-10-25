"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useProfileOperations } from "@/hooks/useProfileOperations";

type ProfileShape = {
  id?: number;
  username?: string;
  name?: string;
  role?: string;
  barangayId?: number | null;
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, login, logout } = useAuth();
  const {
    profile,
    loading,
    saving,
    error,
    success,
    updateProfile,
    setError,
    setSuccess,
  } = useProfileOperations();

  const [nameInput, setNameInput] = useState("");



  // Initialize name input when profile is loaded
  React.useEffect(() => {
    if (profile) {
      setNameInput(profile.name || "");
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nameInput.trim()) {
      setError("Name cannot be empty");
      return;
    }

    const result = await updateProfile(nameInput);
    
    if (!result.success) {
      setError(result.error || "Failed to update profile");
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
