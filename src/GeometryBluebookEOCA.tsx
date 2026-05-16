import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calculator,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flag,
  Maximize2,
  Send,
} from "lucide-react";
import { DiagramFrame } from "./components/GeometryDiagrams";
import { MathText } from "./components/MathText";
import { baseQuestions, type GeometryStandard, type Question } from "./data/questions";

declare global {
  interface Window {
    Desmos: unknown;
  }
}

const answerKeys = ["A", "B", "C", "D"];
const examSeconds = 60 * 90;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function shuffleQuestions(questions: Question[]) {
  return [...questions].sort(() => Math.random() - 0.5);
}

export default function GeometryBluebookEOCA() {
  const [questions] = useState(() => shuffleQuestions(baseQuestions));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(examSeconds);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeSpent, setTimeSpent] = useState<Record<number, number>>({});
  const currentQuestion = questions[current];
  const currentQuestionIdRef = useRef(currentQuestion.id);

  const answeredCount = Object.keys(answers).length;
  const unansweredQuestions = questions.filter((q) => answers[q.id] === undefined);
  const flaggedQuestions = questions.filter((q) => flagged.includes(q.id));
  const score = questions.reduce((acc, q) => (answers[q.id] === q.answer ? acc + 1 : acc), 0);
  const elapsedTime = examSeconds - timeLeft;

  const standardStats = questions.reduce(
    (stats, question) => {
      const currentStats = stats[question.standard] ?? { correct: 0, total: 0 };
      return {
        ...stats,
        [question.standard]: {
          correct: currentStats.correct + (answers[question.id] === question.answer ? 1 : 0),
          total: currentStats.total + 1,
        },
      };
    },
    {} as Record<GeometryStandard, { correct: number; total: number }>
  );

  const toggleFlag = (questionId: number) => {
    setFlagged((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  useEffect(() => {
    if (!hasStarted) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsReviewing(true);
          return 0;
        }

        return prev - 1;
      });
      setTimeSpent((prev) => ({
        ...prev,
        [currentQuestionIdRef.current]: (prev[currentQuestionIdRef.current] ?? 0) + 1,
      }));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [hasStarted]);

  useEffect(() => {
    currentQuestionIdRef.current = currentQuestion.id;
  }, [currentQuestion.id]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || isReviewing) return;

      if (event.key === "ArrowLeft") {
        setCurrent((value) => Math.max(0, value - 1));
      }

      if (event.key === "ArrowRight") {
        setCurrent((value) => Math.min(questions.length - 1, value + 1));
      }

      const choiceIndex = answerKeys.findIndex((key) => key.toLowerCase() === event.key.toLowerCase());
      if (choiceIndex >= 0 && choiceIndex < currentQuestion.choices.length) {
        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: choiceIndex }));
      }

      if (event.key.toLowerCase() === "f") {
        toggleFlag(currentQuestion.id);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentQuestion, isReviewing, questions.length]);

  const requestFullscreen = () => {
    document.documentElement.requestFullscreen?.();
  };

  const goToQuestion = (index: number) => {
    setCurrent(index);
    setIsReviewing(false);
  };

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-[#f4f6f8] text-[#1f2933]">
        <div className="h-2 bg-[#2454a6]" />
        <main className="min-h-[calc(100vh-8px)] flex items-center justify-center px-6">
          <section className="w-full max-w-3xl rounded-md border border-[#c8d1dc] bg-white p-10 text-center shadow-sm">
            <h1 className="text-5xl font-bold tracking-tight text-[#111827]">
              AlanBook
            </h1>
            <p className="mt-4 text-2xl font-semibold text-[#334155]">
              Geometry Semester 2 Mock Exam
            </p>
            <div className="mt-8 border-t border-[#d9e2ec] pt-8">
              <button
                onClick={() => setHasStarted(true)}
                className="rounded-md bg-[#2454a6] px-8 py-3 text-lg font-semibold text-white hover:bg-[#1d4384]"
              >
                Start Exam
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (isReviewing) {
    return (
      <div className="min-h-screen bg-[#f4f6f8] text-[#1f2933]">
        <header className="border-b border-[#c8d1dc] bg-white">
          <div className="h-2 bg-[#2454a6]" />
          <div className="h-20 px-8 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Geometry Bluebook EOCA</h1>
              <p className="text-sm text-[#52657a]">Review answers before ending your practice exam</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-md border border-[#b8c4d2] bg-[#f8fafc] px-4 py-2 flex items-center gap-2 font-mono">
                <Clock3 size={18} />
                {formatTime(timeLeft)}
              </div>
              <button
                onClick={() => setIsReviewing(false)}
                className="rounded-md bg-[#2454a6] px-5 py-2 font-semibold text-white hover:bg-[#1d4384]"
              >
                Return to test
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8">
          <section className="grid gap-4 md:grid-cols-4">
            <ReviewStat label="Current score" value={`${score}/${questions.length}`} />
            <ReviewStat label="Answered" value={`${answeredCount}/${questions.length}`} />
            <ReviewStat label="Flagged" value={`${flaggedQuestions.length}`} />
            <ReviewStat label="Time spent" value={formatTime(elapsedTime)} />
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_1fr] mt-6">
            <div className="rounded-md border border-[#c8d1dc] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Score by standard</h2>
              <div className="space-y-3">
                {Object.entries(standardStats).map(([standard, stats]) => (
                  <div key={standard}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{standard}</span>
                      <span className="text-[#52657a]">{stats.correct}/{stats.total}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#d9e2ec]">
                      <div
                        className="h-full bg-[#2454a6]"
                        style={{ width: `${(stats.correct / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-[#c8d1dc] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Attention needed</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <ReviewList
                  title="Unanswered"
                  questions={unansweredQuestions}
                  allQuestions={questions}
                  onSelect={goToQuestion}
                  emptyText="All questions have an answer."
                />
                <ReviewList
                  title="Flagged"
                  questions={flaggedQuestions}
                  allQuestions={questions}
                  onSelect={goToQuestion}
                  emptyText="No questions are flagged."
                />
              </div>
            </div>
          </section>

          <section className="rounded-md border border-[#c8d1dc] bg-white p-5 mt-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Question review</h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {questions.map((question, index) => {
                const selected = answers[question.id];
                const isCorrect = selected === question.answer;
                return (
                  <button
                    key={question.id}
                    onClick={() => goToQuestion(index)}
                    className="text-left rounded-md border border-[#c8d1dc] bg-[#f8fafc] p-3 transition hover:border-[#2454a6]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">Question {index + 1}</span>
                      <span className={selected === undefined ? "text-[#9a6700]" : isCorrect ? "text-[#0f766e]" : "text-[#b42318]"}>
                        {selected === undefined ? "Blank" : isCorrect ? "Correct" : "Review"}
                      </span>
                    </div>
                    <div className="text-xs text-[#52657a] mt-2">{question.standard}</div>
                    <div className="text-xs text-[#728197] mt-1">{formatTime(timeSpent[question.id] ?? 0)}</div>
                  </button>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#f4f6f8] text-[#1f2933] flex">
      <aside className="w-[88px] shrink-0 border-r border-[#c8d1dc] bg-[#eef2f6]">
        <div className="h-2 bg-[#2454a6]" />
        <div className="h-[calc(100vh-8px)] overflow-y-auto p-3">
          <div className="mb-3 text-center text-[11px] font-semibold uppercase tracking-wide text-[#52657a]">
            Questions
          </div>
          <div className="grid grid-cols-1 gap-2 pb-24">
            {questions.map((q, index) => {
              const answered = answers[q.id] !== undefined;
              const isFlagged = flagged.includes(q.id);

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrent(index)}
                  className={`h-9 rounded-md border text-sm font-semibold transition ${
                    current === index
                      ? "border-[#2454a6] bg-[#2454a6] text-white"
                      : isFlagged
                        ? "border-[#d99a00] bg-[#fff7d6] text-[#5c4200]"
                        : answered
                          ? "border-[#15803d] bg-[#dcfce7] text-[#14532d]"
                          : "border-[#b8c4d2] bg-white text-[#1f2933] hover:border-[#2454a6]"
                  }`}
                  title={`Question ${index + 1}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="shrink-0 border-b border-[#c8d1dc] bg-white">
          <div className="h-2 bg-[#2454a6]" />
          <div className="h-[72px] px-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Geometry Bluebook EOCA</h1>
              <p className="text-sm text-[#52657a]">
                Question {current + 1} of {questions.length}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={requestFullscreen}
                className="rounded-md border border-[#b8c4d2] bg-white p-2.5 hover:border-[#2454a6]"
                title="Fullscreen"
              >
                <Maximize2 size={18} />
              </button>
              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className="rounded-md border border-[#b8c4d2] bg-white px-4 py-2 flex items-center gap-2 hover:border-[#2454a6]"
              >
                <Calculator size={18} />
                Calculator
              </button>
              <div className="rounded-md border border-[#b8c4d2] bg-[#f8fafc] px-4 py-2 flex items-center gap-2 font-mono">
                <Clock3 size={18} />
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto px-8 py-7 pb-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.16 }}
                className="max-w-4xl"
              >
                <div className="mb-6 rounded-md border border-[#c8d1dc] bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-start justify-between gap-5">
                    <div>
                      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#52657a]">
                        {currentQuestion.standard}
                      </div>
                      <h2 className="text-[1.45rem] font-semibold leading-8 text-[#111827]">
                        <MathText>{currentQuestion.question}</MathText>
                      </h2>
                    </div>

                    <button
                      onClick={() => toggleFlag(currentQuestion.id)}
                      className={`shrink-0 rounded-md border px-4 py-2 flex items-center gap-2 ${
                        flagged.includes(currentQuestion.id)
                          ? "border-[#d99a00] bg-[#fff7d6] text-[#5c4200]"
                          : "border-[#b8c4d2] bg-white text-[#1f2933]"
                      }`}
                    >
                      <Flag size={16} />
                      Flag
                    </button>
                  </div>

                  <div className="space-y-3">
                    {currentQuestion.choices.map((choice, index) => (
                      <button
                        key={`${currentQuestion.id}-${choice}`}
                        onClick={() =>
                          setAnswers({
                            ...answers,
                            [currentQuestion.id]: index,
                          })
                        }
                        className={`w-full rounded-md border p-4 text-left transition ${
                          answers[currentQuestion.id] === index
                            ? "border-[#2454a6] bg-[#e8f0ff] ring-2 ring-[#2454a6]/20"
                            : "border-[#c8d1dc] bg-white hover:border-[#2454a6]"
                        }`}
                      >
                        <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#9fb0c3] bg-[#f8fafc] text-sm font-semibold">
                          {answerKeys[index]}
                        </span>
                        <MathText>{choice}</MathText>
                      </button>
                    ))}
                  </div>

                  {currentQuestion.diagram && (
                    <DiagramFrame>{currentQuestion.diagram}</DiagramFrame>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </main>

          <aside
            className={`shrink-0 border-l border-[#c8d1dc] bg-white pb-28 transition-[width,padding] duration-200 ${
              showCalculator ? "w-[420px] p-4" : "w-0 overflow-hidden p-0"
            }`}
            aria-hidden={!showCalculator}
          >
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#52657a]">
              Desmos Calculator
            </div>
            <iframe
              src="https://www.desmos.com/calculator"
              className="h-[calc(100vh-210px)] min-h-[520px] w-[388px] rounded-md border border-[#c8d1dc] bg-white"
              title="Desmos calculator"
            />
          </aside>
        </div>

        <footer className="fixed bottom-0 left-[88px] right-0 z-20 h-20 border-t border-[#c8d1dc] bg-white px-6 shadow-[0_-4px_16px_rgba(15,23,42,0.08)] flex items-center justify-between">
          <button
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            className="rounded-md border border-[#b8c4d2] bg-white px-5 py-3 flex items-center gap-2 font-semibold disabled:opacity-40 hover:border-[#2454a6]"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <div className="flex items-center gap-4 text-sm text-[#52657a]">
            <span>{answeredCount}/{questions.length} answered</span>
            <span>{flaggedQuestions.length} flagged</span>
            <button
              onClick={() => setIsReviewing(true)}
              className="rounded-md bg-[#2454a6] px-5 py-3 font-semibold flex items-center gap-2 text-white hover:bg-[#1d4384]"
            >
              Review
              <Send size={17} />
            </button>
          </div>

          <button
            onClick={() => setCurrent(Math.min(questions.length - 1, current + 1))}
            disabled={current === questions.length - 1}
            className="rounded-md bg-[#2454a6] px-6 py-3 font-semibold flex items-center gap-2 text-white disabled:opacity-40 hover:bg-[#1d4384]"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </footer>
      </div>
    </div>
  );
}

function ReviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#c8d1dc] bg-white p-5 shadow-sm">
      <div className="text-sm text-[#52657a]">{label}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}

function ReviewList({
  title,
  questions,
  allQuestions,
  onSelect,
  emptyText,
}: {
  title: string;
  questions: Question[];
  allQuestions: Question[];
  onSelect: (index: number) => void;
  emptyText: string;
}) {
  return (
    <div>
      <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#52657a] mb-2">{title}</div>
      {questions.length === 0 ? (
        <p className="text-sm text-[#728197]">{emptyText}</p>
      ) : (
        <div className="space-y-2">
          {questions.map((question) => {
            const index = allQuestions.findIndex((candidate) => candidate.id === question.id);
            return (
              <button
                key={question.id}
                onClick={() => onSelect(index)}
                className="w-full text-left rounded-md border border-[#c8d1dc] bg-[#f8fafc] px-3 py-2 hover:border-[#2454a6]"
              >
                Question {index + 1}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
