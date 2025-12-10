"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useBarangays } from "@/hooks/options";
import { useAuth } from "@/context/AuthContext";

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
  imageAccessor?: keyof T; // Optional accessor for image column
  renderActions?: (item: T) => React.ReactNode;
}

export default function DataTable<T extends { id: number | string }>({
  title,
  data,
  columns,
  pageSizeOptions = [5, 10, 25],
  defaultPageSize = 10,
  searchableField,
  imageAccessor,
  renderActions,
}: DataTableProps<T>) {
  const { user } = useAuth();
  const { data: barangayOptions } = useBarangays();
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [imageUrls, setImageUrls] = useState<Map<string | number, string>>(
    new Map()
  );
  const imageUrlsRef = useRef<Map<string | number, string>>(new Map());

  const hasBarangayColumn = useMemo(
    () => columns.some((c) => String(c.accessor) === "barangay"),
    [columns]
  );
  const barangayAccessor = useMemo(() => {
    const col = columns.find((c) => String(c.accessor) === "barangay");
    return col?.accessor as keyof T | undefined;
  }, [columns]);

  const filteredData = useMemo(() => {
    let next = data;
    if (searchTerm && searchableField) {
      next = next.filter((item) =>
        String(item[searchableField])
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    if (selectedBarangay && barangayAccessor) {
      next = next.filter(
        (item) => String(item[barangayAccessor]) === selectedBarangay
      );
    }
    return next;
  }, [data, searchTerm, searchableField, selectedBarangay, barangayAccessor]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, pageSize, currentPage]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Helper function to convert Buffer/Blob photo to URL (similar to SeniorForm)
  const resolvePhotoToUrl = async (photo: any): Promise<string | null> => {
    if (!photo) {
      return null;
    }

    // If it's already a string (URL or file path), return it
    if (typeof photo === "string") {
      // If it's a file path, we might need to construct a full URL
      if (photo.startsWith("http") || photo.startsWith("data:")) {
        return photo;
      } else {
        // Assume it's a file path, construct URL
        return `http://localhost:8000/${photo}`;
      }
    }

    if (
      photo &&
      typeof photo === "object" &&
      (photo.type === "Buffer" || Array.isArray(photo.data))
    ) {
      try {
        const bytes: number[] = photo.type === "Buffer" ? photo.data : photo;
        const uint8 = new Uint8Array(bytes);
        const blob = new Blob([uint8.buffer], { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        return url;
      } catch (err) {
        console.warn("Failed to convert Buffer photo to blob URL", err);
        return null;
      }
    }

    // If it's already a Blob
    if (photo instanceof Blob) {
      return URL.createObjectURL(photo);
    }

    return null;
  };

  // Resolve images for paginated data when imageAccessor is provided
  useEffect(() => {
    if (!imageAccessor) return;

    let active = true;
    const newImageUrls = new Map<string | number, string>();

    const resolveImages = async () => {
      // Revoke previous blob URLs that are no longer needed
      const prevUrls = imageUrlsRef.current;
      const currentItemIds = new Set(paginatedData.map((item) => item.id));
      
      prevUrls.forEach((url, itemId) => {
        if (!currentItemIds.has(itemId) && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
          prevUrls.delete(itemId);
        }
      });

      // Resolve images for current paginated data
      for (const item of paginatedData) {
        // Skip if URL already exists
        if (prevUrls.has(item.id)) {
          newImageUrls.set(item.id, prevUrls.get(item.id)!);
          continue;
        }

        const photoData = item[imageAccessor];
        if (photoData) {
          const url = await resolvePhotoToUrl(photoData);
          if (url && active) {
            newImageUrls.set(item.id, url);
          }
        }
      }

      if (active) {
        imageUrlsRef.current = newImageUrls;
        setImageUrls(newImageUrls);
      }
    };

    resolveImages();

    return () => {
      active = false;
    };
  }, [paginatedData, imageAccessor]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      imageUrlsRef.current.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      imageUrlsRef.current.clear();
    };
  }, []);

  return (
    <div className="container p-4 card">
      {/* Title + Search */}
      {(title || searchableField || (hasBarangayColumn && user?.role !== "barangay")) && (
        <div className="row mb-3">
          <div className="col-12 col-md-6 mb-2 mb-md-0 d-flex align-items-center">
            {title && <h2 className="h5 mb-0">{title}</h2>}
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
            {hasBarangayColumn && user?.role !== "barangay" && (
              <select
                className="form-select"
                style={{ maxWidth: "220px", width: "100%" }}
                value={selectedBarangay}
                onChange={(e) => {
                  setSelectedBarangay(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Barangays</option>
                {barangayOptions.map((opt) => (
                  <option key={opt.id} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
            )}
            {searchableField && (
              <input
                type="text"
                className="form-control"
                style={{ maxWidth: "250px", width: "100%" }}
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
          <table
            className="table table-striped table-hover"
            style={{ minWidth: "800px" }}
          >
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
                  {columns.map((col) => {
                    const isImageColumn = imageAccessor === col.accessor;
                    const imageUrl = isImageColumn ? imageUrls.get(item.id) : null;

                    return (
                      <td key={String(col.accessor)}>
                        {isImageColumn ? (
                          imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={String(item[col.accessor]) || "Image"}
                              className="img-thumbnail"
                              style={{
                                maxWidth: "80px",
                                maxHeight: "80px",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                console.log("Image failed to load:", e);
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML =
                                    '<div class="text-muted">No image</div>';
                                }
                              }}
                            />
                          ) : (
                            <div className="text-muted">No image</div>
                          )
                        ) : (
                          String(item[col.accessor])
                        )}
                      </td>
                    );
                  })}
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
      <div className="row mt-3">
        <div className="col-12 d-flex flex-wrap justify-content-between align-items-center gap-2">
          {/* Page size selector */}
          <div>
            <select
              className="form-select"
              style={{ width: "auto" }}
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

          {/* Page navigation */}
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="bi bi-chevron-double-left"></i>
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              className="btn btn-outline-secondary"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <i className="bi bi-chevron-double-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
