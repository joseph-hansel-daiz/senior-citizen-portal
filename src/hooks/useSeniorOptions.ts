import { useEffect, useState } from "react";
import { SeniorOption } from "@/types/senior-citizen.types";
import { useAuth } from "@/context/AuthContext";
import { getApiUrl } from "@/lib/api";

export type SeniorOptionsStatus = "active" | "pending" | "all";

export function useSeniorOptions(status?: SeniorOptionsStatus) {
  const { token } = useAuth();
  const [data, setData] = useState<SeniorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const url = status
          ? `${getApiUrl("seniors/options")}?status=${status}`
          : getApiUrl("seniors/options");
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch senior options");
        const json: SeniorOption[] = await res.json();
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
  }, [status]);

  return { data, loading, error };
}
