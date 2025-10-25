"use client";

import DataTable, { Column } from "@/components/DataTable";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import MarkDeceasedModal from "@/components/MarkDeceasedModal";
import SeniorFormModal from "@/components/SeniorFormModal";
import { useDeleteSenior } from "@/hooks/useDeleteSenior";
import { useMarkDeceased } from "@/hooks/useMarkDeceased";
import { useSeniors } from "@/hooks/useSeniors";
import { useUpdateSenior } from "@/hooks/useUpdateSenior";
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSeniorId, setSelectedSeniorId] = useState<number | null>(null);
  const {
    updateSenior,
    loading: updating,
    error: updateError,
  } = useUpdateSenior();
  const {
    markDeceased,
    loading: marking,
    error: markError,
  } = useMarkDeceased();
  const {
    deleteSenior,
    loading: deleting,
    error: deleteError,
  } = useDeleteSenior();
  const [showMarkDeceased, setShowMarkDeceased] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Filter out deceased seniors and non-active seniors
  const activeSeniors = seniors.filter((senior) => {
    // Filter out deceased seniors
    if (senior.DeathInfo) {
      return false;
    }

    // Filter out seniors without Active status
    if (
      senior.SeniorStatusHistories &&
      senior.SeniorStatusHistories.length > 0
    ) {
      // Check if any status history entry is 'Active'
      const hasActiveStatus = senior.SeniorStatusHistories.some(
        (history) => history.status === "Active"
      );
      if (!hasActiveStatus) {
        return false;
      }
    } else {
      // If no status history, exclude the senior
      return false;
    }

    return true;
  });

  // Transform backend data to match table structure
  const data: SeniorCitizenTableRow[] = activeSeniors.map((senior) => {
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

  const handleEditSenior = (seniorId: number) => {
    setSelectedSeniorId(seniorId);
    setShowEditModal(true);
  };

  const handleMarkDeceased = (seniorId: number) => {
    setSelectedSeniorId(seniorId);
    setShowMarkDeceased(true);
  };

  const handleDelete = (seniorId: number) => {
    setSelectedSeniorId(seniorId);
    setShowDeleteConfirm(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowMarkDeceased(false);
    setShowDeleteConfirm(false);
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
        className="btn btn-secondary btn-sm w-100"
        onClick={() => handleEditSenior(item.id)}
      >
        Edit
      </button>
      <button
        className="btn btn-warning btn-sm w-100"
        onClick={() => handleMarkDeceased(item.id)}
      >
        Mark as Deceased
      </button>
      <button
        className="btn btn-danger btn-sm w-100"
        onClick={() => handleDelete(item.id)}
      >
        Delete
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

      {/* Edit Modal - Now loads full data by seniorId */}
      <SeniorFormModal
        show={showEditModal}
        onHide={handleCloseModal}
        title="Edit Senior Citizen"
        mode="update"
        seniorId={selectedSeniorId}
        onSubmit={async (payload) => {
          if (!selectedSeniorId) return;
          try {
            await updateSenior(selectedSeniorId, payload);
            handleCloseModal();
            // Reload the page to refresh the data
            window.location.reload();
          } catch (e) {
            // error is surfaced via updateError
          }
        }}
        loading={updating}
        error={updateError}
      />

      {/* Mark as Deceased Modal */}
      <MarkDeceasedModal
        show={showMarkDeceased}
        onHide={handleCloseModal}
        onSubmit={async ({ dateOfDeath, deathCertificate }) => {
          if (!selectedSeniorId) return;
          try {
            await markDeceased(selectedSeniorId, {
              dateOfDeath,
              deathCertificate,
            });
            handleCloseModal();
            // Reload the page to refresh the data
            window.location.reload();
          } catch {}
        }}
        loading={marking}
        error={markError}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        show={showDeleteConfirm}
        onHide={handleCloseModal}
        onConfirm={async () => {
          if (!selectedSeniorId) return;
          try {
            await deleteSenior(selectedSeniorId);
            handleCloseModal();
            // Reload the page to refresh the data
            window.location.reload();
          } catch {}
        }}
        loading={deleting}
        error={deleteError}
      />
    </section>
  );
}
