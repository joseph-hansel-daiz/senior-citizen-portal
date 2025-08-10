import type { Metadata } from "next";
import BootstrapClient from "./utils/bootstrapClient";
import { AuthProvider } from "./((context))/AuthContext";
import { ThemeProvider, useTheme } from "./((context))/ThemeContext";

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
