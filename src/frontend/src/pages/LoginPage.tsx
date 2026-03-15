import { Button } from "@/components/ui/button";
import { BookOpen, Brain, FileText, Gamepad2, Loader2 } from "lucide-react";
import { LanguageSwitcher, useLanguage } from "../contexts/LanguageContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const { t } = useLanguage();
  const isLoggingIn = loginStatus === "logging-in";

  const features = [
    {
      icon: BookOpen,
      label: "Study Notes & Textbooks",
      desc: "Maharashtra State Board textbooks and study notes for Class 10, 11, 12 and beyond",
    },
    {
      icon: Brain,
      label: "AI Study Assistant",
      desc: "Get explanations, generate notes and practice questions for Maharashtra syllabus",
    },
    {
      icon: FileText,
      label: "Quiz & Question Papers",
      desc: "Practice MCQ quizzes and previous years board exam papers",
    },
    {
      icon: Gamepad2,
      label: "Wellness & Games",
      desc: "Career guidance, stress relief games, and wellness resources for students",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center space-y-8">
          {/* Language Switcher */}
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>

          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="/assets/uploads/file_00000000afac7208abab2d62179b0676-1-1-1.png"
              alt="CareerNest Logo"
              className="w-56 h-auto object-contain drop-shadow-lg"
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = "none";
                const fallback = el.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div className="hidden w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl items-center justify-center">
              <span className="text-white font-serif font-bold text-4xl">
                CN
              </span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CareerNest
            </h1>
            <p className="text-muted-foreground text-base">{t.tagline}</p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-3 text-left">
            {features.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">{label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          {/* Login Button */}
          <div className="space-y-3">
            <Button
              size="lg"
              onClick={login}
              disabled={isLoggingIn}
              className="w-full px-8 py-6 text-lg rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all"
              data-ocid="login.primary_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                t.login
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Secure authentication powered by Internet Identity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
