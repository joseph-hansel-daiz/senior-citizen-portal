"use client";

import {
  useAreaOfDifficulties,
  useAuralConcerns,
  useBarangays,
  useCohabitants,
  useCommunityInvolvements,
  useDentalConcerns,
  useEducationalAttainments,
  useHealthProblems,
  useIncomeSources,
  useLivingConditions,
  useMonthlyIncomes,
  usePersonalProperties,
  useProblemsNeeds,
  useRealProperties,
  useSocialEmotionalConcerns,
  useTechnicalSkills,
  useVisualConcerns,
} from "@/hooks/options";
import { useSenior } from "@/hooks/useSenior";
import { SeniorCitizen as SeniorCitizenType, SeniorCitizenCreateInput, SeniorCitizenUpdateInput } from "@/types/senior-citizen.types";

// Form-specific interface for the local form state
export interface SeniorCitizenForm {
  picture: Blob | null;
  lastName: string;
  firstName: string;
  middleName: string;
  extName: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  street: string;
  birthDate: string;
  birthPlace: string;
  maritalStatus: string;
  religion: string;
  sexAtBirth: string;
  contactNumber: string;
  email: string;
  fbMessenger: string;
  ethnicOrigin: string;
  languageSpoken: string;
  oscaId: string;
  gsisSssNo: string;
  tinNo: string;
  philhealthNo: string;
  scAssociationId: string;
  otherGovId: string;
  hasPension: string;
  canTravel: string;
  employment: string;
  // Health Profile fields
  bloodType: string;
  physicalDisability: string;
  listMedicines: string;
  checkUp: boolean;
  scheduleCheckUp: string;
  // Family Composition fields
  spouseLastName: string;
  spouseFirstName: string;
  spouseMiddleName: string;
  spouseExtName: string;
  fatherLastName: string;
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherExtName: string;
  motherLastName: string;
  motherFirstName: string;
  motherMiddleName: string;
  motherExtName: string;
  // Education Profile fields
  sharedSkills: string;
}
import { JSX, useState, useEffect } from "react";


export interface Member {
  name: string;
  occupation: string;
  income: string;
  age: string;
  isWorking: boolean;
}

export type FormMode = 'create' | 'view' | 'update';

export interface SeniorFormProps {
  mode: FormMode;
  seniorId?: number | null; // Load senior data by ID (for view/update modes)
  initialData?: SeniorCitizenType; // Full senior response structure from API (fallback or for create mode)
  onSubmit: (data: SeniorCitizenCreateInput | SeniorCitizenUpdateInput) => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  error?: Error | null;
  successMessage?: string;
}

const DEFAULT_SENIOR_CITIZEN: SeniorCitizenForm = {
  picture: null,
  lastName: "",
  firstName: "",
  middleName: "",
  extName: "",
  region: "",
  province: "",
  city: "",
  barangay: "",
  street: "",
  birthDate: "",
  birthPlace: "",
  maritalStatus: "",
  religion: "",
  sexAtBirth: "",
  contactNumber: "",
  email: "",
  fbMessenger: "",
  ethnicOrigin: "",
  languageSpoken: "",
  oscaId: "",
  gsisSssNo: "",
  tinNo: "",
  philhealthNo: "",
  scAssociationId: "",
  otherGovId: "",
  hasPension: "",
  canTravel: "",
  employment: "",
  // Health Profile fields
  bloodType: "",
  physicalDisability: "",
  listMedicines: "",
  checkUp: false,
  scheduleCheckUp: "",
  // Family Composition fields
  spouseLastName: "",
  spouseFirstName: "",
  spouseMiddleName: "",
  spouseExtName: "",
  fatherLastName: "",
  fatherFirstName: "",
  fatherMiddleName: "",
  fatherExtName: "",
  motherLastName: "",
  motherFirstName: "",
  motherMiddleName: "",
  motherExtName: "",
  // Education Profile fields
  sharedSkills: "",
};

const DEFAULT_MEMBER: Member = {
  name: "",
  occupation: "",
  income: "",
  age: "",
  isWorking: false,
};

export default function SeniorForm({
  mode,
  seniorId,
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  error,
  successMessage,
}: SeniorFormProps) {
  // Fetch senior data if seniorId is provided (for view/update modes)
  const { data: fetchedSenior, loading: fetchLoading, error: fetchError } = useSenior(seniorId || null);
  
  // Use fetched data if available, otherwise fall back to initialData
  const activeSeniorData = fetchedSenior || initialData;
  
  // Transform initialData to form format if it's the full senior structure
  const getFormData = () => {
    if (!activeSeniorData) return DEFAULT_SENIOR_CITIZEN;

    // If activeSeniorData has identifying information (support both cases), it's the full senior structure
    const identifying = activeSeniorData.IdentifyingInformation;
    if (identifying) {
      const info = identifying;
      // Extract barangay name from the Barangay object if available
      const barangayName = activeSeniorData.barangay?.name || info.barangay || "";
      return {
        picture: null, // Will be handled separately via photoUrl
        lastName: info.lastname || "",
        firstName: info.firstname || "",
        middleName: info.middlename || "",
        extName: info.extension || "",
        region: info.region || "",
        province: info.province || "",
        city: info.city || "",
        barangay: barangayName,
        street: info.street || "",
        birthDate: info.birthDate ? (typeof info.birthDate === 'string' ? info.birthDate : info.birthDate.toISOString().split('T')[0]) : "",
        birthPlace: info.birthPlace || "",
        maritalStatus: info.maritalStatus || "",
        religion: info.religion || "",
        sexAtBirth: info.sexAtBirth || "",
        contactNumber: info.contactNumber || "",
        email: info.emailAddress || "",
        fbMessenger: info.fbMessengerName || "",
        ethnicOrigin: info.ethnicOrigin || "",
        languageSpoken: info.languageSpoken || "",
        oscaId: info.oscaIdNo || "",
        gsisSssNo: info.gsisSssNo || "",
        tinNo: info.tin || "",
        philhealthNo: info.philhealthNo || "",
        scAssociationId: info.scAssociationIdNo || "",
        otherGovId: info.otherGovIdNo || "",
        hasPension: info.hasPension ? "Yes" : "No",
        canTravel: info.capabilityToTravel ? "Yes" : "No",
        employment: info.employmentBusiness || "",
        // Health Profile fields
        bloodType: (activeSeniorData.HealthProfile)?.bloodType || "",
        physicalDisability: (activeSeniorData.HealthProfile)?.physicalDisability || "",
        listMedicines: (activeSeniorData.HealthProfile)?.listMedicines || "",
        checkUp: (activeSeniorData.HealthProfile)?.checkUp || false,
        scheduleCheckUp: (activeSeniorData.HealthProfile)?.scheduleCheckUp || "",
        // Family Composition fields
        spouseLastName: (activeSeniorData.FamilyComposition)?.spouseLastname || "",
        spouseFirstName: (activeSeniorData.FamilyComposition)?.spouseFirstname || "",
        spouseMiddleName: (activeSeniorData.FamilyComposition)?.spouseMiddlename || "",
        spouseExtName: (activeSeniorData.FamilyComposition)?.spouseExtension || "",
        fatherLastName: (activeSeniorData.FamilyComposition)?.fatherLastname || "",
        fatherFirstName: (activeSeniorData.FamilyComposition)?.fatherFirstname || "",
        fatherMiddleName: (activeSeniorData.FamilyComposition)?.fatherMiddlename || "",
        fatherExtName: (activeSeniorData.FamilyComposition)?.fatherExtension || "",
        motherLastName: (activeSeniorData.FamilyComposition)?.motherLastname || "",
        motherFirstName: (activeSeniorData.FamilyComposition)?.motherFirstname || "",
        motherMiddleName: (activeSeniorData.FamilyComposition)?.motherMiddlename || "",
        motherExtName: "", // Not present in backend model
        // Education Profile fields
        sharedSkills: (activeSeniorData.EducationProfile)?.sharedSkills || "",
      };
    }

    // Otherwise, it's already in form format
    return { 
      ...DEFAULT_SENIOR_CITIZEN, 
      ...activeSeniorData,
      barangay: typeof activeSeniorData.barangay === 'string' ? activeSeniorData.barangay : activeSeniorData.barangay?.name || ""
    };
  };

  const [formData, setFormData] = useState<SeniorCitizenForm>(getFormData());
  const [children, setChildren] = useState<Member[]>([DEFAULT_MEMBER]);
  const [dependents, setDependents] = useState<Member[]>([DEFAULT_MEMBER]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [selectedCohabitants, setSelectedCohabitants] = useState<number[]>([]);
  const [selectedLivingConditions, setSelectedLivingConditions] = useState<
    number[]
  >([]);
  const [selectedEducationalAttainments, setSelectedEducationalAttainments] =
    useState<number[]>([]);
  const [selectedTechnicalSkills, setSelectedTechnicalSkills] = useState<
    number[]
  >([]);
  const [selectedCommunityInvolvements, setSelectedCommunityInvolvements] =
    useState<number[]>([]);
  const [selectedIncomeSources, setSelectedIncomeSources] = useState<number[]>(
    []
  );
  const [selectedMonthlyIncomes, setSelectedMonthlyIncomes] = useState<
    number[]
  >([]);
  const [selectedRealProperties, setSelectedRealProperties] = useState<
    number[]
  >([]);
  const [selectedPersonalProperties, setSelectedPersonalProperties] = useState<
    number[]
  >([]);
  const [selectedProblemsNeeds, setSelectedProblemsNeeds] = useState<number[]>(
    []
  );
  const [selectedHealthProblems, setSelectedHealthProblems] = useState<
    number[]
  >([]);
  const [selectedDentalConcerns, setSelectedDentalConcerns] = useState<
    number[]
  >([]);
  const [selectedVisualConcerns, setSelectedVisualConcerns] = useState<
    number[]
  >([]);
  const [selectedAuralConcerns, setSelectedAuralConcerns] = useState<number[]>(
    []
  );
  const [selectedSocialEmotionalConcerns, setSelectedSocialEmotionalConcerns] =
    useState<number[]>([]);
  const [selectedAreaOfDifficulties, setSelectedAreaOfDifficulties] = useState<
    number[]
  >([]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoInputKey, setPhotoInputKey] = useState<number>(0);

  const { data: areaOfDifficulties } = useAreaOfDifficulties();
  const { data: hearingConditions } = useAuralConcerns();
  const { data: barangays } = useBarangays();
  const { data: cohabitants } = useCohabitants();
  const { data: comunityInvolvements } = useCommunityInvolvements();
  const { data: dentalConcerns } = useDentalConcerns();
  const { data: healthProblems } = useHealthProblems();
  const { data: educationalAttainments } = useEducationalAttainments();
  const { data: incomeSources } = useIncomeSources();
  const { data: livingConditions } = useLivingConditions();
  const { data: monthlyIncomes } = useMonthlyIncomes();
  const { data: personalProperties } = usePersonalProperties();
  const { data: problemsNeeds } = useProblemsNeeds();
  const { data: realProperties } = useRealProperties();
  const { data: socialEmotionalConcerns } = useSocialEmotionalConcerns();
  const { data: technicalSkills } = useTechnicalSkills();
  const { data: visualConcerns } = useVisualConcerns();

  // Update form data when activeSeniorData changes
  useEffect(() => {
    if (activeSeniorData) {
      setFormData(getFormData());
    }
  }, [activeSeniorData]);

  // Populate option selections, children, and dependents from activeSeniorData
  useEffect(() => {
    if (!activeSeniorData) return;

    // Dependency Profile selections (backend returns arrays of objects with id/name)
    const dep = activeSeniorData.DependencyProfile;
    const depCohabs = dep?.Cohabitants?.map((c: any) => c.id) || [];
    setSelectedCohabitants(depCohabs);

    const depLiving = dep?.LivingConditions?.map((lc: any) => lc.id) || [];
    setSelectedLivingConditions(depLiving);

    // Education Profile selections
    const edu = activeSeniorData.EducationProfile;
    const eduAttain = edu?.HighestEducationalAttainments?.map((e: any) => e.id) || [];
    setSelectedEducationalAttainments(eduAttain);

    const eduSkills = edu?.SpecializationTechnicalSkills?.map((s: any) => s.id) || [];
    setSelectedTechnicalSkills(eduSkills);

    const eduComm = edu?.CommunityInvolvements?.map((ci: any) => ci.id) || [];
    setSelectedCommunityInvolvements(eduComm);

    // Economic Profile selections
    const eco = activeSeniorData.EconomicProfile;
    const ecoIncomeSrc = eco?.IncomeAssistanceSources?.map((x: any) => x.id) || [];
    setSelectedIncomeSources(ecoIncomeSrc);

    const ecoReal = eco?.RealImmovableProperties?.map((x: any) => x.id) || [];
    setSelectedRealProperties(ecoReal);

    const ecoPersonal = eco?.PersonalMovableProperties?.map((x: any) => x.id) || [];
    setSelectedPersonalProperties(ecoPersonal);

    const ecoMonthly = eco?.MonthlyIncomes?.map((x: any) => x.id) || [];
    setSelectedMonthlyIncomes(ecoMonthly);

    const ecoProblems = eco?.ProblemsNeedsCommonlyEncountereds?.map((x: any) => x.id) || [];
    setSelectedProblemsNeeds(ecoProblems);

    // Health Profile selections
    const hp = activeSeniorData.HealthProfile;
    const hpProblems = hp?.HealthProblemAilments?.map((x: any) => x.id) || [];
    setSelectedHealthProblems(hpProblems);

    const hpDental = hp?.DentalConcerns?.map((x: any) => x.id) || [];
    setSelectedDentalConcerns(hpDental);

    const hpVisual = hp?.VisualConcerns?.map((x: any) => x.id) || [];
    setSelectedVisualConcerns(hpVisual);

    const hpAural = hp?.AuralConcerns?.map((x: any) => x.id) || [];
    setSelectedAuralConcerns(hpAural);

    const hpSocial = hp?.SocialEmotionalConcerns?.map((x: any) => x.id) || [];
    setSelectedSocialEmotionalConcerns(hpSocial);

    const hpAreas = hp?.AreaOfDifficulties?.map((x: any) => x.id) || [];
    setSelectedAreaOfDifficulties(hpAreas);

    // Children
    const mapChild = (c: any): Member => ({
      name: c?.name || "",
      occupation: c?.occupation || "",
      income: c?.income != null ? String(c.income) : "",
      age: c?.age != null ? String(c.age) : "",
      // Backend stores children.isWorking as boolean
      isWorking: !!c?.isWorking,
    });

    const childrenList = activeSeniorData.Children || [];
    if (childrenList.length > 0) {
      setChildren(childrenList.map(mapChild));
    } else {
      setChildren([DEFAULT_MEMBER]);
    }

    // Dependents
    const mapDependent = (d: any): Member => ({
      name: d?.name || "",
      occupation: d?.occupation || "",
      income: d?.income != null ? String(d.income) : "",
      age: d?.age != null ? String(d.age) : "",
      // Backend stores dependent.isWorking as boolean
      isWorking: !!d?.isWorking,
    });

    const dependentsList = activeSeniorData.Dependents || [];
    if (dependentsList.length > 0) {
      setDependents(dependentsList.map(mapDependent));
    } else {
      setDependents([DEFAULT_MEMBER]);
    }
  }, [activeSeniorData]);

  // Handle photo URL resolution and cleanup
  useEffect(() => {
    return () => {
      if (photoUrl && photoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoUrl]);

  // Resolve photo to URL when activeSeniorData changes
  useEffect(() => {
    let active = true;
    (async () => {
      // Check both photo locations
      const photoData = activeSeniorData?.photo || activeSeniorData?.IdentifyingInformation?.picture;
      
      if (!photoData) {
        setPhotoUrl(null);
        return;
      }

      // revoke previous if blob
      if (photoUrl && photoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(photoUrl);
      }

      const url = await resolvePhotoToUrl(photoData);
      
      if (!active) {
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
        return;
      }
      setPhotoUrl(url);
    })();

    return () => {
      active = false;
    };
  }, [activeSeniorData?.photo, activeSeniorData?.IdentifyingInformation?.picture]);

  const isReadOnly = mode === 'view';
  const isUpdate = mode === 'update';


  // Helper function to convert Buffer photo to data URL (based on my-account page)
  const resolvePhotoToUrl = async (photo: any): Promise<string | null> => {
    if (!photo) {
      return null;
    }

    // If it's already a string (URL or file path), return it
    if (typeof photo === 'string') {
      // If it's a file path, we might need to construct a full URL
      if (photo.startsWith('http') || photo.startsWith('data:')) {
        return photo;
      } else {
        // Assume it's a file path, construct URL
        return `http://localhost:8000/${photo}`;
      }
    }

    if (
      photo &&
      typeof photo === "object" &&
      (photo.type === "Buffer" || Array.isArray(photo.data))
    ) {
      try {
        const bytes: number[] = photo.type === "Buffer" ? photo.data : photo;
        const uint8 = new Uint8Array(bytes);
        const blob = new Blob([uint8.buffer], { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        return url;
      } catch (err) {
        console.warn("Failed to convert Buffer photo to blob URL", err);
        return null;
      }
    }

    // If it's already a Blob
    if (photo instanceof Blob) {
      return URL.createObjectURL(photo);
    }

    return null;
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooleanInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isReadOnly) return;
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setFormData((prev) => ({ ...prev, picture: file }));
    }
  };

  const handleCheckboxChange = (
    optionId: number,
    setter: (ids: number[]) => void,
    currentIds: number[]
  ) => {
    if (isReadOnly) return;
    if (currentIds.includes(optionId)) {
      setter(currentIds.filter((id) => id !== optionId));
    } else {
      setter([...currentIds, optionId]);
    }
  };

  const handleRadioChange = (
    optionId: number,
    setter: (ids: number[]) => void
  ) => {
    if (isReadOnly) return;
    setter([optionId]);
  };

  const handleMemberFieldChange = (
    collectionName: "children" | "dependents",
    index: number,
    field: keyof Member,
    value: string | boolean
  ) => {
    if (isReadOnly) return;
    if (collectionName === "children") {
      const updated = [...children];
      updated[index] = { ...updated[index], [field]: value } as Member;
      setChildren(updated);
    } else {
      const updated = [...dependents];
      updated[index] = { ...updated[index], [field]: value } as Member;
      setDependents(updated);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    
    if (isReadOnly) return;

    try {
      // Find the selected barangay ID from the barangay name
      const selectedBarangay = barangays.find((b) => b.name === formData.barangay);
      if (!selectedBarangay) {
        throw new Error("Please select a valid barangay");
      }

      // Transform form data to match backend API structure
      const payload = {
        barangayId: selectedBarangay.id,
        photo: photoFile || undefined, // Send the File object directly, not base64
        identifyingInformation: {
          lastname: formData.lastName,
          firstname: formData.firstName,
          middlename: formData.middleName,
          extension: formData.extName,
          region: formData.region,
          province: formData.province,
          city: formData.city,
          barangay: formData.barangay,
          residence: formData.street, // Using street as residence
          street: formData.street,
          birthDate: formData.birthDate,
          birthPlace: formData.birthPlace,
          maritalStatus: formData.maritalStatus,
          religion: formData.religion,
          sexAtBirth: formData.sexAtBirth,
          contactNumber: formData.contactNumber,
          emailAddress: formData.email,
          fbMessengerName: formData.fbMessenger,
          ethnicOrigin: formData.ethnicOrigin,
          languageSpoken: formData.languageSpoken,
          oscaIdNo: formData.oscaId,
          gsisSssNo: formData.gsisSssNo,
          tin: formData.tinNo,
          philhealthNo: formData.philhealthNo,
          scAssociationIdNo: formData.scAssociationId,
          otherGovIdNo: formData.otherGovId,
          employmentBusiness: formData.employment,
          hasPension: formData.hasPension === "Yes",
          pensionList: "", // You might want to add this field to the form
          capabilityToTravel: formData.canTravel === "Yes",
        },
        familyComposition: {
          spouseLastname: formData.spouseLastName || null,
          spouseFirstname: formData.spouseFirstName || null,
          spouseMiddlename: formData.spouseMiddleName || null,
          spouseExtension: formData.spouseExtName || null,
          fatherLastname: formData.fatherLastName || null,
          fatherFirstname: formData.fatherFirstName || null,
          fatherMiddlename: formData.fatherMiddleName || null,
          fatherExtension: formData.fatherExtName || null,
          motherLastname: formData.motherLastName || null,
          motherFirstname: formData.motherFirstName || null,
          motherMiddlename: formData.motherMiddleName || null,
        },
        dependencyProfile: {
          cohabitants: selectedCohabitants,
          livingConditions: selectedLivingConditions,
        },
        educationProfile: {
          sharedSkills: formData.sharedSkills || "",
          highestEducationalAttainments: selectedEducationalAttainments,
          specializationTechnicalSkills: selectedTechnicalSkills,
          communityInvolvements: selectedCommunityInvolvements,
        },
        economicProfile: {
          incomeAssistanceSources: selectedIncomeSources,
          realImmovableProperties: selectedRealProperties,
          personalMovableProperties: selectedPersonalProperties,
          monthlyIncomes: selectedMonthlyIncomes,
          problemsNeedsCommonlyEncountered: selectedProblemsNeeds,
        },
        healthProfile: {
          bloodType: formData.bloodType || null,
          physicalDisability: formData.physicalDisability || null,
          listMedicines: formData.listMedicines || null,
          checkUp: formData.checkUp || false,
          scheduleCheckUp: formData.scheduleCheckUp || null,
          healthProblemAilments: selectedHealthProblems,
          dentalConcerns: selectedDentalConcerns,
          visualConcerns: selectedVisualConcerns,
          auralConcerns: selectedAuralConcerns,
          socialEmotionalConcerns: selectedSocialEmotionalConcerns,
          areasOfDifficulty: selectedAreaOfDifficulties,
        },
        children: children
          .filter((c) => c.name || c.age || c.income || c.occupation)
          .map((c) => ({
            name: c.name,
            occupation: c.occupation || null,
            income: c.income || "0.00",
            age: c.age ? Number(c.age) : 0,
            isWorking: c.isWorking,
          })),
        dependents: dependents
          .filter((d) => d.name || d.age || d.income || d.occupation)
          .map((d) => ({
            name: d.name,
            occupation: d.occupation || null,
            income: d.income || "0.00",
            age: d.age ? Number(d.age) : 0,
            isWorking: d.isWorking,
          })),
      };

      await onSubmit(payload);
      handleCancel();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Reset all form-related states
      setFormData(DEFAULT_SENIOR_CITIZEN);
      setChildren([DEFAULT_MEMBER]);
      setDependents([DEFAULT_MEMBER]);
      setSelectedCohabitants([]);
      setSelectedLivingConditions([]);
      setSelectedEducationalAttainments([]);
      setSelectedTechnicalSkills([]);
      setSelectedCommunityInvolvements([]);
      setSelectedIncomeSources([]);
      setSelectedMonthlyIncomes([]);
      setSelectedRealProperties([]);
      setSelectedPersonalProperties([]);
      setSelectedProblemsNeeds([]);
      setSelectedHealthProblems([]);
      setSelectedDentalConcerns([]);
      setSelectedVisualConcerns([]);
      setSelectedAuralConcerns([]);
      setSelectedSocialEmotionalConcerns([]);
      setSelectedAreaOfDifficulties([]);
      // Reset photo state and revoke existing blob URL if any
      if (photoUrl && photoUrl.startsWith("blob:")) {
        try { URL.revokeObjectURL(photoUrl); } catch {}
      }
      setPhotoUrl(null);
      setPhotoFile(null);
      setPhotoInputKey((k) => k + 1);
    }
  };

  const booleanOptions = () => {
    return (
      <>
        <option value=""></option>
        <option value="No">No</option>
        <option value="Yes">Yes</option>
      </>
    );
  };

  const nameExtensionOptions = () => {
    return (
      <>
        {" "}
        <option value="N/A">N/A</option>
        <option value="Jr.">Jr.</option>
        <option value="Sr.">Sr.</option>
      </>
    );
  };

  const identifyingInformation = () => {
    return (
      <>
        <div className="mb-3">
          <label className="form-label">Photo</label>
          {isReadOnly ? (
            <div className="mt-2">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Senior Citizen Photo"
                  className="img-thumbnail"
                  style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                  onError={(e) => {
                    console.log("Image failed to load:", e);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="text-muted">No photo available</div>';
                    }
                  }}
                />
              ) : (
                <div className="text-muted">No Photo</div>
              )}
            </div>
          ) : (
            <>
              <input
                key={photoInputKey}
                type="file"
                className="form-control"
                accept="image/png, image/jpeg"
                onChange={handlePhotoChange}
                disabled={isReadOnly}
              />
              <div className="form-text">Only JPG and PNG formats accepted.</div>
              {photoFile && (
                <div className="mt-2">
                  <small className="text-muted">Selected: {photoFile.name}</small>
                </div>
              )}
            </>
          )}
        </div>

        <div className="row">
          <div className="col-md-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required={!isReadOnly}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required={!isReadOnly}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Middle Name</label>
            <input
              type="text"
              className="form-control"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              required={!isReadOnly}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Ext Name</label>
            <select
              className="form-select"
              name="extName"
              value={formData.extName}
              onChange={handleChange}
              disabled={isReadOnly}
            >
              {nameExtensionOptions()}
            </select>
          </div>
        </div>

        <hr />

        {/* Address Section */}
        <h5 className="mt-4">Address</h5>
        <div className="row">
          <div className="col-md-3">
            <label className="form-label">Region</label>
            <select
              className="form-select"
              name="region"
              value={formData.region}
              onChange={handleChange}
              required={!isReadOnly}
              disabled={isReadOnly}
            >
              <option value="">Select Region</option>
              <option value="Region VIII">Region VIII</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Province</label>
            <input
              type="text"
              className="form-control"
              name="province"
              value={formData.province}
              onChange={handleChange}
              required={!isReadOnly}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required={!isReadOnly}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Barangay</label>
            <select
              className="form-select"
              name="barangay"
              value={formData.barangay}
              onChange={handleChange}
              required={!isReadOnly}
              disabled={isReadOnly}
            >
              <option value="">Select Barangay</option>
              {barangays.map((barangay) => (
                <option key={barangay.id} value={barangay.name}>
                  {barangay.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 mt-2">
            <label className="form-label">Street (Zone/Purok/Sitio)</label>
            <input
              type="text"
              className="form-control"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required={!isReadOnly}
              readOnly={isReadOnly}
            />
          </div>
        </div>

        <hr />

        {/* Personal Info */}
        <div className="row mt-3">
          <div className="col-md-3">
            <label className="form-label">Birth Date</label>
            <input
              type="date"
              className="form-control"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required={!isReadOnly}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Birth Place</label>
            <input
              type="text"
              className="form-control"
              name="birthPlace"
              value={formData.birthPlace}
              onChange={handleChange}
              required={!isReadOnly}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Marital Status</label>
            <select
              className="form-select"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              required={!isReadOnly}
              disabled={isReadOnly}
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Religion</label>
            <input
              type="text"
              className="form-control"
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-3">
            <label className="form-label">Sex at Birth</label>
            <select
              className="form-select"
              name="sexAtBirth"
              value={formData.sexAtBirth}
              onChange={handleChange}
              required={!isReadOnly}
              disabled={isReadOnly}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Contact Number</label>
            <input
              type="text"
              className="form-control"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required={!isReadOnly}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">FB Messenger Name</label>
            <input
              type="text"
              className="form-control"
              name="fbMessenger"
              value={formData.fbMessenger}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-3">
            <label className="form-label">Ethnic Origin</label>
            <input
              type="text"
              className="form-control"
              name="ethnicOrigin"
              value={formData.ethnicOrigin}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Language Spoken</label>
            <input
              type="text"
              className="form-control"
              name="languageSpoken"
              value={formData.languageSpoken}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">OSCA ID No.</label>
            <input
              type="text"
              className="form-control"
              name="oscaId"
              value={formData.oscaId}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">GSIS/SSS No.</label>
            <input
              type="text"
              className="form-control"
              name="gsisSssNo"
              value={formData.gsisSssNo}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-3">
            <label className="form-label">TIN No.</label>
            <input
              type="text"
              className="form-control"
              name="tinNo"
              value={formData.tinNo}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">PhilHealth No.</label>
            <input
              type="text"
              className="form-control"
              name="philhealthNo"
              value={formData.philhealthNo}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">SC Association ID No.</label>
            <input
              type="text"
              className="form-control"
              name="scAssociationId"
              value={formData.scAssociationId}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Other Gov't ID No.</label>
            <input
              type="text"
              className="form-control"
              name="otherGovId"
              value={formData.otherGovId}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-3">
            <label className="form-label">Has Pension</label>
            <select
              className="form-select"
              name="hasPension"
              value={formData.hasPension}
              onChange={handleChange}
              disabled={isReadOnly}
            >
              {booleanOptions()}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Capability to Travel</label>
            <select
              className="form-select"
              name="canTravel"
              value={formData.canTravel}
              onChange={handleChange}
              disabled={isReadOnly}
            >
              {booleanOptions()}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Employment/Business</label>
            <input
              type="text"
              className="form-control"
              name="employment"
              value={formData.employment}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
        </div>
      </>
    );
  };

  const familyComposition = () => {
    const removeItem = (
      collection: Member[],
      collectionName: string,
      index: number
    ) => {
      if (isReadOnly) return;
      const updatedItems = [...collection];
      updatedItems.splice(index, 1);

      if (updatedItems.length === 0) {
        updatedItems.push(DEFAULT_MEMBER);
      }

      if (collectionName === "children") {
        setChildren(updatedItems);
      }

      if (collectionName === "dependents") {
        setDependents(updatedItems);
      }
    };

    const moveItemUp = (
      collection: Member[],
      collectionName: string,
      index: number
    ) => {
      if (isReadOnly || index === 0) return; // already at top
      const updatedItems = [...collection];
      const temp = updatedItems[index];
      updatedItems[index] = updatedItems[index - 1];
      updatedItems[index - 1] = temp;

      if (collectionName === "children") {
        setChildren(updatedItems);
      }

      if (collectionName === "dependents") {
        setDependents(updatedItems);
      }
    };

    const addChild = () => {
      if (isReadOnly) return;
      setChildren([...children, DEFAULT_MEMBER]);
    };

    const addDependent = () => {
      if (isReadOnly) return;
      setDependents([...dependents, DEFAULT_MEMBER]);
    };

    const memberComponent = (
      member: Member,
      collectionName: string,
      index: number
    ) => {
      return (
        <tr key={index}>
          <td>
            <input
              type="text"
              className="form-control"
              name="name"
              value={member.name}
              onChange={(e) => handleMemberFieldChange(collectionName as any, index, "name", e.target.value)}
              readOnly={isReadOnly}
            />
          </td>
          <td>
            <input
              type="text"
              className="form-control"
              name="occupation"
              value={member.occupation}
              onChange={(e) => handleMemberFieldChange(collectionName as any, index, "occupation", e.target.value)}
              readOnly={isReadOnly}
            />
          </td>
          <td>
            <input
              type="text"
              inputMode="decimal"
              className="form-control"
              name="income"
              value={member.income}
              onChange={(e) => handleMemberFieldChange(collectionName as any, index, "income", e.target.value)}
              readOnly={isReadOnly}
            />
          </td>
          <td>
            <input
              type="number"
              inputMode="decimal"
              className="form-control"
              name="age"
              value={member.age}
              onChange={(e) => handleMemberFieldChange(collectionName as any, index, "age", e.target.value)}
              readOnly={isReadOnly}
            />
          </td>
          <td>
            <select
              className="form-select"
              name="isWorking"
              value={member.isWorking ? "Yes" : "No"}
              onChange={(e) => handleMemberFieldChange(collectionName as any, index, "isWorking", e.target.value === "Yes")}
              disabled={isReadOnly}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </td>
          <td>
            {!isReadOnly && (
              <>
                <button
                  type="button"
                  className="btn btn-success me-1"
                  onClick={() => {
                    moveItemUp(
                      collectionName === "children" ? children : dependents,
                      collectionName,
                      index
                    );
                  }}
                >
                  <i className="bi bi-chevron-double-up"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    removeItem(
                      collectionName === "children" ? children : dependents,
                      collectionName,
                      index
                    );
                  }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </>
            )}
          </td>
        </tr>
      );
    };

    return (
      <>
        <div className="row">
          <h5 className="mt-4">21. Name of your spouse</h5>
          <div className="col-md-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              name="spouseLastName"
              value={formData.spouseLastName}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              name="spouseFirstName"
              value={formData.spouseFirstName}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Middle Name</label>
            <input
              type="text"
              className="form-control"
              name="spouseMiddleName"
              value={formData.spouseMiddleName}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Ext Name</label>
            <select
              className="form-select"
              name="spouseExtName"
              value={formData.spouseExtName}
              onChange={handleChange}
              disabled={isReadOnly}
            >
              {nameExtensionOptions()}
            </select>
          </div>
        </div>

        <div className="row">
          <h5 className="mt-4">22. Name of your father</h5>
          <div className="col-md-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              name="fatherLastName"
              value={formData.fatherLastName}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              name="fatherFirstName"
              value={formData.fatherFirstName}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Middle Name</label>
            <input
              type="text"
              className="form-control"
              name="fatherMiddleName"
              value={formData.fatherMiddleName}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Ext Name</label>
            <select
              className="form-select"
              name="fatherExtName"
              value={formData.fatherExtName}
              onChange={handleChange}
              disabled={isReadOnly}
            >
              {nameExtensionOptions()}
            </select>
          </div>
        </div>

        <div className="row">
          <h5 className="mt-4">23. Name of your mother</h5>
          <div className="col-md-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              name="motherLastName"
              value={formData.motherLastName}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              name="motherFirstName"
              value={formData.motherFirstName}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Middle Name</label>
            <input
              type="text"
              className="form-control"
              name="motherMiddleName"
              value={formData.motherMiddleName}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Ext Name</label>
            <select
              className="form-select"
              name="motherExtName"
              value={formData.motherExtName}
              onChange={handleChange}
              disabled={isReadOnly}
            >
              {nameExtensionOptions()}
            </select>
          </div>
        </div>

        <div className="row">
          <div className="d-flex mt-3">
            <h5 className="mb-0">Name of your child(ren)</h5>
            {!isReadOnly && (
              <button
                type="button"
                className="btn btn-outline-primary btn-sm mx-1"
                onClick={addChild}
              >
                Add child
              </button>
            )}
          </div>
          <div className="container mt-3">
            <div className="mb-3 card p-3">
              <div className="col-md-12 table-responsive">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th style={{ minWidth: "250px", width: "35%" }}>
                        Child Name
                      </th>
                      <th style={{ minWidth: "200px", width: "25%" }}>
                        Occupation
                      </th>
                      <th style={{ minWidth: "100px" }}>Income</th>
                      <th style={{ minWidth: "100px" }}>Age</th>
                      <th style={{ minWidth: "110px" }}>Is Working?</th>
                      <th style={{ minWidth: "110px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {children.map((child, index) =>
                      memberComponent(child, "children", index)
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="d-flex mt-3">
            <h5 className="mb-0">Other Dependents</h5>
            {!isReadOnly && (
              <button
                type="button"
                className="btn btn-outline-primary btn-sm mx-1"
                onClick={addDependent}
              >
                Add dependent
              </button>
            )}
          </div>
          <div className="container mt-3">
            <div className="mb-3 card p-3">
              <div className="col-md-12 table-responsive">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th style={{ minWidth: "250px", width: "35%" }}>
                        Child Name
                      </th>
                      <th style={{ minWidth: "200px", width: "25%" }}>
                        Occupation
                      </th>
                      <th style={{ minWidth: "100px" }}>Income</th>
                      <th style={{ minWidth: "100px" }}>Age</th>
                      <th style={{ minWidth: "110px" }}>Is Working?</th>
                      <th style={{ minWidth: "110px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dependents.map((child, index) =>
                      memberComponent(child, "dependents", index)
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const dependencyProfile = () => {
    return (
      <>
        <div className="row">
          <div className="col-md-6">
            <h5 className="mt-3">Cohabitants</h5>
            {cohabitants.map((option) => (
              <div className="form-check" key={`${option.id}-${option.name}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={option.id.toString()}
                  id={`cohabitants-${option.id}-${option.name}`}
                  checked={selectedCohabitants.includes(option.id)}
                  onChange={() =>
                    handleCheckboxChange(
                      option.id,
                      setSelectedCohabitants,
                      selectedCohabitants
                    )
                  }
                  disabled={isReadOnly}
                />
                <label
                  className="form-check-label"
                  htmlFor={`cohabitants-${option.id}-${option.name}`}
                >
                  {option.name}
                </label>
              </div>
            ))}
          </div>
          <div className="col-md-6">
            <h5 className="mt-3">Living Condition</h5>
            {livingConditions.map((option) => (
              <div className="form-check" key={`${option.id}-${option.name}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={option.id.toString()}
                  id={`living-${option.id}-${option.name}`}
                  checked={selectedLivingConditions.includes(option.id)}
                  onChange={() =>
                    handleCheckboxChange(
                      option.id,
                      setSelectedLivingConditions,
                      selectedLivingConditions
                    )
                  }
                  disabled={isReadOnly}
                />
                <label
                  className="form-check-label"
                  htmlFor={`living-${option.id}-${option.name}`}
                >
                  {option.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const educationProfile = () => {
    return (
      <>
        <div className="row">
          <div className="col-md-4">
            <h5 className="mt-3">Highest Educational Attainment</h5>
            {educationalAttainments.map((option) => (
              <div className="form-check" key={`${option.id}-${option.name}`}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="educationalAttainments"
                  value={option.id.toString()}
                  id={`education-${option.id}-${option.name}`}
                  checked={selectedEducationalAttainments.includes(option.id)}
                  onChange={() =>
                    handleRadioChange(
                      option.id,
                      setSelectedEducationalAttainments
                    )
                  }
                  disabled={isReadOnly}
                />
                <label
                  className="form-check-label"
                  htmlFor={`education-${option.id}-${option.name}`}
                >
                  {option.name}
                </label>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <h5 className="mt-3">Specialization / Technical Skills</h5>
            {technicalSkills.map((option) => (
              <div className="form-check" key={`${option.id}-${option.name}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={option.id.toString()}
                  id={`technical-${option.id}-${option.name}`}
                  checked={selectedTechnicalSkills.includes(option.id)}
                  onChange={() =>
                    handleCheckboxChange(
                      option.id,
                      setSelectedTechnicalSkills,
                      selectedTechnicalSkills
                    )
                  }
                  disabled={isReadOnly}
                />
                <label
                  className="form-check-label"
                  htmlFor={`technical-${option.id}-${option.name}`}
                >
                  {option.name}
                </label>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <label htmlFor="sharedSkills" className="form-label">
              <h5 className="mt-3">Shared Skills</h5>
            </label>
            <textarea
              className="form-control"
              id="sharedSkills"
              name="sharedSkills"
              value={formData.sharedSkills}
              onChange={handleChange}
              rows={3}
              readOnly={isReadOnly}
            ></textarea>
            <h5 className="mt-3">Involvement in Community Activities</h5>
            {comunityInvolvements.map((option) => (
              <div className="form-check" key={`${option.id}-${option.name}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={option.id.toString()}
                  id={`community-${option.id}-${option.name}`}
                  checked={selectedCommunityInvolvements.includes(option.id)}
                  onChange={() =>
                    handleCheckboxChange(
                      option.id,
                      setSelectedCommunityInvolvements,
                      selectedCommunityInvolvements
                    )
                  }
                  disabled={isReadOnly}
                />
                <label
                  className="form-check-label"
                  htmlFor={`community-${option.id}-${option.name}`}
                >
                  {option.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const economicProfile = () => {
    return (
      <>
        <div className="row">
          <div className="col-md-4">
            <h5 className="mt-3">Sources of Income</h5>
            {incomeSources.map((option) => (
              <div className="form-check" key={`${option.id}-${option.name}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={option.id.toString()}
                  id={`income-${option.id}-${option.name}`}
                  checked={selectedIncomeSources.includes(option.id)}
                  onChange={() =>
                    handleCheckboxChange(
                      option.id,
                      setSelectedIncomeSources,
                      selectedIncomeSources
                    )
                  }
                  disabled={isReadOnly}
                />
                <label
                  className="form-check-label"
                  htmlFor={`income-${option.id}-${option.name}`}
                >
                  {option.name}
                </label>
              </div>
            ))}

            <h5 className="mt-3">Monthly Income</h5>
            {monthlyIncomes.map((option) => (
              <div className="form-check" key={`${option.id}-${option.name}`}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="monthlyIncomes"
                  value={option.id.toString()}
                  id={`monthly-${option.id}-${option.name}`}
                  checked={selectedMonthlyIncomes.includes(option.id)}
                  onChange={() =>
                    handleRadioChange(option.id, setSelectedMonthlyIncomes)
                  }
                  disabled={isReadOnly}
                />
                <label
                  className="form-check-label"
                  htmlFor={`monthly-${option.id}-${option.name}`}
                >
                  {option.name}
                </label>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <h5 className="mt-3">A Assets: Real and Immovable Properties</h5>
            {realProperties.map((option) => (
              <div className="form-check" key={`${option.id}-${option.name}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={option.id.toString()}
                  id={`real-${option.id}-${option.name}`}
                  checked={selectedRealProperties.includes(option.id)}
                  onChange={() =>
                    handleCheckboxChange(
                      option.id,
                      setSelectedRealProperties,
                      selectedRealProperties
                    )
                  }
                  disabled={isReadOnly}
                />
                <label
                  className="form-check-label"
                  htmlFor={`real-${option.id}-${option.name}`}
                >
                  {option.name}
                </label>
              </div>
            ))}

            <h5 className="mt-3">Problems / Needs Commonly Encountered</h5>
            {problemsNeeds.map((option) => (
              <div className="form-check" key={`${option.id}-${option.name}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={option.id.toString()}
                  id={`problems-${option.id}-${option.name}`}
                  checked={selectedProblemsNeeds.includes(option.id)}
                  onChange={() =>
                    handleCheckboxChange(
                      option.id,
                      setSelectedProblemsNeeds,
                      selectedProblemsNeeds
                    )
                  }
                  disabled={isReadOnly}
                />
                <label
                  className="form-check-label"
                  htmlFor={`problems-${option.id}-${option.name}`}
                >
                  {option.name}
                </label>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <h5 className="mt-3">B Assets: Personal and Movable Properties</h5>
            {personalProperties.map((option) => (
              <div className="form-check" key={`${option.id}-${option.name}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={option.id.toString()}
                  id={`personal-${option.id}-${option.name}`}
                  checked={selectedPersonalProperties.includes(option.id)}
                  onChange={() =>
                    handleCheckboxChange(
                      option.id,
                      setSelectedPersonalProperties,
                      selectedPersonalProperties
                    )
                  }
                  disabled={isReadOnly}
                />
                <label
                  className="form-check-label"
                  htmlFor={`personal-${option.id}-${option.name}`}
                >
                  {option.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const healthProfile = () => {
    const bloodTypes = ["", "O", "O+", "O-", "A", "A+", "A-"];

    const bloodTypeOptions = () => {
      return (
        <>
          {bloodTypes.map((bloodType) => {
            return (
              <option key={bloodType} value={bloodType}>
                {bloodType}
              </option>
            );
          })}
        </>
      );
    };

    const scheduleCheckUpOptions = () => {
      return (
        <>
          <option value="">Select Schedule</option>
          <option value="Monthly">Monthly</option>
          <option value="Every 3 Months">Every 3 Months</option>
          <option value="Every 6 Months">Every 6 Months</option>
          <option value="Annually">Annually</option>
        </>
      );
    };

    return (
      <>
        <div className="row">
          <div className="col-md-4">
            <label className="form-label">
              <h5 className="mt-3">Blood Type</h5>
            </label>
            <select
              className="form-select"
              name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
              disabled={isReadOnly}
            >
              {bloodTypeOptions()}
            </select>

            <label className="form-label">
              <h5 className="mt-3">Physical Disability</h5>
            </label>
            <input
              type="text"
              className="form-control"
              name="physicalDisability"
            value={formData.physicalDisability}
            onChange={handleChange}
              readOnly={isReadOnly}
            />

            <div className="form-check mt-3">
              <input
                className="form-check-input"
                type="checkbox"
                name="checkUp"
              checked={formData.checkUp}
              onChange={handleBooleanInputChange}
                disabled={isReadOnly}
              />
              <label className="form-check-label">
                Regular Check-up
              </label>
            </div>

            <label className="form-label">
              <h5 className="mt-3">Schedule Check-up</h5>
            </label>
            <select
              className="form-select"
              name="scheduleCheckUp"
            value={formData.scheduleCheckUp}
            onChange={handleChange}
              disabled={isReadOnly}
            >
              {scheduleCheckUpOptions()}
            </select>
            <h5 className="mt-3">Health Problems / Ailments</h5>
            {healthProblems.map((option) => (
              <div className="form-check" key={`${option.id}-${option.name}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={option.id.toString()}
                  id={`health-${option.id}-${option.name}`}
                  checked={selectedHealthProblems.includes(option.id)}
                  onChange={() =>
                    handleCheckboxChange(
                      option.id,
                      setSelectedHealthProblems,
                      selectedHealthProblems
                    )
                  }
                  disabled={isReadOnly}
                />
                <label
                  className="form-check-label"
                  htmlFor={`health-${option.id}-${option.name}`}
                >
                  {option.name}
                </label>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <h5 className="mt-3">b. Dental Concern</h5>
            {dentalConcerns.map((option) => (
              <div className="form-check" key={`${option.id}-${option.name}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={option.id.toString()}
                  id={`dental-${option.id}-${option.name}`}
                  checked={selectedDentalConcerns.includes(option.id)}
                  onChange={() =>
                    handleCheckboxChange(
                      option.id,
                      setSelectedDentalConcerns,
                      selectedDentalConcerns
                    )
                  }
                  disabled={isReadOnly}
                />
                <label
                  className="form-check-label"
                  htmlFor={`dental-${option.id}-${option.name}`}
                >
                  {option.name}
                </label>
              </div>
            ))}

            <h5 className="mt-3"> c. Visual Concern</h5>
            {visualConcerns.map((option) => (
              <div className="form-check" key={`${option.id}-${option.name}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={option.id.toString()}
                  id={`visual-${option.id}-${option.name}`}
                  checked={selectedVisualConcerns.includes(option.id)}
                  onChange={() =>
                    handleCheckboxChange(
                      option.id,
                      setSelectedVisualConcerns,
                      selectedVisualConcerns
                    )
                  }
                  disabled={isReadOnly}
                />
                <label
                  className="form-check-label"
                  htmlFor={`visual-${option.id}-${option.name}`}
                >
                  {option.name}
                </label>
              </div>
            ))}

            <h5 className="mt-3">d. Aural/ Hearing Condition</h5>
            {hearingConditions.map((option) => (
              <div className="form-check" key={`${option.id}-${option.name}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={option.id.toString()}
                  id={`aural-${option.id}-${option.name}`}
                  checked={selectedAuralConcerns.includes(option.id)}
                  onChange={() =>
                    handleCheckboxChange(
                      option.id,
                      setSelectedAuralConcerns,
                      selectedAuralConcerns
                    )
                  }
                  disabled={isReadOnly}
                />
                <label
                  className="form-check-label"
                  htmlFor={`aural-${option.id}-${option.name}`}
                >
                  {option.name}
                </label>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <h5 className="mt-3">e. Social/ Emotional</h5>
            {socialEmotionalConcerns.map((option) => (
              <div className="form-check" key={`${option.id}-${option.name}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={option.id.toString()}
                  id={`social-${option.id}-${option.name}`}
                  checked={selectedSocialEmotionalConcerns.includes(option.id)}
                  onChange={() =>
                    handleCheckboxChange(
                      option.id,
                      setSelectedSocialEmotionalConcerns,
                      selectedSocialEmotionalConcerns
                    )
                  }
                  disabled={isReadOnly}
                />
                <label
                  className="form-check-label"
                  htmlFor={`social-${option.id}-${option.name}`}
                >
                  {option.name}
                </label>
              </div>
            ))}

            <h5 className="mt-3">f. Area of Difficulty</h5>
            {areaOfDifficulties.map((option) => (
              <div className="form-check" key={`${option.id}-${option.name}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={option.id.toString()}
                  id={`area-${option.id}-${option.name}`}
                  checked={selectedAreaOfDifficulties.includes(option.id)}
                  onChange={() =>
                    handleCheckboxChange(
                      option.id,
                      setSelectedAreaOfDifficulties,
                      selectedAreaOfDifficulties
                    )
                  }
                  disabled={isReadOnly}
                />
                <label
                  className="form-check-label"
                  htmlFor={`area-${option.id}-${option.name}`}
                >
                  {option.name}
                </label>
              </div>
            ))}
          </div>

          <div className="col-md-12">
            <label htmlFor="listMedicines" className="form-label">
              <h5 className="mt-3">List of Medicines for Maintenance</h5>
            </label>
            <textarea
              className="form-control"
              id="listMedicines"
              name="listMedicines"
              value={formData.listMedicines}
              onChange={handleChange}
              rows={3}
              readOnly={isReadOnly}
            ></textarea>
          </div>
        </div>
      </>
    );
  };

  const accordionItem = (formSection: () => JSX.Element, header: string) => {
    const accordionName = `panelsStayOpen-collapse-${formSection.name}`;
    return (
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button fw-bold"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#${accordionName}`}
            aria-expanded="true"
            aria-controls={`${accordionName}`}
          >
            {header}
          </button>
        </h2>
        <div
          id={`${accordionName}`}
          className="accordion-collapse collapse show"
        >
          <div className="accordion-body">{formSection()}</div>
        </div>
      </div>
    );
  };

  // Show loading state when fetching senior data
  if (fetchLoading) {
    return (
      <section className="pt-4">
        <div className="container-fluid">
          <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading senior data...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state if fetching failed
  if (fetchError) {
    return (
      <section className="pt-4">
        <div className="container-fluid">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>Failed to load senior data: {fetchError.message}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-4">
      <div className="container-fluid">
        <form className="container my-4" onSubmit={handleSubmit}>
          <div className="accordion" id="accordionPanelsStayOpenExample">
            {accordionItem(
              identifyingInformation,
              "I. Identifying Information"
            )}
            {accordionItem(familyComposition, "II. Family Composition")}
            {accordionItem(dependencyProfile, "III. Dependency Profile")}
            {accordionItem(educationProfile, "IV. Education/HR Profile")}
            {accordionItem(economicProfile, "V. Economic Profile")}
            {accordionItem(healthProfile, "VI. Health Profile")}
          </div>
          
          {!isReadOnly && (
            <div className="mt-4 d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {isUpdate ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isUpdate ? 'Update' : 'Submit'
                )}
              </button>
              <button
                type="button"
                className="btn btn-danger mt-2"
                onClick={handleCancel}
                disabled={loading}
              >
                {isUpdate ? 'Cancel' : 'Reset'}
              </button>
            </div>
          )}

          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              <h4 className="alert-heading">Error!</h4>
              <p>Failed to {isUpdate ? 'update' : 'create'} senior citizen: {error.message}</p>
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success mt-3" role="alert">
              <h4 className="alert-heading">Success!</h4>
              <p>{successMessage}</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
