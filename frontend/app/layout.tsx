import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CompareIQ AI — Compare anything. Decide faster.",
  description:
    "Real-time multimodal decision intelligence platform. Compare products, countries, companies, documents, and more using multi-agent AI with evidence grounding and explainable scoring.",
  authors: [{ name: "Raja Abimanyu N" }],
  keywords: ["AI comparison", "decision intelligence", "multimodal AI", "LangGraph", "document comparison"],
  openGraph: {
    title: "CompareIQ AI",
    description: "Compare anything. Decide faster.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
