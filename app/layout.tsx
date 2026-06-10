import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/providers/Providers";
import { BackgroundFX } from "@/components/visual/BackgroundFX";
import { ScrollProgress } from "@/components/visual/ScrollProgress";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OnlyFootballsFan | Where Every Fan Has a Voice",
  description:
    "Live football polls, daily blogs, posters and match news. Vote to support your team in real time. The home of the football faithful.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen bg-canvas font-sans text-base text-ink antialiased">
        <BackgroundFX />
        <ScrollProgress />
        <Providers>
          <Navbar />
          {/* top padding clears the fixed nav so content never sits under it */}
          <main className="pt-20 sm:pt-28">{children}</main>
          <Footer />
          {/* spacer so the mobile bottom pill never overlaps the footer */}
          <div aria-hidden className="h-24 sm:hidden" />
        </Providers>
      </body>
    </html>
  );
}
