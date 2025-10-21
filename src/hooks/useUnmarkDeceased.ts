import { useState } from "react";

export function useUnmarkDeceased() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const unmarkDeceased = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/seniors/${id}/unmark-deceased`, {
        method: "DELETE",
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

  return { unmarkDeceased, loading, error };
}

