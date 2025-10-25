import { useEffect, useState } from "react";
import { SeniorCitizen } from "@/types/senior-citizen.types";
import { useAuth } from "@/context/AuthContext";

export function useSeniors() {
  const { token } = useAuth();
  const [data, setData] = useState<SeniorCitizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/seniors`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch seniors`);
        const json: SeniorCitizen[] = await res.json();
        if (active) setData(json);
      } catch (err) {
        if (active) setError(err as Error);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();

    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}
