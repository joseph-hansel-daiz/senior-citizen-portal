import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export type GenderDistributionItem = { sexAtBirth: string; count: number };
export type AgeDemographicsItem = { bucket: string; count: number };
export type AssistanceTotalsItem = { assistanceId: number; name: string; count: number };
export type VaccineCoverageItem = { vaccineId: number; name: string; count: number };
export type UsersPerRoleItem = { role: string; count: number };
export type UsersPerBarangayItem = { barangayId: number | null; name: string; count: number };

export function useDashboardAnalytics() {
  const { token, user } = useAuth();
  const [gender, setGender] = useState<GenderDistributionItem[]>([]);
  const [ages, setAges] = useState<AgeDemographicsItem[]>([]);
  const [assistances, setAssistances] = useState<AssistanceTotalsItem[]>([]);
  const [vaccines, setVaccines] = useState<VaccineCoverageItem[]>([]);
  const [usersPerRole, setUsersPerRole] = useState<UsersPerRoleItem[]>([]);
  const [usersPerBarangay, setUsersPerBarangay] = useState<UsersPerBarangayItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const isAdmin = user?.role === "admin";

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
        const basePromises = [
          fetch("http://localhost:8000/analytics/gender-distribution", { headers }),
          fetch("http://localhost:8000/analytics/age-demographics", { headers }),
          fetch("http://localhost:8000/analytics/assistance", { headers }),
          fetch("http://localhost:8000/analytics/vaccines", { headers }),
        ];
        
        const adminPromises = isAdmin
          ? [
              fetch("http://localhost:8000/analytics/users-per-role", { headers }),
              fetch("http://localhost:8000/analytics/users-per-barangay", { headers }),
            ]
          : [];

        const allPromises = [...basePromises, ...adminPromises];
        const responses = await Promise.all(allPromises);
        
        if (!responses.every((r) => r.ok)) throw new Error("Failed to load analytics");
        
        const [gj, aj, asj, vj, ...adminData] = await Promise.all(
          responses.map((r) => r.json())
        );
        
        if (cancelled) return;
        setGender(gj);
        setAges(aj);
        setAssistances(asj);
        setVaccines(vj);
        
        if (isAdmin && adminData.length >= 2) {
          setUsersPerRole(adminData[0]);
          setUsersPerBarangay(adminData[1]);
        } else {
          setUsersPerRole([]);
          setUsersPerBarangay([]);
        }
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
  }, [token, isAdmin]);

  const totals = useMemo(() => {
    const genderTotal = gender.reduce((s, i) => s + i.count, 0);
    const ageTotal = ages.reduce((s, i) => s + i.count, 0);
    return { genderTotal, ageTotal };
  }, [gender, ages]);

  return { gender, ages, assistances, vaccines, usersPerRole, usersPerBarangay, totals, loading, error };
}


