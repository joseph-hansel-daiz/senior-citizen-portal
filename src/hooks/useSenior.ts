import { useEffect, useState } from "react";
import { SeniorCitizen } from "@/types/senior-citizen.types";

export function useSenior(seniorId: number | null) {
  const [data, setData] = useState<SeniorCitizen | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!seniorId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8000/seniors/${seniorId}`);
        if (!res.ok) throw new Error(`Failed to fetch senior`);
        const json = await res.json();
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
  }, [seniorId]);

  return { data, loading, error, refetch: () => {
    if (seniorId) {
      setLoading(true);
      setError(null);
      fetch(`http://localhost:8000/seniors/${seniorId}`)
        .then(res => {
          if (!res.ok) throw new Error(`Failed to fetch senior`);
          return res.json();
        })
        .then(json => setData(json))
        .catch(err => setError(err as Error))
        .finally(() => setLoading(false));
    }
  } };
}

