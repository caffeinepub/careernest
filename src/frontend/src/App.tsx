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
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";

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
import ReactionTestPage from "./pages/ReactionTestPage";
import SharedNotesPage from "./pages/SharedNotesPage";
// Pages
import SplashPage from "./pages/SplashPage";
import StudyNotesPage from "./pages/StudyNotesPage";
import WellnessPage from "./pages/WellnessPage";
import WordQuizPage from "./pages/WordQuizPage";

// Components
import Navigation from "./components/Navigation";
import ProfileSetupModal from "./components/ProfileSetupModal";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

// Root layout component
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

  // Unauthenticated: splash page at /, login screen everywhere else
  if (!isAuthenticated && !isLoggingIn) {
    if (location.pathname === "/") {
      return <SplashPage />;
    }
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-organic-gradient">
      <Navigation />
      <main className="pb-16">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()}. Built with &hearts; using{" "}
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

// Define routes
const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const assessmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/assessment",
  component: AssessmentPage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: CareerResultsPage,
});

const explorerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/explore",
  component: CareerExplorerPage,
});

const careerDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/career/$title",
  component: CareerDetailPage,
});

const moodRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mood",
  component: MoodTrackerPage,
});

const wellnessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wellness",
  component: WellnessPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboardPage,
});

const adminSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-setup",
  component: AdminSetupPage,
});

const studyNotesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/study-notes",
  component: StudyNotesPage,
});

const sharedNotesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shared-notes",
  component: SharedNotesPage,
});

const gamesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/games",
  component: GamesPage,
});

const memoryGameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/games/memory",
  component: MemoryGamePage,
});

const mathGameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/games/math",
  component: MathPuzzlePage,
});

const reactionGameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/games/reaction",
  component: ReactionTestPage,
});

const wordGameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/games/word",
  component: WordQuizPage,
});

const careerGuidanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/career-guidance",
  component: CareerGuidancePage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-login",
  component: AdminLoginPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  assessmentRoute,
  resultsRoute,
  explorerRoute,
  careerDetailRoute,
  moodRoute,
  wellnessRoute,
  profileRoute,
  adminRoute,
  adminSetupRoute,
  studyNotesRoute,
  sharedNotesRoute,
  gamesRoute,
  memoryGameRoute,
  mathGameRoute,
  reactionGameRoute,
  wordGameRoute,
  careerGuidanceRoute,
  adminLoginRoute,
]);

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
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
