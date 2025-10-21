"use client";

import DataTable, { Column } from "@/components/DataTable";
import SeniorFormModal from "@/components/SeniorFormModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { useSeniors } from "@/hooks/useSeniors";
import { useUnmarkDeceased } from "@/hooks/useUnmarkDeceased";
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
  dateOfDeath: string;
}

export default function DashboardPage() {
  const { data: seniors, loading, error } = useSeniors();
  const [selectedSeniorId, setSelectedSeniorId] = useState<number | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUnmarkConfirm, setShowUnmarkConfirm] = useState(false);
  const { unmarkDeceased, loading: unmarking, error: unmarkError } = useUnmarkDeceased();

  // Transform backend data to match table structure
  // Filter to only show seniors with DeathInfo
  const data: SeniorCitizen[] = seniors
    .filter((senior) => senior.DeathInfo)
    .map((senior) => {
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
    const dateOfDeath = senior.DeathInfo?.dateOfDeath
      ? new Date(senior.DeathInfo.dateOfDeath).toLocaleDateString()
      : "N/A";

    return {
      id: senior.id,
      fullName,
      age,
      address,
      contact,
      livingStatus,
      hasPension,
      barangay,
      dateOfDeath,
    };
  });

  const columns: Column<SeniorCitizen>[] = [
    { label: "Barangay", accessor: "barangay" },
    { label: "Full Name", accessor: "fullName" },
    { label: "Age", accessor: "age" },
    { label: "Date of Death", accessor: "dateOfDeath" },
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
    setShowUnmarkConfirm(false);
    setSelectedSeniorId(null);
  };

  const handleUnmarkDeceased = (seniorId: number) => {
    setSelectedSeniorId(seniorId);
    setShowUnmarkConfirm(true);
  };

  const renderActions = (item: SeniorCitizen) => (
    <div className="d-grid gap-2">
      <button
        className="btn btn-primary btn-sm w-100"
        onClick={() => handleViewSenior(item.id)}
      >
        View
      </button>
      <button
        className="btn btn-secondary btn-sm w-100"
        onClick={() => handleUnmarkDeceased(item.id)}
      >
        Unmark as Deceased
      </button>
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
        title="Deceased Citizens"
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

      {/* Unmark Confirm Modal */}
      <DeleteConfirmModal
        show={showUnmarkConfirm}
        onHide={handleCloseModal}
        onConfirm={async () => {
          if (!selectedSeniorId) return;
          try {
            await unmarkDeceased(selectedSeniorId);
            handleCloseModal();
          } catch {}
        }}
        loading={unmarking}
        error={unmarkError}
        title="Unmark as Deceased"
        message="Are you sure you want to unmark this senior as deceased? This will restore them to the active seniors list."
        confirmText="Unmark as Deceased"
        confirmButtonClass="btn-warning"
      />
    </section>
  );
}
