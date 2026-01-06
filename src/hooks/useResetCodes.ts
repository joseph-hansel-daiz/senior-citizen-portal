import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/api";

export interface ResetCodeRow {
  id: number;
  userId: number;
  code: string;
  username: string | null;
  userName: string | null;
  createdAt: string;
}

export function useResetCodes() {
  const { token } = useAuth();
  const [data, setData] = useState<ResetCodeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(getApiUrl("auth/reset-codes"), {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch reset codes");
      const json: ResetCodeRow[] = await res.json();
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

