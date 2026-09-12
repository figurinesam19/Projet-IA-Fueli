import Image from "next/image";

const CARDS = [
  {
    src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=85",
    alt: "Pancakes avec sirop",
    sizes: "280px",
    wrapStyle: {
      position: "absolute" as const,
      left: "calc(50% - 185px)",
      top: 42,
      width: 138,
      height: 245,
      borderRadius: 22,
      border: "3px solid #fff",
      boxShadow: "0 8px 28px rgba(0,0,0,0.16)",
      overflow: "hidden" as const,
      zIndex: 1,
      animation: "card-float-a 4s ease-in-out infinite",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=90",
    alt: "Bowl healthy avec légumes et avocat",
    sizes: "480px",
    wrapStyle: {
      position: "absolute" as const,
      left: "calc(50% - 80px)",
      top: 12,
      width: 160,
      height: 282,
      borderRadius: 24,
      border: "3px solid #fff",
      boxShadow: "0 14px 44px rgba(0,0,0,0.22)",
      overflow: "hidden" as const,
      zIndex: 3,
      animation: "card-float-b 3.5s ease-in-out infinite 0.4s",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=85",
    alt: "Buffet de légumes colorés",
    sizes: "280px",
    wrapStyle: {
      position: "absolute" as const,
      left: "calc(50% + 45px)",
      top: 36,
      width: 138,
      height: 245,
      borderRadius: 22,
      border: "3px solid #fff",
      boxShadow: "0 8px 28px rgba(0,0,0,0.16)",
      overflow: "hidden" as const,
      zIndex: 2,
      animation: "card-float-c 4.5s ease-in-out infinite 0.8s",
    },
  },
];

export function PhoneCards() {
  return (
    <div style={{ position: "relative", width: "100%", height: 318, flexShrink: 0 }}>
      {CARDS.map((card) => (
        <div key={card.src} style={card.wrapStyle}>
          <Image
            src={card.src}
            alt={card.alt}
            fill
            style={{ objectFit: "cover" }}
            sizes={card.sizes}
            priority
          />
        </div>
      ))}
    </div>
  );
}
