"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * Local, per-browser account store. There is no backend yet: everything the
 * learner edits here lives in localStorage and survives reloads, nothing more.
 */

export const PROFILE_KEY = "assu-school-profile";
export const CERTS_KEY = "assu-school-certificates";
export const PROGRESS_KEY = "assu-school-progress";
export const THEME_KEY = "assu-school-theme";
const EVENT = "assu-school-account";

export type ThemePref = "system" | "light" | "dark";

export type Profile = {
  name: string;
  phoneCode: string;
  phone: string;
  email: string;
  avatarColor: string;
  language: "fr" | "wo" | "dyu";
  goal: 5 | 10 | 20;
  reminder: string;
  notifications: { whatsapp: boolean; sms: boolean; email: boolean };
  largeText: boolean;
  dataSaver: boolean;
  sound: boolean;
  twoFactor: "off" | "sms" | "app";
  plan: "gratuit" | "premium";
};

export const defaultProfile: Profile = {
  name: "",
  phoneCode: "+221",
  phone: "",
  email: "",
  avatarColor: "#e9b44c",
  language: "fr",
  goal: 10,
  reminder: "19:00",
  notifications: { whatsapp: true, sms: false, email: false },
  largeText: false,
  dataSaver: false,
  sound: true,
  twoFactor: "off",
  plan: "gratuit",
};

function read(key: string, fallback: string) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* private mode: changes just won't persist */
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

const notify = () => window.dispatchEvent(new Event(EVENT));

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useProfile(): Profile {
  const raw = useSyncExternalStore(subscribe, () => read(PROFILE_KEY, "{}"), () => "{}");
  return useMemo(() => {
    const p = parseJson<Partial<Profile>>(raw, {});
    return { ...defaultProfile, ...p, notifications: { ...defaultProfile.notifications, ...p.notifications } };
  }, [raw]);
}

export function updateProfile(patch: Partial<Profile>) {
  const current = { ...defaultProfile, ...parseJson<Partial<Profile>>(read(PROFILE_KEY, "{}"), {}) };
  write(PROFILE_KEY, JSON.stringify({ ...current, ...patch }));
  notify();
}

/** Date each certificate was first earned, so it doesn't change on every visit. */
export function useCertificateDates(): Record<string, string> {
  const raw = useSyncExternalStore(subscribe, () => read(CERTS_KEY, "{}"), () => "{}");
  return useMemo(() => parseJson<Record<string, string>>(raw, {}), [raw]);
}

export function recordCertificates(ids: string[]) {
  const dates = parseJson<Record<string, string>>(read(CERTS_KEY, "{}"), {});
  const missing = ids.filter((id) => !dates[id]);
  if (!missing.length) return;
  const today = new Date().toISOString();
  for (const id of missing) dates[id] = today;
  write(CERTS_KEY, JSON.stringify(dates));
  notify();
}

/** Theme preference: "system" forgets the stored choice and follows the OS. */
export function useThemePref(): ThemePref {
  const raw = useSyncExternalStore(subscribe, () => read(THEME_KEY, ""), () => "");
  return raw === "light" || raw === "dark" ? raw : "system";
}

export function setThemePref(pref: ThemePref) {
  const theme =
    pref === "system" ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : pref;
  document.documentElement.dataset.theme = theme;
  write(THEME_KEY, pref === "system" ? null : pref);
  notify();
}

export function resetProgress() {
  write(PROGRESS_KEY, null);
  write(CERTS_KEY, null);
  window.dispatchEvent(new Event(PROGRESS_KEY));
  notify();
}

export function deleteLocalAccount() {
  for (const k of [PROFILE_KEY, CERTS_KEY, PROGRESS_KEY]) write(k, null);
  window.dispatchEvent(new Event(PROGRESS_KEY));
  notify();
}

export function exportLocalData() {
  const data = {
    exportedAt: new Date().toISOString(),
    profile: parseJson(read(PROFILE_KEY, "{}"), {}),
    progress: parseJson(read(PROGRESS_KEY, "[]"), []),
    certificates: parseJson(read(CERTS_KEY, "{}"), {}),
    theme: read(THEME_KEY, "system"),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `assu-school-mes-donnees-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function displayName(p: Profile) {
  return p.name.trim() || "Apprenant·e";
}
