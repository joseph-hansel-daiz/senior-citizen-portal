"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

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
}: Readonly<{ children: React.ReactNode }>) {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <Sidebar>
        <main className="px-0">
          <div
            className="content-wrap px-4 py-4"
            style={{ minHeight: "100vh" }}
          >
            {children}
          </div>
        </main>
      </Sidebar>
    </ProtectedRoute>
  );
}
