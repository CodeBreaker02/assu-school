"use client";

import { useMemo, useSyncExternalStore } from "react";

const KEY = "assu-school-progress";
const EVENT = "assu-school-progress";

function readRaw() {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function parse(raw: string): string[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Completed lesson slugs, persisted per browser. Empty on the server and in private mode. */
export function useLessonProgress() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
  return useMemo(() => new Set(parse(raw)), [raw]);
}

export function markLessonComplete(slug: string) {
  const done = new Set(parse(readRaw()));
  done.add(slug);
  try {
    localStorage.setItem(KEY, JSON.stringify([...done]));
  } catch {
    /* progress just won't persist */
  }
  window.dispatchEvent(new Event(EVENT));
}
