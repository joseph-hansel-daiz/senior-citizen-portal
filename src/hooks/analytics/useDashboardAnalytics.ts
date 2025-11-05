import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export type GenderDistributionItem = { sexAtBirth: string; count: number };
export type AgeDemographicsItem = { bucket: string; count: number };
export type AssistanceTotalsItem = { assistanceId: number; name: string; count: number };
export type VaccineCoverageItem = { vaccineId: number; name: string; count: number };

export function useDashboardAnalytics() {
  const { token } = useAuth();
  const [gender, setGender] = useState<GenderDistributionItem[]>([]);
  const [ages, setAges] = useState<AgeDemographicsItem[]>([]);
  const [assistances, setAssistances] = useState<AssistanceTotalsItem[]>([]);
  const [vaccines, setVaccines] = useState<VaccineCoverageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const [g, a, as, v] = await Promise.all([
          fetch("http://localhost:8000/analytics/gender-distribution", { headers }),
          fetch("http://localhost:8000/analytics/age-demographics", { headers }),
          fetch("http://localhost:8000/analytics/assistance", { headers }),
          fetch("http://localhost:8000/analytics/vaccines", { headers }),
        ]);
        if (!g.ok || !a.ok || !as.ok || !v.ok) throw new Error("Failed to load analytics");
        const [gj, aj, asj, vj] = await Promise.all([g.json(), a.json(), as.json(), v.json()]);
        if (cancelled) return;
        setGender(gj);
        setAges(aj);
        setAssistances(asj);
        setVaccines(vj);
      } catch (e) {
        if (!cancelled) setError(e as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const totals = useMemo(() => {
    const genderTotal = gender.reduce((s, i) => s + i.count, 0);
    const ageTotal = ages.reduce((s, i) => s + i.count, 0);
    return { genderTotal, ageTotal };
  }, [gender, ages]);

  return { gender, ages, assistances, vaccines, totals, loading, error };
}


