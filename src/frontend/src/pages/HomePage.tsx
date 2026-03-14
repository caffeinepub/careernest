import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Briefcase,
  Calendar,
  ClipboardList,
  Compass,
  Gamepad2,
  Heart,
  Sparkles,
  StickyNote,
  Target,
  TrendingUp,
  Trophy,
  Upload,
  UserCircle2,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useGetMoodHistory,
  useGetUserAssessments,
} from "../hooks/useQueries";
import { getGameStats } from "../utils/localStorage";
import {
  decodeClassProfile,
  getBranchLabel,
  getClassLabel,
  getStreamLabel,
  requiresBranch,
  requiresStream,
} from "../utils/profileClassUtils";

const FEATURE_CARDS = [
  {
    to: "/ai-notes" as const,
    icon: Sparkles,
    title: "AI Notes Generator",
    description: "Generate Maharashtra syllabus-aligned study notes instantly",
    ocid: "home.features.ai_notes.card",
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/20 hover:border-primary/40",
  },
  {
    to: "/study-notes" as const,
    icon: BookOpen,
    title: "Notes Library",
    description: "Browse admin-verified notes for all classes and streams",
    ocid: "home.features.study_notes.card",
    colorClass: "text-secondary",
    bgClass: "bg-secondary/10",
    borderClass: "border-secondary/20 hover:border-secondary/40",
  },
  {
    to: "/explore" as const,
    icon: Compass,
    title: "Career Guidance",
    description:
      "Discover career paths for Maharashtra colleges & universities",
    ocid: "home.features.career_guidance.card",
    colorClass: "text-accent",
    bgClass: "bg-accent/10",
    borderClass: "border-accent/20 hover:border-accent/40",
  },
  {
    to: "/shared-notes" as const,
    icon: Upload,
    title: "Upload Notes",
    description: "Share your notes with fellow Maharashtra students",
    ocid: "home.features.upload_notes.card",
    colorClass: "text-warning",
    bgClass: "bg-warning/10",
    borderClass: "border-warning/20 hover:border-warning/40",
  },
  {
    to: "/games" as const,
    icon: Gamepad2,
    title: "Mini Games",
    description: "Quick stress-relief games to recharge between study sessions",
    ocid: "home.features.mini_games.card",
    colorClass: "text-success",
    bgClass: "bg-success/10",
    borderClass: "border-success/20 hover:border-success/40",
  },
];

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } =
    useGetCallerUserProfile();
  const { data: assessments, isLoading: assessmentsLoading } =
    useGetUserAssessments();
  const { data: moodHistory, isLoading: moodLoading } = useGetMoodHistory();

  const userId = identity?.getPrincipal().toString() || "";
  const gameStats = getGameStats(userId);

  const assessmentCount = assessments?.length || 0;
  const moodEntryCount = moodHistory?.length || 0;

  const recentMoodAvg =
    moodHistory && moodHistory.length > 0
      ? moodHistory
          .slice(0, 7)
          .reduce((sum, entry) => sum + Number(entry.moodLevel), 0) /
        Math.min(7, moodHistory.length)
      : 0;

  const latestAssessment =
    assessments && assessments.length > 0 ? assessments[0] : null;

  const decoded = profile ? decodeClassProfile(profile.interests) : null;
  const hasClassProfile = decoded && decoded.classLevel !== "";

  const getSubtitle = () => {
    if (!decoded || !decoded.classLevel) return null;
    const parts: string[] = [getClassLabel(decoded.classLevel)];
    if (requiresStream(decoded.classLevel) && decoded.stream)
      parts.push(getStreamLabel(decoded.stream));
    if (requiresBranch(decoded.classLevel) && decoded.branch)
      parts.push(getBranchLabel(decoded.branch));
    return parts.join(" · ");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Section */}
      <div className="mb-10">
        <div className="flex justify-center mb-8">
          <img
            src="/assets/uploads/file_00000000afac7208abab2d62179b0676-1--2.png"
            alt="CareerNest Logo"
            className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            {profileLoading ? (
              <Skeleton className="h-12 w-64 mb-2" />
            ) : (
              <h1 className="text-5xl font-serif font-bold mb-2">
                Welcome back, {profile?.name || "Friend"}
              </h1>
            )}
            {!profileLoading && getSubtitle() ? (
              <p className="text-lg text-primary font-medium">
                {getSubtitle()}
              </p>
            ) : (
              <p className="text-lg text-muted-foreground">
                Your personalized career and wellness dashboard
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <section className="mb-12" data-ocid="home.features.section">
        <h2 className="text-2xl font-serif font-bold mb-5">Your Dashboard</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {FEATURE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.to} to={card.to}>
                <div
                  data-ocid={card.ocid}
                  className={`group flex flex-col gap-3 p-4 rounded-2xl bg-card border transition-all cursor-pointer hover:shadow-md ${card.borderClass}`}
                >
                  <div
                    className={`w-10 h-10 ${card.bgClass} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`h-5 w-5 ${card.colorClass}`} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm leading-tight">
                      {card.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {card.description}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <Card className="border-primary/20 shadow-soft">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Assessments</CardTitle>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {assessmentsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold text-primary">
                {assessmentCount}
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-1">Completed</p>
          </CardContent>
        </Card>

        <Card className="border-secondary/20 shadow-soft">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Mood Entries</CardTitle>
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-secondary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {moodLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold text-secondary">
                {moodEntryCount}
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Avg: {recentMoodAvg > 0 ? recentMoodAvg.toFixed(1) : "--"} / 5
            </p>
          </CardContent>
        </Card>

        <Card className="border-accent/20 shadow-soft">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Latest Match</CardTitle>
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {assessmentsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : latestAssessment ? (
              <>
                <div className="text-3xl font-bold text-accent">
                  {Number(latestAssessment.matchScore)}%
                </div>
                <p className="text-sm text-muted-foreground mt-1 truncate">
                  {latestAssessment.recommendedCareer}
                </p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                No assessments yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-success/20 shadow-soft">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Games Played</CardTitle>
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Trophy className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {gameStats.gamesPlayed}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {gameStats.gamesPlayed > 0
                ? `Best: ${Math.max(...Object.values(gameStats.highScores), 0)}`
                : "No games yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Personalized Learning Path */}
      {!profileLoading && (
        <section data-ocid="home.learning_path.section" className="mb-12">
          {hasClassProfile ? (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-accent/10 border border-primary/20 p-6 md:p-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />
              <div className="relative z-10">
                <div className="mb-6">
                  <h2 className="text-2xl font-serif font-bold mb-1">
                    Your Learning Path
                  </h2>
                  <p className="text-muted-foreground">
                    Personalized resources for{" "}
                    <span className="text-primary font-semibold">
                      {getSubtitle()}
                    </span>
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link to="/ai-notes">
                    <div className="group flex flex-col gap-3 p-4 rounded-xl bg-background/70 backdrop-blur-sm border border-primary/20 hover:border-primary/40 hover:bg-background/90 transition-all cursor-pointer">
                      <div className="w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">AI Notes</div>
                        <div className="text-xs text-muted-foreground">
                          Generate instantly
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link to="/study-notes">
                    <div className="group flex flex-col gap-3 p-4 rounded-xl bg-background/70 backdrop-blur-sm border border-primary/10 hover:border-primary/30 hover:bg-background/90 transition-all cursor-pointer">
                      <div className="w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Study Notes</div>
                        <div className="text-xs text-muted-foreground">
                          {decoded?.classLevel
                            ? getClassLabel(decoded.classLevel)
                            : "Your class"}
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link to="/career-guidance">
                    <div className="group flex flex-col gap-3 p-4 rounded-xl bg-background/70 backdrop-blur-sm border border-accent/10 hover:border-accent/30 hover:bg-background/90 transition-all cursor-pointer">
                      <div className="w-10 h-10 bg-accent/15 rounded-lg flex items-center justify-center group-hover:bg-accent/25 transition-colors">
                        <Briefcase className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          Career Guidance
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {decoded?.stream
                            ? getStreamLabel(decoded.stream)
                            : decoded?.branch
                              ? getBranchLabel(decoded.branch)
                              : "Explore paths"}
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link to="/games">
                    <div className="group flex flex-col gap-3 p-4 rounded-xl bg-background/70 backdrop-blur-sm border border-success/10 hover:border-success/30 hover:bg-background/90 transition-all cursor-pointer">
                      <div className="w-10 h-10 bg-success/15 rounded-lg flex items-center justify-center group-hover:bg-success/25 transition-colors">
                        <Gamepad2 className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          Take a Break
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Stress-relief games
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-muted/60 to-muted/30 border border-border p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                  <UserCircle2 className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-serif font-bold mb-1">
                    Complete Your Profile
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Tell us your class and stream to get personalized study
                    notes and career guidance tailored for Maharashtra students.
                  </p>
                </div>
                <Link to="/profile">
                  <Button
                    data-ocid="home.complete_profile.button"
                    className="shrink-0"
                  >
                    Set Up Profile
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Quick Actions */}
      <Card className="mb-12 shadow-soft">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Quick Actions</CardTitle>
          <CardDescription>Start exploring your career journey</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/ai-notes">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4 border-primary/40 bg-primary/5"
              size="lg"
              data-ocid="home.quick_ai_notes.button"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">AI Notes Generator</div>
                  <div className="text-xs text-muted-foreground">
                    Generate notes for any topic
                  </div>
                </div>
              </div>
            </Button>
          </Link>

          <Link to="/assessment">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              size="lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Take Assessment</div>
                  <div className="text-xs text-muted-foreground">
                    Discover your ideal career path
                  </div>
                </div>
              </div>
            </Button>
          </Link>

          <Link to="/shared-notes">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              size="lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                  <StickyNote className="h-6 w-6 text-secondary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Student Notes</div>
                  <div className="text-xs text-muted-foreground">
                    Notes shared by peers
                  </div>
                </div>
              </div>
            </Button>
          </Link>

          <Link to="/mood">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              size="lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Heart className="h-6 w-6 text-secondary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Log Mood</div>
                  <div className="text-xs text-muted-foreground">
                    Track your daily well-being
                  </div>
                </div>
              </div>
            </Button>
          </Link>

          <Link to="/explore">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              size="lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                  <Compass className="h-6 w-6 text-accent" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Explore Careers</div>
                  <div className="text-xs text-muted-foreground">
                    Browse all available paths
                  </div>
                </div>
              </div>
            </Button>
          </Link>

          <Link to="/games">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4 border-success/50 bg-success/5"
              size="lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center shrink-0">
                  <Gamepad2 className="h-6 w-6 text-success" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Take a Break</div>
                  <div className="text-xs text-muted-foreground">
                    Play quick games to relax
                  </div>
                </div>
              </div>
            </Button>
          </Link>

          <Link to="/wellness">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              size="lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Wellness Resources</div>
                  <div className="text-xs text-muted-foreground">
                    Stress management tips
                  </div>
                </div>
              </div>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-2xl font-serif flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assessmentsLoading || moodLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : assessmentCount === 0 && moodEntryCount === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                No activity yet. Start by taking an assessment or logging your
                mood!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {latestAssessment && (
                <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      Assessment completed
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {latestAssessment.recommendedCareer} —{" "}
                      {Number(latestAssessment.matchScore)}% match
                    </div>
                  </div>
                  <Link to="/results">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              )}
              {moodHistory && moodHistory.length > 0 && (
                <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Heart className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">Latest mood entry</div>
                    <div className="text-sm text-muted-foreground">
                      Mood: {Number(moodHistory[0].moodLevel)}/5 | Stress:{" "}
                      {Number(moodHistory[0].stressLevel)}/5
                    </div>
                  </div>
                  <Link to="/mood">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
