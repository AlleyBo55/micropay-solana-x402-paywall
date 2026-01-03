import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { SolanaWalletProvider } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SolanaPaywall - Micropayments for Content Creators",
  description: "A production-ready per-article paywall system using x402 protocol and Solana micropayments. No subscriptions needed - pay only for what you read.",
  keywords: ["Solana", "micropayments", "paywall", "x402", "content monetization", "Web3"],
  authors: [{ name: "SolanaPaywall" }],
  openGraph: {
    title: "SolanaPaywall - Micropayments for Content Creators",
    description: "Pay-per-article content monetization powered by Solana",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SolanaPaywall - Micropayments for Content Creators",
    description: "Pay-per-article content monetization powered by Solana",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${merriweather.variable} font-sans antialiased bg-slate-900 text-slate-100`}>
        <SolanaWalletProvider>
          {children}
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
