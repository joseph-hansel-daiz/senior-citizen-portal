"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getApiUrl } from "@/lib/api";

export type AnalyticsMetricKey =
  | "gender-distribution"
  | "age-demographics"
  | "assistance"
  | "vaccines"
  | "users-per-role"
  | "users-per-barangay"
  | "dead-alive-count";

export interface SelectedSegment {
  metric: AnalyticsMetricKey;
  label: string;
  filters: Record<string, string | number | undefined>;
}

interface AnalyticsDetailModalProps {
  isOpen: boolean;
  segment: SelectedSegment | null;
  onClose: () => void;
}

type DetailRow = Record<string, unknown>;

function buildEndpoint(segment: SelectedSegment | null): string | null {
  if (!segment) return null;

  const params = new URLSearchParams();
  Object.entries(segment.filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  switch (segment.metric) {
    case "gender-distribution":
      return getApiUrl(
        `analytics/gender-distribution/details?${params.toString()}`
      );
    case "age-demographics":
      return getApiUrl(
        `analytics/age-demographics/details?${params.toString()}`
      );
    case "assistance":
      return getApiUrl(`analytics/assistance/details?${params.toString()}`);
    case "vaccines":
      return getApiUrl(`analytics/vaccines/details?${params.toString()}`);
    case "users-per-role":
      return getApiUrl(`analytics/users-per-role/details?${params.toString()}`);
    case "users-per-barangay":
      return getApiUrl(
        `analytics/users-per-barangay/details?${params.toString()}`
      );
    case "dead-alive-count":
      return getApiUrl(
        `analytics/dead-alive-count/details?${params.toString()}`
      );
    default:
      return null;
  }
}

function buildTitle(segment: SelectedSegment | null): string {
  if (!segment) return "";
  const baseMap: Record<AnalyticsMetricKey, string> = {
    "gender-distribution": "Gender Distribution",
    "age-demographics": "Age Demographics",
    assistance: "Assistance Received",
    vaccines: "Vaccination Coverage",
    "users-per-role": "Users Per Role",
    "users-per-barangay": "Users Per Barangay",
    "dead-alive-count": "Active/Deceased Distribution",
  };
  const base = baseMap[segment.metric] ?? "Details";
  return `${base} – ${segment.label}`;
}

function columnsForMetric(
  metric: AnalyticsMetricKey
): { key: string; label: string }[] {
  switch (metric) {
    case "gender-distribution":
      return [
        { key: "fullName", label: "Full Name" },
        { key: "sexAtBirth", label: "Sex at Birth" },
        { key: "age", label: "Age" },
        { key: "barangayName", label: "Barangay" },
      ];
    case "age-demographics":
      return [
        { key: "fullName", label: "Full Name" },
        { key: "age", label: "Age" },
        { key: "barangayName", label: "Barangay" },
      ];
    case "assistance":
      return [
        { key: "fullName", label: "Full Name" },
        { key: "age", label: "Age" },
        { key: "barangayName", label: "Barangay" },
        { key: "assistanceName", label: "Assistance" },
        { key: "assistanceDate", label: "Date" },
      ];
    case "vaccines":
      return [
        { key: "fullName", label: "Full Name" },
        { key: "age", label: "Age" },
        { key: "barangayName", label: "Barangay" },
        { key: "vaccineName", label: "Vaccine" },
        { key: "vaccineDate", label: "Latest vaccination date" },
      ];
    case "users-per-role":
    case "users-per-barangay":
      return [
        { key: "fullName", label: "Full Name" },
        { key: "role", label: "Role" },
        { key: "barangayName", label: "Barangay" },
      ];
    case "dead-alive-count":
      return [
        { key: "fullName", label: "Full Name" },
        { key: "status", label: "Status" },
        { key: "age", label: "Age" },
        { key: "barangayName", label: "Barangay" },
      ];
    default:
      return [];
  }
}

export function AnalyticsDetailModal({
  isOpen,
  segment,
  onClose,
}: AnalyticsDetailModalProps) {
  const { token } = useAuth();
  const [rows, setRows] = useState<DetailRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endpoint = useMemo(() => buildEndpoint(segment), [segment]);
  const title = useMemo(() => buildTitle(segment), [segment]);
  const columns = useMemo(
    () => (segment ? columnsForMetric(segment.metric) : []),
    [segment]
  );

  useEffect(() => {
    if (!isOpen || !endpoint || !segment) {
      return;
    }

    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const res = await fetch(endpoint, { headers });
        if (!res.ok) {
          throw new Error("Failed to load details");
        }
        const data = (await res.json()) as DetailRow[];
        if (!cancelled) {
          setRows(data);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || "Failed to load details");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    run();

    return () => {
      cancelled = true;
    };
  }, [isOpen, endpoint, segment, token]);

  if (!isOpen || !segment) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {loading && <p>Loading...</p>}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {!loading && !error && rows.length === 0 && (
              <p className="text-muted mb-0">No records for this segment.</p>
            )}
            {!loading && !error && rows.length > 0 && (
              <div className="table-responsive">
                <table className="table table-sm table-striped mb-0">
                  <thead>
                    <tr>
                      {columns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr key={idx}>
                        {columns.map((col) => (
                          <td key={col.key}>
                            {row[col.key] !== null &&
                            row[col.key] !== undefined
                              ? String(row[col.key])
                              : "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDetailModal;

