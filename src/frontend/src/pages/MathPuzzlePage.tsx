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
  Calculator,
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

type Question = {
  question: string;
  answer: number;
  options: number[];
};

const TOTAL_QUESTIONS = 10;
const GAME_TIME_LIMIT = 120; // 2 minutes

const generateQuestion = (): Question => {
  const operations = ["+", "-", "×"];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let num1: number;
  let num2: number;
  let answer: number;
  let question: string;

  switch (operation) {
    case "+":
      num1 = Math.floor(Math.random() * 50) + 10;
      num2 = Math.floor(Math.random() * 50) + 10;
      answer = num1 + num2;
      question = `${num1} + ${num2}`;
      break;
    case "-":
      num1 = Math.floor(Math.random() * 50) + 30;
      num2 = Math.floor(Math.random() * 30) + 10;
      answer = num1 - num2;
      question = `${num1} - ${num2}`;
      break;
    case "×":
      num1 = Math.floor(Math.random() * 12) + 2;
      num2 = Math.floor(Math.random() * 12) + 2;
      answer = num1 * num2;
      question = `${num1} × ${num2}`;
      break;
    default:
      num1 = 10;
      num2 = 5;
      answer = 15;
      question = `${num1} + ${num2}`;
  }

  // Generate wrong options
  const wrongOptions = new Set<number>();
  while (wrongOptions.size < 3) {
    const offset = Math.floor(Math.random() * 20) - 10;
    const wrongAnswer = answer + offset;
    if (wrongAnswer !== answer && wrongAnswer > 0) {
      wrongOptions.add(wrongAnswer);
    }
  }

  const options = [answer, ...Array.from(wrongOptions)].sort(
    () => Math.random() - 0.5,
  );

  return { question, answer, options };
};

export default function MathPuzzlePage() {
  const { identity } = useInternetIdentity();
  const userId = identity?.getPrincipal().toString() || "";
  const highScore = getHighScore(userId, "Math Puzzle");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const initializeGame = useCallback(() => {
    const newQuestions: Question[] = [];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      newQuestions.push(generateQuestion());
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
        gameName: "Math Puzzle",
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

  const handleAnswerSelect = (option: number) => {
    if (showFeedback) return;

    setSelectedAnswer(option);
    setShowFeedback(true);

    const currentQ = questions[currentQuestion];
    const isCorrect = option === currentQ.answer;

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      toast.success("Correct!", { duration: 1000 });
    } else {
      toast.error(`Wrong! Answer was ${currentQ.answer}`, { duration: 1500 });
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
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <Calculator className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold">Math Puzzle</h1>
              <p className="text-muted-foreground">
                Solve 10 quick math problems
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
              <CardTitle className="text-5xl font-serif mb-2">
                {currentQ.question} = ?
              </CardTitle>
              <CardDescription>Choose the correct answer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {currentQ.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQ.answer;
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
                        h-20 text-2xl font-bold transition-all
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
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-3xl font-serif">
              Quiz Complete!
            </CardTitle>
            <CardDescription>
              You answered {correctAnswers} out of {TOTAL_QUESTIONS} correctly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Final Score
                </p>
                <p className="text-3xl font-bold text-accent">{finalScore}</p>
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
                <p className="text-3xl font-bold text-success">
                  {correctAnswers}/{TOTAL_QUESTIONS}
                </p>
              </div>
            </div>

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
