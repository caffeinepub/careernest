import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  Book,
  BookOpen,
  Brain,
  Calendar,
  ClipboardCheck,
  Compass,
  FileText,
  Gamepad2,
  Heart,
  Sparkles,
  Trophy,
  Upload,
  UserCircle2,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";
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
    to: "/study-notes",
    icon: BookOpen,
    labelKey: "studyNotes",
    desc: "Browse verified notes for all Maharashtra classes",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    to: "/textbooks",
    icon: Book,
    labelKey: "textbooks",
    desc: "Digital textbooks for 10th and 12th standard",
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    to: "/ai-notes",
    icon: Sparkles,
    labelKey: "aiAssistant",
    desc: "AI-powered notes and study explanations",
    color: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  {
    to: "/shared-notes",
    icon: Upload,
    labelKey: "uploadNotes",
    desc: "Share notes with fellow Maharashtra students",
    color: "from-orange-500 to-orange-600",
    bg: "bg-orange-50",
    text: "text-orange-600",
  },
  {
    to: "/career-guidance",
    icon: Compass,
    labelKey: "career",
    desc: "Career paths and Maharashtra universities",
    color: "from-cyan-500 to-cyan-600",
    bg: "bg-cyan-50",
    text: "text-cyan-600",
  },
  {
    to: "/quiz",
    icon: ClipboardCheck,
    labelKey: "quiz",
    desc: "MCQ quizzes with instant scores and answers",
    color: "from-indigo-500 to-indigo-600",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
  },
  {
    to: "/question-papers",
    icon: FileText,
    labelKey: "papers",
    desc: "Previous board exam papers for practice",
    color: "from-red-500 to-red-600",
    bg: "bg-red-50",
    text: "text-red-600",
  },
  {
    to: "/study-planner",
    icon: Calendar,
    labelKey: "planner",
    desc: "Set goals and track your study schedule",
    color: "from-yellow-500 to-yellow-600",
    bg: "bg-yellow-50",
    text: "text-yellow-600",
  },
  {
    to: "/wellness",
    icon: Heart,
    labelKey: "wellness",
    desc: "Motivation tips and stress management",
    color: "from-pink-500 to-pink-600",
    bg: "bg-pink-50",
    text: "text-pink-600",
  },
  {
    to: "/games",
    icon: Gamepad2,
    labelKey: "games",
    desc: "Fun mini-games for stress relief",
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
] as const;

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } =
    useGetCallerUserProfile();
  const { t } = useLanguage();
  const userId = identity?.getPrincipal().toString() || "";
  const gameStats = getGameStats(userId);

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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white p-8 mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <img
            src="/assets/uploads/file_00000000afac7208abab2d62179b0676-1--2.png"
            alt="CareerNest"
            className="w-24 h-auto object-contain drop-shadow-lg"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div>
            <h1 className="text-3xl font-serif font-bold mb-1">
              {t.welcome}, {profile?.name || "Student"} 👋
            </h1>
            {hasClassProfile ? (
              <p className="text-blue-100 text-lg">
                {getSubtitle()} — Maharashtra State Board
              </p>
            ) : (
              <p className="text-blue-100">{t.tagline}</p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Setup CTA */}
      {!profileLoading && !hasClassProfile && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-4">
          <UserCircle2 className="h-8 w-8 text-amber-600 shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-amber-800">
              Complete your profile for personalized content
            </div>
            <div className="text-sm text-amber-600">
              Select your class and stream to see relevant notes and career
              guidance
            </div>
          </div>
          <Link to="/profile">
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white"
              data-ocid="home.complete_profile.button"
            >
              Set Up
            </Button>
          </Link>
        </div>
      )}

      {/* 10 Feature Cards Grid */}
      <section className="mb-10" data-ocid="home.features.section">
        <h2 className="text-2xl font-serif font-bold mb-5">Your Dashboard</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {FEATURE_CARDS.map((card) => {
            const Icon = card.icon;
            const label = t[card.labelKey as keyof typeof t] as string;
            return (
              <Link key={card.to} to={card.to}>
                <div
                  data-ocid={`home.${card.labelKey}.card`}
                  className="group flex flex-col gap-3 p-4 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all cursor-pointer"
                >
                  <div
                    className={`w-11 h-11 ${card.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`h-5 w-5 ${card.text}`} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm leading-tight">
                      {label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {card.desc}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="text-center p-4">
          <div className="text-3xl font-bold text-blue-600">10</div>
          <div className="text-xs text-muted-foreground mt-1">Features</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-3xl font-bold text-emerald-600">50+</div>
          <div className="text-xs text-muted-foreground mt-1">Study Notes</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-3xl font-bold text-purple-600">6</div>
          <div className="text-xs text-muted-foreground mt-1">Quiz Topics</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-3xl font-bold text-orange-600">
            <Trophy className="h-7 w-7 mx-auto" />
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {gameStats.gamesPlayed} games played
          </div>
        </Card>
      </div>

      {/* Personalized Learning Path */}
      {hasClassProfile && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100">
          <CardContent className="pt-6">
            <h2 className="text-xl font-serif font-bold mb-4">
              🎯 Your Learning Path — {getSubtitle()}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  to: "/ai-notes",
                  icon: Sparkles,
                  label: "AI Notes",
                  sub: "Generate instantly",
                  color: "text-purple-600",
                  bg: "bg-purple-100",
                },
                {
                  to: "/textbooks",
                  icon: Book,
                  label: "Textbooks",
                  sub: getClassLabel(decoded?.classLevel || ""),
                  color: "text-blue-600",
                  bg: "bg-blue-100",
                },
                {
                  to: "/career-guidance",
                  icon: Compass,
                  label: "Career Guidance",
                  sub: decoded?.stream
                    ? getStreamLabel(decoded.stream)
                    : "Explore",
                  color: "text-cyan-600",
                  bg: "bg-cyan-100",
                },
                {
                  to: "/quiz",
                  icon: Brain,
                  label: "Practice Quiz",
                  sub: "Test yourself",
                  color: "text-indigo-600",
                  bg: "bg-indigo-100",
                },
              ].map((item) => (
                <Link key={item.to} to={item.to}>
                  <div className="flex gap-3 p-3 rounded-xl bg-white/70 hover:bg-white border border-white hover:shadow-sm transition-all cursor-pointer">
                    <div
                      className={`w-9 h-9 ${item.bg} rounded-lg flex items-center justify-center shrink-0`}
                    >
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{item.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.sub}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
