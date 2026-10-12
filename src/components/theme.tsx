"use client";

import { motion } from "motion/react";
import { useSyncExternalStore } from "react";
import { STORAGE_KEY } from "@/lib/theme-script";

export type Theme = "light" | "dark";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const read = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

export function useTheme() {
  return useSyncExternalStore(subscribe, read, () => "dark" as Theme);
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode: the choice simply won't persist */
  }
}

export function ThemeToggle() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="relative grid size-9 place-items-center overflow-hidden rounded-full text-muted transition-colors hover:bg-cream/5 hover:text-cream"
      aria-label={next === "light" ? "Passer au thème clair" : "Passer au thème sombre"}
    >
      <motion.svg
        key={theme}
        viewBox="0 0 24 24"
        className="size-[18px] fill-none stroke-current stroke-[1.6]"
        strokeLinecap="round"
        initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        aria-hidden
      >
        {theme === "dark" ? (
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line key={a} x1="12" y1="2.5" x2="12" y2="4.5" transform={`rotate(${a} 12 12)`} />
            ))}
          </>
        )}
      </motion.svg>
    </button>
  );
}
