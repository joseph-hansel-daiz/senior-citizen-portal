"use client";

import { useState } from "react";
import SeniorFormModal from "@/components/SeniorFormModal";
import { useCreateSenior } from "@/hooks/useCreateSenior";
import { useGetSenior } from "@/hooks/useGetSenior";

// Mock data for demonstration
const mockSeniors = [
  { id: 1, name: "John Doe", age: 65, barangay: "Barangay 1" },
  { id: 2, name: "Jane Smith", age: 70, barangay: "Barangay 2" },
  { id: 3, name: "Bob Johnson", age: 68, barangay: "Barangay 1" },
];

export default function SeniorsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSeniorId, setSelectedSeniorId] = useState<number | null>(null);

  const { createSenior, loading: creating, error: createError, data: createData } = useCreateSenior();
  const { senior, loading: loadingSenior } = useGetSenior(selectedSeniorId);

  const handleCreateSubmit = async (payload: any) => {
    try {
      await createSenior(payload);
      setShowCreateModal(false);
      alert("Senior citizen created successfully!");
    } catch (err) {
      console.error("Error creating senior:", err);
    }
  };

  const handleViewSenior = (id: number) => {
    setSelectedSeniorId(id);
    setShowViewModal(true);
  };

  const handleEditSenior = (id: number) => {
    setSelectedSeniorId(id);
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowViewModal(false);
    setShowEditModal(false);
    setSelectedSeniorId(null);
  };

  // Transform senior data for the form
  const getInitialData = () => {
    if (!senior) return undefined;
    
    return {
      lastName: senior.identifyingInformation.lastname,
      firstName: senior.identifyingInformation.firstname,
      middleName: senior.identifyingInformation.middlename,
      extName: senior.identifyingInformation.extension,
      region: senior.identifyingInformation.region,
      province: senior.identifyingInformation.province,
      city: senior.identifyingInformation.city,
      barangay: senior.identifyingInformation.barangay,
      street: senior.identifyingInformation.street,
      birthDate: senior.identifyingInformation.birthDate,
      birthPlace: senior.identifyingInformation.birthPlace,
      maritalStatus: senior.identifyingInformation.maritalStatus,
      religion: senior.identifyingInformation.religion,
      sexAtBirth: senior.identifyingInformation.sexAtBirth,
      contactNumber: senior.identifyingInformation.contactNumber,
      email: senior.identifyingInformation.emailAddress,
      fbMessenger: senior.identifyingInformation.fbMessengerName,
      ethnicOrigin: senior.identifyingInformation.ethnicOrigin,
      languageSpoken: senior.identifyingInformation.languageSpoken,
      oscaId: senior.identifyingInformation.oscaIdNo,
      gsisSssNo: senior.identifyingInformation.gsisSssNo,
      tinNo: senior.identifyingInformation.tin,
      philhealthNo: senior.identifyingInformation.philhealthNo,
      scAssociationId: senior.identifyingInformation.scAssociationIdNo,
      otherGovId: senior.identifyingInformation.otherGovIdNo,
      hasPension: senior.identifyingInformation.hasPension ? "Yes" : "No",
      canTravel: senior.identifyingInformation.capabilityToTravel ? "Yes" : "No",
      employment: senior.identifyingInformation.employmentBusiness,
    };
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Senior Citizens</h1>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              Add New Senior
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Barangay</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockSeniors.map((senior) => (
                  <tr key={senior.id}>
                    <td>{senior.id}</td>
                    <td>{senior.name}</td>
                    <td>{senior.age}</td>
                    <td>{senior.barangay}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewSenior(senior.id)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleEditSenior(senior.id)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <SeniorFormModal
        show={showCreateModal}
        onHide={handleCloseModals}
        title="Add New Senior Citizen"
        mode="create"
        onSubmit={handleCreateSubmit}
        loading={creating}
        error={createError}
        successMessage={createData ? `Senior citizen created successfully with ID: ${createData.id}` : undefined}
      />

      {/* View Modal */}
      <SeniorFormModal
        show={showViewModal}
        onHide={handleCloseModals}
        title="View Senior Citizen"
        mode="view"
        initialData={getInitialData()}
        onSubmit={() => {}} // No-op for view mode
      />

      {/* Edit Modal */}
      <SeniorFormModal
        show={showEditModal}
        onHide={handleCloseModals}
        title="Edit Senior Citizen"
        mode="update"
        initialData={getInitialData()}
        onSubmit={async (payload) => {
          // Handle update logic here
          console.log("Update payload:", payload);
          setShowEditModal(false);
        }}
      />
    </div>
  );
}
