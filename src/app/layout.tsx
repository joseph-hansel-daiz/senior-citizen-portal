import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import BootstrapClient from "@/lib/bootstrapClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Senior Citizen Portal",
  description: "Web-Based Senior Citizen Portal Information Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <html lang="en" data-bs-theme={"dark"}>
          <body className={"antialiased"}>
            {children}
            <BootstrapClient />
          </body>
        </html>
      </ThemeProvider>
    </AuthProvider>
  );
}
