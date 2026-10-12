"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { Wordmark } from "./logo";
import { ThemeToggle } from "./theme";

const links = [
  { href: "#programme", label: "Programme" },
  { href: "#simulateur", label: "Simulateur" },
  { href: "#methode", label: "Méthode" },
  { href: "#tarif", label: "Tarifs" },
  { href: "#organisations", label: "Organisations" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 600 && y > prev && !open);
  });

  return (
    <motion.header
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-8 lg:px-14"
    >
      <nav
        className={`mx-auto flex max-w-[1560px] items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-500 sm:px-5 ${
          scrolled || open
            ? "border-line bg-ink/70 shadow-[0_10px_40px_-10px_rgb(0_0_0/0.6)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <a href="#top" aria-label="Assu School, accueil">
          <Wordmark />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:bg-white/5 hover:text-cream"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/cours/parcours"
            className="hidden rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-cream sm:block"
          >
            Mon espace
          </Link>
          <Link
            href="/cours"
            className="group relative overflow-hidden rounded-full bg-cream px-4 py-2 text-sm font-medium text-ink transition-transform active:scale-95"
          >
            <span className="relative z-10">Commencer</span>
            <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-500 ease-out group-hover:translate-x-0" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid size-9 place-items-center rounded-full text-cream md:hidden"
            aria-label="Menu"
            aria-expanded={open}
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-px w-4 bg-current transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 h-px w-4 bg-current transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <motion.ul
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-2 max-w-[1560px] rounded-2xl border border-line bg-ink/90 p-2 backdrop-blur-xl md:hidden"
        >
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-cream hover:bg-white/5"
              >
                {l.label}
              </a>
            </li>
          ))}
        </motion.ul>
      )}
    </motion.header>
  );
}
