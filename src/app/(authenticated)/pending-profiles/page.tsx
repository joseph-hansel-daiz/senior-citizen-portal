"use client";

import ApproveModal from "@/components/ApproveModal";
import DataTable, { Column } from "@/components/DataTable";
import DeclineModal from "@/components/DeclineModal";
import SeniorFormModal from "@/components/SeniorFormModal";
import { useApproveSenior } from "@/hooks/useApproveSenior";
import { useDeclineSenior } from "@/hooks/useDeclineSenior";
import { useSeniors } from "@/hooks/useSeniors";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface SeniorCitizenTableRow {
  id: number;
  photo: Blob | null | undefined;
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
  const { user } = useAuth();
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

  const pendingSeniors = seniors.filter(
    (senior) => !senior.isDeceased && senior.status === "Pending"
  );

  const data: SeniorCitizenTableRow[] = pendingSeniors.map((senior) => {
    const birthDate = senior.birthDate ? new Date(senior.birthDate) : null;
    const age = birthDate
      ? new Date().getFullYear() - birthDate.getFullYear()
      : 0;
    const livingStatus =
      senior.livingConditionNames && senior.livingConditionNames.length > 0
        ? "With Family"
        : "Alone";
    return {
      id: senior.id,
      photo: senior.photo,
      fullName: senior.displayName,
      age,
      address: senior.address,
      contact: senior.contactNumber || "N/A",
      livingStatus,
      hasPension: senior.hasPension ? "Yes" : "No",
      barangay: senior.barangay?.name ?? "N/A",
    };
  });

  const columns: Column<SeniorCitizenTableRow>[] = [
    { label: "Photo", accessor: "photo" },
    { label: "Barangay", accessor: "barangay" },
    { label: "Full Name", accessor: "fullName" },
    { label: "Age", accessor: "age" },
    { label: "Address", accessor: "address" },
    { label: "Contact #", accessor: "contact" },
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

  const renderActions = (item: SeniorCitizenTableRow) => {
    if (user?.role === "barangay") {
      return (
        <div className="d-flex gap-1">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleViewSenior(item.id)}
            title="View"
          >
            <i className="bi bi-eye"></i>
          </button>
        </div>
      );
    }

    return (
      <div className="d-flex gap-1">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => handleViewSenior(item.id)}
          title="View"
        >
          <i className="bi bi-eye"></i>
        </button>
        <button
          className="btn btn-success btn-sm"
          onClick={() => handleApproveSenior(item.id)}
          title="Approve"
        >
          <i className="bi bi-check-circle"></i>
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => handleDeclineSenior(item.id)}
          title="Decline"
        >
          <i className="bi bi-x-circle"></i>
        </button>
      </div>
    );
  };

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
        imageAccessor="photo"
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
