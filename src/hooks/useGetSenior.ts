import { useState, useEffect } from "react";
import { SeniorCitizen } from "@/types/senior-citizen.types";

export function useGetSenior(id: number | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<SeniorCitizen | null>(null);

  const fetchSenior = async (seniorId: number) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`http://localhost:8000/seniors/${seniorId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSenior(id);
    }
  }, [id]);

  return {
    senior: data,
    loading,
    error,
    refetch: () => id ? fetchSenior(id) : Promise.resolve(),
  };
}
