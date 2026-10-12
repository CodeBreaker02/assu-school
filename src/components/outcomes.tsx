import { Eyebrow, Reveal } from "./reveal";

const outcomes = [
  {
    title: "Tenir quand le revenu varie",
    body: "Un budget qui marche, même les mauvais mois.",
    icon: <path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5Z" />,
  },
  {
    title: "Faire travailler son argent",
    body: "De la tontine à vos premières actions BRVM.",
    icon: <path d="M3 17 9 11l4 4 8-8M15 7h6v6" />,
  },
  {
    title: "Ne plus se faire avoir",
    body: "Frais cachés, crédits piégeux, arnaques : repérés.",
    icon: (
      <>
        <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z" />
        <path d="m8.5 12 2.5 2.5 4.5-5" />
      </>
    ),
  },
  {
    title: "Aider les siens sans s'oublier",
    body: "Un budget solidarité, des limites claires.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
      </>
    ),
  },
];

export function Outcomes() {
  return (
    <section className="mx-auto max-w-[1560px] px-5 pb-8 sm:px-6">
      <Reveal>
        <Eyebrow>Ce que ça change</Eyebrow>
      </Reveal>
      <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {outcomes.map((o, i) => (
          <Reveal key={o.title} delay={i * 0.06} y={18} className="bg-ink p-7">
            <svg
              viewBox="0 0 24 24"
              className="size-7 fill-none stroke-gold stroke-[1.5]"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              {o.icon}
            </svg>
            <h3 className="mt-6 font-display text-2xl">{o.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{o.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
