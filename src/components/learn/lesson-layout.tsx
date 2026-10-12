"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { allLessons, firstLesson, type CourseLesson } from "@/lib/content";
import type { LessonContent } from "@/lib/lessons";
import { BlockRenderer, type Section, sectionsOf } from "./block-renderer";
import { KeyPoints } from "./blocks";
import { CoinBurst } from "./charts";
import { CourseSidebar, StatusIcon } from "./course-sidebar";
import { XP, game } from "./gamification";
import { LearnHeader } from "./learn-header";
import { LessonDock } from "./lesson-dock";
import { ease } from "./motion";
import { markLessonComplete, useLessonProgress } from "./progress";
import { QuizLauncher } from "./quiz-launcher";
import { LessonHero } from "./scenes";

type Props = {
  lesson: CourseLesson;
  /** Null when the lesson isn't written yet (Premium or "bientôt"). */
  content: LessonContent | null;
  prev: CourseLesson | null;
  next: CourseLesson | null;
};

/** Which section is currently being read: the last one whose top crossed 35 % of the viewport. */
function useActiveSection(sections: Section[]) {
  const [active, setActive] = useState(sections[0]?.id);
  useEffect(() => {
    const onScroll = () => {
      let current = sections[0]?.id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);
  return active;
}

function NextLessonBanner({ slug, next }: { slug: string; next: CourseLesson | null }) {
  const router = useRouter();
  const done = useLessonProgress();
  const [burst, setBurst] = useState(0);
  const isDone = done.has(slug);

  const finish = () => {
    if (!isDone) game.addXp(XP.lesson, { lessons: 1 });
    markLessonComplete(slug);
    setBurst((b) => b + 1);
    setTimeout(() => router.push(next ? `/cours/${next.slug}` : "/cours/parcours"), 900);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease }}
      className="relative mt-16 overflow-hidden rounded-3xl bg-gold p-6 text-on-gold sm:p-8 print:hidden"
    >
      <div className="pointer-events-none absolute -top-20 -right-10 size-64 rounded-full bg-white/20 blur-3xl" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-mono text-xs tracking-[0.16em] uppercase opacity-75">
            {next ? `Leçon suivante · ${next.minutes} min${!next.ready && !next.free ? " · Premium" : ""}` : "Fin du parcours"}
          </div>
          <div className="mt-1 font-display text-2xl leading-tight sm:text-3xl">{next ? next.title : "Retour à votre parcours"}</div>
        </div>
        <div className="relative">
          <CoinBurst trigger={burst} count={20} />
          <motion.button
            type="button"
            onClick={finish}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="relative inline-flex items-center gap-3 rounded-full bg-[#0a0907] py-3.5 pr-5 pl-4 text-sm font-medium text-[#f3ebdd]"
          >
            <span className={`grid size-6 place-items-center rounded-full ${isDone || burst ? "bg-mint text-[#0a0907]" : "border border-[#f3ebdd]/40"}`}>
              <svg viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <motion.path d="M3 8.5 6.5 12 13 4.5" initial={false} animate={{ pathLength: isDone || burst ? 1 : 0 }} />
              </svg>
            </span>
            {isDone ? "Continuer" : "Terminer et continuer"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/** Offered on the first lesson when the learner already has progress elsewhere. */
function ResumeToast({ slug }: { slug: string }) {
  const done = useLessonProgress();
  const [dismissed, setDismissed] = useState(false);
  const resume = allLessons.find((l) => l.ready && !done.has(l.slug));
  const show = !dismissed && slug === firstLesson.slug && done.size > 0 && resume && resume.slug !== slug;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.8, type: "spring", stiffness: 260, damping: 24 } }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          className="fixed bottom-4 left-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-4 rounded-2xl border border-line-strong bg-ink-2/95 p-3 pl-4 shadow-2xl backdrop-blur-xl sm:bottom-6 sm:left-6"
          role="status"
        >
          <div className="min-w-0">
            <div className="text-xs text-muted">Reprendre où vous en étiez</div>
            <div className="truncate text-[15px] font-medium">{resume.title}</div>
          </div>
          <Link href={`/cours/${resume.slug}`} className="shrink-0 rounded-full bg-gold px-4 py-2 text-sm font-medium text-on-gold">
            Reprendre
          </Link>
          <button type="button" onClick={() => setDismissed(true)} className="shrink-0 px-1 text-muted hover:text-cream" aria-label="Fermer">
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Shown instead of the lesson body when it's Premium or not produced yet. */
function LockedLesson({ lesson }: { lesson: CourseLesson }) {
  const premium = !lesson.free;
  const done = useLessonProgress();
  const alt =
    allLessons.find((l) => l.number > lesson.number && l.ready && !done.has(l.slug)) ??
    allLessons.find((l) => l.ready && !done.has(l.slug));

  return (
    <motion.div initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, ease, delay: 0.15 }}>
      <div
        data-theme="dark"
        className="relative grid aspect-[4/3] place-items-center overflow-hidden text-cream sm:aspect-video md:aspect-auto md:h-[calc(100svh-3.5rem)] md:min-h-[480px]"
        style={{ background: `radial-gradient(80% 90% at 50% 100%, color-mix(in oklab, ${lesson.chapter.accent} 30%, #0b0a08), #0b0a08)` }}
      >
        <div className="hairline-grid absolute inset-0 opacity-30" />
        <motion.div
          className="absolute size-[60%] rounded-full blur-3xl"
          style={{ background: lesson.chapter.accent, opacity: 0.18 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative px-6 text-center">
          <motion.div
            className="mx-auto grid size-16 place-items-center rounded-2xl border border-cream/20 bg-cream/10 backdrop-blur-md"
            initial={{ rotate: -12, scale: 0.6 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.3 }}
          >
            {premium ? (
              <svg viewBox="0 0 24 24" className="size-7 fill-none stroke-cream stroke-[1.6]" aria-hidden>
                <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
                <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
              </svg>
            ) : (
              <motion.span className="flex gap-1.5" aria-hidden>
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="size-2 rounded-full bg-cream"
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: d * 0.2 }}
                  />
                ))}
              </motion.span>
            )}
          </motion.div>
          <div className="mt-5 font-display text-2xl sm:text-3xl">{premium ? "Leçon Premium" : "En cours de tournage"}</div>
          <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-cream/80">
            {premium
              ? `Débloquez les ${allLessons.length} leçons, tous les simulateurs et le certificat.`
              : "Cette leçon gratuite arrive très bientôt. En attendant, continuez avec la suivante."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {premium && (
              <Link href="/#tarif" className="rounded-full bg-gold px-5 py-3 text-sm font-medium text-[#0a0907] transition-transform active:scale-95">
                Passer Premium · dès 1 250 FCFA/mois
              </Link>
            )}
            {alt && (
              <Link href={`/cours/${alt.slug}`} className="rounded-full border border-cream/25 px-5 py-3 text-sm text-cream transition-colors hover:bg-cream/10">
                Leçon gratuite : {alt.title}
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const SIDEBAR_W = 420;

/** Right rail: where you are in the lesson, and what comes next. */
function LessonRail({ sections, active, next }: { sections: Section[]; active?: string; next: CourseLesson | null }) {
  const i = Math.max(0, sections.findIndex((s) => s.id === active));
  return (
    <aside className="hidden lg:block print:hidden">
      <div className="sticky top-24 space-y-6">
        <div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs tracking-[0.16em] text-muted uppercase">Dans cette leçon</span>
            <span className="font-mono text-xs text-muted tabular-nums">
              {i + 1}/{sections.length}
            </span>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-cream/10">
            <motion.div className="h-full rounded-full bg-gold" animate={{ width: `${((i + 1) / sections.length) * 100}%` }} transition={{ duration: 0.5, ease }} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="mt-4 text-[17px] leading-snug font-medium"
            >
              {sections[i]?.title}
            </motion.div>
          </AnimatePresence>
        </div>
        {next && (
          <Link href={`/cours/${next.slug}`} className="group block rounded-2xl border border-line bg-ink-2 p-4 transition-colors hover:border-line-strong">
            <div className="font-mono text-xs tracking-[0.14em] text-muted uppercase">Ensuite</div>
            <div className="mt-1.5 text-[15px] leading-snug font-medium">{next.title}</div>
            <div className="mt-2 flex items-center justify-between text-[13px] text-muted">
              <span>
                {next.minutes} min{!next.ready && !next.free ? " · Premium" : ""}
              </span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
}
const DESKTOP = "(min-width: 1024px)";

function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(DESKTOP);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(DESKTOP).matches,
    () => true,
  );
}

export function LessonLayout({ lesson, content, prev, next }: Props) {
  const { slug, title, minutes, chapter } = lesson;
  const sections = useMemo(() => (content ? sectionsOf(content.blocks) : []), [content]);
  const active = useActiveSection(sections);
  const [open, setOpen] = useState(false);
  const index = chapter.lessons.findIndex((l) => l.title === title) + 1;

  const isDesktop = useIsDesktop();
  const toggleMenu = () => setOpen((o) => !o);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <MotionConfig reducedMotion="user">
      <LearnHeader showProgress onMenu={toggleMenu} menuOpen={open} crumb={`Chapitre ${chapter.number} · ${chapter.title}`} />

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[55] bg-black/45 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              aria-label="Sommaire du cours"
              className="fixed top-[4.25rem] right-3 bottom-3 left-3 z-[60] overflow-hidden rounded-3xl border border-line-strong bg-ink-2/90 shadow-[0_30px_90px_-20px_rgb(0_0_0/0.55)] backdrop-blur-2xl sm:right-auto sm:w-[420px] lg:bottom-4 lg:left-4"
              initial={{ opacity: 0, x: -32, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -32, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20"
                aria-label="Fermer le sommaire"
              >
                <svg viewBox="0 0 20 20" className="size-4 fill-none stroke-current stroke-[1.8]" strokeLinecap="round" aria-hidden>
                  <path d="M5 5l10 10M15 5 5 15" />
                </svg>
              </button>
              <div className="h-full overflow-y-auto overscroll-contain" data-lenis-prevent data-sidebar-scroll>
                <CourseSidebar
                  currentSlug={slug}
                  sections={sections}
                  activeSection={active}
                  onNavigate={isDesktop ? undefined : () => setOpen(false)}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lesson-page pt-14 print:pt-0">
        <motion.main
          className="min-w-0 pb-32"
          initial={false}
          animate={{ paddingLeft: isDesktop && open ? SIDEBAR_W + 32 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 34 }}
        >
          {/* The video comes first and owns the viewport, like a film. */}
          {content ? (
            <motion.div key={slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease }} className="print:hidden">
              <LessonHero scene={content.scene} captions={content.captions} title={title} minutes={minutes} chapters={sections} fullBleed />
            </motion.div>
          ) : (
            <LockedLesson lesson={lesson} />
          )}

          <div className="mx-auto max-w-[1240px] px-5 pt-12 sm:px-8 lg:px-12 lg:pt-16">
            <motion.header
              key={slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.1 }}
            >
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                <span className="font-medium" style={{ color: `color-mix(in oklab, ${chapter.accent} 65%, var(--cream))` }}>
                  Chapitre {chapter.number} · {chapter.title}
                </span>
                <span aria-hidden>·</span>
                <span>Leçon {index}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-2.5 py-0.5 text-[13px]">
                  <svg viewBox="0 0 10 12" className="size-2 fill-current" aria-hidden>
                    <path d="M0 0l10 6-10 6z" />
                  </svg>
                  {minutes} min
                </span>
                {!content && (
                  <span className="inline-flex items-center gap-1.5 text-[13px]">
                    <StatusIcon state={lesson.free ? "soon" : "premium"} /> {lesson.free ? "Bientôt" : "Premium"}
                  </span>
                )}
              </div>
              <h1 className="mt-4 max-w-5xl font-display text-[clamp(2.4rem,5.6vw,5rem)] leading-[1.02] text-balance">{title}</h1>
              {content && <p className="mt-6 max-w-3xl text-[20px] leading-relaxed text-cream/80">{content.subtitle}</p>}
            </motion.header>

            {content && (
              <div className="mt-14 grid gap-16 lg:grid-cols-[minmax(0,52rem)_17rem] lg:justify-between">
                <article className="min-w-0">
                  <BlockRenderer blocks={content.blocks} lesson={slug} />
                  <KeyPoints points={content.keyPoints} />
                  <QuizLauncher slug={slug} title={title} next={next} />
                  <NextLessonBanner slug={slug} next={next} />
                </article>
                <LessonRail sections={sections} active={active} next={next} />
              </div>
            )}
          </div>
        </motion.main>
      </div>

      {content && (
        <LessonDock sections={sections} active={active} blocks={content.blocks} links={content.links} prev={prev} next={next} />
      )}
      <ResumeToast slug={slug} />
    </MotionConfig>
  );
}
