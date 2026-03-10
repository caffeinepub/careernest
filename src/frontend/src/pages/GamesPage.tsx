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
  BookText,
  Brain,
  Calculator,
  Clock,
  Gamepad2,
  Trophy,
  Zap,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { getGameStats } from "../utils/localStorage";

export default function GamesPage() {
  const { identity } = useInternetIdentity();
  const userId = identity?.getPrincipal().toString() || "";
  const stats = getGameStats(userId);

  const games = [
    {
      id: "memory",
      name: "Memory Match",
      description: "Test your memory with card matching",
      icon: Brain,
      color: "text-primary",
      bgColor: "bg-primary/10",
      path: "/games/memory",
      highScore: stats.highScores["Memory Match"] || 0,
    },
    {
      id: "math",
      name: "Math Puzzle",
      description: "Solve quick math challenges",
      icon: Calculator,
      color: "text-accent",
      bgColor: "bg-accent/10",
      path: "/games/math",
      highScore: stats.highScores["Math Puzzle"] || 0,
    },
    {
      id: "reaction",
      name: "Reaction Test",
      description: "How fast are your reflexes?",
      icon: Zap,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      path: "/games/reaction",
      highScore: stats.highScores["Reaction Test"] || 0,
    },
    {
      id: "word",
      name: "Word Quiz",
      description: "Test your vocabulary",
      icon: BookText,
      color: "text-success",
      bgColor: "bg-success/10",
      path: "/games/word",
      highScore: stats.highScores["Word Quiz"] || 0,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl mb-6">
          <Gamepad2 className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-serif font-bold mb-4">Take a Break</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Feeling stressed or need a quick mental refresh? Play these fun,
          educational mini-games designed to help you relax and recharge.
        </p>
      </div>

      {/* Stats Overview */}
      {stats.gamesPlayed > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-primary/20 shadow-soft">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Games Played</CardTitle>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {stats.gamesPlayed}
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 shadow-soft">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Time Spent</CardTitle>
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-secondary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">
                {Math.floor(stats.totalTimeSpent / 60)}m
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 shadow-soft">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Best Score</CardTitle>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {Math.max(...Object.values(stats.highScores), 0)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Games Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <Card
              key={game.id}
              className="border-primary/20 shadow-soft hover:shadow-glow transition-all group"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-12 h-12 ${game.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <Icon className={`h-6 w-6 ${game.color}`} />
                      </div>
                      <CardTitle className="text-2xl font-serif">
                        {game.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {game.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {game.highScore > 0 && (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">
                      Your High Score
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {game.highScore}
                    </span>
                  </div>
                )}
                <Link to={game.path}>
                  <Button className="w-full" size="lg">
                    <Gamepad2 className="mr-2 h-5 w-5" />
                    Play Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Educational Note */}
      <Card className="mt-12 border-success/20 bg-success/5">
        <CardContent className="py-6">
          <p className="text-center text-sm text-muted-foreground">
            <strong className="text-foreground">Remember:</strong> These games
            are designed to give your mind a quick break. Take 5-10 minutes to
            play, then return to your studies refreshed and focused!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
