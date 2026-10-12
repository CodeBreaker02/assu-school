import { Eyebrow, Reveal } from "./reveal";

const faculty = [
  { role: "Analyste financière", focus: "BRVM & obligations", hue: "#e9b44c" },
  { role: "Économiste", focus: "Monnaie & inflation", hue: "#e2603b" },
  { role: "Conseillère en finances personnelles", focus: "Budget, famille, retraite", hue: "#6fd39a" },
  { role: "Spécialiste microfinance", focus: "Tontines & Mobile Money", hue: "#9fb6ff" },
  { role: "Motion designer", focus: "Chaque animation du cours", hue: "#d9a6ff" },
];

export function Faculty() {
  return (
    <section className="relative mx-auto max-w-[1560px] px-5 py-24 sm:px-6 md:py-32">
      <div className="grid items-end gap-12 lg:grid-cols-2">
        <Reveal>
          <Eyebrow>Qui enseigne</Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(2.5rem,5.8vw,6.6rem)] leading-[1] tracking-[-0.015em]">
            Une équipe. <em className="text-muted">Pas un gourou.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-md text-lg text-muted lg:ml-auto">
            Pas de Lamborghini ni de promesses. Chaque leçon est écrite par un spécialiste et relue
            par deux autres.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {faculty.map((f, i) => (
          <Reveal key={f.role} delay={i * 0.06}>
            <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-ink-2 p-4 sm:p-5 transition-colors hover:border-line-strong">
              {/* abstract portrait: concentric arcs in the member's colour */}
              <svg viewBox="0 0 100 100" className="absolute inset-x-0 top-4 mx-auto w-[52%] sm:top-5 sm:w-[66%] transition-transform duration-700 group-hover:scale-105 group-hover:rotate-6" aria-hidden>
                {[40, 31, 22, 13].map((r, k) => (
                  <circle
                    key={r}
                    cx="50"
                    cy="50"
                    r={r}
                    fill="none"
                    stroke={f.hue}
                    strokeOpacity={0.18 + k * 0.2}
                    strokeWidth={1 + k * 0.4}
                    strokeDasharray={`${r * 3} ${r * 0.6}`}
                    transform={`rotate(${i * 40 + k * 55} 50 50)`}
                  />
                ))}
                <circle cx="50" cy="50" r="5" fill={f.hue} />
              </svg>
              <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
                <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] text-muted uppercase sm:text-[10px] sm:tracking-[0.18em]">
                  <span className="size-1.5 rounded-full" style={{ background: f.hue }} />
                  {f.focus}
                </div>
                <div className="mt-1.5 font-display text-base leading-tight sm:text-xl">{f.role}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
