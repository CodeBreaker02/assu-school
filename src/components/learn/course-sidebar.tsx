"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { allLessons, chapters, type CourseLesson } from "@/lib/content";
import type { Section } from "./block-renderer";
import { ease } from "./motion";
import { useLessonProgress } from "./progress";

export type LessonState = "done" | "current" | "open" | "soon" | "premium";

export function lessonState(l: CourseLesson, currentSlug: string, done: Set<string>): LessonState {
  if (l.slug === currentSlug) return "current";
  if (done.has(l.slug)) return "done";
  if (l.ready) return "open";
  return l.free ? "soon" : "premium";
}

export function StatusIcon({ state, accent }: { state: LessonState; accent?: string }) {
  if (state === "done")
    return (
      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-mint text-[#0a0907]">
        <svg viewBox="0 0 16 16" className="size-3 fill-none stroke-current stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 8.5 6.5 12 13 4.5" />
        </svg>
      </span>
    );
  if (state === "current")
    return (
      <span className="relative grid size-5 shrink-0 place-items-center rounded-full border-2" style={{ borderColor: accent ?? "var(--gold)" }}>
        <span className="size-2 rounded-full" style={{ background: accent ?? "var(--gold)" }} />
        <span className="absolute inset-0 animate-ping rounded-full border opacity-40" style={{ borderColor: accent ?? "var(--gold)" }} />
      </span>
    );
  if (state === "premium")
    return (
      <svg viewBox="0 0 16 16" className="block size-5 shrink-0 fill-none stroke-muted stroke-[1.4] p-0.5" aria-label="Premium">
        <rect x="3" y="7" width="10" height="7" rx="1.5" />
        <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
      </svg>
    );
  return (
    <span className={`block size-5 shrink-0 rounded-full border-2 ${state === "soon" ? "border-dashed border-line-strong" : "border-line-strong"}`} />
  );
}

const hours = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h} h ${String(m).padStart(2, "0")}` : `${m} min`;
};

function SectionList({ sections, active, onNavigate }: { sections: Section[]; active?: string; onNavigate?: () => void }) {
  return (
    <motion.ul
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.45, ease }}
      className="relative mt-1 mb-2 ml-[29px] overflow-hidden border-l border-line-strong pl-4"
    >
      {sections.map((s) => (
        <li key={s.id} className="relative">
          {active === s.id && (
            <motion.span
              layoutId="sidebar-section"
              className="absolute top-1.5 bottom-1.5 -left-[17.5px] w-[3px] rounded-full bg-gold"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
          <a
            href={`#${s.id}`}
            onClick={onNavigate}
            className={`block py-1.5 text-[15px] leading-snug transition-colors ${active === s.id ? "font-medium text-cream" : "text-muted hover:text-cream"}`}
          >
            {s.title}
          </a>
        </li>
      ))}
    </motion.ul>
  );
}

/**
 * The whole course, always one click away — chapters fold open, the current
 * lesson is highlighted and lists its sections, like a book's table of contents.
 */
export function CourseSidebar({
  currentSlug,
  sections = [],
  activeSection,
  onNavigate,
}: {
  currentSlug: string;
  sections?: Section[];
  activeSection?: string;
  onNavigate?: () => void;
}) {
  const done = useLessonProgress();
  const current = allLessons.find((l) => l.slug === currentSlug);
  const [open, setOpen] = useState<Set<string>>(() => new Set(current ? [current.chapter.number] : []));
  const currentRef = useRef<HTMLLIElement>(null);
  const completed = allLessons.filter((l) => done.has(l.slug)).length;

  // Bring the current lesson into view inside the sidebar's own scroll area.
  useEffect(() => {
    const el = currentRef.current;
    const box = el?.closest<HTMLElement>("[data-sidebar-scroll]");
    if (el && box) box.scrollTop = el.offsetTop - box.clientHeight / 3;
  }, [currentSlug]);

  const toggle = (n: string) =>
    setOpen((s) => {
      const next = new Set(s);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });

  return (
    <nav aria-label="Sommaire du cours" className="flex min-h-full flex-col">
      <div className="px-6 pt-6 pr-16 pb-5">
        <div className="font-mono text-xs tracking-[0.16em] text-muted uppercase">Le parcours</div>
        <div className="mt-1 font-display text-2xl leading-tight">L&apos;école de l&apos;argent</div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted">Progression</span>
          <span className="font-mono text-cream tabular-nums">
            {completed}/{allLessons.length}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream/10">
          <motion.div
            className="h-full rounded-full bg-gold"
            initial={{ width: 0 }}
            animate={{ width: `${(completed / allLessons.length) * 100}%` }}
            transition={{ duration: 1, ease }}
          />
        </div>
      </div>

      <ol className="flex-1 border-t border-line">
        {chapters.map((c) => {
          const lessons = allLessons.filter((l) => l.chapter.number === c.number);
          const doneHere = lessons.filter((l) => done.has(l.slug)).length;
          const minutes = lessons.reduce((n, l) => n + l.minutes, 0);
          const isOpen = open.has(c.number);
          const hasCurrent = current?.chapter.number === c.number;
          return (
            <li key={c.number} className="border-b border-line">
              <button
                type="button"
                onClick={() => toggle(c.number)}
                aria-expanded={isOpen}
                className="group flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-cream/[0.03]"
              >
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-xl font-mono text-sm"
                  style={{
                    background: `color-mix(in oklab, ${c.accent} ${hasCurrent ? 22 : 12}%, transparent)`,
                    color: `color-mix(in oklab, ${c.accent} 65%, var(--cream))`,
                  }}
                >
                  {c.number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-[16px] leading-snug font-medium ${hasCurrent ? "text-cream" : "text-cream/90"}`}>{c.title}</span>
                  <span className="mt-0.5 block text-[14px] text-muted">
                    {doneHere}/{lessons.length} leçons · {hours(minutes)}
                  </span>
                </span>
                <motion.svg
                  viewBox="0 0 16 16"
                  className="size-4 shrink-0 fill-none stroke-muted stroke-[1.6] group-hover:stroke-cream"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease }}
                  aria-hidden
                >
                  <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ol
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease }}
                    className="overflow-hidden px-4 pb-3"
                  >
                    {lessons.map((l) => {
                      const state = lessonState(l, currentSlug, done);
                      const isCurrent = state === "current";
                      return (
                        <li key={l.slug} ref={isCurrent ? currentRef : undefined}>
                          <Link
                            href={`/cours/${l.slug}`}
                            prefetch={l.ready}
                            onClick={onNavigate}
                            aria-current={isCurrent ? "page" : undefined}
                            className={`relative flex items-start gap-3 rounded-xl px-2.5 py-2.5 transition-colors ${
                              isCurrent ? "" : "hover:bg-cream/[0.05]"
                            }`}
                          >
                            {isCurrent && (
                              <motion.span
                                layoutId="sidebar-current"
                                className="absolute inset-0 rounded-xl"
                                style={{ background: `color-mix(in oklab, ${c.accent} 14%, transparent)` }}
                                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                              />
                            )}
                            <span className="relative mt-px">
                              <StatusIcon state={state} accent={c.accent} />
                            </span>
                            <span className="relative w-6 shrink-0 pt-0.5 font-mono text-xs text-muted tabular-nums">
                              {String(l.number).padStart(2, "0")}
                            </span>
                            <span
                              className={`relative min-w-0 flex-1 text-[15px] leading-snug ${
                                isCurrent ? "font-medium text-cream" : state === "premium" || state === "soon" ? "text-muted" : "text-cream/90"
                              }`}
                            >
                              {l.title}
                            </span>
                            <span className="relative shrink-0 pt-0.5 font-mono text-xs text-muted tabular-nums">
                              {state === "soon" ? "bientôt" : `${l.minutes} min`}
                            </span>
                          </Link>
                          {isCurrent && sections.length > 0 && (
                            <SectionList sections={sections} active={activeSection} onNavigate={onNavigate} />
                          )}
                        </li>
                      );
                    })}
                  </motion.ol>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>

      <div className="space-y-3 p-4">
        <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-[linear-gradient(140deg,color-mix(in_oklab,var(--gold)_16%,transparent),transparent_70%)] p-4">
          <div className="font-display text-[17px] leading-snug">Débloquez les {allLessons.length} leçons</div>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">Tous les chapitres, simulateurs et le certificat.</p>
          <Link
            href="/#tarif"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-[13px] font-medium text-on-gold transition-transform active:scale-95"
          >
            Premium dès 1 250 FCFA/mois →
          </Link>
        </div>
        <Link
          href="/cours/parcours"
          onClick={onNavigate}
          className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-cream/5 hover:text-cream"
        >
          Mon parcours et ma progression
          <span aria-hidden>→</span>
        </Link>
      </div>
    </nav>
  );
}
