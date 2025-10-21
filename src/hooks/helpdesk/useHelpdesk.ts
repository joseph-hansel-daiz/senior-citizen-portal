import { useEffect, useState } from "react";

export interface HelpdeskRecord {
  id: number;
  seniorId: number;
  helpDeskRecordCategory: number;
  details: string;
  createdAt: string;
  updatedAt: string;
  HelpDeskRecordCategory?: { id: number; name: string };
  Senior?: {
    id: number;
    IdentifyingInformation?: {
      firstname: string;
      lastname: string;
      middlename?: string;
    };
  };
}

export function useHelpdeskRecords() {
  const [data, setData] = useState<HelpdeskRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/helpdesk");
      if (!res.ok) throw new Error("Failed to fetch helpdesk records");
      const json: HelpdeskRecord[] = await res.json();
      setData(json);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { data, loading, error, refetch: fetchAll };
}

export async function createHelpdeskRecord(payload: {
  seniorId: number;
  helpDeskRecordCategory: number;
  details: string;
}) {
  const res = await fetch("http://localhost:8000/helpdesk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data && data.message) || "Failed to create helpdesk record");
  }
}

export async function updateHelpdeskRecord(id: number, payload: {
  helpDeskRecordCategory?: number;
  details?: string;
}) {
  const res = await fetch(`http://localhost:8000/helpdesk/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data && data.message) || "Failed to update helpdesk record");
  }
}

export async function deleteHelpdeskRecord(id: number) {
  const res = await fetch(`http://localhost:8000/helpdesk/${id}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data && data.message) || "Failed to delete helpdesk record");
  }
}


