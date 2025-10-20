"use client";

import { useGetSenior } from "@/hooks/useGetSenior";
import SeniorForm from "@/components/SeniorForm";
import { useParams } from "next/navigation";

export default function ViewSeniorPage() {
  const params = useParams();
  const seniorId = params.id ? parseInt(params.id as string) : null;
  const { senior, loading, error } = useGetSenior(seniorId);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-3" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>Failed to load senior citizen: {error.message}</p>
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
            <h1 className="mb-4">View Senior Citizen</h1>
          </div>
        </div>
      </div>
      <SeniorForm
        mode="view"
        initialData={initialData}
        onSubmit={() => {}} // No-op for view mode
      />
    </div>
  );
}
