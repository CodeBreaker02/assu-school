import { LearnHeader } from "./learn-header";

/** Shown while a lesson streams in: same grid as the lesson, shimmering placeholders. */
export function LessonSkeleton() {
  const bar = "animate-pulse rounded-full bg-cream/[0.07]";
  return (
    <>
      <LearnHeader />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-24 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16" aria-busy>
        <div className="hidden space-y-3 lg:block">
          <div className={`h-3 w-24 ${bar}`} />
          <div className={`h-6 w-48 ${bar}`} />
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={`h-9 ${bar} rounded-xl`} />
          ))}
        </div>
        <div className="mx-auto w-full max-w-3xl space-y-4">
          <div className={`h-3 w-40 ${bar}`} />
          <div className={`h-12 w-4/5 ${bar} rounded-2xl`} />
          <div className={`h-4 w-3/5 ${bar}`} />
          <div className="mt-10 aspect-video animate-pulse rounded-3xl bg-cream/[0.06]" />
        </div>
      </div>
    </>
  );
}
