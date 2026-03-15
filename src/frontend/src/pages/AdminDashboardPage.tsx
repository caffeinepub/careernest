import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Principal } from "@icp-sdk/core/principal";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Brain,
  CheckCircle,
  FileText,
  Loader2,
  Minus,
  Plus,
  Shield,
  Trash2,
  Upload,
  UserCheck,
  UserX,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddAdminNote,
  useApproveSharedNote,
  useBlockUser,
  useDeleteAdminNote,
  useDeleteSharedNote,
  useGetAllAdminNotes,
  useGetAllSharedNotes,
  useGetAllUsers,
  useGetBlockedUsers,
  useGetPendingSharedNotes,
  useIsCallerAdmin,
  useRejectSharedNote,
  useUnblockUser,
} from "../hooks/useQueries";
import { EDUCATION_LEVELS, MAHARASHTRA_BOARDS } from "../lib/maharashtra";

function TruncatedPrincipal({ p }: { p: Principal }) {
  const s = p.toString();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="font-mono text-xs cursor-help">
          {s.length > 16 ? `${s.slice(0, 16)}…` : s}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs break-all">{s}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ─────────────────────────────────────────────
// Content Management Tab
// ─────────────────────────────────────────────
function ContentManagementTab() {
  const { data: adminNotes, isLoading } = useGetAllAdminNotes();
  const addNote = useAddAdminNote();
  const deleteNote = useDeleteAdminNote();

  const [form, setForm] = useState({
    title: "",
    contentType: "",
    educationLevel: "",
    subject: "",
    content: "",
  });

  const contentTypeMap: Record<string, string> = {
    textbook: "Textbook",
    notes: "Study Notes",
    material: "Learning Material",
    paper: "Question Paper",
  };

  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.contentType ||
      !form.educationLevel ||
      !form.subject ||
      !form.content
    ) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await addNote.mutateAsync({
        title: form.title,
        educationLevel: form.educationLevel,
        board: "Maharashtra State Board",
        subject: form.subject,
        topic: form.contentType,
        content: form.content,
      });
      toast.success("Content uploaded successfully!");
      setForm({
        title: "",
        contentType: "",
        educationLevel: "",
        subject: "",
        content: "",
      });
    } catch {
      toast.error("Failed to upload content");
    }
  };

  const nonAssessmentNotes = (adminNotes || []).filter(
    (note: any) => note.topic !== "assessment",
  );

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Title *</Label>
              <Input
                placeholder="e.g. Physics Chapter 1"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                data-ocid="admin.content.input"
              />
            </div>
            <div>
              <Label>Content Type *</Label>
              <Select
                value={form.contentType}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, contentType: v }))
                }
              >
                <SelectTrigger data-ocid="admin.content.select">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="textbook">Textbook</SelectItem>
                  <SelectItem value="notes">Study Notes</SelectItem>
                  <SelectItem value="material">Learning Material</SelectItem>
                  <SelectItem value="paper">Question Paper</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Education Level *</Label>
              <Select
                value={form.educationLevel}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, educationLevel: v }))
                }
              >
                <SelectTrigger data-ocid="admin.content.level.select">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject *</Label>
              <Input
                placeholder="e.g. Mathematics"
                value={form.subject}
                onChange={(e) =>
                  setForm((p) => ({ ...p, subject: e.target.value }))
                }
                data-ocid="admin.content.subject.input"
              />
            </div>
          </div>
          <div>
            <Label>Content / Description *</Label>
            <Textarea
              placeholder="Paste or type the content here..."
              value={form.content}
              onChange={(e) =>
                setForm((p) => ({ ...p, content: e.target.value }))
              }
              rows={6}
              data-ocid="admin.content.textarea"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={addNote.isPending}
            data-ocid="admin.content.submit_button"
          >
            {addNote.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" /> Upload Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Content List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Uploaded Content ({nonAssessmentNotes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2" data-ocid="admin.content.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : nonAssessmentNotes.length === 0 ? (
            <div
              className="text-center py-10 text-muted-foreground"
              data-ocid="admin.content.empty_state"
            >
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>No content uploaded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="admin.content.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="w-20">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nonAssessmentNotes.map((note: any, idx: number) => (
                    <TableRow
                      key={String(note.id)}
                      data-ocid={`admin.content.row.${idx + 1}`}
                    >
                      <TableCell className="font-medium max-w-xs truncate">
                        {note.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {contentTypeMap[note.topic] || note.topic}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {note.educationLevel}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {note.subject}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          onClick={() => deleteNote.mutate(note.id)}
                          disabled={deleteNote.isPending}
                          data-ocid={`admin.content.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// Assessment Management Tab
// ─────────────────────────────────────────────
interface MCQQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
}

const emptyQuestion = (): MCQQuestion => ({
  question: "",
  options: ["", "", "", ""],
  correctIndex: 0,
});

function AssessmentManagementTab() {
  const { data: adminNotes, isLoading } = useGetAllAdminNotes();
  const addNote = useAddAdminNote();
  const deleteNote = useDeleteAdminNote();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [questions, setQuestions] = useState<MCQQuestion[]>([emptyQuestion()]);
  const [editingId, setEditingId] = useState<bigint | null>(null);

  const assessments = (adminNotes || []).filter(
    (note: any) => note.topic === "assessment",
  );

  const updateQuestion = (
    idx: number,
    field: keyof MCQQuestion,
    value: any,
  ) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const updateOption = (qIdx: number, optIdx: number, value: string) => {
    setQuestions((prev) => {
      const next = [...prev];
      const opts = [...next[qIdx].options] as [string, string, string, string];
      opts[optIdx] = value;
      next[qIdx] = { ...next[qIdx], options: opts };
      return next;
    });
  };

  const addQuestion = () => {
    if (questions.length < 15) setQuestions((p) => [...p, emptyQuestion()]);
  };

  const removeQuestion = (idx: number) => {
    if (questions.length > 1)
      setQuestions((p) => p.filter((_, i) => i !== idx));
  };

  const resetForm = () => {
    setTitle("");
    setSubject("");
    setEducationLevel("");
    setQuestions([emptyQuestion()]);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!title || !subject || !educationLevel) {
      toast.error("Please fill Title, Subject, and Education Level");
      return;
    }
    const incomplete = questions.some(
      (q) => !q.question.trim() || q.options.some((o) => !o.trim()),
    );
    if (incomplete) {
      toast.error("Please fill all question fields and options");
      return;
    }
    const payload = { title, subject, educationLevel, questions };
    try {
      if (editingId !== null) {
        await deleteNote.mutateAsync(editingId);
      }
      await addNote.mutateAsync({
        title,
        educationLevel,
        board: "Maharashtra State Board",
        subject,
        topic: "assessment",
        content: JSON.stringify(payload),
      });
      toast.success(editingId ? "Assessment updated!" : "Assessment saved!");
      resetForm();
    } catch {
      toast.error("Failed to save assessment");
    }
  };

  const handleEdit = (note: any) => {
    try {
      const parsed = JSON.parse(note.content);
      setTitle(parsed.title || note.title);
      setSubject(parsed.subject || note.subject);
      setEducationLevel(parsed.educationLevel || note.educationLevel);
      setQuestions(parsed.questions || [emptyQuestion()]);
      setEditingId(note.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Failed to load assessment for editing");
    }
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            {editingId ? "Edit Assessment" : "Create Assessment"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Assessment Title *</Label>
              <Input
                placeholder="e.g. Physics Chapter 1 Quiz"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-ocid="admin.assessment.input"
              />
            </div>
            <div>
              <Label>Subject *</Label>
              <Input
                placeholder="e.g. Physics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                data-ocid="admin.assessment.subject.input"
              />
            </div>
            <div>
              <Label>Education Level *</Label>
              <Select value={educationLevel} onValueChange={setEducationLevel}>
                <SelectTrigger data-ocid="admin.assessment.select">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                Questions ({questions.length}/15)
              </h3>
              <Button
                size="sm"
                variant="outline"
                onClick={addQuestion}
                disabled={questions.length >= 15}
                data-ocid="admin.assessment.secondary_button"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Question
              </Button>
            </div>

            {questions.map((q, qIdx) => (
              <Card
                // biome-ignore lint/suspicious/noArrayIndexKey: questions are positional form fields
                key={qIdx}
                className="border-border"
                data-ocid={`admin.assessment.item.${qIdx + 1}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-muted-foreground">
                      Question {qIdx + 1}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive"
                      onClick={() => removeQuestion(qIdx)}
                      disabled={questions.length === 1}
                      data-ocid={`admin.assessment.delete_button.${qIdx + 1}`}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Question Text *</Label>
                    <Input
                      placeholder="Enter your question"
                      value={q.question}
                      onChange={(e) =>
                        updateQuestion(qIdx, "question", e.target.value)
                      }
                      data-ocid={`admin.assessment.item.${qIdx + 1}.input`}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: MCQ options are positional
                      <div key={optIdx}>
                        <Label className="text-xs">
                          Option {String.fromCharCode(65 + optIdx)}
                          {q.correctIndex === optIdx && (
                            <span className="ml-2 text-green-600 font-semibold">
                              (Correct)
                            </span>
                          )}
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                            value={opt}
                            onChange={(e) =>
                              updateOption(qIdx, optIdx, e.target.value)
                            }
                            className="flex-1"
                          />
                          <Button
                            size="sm"
                            variant={
                              q.correctIndex === optIdx ? "default" : "outline"
                            }
                            className="shrink-0 px-3"
                            onClick={() =>
                              updateQuestion(qIdx, "correctIndex", optIdx)
                            }
                            title="Mark as correct"
                            data-ocid={`admin.assessment.item.${qIdx + 1}.toggle`}
                          >
                            {q.correctIndex === optIdx ? "✓" : "○"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Click ○ next to an option to mark it as the correct answer.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={addNote.isPending || deleteNote.isPending}
              data-ocid="admin.assessment.submit_button"
            >
              {addNote.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                </>
              ) : editingId ? (
                "Update Assessment"
              ) : (
                "Save Assessment"
              )}
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={resetForm}
                data-ocid="admin.assessment.cancel_button"
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Saved Assessments */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Assessments ({assessments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div
              className="space-y-2"
              data-ocid="admin.assessment.loading_state"
            >
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : assessments.length === 0 ? (
            <div
              className="text-center py-10 text-muted-foreground"
              data-ocid="admin.assessment.empty_state"
            >
              <Brain className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>No assessments created yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assessments.map((note: any, idx: number) => {
                let questionCount = 0;
                try {
                  questionCount =
                    JSON.parse(note.content).questions?.length || 0;
                } catch {}
                return (
                  <div
                    key={String(note.id)}
                    className="flex items-center justify-between gap-3 p-4 rounded-lg border border-border"
                    data-ocid={`admin.assessment.row.${idx + 1}`}
                  >
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {note.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {note.subject} · {note.educationLevel} · {questionCount}{" "}
                        questions
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(note)}
                        data-ocid={`admin.assessment.edit_button.${idx + 1}`}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => deleteNote.mutate(note.id)}
                        data-ocid={`admin.assessment.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// Student Notes Tab
// ─────────────────────────────────────────────
function StudentNotesTab() {
  const { data: pendingNotes, isLoading: pendingLoading } =
    useGetPendingSharedNotes();
  const { data: allNotes, isLoading: allLoading } = useGetAllSharedNotes();
  const approveNote = useApproveSharedNote();
  const rejectNote = useRejectSharedNote();
  const deleteNote = useDeleteSharedNote();

  const [subtab, setSubtab] = useState<"pending" | "all">("pending");

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <Button
          variant={subtab === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setSubtab("pending")}
          data-ocid="admin.notes.pending.tab"
        >
          Pending Approval{" "}
          {pendingNotes?.length ? `(${pendingNotes.length})` : ""}
        </Button>
        <Button
          variant={subtab === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSubtab("all")}
          data-ocid="admin.notes.all.tab"
        >
          All Student Notes
        </Button>
      </div>

      {subtab === "pending" && (
        <div>
          {pendingLoading ? (
            <div className="space-y-3" data-ocid="admin.notes.loading_state">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : !pendingNotes?.length ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="admin.notes.empty_state"
            >
              <CheckCircle className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>No notes pending approval</p>
            </div>
          ) : (
            <div className="space-y-3" data-ocid="admin.notes.list">
              {pendingNotes.map((note: any, idx: number) => (
                <Card
                  key={String(note.id)}
                  data-ocid={`admin.notes.item.${idx + 1}`}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {note.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {note.subject} · {note.educationLevel}
                        </p>
                        {note.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {note.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => approveNote.mutate(note.id)}
                          data-ocid={`admin.notes.confirm_button.${idx + 1}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectNote.mutate(note.id)}
                          data-ocid={`admin.notes.delete_button.${idx + 1}`}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {subtab === "all" && (
        <div>
          {allLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : !allNotes?.length ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>No student notes yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allNotes.map((note: any, idx: number) => (
                <Card
                  key={String(note.id)}
                  data-ocid={`admin.notes.row.${idx + 1}`}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm text-foreground truncate">
                            {note.title}
                          </p>
                          <Badge
                            variant={note.isApproved ? "default" : "secondary"}
                            className="text-xs shrink-0"
                          >
                            {note.isApproved ? "Approved" : "Pending"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {note.subject} · {note.educationLevel}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive shrink-0"
                        onClick={() => deleteNote.mutate(note.id)}
                        data-ocid={`admin.notes.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Users Tab
// ─────────────────────────────────────────────
function UsersTab() {
  const { data: allUsers, isLoading: usersLoading } = useGetAllUsers();
  const { data: blockedUsers } = useGetBlockedUsers();
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();
  const [userSearch, setUserSearch] = useState("");

  const blockedSet = new Set(
    (blockedUsers || []).map((p: Principal) => p.toString()),
  );

  const filteredUsers = (allUsers || []).filter(
    ([p, prof]: [Principal, any]) => {
      const q = userSearch.toLowerCase();
      return (
        !q ||
        p.toString().toLowerCase().includes(q) ||
        prof?.displayName?.toLowerCase()?.includes(q) ||
        prof?.email?.toLowerCase()?.includes(q)
      );
    },
  );

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Search by name, email or principal..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="max-w-md"
          data-ocid="admin.users.search_input"
        />
      </div>

      {usersLoading ? (
        <div className="space-y-2" data-ocid="admin.users.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="admin.users.empty_state"
        >
          <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto" data-ocid="admin.users.table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Principal</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Education</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(([p, prof]: [Principal, any], idx: number) => {
                const isBlocked = blockedSet.has(p.toString());
                return (
                  <TableRow
                    key={p.toString()}
                    data-ocid={`admin.users.row.${idx + 1}`}
                  >
                    <TableCell>
                      <TruncatedPrincipal p={p} />
                    </TableCell>
                    <TableCell className="text-sm">
                      {prof?.displayName || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {prof?.educationLevel || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={isBlocked ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isBlocked ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => unblockUser.mutate(p)}
                          data-ocid={`admin.users.confirm_button.${idx + 1}`}
                        >
                          <UserCheck className="h-3.5 w-3.5 mr-1" /> Unblock
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => blockUser.mutate(p)}
                          data-ocid={`admin.users.delete_button.${idx + 1}`}
                        >
                          <UserX className="h-3.5 w-3.5 mr-1" /> Block
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Admin Dashboard
// ─────────────────────────────────────────────
export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  if (!adminLoading && !isAdmin) {
    navigate({ to: "/" });
    return null;
  }

  if (adminLoading) {
    return (
      <div
        className="container mx-auto px-4 py-8 space-y-6"
        data-ocid="admin.loading_state"
      >
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2 flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage content, assessments, and students.
        </p>
      </div>

      <Tabs defaultValue="content">
        <TabsList
          className="flex flex-wrap h-auto gap-1 mb-8"
          data-ocid="admin.tab"
        >
          <TabsTrigger value="content" data-ocid="admin.content.tab">
            <BookOpen className="h-4 w-4 mr-1.5" /> Content
          </TabsTrigger>
          <TabsTrigger value="assessments" data-ocid="admin.assessment.tab">
            <Brain className="h-4 w-4 mr-1.5" /> Assessments
          </TabsTrigger>
          <TabsTrigger value="student-notes" data-ocid="admin.notes.tab">
            <Upload className="h-4 w-4 mr-1.5" /> Student Notes
          </TabsTrigger>
          <TabsTrigger value="users" data-ocid="admin.users.tab">
            <Users className="h-4 w-4 mr-1.5" /> Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <ContentManagementTab />
        </TabsContent>

        <TabsContent value="assessments">
          <AssessmentManagementTab />
        </TabsContent>

        <TabsContent value="student-notes">
          <StudentNotesTab />
        </TabsContent>

        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
