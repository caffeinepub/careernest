import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardList,
  Compass,
  Gamepad2,
  Heart,
  Home,
  Leaf,
  LogOut,
  Moon,
  Shield,
  Sparkles,
  Sun,
  User,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";

export default function Navigation() {
  const location = useLocation();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const { data: isAdmin } = useIsCallerAdmin();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/ai-notes", label: "AI Notes", icon: Sparkles },
    { path: "/study-notes", label: "Study Notes", icon: BookOpen },
    { path: "/shared-notes", label: "Shared Notes", icon: Users },
    { path: "/games", label: "Games", icon: Gamepad2 },
    { path: "/explore", label: "Explore", icon: Compass },
    { path: "/assessment", label: "Assessment", icon: ClipboardList },
    { path: "/mood", label: "Mood", icon: Heart },
    { path: "/wellness", label: "Wellness", icon: Leaf },
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
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <span className="text-primary font-serif font-bold text-xl">
                CN
              </span>
            </div>
            <span className="font-serif text-xl font-semibold hidden sm:block">
              CareerNest
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                data-ocid={`nav.${label.toLowerCase().replace(/ /g, "_")}.link`}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{label}</span>
              </Link>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-2"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="ml-2"
              data-ocid="nav.logout.button"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
