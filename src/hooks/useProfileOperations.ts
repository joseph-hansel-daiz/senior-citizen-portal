import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

type ProfileShape = {
  id?: number;
  username?: string;
  name?: string;
  role?: string;
  barangayId?: number | null;
  photo?: any;
};

type UseProfileOperationsReturn = {
  profile: ProfileShape | null;
  loading: boolean;
  saving: boolean;
  error: string;
  success: string;
  fetchProfile: () => Promise<void>;
  updateProfile: (name: string, photo?: File | Blob | string | null) => Promise<{ success: boolean; error?: string }>;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
};

export const useProfileOperations = (): UseProfileOperationsReturn => {
  const { user, token, login } = useAuth();
  const [profile, setProfile] = useState<ProfileShape | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setProfile(user);
    }
    fetchProfile();
  }, []);

  const fetchProfile = async (): Promise<void> => {
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

  const updateProfile = async (name: string, photo?: File | Blob | string | null): Promise<{ success: boolean; error?: string }> => {
    setSaving(true);
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name cannot be empty");
      setSaving(false);
      return { success: false, error: "Name cannot be empty" };
    }

    try {
      let res: Response;
      const endpoint = "http://localhost:8000/users/me";
      if (photo) {
        const formData = new FormData();
        formData.append("data", JSON.stringify({ name: name.trim() }));
        if (typeof photo === "string") {
          // If caller passed a data URL string, send as part of JSON (backend also supports base64)
          // But since we chose multipart, try to convert data URL to Blob
          try {
            const m = photo.match(/^data:(.*?);base64,(.*)$/);
            if (m) {
              const bstr = atob(m[2]);
              const n = bstr.length;
              const u8 = new Uint8Array(n);
              for (let i = 0; i < n; i++) u8[i] = bstr.charCodeAt(i);
              formData.append("photo", new Blob([u8], { type: m[1] }), "photo");
            }
          } catch {}
        } else {
          formData.append("photo", photo, (photo as File).name || "photo");
        }
        res = await fetch(endpoint, {
          method: "PUT",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        });
      } else {
        res = await fetch(endpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ name: name.trim() }),
        });
      }

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          (payload && (payload.message || payload.error)) ||
          `Update failed (${res.status})`;
        setError(msg);
        return { success: false, error: msg };
      }

      await fetchProfile();
      setSuccess("Profile updated successfully.");
      return { success: true };
    } catch (err: any) {
      console.error("updateProfile error", err);
      const errorMsg = err.message || "Network error while updating profile";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    error,
    success,
    fetchProfile,
    updateProfile,
    setError,
    setSuccess,
  };
};
