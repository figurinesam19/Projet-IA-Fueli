import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SplashOverlay } from "@/components/splash-overlay";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1A5CFF",
};

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fueli — Comprends ce que tu manges",
  description:
    "Tracker nutritionnel simple : photographie tes repas et obtiens instantanément calories et macros.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Fueli",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SplashOverlay />
        {children}
      </body>
    </html>
  );
}
