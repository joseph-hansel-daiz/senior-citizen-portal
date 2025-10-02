"use client";

import { useState, useMemo } from "react";

export interface Column<T> {
  label: string;
  accessor: keyof T;
}

interface DataTableProps<T extends { id: number | string }> {
  title?: string;
  data: T[];
  columns: Column<T>[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  searchableField?: keyof T;
  renderActions?: (item: T) => React.ReactNode;
}

export default function DataTable<T extends { id: number | string }>({
  title,
  data,
  columns,
  pageSizeOptions = [5, 10, 25],
  defaultPageSize = 10,
  searchableField,
  renderActions,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!searchTerm || !searchableField) return data;
    return data.filter((item) =>
      String(item[searchableField])
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm, searchableField]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, pageSize, currentPage]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="container p-5 card">
      {/* Title + Search */}
      {(title || searchableField) && (
        <div className="row mb-3 align-items-center">
          <div className="col text-start">
            {title && <h2 className="mb-0">{title}</h2>}
          </div>
          <div className="col text-end">
            {searchableField && (
              <input
                type="text"
                className="form-control"
                style={{ width: "250px", display: "inline-block" }}
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="row">
        <div className="table-responsive">
          <table className="table" style={{ minWidth: "800px" }}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={String(col.accessor)} scope="col">
                    {col.label}
                  </th>
                ))}
                {renderActions && <th scope="col">Action</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id}>
                  {columns.map((col) => (
                    <td key={String(col.accessor)}>
                      {String(item[col.accessor])}
                    </td>
                  ))}
                  {renderActions && <td>{renderActions(item)}</td>}
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + (renderActions ? 1 : 0)}
                    className="text-center"
                  >
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="row align-items-center mt-3">
        <div className="col-auto">
          <select
            className="form-select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <button
            className="btn btn-outline-secondary m-2"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="bi bi-chevron-double-left"></i>
          </button>
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            className="btn btn-outline-secondary m-2"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <i className="bi bi-chevron-double-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
