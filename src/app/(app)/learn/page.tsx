import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ARTICLES, CATEGORY_LABEL } from "@/lib/articles";

export default function LearnPage() {
  // Tri par date desc
  const sorted = [...ARTICLES].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1,
  );

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-5 p-5">
      <header>
        <h1 className="text-[22px] font-medium">Apprendre</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Des articles courts pour démystifier ce qu'on dit sur l'alimentation.
        </p>
      </header>

      <ul className="space-y-3">
        {sorted.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/learn/${a.slug}`}
              className="block rounded-xl border border-border bg-card p-4 transition hover:border-primary"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wide text-primary">
                  {CATEGORY_LABEL[a.category]}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {a.readMinutes} min
                </span>
              </div>
              <h2 className="mt-1 text-base font-medium leading-tight">
                {a.title}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {a.excerpt}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
                Lire <ChevronRight className="size-3.5" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
