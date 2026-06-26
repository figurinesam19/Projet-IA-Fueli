import { BottomNav } from "@/components/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <div className="app-column">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
