import { lessonContent } from "./lessons";
import type { Question } from "./quiz";
import { quizBank } from "./quizzes";

/** The lesson's quiz: the rich bank when available, else the lesson's simple MCQs. */
export function getQuestions(slug: string): Question[] {
  const bank = quizBank[slug];
  if (bank?.length) return bank;
  return (lessonContent[slug]?.quiz ?? []).map((q, i) => ({
    id: `legacy-${i}`,
    type: "choice" as const,
    prompt: q.question,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation,
  }));
}

export function findQuestion(slug: string, id: string) {
  return getQuestions(slug).find((q) => q.id === id);
}
