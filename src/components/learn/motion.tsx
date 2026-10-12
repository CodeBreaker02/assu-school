"use client";

import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "motion/react";
import { useEffect, useRef } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;
export const spring = { type: "spring", stiffness: 140, damping: 22 } as const;

/** Fades a block up into place the first time it scrolls into view. */
export function InView({
  delay = 0,
  y = 24,
  children,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, ease, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Parent/child variants for staggered lists: <motion.ul {...stagger.parent}><motion.li variants={stagger.child}> */
export const stagger = {
  parent: {
    initial: "hidden",
    whileInView: "show",
    viewport: { once: true, margin: "-8% 0px" },
    variants: { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } },
  },
  child: {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  },
} as const;

/**
 * A number that springs to its new value. Starts from 0 the first time it
 * enters the viewport, then follows `value` on every change.
 */
export function AnimatedNumber({
  value,
  format = (v) => Math.round(v).toLocaleString("fr-FR"),
  className,
}: {
  value: number;
  format?: (v: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const mv = useSpring(0, { stiffness: 80, damping: 22 });

  useEffect(() => {
    if (!inView) return;
    if (reduced) mv.jump(value);
    else mv.set(value);
  }, [inView, value, mv, reduced]);

  useMotionValueEvent(mv, "change", (v) => {
    if (ref.current) ref.current.textContent = format(v);
  });

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {format(reduced ? value : 0)}
    </span>
  );
}

/** Draws an SVG path from 0 to full length when it enters the viewport. */
export function DrawPath(props: React.ComponentProps<typeof motion.path> & { delay?: number }) {
  const { delay = 0, ...rest } = props;
  return (
    <motion.path
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: "easeInOut", delay }}
      {...rest}
    />
  );
}
