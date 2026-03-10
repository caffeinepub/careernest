import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookText,
  CheckCircle,
  RotateCcw,
  Timer,
  Trophy,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { getHighScore, saveGameScore } from "../utils/localStorage";

type WordQuestion = {
  definition: string;
  correctWord: string;
  options: string[];
};

const TOTAL_QUESTIONS = 10;
const GAME_TIME_LIMIT = 120; // 2 minutes

const WORD_BANK = [
  {
    word: "Persevere",
    definition: "Continue in a course of action despite difficulty",
  },
  { word: "Diligent", definition: "Having or showing care in one's work" },
  { word: "Curious", definition: "Eager to know or learn something" },
  { word: "Analyze", definition: "Examine something methodically in detail" },
  { word: "Collaborate", definition: "Work jointly on an activity" },
  { word: "Innovate", definition: "Make changes in something established" },
  {
    word: "Resilient",
    definition: "Able to withstand or recover from difficulties",
  },
  { word: "Empathy", definition: "The ability to understand others' feelings" },
  { word: "Articulate", definition: "Express ideas clearly and effectively" },
  { word: "Dedicated", definition: "Devoted to a task or purpose" },
  { word: "Comprehend", definition: "Grasp mentally; understand" },
  { word: "Evaluate", definition: "Form an idea of the value of something" },
  {
    word: "Initiative",
    definition: "The ability to assess and begin things independently",
  },
  { word: "Proficient", definition: "Competent or skilled in doing something" },
  {
    word: "Synthesis",
    definition: "The combination of ideas to form a theory",
  },
  { word: "Critical", definition: "Expressing careful judgment or analysis" },
  { word: "Creative", definition: "Relating to or involving imagination" },
  {
    word: "Systematic",
    definition: "Done according to a fixed plan or method",
  },
  { word: "Objective", definition: "Not influenced by personal feelings" },
  { word: "Perspective", definition: "A particular attitude toward something" },
];

const generateQuestion = (usedWords: Set<string>): WordQuestion => {
  // Get unused words
  const availableWords = WORD_BANK.filter((w) => !usedWords.has(w.word));

  if (availableWords.length < 4) {
    // Reset if we're running out
    usedWords.clear();
    return generateQuestion(usedWords);
  }

  // Pick correct answer
  const correctIndex = Math.floor(Math.random() * availableWords.length);
  const correct = availableWords[correctIndex];
  usedWords.add(correct.word);

  // Pick wrong options
  const wrongOptions: string[] = [];
  const otherWords = WORD_BANK.filter((w) => w.word !== correct.word);

  while (wrongOptions.length < 3) {
    const randomWord =
      otherWords[Math.floor(Math.random() * otherWords.length)];
    if (!wrongOptions.includes(randomWord.word)) {
      wrongOptions.push(randomWord.word);
    }
  }

  const options = [correct.word, ...wrongOptions].sort(
    () => Math.random() - 0.5,
  );

  return {
    definition: correct.definition,
    correctWord: correct.word,
    options,
  };
};

export default function WordQuizPage() {
  const { identity } = useInternetIdentity();
  const userId = identity?.getPrincipal().toString() || "";
  const highScore = getHighScore(userId, "Word Quiz");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<WordQuestion[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const initializeGame = useCallback(() => {
    const usedWords = new Set<string>();
    const newQuestions: WordQuestion[] = [];

    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      newQuestions.push(generateQuestion(usedWords));
    }

    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setCorrectAnswers(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setGameStarted(true);
    setGameOver(false);
    setTimeElapsed(0);
    setFinalScore(0);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => {
          if (prev >= GAME_TIME_LIMIT) {
            endGame();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameOver]);

  const endGame = () => {
    setGameOver(true);
    setGameStarted(false);

    // Calculate score: correct answers * 10 + time bonus
    const timeBonus = Math.max(0, (GAME_TIME_LIMIT - timeElapsed) * 5);
    const score = correctAnswers * 10 + timeBonus;
    setFinalScore(score);

    // Save score
    if (identity) {
      saveGameScore({
        userId,
        gameName: "Word Quiz",
        score,
        duration: timeElapsed,
        details: {
          correctAnswers,
          totalQuestions: TOTAL_QUESTIONS,
          accuracy: (correctAnswers / TOTAL_QUESTIONS) * 100,
        },
      });

      if (score > highScore) {
        toast.success("🎉 New high score!");
      }
    }
  };

  const handleAnswerSelect = (option: string) => {
    if (showFeedback) return;

    setSelectedAnswer(option);
    setShowFeedback(true);

    const currentQ = questions[currentQuestion];
    const isCorrect = option === currentQ.correctWord;

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      toast.success("Correct!", { duration: 1000 });
    } else {
      toast.error(`Wrong! Answer was "${currentQ.correctWord}"`, {
        duration: 1500,
      });
    }

    setTimeout(() => {
      if (currentQuestion + 1 < TOTAL_QUESTIONS) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        endGame();
      }
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const timeRemaining = GAME_TIME_LIMIT - timeElapsed;
  const isTimeWarning = timeRemaining <= 20 && gameStarted && !gameOver;
  const progress = ((currentQuestion + 1) / TOTAL_QUESTIONS) * 100;

  if (questions.length === 0) {
    return null;
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/games">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Games
          </Button>
        </Link>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <BookText className="h-6 w-6 text-success" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold">Word Quiz</h1>
              <p className="text-muted-foreground">
                Match definitions to words
              </p>
            </div>
          </div>
          {highScore > 0 && (
            <Badge variant="outline" className="gap-2 py-2 px-4">
              <Trophy className="h-4 w-4 text-accent" />
              High Score: {highScore}
            </Badge>
          )}
        </div>
      </div>

      {!gameOver ? (
        <div className="space-y-6">
          {/* Progress and Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-primary/20">
              <CardContent className="py-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">
                  Question
                </div>
                <div className="text-2xl font-bold text-primary">
                  {currentQuestion + 1}/{TOTAL_QUESTIONS}
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary/20">
              <CardContent className="py-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Timer
                    className={`h-4 w-4 ${isTimeWarning ? "text-destructive" : "text-muted-foreground"}`}
                  />
                  <span className="text-sm text-muted-foreground">Time</span>
                </div>
                <div
                  className={`text-2xl font-bold ${isTimeWarning ? "text-destructive animate-pulse" : "text-secondary"}`}
                >
                  {formatTime(timeRemaining)}
                </div>
              </CardContent>
            </Card>

            <Card className="border-success/20">
              <CardContent className="py-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">
                  Correct
                </div>
                <div className="text-2xl font-bold text-success">
                  {correctAnswers}
                </div>
              </CardContent>
            </Card>
          </div>

          <Progress value={progress} className="h-2" />

          {/* Question Card */}
          <Card className="shadow-soft border-primary/20">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-serif mb-2">
                "{currentQ.definition}"
              </CardTitle>
              <CardDescription>
                Which word matches this definition?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {currentQ.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQ.correctWord;
                  const showResult = showFeedback && isSelected;

                  return (
                    <Button
                      key={option}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={showFeedback}
                      size="lg"
                      variant={
                        showResult
                          ? isCorrect
                            ? "default"
                            : "destructive"
                          : "outline"
                      }
                      className={`
                        h-16 text-xl font-semibold transition-all
                        ${showResult && isCorrect ? "bg-success hover:bg-success" : ""}
                        ${!showFeedback ? "hover:scale-105" : ""}
                      `}
                    >
                      {showResult &&
                        (isCorrect ? (
                          <CheckCircle className="mr-2 h-5 w-5" />
                        ) : (
                          <XCircle className="mr-2 h-5 w-5" />
                        ))}
                      {option}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Results Screen */
        <Card className="shadow-soft border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-success" />
            </div>
            <CardTitle className="text-3xl font-serif">
              Quiz Complete!
            </CardTitle>
            <CardDescription>
              You got {correctAnswers} out of {TOTAL_QUESTIONS} correct
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Final Score
                </p>
                <p className="text-3xl font-bold text-success">{finalScore}</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Time</p>
                <p className="text-3xl font-bold text-secondary">
                  {formatTime(timeElapsed)}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                <p className="text-3xl font-bold text-primary">
                  {((correctAnswers / TOTAL_QUESTIONS) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Correct</p>
                <p className="text-3xl font-bold text-accent">
                  {correctAnswers}/{TOTAL_QUESTIONS}
                </p>
              </div>
            </div>

            {correctAnswers === TOTAL_QUESTIONS && (
              <div className="p-4 bg-success/10 rounded-lg text-center">
                <p className="text-success font-semibold">Perfect Score! 🎉</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You have an excellent vocabulary!
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={initializeGame} className="flex-1 gap-2">
                <RotateCcw className="h-4 w-4" />
                Play Again
              </Button>
              <Link to="/games" className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Games
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
