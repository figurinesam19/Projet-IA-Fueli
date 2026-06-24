import Link from "next/link";
import { isSameDay, last7Days, toDayKey } from "@/lib/date";
import { cn } from "@/lib/utils";

const SHORT_DAY = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];

type Props = {
  selected: Date;
};

export function DateStrip({ selected }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = last7Days();

  return (
    <nav className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {days.map((d) => {
        const isToday = isSameDay(d, today);
        const isActive = isSameDay(d, selected);
        const key = toDayKey(d);
        return (
          <Link
            key={key}
            href={isToday ? "/today" : `/today?d=${key}`}
            className={cn(
              "flex h-16 w-12 shrink-0 flex-col items-center justify-center rounded-xl border text-center transition",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary/50",
            )}
          >
            <span
              className={cn(
                "text-[10px] font-medium uppercase tracking-wide",
                isActive ? "opacity-80" : "text-muted-foreground",
              )}
            >
              {SHORT_DAY[d.getDay()]}
            </span>
            <span className="text-base font-medium">{d.getDate()}</span>
          </Link>
        );
      })}
    </nav>
  );
}
