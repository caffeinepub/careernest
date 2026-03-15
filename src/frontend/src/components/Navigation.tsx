import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Book,
  BookOpen,
  Brain,
  Briefcase,
  Calendar,
  FileText,
  Gamepad2,
  Heart,
  Home,
  LogOut,
  Shield,
  Sparkles,
  Upload,
  User,
} from "lucide-react";
import { useState } from "react";
import { LanguageSwitcher } from "../contexts/LanguageContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";

export default function Navigation() {
  const location = useLocation();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin } = useIsCallerAdmin();
  const [logoSrcIndex, setLogoSrcIndex] = useState(0);
  const logoSrcs = [
    "/assets/uploads/file_00000000afac7208abab2d62179b0676-1-1-1.png",
    "/assets/uploads/file_00000000afac7208abab2d62179b0676-1--1.png",
    "/assets/uploads/file_00000000afac7208abab2d62179b0676-1--2.png",
    "/assets/generated/careernest-logo.dim_400x400-transparent.png",
  ];
  const handleLogoError = () => {
    if (logoSrcIndex + 1 < logoSrcs.length - 1) setLogoSrcIndex((i) => i + 1);
    else setLogoSrcIndex(logoSrcs.length - 1);
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/ai-notes", label: "AI Notes", icon: Sparkles },
    { path: "/study-notes", label: "Notes", icon: BookOpen },
    { path: "/textbooks", label: "Textbooks", icon: Book },
    { path: "/quiz", label: "Quiz", icon: Brain },
    { path: "/question-papers", label: "Papers", icon: FileText },
    { path: "/career-guidance", label: "Career", icon: Briefcase },
    { path: "/shared-notes", label: "Community", icon: Upload },
    { path: "/study-planner", label: "Planner", icon: Calendar },
    { path: "/wellness", label: "Wellness", icon: Heart },
    { path: "/games", label: "Games", icon: Gamepad2 },
    { path: "/profile", label: "Profile", icon: User },
  ];

  if (isAdmin) {
    navItems.push({ path: "/admin", label: "Admin", icon: Shield });
  }

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group shrink-0"
            data-ocid="nav.home.link"
          >
            <img
              src={logoSrcs[logoSrcIndex]}
              alt="CareerNest"
              className="h-10 w-auto object-contain"
              onError={handleLogoError}
            />
            <span className="font-serif text-xl font-semibold hidden sm:block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CareerNest
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-0.5 overflow-x-auto flex-1 mx-4 scrollbar-hide">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                data-ocid={`nav.${label.toLowerCase().replace(/ /g, "_")}.link`}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive(path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              data-ocid="nav.logout.button"
              className="text-muted-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
