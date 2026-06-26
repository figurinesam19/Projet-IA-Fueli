export default function BarcodeLoading() {
  return (
    <main style={{ maxWidth: 448, margin: "0 auto", padding: "0 18px 120px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ padding: "14px 2px 4px" }}>
        <div className="skeleton" style={{ width: 180, height: 26 }} />
      </div>
      <div className="skeleton" style={{ height: 200, borderRadius: 24 }} />
      <div className="skeleton" style={{ height: 52, borderRadius: 16 }} />
    </main>
  );
}
