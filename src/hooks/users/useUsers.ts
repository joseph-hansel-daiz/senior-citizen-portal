import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export type UserRole = "admin" | "barangay" | "osca" | "viewOnly";

export interface AdminUserRow {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  barangayId: number | null;
}

export function useUsers() {
  const { token } = useAuth();
  const [data, setData] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/users", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const json: AdminUserRow[] = await res.json();
      setData(json);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { data, loading, error, refetch: fetchAll };
}

export async function createUser(payload: {
  username: string;
  password: string;
  name: string;
  role?: UserRole;
  barangayId?: number | null;
}, token?: string) {
  const res = await fetch("http://localhost:8000/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data && (data.message || data.error)) || "Create user failed");
  }
  return data;
}

export async function updateUser(userId: number, payload: {
  name?: string;
  role?: UserRole;
  barangayId?: number | null;
}, token?: string) {
  const res = await fetch(`http://localhost:8000/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data && (data.message || data.error)) || "Update user failed");
  }
  return data as AdminUserRow;
}

export async function deleteUser(userId: number, token?: string) {
  const res = await fetch(`http://localhost:8000/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data && (data.message || data.error)) || "Delete user failed");
  }
  return data as { success: boolean };
}

export async function updateUserPassword(userId: number, password: string, token?: string) {
  const res = await fetch(`http://localhost:8000/users/${userId}/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data && (data.message || data.error)) || "Update password failed");
  }
  return data as { success: boolean };
}


