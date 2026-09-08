import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../index.css";
import AppProviders from "@/components/AppProviders";
import { playfairDisplay } from "@/lib/fonts";

export const metadata: Metadata = {
  title: {
    default: "GIPA Services",
    template: "%s | GIPA Services",
  },
  description:
    "GIPA Services Limited provides reliable, professional HGV logistics and transport services across the United Kingdom.",
  authors: [{ name: "GIPA Services Limited" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "GIPA Services — HGV Logistics UK",
    description:
      "Reliable, professional HGV logistics and transport services across the United Kingdom.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className={playfairDisplay.variable}>
      <body>
        <AppProviders>{children}</AppProviders>

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fgipaservic8192back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></body>
    </html>
  );
}
