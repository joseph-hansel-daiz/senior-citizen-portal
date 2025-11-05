import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export interface SeniorAssistanceRow {
  id: number;
  seniorId: number;
  assistanceId: number;
  assistanceDate: string | null;
  Assistance?: { id: number; name: string };
}

export function useSeniorAssistances(seniorId: number | null) {
  const { token } = useAuth();
  const [data, setData] = useState<SeniorAssistanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/senior-assistances/${id}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch senior assistances");
      const json: SeniorAssistanceRow[] = await res.json();
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

export async function upsertSeniorAssistance(payload: { id?: number; seniorId: number; assistanceId: number; assistanceDate: string | null; }, token?: string) {
  const res = await fetch(`http://localhost:8000/senior-assistances/${payload.seniorId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ id: payload.id, assistanceId: payload.assistanceId, assistanceDate: payload.assistanceDate }),
    }
  );
  if (!res.ok) throw new Error("Failed to save assistance");
  return res.json();
}

export async function deleteSeniorAssistance(seniorId: number, recordId: number, token?: string) {
  const res = await fetch(`http://localhost:8000/senior-assistances/${seniorId}/${recordId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error("Failed to delete assistance");
  return res.json();
}


