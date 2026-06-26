export default function SearchLoading() {
  return (
    <main style={{ maxWidth: 448, margin: "0 auto", padding: "0 18px 120px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ padding: "14px 2px 4px" }}>
        <div className="skeleton" style={{ width: 160, height: 26 }} />
      </div>
      <div className="skeleton" style={{ height: 48, borderRadius: 14 }} />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="skeleton" style={{ height: 64, borderRadius: 16 }} />
      ))}
    </main>
  );
}
