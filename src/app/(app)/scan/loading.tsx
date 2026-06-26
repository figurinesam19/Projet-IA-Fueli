export default function ScanLoading() {
  return (
    <main className="page-bottom" style={{ maxWidth: 448, margin: "0 auto", padding: "0 18px 0", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ padding: "14px 2px 4px" }}>
        <div className="skeleton" style={{ width: 140, height: 26 }} />
      </div>
      <div className="skeleton" style={{ height: 260, borderRadius: 24 }} />
      <div style={{ display: "flex", gap: 10 }}>
        <div className="skeleton" style={{ flex: 1, height: 52, borderRadius: 16 }} />
        <div className="skeleton" style={{ flex: 1, height: 52, borderRadius: 16 }} />
      </div>
    </main>
  );
}
