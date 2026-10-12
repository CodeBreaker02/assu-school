"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CourseLesson } from "@/lib/content";
import type { Block } from "@/lib/lessons";
import type { Section } from "./block-renderer";
import { ease } from "./motion";

type Panel = "links" | "toc" | null;

/** Sections that contain something to do (widget, game, cards), for quick access. */
function practiceSections(blocks: Block[]) {
  const out: { id: string; title: string; kind: string }[] = [];
  let current: { id: string; title: string } | null = null;
  for (const b of blocks) {
    if (b.type === "h2") current = { id: b.id, title: b.text };
    else if (current && (b.type === "widget" || b.type === "sort" || b.type === "myths")) {
      const kind = b.type === "widget" ? "Simulateur" : b.type === "sort" ? "Exercice" : "Cartes";
      if (!out.some((o) => o.id === current!.id)) out.push({ ...current, kind });
    }
  }
  return out;
}

function Icon({ name }: { name: "up" | "link" | "toc" }) {
  return (
    <svg viewBox="0 0 20 20" className="size-[18px] fill-none stroke-current stroke-[1.6]" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {name === "up" && <path d="M10 15V5M5 10l5-5 5 5" />}
      {name === "link" && <path d="M8.5 11.5a3 3 0 0 0 4.2 0l2.6-2.6a3 3 0 0 0-4.2-4.2l-.9.9M11.5 8.5a3 3 0 0 0-4.2 0l-2.6 2.6a3 3 0 0 0 4.2 4.2l.9-.9" />}
      {name === "toc" && <path d="M7 5h9M7 10h9M7 15h6M3.5 5h.01M3.5 10h.01M3.5 15h.01" />}
    </svg>
  );
}

function Row({ href, title, meta, external, onClick }: { href: string; title: string; meta?: string; external?: boolean; onClick?: () => void }) {
  const cls = "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-cream/[0.06]";
  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] leading-snug text-cream">{title}</span>
        {meta && <span className="mt-0.5 block text-[13px] text-muted">{meta}</span>}
      </span>
      <span className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-cream" aria-hidden>
        {external ? "↗" : "→"}
      </span>
    </>
  );
  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onClick}>
        {body}
      </a>
    );
  if (href.startsWith("#"))
    return (
      <a href={href} className={cls} onClick={onClick}>
        {body}
      </a>
    );
  return (
    <Link href={href} className={cls} onClick={onClick}>
      {body}
    </Link>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return <div className="px-3 pt-3 pb-1 font-mono text-xs tracking-[0.14em] text-muted uppercase">{children}</div>;
}

/**
 * Bottom-right dock, as in a video course player: back to top, the lesson's
 * links (exercises, sources, neighbours, printable sheet) and its table of contents.
 */
export function LessonDock({
  sections,
  active,
  blocks,
  links = [],
  prev,
  next,
}: {
  sections: Section[];
  active?: string;
  blocks: Block[];
  links?: { label: string; href: string; note?: string }[];
  prev: CourseLesson | null;
  next: CourseLesson | null;
}) {
  const [panel, setPanel] = useState<Panel>(null);
  const ref = useRef<HTMLDivElement>(null);
  const practice = practiceSections(blocks);
  const close = () => setPanel(null);
  const toggle = (p: Exclude<Panel, null>) => setPanel((cur) => (cur === p ? null : p));

  useEffect(() => {
    if (!panel) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setPanel(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [panel]);

  const btn = (on: boolean) =>
    `relative flex h-11 items-center gap-2 rounded-full px-3.5 text-sm transition-colors sm:px-4 ${on ? "text-ink" : "text-cream hover:bg-cream/10"}`;

  return (
    <div ref={ref} className="fixed right-3 bottom-3 z-40 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {panel && (
          <motion.div
            key={panel}
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.25, ease }}
            className="absolute right-0 bottom-[3.75rem] max-h-[min(70svh,34rem)] w-[min(24rem,calc(100vw-1.5rem))] origin-bottom-right overflow-y-auto overscroll-contain rounded-2xl border border-line-strong bg-ink-2/95 p-2 shadow-[0_24px_70px_-20px_rgb(0_0_0/0.6)] backdrop-blur-xl"
            data-lenis-prevent
          >
            {panel === "toc" ? (
              <>
                <Heading>Table des matières</Heading>
                <ul>
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        onClick={close}
                        className={`relative flex gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors ${active === s.id ? "text-cream" : "text-cream/80 hover:text-cream"}`}
                      >
                        {active === s.id && <motion.span layoutId="dock-active" className="absolute inset-0 rounded-xl bg-gold/12" />}
                        <span className="relative w-5 font-mono text-xs leading-6 text-muted">{String(i + 1).padStart(2, "0")}</span>
                        <span className="relative">{s.title}</span>
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="#a-retenir" onClick={close} className="flex gap-3 rounded-xl px-3 py-2.5 text-[15px] text-cream/80 hover:text-cream">
                      <span className="w-5 font-mono text-xs leading-6 text-muted">✓</span>À retenir et quiz
                    </a>
                  </li>
                </ul>
              </>
            ) : (
              <>
                {practice.length > 0 && (
                  <>
                    <Heading>À pratiquer</Heading>
                    {practice.map((p) => (
                      <Row key={p.id} href={`#${p.id}`} title={p.title} meta={p.kind} onClick={close} />
                    ))}
                  </>
                )}
                {links.length > 0 && (
                  <>
                    <Heading>Sources officielles</Heading>
                    {links.map((l) => (
                      <Row key={l.href} href={l.href} title={l.label} meta={l.note} external onClick={close} />
                    ))}
                  </>
                )}
                <Heading>Leçons</Heading>
                {prev && <Row href={`/cours/${prev.slug}`} title={prev.title} meta={`Précédente · ${prev.minutes} min`} onClick={close} />}
                {next && <Row href={`/cours/${next.slug}`} title={next.title} meta={`Suivante · ${next.minutes} min${!next.ready && !next.free ? " · Premium" : ""}`} onClick={close} />}
                <Row href="/cours/parcours" title="Mon parcours" meta="Toutes les leçons et ma progression" onClick={close} />
                <div className="border-t border-line p-2 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      setTimeout(() => window.print(), 50);
                    }}
                    className="w-full rounded-xl border border-line-strong px-3 py-2.5 text-sm text-cream transition-colors hover:bg-cream/[0.06]"
                  >
                    Imprimer la fiche de la leçon
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1 rounded-full border border-line-strong bg-ink-2/90 p-1 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.5)] backdrop-blur-xl print:hidden">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="grid size-11 place-items-center rounded-full text-cream hover:bg-cream/10"
          aria-label="Revenir en haut"
        >
          <Icon name="up" />
        </motion.button>
        <span className="h-6 w-px bg-line-strong" aria-hidden />
        {(
          [
            ["links", "Liens de la leçon"],
            ["toc", "Table des matières"],
          ] as const
        ).map(([key, label]) => (
          <motion.button
            key={key}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => toggle(key)}
            aria-expanded={panel === key}
            aria-label={label}
            className={btn(panel === key)}
          >
            {panel === key && (
              <motion.span layoutId="dock-pill" className="absolute inset-0 rounded-full bg-cream" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
            )}
            <span className="relative">
              <Icon name={key === "links" ? "link" : "toc"} />
            </span>
            <span className="relative hidden sm:inline">{label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
