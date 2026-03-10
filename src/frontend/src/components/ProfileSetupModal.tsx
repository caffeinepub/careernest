import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AcademicLevel, UserProfile } from "../backend";
import { useSaveCallerUserProfile } from "../hooks/useQueries";
import {
  BRANCH_OPTIONS,
  CLASS_OPTIONS,
  STREAM_OPTIONS,
  encodeClassProfile,
  requiresBranch,
  requiresStream,
} from "../utils/profileClassUtils";

export default function ProfileSetupModal() {
  const [name, setName] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [stream, setStream] = useState("");
  const [branch, setBranch] = useState("");
  const [interests, setInterests] = useState("");
  const [goals, setGoals] = useState("");

  const saveProfile = useSaveCallerUserProfile();

  const handleClassChange = (value: string) => {
    setClassLevel(value);
    // Reset conditional fields when class changes
    setStream("");
    setBranch("");
  };

  const getAcademicLevel = (): AcademicLevel => {
    if (["10th", "11th", "12th"].includes(classLevel)) {
      return "highSchool" as AcademicLevel;
    }
    return "undergraduate" as AcademicLevel;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!classLevel) {
      toast.error("Please select your class");
      return;
    }
    if (requiresStream(classLevel) && !stream) {
      toast.error("Please select your stream");
      return;
    }
    if (requiresBranch(classLevel) && !branch) {
      toast.error("Please select your branch");
      return;
    }

    const classEntries = encodeClassProfile(classLevel, stream, branch);
    const regularInterests = interests
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    const profile: UserProfile = {
      name: name.trim(),
      academicLevel: getAcademicLevel(),
      interests: [...classEntries, ...regularInterests],
      goals: goals.trim(),
    };

    try {
      await saveProfile.mutateAsync(profile);
      toast.success("Profile created successfully!");
    } catch (error) {
      console.error("Profile creation error:", error);
      toast.error("Failed to create profile. Please try again.");
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent
        data-ocid="profile.setup.modal"
        className="sm:max-w-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            Welcome to CareerNest!
          </DialogTitle>
          <DialogDescription>
            Tell us about yourself to personalize your learning experience.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              data-ocid="profile.name.input"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              autoFocus
            />
          </div>

          {/* Class Selection */}
          <div className="space-y-2">
            <Label htmlFor="classLevel">Your Class / Education Level *</Label>
            <Select value={classLevel} onValueChange={handleClassChange}>
              <SelectTrigger data-ocid="profile.class.select" id="classLevel">
                <SelectValue placeholder="Select your class" />
              </SelectTrigger>
              <SelectContent>
                {CLASS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stream (conditional: 11th / 12th) */}
          {classLevel && requiresStream(classLevel) && (
            <div className="space-y-2">
              <Label htmlFor="stream">Stream *</Label>
              <Select value={stream} onValueChange={setStream}>
                <SelectTrigger data-ocid="profile.stream.select" id="stream">
                  <SelectValue placeholder="Select your stream" />
                </SelectTrigger>
                <SelectContent>
                  {STREAM_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Branch (conditional: Engineering / Diploma) */}
          {classLevel && requiresBranch(classLevel) && (
            <div className="space-y-2">
              <Label htmlFor="branch">Branch *</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger data-ocid="profile.branch.select" id="branch">
                  <SelectValue placeholder="Select your branch" />
                </SelectTrigger>
                <SelectContent>
                  {BRANCH_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Other Interests */}
          <div className="space-y-2">
            <Label htmlFor="interests">Other Interests (optional)</Label>
            <Input
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., Technology, Art, Science (comma-separated)"
            />
          </div>

          {/* Goals */}
          <div className="space-y-2">
            <Label htmlFor="goals">Your Goals</Label>
            <Textarea
              data-ocid="profile.goals.textarea"
              id="goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="What do you hope to achieve with CareerNest?"
              rows={3}
            />
          </div>

          <Button
            data-ocid="profile.setup.submit_button"
            type="submit"
            className="w-full"
            disabled={saveProfile.isPending}
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Profile...
              </>
            ) : (
              "Complete Setup"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
