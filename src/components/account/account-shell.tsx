"use client";

import { MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLessonProgress } from "@/components/learn/progress";
import { CauriMark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme";
import { allLessons } from "@/lib/content";
import { nextLesson } from "./data";
import { displayName, initials, useProfile } from "./store";
import { Avatar } from "./ui";

const icon = "size-5 shrink-0 fill-none stroke-current stroke-[1.6]";

const nav = [
  {
    href: "/compte",
    label: "Progression",
    icon: (
      <svg viewBox="0 0 24 24" className={icon} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 19V10M10 19V5M16 19v-6M22 19H2" />
      </svg>
    ),
  },
  {
    href: "/compte/certificats",
    label: "Certificats",
    icon: (
      <svg viewBox="0 0 24 24" className={icon} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="9" r="5" />
        <path d="m9 13.5-1.5 7.5L12 18.5l4.5 2.5L15 13.5" />
      </svg>
    ),
  },
  {
    href: "/compte/abonnement",
    label: "Abonnement et factures",
    icon: (
      <svg viewBox="0 0 24 24" className={icon} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M3 10h18M7 15h4" />
      </svg>
    ),
  },
  {
    href: "/compte/parametres",
    label: "Paramètres",
    icon: (
      <svg viewBox="0 0 24 24" className={icon} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="10" cy="17" r="2" />
      </svg>
    ),
  },
  {
    href: "/compte/securite",
    label: "Sécurité",
    icon: (
      <svg viewBox="0 0 24 24" className={icon} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

const isActive = (path: string, href: string) => (href === "/compte" ? path === "/compte" : path.startsWith(href));

export function AccountShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const profile = useProfile();
  const done = useLessonProgress();
  const name = displayName(profile);
  const completed = allLessons.filter((l) => done.has(l.slug)).length;
  const next = nextLesson(done);
  // Printable documents get the page to themselves.
  const printable = /^\/compte\/(factures|certificats)\/[^/]+$/.test(path);

  return (
    <MotionConfig reducedMotion="user">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/75 backdrop-blur-xl print:hidden">
        <div className="flex h-14 items-center gap-2 px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2" aria-label="Assu School, accueil">
            <CauriMark className="h-6 w-5" />
            <span className="font-display text-lg leading-none">
              assu <span className="text-muted">school</span>
            </span>
          </Link>
          <span className="mx-2 hidden h-5 w-px bg-line-strong sm:block" />
          <Link href="/cours" className="hidden rounded-full px-3 py-1.5 text-sm text-cream/80 hover:bg-cream/5 hover:text-cream sm:block">
            Cours
          </Link>
          <Link href="/cours/parcours" className="hidden rounded-full px-3 py-1.5 text-sm text-cream/80 hover:bg-cream/5 hover:text-cream sm:block">
            Mon parcours
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link href="/compte/parametres" aria-label="Mon profil" className="rounded-full ring-2 ring-transparent transition hover:ring-line-strong">
              <Avatar name={initials(profile.name)} color={profile.avatarColor} size={34} />
            </Link>
          </div>
        </div>
      </header>

      {/* Floating navigation (desktop) */}
      {!printable && (
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
          className="fixed top-[72px] bottom-4 left-4 z-40 hidden w-[300px] flex-col overflow-hidden rounded-3xl border border-line bg-ink-2/80 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.5)] backdrop-blur-xl lg:flex print:hidden"
        >
          <div className="flex items-center gap-3.5 border-b border-line p-5">
            <Avatar name={initials(profile.name)} color={profile.avatarColor} size={52} />
            <div className="min-w-0">
              <div className="truncate font-display text-lg leading-tight">{name}</div>
              <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-cream/10 px-2.5 py-0.5 text-xs text-cream/85">
                <span className={`size-1.5 rounded-full ${profile.plan === "premium" ? "bg-gold" : "bg-mint"}`} />
                {profile.plan === "premium" ? "Premium (démo)" : "Gratuit"}
              </div>
            </div>
          </div>

          <nav aria-label="Mon compte" className="flex-1 overflow-y-auto p-3">
            <ul className="space-y-1">
              {nav.map((item) => {
                const active = isActive(path, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-[15px] transition-colors ${
                        active ? "text-cream" : "text-cream/75 hover:bg-cream/[0.05] hover:text-cream"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="account-nav"
                          className="absolute inset-0 rounded-2xl border border-gold/30 bg-gold/12"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className={`relative ${active ? "text-gold" : ""}`}>{item.icon}</span>
                      <span className="relative font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="space-y-3 border-t border-line p-5">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-cream/80">Parcours</span>
              <span className="font-mono text-cream tabular-nums">
                {completed}/{allLessons.length}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-cream/10">
              <motion.div
                className="h-full rounded-full bg-gold"
                initial={{ width: 0 }}
                animate={{ width: `${(completed / allLessons.length) * 100}%` }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            {next && (
              <Link
                href={`/cours/${next.slug}`}
                className="flex items-center justify-between gap-3 rounded-2xl bg-gold px-4 py-3 text-sm font-medium text-on-gold transition-transform active:scale-[0.98]"
              >
                <span className="truncate">Reprendre : {next.title}</span>
                <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        </motion.aside>
      )}

      {/* Tabs (mobile & tablet) */}
      {!printable && (
        <nav aria-label="Mon compte" className="sticky top-14 z-40 mt-14 border-b border-line bg-ink/85 backdrop-blur-xl lg:hidden print:hidden" data-lenis-prevent>
          <ul className="flex gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none]">
            {nav.map((item) => {
              const active = isActive(path, item.href);
              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm whitespace-nowrap ${active ? "text-ink" : "text-cream/80"}`}
                  >
                    {active && <motion.span layoutId="account-tab" className="absolute inset-0 rounded-full bg-cream" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                    <span className="relative">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <main
        className={`pb-24 lg:pt-[88px] ${printable ? "pt-20" : "pt-6 lg:pl-[332px]"} print:p-0`}
        style={profile.largeText ? { zoom: 1.08 } : undefined}
      >
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10 print:max-w-none print:px-0">{children}</div>
      </main>
    </MotionConfig>
  );
}
