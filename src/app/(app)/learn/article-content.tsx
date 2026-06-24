import type { ArticleBlock } from "@/lib/articles";

export function ArticleContent({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        if (block.type === "p") {
          return (
            <p key={i} className="text-sm leading-relaxed text-foreground">
              {block.text}
            </p>
          );
        }
        if (block.type === "h2") {
          return (
            <h2 key={i} className="pt-2 text-[18px] font-medium">
              {block.text}
            </h2>
          );
        }
        if (block.type === "ul") {
          return (
            <ul
              key={i}
              className="ml-4 list-disc space-y-1 text-sm leading-relaxed text-foreground marker:text-primary"
            >
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote
              key={i}
              className="rounded-xl border-l-4 border-accent bg-card p-4 text-sm italic leading-relaxed text-foreground"
            >
              {block.text}
            </blockquote>
          );
        }
        return null;
      })}
    </div>
  );
}
