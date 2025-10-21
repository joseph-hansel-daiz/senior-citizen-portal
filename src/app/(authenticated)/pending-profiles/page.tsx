"use client";

import DataTable, { Column } from "@/components/DataTable";
import { useSeniors } from "@/hooks/useSeniors";
import SeniorFormModal from "@/components/SeniorFormModal";
import { useState } from "react";

interface SeniorCitizen {
  id: number;
  fullName: string;
  age: number;
  address: string;
  contact: string;
  livingStatus: string;
  hasPension: string;
  barangay: string;
}

export default function DashboardPage() {
  const { data: seniors, loading, error } = useSeniors();
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSeniorId, setSelectedSeniorId] = useState<number | null>(null);

  // Filter to only show seniors with exactly 1 status that is 'Pending'
  const pendingSeniors = seniors.filter((senior) => {
    // Filter out deceased seniors
    if (senior.DeathInfo) {
      return false;
    }

    // Only show seniors with exactly 1 status history entry that is 'Pending'
    if (senior.SeniorStatusHistories && senior.SeniorStatusHistories.length === 1) {
      return senior.SeniorStatusHistories[0].status === 'Pending';
    }

    return false;
  });

  // Transform backend data to match table structure
  const data: SeniorCitizen[] = pendingSeniors.map((senior) => {
    const identifyingInfo = senior.IdentifyingInformation;
    const fullName = identifyingInfo
      ? `${identifyingInfo.firstname} ${identifyingInfo.middlename} ${identifyingInfo.lastname}`.trim()
      : "N/A";

    const birthDate = identifyingInfo?.birthDate
      ? new Date(identifyingInfo.birthDate)
      : null;
    const age = birthDate
      ? new Date().getFullYear() - birthDate.getFullYear()
      : 0;

    const address = identifyingInfo
      ? `${identifyingInfo.street}, ${identifyingInfo.barangay}, ${identifyingInfo.city}`
      : "N/A";

    const contact = identifyingInfo?.contactNumber || "N/A";
    const livingStatus =
      senior.DependencyProfile?.LivingConditions &&
      senior.DependencyProfile.LivingConditions.length > 0
        ? "With Family"
        : "Alone";
    const hasPension = identifyingInfo?.hasPension ? "Yes" : "No";
    const barangay = identifyingInfo?.barangay || "N/A";

    return {
      id: senior.id,
      fullName,
      age,
      address,
      contact,
      livingStatus,
      hasPension,
      barangay,
    };
  });

  const columns: Column<SeniorCitizen>[] = [
    { label: "Barangay", accessor: "barangay" },
    { label: "Full Name", accessor: "fullName" },
    { label: "Age", accessor: "age" },
    { label: "Address", accessor: "address" },
    { label: "Contact #", accessor: "contact" },
    { label: "Living Status", accessor: "livingStatus" },
    { label: "Has Pension", accessor: "hasPension" },
  ];

  const handleViewSenior = (seniorId: number) => {
    setSelectedSeniorId(seniorId);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedSeniorId(null);
  };

  const renderActions = (item: SeniorCitizen) => (
    <div className="d-grid gap-2">
      <button
        className="btn btn-primary btn-sm w-100"
        onClick={() => handleViewSenior(item.id)}
      >
        View
      </button>
      <button className="btn btn-primary btn-sm w-100">Approve</button>
      <button className="btn btn-danger btn-sm w-100">Decline</button>
    </div>
  );

  if (loading) {
    return (
      <section>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "400px" }}
        >
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>Failed to load senior citizens data: {error.message}</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <DataTable
        title="Senior Citizens"
        data={data}
        columns={columns}
        searchableField="fullName"
        renderActions={renderActions}
      />

      {/* View Modal - Now loads full data by seniorId */}
      <SeniorFormModal
        show={showViewModal}
        onHide={handleCloseModal}
        title="View Senior Citizen"
        mode="view"
        seniorId={selectedSeniorId}
        onSubmit={() => {}} // No-op for view mode
      />
    </section>
  );
}
