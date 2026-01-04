"use client";

import { useMemo } from "react";
import DataTable from "@/components/DataTable";
import { useResetCodes, type ResetCodeRow } from "@/hooks/useResetCodes";

export default function ResetCodesPage() {
  const { data, loading, error, refetch } = useResetCodes();

  const rows = useMemo(() => data, [data]);
  const columns = [
    { label: "ID", accessor: "id" },
    { label: "User ID", accessor: "userId" },
    { label: "Username", accessor: "username" },
    { label: "Name", accessor: "userName" },
    { label: "Code", accessor: "code" },
    { label: "Created At", accessor: "createdAt" },
  ];

  // Format createdAt for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  // Transform rows to format dates
  const formattedRows = useMemo(() => {
    return rows.map((row) => ({
      ...row,
      createdAt: formatDate(row.createdAt),
    }));
  }, [rows]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error.message}
      </div>
    );
  }

  return (
    <section>
      <DataTable<ResetCodeRow>
        title="Password Reset Codes"
        data={formattedRows}
        columns={columns as any}
        searchableField="username"
      />
    </section>
  );
}

