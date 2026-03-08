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
import { useAuth } from "@/context/AuthContext";
import * as XLSX from "xlsx";

interface SeniorCitizenTableRow {
  id: number;
  photo: Blob | null | undefined;
  fullName: string;
  age: number;
  birthYear: number;
  address: string;
  contact: string;
  livingStatus: string;
  hasPension: string;
  barangay: string;
}

export default function DashboardPage() {
  const [selectedBirthYear, setSelectedBirthYear] = useState<string>("");
  const filter =
    selectedBirthYear && !Number.isNaN(Number(selectedBirthYear))
      ? { birthYear: Number(selectedBirthYear) }
      : undefined;
  const { data: seniors, loading, error } = useSeniors(filter);
  const { user } = useAuth();
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

  // Filter: list DTO already has status and isDeceased
  const activeSeniors = seniors.filter(
    (senior) => !senior.isDeceased && senior.status === "Active"
  );

  const data: SeniorCitizenTableRow[] = activeSeniors.map((senior) => {
    const birthDate = senior.birthDate ? new Date(senior.birthDate) : null;
    const age = birthDate
      ? new Date().getFullYear() - birthDate.getFullYear()
      : 0;
    const birthYear = birthDate ? birthDate.getFullYear() : 0;
    const livingStatus =
      senior.livingConditionNames && senior.livingConditionNames.length > 0
        ? "With Family"
        : "Alone";
    return {
      id: senior.id,
      photo: senior.photo,
      fullName: senior.displayName,
      age,
      birthYear,
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

  const handleExport = (
    filteredData: SeniorCitizenTableRow[],
    columns: Column<SeniorCitizenTableRow>[],
  ) => {
    // Filter out the photo column from export
    const exportColumns = columns.filter((col) => col.accessor !== "photo");

    // Prepare data for export
    const exportData = filteredData.map((row) => {
      const rowData: Record<string, any> = {};
      exportColumns.forEach((col) => {
        rowData[col.label] = row[col.accessor];
      });
      return rowData;
    });

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Senior Citizens");

    // Generate filename with current date
    const date = new Date().toISOString().split("T")[0];
    const filename = `senior-citizens-${date}.xlsx`;

    // Write file and trigger download
    XLSX.writeFile(wb, filename);
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
          onClick={() => handleEditSenior(item.id)}
          title="Edit"
        >
          <i className="bi bi-pencil"></i>
        </button>
        <button
          className="btn btn-warning btn-sm"
          onClick={() => handleMarkDeceased(item.id)}
          title="Mark as Deceased"
        >
          <i className="bi bi-person-x"></i>
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => handleDelete(item.id)}
          title="Delete"
        >
          <i className="bi bi-trash"></i>
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
        yearFilterAccessor="birthYear"
        yearFilterValue={selectedBirthYear}
        onYearFilterChange={setSelectedBirthYear}
        renderActions={renderActions}
        onExport={handleExport}
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
