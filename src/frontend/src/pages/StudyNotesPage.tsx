import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Check,
  Copy,
  Download,
  Eye,
  FileText,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  useDeleteStudyNotes,
  useGenerateStudyNotes,
  useGetAllAdminNotes,
  useGetAllStudyNotes,
} from "../hooks/useQueries";
import { EDUCATION_LEVELS, MAHARASHTRA_BOARDS } from "../lib/maharashtra";

// ─────────────────────────────────────────────
// Notes Library Tab
// ─────────────────────────────────────────────
function NotesLibraryTab() {
  const { data: adminNotes, isLoading } = useGetAllAdminNotes();
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [selectedNote, setSelectedNote] = useState<any>(null);

  const libraryNotes = (adminNotes || []).filter(
    (note: any) => note.topic === "notes" || note.topic === "material",
  );

  const subjects = Array.from(
    new Set(libraryNotes.map((n: any) => n.subject).filter(Boolean)),
  ) as string[];

  const filtered = libraryNotes.filter((note: any) => {
    const levelOk =
      filterLevel === "all" || note.educationLevel === filterLevel;
    const subjectOk = filterSubject === "all" || note.subject === filterSubject;
    return levelOk && subjectOk;
  });

  const handleDownload = (note: any) => {
    const blob = new Blob([note.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={filterLevel} onValueChange={setFilterLevel}>
          <SelectTrigger className="w-44" data-ocid="notes.library.select">
            <SelectValue placeholder="Education Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {EDUCATION_LEVELS.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-44" data-ocid="notes.subject.select">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="notes.loading_state"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="notes.empty_state"
        >
          <BookOpen className="h-14 w-14 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No notes available yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Notes and learning materials will appear here once your teacher
            uploads them.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="notes.list"
        >
          {filtered.map((note: any, idx: number) => (
            <Card
              key={String(note.id)}
              className="hover:shadow-md transition-shadow"
              data-ocid={`notes.item.${idx + 1}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {note.topic === "material" ? "Material" : "Notes"}
                  </Badge>
                </div>
                <CardTitle className="text-sm mt-2 line-clamp-2">
                  {note.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  {note.subject} · {note.educationLevel}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => setSelectedNote(note)}
                    data-ocid={`notes.item.${idx + 1}.button`}
                  >
                    <Eye className="h-3 w-3 mr-1" /> Read
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(note)}
                    data-ocid={`notes.item.${idx + 1}.secondary_button`}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Read Modal */}
      <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
        <DialogContent
          className="max-w-2xl max-h-[80vh] overflow-y-auto"
          data-ocid="notes.dialog"
        >
          <DialogHeader>
            <DialogTitle>{selectedNote?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <div className="flex gap-2 mb-4">
              <Badge variant="secondary">{selectedNote?.educationLevel}</Badge>
              <Badge variant="outline">{selectedNote?.subject}</Badge>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
              {selectedNote?.content}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => selectedNote && handleDownload(selectedNote)}
              data-ocid="notes.dialog.secondary_button"
            >
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedNote(null)}
              data-ocid="notes.dialog.close_button"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─────────────────────────────────────────────
// AI Generator Tab (existing logic)
// ─────────────────────────────────────────────
function AIGeneratorTab() {
  const { data: studyNotes, isLoading } = useGetAllStudyNotes();
  const generateMutation = useGenerateStudyNotes();
  const deleteMutation = useDeleteStudyNotes();

  const [formData, setFormData] = useState({
    educationLevel: "",
    board: "",
    className: "",
    subject: "",
    chapter: "",
    difficultyLevel: "",
    content: "",
  });
  const [copiedNoteId, setCopiedNoteId] = useState<bigint | null>(null);
  const _printRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateMaharashtraContent = (
    educationLevel: string,
    board: string,
    className: string,
    subject: string,
    chapter: string,
    difficultyLevel: string,
    additionalInstructions: string,
  ): string => {
    const difficultyText = difficultyLevel || "Medium";
    let content = "STUDY NOTES - MAHARASHTRA EDUCATION\n\n";
    content += `${board}\n`;
    content += `${educationLevel} - ${className}\n`;
    content += `Subject: ${subject}\n`;
    content += `Chapter: ${chapter}\n`;
    content += `Difficulty: ${difficultyText}\n\n`;
    content += "═══════════════════════════════════\n\n";
    content += "INTRODUCTION\n\n";
    content += `${chapter} is an important topic in ${subject} for Maharashtra ${className} students. `;
    content += `These notes are prepared according to the ${board} syllabus.\n\n`;
    content += "KEY CONCEPTS\n\n";
    content += `1. Definition and Fundamentals of ${chapter}\n`;
    content += "   - Core principles and basic concepts\n";
    content += "   - Maharashtra board specific focus areas\n\n";
    content += "2. Important Theories and Rules\n";
    content += "   - Key formulas and equations\n";
    content += "   - Step-by-step problem solving approach\n\n";
    content += "3. Practical Applications\n";
    content += "   - Real-world examples relevant to Maharashtra context\n";
    content += "   - Solved examples from past board exams\n\n";
    content += "EXAM TIPS\n\n";
    content += `- Focus on ${chapter} concepts that appear frequently in ${board} exams\n`;
    content += "- Practice numerical problems with complete steps\n";
    content += "- Memorize key definitions and formulas\n\n";
    if (additionalInstructions) {
      content += `ADDITIONAL NOTES\n\n${additionalInstructions}\n\n`;
    }
    content += "SUMMARY\n\n";
    content += `These notes cover ${chapter} from ${subject} as per ${board} curriculum for ${className}. `;
    content +=
      "Review regularly and practice past exam questions for best results.\n";
    return content;
  };

  const handleGenerate = async () => {
    if (
      !formData.educationLevel ||
      !formData.board ||
      !formData.subject ||
      !formData.chapter
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    const aiContent = generateMaharashtraContent(
      formData.educationLevel,
      formData.board,
      formData.className,
      formData.subject,
      formData.chapter,
      formData.difficultyLevel,
      formData.content,
    );
    try {
      await generateMutation.mutateAsync({
        educationLevel: formData.educationLevel,
        board: formData.board,
        className: formData.className,
        subject: formData.subject,
        chapter: formData.chapter,
        content: aiContent,
      });
      toast.success("Notes generated!");
      setFormData({
        educationLevel: "",
        board: "",
        className: "",
        subject: "",
        chapter: "",
        difficultyLevel: "",
        content: "",
      });
    } catch {
      toast.error("Failed to generate notes");
    }
  };

  const handleCopy = async (note: any) => {
    await navigator.clipboard.writeText(note.content);
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 2000);
    toast.success("Copied!");
  };

  const handleDownloadNote = (note: any) => {
    const blob = new Blob([note.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.subject}-${note.chapter}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseNoteSections = (content: string) => {
    const sections: { title: string; content: string }[] = [];
    const lines = content.split("\n");
    let currentSection = "";
    let currentContent: string[] = [];
    const sectionHeaders = [
      "INTRODUCTION",
      "KEY CONCEPTS",
      "EXAM TIPS",
      "ADDITIONAL NOTES",
      "SUMMARY",
    ];
    for (const line of lines) {
      const isSectionHeader = sectionHeaders.some((h) => line.trim() === h);
      if (isSectionHeader) {
        if (currentSection && currentContent.length > 0) {
          sections.push({
            title: currentSection,
            content: currentContent.join("\n").trim(),
          });
        }
        currentSection = line.trim();
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    }
    if (currentSection && currentContent.length > 0) {
      sections.push({
        title: currentSection,
        content: currentContent.join("\n").trim(),
      });
    }
    return sections;
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate Study Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Education Level *</Label>
              <Select
                value={formData.educationLevel}
                onValueChange={(v) => handleInputChange("educationLevel", v)}
              >
                <SelectTrigger data-ocid="ai_notes.select">
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
              <Label>Board / University *</Label>
              <Select
                value={formData.board}
                onValueChange={(v) => handleInputChange("board", v)}
              >
                <SelectTrigger data-ocid="ai_notes.board.select">
                  <SelectValue placeholder="Select board" />
                </SelectTrigger>
                <SelectContent>
                  {MAHARASHTRA_BOARDS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject *</Label>
              <Input
                placeholder="e.g. Physics"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                data-ocid="ai_notes.input"
              />
            </div>
            <div>
              <Label>Chapter / Topic *</Label>
              <Input
                placeholder="e.g. Laws of Motion"
                value={formData.chapter}
                onChange={(e) => handleInputChange("chapter", e.target.value)}
                data-ocid="ai_notes.chapter.input"
              />
            </div>
            <div>
              <Label>Difficulty Level</Label>
              <Select
                value={formData.difficultyLevel}
                onValueChange={(v) => handleInputChange("difficultyLevel", v)}
              >
                <SelectTrigger data-ocid="ai_notes.difficulty.select">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Additional Instructions (optional)</Label>
            <Textarea
              placeholder="Any specific topics or focus areas..."
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              rows={3}
              data-ocid="ai_notes.textarea"
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            className="w-full"
            data-ocid="ai_notes.primary_button"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" /> Generate Notes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Notes */}
      {isLoading ? (
        <Skeleton className="h-64" data-ocid="ai_notes.loading_state" />
      ) : studyNotes && studyNotes.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Your Generated Notes
          </h3>
          {studyNotes.map((note: any) => {
            const sections = parseNoteSections(note.content);
            return (
              <Card key={String(note.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">
                        {note.subject} — {note.chapter}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {note.educationLevel} · {note.difficultyLevel}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleCopy(note)}
                        data-ocid="ai_notes.secondary_button"
                      >
                        {copiedNoteId === note.id ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleDownloadNote(note)}
                        data-ocid="ai_notes.download.button"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteMutation.mutate(note.id)}
                        data-ocid="ai_notes.delete_button"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {sections.map((section) => (
                      <AccordionItem key={section.title} value={section.title}>
                        <AccordionTrigger className="text-sm font-medium">
                          {section.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {section.content}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="ai_notes.empty_state"
        >
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No study notes yet</p>
          <p className="text-sm">
            Generate your first set of notes to get started
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function StudyNotesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2 flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Study Notes
        </h1>
        <p className="text-muted-foreground">
          Access teacher-uploaded notes or generate AI-powered study materials.
        </p>
      </div>

      <Tabs defaultValue="library">
        <TabsList className="mb-6" data-ocid="notes.tab">
          <TabsTrigger value="library" data-ocid="notes.library.tab">
            Notes Library
          </TabsTrigger>
          <TabsTrigger value="ai" data-ocid="notes.ai.tab">
            AI Generator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          <NotesLibraryTab />
        </TabsContent>

        <TabsContent value="ai">
          <AIGeneratorTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
