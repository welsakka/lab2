import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Halal Finance OS — The Complete Financial Platform for Muslim Households",
  description:
    "Screen stocks, optimize credit cards the halal way, plan retirement with Zakat modeling, and get AI-powered guidance — all in one platform built by Muslims, for Muslims.",
  keywords: [
    "halal investing",
    "halal finance",
    "Islamic finance",
    "halal stock screener",
    "zakat calculator",
    "halal mortgage",
    "buffered arbitrage cycle",
    "muslim financial planning",
  ],
  openGraph: {
    title: "Halal Finance OS",
    description: "The first comprehensive halal finance platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
