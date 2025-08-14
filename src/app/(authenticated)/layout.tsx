"use client";

import Sidebar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedRoute>
      <Sidebar />

      <main className="px-0 main-shift">
        <div className="px-4 py-4">{children}</div>
      </main>

      <style jsx global>{`
        @media (min-width: 768px) {
          .main-shift {
            margin-left: 240px;
          }
        }
      `}</style>
    </ProtectedRoute>
  );
}
