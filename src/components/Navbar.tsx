"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface NavRoute {
  route: string;
  label: string;
  iconClassName: string;
}

const NAV_ROUTES: NavRoute[] = [
  {
    route: "/senior/dashboard",
    label: "Dashboard",
    iconClassName: "bi bi-speedometer2",
  },
  {
    route: "/senior/add-senior",
    label: "Add Senior",
    iconClassName: "bi bi-person-fill-add",
  },
  {
    route: "/senior/barangays",
    label: "Barangays",
    iconClassName: "bi bi-geo-alt-fill",
  },
  {
    route: "/senior/pending-profiles",
    label: "Pending Profiles",
    iconClassName: "bi bi-check-lg",
  },
  {
    route: "/senior/deceased-seniors",
    label: "Deceased Seniors",
    iconClassName: "bi bi-flower3",
  },
  {
    route: "/senior/generate-backup",
    label: "Generate Backup",
    iconClassName: "bi bi-cloud-arrow-down-fill",
  },
];

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <div className="container-fluid">
      {/* ===== Desktop Sidebar ===== */}
      <aside
        className="d-none d-md-flex flex-column border-end position-fixed top-0 start-0 p-0 bg-body-tertiary"
        style={{ width: 240, height: "100vh", zIndex: 1040 }}
        aria-label="Sidebar"
      >
        <div className="text-center py-4 px-3">
          <img
            src="/kevin/SC_LOGO.png"
            alt="Logo"
            className="img-fluid rounded-circle mb-2"
            style={{ maxWidth: 100 }}
          />
          <div className="fw-bold text-uppercase small text-break">
            Senior Citizen Portal
          </div>
        </div>

        <ul className="nav flex-column px-1">
          {NAV_ROUTES.map((nav) => (
            <li className="nav-item" key={nav.route}>
              <Link
                className="nav-link d-flex align-items-center gap-2 fw-bold"
                href={`${nav.route}`}
              >
                <i className={nav.iconClassName}></i>
                {nav.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto p-3 border-top gap-3">
          <button className="btn btn-primary w-100 mb-2" onClick={logout}>
            <i className="bi bi-box-arrow-right me-2"></i> My Account
          </button>
          <button className="btn btn-danger w-100" onClick={logout}>
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </div>
      </aside>

      {/* ===== Mobile Navbar ===== */}
      <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top d-md-none">
        <div className="container-fluid">
          <Link className="navbar-brand mb-1" href={"/"}>
            <div className="fw-bold text-uppercase small text-break">
              Senior Citizen Portal
            </div>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              {NAV_ROUTES.map((nav) => {
                return (
                  <Link
                    className="nav-item nav-link fw-bold"
                    key={nav.route}
                    href={nav.route}
                  >
                    <i className={`${nav.iconClassName} mx-2`}></i>
                    {nav.label}
                  </Link>
                );
              })}
            </div>
            <div className="ms-auto d-flex align-items-center gap-2">
              <button className="btn btn-primary w-100" onClick={logout}>
                <i className="bi bi-box-arrow-right me-2"></i> My Account
              </button>
              <button className="btn btn-danger w-100" onClick={logout}>
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
