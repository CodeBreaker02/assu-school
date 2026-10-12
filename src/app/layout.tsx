import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SmoothScroll } from "@/components/smooth-scroll";
import { themeScript } from "@/lib/theme-script";
import "./globals.css";

const satoshi = localFont({
  src: "../fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
});

const avantGarde = localFont({
  src: "../fonts/ITCAvantGardeStd-Md.otf",
  variable: "--font-avant-garde",
  weight: "500",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Assu School — L'école de l'argent",
  description:
    "L'école de l'argent pensée pour la vie ouest-africaine : tontine, Mobile Money, revenus irréguliers, pression familiale, BRVM, retraite. Gratuit pour commencer.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0907" },
    { media: "(prefers-color-scheme: light)", color: "#f5efe3" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${satoshi.variable} ${avantGarde.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain min-h-full overflow-x-clip">
        <SmoothScroll />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
