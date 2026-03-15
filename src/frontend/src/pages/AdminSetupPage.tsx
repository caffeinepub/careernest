import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2, LogIn, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAssignAdminRole } from "../hooks/useQueries";

export default function AdminSetupPage() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const assignAdminRole = useAssignAdminRole();
  const { identity, login, isLoggingIn, isInitializing } =
    useInternetIdentity();

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  const handleGrantAdminAccess = async () => {
    try {
      await assignAdminRole.mutateAsync();
      setIsSuccess(true);
      toast.success("Admin access granted successfully!");
      setTimeout(() => {
        navigate({ to: "/admin" });
      }, 1000);
    } catch (error) {
      console.error("Failed to grant admin access:", error);
      toast.error("Failed to grant admin access. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="border-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Admin Access Setup
            </CardTitle>
            <CardDescription className="text-base">
              {!isLoggedIn
                ? "Please log in first, then grant yourself admin access"
                : "Grant yourself administrative privileges to manage CareerNest"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Admin Access Granted!</h3>
                <p className="text-muted-foreground">
                  Redirecting to admin dashboard...
                </p>
              </div>
            ) : !isLoggedIn ? (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
                  <p className="font-semibold mb-1">
                    Step 1 of 2: Login Required
                  </p>
                  <p>
                    Log in with Internet Identity first. Once logged in, click
                    the button below to become admin.
                  </p>
                </div>
                <Button
                  onClick={login}
                  disabled={isLoggingIn || isInitializing}
                  className="w-full h-12 text-lg font-semibold"
                  size="lg"
                  data-ocid="admin_setup.login_button"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Log In with Internet Identity
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm">
                  You are logged in. Click below to grant yourself admin access.
                </div>
                <div className="space-y-3 text-muted-foreground text-sm">
                  <p>As admin you can:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Upload textbooks, notes, and question papers</li>
                    <li>• Create and manage MCQ quizzes</li>
                    <li>• Approve student-uploaded notes</li>
                    <li>• Manage all users</li>
                  </ul>
                </div>
                <Button
                  onClick={handleGrantAdminAccess}
                  disabled={assignAdminRole.isPending}
                  className="w-full h-12 text-lg font-semibold"
                  size="lg"
                  data-ocid="admin_setup.grant_button"
                >
                  {assignAdminRole.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Granting Access...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      Grant Me Admin Access
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
