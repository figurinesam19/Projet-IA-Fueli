export default function LearnLoading() {
  return (
    <main style={{ maxWidth: 448, margin: "0 auto", padding: "0 18px 120px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ padding: "14px 2px 4px" }}>
        <div className="skeleton" style={{ width: 120, height: 26 }} />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton" style={{ height: 96, borderRadius: 18 }} />
      ))}
    </main>
  );
}
