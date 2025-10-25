"use client";

import ApproveModal from "@/components/ApproveModal";
import DataTable, { Column } from "@/components/DataTable";
import DeclineModal from "@/components/DeclineModal";
import SeniorFormModal from "@/components/SeniorFormModal";
import { useApproveSenior } from "@/hooks/useApproveSenior";
import { useDeclineSenior } from "@/hooks/useDeclineSenior";
import { useSeniors } from "@/hooks/useSeniors";
import { useState } from "react";

interface SeniorCitizenTableRow {
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
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedSeniorId, setSelectedSeniorId] = useState<number | null>(null);
  const {
    approveSenior,
    loading: approveLoading,
    error: approveError,
  } = useApproveSenior();
  const {
    declineSenior,
    loading: declineLoading,
    error: declineError,
  } = useDeclineSenior();

  // Filter to only show seniors with exactly 1 status that is 'Pending'
  const pendingSeniors = seniors.filter((senior) => {
    // Filter out deceased seniors
    if (senior.DeathInfo) {
      return false;
    }

    // Only show seniors with exactly 1 status history entry that is 'Pending'
    if (
      senior.SeniorStatusHistories &&
      senior.SeniorStatusHistories.length === 1
    ) {
      return senior.SeniorStatusHistories[0].status === "Pending";
    }

    return false;
  });

  // Transform backend data to match table structure
  const data: SeniorCitizenTableRow[] = pendingSeniors.map((senior) => {
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
      id: senior.id!,
      fullName,
      age,
      address,
      contact,
      livingStatus,
      hasPension,
      barangay,
    };
  });

  const columns: Column<SeniorCitizenTableRow>[] = [
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

  const handleApproveSenior = (seniorId: number) => {
    setSelectedSeniorId(seniorId);
    setShowApproveModal(true);
  };

  const handleDeclineSenior = (seniorId: number) => {
    setSelectedSeniorId(seniorId);
    setShowDeclineModal(true);
  };

  const handleApproveSubmit = async (payload: {
    oscaId: string;
    note?: string;
  }) => {
    if (selectedSeniorId === null) return;

    try {
      await approveSenior(selectedSeniorId, payload);
      setShowApproveModal(false);
      setSelectedSeniorId(null);
      // Reload the page to refresh the data
      window.location.reload();
    } catch (error) {
      // Error is handled by the hook
      console.error("Failed to approve senior:", error);
    }
  };

  const handleDeclineSubmit = async (payload: { note?: string }) => {
    if (selectedSeniorId === null) return;

    try {
      await declineSenior(selectedSeniorId, payload);
      setShowDeclineModal(false);
      setSelectedSeniorId(null);
      // Reload the page to refresh the data
      window.location.reload();
    } catch (error) {
      // Error is handled by the hook
      console.error("Failed to decline senior:", error);
    }
  };

  const handleCloseApproveModal = () => {
    setShowApproveModal(false);
    setSelectedSeniorId(null);
  };

  const handleCloseDeclineModal = () => {
    setShowDeclineModal(false);
    setSelectedSeniorId(null);
  };

  const renderActions = (item: SeniorCitizenTableRow) => (
    <div className="d-grid gap-2">
      <button
        className="btn btn-primary btn-sm w-100"
        onClick={() => handleViewSenior(item.id)}
      >
        View
      </button>
      <button
        className="btn btn-success btn-sm w-100"
        onClick={() => handleApproveSenior(item.id)}
      >
        Approve
      </button>
      <button
        className="btn btn-danger btn-sm w-100"
        onClick={() => handleDeclineSenior(item.id)}
      >
        Decline
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

      {/* Approve Modal */}
      <ApproveModal
        show={showApproveModal}
        onHide={handleCloseApproveModal}
        onSubmit={handleApproveSubmit}
        loading={approveLoading}
        error={approveError}
      />

      {/* Decline Modal */}
      <DeclineModal
        show={showDeclineModal}
        onHide={handleCloseDeclineModal}
        onSubmit={handleDeclineSubmit}
        loading={declineLoading}
        error={declineError}
      />
    </section>
  );
}
