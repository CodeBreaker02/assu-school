"use client";

import { motion, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import { CauriMark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme";
import { GameBar } from "./game-bar";

export function LearnHeader({
  showProgress = false,
  onMenu,
  menuOpen = false,
  crumb,
  children,
}: {
  showProgress?: boolean;
  onMenu?: () => void;
  /** Desktop sidebar state, reflected in the toggle's icon and label. */
  menuOpen?: boolean;
  crumb?: string;
  children?: React.ReactNode;
}) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/75 backdrop-blur-xl print:hidden">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        {onMenu && (
          <button
            type="button"
            onClick={onMenu}
            className="grid size-9 place-items-center rounded-lg text-cream hover:bg-cream/5"
            aria-label="Sommaire du cours"
            aria-expanded={menuOpen}
          >
            <svg viewBox="0 0 20 20" className="size-5 fill-none stroke-current stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="2.5" y="3.5" width="15" height="13" rx="2.5" />
              <path d="M7.5 3.5v13" />
              <motion.path d="M4.5 7h1M4.5 10h1M4.5 13h1" animate={{ opacity: menuOpen ? 1 : 0.35 }} className="hidden lg:block" />
            </svg>
          </button>
        )}
        <Link href="/" className="inline-flex items-center gap-2" aria-label="Assu School, accueil">
          <CauriMark className="h-6 w-5" />
          <span className="font-display text-lg leading-none">
            assu <span className="text-muted">school</span>
          </span>
        </Link>
        <span className="mx-1 hidden h-5 w-px bg-line-strong sm:block" />
        {crumb && <span className="hidden truncate text-sm text-muted md:block">{crumb}</span>}
        <Link href="/cours/parcours" className="ml-auto hidden rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-cream/5 hover:text-cream sm:block">
          Mon parcours
        </Link>
        <div className="flex items-center gap-2 max-sm:ml-auto">
          {children}
          <GameBar />
          <ThemeToggle />
          <Link
            href="/compte"
            aria-label="Mon compte"
            className="grid size-9 place-items-center rounded-full bg-gold/20 font-mono text-xs text-cream ring-1 ring-gold/40 transition-colors hover:bg-gold/30"
          >
            <svg viewBox="0 0 20 20" className="size-[18px] fill-none stroke-current stroke-[1.6]" strokeLinecap="round" aria-hidden>
              <circle cx="10" cy="7" r="3.2" />
              <path d="M3.8 16.5c1.2-2.8 3.5-4.2 6.2-4.2s5 1.4 6.2 4.2" />
            </svg>
          </Link>
        </div>
      </div>
      {showProgress && (
        <motion.div className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-gold" style={{ scaleX }} aria-hidden />
      )}
    </header>
  );
}
