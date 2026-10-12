import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LessonLayout } from "@/components/learn/lesson-layout";
import { LessonSkeleton } from "@/components/learn/lesson-skeleton";
import { allLessons } from "@/lib/content";
import { getLesson } from "@/lib/lessons";

export function generateStaticParams() {
  return allLessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cours/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const lesson = allLessons.find((l) => l.slug === slug);
  if (!lesson) return {};
  return {
    title: `${lesson.title} — Assu School`,
    description: getLesson(slug)?.subtitle ?? `Chapitre ${lesson.chapter.number} · ${lesson.chapter.title}`,
  };
}

// The App Shell is shared by every lesson URL, so the slug is read behind Suspense.
export default function LessonPage({ params }: PageProps<"/cours/[slug]">) {
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <Lesson params={params} />
    </Suspense>
  );
}

async function Lesson({ params }: Pick<PageProps<"/cours/[slug]">, "params">) {
  const { slug } = await params;
  const i = allLessons.findIndex((l) => l.slug === slug);
  if (i < 0) notFound();
  return (
    <LessonLayout
      lesson={allLessons[i]}
      content={getLesson(slug) ?? null}
      prev={allLessons[i - 1] ?? null}
      next={allLessons[i + 1] ?? null}
    />
  );
}
