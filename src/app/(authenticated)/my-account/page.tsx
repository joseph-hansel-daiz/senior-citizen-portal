"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useProfileOperations } from "@/hooks/useProfileOperations";

type ProfileShape = {
  id?: number;
  username?: string;
  name?: string;
  role?: string;
  barangayId?: number | null;
  photo?: any;
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
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);



  // Initialize name input when profile is loaded
  React.useEffect(() => {
    if (profile) {
      setNameInput(profile.name || "");
    }
  }, [profile]);

  // Resolve profile photo to URL (similar to SeniorForm.tsx)
  React.useEffect(() => {
    let active = true;
    (async () => {
      const url = await resolvePhotoToUrl((profile as any)?.photo);
      if (!active) {
        if (url && url.startsWith("blob:")) {
          try { URL.revokeObjectURL(url); } catch {}
        }
        return;
      }
      setPhotoUrl(url);
    })();
    return () => {
      active = false;
      if (photoUrl && photoUrl.startsWith("blob:")) {
        try { URL.revokeObjectURL(photoUrl); } catch {}
      }
    };
  }, [profile]);

  const resolvePhotoToUrl = async (photo: any): Promise<string | null> => {
    if (!photo) return null;
    if (typeof photo === "string") {
      if (photo.startsWith("http") || photo.startsWith("data:")) return photo;
      return `http://localhost:8000/${photo}`;
    }
    if (photo && typeof photo === "object" && (photo.type === "Buffer" || Array.isArray(photo.data))) {
      try {
        const bytes: number[] = photo.type === "Buffer" ? photo.data : photo;
        const uint8 = new Uint8Array(bytes);
        const blob = new Blob([uint8.buffer], { type: "image/jpeg" });
        return URL.createObjectURL(blob);
      } catch {
        return null;
      }
    }
    if (photo instanceof Blob) return URL.createObjectURL(photo);
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nameInput.trim()) {
      setError("Name cannot be empty");
      return;
    }

    const result = await updateProfile(nameInput, photoFile || undefined);
    
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
            <div className="row g-3 align-items-start mb-3">
              <div className="col-12 col-md-8">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <input
                      value={profile?.role || "—"}
                      className="form-control"
                      placeholder="Your role"
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="form-control"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Photo</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="form-control"
                      accept="image/png, image/jpeg"
                      onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                      disabled={saving}
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
                        setPhotoFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
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
              <div className="col-12 col-md-4">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Profile"
                    className="img-thumbnail"
                    style={{ maxWidth: 200, maxHeight: 200, objectFit: "cover" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="text-muted">No Photo</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
