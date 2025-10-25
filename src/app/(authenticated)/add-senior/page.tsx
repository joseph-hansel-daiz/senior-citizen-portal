"use client";

import { useCreateSenior } from "@/hooks/useCreateSenior";
import SeniorForm from "@/components/SeniorForm";
import { SeniorCitizenCreateInput, SeniorCitizenUpdateInput } from "@/types/senior-citizen.types";

export default function AddSeniorPage() {
  const { createSenior, loading, error, data } = useCreateSenior();

  const handleSubmit = async (payload: SeniorCitizenCreateInput | SeniorCitizenUpdateInput) => {
    try {
      await createSenior(payload as SeniorCitizenCreateInput);
      alert("Senior citizen created successfully!");
    } catch (err) {
      console.error("Error creating senior:", err);
    }
  };

  const successMessage = data ? `Senior citizen created successfully with ID: ${data.id}` : undefined;

  return (
    <SeniorForm
      mode="create"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      successMessage={successMessage}
    />
  );
}
