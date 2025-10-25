import { useState } from "react";
import { SeniorCitizen } from "@/types/senior-citizen.types";

interface MarkDeceasedParams {
  dateOfDeath: string;
  deathCertificate?: File | null;
}

export function useMarkDeceased() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const markDeceased = async (
    id: number,
    params: MarkDeceasedParams
  ): Promise<SeniorCitizen> => {
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("dateOfDeath", params.dateOfDeath);
      if (params.deathCertificate) {
        form.append("deathCertificate", params.deathCertificate);
      }

      const response = await fetch(`http://localhost:8000/seniors/${id}/mark-deceased`, {
        method: "POST",
        body: form,
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

  return { markDeceased, loading, error };
}


