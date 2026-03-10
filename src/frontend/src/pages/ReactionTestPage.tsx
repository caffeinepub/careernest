import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, RotateCcw, Timer, Trophy, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { getHighScore, saveGameScore } from "../utils/localStorage";

type GameState = "ready" | "waiting" | "click" | "early" | "complete";

const TOTAL_ROUNDS = 5;

export default function ReactionTestPage() {
  const { identity } = useInternetIdentity();
  const userId = identity?.getPrincipal().toString() || "";
  const highScore = getHighScore(userId, "Reaction Test");

  const [gameState, setGameState] = useState<GameState>("ready");
  const [currentRound, setCurrentRound] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentReactionTime, setCurrentReactionTime] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initializeGame = useCallback(() => {
    setGameState("ready");
    setCurrentRound(0);
    setReactionTimes([]);
    setCurrentReactionTime(0);
    setFinalScore(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startRound = () => {
    setGameState("waiting");
    setCurrentReactionTime(0);

    // Random delay between 1-3 seconds
    const delay = 1000 + Math.random() * 2000;

    timeoutRef.current = setTimeout(() => {
      setGameState("click");
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === "waiting") {
      // Clicked too early
      setGameState("early");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      toast.error("Too early! Wait for green.");
    } else if (gameState === "click") {
      // Valid click
      const reactionTime = Date.now() - startTimeRef.current;
      setCurrentReactionTime(reactionTime);
      const newReactionTimes = [...reactionTimes, reactionTime];
      setReactionTimes(newReactionTimes);

      if (currentRound + 1 < TOTAL_ROUNDS) {
        setCurrentRound((prev) => prev + 1);
        toast.success(`${reactionTime}ms - Great!`, { duration: 1500 });
        setTimeout(() => {
          startRound();
        }, 1500);
      } else {
        // Game complete
        endGame(newReactionTimes);
      }
    }
  };

  const endGame = (times: number[]) => {
    setGameState("complete");

    const avgReactionTime =
      times.reduce((sum, time) => sum + time, 0) / times.length;
    // Score: max(1000 - avg_ms, 0)
    const score = Math.max(0, Math.round(1000 - avgReactionTime));
    setFinalScore(score);

    // Save score
    if (identity) {
      saveGameScore({
        userId,
        gameName: "Reaction Test",
        score,
        duration: times.reduce((sum, time) => sum + time, 0) / 1000,
        details: { avgReactionTime, reactionTimes: times },
      });

      if (score > highScore) {
        toast.success("🎉 New high score!");
      }
    }
  };

  const handleTryAgain = () => {
    if (gameState === "early") {
      setGameState("ready");
    }
  };

  const avgReactionTime =
    reactionTimes.length > 0
      ? reactionTimes.reduce((sum, time) => sum + time, 0) /
        reactionTimes.length
      : 0;

  const getStateColor = () => {
    switch (gameState) {
      case "ready":
        return "bg-muted";
      case "waiting":
        return "bg-destructive/20";
      case "click":
        return "bg-success/20";
      case "early":
        return "bg-destructive/20";
      default:
        return "bg-muted";
    }
  };

  const getStateMessage = () => {
    switch (gameState) {
      case "ready":
        return 'Click "Start Round" to begin';
      case "waiting":
        return "Wait for green...";
      case "click":
        return "Click now!";
      case "early":
        return "Too early! Try again";
      default:
        return "";
    }
  };

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
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold">Reaction Test</h1>
              <p className="text-muted-foreground">Click as fast as you can!</p>
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

      {gameState !== "complete" ? (
        <div className="space-y-6">
          {/* Progress */}
          {gameState !== "ready" && (
            <Card className="border-primary/20">
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Round {currentRound + 1} of {TOTAL_ROUNDS}
                  </span>
                  {avgReactionTime > 0 && (
                    <span className="text-sm text-muted-foreground">
                      Avg: {avgReactionTime.toFixed(0)}ms
                    </span>
                  )}
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all duration-300"
                    style={{ width: `${(currentRound / TOTAL_ROUNDS) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Game Area */}
          <Card className="shadow-soft">
            <CardContent className="p-8">
              <button
                type="button"
                onClick={
                  gameState === "waiting" || gameState === "click"
                    ? handleClick
                    : undefined
                }
                disabled={gameState === "ready" || gameState === "early"}
                className={`
                  w-full aspect-square rounded-2xl transition-all duration-200
                  ${getStateColor()}
                  ${gameState === "waiting" || gameState === "click" ? "cursor-pointer hover:scale-105" : "cursor-default"}
                  flex flex-col items-center justify-center gap-4
                  border-4
                  ${gameState === "click" ? "border-success animate-pulse" : "border-border"}
                  max-w-md mx-auto
                `}
              >
                <div className="text-center">
                  {gameState === "click" && (
                    <Zap className="h-16 w-16 text-success mx-auto mb-4 animate-bounce" />
                  )}
                  {gameState === "waiting" && (
                    <Timer className="h-16 w-16 text-destructive mx-auto mb-4" />
                  )}
                  <p
                    className={`
                    text-2xl font-bold
                    ${gameState === "click" ? "text-success" : ""}
                    ${gameState === "waiting" ? "text-destructive" : ""}
                  `}
                  >
                    {getStateMessage()}
                  </p>
                  {currentReactionTime > 0 && gameState === "click" && (
                    <p className="text-4xl font-bold text-success mt-4">
                      {currentReactionTime}ms
                    </p>
                  )}
                </div>
              </button>

              <div className="mt-6 text-center">
                {gameState === "ready" && (
                  <Button onClick={startRound} size="lg" className="gap-2">
                    <Zap className="h-5 w-5" />
                    Start Round {currentRound + 1}
                  </Button>
                )}
                {gameState === "early" && (
                  <Button
                    onClick={handleTryAgain}
                    variant="destructive"
                    size="lg"
                    className="gap-2"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Try Again
                  </Button>
                )}
              </div>

              {/* Instructions */}
              {gameState === "ready" && (
                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2 text-center">
                    How to Play
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1 max-w-md mx-auto">
                    <li>• Click "Start Round" when ready</li>
                    <li>• Wait for the red area to turn green</li>
                    <li>• Click as fast as you can when it turns green</li>
                    <li>
                      • Complete 5 rounds to see your average reaction time
                    </li>
                    <li>• Don't click too early or you'll have to retry!</li>
                  </ul>
                </div>
              )}

              {/* Reaction Times */}
              {reactionTimes.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-center mb-3">
                    Your Times
                  </h3>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {reactionTimes.map((time, index) => (
                      <Badge
                        key={`rt-${index + 1}`}
                        variant="outline"
                        className="text-sm"
                      >
                        Round {index + 1}: {time}ms
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Results Screen */
        <Card className="shadow-soft border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-secondary" />
            </div>
            <CardTitle className="text-3xl font-serif">
              Test Complete!
            </CardTitle>
            <CardDescription>
              {avgReactionTime < 200
                ? "Lightning fast reflexes!"
                : avgReactionTime < 300
                  ? "Great reaction time!"
                  : avgReactionTime < 400
                    ? "Good reflexes!"
                    : "Keep practicing!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg col-span-2">
                <p className="text-sm text-muted-foreground mb-1">
                  Average Reaction Time
                </p>
                <p className="text-5xl font-bold text-secondary">
                  {avgReactionTime.toFixed(0)}ms
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Score</p>
                <p className="text-3xl font-bold text-primary">{finalScore}</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Best Time</p>
                <p className="text-3xl font-bold text-success">
                  {Math.min(...reactionTimes)}ms
                </p>
              </div>
            </div>

            {/* All reaction times */}
            <div>
              <h3 className="text-sm font-semibold text-center mb-3">
                All Rounds
              </h3>
              <div className="space-y-2">
                {reactionTimes.map((time, index) => (
                  <div
                    key={`round-${index + 1}`}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="text-sm">Round {index + 1}</span>
                    <Badge
                      variant={
                        time === Math.min(...reactionTimes)
                          ? "default"
                          : "outline"
                      }
                    >
                      {time}ms
                    </Badge>
                  </div>
                ))}
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
