import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../index.css";
import AppProviders from "@/components/AppProviders";

export const metadata: Metadata = {
  title: "GIPA Services Limited — Nationwide HGV Logistics & Transport",
  description:
    "GIPA Services Limited provides reliable, professional HGV logistics and transport services across the United Kingdom.",
  authors: [{ name: "GIPA Services Limited" }],
  openGraph: {
    title: "GIPA Services Limited — Nationwide HGV Logistics",
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
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
