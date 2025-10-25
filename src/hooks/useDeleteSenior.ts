import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function useDeleteSenior() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteSenior = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/seniors/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        let msg = `HTTP error! status: ${response.status}`;
        try {
          const err = await response.json();
          msg = err.message || msg;
        } catch {}
        throw new Error(msg);
      }

      return true;
    } catch (err) {
      const e = err as Error;
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { deleteSenior, loading, error };
}


