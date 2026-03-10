import { Button } from "@/components/ui/button";
import { BookOpen, Gamepad2, Loader2, Shield, Users } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  const features = [
    {
      icon: BookOpen,
      label: "AI Study Notes",
      desc: "Maharashtra syllabus-aligned notes for Class 1–12, Engineering, BSc, BCA & more",
    },
    {
      icon: Users,
      label: "Shared Notes",
      desc: "Upload & discover notes from students across Maharashtra",
    },
    {
      icon: Gamepad2,
      label: "Stress Relief Games",
      desc: "Fun mini-games to take a break and recharge",
    },
    {
      icon: Shield,
      label: "Career Guidance",
      desc: "Assessments and career path exploration",
    },
  ];

  return (
    <div className="min-h-screen bg-organic-gradient flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center space-y-10">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="/assets/uploads/file_00000000afac7208abab2d62179b0676-1-1-1.png"
              alt="CareerNest Logo"
              className="w-56 h-auto object-contain"
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = "none";
              }}
            />
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-4xl font-serif font-bold text-foreground">
              CareerNest
            </h1>
            <p className="text-muted-foreground text-lg">
              Maharashtra's smart academic & career platform for students
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-3 text-left">
            {features.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="bg-card/70 backdrop-blur-sm rounded-xl p-4 border border-border"
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
              className="w-full px-8 py-6 text-lg rounded-2xl shadow-glow hover:shadow-soft transition-all"
              data-ocid="login.primary_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Login / Sign Up"
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
