"use client";

import { useGetSenior } from "@/hooks/useGetSenior";
import { useUpdateSenior } from "@/hooks/useUpdateSenior";
import SeniorForm from "@/components/SeniorForm";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function EditSeniorPage() {
  const params = useParams();
  const seniorId = params.id ? parseInt(params.id as string) : null;
  const { senior, loading: loadingSenior, error: errorSenior } = useGetSenior(seniorId);
  const { updateSenior, loading: updating, error: updateError, data: updateData } = useUpdateSenior();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  const handleSubmit = async (payload: any) => {
    if (!seniorId) return;
    
    try {
      await updateSenior(seniorId, payload);
      setSuccessMessage("Senior citizen updated successfully!");
    } catch (err) {
      console.error("Error updating senior:", err);
    }
  };

  if (loadingSenior) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (errorSenior) {
    return (
      <div className="alert alert-danger mt-3" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>Failed to load senior citizen: {errorSenior.message}</p>
      </div>
    );
  }

  if (!senior) {
    return (
      <div className="alert alert-warning mt-3" role="alert">
        <h4 className="alert-heading">Not Found</h4>
        <p>Senior citizen not found.</p>
      </div>
    );
  }

  // Pass the full senior data structure
  const initialData = senior;

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4">Edit Senior Citizen</h1>
          </div>
        </div>
      </div>
      <SeniorForm
        mode="update"
        initialData={initialData}
        onSubmit={handleSubmit}
        loading={updating}
        error={updateError}
        successMessage={successMessage}
      />
    </div>
  );
}
