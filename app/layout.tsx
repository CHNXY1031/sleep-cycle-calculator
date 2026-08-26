import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import Link from "next/link";
import { MoonStar } from "lucide-react";
import "./globals.css";
import { BASE_URL } from "@/lib/seo";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "90 Minute Sleep Cycle Calculator — Best Bedtime & Wake-Up Time",
    template: "%s | Sleep Cycle Calculator",
  },
  description:
    "Calculate the best time to sleep or wake up using 90-minute sleep cycles and a realistic 14-minute fall-asleep window.",
  applicationName: "Sleep Cycle Calculator",
  keywords: [
    "sleep cycle calculator",
    "bedtime calculator",
    "wake up calculator",
    "90 minute sleep cycle",
    "best time to wake up",
  ],
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Sleep Cycle Calculator",
    title: "90 Minute Sleep Cycle & Bedtime Wake-Up Calculator",
    description:
      "Wake between sleep cycles and start your morning with less grogginess.",
  },
  twitter: {
    card: "summary_large_image",
    title: "90 Minute Sleep Cycle Calculator",
    description: "Find a smarter bedtime or wake-up time in seconds.",
  },
  verification: { google: "google4bf79fc737f0ba77" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body className="font-[family-name:var(--font-manrope)] antialiased">
        <header className="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
          <Link href="/" className="focus-ring flex items-center gap-3 rounded-lg" aria-label="Sleep Cycle Calculator home">
            <span className="grid h-10 w-10 place-items-center rounded-[14px] border border-emerald/30 bg-emerald/10 text-emerald shadow-glow">
              <MoonStar size={20} aria-hidden="true" />
            </span>
            <span className="font-[family-name:var(--font-sora)] text-sm font-semibold tracking-tight sm:text-base">
              Sleep Cycle<span className="text-emerald">.</span>
            </span>
          </Link>
          <a href="#calculator" className="focus-ring rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/65 transition hover:border-emerald/40 hover:text-emerald">
            Calculator
          </a>
        </header>
        {children}
        <footer className="mx-auto mt-24 max-w-7xl border-t border-white/10 px-5 py-10 text-sm text-white/45 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <p>© {new Date().getFullYear()} Sleep Cycle Calculator.</p>
            <p>For education only — not medical advice.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
