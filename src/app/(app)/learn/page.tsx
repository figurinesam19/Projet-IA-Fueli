"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Search } from "lucide-react";
import { ARTICLES, articleThumb, type Article, type ArticleCategory } from "@/lib/articles";

// Labels UI exacts demandés → les articles "nutrition" et "bases" mappent directement
const CAT_META: Record<
  ArticleCategory,
  { filterLabel: string; displayLabel: string; emoji: string; tint: string; color: string }
> = {
  bases:     { filterLabel: "Bases",     displayLabel: "Basiques",  emoji: "📊", tint: "#EEF3FF", color: "#1A5CFF" },
  nutrition: { filterLabel: "Nutrition", displayLabel: "Nutrition", emoji: "📈", tint: "#EEF3FF", color: "#0E37AB" },
  recettes:  { filterLabel: "Recettes",  displayLabel: "Recettes",  emoji: "🍳", tint: "#FFF3EC", color: "#E5550A" },
};

const FILTER_LABELS = ["Tout", "Bases", "Recettes", "Nutrition"];

// Ordre éditorial des rangées de la page d'accueil (recettes en premier)
const CAROUSEL_ORDER: ArticleCategory[] = ["recettes", "nutrition", "bases"];

const SORTED = [...ARTICLES].sort((a, b) =>
  a.publishedAt < b.publishedAt ? 1 : -1,
);

export default function LearnPage() {
  const [query, setQuery]   = useState("");
  const [filter, setFilter] = useState("Tout");

  const q = query.trim().toLowerCase();

  const filtered = SORTED.filter((a) => {
    const meta = CAT_META[a.category];
    const matchesCat  = filter === "Tout" || meta.filterLabel === filter;
    const matchesText = !q
      || a.title.toLowerCase().includes(q)
      || a.excerpt.toLowerCase().includes(q)
      || meta.displayLabel.toLowerCase().includes(q);
    return matchesCat && matchesText;
  });

  // Accueil = pas de recherche ni de filtre → une + carrousels par thème.
  // Sinon (recherche ou filtre actif) → liste verticale classique des résultats.
  const isHome = !q && filter === "Tout";
  const heroArticle = isHome ? SORTED[0] : null;

  return (
    <main
      className="page-bottom"
      style={{
        maxWidth: 448,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        padding: "0 18px 0",
      }}
    >
      {/* ===== HEADER ===== */}
      <div className="animate-fade-up" style={{ padding: "14px 2px 18px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.03em", color: "#1A1A2E" }}>
          Apprendre
        </h1>
        <p style={{ fontSize: 14, fontWeight: 500, color: "#9595A8", marginTop: 2 }}>
          La nutrition, sans prise de tête.
        </p>
      </div>

      {/* ===== BARRE DE RECHERCHE ===== */}
      <div className="animate-fade-up-1" style={{ position: "relative", marginBottom: 14 }}>
        <Search
          size={18}
          color="#9595A8"
          style={{
            position: "absolute",
            left: 15,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un article..."
          style={{
            width: "100%",
            border: "none",
            background: "#fff",
            borderRadius: 16,
            padding: "15px 16px 15px 44px",
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "inherit",
            color: "#1A1A2E",
            boxShadow: "0 4px 12px rgba(26,26,46,.05)",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* ===== FILTRES CATÉGORIES ===== */}
      <div
        className="animate-fade-up-2"
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          margin: "0 -18px",
          padding: "0 18px 16px",
          scrollbarWidth: "none",
        }}
      >
        {FILTER_LABELS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              flexShrink: 0,
              border: "none",
              borderRadius: 999,
              padding: "9px 16px",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              background: filter === f ? "#1A1A2E" : "#fff",
              color: filter === f ? "#fff" : "#6B6B82",
              boxShadow: filter === f ? "none" : "0 2px 8px rgba(26,26,46,.05)",
              transition: "background .15s, color .15s",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {isHome ? (
        <HomeView hero={heroArticle!} onSeeAll={setFilter} />
      ) : (
        <ArticleList articles={filtered} query={query} />
      )}
    </main>
  );
}

/* ============================================================ */
/* Accueil : carte à la une + une rangée horizontale par thème  */
/* ============================================================ */

function HomeView({
  hero,
  onSeeAll,
}: {
  hero: Article;
  onSeeAll: (filterLabel: string) => void;
}) {
  return (
    <>
      {/* ===== CARTE À LA UNE ===== */}
      <Link
        href={`/learn/${hero.slug}`}
        className="animate-fade-up-3"
        style={{
          display: "block",
          borderRadius: 24,
          overflow: "hidden",
          background: "linear-gradient(135deg,#1A5CFF,#0E37AB)",
          padding: 22,
          color: "#fff",
          marginBottom: 22,
          textDecoration: "none",
          position: "relative",
          boxShadow: "0 14px 30px -8px rgba(26,92,255,.45)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -16,
            right: -8,
            fontSize: 110,
            opacity: 0.18,
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {hero.emoji}
        </div>

        <div style={{ position: "relative" }}>
          <span
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,.18)",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 999,
              textTransform: "uppercase",
              letterSpacing: ".04em",
            }}
          >
            À la une · {CAT_META[hero.category].displayLabel}
          </span>

          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-.02em",
              lineHeight: 1.2,
              marginTop: 12,
              maxWidth: "82%",
            }}
          >
            {hero.title}
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 12,
              fontSize: 12,
              fontWeight: 600,
              color: "#C7D6FF",
            }}
          >
            <Clock size={13} color="#C7D6FF" />
            {hero.readMinutes} min de lecture
          </div>
        </div>
      </Link>

      {/* ===== RANGÉES PAR THÈME ===== */}
      <div className="animate-fade-up-4" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {CAROUSEL_ORDER.map((cat) => {
          // Articles du thème, sauf celui déjà mis à la une pour éviter le doublon
          const items = SORTED.filter((a) => a.category === cat && a.slug !== hero.slug);
          if (items.length === 0) return null;
          const meta = CAT_META[cat];

          return (
            <section key={cat}>
              {/* En-tête de rangée */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 2px 10px",
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    letterSpacing: "-.02em",
                    color: "#1A1A2E",
                  }}
                >
                  {meta.emoji} {meta.displayLabel}
                </h3>
                <button
                  onClick={() => onSeeAll(meta.filterLabel)}
                  style={{
                    border: "none",
                    background: "none",
                    padding: 0,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#9595A8",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Voir tout ›
                </button>
              </div>

              {/* Rangée horizontale */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  overflowX: "auto",
                  margin: "0 -18px",
                  padding: "4px 18px 4px",
                  scrollbarWidth: "none",
                  scrollSnapType: "x mandatory",
                }}
              >
                {items.map((a) => (
                  <CarouselCard key={a.slug} article={a} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

function CarouselCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/learn/${article.slug}`}
      style={{
        flexShrink: 0,
        width: 158,
        background: "#fff",
        borderRadius: 18,
        padding: 12,
        boxShadow: "0 6px 16px rgba(26,26,46,.05)",
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        scrollSnapAlign: "start",
      }}
    >
      <div style={{ width: "100%", height: 84, borderRadius: 13, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={articleThumb(article)}
          alt={article.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          loading="lazy"
        />
      </div>

      <h4
        style={{
          fontSize: 13.5,
          fontWeight: 700,
          letterSpacing: "-.01em",
          lineHeight: 1.3,
          color: "#1A1A2E",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: 35,
        }}
      >
        {article.title}
      </h4>

      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: "#9595A8" }}>
        <Clock size={12} color="#9595A8" />
        {article.readMinutes} min
      </div>
    </Link>
  );
}

/* ============================================================ */
/* Résultats de recherche / filtre : liste verticale classique  */
/* ============================================================ */

function ArticleList({ articles, query }: { articles: Article[]; query: string }) {
  return (
    <div
      className="animate-fade-up-3"
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      {articles.map((a) => {
        const meta = CAT_META[a.category];
        return (
          <Link
            key={a.slug}
            href={`/learn/${a.slug}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: "#fff",
              borderRadius: 20,
              padding: 14,
              boxShadow: "0 6px 16px rgba(26,26,46,.05)",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ width: 60, height: 60, borderRadius: 16, overflow: "hidden", flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={articleThumb(a)}
                alt={a.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                loading="lazy"
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".04em",
                    color: meta.color,
                  }}
                >
                  {meta.displayLabel}
                </span>
                <span
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: "#C4C4D1",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 11, fontWeight: 600, color: "#9595A8" }}>
                  {a.readMinutes} min
                </span>
              </div>

              <h2
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "-.01em",
                  lineHeight: 1.3,
                  color: "#1A1A2E",
                }}
              >
                {a.title}
              </h2>
            </div>

            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M9 6l6 6-6 6" stroke="#C4C4D1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        );
      })}

      {articles.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#9595A8" }}>
          <div style={{ fontSize: 40 }}>🔍</div>
          <p style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>
            {query
              ? `Aucun résultat pour « ${query} »`
              : "Aucun article dans cette catégorie pour l'instant."}
          </p>
        </div>
      )}
    </div>
  );
}
