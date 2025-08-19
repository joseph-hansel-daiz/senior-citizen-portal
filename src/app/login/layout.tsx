"use client";

import { useTheme } from "@/context/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();

  return theme ? (
    <main>
      <div className="container" style={{ minHeight: "95vh" }}>
        {children}
      </div>
    </main>
  ) : (
    <></>
  );
}
