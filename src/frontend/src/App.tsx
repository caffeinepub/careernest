import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useLocation,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";

import AINotesGeneratorPage from "./pages/AINotesGeneratorPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminSetupPage from "./pages/AdminSetupPage";
import AssessmentPage from "./pages/AssessmentPage";
import CareerDetailPage from "./pages/CareerDetailPage";
import CareerExplorerPage from "./pages/CareerExplorerPage";
import CareerGuidancePage from "./pages/CareerGuidancePage";
import CareerResultsPage from "./pages/CareerResultsPage";
import GamesPage from "./pages/GamesPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MathPuzzlePage from "./pages/MathPuzzlePage";
import MemoryGamePage from "./pages/MemoryGamePage";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import ProfilePage from "./pages/ProfilePage";
import QuestionPapersPage from "./pages/QuestionPapersPage";
import QuizPage from "./pages/QuizPage";
import ReactionTestPage from "./pages/ReactionTestPage";
import SharedNotesPage from "./pages/SharedNotesPage";
import SplashPage from "./pages/SplashPage";
import StudyNotesPage from "./pages/StudyNotesPage";
import StudyPlannerPage from "./pages/StudyPlannerPage";
import TextbooksPage from "./pages/TextbooksPage";
import WellnessPage from "./pages/WellnessPage";
import WordQuizPage from "./pages/WordQuizPage";

import Navigation from "./components/Navigation";
import ProfileSetupModal from "./components/ProfileSetupModal";

const ADMIN_SESSION_KEY = "careernest_admin_session";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function RootLayout() {
  const { identity, loginStatus } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const location = useLocation();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Admin pages are always accessible (use their own local session auth)
  const isAdminRoute =
    location.pathname === "/admin-login" ||
    location.pathname === "/admin" ||
    location.pathname === "/admin-setup";

  // Check if user has local admin session
  const hasLocalAdminSession =
    localStorage.getItem(ADMIN_SESSION_KEY) === "true";

  if (!isAuthenticated && !isLoggingIn && !isAdminRoute) {
    if (location.pathname === "/") {
      return <SplashPage />;
    }
    return <LoginPage />;
  }

  // For admin routes: show admin pages directly (no Navigation wrapper)
  if (isAdminRoute) {
    // Admin login page - always show
    if (location.pathname === "/admin-login") {
      return (
        <>
          <Outlet />
          <Toaster />
        </>
      );
    }
    // Admin dashboard / setup - show if local session exists
    if (hasLocalAdminSession) {
      return (
        <div className="min-h-screen bg-organic-gradient">
          <Outlet />
          <Toaster />
        </div>
      );
    }
    // No local session → redirect handled by AdminDashboardPage itself
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-organic-gradient">
      <Navigation />
      <main className="pb-16">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} CareerNest — Maharashtra Students
          Platform. Built with &hearts; using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
      {showProfileSetup && <ProfileSetupModal />}
      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const routes = [
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: HomePage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: LoginPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/assessment",
    component: AssessmentPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/results",
    component: CareerResultsPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/explore",
    component: CareerExplorerPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/career/$title",
    component: CareerDetailPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/mood",
    component: MoodTrackerPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/wellness",
    component: WellnessPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/profile",
    component: ProfilePage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/admin",
    component: AdminDashboardPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/admin-setup",
    component: AdminSetupPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/study-notes",
    component: StudyNotesPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/shared-notes",
    component: SharedNotesPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/games",
    component: GamesPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/games/memory",
    component: MemoryGamePage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/games/math",
    component: MathPuzzlePage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/games/reaction",
    component: ReactionTestPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/games/word",
    component: WordQuizPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/career-guidance",
    component: CareerGuidancePage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/admin-login",
    component: AdminLoginPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/ai-notes",
    component: AINotesGeneratorPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/textbooks",
    component: TextbooksPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/quiz",
    component: QuizPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/question-papers",
    component: QuestionPapersPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/study-planner",
    component: StudyPlannerPage,
  }),
];

const routeTree = rootRoute.addChildren(routes);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <RouterProvider router={router} />
        </LanguageProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
