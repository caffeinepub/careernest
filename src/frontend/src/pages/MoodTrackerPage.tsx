import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Heart,
  Loader2,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { MoodEntry } from "../backend";
import { useAddMoodEntry, useGetMoodHistory } from "../hooks/useQueries";

const moodEmojis = ["😢", "😟", "😐", "🙂", "😄"];
const stressEmojis = ["😌", "😊", "😐", "😰", "😫"];

export default function MoodTrackerPage() {
  const { data: moodHistory, isLoading } = useGetMoodHistory();
  const addMood = useAddMoodEntry();

  const [moodLevel, setMoodLevel] = useState<number[]>([3]);
  const [stressLevel, setStressLevel] = useState<number[]>([3]);
  const [notes, setNotes] = useState("");

  const sortedHistory = moodHistory
    ? [...moodHistory].sort((a, b) => Number(b.date - a.date))
    : [];

  const avgMood =
    moodHistory && moodHistory.length > 0
      ? moodHistory.reduce((sum, entry) => sum + Number(entry.moodLevel), 0) /
        moodHistory.length
      : 0;

  const avgStress =
    moodHistory && moodHistory.length > 0
      ? moodHistory.reduce((sum, entry) => sum + Number(entry.stressLevel), 0) /
        moodHistory.length
      : 0;

  const recentTrend =
    sortedHistory.length >= 2
      ? Number(sortedHistory[0].moodLevel) - Number(sortedHistory[1].moodLevel)
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const entry: MoodEntry = {
      moodLevel: BigInt(moodLevel[0]),
      stressLevel: BigInt(stressLevel[0]),
      notes: notes.trim(),
      date: BigInt(Date.now()),
    };

    try {
      await addMood.mutateAsync(entry);
      toast.success("Mood entry saved successfully!");
      setMoodLevel([3]);
      setStressLevel([3]);
      setNotes("");
    } catch (error) {
      console.error("Failed to save mood entry:", error);
      toast.error("Failed to save mood entry. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">Mood Tracker</h1>
        <p className="text-muted-foreground">
          Track your daily mood and stress levels
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Log Mood Form */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">
              Log Today's Mood
            </CardTitle>
            <CardDescription>How are you feeling right now?</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mood Level */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Mood Level</Label>
                  <div className="text-4xl">{moodEmojis[moodLevel[0] - 1]}</div>
                </div>
                <Slider
                  value={moodLevel}
                  onValueChange={setMoodLevel}
                  min={1}
                  max={5}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Very Low</span>
                  <span>Low</span>
                  <span>Neutral</span>
                  <span>Good</span>
                  <span>Great</span>
                </div>
              </div>

              <Separator />

              {/* Stress Level */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Stress Level</Label>
                  <div className="text-4xl">
                    {stressEmojis[stressLevel[0] - 1]}
                  </div>
                </div>
                <Slider
                  value={stressLevel}
                  onValueChange={setStressLevel}
                  min={1}
                  max={5}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Very Low</span>
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>High</span>
                  <span>Very High</span>
                </div>
              </div>

              <Separator />

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What's on your mind? How was your day?"
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={addMood.isPending}
              >
                {addMood.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    Save Entry
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="shadow-soft">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-secondary">
                  {avgMood > 0 ? avgMood.toFixed(1) : "--"}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Avg Mood
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-accent">
                  {avgStress > 0 ? avgStress.toFixed(1) : "--"}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Avg Stress
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="pt-6 text-center">
                <div className="flex items-center justify-center gap-1">
                  {recentTrend > 0 ? (
                    <TrendingUp className="h-6 w-6 text-success" />
                  ) : recentTrend < 0 ? (
                    <TrendingDown className="h-6 w-6 text-destructive" />
                  ) : (
                    <Minus className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Trend</div>
              </CardContent>
            </Card>
          </div>

          {/* History */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-xl font-serif flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : sortedHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">
                    No mood entries yet. Start tracking today!
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {sortedHistory.slice(0, 10).map((entry) => (
                    <div
                      key={entry.date.toString()}
                      className="p-3 bg-muted/50 rounded-lg space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {moodEmojis[Number(entry.moodLevel) - 1]}
                          </span>
                          <div>
                            <div className="text-sm font-medium">
                              Mood: {Number(entry.moodLevel)}/5
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Stress: {Number(entry.stressLevel)}/5
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(Number(entry.date)).toLocaleDateString()}
                        </div>
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-muted-foreground line-clamp-2 pl-11">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
