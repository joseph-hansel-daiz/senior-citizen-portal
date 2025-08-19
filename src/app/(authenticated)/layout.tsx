"use client";

import Sidebar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useTheme } from "@/context/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { theme } = useTheme();

  return theme ? (
    <ProtectedRoute>
      <Sidebar />

      <main className="px-0 main-shift">
        <div className="px-4 py-4">{children}</div>
      </main>

      <style jsx global>{`
        /* Mobile first: add top margin */
        .main-shift {
          margin-top: 60px;
        }

        /* Medium and up: remove top margin and add left margin */
        @media (min-width: 768px) {
          .main-shift {
            margin-top: 0;
            margin-left: 240px;
          }
        }
      `}</style>
    </ProtectedRoute>
  ) : (
    <></>
  );
}
