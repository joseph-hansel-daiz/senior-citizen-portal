import { useEffect, useState } from "react";

export interface SeniorVaccineRow {
  seniorId: number;
  VaccineId: number;
  lastVaccineDate: string | null;
  Vaccine?: { id: number; name: string };
}

export function useSeniorVaccines(seniorId: number | null) {
  const [data, setData] = useState<SeniorVaccineRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/senior-vaccines/${id}`);
      if (!res.ok) throw new Error("Failed to fetch senior vaccines");
      const json: SeniorVaccineRow[] = await res.json();
      setData(json);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (seniorId) {
      fetchAll(seniorId);
    } else {
      setData([]);
    }
  }, [seniorId]);

  return { data, loading, error, refetch: () => (seniorId ? fetchAll(seniorId) : Promise.resolve()) };
}

export async function upsertSeniorVaccine(payload: { seniorId: number; vaccineId: number; lastVaccineDate: string | null; }) {
  const res = await fetch(`http://localhost:8000/senior-vaccines/${payload.seniorId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vaccineId: payload.vaccineId, lastVaccineDate: payload.lastVaccineDate }),
    }
  );
  if (!res.ok) throw new Error("Failed to save vaccine");
  return res.json();
}

export async function deleteSeniorVaccine(seniorId: number, vaccineId: number) {
  const res = await fetch(`http://localhost:8000/senior-vaccines/${seniorId}/${vaccineId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete vaccine");
  return res.json();
}


