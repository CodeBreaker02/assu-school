/**
 * Question schema for the Duolingo-style quiz engine.
 * Every question has a lesson-unique `id` (used by spaced repetition) and an
 * `explanation` shown in the feedback sheet, right or wrong.
 */

type Base = { id: string; explanation: string };

export type Question = Base &
  (
    | {
        type: "choice";
        prompt: string;
        options: string[];
        answer: number;
        /** Optional short scenario shown above the prompt ("Awa gagne 200 000 F…"). */
        context?: string;
      }
    | { type: "truefalse"; prompt: string; answer: boolean }
    | {
        type: "numeric";
        prompt: string;
        answer: number;
        unit?: string;
        /** Accepted absolute error, defaults to 0. */
        tolerance?: number;
        hint?: string;
      }
    | {
        /** A sentence with one blank; pick the right chip. */
        type: "fill";
        before: string;
        after: string;
        options: string[];
        answer: number;
      }
    | {
        /** Tap a left item then its right partner. Pairs are given in matching order. */
        type: "match";
        prompt: string;
        pairs: [string, string][];
      }
    | {
        /** Items given in the correct order; shuffled at runtime. */
        type: "order";
        prompt: string;
        items: string[];
      }
  );

export type QuestionType = Question["type"];

/** Quiz questions keyed by lesson slug. */
export type QuizBank = Record<string, Question[]>;
