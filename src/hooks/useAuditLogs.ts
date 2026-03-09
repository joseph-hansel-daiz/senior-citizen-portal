import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/api";

export interface AuditLogActor {
  id: number;
  username: string;
  name: string;
  role: string;
}

export interface AuditLogSenior {
  id: number;
  barangayId: number;
}

export interface AuditLogRow {
  id: number;
  actorId: number | null;
  action: string;
  entityType: string;
  entityId: number | null;
  seniorId: number | null;
  metadata: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  actor: AuditLogActor | null;
  senior: AuditLogSenior | null;
}

export interface AuditLogListResponse {
  total: number;
  limit: number;
  offset: number;
  items: AuditLogRow[];
}

export interface AuditLogFilters {
  actorId?: number;
  seniorId?: number;
}

export function useAuditLogs(initialFilters?: AuditLogFilters) {
  const { token } = useAuth();
  const [data, setData] = useState<AuditLogRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = async (filters?: AuditLogFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      const allFilters = { ...(initialFilters || {}), ...(filters || {}) };
      if (allFilters.actorId != null) {
        params.append("actorId", String(allFilters.actorId));
      }
      if (allFilters.seniorId != null) {
        params.append("seniorId", String(allFilters.seniorId));
      }

      const url =
        params.toString().length > 0
          ? getApiUrl(`audit-logs?${params.toString()}`)
          : getApiUrl("audit-logs");

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch audit logs");
      }
      const json: AuditLogListResponse = await res.json();
      setData(json.items);
      setTotal(json.total);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return { data, total, loading, error, refetch: fetchAll };
}

