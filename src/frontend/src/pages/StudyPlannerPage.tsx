import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Bell,
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Target,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface Goal {
  id: string;
  title: string;
  subject: string;
  targetDate: string;
  hours: number;
  isCompleted: boolean;
  createdAt: string;
}

const STORAGE_KEY = "careernest_study_goals";

export default function StudyPlannerPage() {
  const { t } = useLanguage();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    targetDate: "",
    hours: 1,
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setGoals(JSON.parse(saved));
  }, []);

  const saveGoals = (g: Goal[]) => {
    setGoals(g);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(g));
  };

  const addGoal = () => {
    if (!form.title || !form.subject || !form.targetDate) return;
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: form.title,
      subject: form.subject,
      targetDate: form.targetDate,
      hours: form.hours,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    saveGoals([...goals, newGoal]);
    setForm({ title: "", subject: "", targetDate: "", hours: 1 });
    setShowForm(false);
  };

  const toggleGoal = (id: string) => {
    saveGoals(
      goals.map((g) =>
        g.id === id ? { ...g, isCompleted: !g.isCompleted } : g,
      ),
    );
  };

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter((g) => g.id !== id));
  };

  const completed = goals.filter((g) => g.isCompleted).length;
  const progress = goals.length > 0 ? (completed / goals.length) * 100 : 0;

  const today = new Date().toISOString().split("T")[0];
  const todayGoals = goals.filter(
    (g) => g.targetDate === today && !g.isCompleted,
  );
  const upcoming = goals
    .filter((g) => g.targetDate > today && !g.isCompleted)
    .sort((a, b) => a.targetDate.localeCompare(b.targetDate));
  const overdueGoals = goals.filter(
    (g) => g.targetDate < today && !g.isCompleted,
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2 flex items-center gap-2">
          <Calendar className="h-8 w-8 text-primary" />
          {t.planner}
        </h1>
        <p className="text-muted-foreground">
          Set study goals, track progress, and stay organized
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-primary">{goals.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Total Goals</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-green-600">{completed}</div>
          <div className="text-xs text-muted-foreground mt-1">Completed</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-orange-500">
            {overdueGoals.length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Overdue</div>
        </Card>
      </div>

      {goals.length > 0 && (
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress
              value={progress}
              className="h-3"
              data-ocid="planner.progress.loading_state"
            />
          </CardContent>
        </Card>
      )}

      {/* Add Goal */}
      <Button
        className="mb-6"
        data-ocid="planner.add_goal.button"
        onClick={() => setShowForm(!showForm)}
      >
        <Plus className="h-4 w-4 mr-2" /> Add Study Goal
      </Button>

      {showForm && (
        <Card className="mb-6 border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg">New Study Goal</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Input
              placeholder="Goal title (e.g. Finish Chapter 3 Physics)"
              value={form.title}
              data-ocid="planner.title.input"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              placeholder="Subject"
              value={form.subject}
              data-ocid="planner.subject.input"
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                value={form.targetDate}
                data-ocid="planner.date.input"
                onChange={(e) =>
                  setForm({ ...form, targetDate: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Study hours"
                min={1}
                max={12}
                value={form.hours}
                data-ocid="planner.hours.input"
                onChange={(e) => setForm({ ...form, hours: +e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button
                data-ocid="planner.save_goal.button"
                onClick={addGoal}
                className="flex-1"
              >
                {t.save}
              </Button>
              <Button
                variant="outline"
                data-ocid="planner.cancel_goal.button"
                onClick={() => setShowForm(false)}
              >
                {t.cancel}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today */}
      {todayGoals.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" /> Today's Goals
          </h2>
          <GoalList
            goals={todayGoals}
            onToggle={toggleGoal}
            onDelete={deleteGoal}
            highlight
          />
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" /> Upcoming Goals
          </h2>
          <GoalList
            goals={upcoming}
            onToggle={toggleGoal}
            onDelete={deleteGoal}
          />
        </div>
      )}

      {/* Overdue */}
      {overdueGoals.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2 text-red-600">
            ⚠️ Overdue Goals
          </h2>
          <GoalList
            goals={overdueGoals}
            onToggle={toggleGoal}
            onDelete={deleteGoal}
            overdue
          />
        </div>
      )}

      {/* Completed */}
      {completed > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" /> Completed Goals
          </h2>
          <GoalList
            goals={goals.filter((g) => g.isCompleted)}
            onToggle={toggleGoal}
            onDelete={deleteGoal}
            completed
          />
        </div>
      )}

      {goals.length === 0 && (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="planner.goals.empty_state"
        >
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No goals yet</p>
          <p className="text-sm mt-1">
            Add your first study goal to get started!
          </p>
        </div>
      )}
    </div>
  );
}

function GoalList({
  goals,
  onToggle,
  onDelete,
  highlight,
  overdue,
  completed,
}: {
  goals: Goal[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  highlight?: boolean;
  overdue?: boolean;
  completed?: boolean;
}) {
  return (
    <div className="space-y-3">
      {goals.map((goal, idx) => (
        <div
          key={goal.id}
          data-ocid={`planner.goal.item.${idx + 1}`}
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
            completed
              ? "opacity-60 bg-muted/30"
              : overdue
                ? "border-red-200 bg-red-50/50"
                : highlight
                  ? "border-orange-200 bg-orange-50/50"
                  : "bg-card hover:shadow-sm"
          }`}
        >
          <button
            type="button"
            data-ocid={`planner.toggle_goal.button.${idx + 1}`}
            onClick={() => onToggle(goal.id)}
            className="shrink-0"
          >
            {goal.isCompleted ? (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            ) : (
              <Circle className="h-6 w-6 text-muted-foreground" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className={`font-medium ${completed ? "line-through" : ""}`}>
              {goal.title}
            </div>
            <div className="flex gap-2 mt-1 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {goal.subject}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {goal.targetDate}
              </span>
              <span className="text-xs text-muted-foreground">
                {goal.hours}h
              </span>
            </div>
          </div>
          <button
            type="button"
            data-ocid={`planner.delete_goal.button.${idx + 1}`}
            onClick={() => onDelete(goal.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
