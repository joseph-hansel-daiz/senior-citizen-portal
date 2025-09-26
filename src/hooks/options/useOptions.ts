import { useEffect, useState } from "react";

interface Option {
  id: number;
  name: string;
}

export function useOptions(endpoint: string) {
  const [data, setData] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/options/${endpoint}`);
        if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
        const json: Option[] = await res.json();
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
  }, [endpoint]);

  return { data, loading, error };
}
