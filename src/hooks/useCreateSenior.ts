import { useState } from "react";
import { SeniorCitizen, SeniorCitizenCreateInput } from "@/types/senior-citizen.types";

export function useCreateSenior() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<SeniorCitizen | null>(null);

  const createSenior = async (payload: SeniorCitizenCreateInput) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Check if there's a photo to upload
      const hasPhoto = payload.photo && payload.photo instanceof Blob;
      
      let response;
      if (hasPhoto) {
        // Use FormData for multipart upload
        const formData = new FormData();
        
        // Add photo file
        formData.append('photo', payload.photo as Blob, 'photo.jpg');
        
        // Add other data as JSON string
        const { photo, ...otherData } = payload;
        formData.append('data', JSON.stringify(otherData));
        
        response = await fetch("http://localhost:8000/seniors", {
          method: "POST",
          body: formData, // Don't set Content-Type header, let browser set it with boundary
        });
      } else {
        // Use JSON for regular data
        response = await fetch("http://localhost:8000/seniors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSenior,
    loading,
    error,
    data,
  };
}
