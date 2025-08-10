"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "../((context))/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface NavRoute {
  route: string;
  label: string;
  iconClassName: string;
  subRoutes?: NavRoute[];
}

const NAV_ROUTES: NavRoute[] = [
  {
    route: "dashboard",
    label: "Dashboard",
    iconClassName: "bi bi-speedometer2",
  },
  {
    route: "add-senior",
    label: "Add Senior",
    iconClassName: "bi bi-person-fill-add",
  },
  {
    route: "barangays",
    label: "Barangays",
    iconClassName: "bi bi-geo-alt-fill",
  },
  {
    route: "pending-profiles",
    label: "Pending Profiles",
    iconClassName: "bi bi-check-lg",
  },
  {
    route: "deceased-seniors",
    label: "Deceased Seniors",
    iconClassName: "bi bi-flower3",
  },
  {
    route: "generate-backup",
    label: "Generate Backup",
    iconClassName: "bi bi-cloud-arrow-down-fill",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav className="col-md-2 d-none d-md-block sidebar border-end">
            <div className="text-center py-4">
              <img
                src="/kevin/SC_LOGO.png"
                alt="Logo"
                className="img-fluid rounded-circle mb-2"
                style={{ maxWidth: "100px" }}
              />
            </div>
            <ul className="nav flex-column px-1">
              {NAV_ROUTES.map((navRoute) => {
                return (
                  <li className="nav-item" key={navRoute.route}>
                    <Link
                      className="nav-link d-flex align-items-center gap-2 fw-bold"
                      href={navRoute.route}
                    >
                      <i className={navRoute.iconClassName}></i>
                      {navRoute.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <hr></hr>
          </nav>

          {/* Main Area */}
          <div className="col-md-10 ms-sm-auto px-0">
            {/* Top Navbar inside main area */}
            {/* <nav className="navbar navbar-expand-lg bg-body-tertiary">
              <div className="container-fluid">
                <span className="navbar-brand fw-bold text-uppercase">
                  Web-Based Senior Citizen Portal Information Management System
                </span>

                <div className="ms-auto">
                  <button className="btn btn-danger btn-sm" onClick={logout}>
                    <i className="bi bi-box-arrow-right"></i>
                  </button>
                </div>
              </div>
            </nav> */}

            {/* Main Content */}
            <main className="px-4 py-4" style={{ minHeight: "90vh" }}>
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
