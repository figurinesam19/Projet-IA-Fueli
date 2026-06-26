export default function ProfileLoading() {
  return (
    <main className="page-bottom" style={{ maxWidth: 448, margin: "0 auto", padding: "0 18px 0", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ padding: "14px 2px 4px" }}>
        <div className="skeleton" style={{ width: 100, height: 26 }} />
      </div>
      {/* Avatar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "20px 0" }}>
        <div className="skeleton" style={{ width: 80, height: 80, borderRadius: "50%" }} />
        <div className="skeleton" style={{ width: 140, height: 18 }} />
        <div className="skeleton" style={{ width: 100, height: 14 }} />
      </div>
      {/* Cards */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton" style={{ height: 64, borderRadius: 18 }} />
      ))}
    </main>
  );
}
