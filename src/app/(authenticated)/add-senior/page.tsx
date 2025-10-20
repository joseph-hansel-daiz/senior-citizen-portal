"use client";

import { useCreateSenior } from "@/hooks/useCreateSenior";
import SeniorForm from "@/components/SeniorForm";

export default function AddSeniorPage() {
  const { createSenior, loading, error, data } = useCreateSenior();

  const handleSubmit = async (payload: any) => {
    try {
      await createSenior(payload);
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
