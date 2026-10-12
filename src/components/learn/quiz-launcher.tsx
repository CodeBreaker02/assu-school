"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { CourseLesson } from "@/lib/content";
import { findQuestion, getQuestions } from "@/lib/questions";
import type { Question } from "@/lib/quiz";
import { XP, game, useGame } from "./gamification";
import { Kori } from "./mascot";
import { InView } from "./motion";
import { AnswerInput, type AnswerValue, correctAnswerLabel, initialValue, isAnswered, isCorrect, promptOf, typeLabel } from "./quiz-answers";
import { QuizSession } from "./quiz-session";
import { sfx } from "./sound";

const typeNames: Record<Question["type"], string> = {
  choice: "QCM",
  truefalse: "Vrai/faux",
  numeric: "Calcul",
  fill: "Phrase à trous",
  match: "Paires",
  order: "Ordre",
};

/** End-of-lesson card that opens the full-screen quiz session. */
export function QuizLauncher({ slug, title, next }: { slug: string; title: string; next: CourseLesson | null }) {
  const [open, setOpen] = useState(false);
  const g = useGame();
  const questions = getQuestions(slug);
  const best = g.state.quizBest[slug];
  const types = [...new Set(questions.map((q) => q.type))];
  if (!questions.length) return null;

  return (
    <InView className="my-14">
      <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-[radial-gradient(120%_120%_at_100%_0%,color-mix(in_oklab,var(--gold)_18%,transparent),transparent_60%)] p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Kori mood={best === 1 ? "party" : "idle"} size={88} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gold">Quiz de la leçon</div>
            <h3 className="mt-1 font-display text-[1.9rem] leading-tight">Prêt à vérifier ce que vous avez retenu ?</h3>
            <p className="mt-2 text-[16px] leading-relaxed text-cream/85">
              {questions.length} questions · jusqu&apos;à {questions.length * XP.correct + XP.perfect} XP. Réussissez-en 60 % pour valider la leçon.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {types.map((t) => (
                <span key={t} className="rounded-full border border-line-strong px-3 py-1 text-[13px] text-cream/80">
                  {typeNames[t]}
                </span>
              ))}
              {best !== undefined && (
                <span className="rounded-full bg-mint/15 px-3 py-1 text-[13px] text-mint">Meilleur score : {Math.round(best * 100)} %</span>
              )}
            </div>
          </div>
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96, y: 2 }}
            className="shrink-0 rounded-2xl bg-gold px-7 py-4 text-base font-semibold text-on-gold shadow-[0_4px_0_rgb(0_0_0/0.25)]"
          >
            {best !== undefined ? "Rejouer" : "Commencer le quiz"}
          </motion.button>
        </div>
      </div>
      <QuizSession
        open={open}
        onClose={() => setOpen(false)}
        items={questions.map((q) => ({ lesson: slug, q }))}
        title={`Quiz · ${title}`}
        mode="lesson"
        lessonSlug={slug}
        next={next}
      />
    </InView>
  );
}

/** A single question inside the lesson text: quick active recall, no pressure. */
export function InlineCheck({ lesson, id }: { lesson: string; id: string }) {
  const q = findQuestion(lesson, id);
  const g = useGame();
  const [value, setValue] = useState<AnswerValue>(() => (q ? initialValue(q) : null));
  const [result, setResult] = useState<boolean | null>(null);
  if (!q) return null;

  const check = () => {
    if (!isAnswered(q, value) || result !== null) return;
    const ok = isCorrect(q, value);
    setResult(ok);
    game.review(lesson, q.id, ok);
    if (ok) game.addXp(5, { correct: 1 });
    if (g.sound) (ok ? sfx.correct : sfx.wrong)();
  };

  return (
    <InView className="my-10">
      <div className="rounded-3xl border-2 border-dashed border-gold/40 p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <Kori mood={result === null ? "think" : result ? "happy" : "sad"} size={40} />
          <div>
            <div className="text-sm font-medium text-gold">Vérification rapide · {typeLabel[q.type]}</div>
            {q.type !== "fill" && <div className="mt-0.5 font-display text-xl leading-snug">{promptOf(q)}</div>}
          </div>
        </div>
        <div className="mt-5">
          <AnswerInput q={q} value={value} onChange={setValue} locked={result !== null} result={result} />
        </div>
        <AnimatePresence mode="wait">
          {result === null ? (
            <motion.button
              key="check"
              type="button"
              disabled={!isAnswered(q, value)}
              onClick={check}
              whileTap={{ scale: 0.96 }}
              className="mt-5 rounded-2xl bg-gold px-6 py-3 font-semibold text-on-gold disabled:opacity-35"
            >
              Vérifier
            </motion.button>
          ) : (
            <motion.div
              key="fb"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-5 rounded-2xl p-4 ${result ? "bg-mint/12" : "bg-ember/12"}`}
            >
              <div className={`font-display text-lg ${result ? "text-mint" : "text-ember"}`}>
                {result ? "Exact ! +5 XP" : `Pas tout à fait. Réponse : ${correctAnswerLabel(q)}`}
              </div>
              <p className="mt-1 text-[16px] leading-relaxed text-cream/85">{q.explanation}</p>
              {!result && <p className="mt-1 text-sm text-cream/70">Cette question reviendra dans vos révisions.</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </InView>
  );
}
