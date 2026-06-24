import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ARTICLES, CATEGORY_LABEL, findArticle } from "@/lib/articles";
import { ArticleContent } from "../article-content";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();

  const date = new Date(article.publishedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-5 p-5">
      <Link
        href="/learn"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Tous les articles
      </Link>

      <header className="space-y-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-primary">
          {CATEGORY_LABEL[article.category]}
        </span>
        <h1 className="text-[22px] font-medium leading-tight">
          {article.title}
        </h1>
        <p className="text-[11px] text-muted-foreground">
          {date} · {article.readMinutes} min de lecture
        </p>
      </header>

      <ArticleContent blocks={article.body} />
    </main>
  );
}
