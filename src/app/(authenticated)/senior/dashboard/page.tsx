"use client";

export default function DashboardPage() {
  return (
    <section className="pt-4">
      <div className="container-fluid">
        {/* Summary Card */}
        <div className="row mb-4 justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white fw-bold text-center">
                Total Seniors per Barangay
              </div>
              <div className="card-body text-center">
                <p className="mb-1">
                  Barangay: <strong>Ponong</strong>
                </p>
                <p>
                  Total Alive Seniors: <strong>1</strong>
                </p>
                <p>
                  Total Deceased Seniors: <strong>0</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Cards */}
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white fw-bold">
                Pension Status
              </div>
              <div className="card-body d-flex align-items-center justify-content-center">
                <div
                  className="rounded-circle bg-light border"
                  style={{ width: "180px", height: "180px" }}
                ></div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white fw-bold">
                Marital Status
              </div>
              <div className="card-body d-flex align-items-center justify-content-center">
                <div
                  className="rounded-circle bg-light border"
                  style={{ width: "180px", height: "180px" }}
                ></div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white fw-bold">
                Gender Breakdown
              </div>
              <div className="card-body d-flex align-items-center justify-content-center">
                <div
                  className="rounded-circle bg-light border"
                  style={{ width: "180px", height: "180px" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
