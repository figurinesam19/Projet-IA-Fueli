import type { ArticleBlock } from "@/lib/articles";

// Transforme [[texte]] → <mark> coloré bleu dans les paragraphes
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[\[.*?\]\])/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("[[") && part.endsWith("]]")) {
          return (
            <mark
              key={i}
              style={{
                background: "#EEF3FF",
                color: "#1A5CFF",
                borderRadius: 4,
                padding: "1px 4px",
                fontWeight: 700,
                fontStyle: "normal",
              }}
            >
              {part.slice(2, -2)}
            </mark>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function ArticleContent({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {blocks.map((block, i) => {
        if (block.type === "p") {
          return (
            <p
              key={i}
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: "#3A3A52",
                margin: 0,
              }}
            >
              <RichText text={block.text} />
            </p>
          );
        }

        if (block.type === "h2") {
          return (
            <h2
              key={i}
              style={{
                fontSize: 17,
                fontWeight: 800,
                letterSpacing: "-.02em",
                color: "#1A1A2E",
                marginTop: 8,
                paddingTop: 4,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 4,
                  height: 18,
                  borderRadius: 2,
                  background: "#1A5CFF",
                  flexShrink: 0,
                }}
              />
              {block.text}
            </h2>
          );
        }

        if (block.type === "ul") {
          return (
            <ul
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                padding: 0,
                margin: 0,
                listStyle: "none",
              }}
            >
              {block.items.map((item, j) => (
                <li
                  key={j}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    background: "#F7F8FC",
                    borderRadius: 12,
                    padding: "10px 14px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#3A3A52",
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#1A5CFF",
                      marginTop: 5,
                      flexShrink: 0,
                    }}
                  />
                  <RichText text={item} />
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={i}
              style={{
                background: "linear-gradient(135deg,#FFF3EC,#FFE3D1)",
                borderRadius: 16,
                borderLeft: "4px solid #FF6B1A",
                padding: "14px 18px",
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                fontStyle: "italic",
                color: "#7A2C0B",
                lineHeight: 1.55,
              }}
            >
              « {block.text} »
            </blockquote>
          );
        }

        return null;
      })}
    </div>
  );
}
