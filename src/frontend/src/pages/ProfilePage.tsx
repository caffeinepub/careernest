import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Calendar,
  Edit,
  GraduationCap,
  Heart,
  Loader2,
  Save,
  Target,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AcademicLevel, UserProfile } from "../backend";
import {
  useGetCallerUserProfile,
  useGetUserAssessments,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";
import {
  BRANCH_OPTIONS,
  CLASS_OPTIONS,
  STREAM_OPTIONS,
  decodeClassProfile,
  encodeClassProfile,
  getBranchLabel,
  getClassLabel,
  getDisplayInterests,
  getStreamLabel,
  requiresBranch,
  requiresStream,
} from "../utils/profileClassUtils";

export default function ProfilePage() {
  const { data: profile, isLoading: profileLoading } =
    useGetCallerUserProfile();
  const { data: assessments } = useGetUserAssessments();
  const saveProfile = useSaveCallerUserProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [stream, setStream] = useState("");
  const [branch, setBranch] = useState("");
  const [interests, setInterests] = useState("");
  const [goals, setGoals] = useState("");

  const startEdit = () => {
    if (profile) {
      setName(profile.name);
      const decoded = decodeClassProfile(profile.interests);
      setClassLevel(decoded.classLevel);
      setStream(decoded.stream);
      setBranch(decoded.branch);
      setInterests(getDisplayInterests(profile.interests).join(", "));
      setGoals(profile.goals);
      setIsEditing(true);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleClassChange = (value: string) => {
    setClassLevel(value);
    setStream("");
    setBranch("");
  };

  const getAcademicLevel = (): AcademicLevel => {
    if (["10th", "11th", "12th"].includes(classLevel)) {
      return "highSchool" as AcademicLevel;
    }
    return "undergraduate" as AcademicLevel;
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    const classEntries = classLevel
      ? encodeClassProfile(classLevel, stream, branch)
      : [];
    const regularInterests = interests
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    const updatedProfile: UserProfile = {
      name: name.trim(),
      academicLevel: getAcademicLevel(),
      interests: [...classEntries, ...regularInterests],
      goals: goals.trim(),
    };

    try {
      await saveProfile.mutateAsync(updatedProfile);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const decoded = profile ? decodeClassProfile(profile.interests) : null;
  const displayInterests = profile
    ? getDisplayInterests(profile.interests)
    : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and academic details
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-serif">
                      Personal Information
                    </CardTitle>
                    <CardDescription>Your account details</CardDescription>
                  </div>
                </div>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={startEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {profileLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Name *</Label>
                    <Input
                      id="edit-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Class */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-class">Class / Education Level</Label>
                    <Select
                      value={classLevel}
                      onValueChange={handleClassChange}
                    >
                      <SelectTrigger
                        data-ocid="profile.class.select"
                        id="edit-class"
                      >
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

                  {/* Stream (11th/12th) */}
                  {classLevel && requiresStream(classLevel) && (
                    <div className="space-y-2">
                      <Label htmlFor="edit-stream">Stream</Label>
                      <Select value={stream} onValueChange={setStream}>
                        <SelectTrigger
                          data-ocid="profile.stream.select"
                          id="edit-stream"
                        >
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

                  {/* Branch (Engineering/Diploma) */}
                  {classLevel && requiresBranch(classLevel) && (
                    <div className="space-y-2">
                      <Label htmlFor="edit-branch">Branch</Label>
                      <Select value={branch} onValueChange={setBranch}>
                        <SelectTrigger
                          data-ocid="profile.branch.select"
                          id="edit-branch"
                        >
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

                  <div className="space-y-2">
                    <Label htmlFor="edit-interests">
                      Other Interests (comma-separated)
                    </Label>
                    <Input
                      id="edit-interests"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      placeholder="e.g., Technology, Art, Science"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-goals">Your Goals</Label>
                    <Textarea
                      id="edit-goals"
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      placeholder="What do you hope to achieve?"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      className="flex-1"
                      disabled={saveProfile.isPending}
                    >
                      {saveProfile.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={cancelEdit}
                      disabled={saveProfile.isPending}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground text-sm">
                      Name
                    </Label>
                    <p className="text-lg font-medium mt-1">{profile?.name}</p>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-muted-foreground text-sm flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Class / Education Level
                    </Label>
                    <p className="text-lg font-medium mt-1">
                      {decoded?.classLevel
                        ? getClassLabel(decoded.classLevel)
                        : "--"}
                    </p>
                  </div>

                  {decoded?.classLevel &&
                    requiresStream(decoded.classLevel) && (
                      <>
                        <Separator />
                        <div>
                          <Label className="text-muted-foreground text-sm flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Stream
                          </Label>
                          <p className="text-lg font-medium mt-1">
                            {decoded.stream
                              ? getStreamLabel(decoded.stream)
                              : "--"}
                          </p>
                        </div>
                      </>
                    )}

                  {decoded?.classLevel &&
                    requiresBranch(decoded.classLevel) && (
                      <>
                        <Separator />
                        <div>
                          <Label className="text-muted-foreground text-sm flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Branch
                          </Label>
                          <p className="text-lg font-medium mt-1">
                            {decoded.branch
                              ? getBranchLabel(decoded.branch)
                              : "--"}
                          </p>
                        </div>
                      </>
                    )}

                  <Separator />

                  <div>
                    <Label className="text-muted-foreground text-sm flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Interests
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {displayInterests.length > 0 ? (
                        displayInterests.map((interest) => (
                          <Badge key={interest} variant="secondary">
                            {interest}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No interests added
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-muted-foreground text-sm flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Goals
                    </Label>
                    <p className="mt-2 text-sm leading-relaxed">
                      {profile?.goals || "No goals set yet"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-serif">
                Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {assessments?.length || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Assessments
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {assessments && assessments.length > 0 && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg font-serif">
                  Latest Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">
                    {Number(assessments[0].matchScore)}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {assessments[0].recommendedCareer}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(
                      Number(assessments[0].timestamp) / 1000000,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
