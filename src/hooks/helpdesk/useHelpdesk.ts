import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

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
    barangayId: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    createdBy: number | null;
    updatedBy: number | null;
    deletedBy: number | null;
    Barangay?: {
      id: number;
      name: string;
    };
    creator?: {
      id: number;
      name: string;
      username: string;
      role: string;
    };
    updater?: {
      id: number;
      name: string;
      username: string;
      role: string;
    };
    deleter?: {
      id: number;
      name: string;
      username: string;
      role: string;
    };
    IdentifyingInformation?: {
      seniorId: number;
      picture: string | null;
      lastname: string;
      firstname: string;
      middlename: string;
      extension: string;
      region: string;
      province: string;
      city: string;
      barangay: string;
      residence: string;
      street: string;
      birthDate: string;
      birthPlace: string;
      maritalStatus: string;
      religion: string;
      sexAtBirth: string;
      contactNumber: string;
      emailAddress: string;
      fbMessengerName: string;
      ethnicOrigin: string;
      languageSpoken: string;
      oscaIdNo: string;
      gsisSssNo: string;
      tin: string;
      philhealthNo: string;
      scAssociationIdNo: string;
      otherGovIdNo: string;
      employmentBusiness: string;
      hasPension: boolean;
      pensionList: string;
      capabilityToTravel: boolean;
      createdBy: number;
      updatedBy: number | null;
    };
    FamilyComposition?: {
      seniorId: number;
      spouseLastname: string | null;
      spouseFirstname: string | null;
      spouseMiddlename: string | null;
      spouseExtension: string | null;
      fatherLastname: string | null;
      fatherFirstname: string | null;
      fatherMiddlename: string | null;
      fatherExtension: string | null;
      motherLastname: string | null;
      motherFirstname: string | null;
      motherMiddlename: string | null;
      createdBy: number;
      updatedBy: number | null;
    };
    DependencyProfile?: {
      seniorId: number;
      createdBy: number;
      updatedBy: number | null;
      Cohabitants?: Array<{
        id: number;
        name: string;
      }>;
      LivingConditions?: Array<{
        id: number;
        name: string;
      }>;
    };
    EducationProfile?: any;
    EconomicProfile?: any;
    HealthProfile?: any;
    DeathInfo?: any;
    SeniorStatusHistories?: any[];
    HelpDeskRecords?: any[];
    Children?: any[];
    Dependents?: any[];
  };
}

export function useHelpdeskRecords() {
  const { token } = useAuth();
  const [data, setData] = useState<HelpdeskRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/helpdesk", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
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
}, token?: string) {
  const res = await fetch("http://localhost:8000/helpdesk", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
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
}, token?: string) {
  const res = await fetch(`http://localhost:8000/helpdesk/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data && data.message) || "Failed to update helpdesk record");
  }
}

export async function deleteHelpdeskRecord(id: number, token?: string) {
  const res = await fetch(`http://localhost:8000/helpdesk/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data && data.message) || "Failed to delete helpdesk record");
  }
}


