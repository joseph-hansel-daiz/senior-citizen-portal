"use client";

import {
  useAreaOfDifficulties,
  useAuralConcerns,
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
import { useCreateSenior } from "@/hooks/useCreateSenior";
import { JSX, useState } from "react";

interface SeniorCitizen {
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
}

const DEFAULT_SENIOR_CITIZEN: SeniorCitizen = {
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
};

interface Member {
  name: string;
  occupation: string;
  income: string;
  age: string;
  isWorking: boolean;
}

const DEFAULT_MEMBER: Member = {
  name: "",
  occupation: "",
  income: "",
  age: "",
  isWorking: false,
};

export default function DashboardPage() {
  const [formData, setFormData] = useState<SeniorCitizen>(
    DEFAULT_SENIOR_CITIZEN
  );
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

  const { createSenior, loading, error, data } = useCreateSenior();

  const { data: areaOfDifficulties } = useAreaOfDifficulties();
  const { data: hearingConditions } = useAuralConcerns();
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

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setter([optionId]);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      // Transform form data to match backend API structure
      const payload = {
        barangayId: 1, // You might want to make this dynamic
        photo: photoFile || null,
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
          spouseLastname: null, // You might want to add spouse fields to the form
          spouseFirstname: null,
          spouseMiddlename: null,
          spouseExtension: null,
          fatherLastname: null, // You might want to add parent fields to the form
          fatherFirstname: null,
          fatherMiddlename: null,
          fatherExtension: null,
          motherLastname: null,
          motherFirstname: null,
          motherMiddlename: null,
        },
        dependencyProfile: {
          cohabitants: selectedCohabitants,
          livingConditions: selectedLivingConditions,
        },
        educationProfile: {
          sharedSkills: "", // You might want to add this field to the form
          highestEducationalAttainments: selectedEducationalAttainments,
          specializationTechnicalSkills: selectedTechnicalSkills,
          communityInvolvements: selectedCommunityInvolvements,
        },
        economicProfile: {
          incomeAssistanceSources: selectedIncomeSources,
          realImmovableProperties: selectedRealProperties,
          personalMovableProperties: selectedPersonalProperties,
          monthlyIncomes: selectedMonthlyIncomes,
          problemsNeedsCommonlyEncountereds: selectedProblemsNeeds,
        },
        healthProfile: {
          bloodType: null,
          physicalDisability: null,
          listMedicines: null,
          checkUp: false,
          scheduleCheckUp: null,
          healthProblemAilments: selectedHealthProblems,
          dentalConcerns: selectedDentalConcerns,
          visualConcerns: selectedVisualConcerns,
          auralConcerns: selectedAuralConcerns,
          socialEmotionalConcerns: selectedSocialEmotionalConcerns,
          areaOfDifficulties: selectedAreaOfDifficulties,
        },
      };

      await createSenior(payload);
      // Handle success - maybe redirect or show success message
      alert("Senior citizen created successfully!");
    } catch (err) {
      console.error("Error creating senior:", err);
      // Error is already handled by the hook
    }
  };

  const handleCancel = () => {
    setFormData(DEFAULT_SENIOR_CITIZEN);
    setPhotoFile(null);
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
          <label className="form-label">Upload Photo</label>
          <input
            type="file"
            className="form-control"
            accept="image/png, image/jpeg"
            onChange={handlePhotoChange}
          />
          <div className="form-text">Only JPG and PNG formats accepted.</div>
          {photoFile && (
            <div className="mt-2">
              <small className="text-muted">Selected: {photoFile.name}</small>
            </div>
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
              required
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
              required
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
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Ext Name</label>
            <select
              className="form-select"
              name="extName"
              value={formData.extName}
              onChange={handleChange}
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
              required
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
              required
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
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Barangay</label>
            <input
              type="text"
              className="form-control"
              name="barangay"
              value={formData.barangay}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 mt-2">
            <label className="form-label">Street (Zone/Purok/Sitio)</label>
            <input
              type="text"
              className="form-control"
              name="street"
              onChange={handleChange}
              required
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
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Birth Place</label>
            <input
              type="text"
              className="form-control"
              name="birthPlace"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Marital Status</label>
            <select
              className="form-select"
              name="maritalStatus"
              onChange={handleChange}
              required
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
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-3">
            <label className="form-label">Sex at Birth</label>
            <select
              className="form-select"
              name="sexAtBirth"
              onChange={handleChange}
              required
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
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">FB Messenger Name</label>
            <input
              type="text"
              className="form-control"
              name="fbMessenger"
              onChange={handleChange}
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
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Language Spoken</label>
            <input
              type="text"
              className="form-control"
              name="languageSpoken"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">OSCA ID No.</label>
            <input
              type="text"
              className="form-control"
              name="oscaId"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">GSIS/SSS No.</label>
            <input
              type="text"
              className="form-control"
              name="gsisSssNo"
              onChange={handleChange}
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
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">PhilHealth No.</label>
            <input
              type="text"
              className="form-control"
              name="philhealthNo"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">SC Association ID No.</label>
            <input
              type="text"
              className="form-control"
              name="scAssociationId"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Other Gov't ID No.</label>
            <input
              type="text"
              className="form-control"
              name="otherGovId"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-3">
            <label className="form-label">Has Pension</label>
            <select
              className="form-select"
              name="hasPension"
              onChange={handleChange}
            >
              {booleanOptions()}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Capability to Travel</label>
            <select
              className="form-select"
              name="canTravel"
              onChange={handleChange}
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
              onChange={handleChange}
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
      if (index === 0) return; // already at top
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
      setChildren([...children, DEFAULT_MEMBER]);
    };

    const addDependent = () => {
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
              id="itemDescription"
              name="itemDescription"
              onChange={(e) => {}}
            />
          </td>
          <td>
            <input
              type="text"
              inputMode="decimal"
              className="form-control"
              name="unitCost"
              onChange={(e) => {}}
            />
          </td>
          <td>
            <input
              type="number"
              inputMode="decimal"
              className="form-control"
              name="quantity"
              onChange={(e) => {}}
            />
          </td>
          <td>
            <input
              type="number"
              inputMode="decimal"
              className="form-control"
              name="quantity"
              onChange={(e) => {}}
            />
          </td>
          <td>
            <select
              className="form-select"
              name="isWorking"
              onChange={handleChange}
            >
              {booleanOptions()}
            </select>
          </td>
          <td>
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
              name="lastName"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Middle Name</label>
            <input
              type="text"
              className="form-control"
              name="middleName"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Ext Name</label>
            <select
              className="form-select"
              name="extName"
              onChange={handleChange}
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
              name="lastName"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Middle Name</label>
            <input
              type="text"
              className="form-control"
              name="middleName"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Ext Name</label>
            <select
              className="form-select"
              name="extName"
              onChange={handleChange}
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
              name="lastName"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Middle Name</label>
            <input
              type="text"
              className="form-control"
              name="middleName"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Ext Name</label>
            <select
              className="form-select"
              name="extName"
              onChange={handleChange}
            >
              {nameExtensionOptions()}
            </select>
          </div>
        </div>

        <div className="row">
          <div className="d-flex mt-3">
            <h5 className="mb-0">Name of your child(ren)</h5>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm mx-1"
              onClick={addChild}
            >
              Add child
            </button>
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
            <button
              type="button"
              className="btn btn-outline-primary btn-sm mx-1"
              onClick={addDependent}
            >
              Add dependent
            </button>
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
              rows={3}
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
    const bloodTypes = ["", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

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
              onChange={handleChange}
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
              onChange={handleChange}
            />
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
            <label htmlFor="listOfMedicines" className="form-label">
              <h5 className="mt-3">List of Medicines for Maintenance</h5>
            </label>
            <textarea
              className="form-control"
              id="listOfMedicines"
              name="listOfMedicines"
              onChange={handleChange}
              rows={3}
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
                  Creating...
                </>
              ) : (
                "Submit"
              )}
            </button>
            <button
              type="button"
              className="btn btn-danger mt-2"
              onClick={handleCancel}
              disabled={loading}
            >
              Reset
            </button>
          </div>

          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              <h4 className="alert-heading">Error!</h4>
              <p>Failed to create senior citizen: {error.message}</p>
            </div>
          )}

          {data && (
            <div className="alert alert-success mt-3" role="alert">
              <h4 className="alert-heading">Success!</h4>
              <p>Senior citizen created successfully with ID: {data.id}</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
