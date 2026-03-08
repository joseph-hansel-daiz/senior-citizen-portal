"use client";

import DataTable, { Column } from "@/components/DataTable";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import SeniorFormModal from "@/components/SeniorFormModal";
import { useSeniors } from "@/hooks/useSeniors";
import { useUnmarkDeceased } from "@/hooks/useUnmarkDeceased";
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
  dateOfDeath: string;
}

export default function DashboardPage() {
  const { data: seniors, loading, error } = useSeniors();
  const [selectedSeniorId, setSelectedSeniorId] = useState<number | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUnmarkConfirm, setShowUnmarkConfirm] = useState(false);
  const {
    unmarkDeceased,
    loading: unmarking,
    error: unmarkError,
  } = useUnmarkDeceased();
  const { user } = useAuth();

  // Deceased page needs dateOfDeath; list DTO does not include it. Filter by isDeceased and fetch detail for dateOfDeath, or we need backend to include dateOfDeath in list when isDeceased.
  // Backend list DTO does not include dateOfDeath. So we filter by isDeceased and show list; for dateOfDeath we could show "—" or add it to list DTO later. For now use a placeholder or omit column.
  const deceasedSeniors = seniors.filter((senior) => senior.isDeceased);

  const data: SeniorCitizenTableRow[] = deceasedSeniors.map((senior) => {
    const birthDate = senior.birthDate ? new Date(senior.birthDate) : null;
    const age = birthDate
      ? new Date().getFullYear() - birthDate.getFullYear()
      : 0;
    const livingStatus =
      senior.livingConditionNames && senior.livingConditionNames.length > 0
        ? "With Family"
        : "Alone";
    const dateOfDeath = senior.dateOfDeath
      ? new Date(senior.dateOfDeath).toLocaleDateString()
      : "N/A";
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
      dateOfDeath,
    };
  });

  const columns: Column<SeniorCitizenTableRow>[] = [
    { label: "Photo", accessor: "photo" },
    { label: "Barangay", accessor: "barangay" },
    { label: "Full Name", accessor: "fullName" },
    { label: "Age", accessor: "age" },
    { label: "Date of Death", accessor: "dateOfDeath" },
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
    setShowUnmarkConfirm(false);
    setSelectedSeniorId(null);
  };

  const handleUnmarkDeceased = (seniorId: number) => {
    setSelectedSeniorId(seniorId);
    setShowUnmarkConfirm(true);
  };

  const renderActions = (item: SeniorCitizenTableRow) => {
    if (user?.role === "viewOnly") {
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
          className="btn btn-secondary btn-sm"
          onClick={() => handleUnmarkDeceased(item.id)}
          title="Unmark as Deceased"
        >
          <i className="bi bi-person-check"></i>
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
        title="Deceased Citizens"
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

      {/* Unmark Confirm Modal */}
      <DeleteConfirmModal
        show={showUnmarkConfirm}
        onHide={handleCloseModal}
        onConfirm={async () => {
          if (!selectedSeniorId) return;
          try {
            await unmarkDeceased(selectedSeniorId);
            handleCloseModal();
            // Reload the page to refresh the data
            window.location.reload();
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
