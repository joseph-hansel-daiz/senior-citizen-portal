import { useState, useEffect } from "react";

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
  photo?: Blob | string | null;
  identifyingInformation: {
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
  };
  familyComposition: {
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
  };
  dependencyProfile: {
    cohabitants: number[];
    livingConditions: number[];
  };
  educationProfile: {
    sharedSkills: string | null;
    highestEducationalAttainments: number[];
    specializationTechnicalSkills: number[];
    communityInvolvements: number[];
  };
  economicProfile: {
    incomeAssistanceSources: number[];
    realImmovableProperties: number[];
    personalMovableProperties: number[];
    monthlyIncomes: number[];
    problemsNeedsCommonlyEncountereds: number[];
  };
  healthProfile: {
    bloodType: string | null;
    physicalDisability: string | null;
    listMedicines: string | null;
    checkUp: boolean;
    scheduleCheckUp: string | null;
    healthProblemAilments: number[];
    dentalConcerns: number[];
    visualConcerns: number[];
    auralConcerns: number[];
    socialEmotionalConcerns: number[];
    areaOfDifficulties: number[];
  };
}

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
