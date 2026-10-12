"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { pillars } from "@/lib/content";
import { CauriMark } from "./logo";

export function Marquee() {
  const items = [...pillars, ...pillars];
  return (
    <div className="relative overflow-hidden border-y border-line py-5 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className="flex w-max animate-marquee items-center gap-10 hover:[animation-play-state:paused]">
        {items.map((p, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-3xl text-muted">
            {p}
            <CauriMark className="h-5 w-4 opacity-60" />
          </span>
        ))}
      </div>
    </div>
  );
}

const TEXT =
  "On ne vous a jamais appris l'argent. Pourtant, entre la tontine, la famille et un revenu qui varie, il décide de presque tout. Assu School répare ça.";

const HIGHLIGHT = new Set(["l'argent.", "tontine,", "famille", "presque", "tout.", "répare", "ça."]);

function Word({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <motion.span
      style={{ opacity, y }}
      className={`mr-[0.25em] inline-block ${HIGHLIGHT.has(word) ? "text-gold" : ""}`}
    >
      {word}
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = TEXT.split(" ");

  return (
    <section className="mx-auto max-w-[1560px] px-5 py-32 sm:px-8 md:py-56 lg:px-14">
      <p
        ref={ref}
        className="max-w-[22ch] font-display text-[clamp(2.1rem,5.4vw,6.2rem)] leading-[1.04] tracking-[-0.01em] text-cream"
      >
        {words.map((w, i) => (
          <Word
            key={i}
            word={w}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
          />
        ))}
      </p>
    </section>
  );
}
