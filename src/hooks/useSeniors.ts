import { useEffect, useState } from "react";

interface SeniorCitizen {
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
}

export function useSeniors() {
  const [data, setData] = useState<SeniorCitizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/seniors`);
        if (!res.ok) throw new Error(`Failed to fetch seniors`);
        const json: SeniorCitizen[] = await res.json();
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
  }, []);

  return { data, loading, error };
}
