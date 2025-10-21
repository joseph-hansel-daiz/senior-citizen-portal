import { useState } from "react";

export function useApproveSenior() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const approveSenior = async (
    id: number,
    params: { oscaId: string; note?: string }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/seniors/${id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        let msg = `HTTP error! status: ${response.status}`;
        try {
          const err = await response.json();
          msg = err.message || msg;
        } catch {}
        throw new Error(msg);
      }

      return await response.json();
    } catch (err) {
      const e = err as Error;
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { approveSenior, loading, error };
}

