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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">  
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
        <BootstrapClient />
      </body>
    </html>
  );
}
