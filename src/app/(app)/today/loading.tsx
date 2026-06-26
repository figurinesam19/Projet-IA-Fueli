export default function TodayLoading() {
  return (
    <main style={{ maxWidth: 448, margin: "0 auto", padding: "0 18px 200px", display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 2px 4px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="skeleton" style={{ width: 120, height: 13 }} />
          <div className="skeleton" style={{ width: 180, height: 26 }} />
        </div>
        <div className="skeleton" style={{ width: 46, height: 46, borderRadius: 16 }} />
      </div>

      {/* Date strip */}
      <div style={{ display: "flex", gap: 8 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ flex: 1, height: 56, borderRadius: 14 }} />
        ))}
      </div>

      {/* Daily card */}
      <div className="skeleton" style={{ height: 120, borderRadius: 20 }} />

      {/* Macro bars */}
      <div className="skeleton" style={{ height: 72, borderRadius: 18 }} />

      {/* Journal */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
        <div className="skeleton" style={{ width: 100, height: 17 }} />
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 70, borderRadius: 18 }} />
        ))}
      </div>
    </main>
  );
}
