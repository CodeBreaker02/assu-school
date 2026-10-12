"use client";

import { motion, type HTMLMotionProps } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  delay = 0,
  y = 28,
  children,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: { index?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
      <span className="size-1.5 rounded-full bg-gold" />
      {children}
    </div>
  );
}
