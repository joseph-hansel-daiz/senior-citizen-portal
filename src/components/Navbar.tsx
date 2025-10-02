"use client";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { ROUTES } from "@/lib/constants";
import { ThemeEnum } from "@/lib/enums";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavRoute {
  route: string;
  label: string;
  iconClassName: string;
}

enum Role {
  ADMIN = "admin",
  OSCA = "osca",
  BARANGAY = "barangay",
  VIEW_ONLY = "viewOnly",
}

// ===== Route definitions =====
const ADMIN_ROUTES: NavRoute[] = [
  {
    route: ROUTES.GENERATE_BACKUP,
    label: "Generate Backup",
    iconClassName: "bi bi-cloud-arrow-down-fill",
  },
];

const OSCA_ROUTES: NavRoute[] = [
  {
    route: ROUTES.DASHBOARD,
    label: "Dashboard",
    iconClassName: "bi bi-bar-chart-fill",
  },
  {
    route: ROUTES.ADD_SENIOR,
    label: "Add Senior",
    iconClassName: "bi bi-person-fill-add",
  },
  {
    route: ROUTES.VIEW_SENIORS,
    label: "View Seniors",
    iconClassName: "bi bi-card-checklist",
  },
  {
    route: ROUTES.PENDING_PROFILES,
    label: "Pending Profiles",
    iconClassName: "bi bi-clock-history",
  },
  {
    route: ROUTES.DECEASED_SENIORS,
    label: "Deceased Seniors",
    iconClassName: "bi bi-flower3",
  },
];

const BARANGAY_ROUTES: NavRoute[] = [
  {
    route: ROUTES.DASHBOARD,
    label: "Dashboard",
    iconClassName: "bi bi-bar-chart-fill",
  },
  {
    route: ROUTES.ADD_SENIOR,
    label: "Add Senior",
    iconClassName: "bi bi-person-fill-add",
  },
  {
    route: ROUTES.VIEW_SENIORS,
    label: "View Seniors",
    iconClassName: "bi bi-card-checklist",
  },
  {
    route: ROUTES.DECEASED_SENIORS,
    label: "Deceased Seniors",
    iconClassName: "bi bi-flower3",
  },
];

const VIEW_ONLY_ROUTES: NavRoute[] = [
  {
    route: ROUTES.DASHBOARD,
    label: "Dashboard",
    iconClassName: "bi bi-bar-chart-fill",
  },
  {
    route: ROUTES.VIEW_SENIORS,
    label: "View Seniors",
    iconClassName: "bi bi-card-checklist",
  },
];

// Map roles to routes
const ROLE_ROUTES: Record<Role, NavRoute[]> = {
  [Role.ADMIN]: ADMIN_ROUTES,
  [Role.OSCA]: OSCA_ROUTES,
  [Role.BARANGAY]: BARANGAY_ROUTES,
  [Role.VIEW_ONLY]: VIEW_ONLY_ROUTES,
};

export default function Navbar() {
  const { logout, user } = useAuth();
  const { theme, toggle } = useTheme();
  const router = useRouter();

  const themeToggleIcon =
    theme?.theme === ThemeEnum.Dark ? (
      <i className="bi bi-moon-fill me-2"></i>
    ) : (
      <i className="bi bi-brightness-high-fill me-2"></i>
    );

  // Get role-based routes
  const navRoutes = user?.role ? ROLE_ROUTES[user?.role as Role] || [] : [];

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
          {navRoutes.map((nav) => (
            <li className="nav-item" key={nav.route}>
              <Link
                className="nav-link d-flex align-items-center gap-2 fw-bold"
                href={nav.route}
              >
                <i className={nav.iconClassName}></i>
                {nav.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto p-3 border-top gap-3">
          <button
            className={`btn ${
              theme?.theme === ThemeEnum.Dark ? "btn-light" : "btn-dark"
            } w-100 mb-2`}
            onClick={toggle}
          >
            {themeToggleIcon}
          </button>
          <button
            className="btn btn-primary w-100 mb-2"
            onClick={() => router.push(ROUTES.MY_ACCOUNT)}
          >
            My Account
          </button>
          <button className="btn btn-danger w-100" onClick={logout}>
            Logout
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
              {navRoutes.map((nav) => (
                <Link
                  className="nav-item nav-link fw-bold"
                  key={nav.route}
                  href={nav.route}
                >
                  <i className={`${nav.iconClassName} mx-2`}></i>
                  {nav.label}
                </Link>
              ))}
            </div>
            <div className="ms-auto d-flex align-items-center gap-2">
              <button
                className={`btn ${
                  theme?.theme === ThemeEnum.Dark ? "btn-light" : "btn-dark"
                } w-100`}
                onClick={toggle}
              >
                {themeToggleIcon}
              </button>
              <button
                className="btn btn-primary w-100"
                onClick={() => router.push(ROUTES.MY_ACCOUNT)}
              >
                My Account
              </button>
              <button className="btn btn-danger w-100" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
