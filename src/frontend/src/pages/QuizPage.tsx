import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, CheckCircle, RotateCcw, Trophy, XCircle } from "lucide-react";
import { useState } from "react";
import { useGetAllAdminNotes } from "../hooks/useQueries";

interface MCQQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface Assessment {
  id: bigint;
  title: string;
  subject: string;
  educationLevel: string;
  questions: MCQQuestion[];
}

type QuizState = "list" | "taking" | "results";

export default function QuizPage() {
  const { data: adminNotes, isLoading } = useGetAllAdminNotes();
  const [quizState, setQuizState] = useState<QuizState>("list");
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(
    null,
  );
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQ, setCurrentQ] = useState(0);

  const assessmentNotes = (adminNotes || []).filter(
    (note: any) => note.topic === "assessment",
  );

  const assessments: Assessment[] = assessmentNotes
    .map((note: any) => {
      try {
        const parsed = JSON.parse(note.content);
        return {
          id: note.id,
          title: parsed.title || note.title,
          subject: parsed.subject || note.subject,
          educationLevel: parsed.educationLevel || note.educationLevel,
          questions: parsed.questions || [],
        } as Assessment;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Assessment[];

  const startQuiz = (assessment: Assessment) => {
    setActiveAssessment(assessment);
    setAnswers({});
    setCurrentQ(0);
    setQuizState("taking");
  };

  const selectAnswer = (qIdx: number, optIdx: number) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const submitQuiz = () => setQuizState("results");
  const restartQuiz = () => {
    setActiveAssessment(null);
    setQuizState("list");
  };

  const score = activeAssessment
    ? activeAssessment.questions.filter((q, i) => answers[i] === q.correctIndex)
        .length
    : 0;

  // LIST STATE
  if (quizState === "list") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2 flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            Quiz & Assessments
          </h1>
          <p className="text-muted-foreground">
            Test your knowledge with assessments created by your teachers.
          </p>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="quiz.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : assessments.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="quiz.empty_state"
          >
            <Brain className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No assessments available yet
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Assessments will appear here once your teacher creates them.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="quiz.list"
          >
            {assessments.map((assessment, idx) => (
              <Card
                key={String(assessment.id)}
                className="hover:shadow-md transition-shadow"
                data-ocid={`quiz.item.${idx + 1}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {assessment.educationLevel}
                    </Badge>
                  </div>
                  <CardTitle className="text-base mt-2">
                    {assessment.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-1">
                    {assessment.subject}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {assessment.questions.length} questions
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => startQuiz(assessment)}
                    data-ocid={`quiz.item.${idx + 1}.primary_button`}
                  >
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // TAKING STATE
  if (quizState === "taking" && activeAssessment) {
    const question = activeAssessment.questions[currentQ];
    const totalQ = activeAssessment.questions.length;
    const progress = ((currentQ + 1) / totalQ) * 100;
    const answered = answers[currentQ] !== undefined;
    const allAnswered = activeAssessment.questions.every(
      (_, i) => answers[i] !== undefined,
    );

    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif font-bold text-xl text-foreground">
              {activeAssessment.title}
            </h2>
            <Badge variant="secondary">
              {currentQ + 1} / {totalQ}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card className="mb-6" data-ocid="quiz.panel">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Q{currentQ + 1}. {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={
                answers[currentQ] !== undefined ? String(answers[currentQ]) : ""
              }
              onValueChange={(val) => selectAnswer(currentQ, Number(val))}
            >
              {question.options.map((option, optIdx) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: MCQ options are positional
                  key={optIdx}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    answers[currentQ] === optIdx
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onClick={() => selectAnswer(currentQ, optIdx)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && selectAnswer(currentQ, optIdx)
                  }
                  data-ocid={`quiz.radio.${optIdx + 1}`}
                >
                  <RadioGroupItem value={String(optIdx)} id={`opt-${optIdx}`} />
                  <label
                    htmlFor={`opt-${optIdx}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    <span className="font-medium text-primary mr-2">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    {option}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQ((q) => Math.max(0, q - 1))}
            disabled={currentQ === 0}
            data-ocid="quiz.pagination_prev"
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {currentQ < totalQ - 1 ? (
              <Button
                onClick={() => setCurrentQ((q) => q + 1)}
                disabled={!answered}
                data-ocid="quiz.pagination_next"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={submitQuiz}
                disabled={!allAnswered}
                className="bg-green-600 hover:bg-green-700"
                data-ocid="quiz.submit_button"
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigation dots */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center">
          {activeAssessment.questions.map((_, i) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: question navigation is positional
              key={i}
              type="button"
              className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                i === currentQ
                  ? "bg-primary text-primary-foreground"
                  : answers[i] !== undefined
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-muted text-muted-foreground border border-border"
              }`}
              onClick={() => setCurrentQ(i)}
              data-ocid={`quiz.item.${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // RESULTS STATE
  if (quizState === "results" && activeAssessment) {
    const totalQ = activeAssessment.questions.length;
    const pct = Math.round((score / totalQ) * 100);

    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Score Card */}
        <Card
          className="mb-8 border-2 border-primary/20"
          data-ocid="quiz.success_state"
        >
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold ${
                  pct >= 70
                    ? "bg-green-100 text-green-700"
                    : pct >= 40
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                <Trophy className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-2xl">
              {score} / {totalQ}
            </CardTitle>
            <p className="text-muted-foreground">
              {pct >= 70
                ? "Excellent work! 🎉"
                : pct >= 40
                  ? "Good effort! Keep practicing."
                  : "Keep studying, you'll get better!"}
            </p>
            <div className="mt-3">
              <Progress value={pct} className="h-3" />
              <p className="text-sm text-muted-foreground mt-1">
                {pct}% correct
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Answers Review */}
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          Answer Review
        </h3>
        <div className="space-y-4 mb-8">
          {activeAssessment.questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correctIndex;
            return (
              <Card
                // biome-ignore lint/suspicious/noArrayIndexKey: review order is positional
                key={i}
                className={`border ${
                  isCorrect
                    ? "border-green-200 bg-green-50/50"
                    : "border-red-200 bg-red-50/50"
                }`}
                data-ocid={`quiz.item.${i + 1}`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2 mb-3">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-medium text-foreground">
                      Q{i + 1}. {q.question}
                    </p>
                  </div>
                  <div className="ml-7 space-y-1">
                    {q.options.map((opt, optIdx) => (
                      <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: option display is positional
                        key={optIdx}
                        className={`text-xs px-3 py-2 rounded-md ${
                          optIdx === q.correctIndex
                            ? "bg-green-100 text-green-800 font-medium"
                            : optIdx === userAnswer && !isCorrect
                              ? "bg-red-100 text-red-700 line-through"
                              : "text-muted-foreground"
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt}
                        {optIdx === q.correctIndex && " ✓"}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={restartQuiz}
            className="flex-1"
            data-ocid="quiz.primary_button"
          >
            <RotateCcw className="h-4 w-4 mr-2" /> Back to Assessments
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setAnswers({});
              setCurrentQ(0);
              setQuizState("taking");
            }}
            data-ocid="quiz.secondary_button"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
