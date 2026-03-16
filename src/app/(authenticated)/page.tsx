"use client";

import { useMemo, useState } from "react";
import { useDashboardAnalytics } from "@/hooks/analytics/useDashboardAnalytics";
import PieChart from "@/components/charts/PieChart";
import BarChart from "@/components/charts/BarChart";
import { useAuth } from "@/context/AuthContext";
import AnalyticsDetailModal, {
  SelectedSegment,
} from "@/components/analytics/AnalyticsDetailModal";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    gender,
    ages,
    assistances,
    vaccines,
    usersPerRole,
    usersPerBarangay,
    deadAliveCount,
    loading,
    error,
  } = useDashboardAnalytics();

  const isAdmin = user?.role === "admin";

  const [selectedSegment, setSelectedSegment] = useState<SelectedSegment | null>(
    null
  );

  const genderTotal = useMemo(
    () => gender.reduce((s, i) => s + i.count, 0),
    [gender]
  );

  const colors = [
    "#0d6efd",
    "#20c997",
    "#ffc107",
    "#6f42c1",
    "#fd7e14",
    "#dc3545",
  ]; // bootstrap palette

  const genderPieData = useMemo(
    () =>
      gender.map((g) => ({
        label: g.sexAtBirth,
        value: g.count,
        sexAtBirth: g.sexAtBirth,
      })),
    [gender]
  );

  const deadAlivePieData = useMemo(
    () =>
      deadAliveCount
        .filter((d) => Number(d.count) > 0)
        .map((d) => ({
          label: d.status.charAt(0).toUpperCase() + d.status.slice(1),
          value: Number(d.count),
          status: d.status,
        })),
    [deadAliveCount]
  );

  const usersPerRolePieData = useMemo(
    () =>
      usersPerRole.map((r) => ({
        label: r.role,
        value: r.count,
        role: r.role,
      })),
    [usersPerRole]
  );

  return (
    <section className="pt-4">
      <div className="container-fluid">
        {!isAdmin && (
          <>
            {/* Charts Row 1 */}
            <div className="row">
              {/* Gender Distribution - Pie */}
              <div className="col-md-4 mb-4">
                <div className="card shadow-sm">
                  <div className="card-header bg-primary text-white fw-bold">
                    Gender Distribution
                  </div>
                  <div className="card-body d-flex align-items-center justify-content-center">
                    {gender.length === 0 ? (
                      <span className="text-muted">No data</span>
                    ) : (
                      <PieChart
                        data={genderPieData}
                        colors={colors}
                        size={200}
                        onSliceClick={(item) =>
                          setSelectedSegment({
                            metric: "gender-distribution",
                            label: item.label,
                            filters: { sexAtBirth: item.sexAtBirth },
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Active/Deceased Distribution - Pie */}
              <div className="col-md-4 mb-4">
                <div className="card shadow-sm">
                  <div className="card-header bg-primary text-white fw-bold">
                    Active/Deceased Distribution
                  </div>
                  <div className="card-body d-flex align-items-center justify-content-center">
                    {deadAlivePieData.length === 0 ? (
                      <span className="text-muted">No data</span>
                    ) : (
                      <PieChart
                        data={deadAlivePieData}
                        colors={colors}
                        size={200}
                        onSliceClick={(item) =>
                          setSelectedSegment({
                            metric: "dead-alive-count",
                            label: item.label,
                            filters: { status: item.status },
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Age Demographics - Bar */}
              <div className="col-md-4 mb-4">
                <div className="card shadow-sm">
                  <div className="card-header bg-primary text-white fw-bold">
                    Age Demographics
                  </div>
                  <div className="card-body">
                    {ages.length === 0 ? (
                      <span className="text-muted">No data</span>
                    ) : (
                      <BarChart
                        items={ages.map((a) => ({
                          label: a.bucket,
                          value: a.count,
                          bucket: a.bucket,
                        }))}
                        colors={colors}
                        onBarClick={(item) =>
                          setSelectedSegment({
                            metric: "age-demographics",
                            label: item.label,
                            filters: { bucket: item.bucket },
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="row">
              {/* Assistance Received - Bar */}
              <div className="col-md-6 mb-4">
                <div className="card shadow-sm">
                  <div className="card-header bg-primary text-white fw-bold">
                    Assistance Received
                  </div>
                  <div className="card-body">
                    {assistances.length === 0 ? (
                      <span className="text-muted">No data</span>
                    ) : (
                      <BarChart
                        items={assistances.map((a) => ({
                          label: a.name,
                          value: a.count,
                          assistanceId: a.assistanceId,
                        }))}
                        colors={colors}
                        onBarClick={(item) =>
                          setSelectedSegment({
                            metric: "assistance",
                            label: item.label,
                            filters: { assistanceId: item.assistanceId },
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Vaccination Coverage - Bar */}
              <div className="col-md-6 mb-4">
                <div className="card shadow-sm">
                  <div className="card-header bg-primary text-white fw-bold">
                    Vaccination Coverage
                  </div>
                  <div className="card-body">
                    {vaccines.length === 0 ? (
                      <span className="text-muted">No data</span>
                    ) : (
                      <BarChart
                        items={vaccines.map((v) => ({
                          label: v.name,
                          value: v.count,
                          vaccineId: v.vaccineId,
                        }))}
                        colors={colors}
                        onBarClick={(item) =>
                          setSelectedSegment({
                            metric: "vaccines",
                            label: item.label,
                            filters: { vaccineId: item.vaccineId },
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Charts Row 3 - Admin Only */}
        {isAdmin && (
          <div className="row">
            {/* Users Per Role - Pie */}
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white fw-bold">
                  Users Per Role
                </div>
                <div className="card-body d-flex align-items-center justify-content-center">
                  {usersPerRole.length === 0 ? (
                    <span className="text-muted">No data</span>
                  ) : (
                    <PieChart
                      data={usersPerRolePieData}
                      colors={colors}
                      size={200}
                      onSliceClick={(item) =>
                        setSelectedSegment({
                          metric: "users-per-role",
                          label: item.label,
                          filters: { role: item.role },
                        })
                      }
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Users Per Barangay - Bar */}
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white fw-bold">
                  Users Per Barangay
                </div>
                <div className="card-body">
                  {usersPerBarangay.length === 0 ? (
                    <span className="text-muted">No data</span>
                  ) : (
                    <BarChart
                      items={usersPerBarangay.map((b) => ({
                        label: b.name,
                        value: b.count,
                        barangayId: b.barangayId,
                      }))}
                      colors={colors}
                      onBarClick={(item) =>
                        setSelectedSegment({
                          metric: "users-per-barangay",
                          label: item.label,
                          filters: { barangayId: item.barangayId },
                        })
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <AnalyticsDetailModal
        isOpen={!!selectedSegment}
        segment={selectedSegment}
        onClose={() => setSelectedSegment(null)}
      />
    </section>
  );
}
