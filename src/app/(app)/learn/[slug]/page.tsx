import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { ARTICLES, CATEGORY_LABEL, findArticle, type ArticleCategory } from "@/lib/articles";
import { ArticleContent } from "../article-content";

// Métadonnées visuelles par catégorie (aligné sur learn/page.tsx)
const CAT_DETAIL: Record<ArticleCategory, { emoji: string; tint: string; color: string }> = {
  bases:     { emoji: "📊", tint: "#EEF3FF", color: "#1A5CFF" },
  mindset:   { emoji: "🧠", tint: "#F1ECFF", color: "#7C3AED" },
  nutrition: { emoji: "📈", tint: "#EEF3FF", color: "#0E37AB" },
  recettes:  { emoji: "🍳", tint: "#FFF3EC", color: "#E5550A" },
};

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

  const meta = CAT_DETAIL[article.category];

  const date = new Date(article.publishedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main
      style={{
        maxWidth: 448,
        margin: "0 auto",
        padding: "0 18px 0",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Bouton retour */}
      <div style={{ padding: "14px 0 16px" }}>
        <Link
          href="/learn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: "#9595A8",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} />
          Tous les articles
        </Link>
      </div>

      {/* Hero header */}
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "22px 20px 20px",
          boxShadow: "0 8px 24px rgba(26,26,46,.06),0 1px 3px rgba(26,26,46,.04)",
          marginBottom: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Emoji décoratif */}
        <div
          style={{
            position: "absolute",
            bottom: -10,
            right: -6,
            fontSize: 90,
            opacity: 0.1,
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {article.emoji}
        </div>

        {/* Badge catégorie */}
        <span
          style={{
            display: "inline-block",
            background: meta.tint,
            color: meta.color,
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 999,
            textTransform: "uppercase",
            letterSpacing: ".06em",
            marginBottom: 12,
          }}
        >
          {CATEGORY_LABEL[article.category]}
        </span>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-.03em",
            lineHeight: 1.2,
            color: "#1A1A2E",
            marginBottom: 12,
            position: "relative",
          }}
        >
          {article.title}
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 12,
            fontWeight: 600,
            color: "#9595A8",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Clock size={13} />
            {article.readMinutes} min de lecture
          </div>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#C4C4D1" }} />
          <span>{date}</span>
        </div>
      </div>

      {/* Contenu */}
      <ArticleContent blocks={article.body} />
    </main>
  );
}
