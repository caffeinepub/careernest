import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginScreen() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-screen bg-organic-gradient flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center space-y-12">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="/assets/uploads/file_00000000afac7208abab2d62179b0676-1--2.png"
              alt="CareerNest Logo"
              className="w-64 h-auto object-contain"
              onError={(e) => {
                console.error("Logo failed to load");
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          {/* Login Button */}
          <div className="space-y-4">
            <Button
              size="lg"
              onClick={login}
              disabled={isLoggingIn}
              className="px-8 py-6 text-lg rounded-2xl shadow-glow hover:shadow-soft transition-all"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Get Started"
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
