import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Option {
  id: number;
  name: string;
}

export function useOptions(endpoint: string) {
  const { token } = useAuth();
  const [data, setData] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/options/${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
      const json: Option[] = await res.json();
      setData(json);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`http://localhost:8000/options/${endpoint}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
        const json: Option[] = await res.json();
        if (active) setData(json);
      } catch (err) {
        if (active) setError(err as Error);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [endpoint]);

  return { data, loading, error, refetch: fetchAll };
}

export async function createOption(endpoint: string, name: string, token?: string) {
  const res = await fetch(`http://localhost:8000/options/${endpoint}`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data && (data.error || data.message)) || `Failed to create ${endpoint}`);
  }
  return res.json();
}

export async function updateOption(endpoint: string, id: number, name: string, token?: string) {
  const res = await fetch(`http://localhost:8000/options/${endpoint}/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data && (data.error || data.message)) || `Failed to update ${endpoint}`);
  }
  return res.json();
}

export async function deleteOption(endpoint: string, id: number, token?: string) {
  const res = await fetch(`http://localhost:8000/options/${endpoint}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data && (data.error || data.message)) || `Failed to delete ${endpoint}`);
  }
}
