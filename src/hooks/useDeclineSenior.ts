import { useState } from "react";
import { SeniorCitizen } from "@/types/senior-citizen.types";
import { useAuth } from "@/context/AuthContext";

interface DeclineSeniorParams {
  note?: string;
}

export function useDeclineSenior() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const declineSenior = async (
    id: number,
    params: DeclineSeniorParams
  ): Promise<SeniorCitizen> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/seniors/${id}/decline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

  return { declineSenior, loading, error };
}

