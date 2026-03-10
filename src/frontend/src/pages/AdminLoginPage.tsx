import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ADMIN_SECRET = "CAREERNEST2024ADMIN";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (code === ADMIN_SECRET) {
        toast.success("Access granted! Redirecting to admin setup...");
        navigate({ to: "/admin-setup" });
      } else {
        toast.error("Invalid access code. Please try again.");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-organic-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">Admin Access</CardTitle>
          <CardDescription>
            Enter the administrator access code to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-code">Access Code</Label>
              <Input
                id="admin-code"
                type="password"
                placeholder="Enter admin access code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                data-ocid="admin.input"
                autoComplete="off"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !code}
              data-ocid="admin.submit_button"
            >
              {isLoading ? "Verifying..." : "Verify Access"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
