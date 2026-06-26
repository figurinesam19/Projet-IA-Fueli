import Link from "next/link";
import { isSameDay, currentWeek, toDayKey } from "@/lib/date";

const SHORT_DAY = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];

type Props = {
  selected: Date;
};

export function DateStrip({ selected }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = currentWeek();

  return (
    <nav
      style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        margin: "0 -18px",
        padding: "0 18px",
        scrollbarWidth: "none",
      }}
    >
      {days.map((d) => {
        const isToday = isSameDay(d, today);
        const isActive = isSameDay(d, selected);
        const isFuture = d > today;
        const key = toDayKey(d);

        const cell = (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 64,
              flexShrink: 0,
              borderRadius: 14,
              textAlign: "center",
              background: isActive ? "#1A5CFF" : "#fff",
              boxShadow: isActive
                ? "0 6px 16px rgba(26,92,255,.28)"
                : "0 2px 8px rgba(26,26,46,.06)",
              opacity: isFuture ? 0.35 : 1,
              cursor: isFuture ? "default" : "pointer",
              transition: "transform 0.1s",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: ".04em",
                color: isActive ? "rgba(255,255,255,.75)" : "#9595A8",
              }}
            >
              {SHORT_DAY[d.getDay()]}
            </span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: isActive ? "#fff" : "#1A1A2E",
                marginTop: 2,
              }}
            >
              {d.getDate()}
            </span>
          </div>
        );

        if (isFuture) return <div key={key}>{cell}</div>;

        return (
          <Link
            key={key}
            href={isToday ? "/today" : `/today?d=${key}`}
            style={{ textDecoration: "none" }}
          >
            {cell}
          </Link>
        );
      })}
    </nav>
  );
}
