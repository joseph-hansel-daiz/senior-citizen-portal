export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="container" style={{ minHeight: "95vh" }}>
        {children}
      </div>
    </main>
  );
}
