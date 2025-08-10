"use client";

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

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(formData);
    // Submit logic here
  };

  const handleCancel = () => {
    setFormData(DEFAULT_SENIOR_CITIZEN);
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
          />
          <div className="form-text">Only JPG and PNG formats accepted.</div>
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
            />
          </div>
          <div className="col-12 mt-2">
            <label className="form-label">Street (Zone/Purok/Sitio)</label>
            <input
              type="text"
              className="form-control"
              name="street"
              onChange={handleChange}
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
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Birth Place</label>
            <input
              type="text"
              className="form-control"
              name="birthPlace"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Marital Status</label>
            <select
              className="form-select"
              name="maritalStatus"
              onChange={handleChange}
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
              required
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
              required
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
              required
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
    const cohabitants = [
      "Grand Children",
      "Common Law Spouse",
      "Spouse",
      "In-laws",
      "Care Institution",
      "Children",
      "Relative",
      "Friends",
    ];

    const livingConditions = [
      "No privacy",
      "Overcrowded in home",
      "Informal Settler",
      "No permanent house",
      "High cost of rent",
      "Longing for independent living quiet atmosphere",
    ];

    const cohabitantOptions = () => {
      return cohabitants.map((cohabitant) => {
        return (
          <div className="form-check" key={cohabitant}>
            <input
              className="form-check-input"
              type="checkbox"
              value={cohabitant}
              id={cohabitant}
            ></input>
            <label className="form-check-label" htmlFor={cohabitant}>
              {cohabitant}
            </label>
          </div>
        );
      });
    };

    const livingConditionOptions = () => {
      return livingConditions.map((livingCondition) => {
        return (
          <div className="form-check" key={livingCondition}>
            <input
              className="form-check-input"
              type="checkbox"
              value={livingCondition}
              id={livingCondition}
            ></input>
            <label className="form-check-label" htmlFor={livingCondition}>
              {livingCondition}
            </label>
          </div>
        );
      });
    };
    return (
      <>
        <div className="row mt-2">
          <div className="col-md-6">
            <h5>Cohabitants</h5>
            {cohabitantOptions()}
          </div>
          <div className="col-md-6">
            <h5>Living Condition</h5>
            {livingConditionOptions()}
          </div>
        </div>
      </>
    );
  };

  const educationProfile = () => {
    const education = [
      "Not Attended School",
      "Elementary Level",
      "Elementary Graduate",
      "Highschool Level",
      "Highschool Graduate",
      "Vocational",
      "College Level",
      "College Graduate",
      "Post Graduate",
    ];

    const technicalSkills = [
      "Medical",
      "Dental",
      "Fishing",
      "Engineering",
      "Barber",
      "Evangelization",
      "Millwright",
      "Teaching",
      "Counselling",
      "Cooking",
      "Carpenter",
      "Mason",
      "Tailor",
      "Legal Services",
      "Farming",
      "Arts",
      "Plumber",
      "Shoemaker",
      "Chef/Cook",
      "Information Technology",
    ];

    const comunityActivities = [
      "Medical",
      "Resource Volunteer",
      "Community Beautification",
      "Community/Organization Leader",
      "Friendly Visits",
      "Neighborhood Support Services",
      "Legal Services",
      "Religious",
      "Counselling/Referral",
      "Sponsorship",
    ];

    const educationOptions = () => {
      return education.map((cohabitant) => {
        return (
          <div className="form-check" key={cohabitant}>
            <input
              name="educationOptions"
              className="form-check-input"
              type="radio"
              value={cohabitant}
              id={cohabitant}
            ></input>
            <label className="form-check-label" htmlFor={cohabitant}>
              {cohabitant}
            </label>
          </div>
        );
      });
    };

    const technicalSkillsOptions = () => {
      return technicalSkills.map((cohabitant) => {
        return (
          <div className="form-check" key={cohabitant}>
            <input
              className="form-check-input"
              type="checkbox"
              value={cohabitant}
              id={cohabitant}
            ></input>
            <label className="form-check-label" htmlFor={cohabitant}>
              {cohabitant}
            </label>
          </div>
        );
      });
    };

    const communityActivitiesOptions = () => {
      return comunityActivities.map((cohabitant) => {
        return (
          <div className="form-check" key={cohabitant}>
            <input
              className="form-check-input"
              type="checkbox"
              value={cohabitant}
              id={cohabitant}
            ></input>
            <label className="form-check-label" htmlFor={cohabitant}>
              {cohabitant}
            </label>
          </div>
        );
      });
    };
    return (
      <>
        <div className="row">
          <div className="col-md-4 mt-3">
            <h5>Highest Educational Attainment</h5>
            {educationOptions()}
          </div>
          <div className="col-md-4 mt-3">
            <h5>Specialization / Technical Skills</h5>
            {technicalSkillsOptions()}
          </div>
          <div className="col-md-4">
            <label htmlFor="sharedSkills" className="form-label mt-3">
              <h5>Shared Skills</h5>
            </label>
            <textarea
              className="form-control"
              id="sharedSkills"
              rows={3}
            ></textarea>
            <h5 className="mt-3">Involvement in Community Activities</h5>
            {communityActivitiesOptions()}
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
          </div>
          <div className="mt-4 d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button
              type="button"
              className="btn btn-danger mt-2"
              onClick={handleCancel}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
