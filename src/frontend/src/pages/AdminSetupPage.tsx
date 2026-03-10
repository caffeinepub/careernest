import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAssignAdminRole } from "../hooks/useQueries";

export default function AdminSetupPage() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const assignAdminRole = useAssignAdminRole();

  const handleGrantAdminAccess = async () => {
    try {
      await assignAdminRole.mutateAsync();
      setIsSuccess(true);
      toast.success("Admin access granted successfully!");

      // Navigate to admin dashboard after 1 second
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
        <Card className="border-primary/20 shadow-glow">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Admin Access Setup
            </CardTitle>
            <CardDescription className="text-base">
              Grant yourself administrative privileges to manage CareerNest
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isSuccess ? (
              <>
                <div className="space-y-4 text-muted-foreground">
                  <p>As an administrator, you will be able to:</p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>View all registered users and their profiles</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        Monitor platform statistics and user engagement
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Manage career assessments and mood entries</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Access advanced dashboard features</span>
                    </li>
                  </ul>
                  <p className="text-sm italic pt-4 border-t">
                    This action will grant your current Internet Identity admin
                    privileges on the platform.
                  </p>
                </div>

                <Button
                  onClick={handleGrantAdminAccess}
                  disabled={assignAdminRole.isPending}
                  className="w-full h-12 text-lg font-semibold"
                  size="lg"
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
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Admin Access Granted!
                  </h3>
                  <p className="text-muted-foreground">
                    Redirecting you to the admin dashboard...
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
