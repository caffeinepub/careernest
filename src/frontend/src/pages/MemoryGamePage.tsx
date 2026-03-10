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
import {
  ArrowLeft,
  Brain,
  RotateCcw,
  Target,
  Timer,
  Trophy,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { getHighScore, saveGameScore } from "../utils/localStorage";

type CardItem = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const EMOJIS = ["🌟", "🎯", "🎨", "🎭", "🎪", "🎸", "🎮", "🎲"];
const GAME_TIME_LIMIT = 180; // 3 minutes in seconds

export default function MemoryGamePage() {
  const { identity } = useInternetIdentity();
  const userId = identity?.getPrincipal().toString() || "";
  const highScore = getHighScore(userId, "Memory Match");

  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const initializeGame = useCallback(() => {
    const shuffledEmojis = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffledEmojis);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameStarted(false);
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
            endGame(true);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (matchedPairs === EMOJIS.length && gameStarted) {
      endGame(false);
    }
  }, [matchedPairs, gameStarted]);

  const endGame = (timeUp: boolean) => {
    setGameOver(true);
    setGameStarted(false);

    if (timeUp) {
      toast.error("Time's up!");
      setFinalScore(0);
      return;
    }

    // Calculate score: matches * 100 - moves * 5 - time bonus
    const timeBonus = Math.max(0, (GAME_TIME_LIMIT - timeElapsed) * 2);
    const score = Math.max(0, matchedPairs * 100 - moves * 5 + timeBonus);
    setFinalScore(score);

    // Save score
    if (identity) {
      saveGameScore({
        userId,
        gameName: "Memory Match",
        score,
        duration: timeElapsed,
        details: { moves, matchedPairs },
      });

      if (score > highScore) {
        toast.success("🎉 New high score!");
      }
    }
  };

  const handleCardClick = (id: number) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    const card = cards.find((c) => c.id === id);
    if (
      !card ||
      card.isFlipped ||
      card.isMatched ||
      flippedCards.length === 2
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)),
    );

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard?.emoji === secondCard?.emoji) {
        // Match found!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c,
            ),
          );
          setMatchedPairs((prev) => prev + 1);
          setFlippedCards([]);
          toast.success("Match found!", { duration: 1000 });
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c,
            ),
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const timeRemaining = GAME_TIME_LIMIT - timeElapsed;
  const isTimeWarning = timeRemaining <= 30 && gameStarted && !gameOver;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
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
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold">Memory Match</h1>
              <p className="text-muted-foreground">Find all matching pairs</p>
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

      {/* Game Stats */}
      {gameStarted && !gameOver && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="border-primary/20">
            <CardContent className="py-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Timer
                  className={`h-4 w-4 ${isTimeWarning ? "text-destructive" : "text-muted-foreground"}`}
                />
                <span className="text-sm text-muted-foreground">Time Left</span>
              </div>
              <div
                className={`text-2xl font-bold ${isTimeWarning ? "text-destructive animate-pulse" : "text-primary"}`}
              >
                {formatTime(timeRemaining)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardContent className="py-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Moves</span>
              </div>
              <div className="text-2xl font-bold text-secondary">{moves}</div>
            </CardContent>
          </Card>

          <Card className="border-success/20">
            <CardContent className="py-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Pairs</span>
              </div>
              <div className="text-2xl font-bold text-success">
                {matchedPairs}/{EMOJIS.length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Game Board */}
      {!gameOver ? (
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto">
              {cards.map((card) => (
                <button
                  type="button"
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.isMatched || gameOver}
                  className={`
                    aspect-square rounded-xl text-4xl font-bold transition-all duration-300
                    ${
                      card.isFlipped || card.isMatched
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-muted hover:bg-muted/80 border-2 border-border hover:border-primary/50"
                    }
                    ${card.isMatched ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}
                    disabled:cursor-not-allowed
                    flex items-center justify-center
                  `}
                  style={{
                    transform:
                      card.isFlipped || card.isMatched
                        ? "rotateY(0deg)"
                        : "rotateY(0deg)",
                  }}
                >
                  {card.isFlipped || card.isMatched ? card.emoji : "?"}
                </button>
              ))}
            </div>

            {!gameStarted && (
              <div className="text-center mt-6">
                <p className="text-muted-foreground">Click any card to start</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Win Screen */
        <Card className="shadow-soft border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-serif">
              {matchedPairs === EMOJIS.length
                ? "Congratulations!"
                : "Time's Up!"}
            </CardTitle>
            <CardDescription>
              {matchedPairs === EMOJIS.length
                ? "You found all the pairs!"
                : "Better luck next time!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Final Score
                </p>
                <p className="text-3xl font-bold text-primary">{finalScore}</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Time</p>
                <p className="text-3xl font-bold text-secondary">
                  {formatTime(timeElapsed)}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Moves</p>
                <p className="text-3xl font-bold text-accent">{moves}</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Pairs</p>
                <p className="text-3xl font-bold text-success">
                  {matchedPairs}/{EMOJIS.length}
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
