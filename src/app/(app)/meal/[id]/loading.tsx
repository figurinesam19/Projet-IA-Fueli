export default function MealLoading() {
  return (
    <main style={{ maxWidth: 448, margin: "0 auto", padding: "0 18px 120px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ padding: "14px 2px 4px" }}>
        <div className="skeleton" style={{ width: 160, height: 26 }} />
        <div className="skeleton" style={{ width: 100, height: 13, marginTop: 6 }} />
      </div>
      <div className="skeleton" style={{ height: 100, borderRadius: 20 }} />
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton" style={{ height: 60, borderRadius: 16 }} />
      ))}
    </main>
  );
}
