import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import {
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Lightbulb,
  Save,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  useAddSharedNote,
  useDeleteStudyNotes,
  useGenerateStudyNotes,
  useGetAllStudyNotes,
  useGetCallerUserProfile,
} from "../hooks/useQueries";
import { decodeClassProfile, requiresStream } from "../utils/profileClassUtils";

// ─── types ────────────────────────────────────────────────────────────────────
interface GeneratedNote {
  topicTitle: string;
  explanation: string;
  keyPoints: string[];
  formulas: string[];
  summary: string;
  educationLevel: string;
  stream?: string;
  subject: string;
  topic: string;
  timestamp: number;
  savedTimestamp?: bigint;
}

// ─── education options ─────────────────────────────────────────────────────────
const EDUCATION_LEVELS = [
  { value: "10th", label: "10th Standard (SSC / CBSE)" },
  { value: "11th", label: "11th Standard" },
  { value: "12th", label: "12th Standard" },
  { value: "diploma", label: "Diploma / Polytechnic" },
  { value: "engineering", label: "Engineering" },
  { value: "bsc", label: "BSc" },
  { value: "bca", label: "BCA" },
  { value: "other", label: "Other Courses" },
];

const STREAMS = [
  { value: "science", label: "Science" },
  { value: "commerce", label: "Commerce" },
  { value: "arts", label: "Arts" },
];

// ─── subject map keyed by eduLevel[-stream] ────────────────────────────────────
const SUBJECT_MAP: Record<string, string[]> = {
  "10th": [
    "Mathematics",
    "Science",
    "English",
    "Hindi",
    "Marathi",
    "Social Science",
    "History & Civics",
    "Geography",
  ],
  "11th-science": [
    "Physics",
    "Chemistry",
    "Biology",
    "Mathematics",
    "English",
    "Information Technology",
  ],
  "11th-commerce": [
    "Economics",
    "Accounts",
    "Business Studies",
    "Mathematics & Statistics",
    "English",
    "Marathi",
  ],
  "11th-arts": [
    "History",
    "Geography",
    "Political Science",
    "Sociology",
    "Psychology",
    "English",
    "Marathi",
  ],
  "12th-science": [
    "Physics",
    "Chemistry",
    "Biology",
    "Mathematics",
    "English",
    "Information Technology",
  ],
  "12th-commerce": [
    "Economics",
    "Accounts",
    "Business Studies",
    "Mathematics & Statistics",
    "English",
    "Marathi",
  ],
  "12th-arts": [
    "History",
    "Geography",
    "Political Science",
    "Sociology",
    "Psychology",
    "English",
    "Marathi",
  ],
  diploma: [
    "Engineering Mathematics",
    "Applied Science",
    "Engineering Drawing",
    "Workshop Technology",
    "Computer Fundamentals",
    "Communication Skills",
  ],
  engineering: [
    "Engineering Mathematics",
    "Data Structures",
    "Algorithms",
    "Database Management",
    "Operating Systems",
    "Computer Networks",
    "Software Engineering",
    "Digital Electronics",
    "Thermodynamics",
    "Fluid Mechanics",
    "Strength of Materials",
  ],
  bsc: [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Statistics",
    "Botany",
    "Zoology",
  ],
  bca: [
    "Programming in C",
    "Data Structures",
    "Database Management",
    "Web Technology",
    "Computer Networks",
    "Software Engineering",
    "Mathematics",
    "Statistics",
  ],
  other: [
    "General Studies",
    "Communication Skills",
    "Environmental Science",
    "Mathematics",
  ],
};

/** Map profile class value → EDUCATION_LEVELS value */
function mapProfileClassToLevel(classLevel: string): string {
  const map: Record<string, string> = {
    "10th": "10th",
    "11th": "11th",
    "12th": "12th",
    Diploma: "diploma",
    Engineering: "engineering",
    BSc: "bsc",
    BCA: "bca",
    OtherUG: "other",
  };
  return map[classLevel] ?? "";
}

/** Map profile stream value → STREAMS value */
function mapProfileStreamToStream(stream: string): string {
  const map: Record<string, string> = {
    Science: "science",
    Commerce: "commerce",
    Arts: "arts",
  };
  return map[stream] ?? "";
}

function getSubjectKey(level: string, stream: string): string {
  if ((level === "11th" || level === "12th") && stream) {
    return `${level}-${stream}`;
  }
  return level;
}

// ─── content generator ───────────────────────────────────────────────────────
function generateNoteContent(
  educationLevel: string,
  stream: string,
  subject: string,
  topic: string,
): Omit<GeneratedNote, "timestamp" | "savedTimestamp"> {
  const levelLabel =
    EDUCATION_LEVELS.find((l) => l.value === educationLevel)?.label ??
    educationLevel;
  const streamLabel = stream
    ? ` (${STREAMS.find((s) => s.value === stream)?.label ?? stream})`
    : "";
  const isScienceOrMath =
    subject.toLowerCase().includes("math") ||
    subject.toLowerCase().includes("physics") ||
    subject.toLowerCase().includes("chemistry") ||
    subject.toLowerCase().includes("science") ||
    subject.toLowerCase().includes("biology") ||
    subject.toLowerCase().includes("statistics");

  const explanation = `${topic} is an important concept in ${subject} for ${levelLabel}${streamLabel} students under the Maharashtra State Board syllabus. 
This topic covers the fundamental principles and their real-world applications, helping students build a strong conceptual base required for board examinations and further studies. 
Understanding ${topic} will help you connect theory with practice, and solve problems confidently in exams.`;

  const keyPoints = [
    `${topic} is a core chapter in ${subject} at the ${levelLabel}${streamLabel} level.`,
    "Aligns with Maharashtra State Board / university syllabus objectives.",
    "Helps in building conceptual clarity required for board exams and competitive tests.",
    `Real-world applications of ${topic} are commonly asked in short-answer and long-answer questions.`,
    `Review previous board question papers to identify the most frequently tested sub-topics within ${topic}.`,
    "Practice at least 5–10 solved examples for thorough understanding.",
  ];

  const formulas = isScienceOrMath
    ? [
        `Core Formula: [Fundamental equation / law for ${topic}]`,
        "Derived Expression: [Secondary formula derived from the core law]",
        `Units: Identify SI units / CGS units applicable to ${topic}`,
        "Conditions: Note when each formula is valid (assumptions / limitations)",
      ]
    : [
        `Key Definition: Define ${topic} in your own words for 2-mark answers.`,
        "Important Terms: List and memorise key vocabulary from this chapter.",
      ];

  const summary = `${topic} in ${subject} is a high-weightage chapter for ${levelLabel}${streamLabel} students following the Maharashtra syllabus. 
Focus on: understanding the core definition, memorising formulas / key terms, practising solved examples, and revising past board questions. 
Consistent practice and concept clarity are the keys to scoring well in this topic.`;

  return {
    topicTitle: topic,
    explanation,
    keyPoints,
    formulas,
    summary,
    educationLevel,
    stream: stream || undefined,
    subject,
    topic,
  };
}

// ─── component ────────────────────────────────────────────────────────────────
export default function AINotesGeneratorPage() {
  const { data: profile } = useGetCallerUserProfile();
  const { data: savedNotes, isLoading: savedLoading } = useGetAllStudyNotes();
  const generateMutation = useGenerateStudyNotes();
  const deleteMutation = useDeleteStudyNotes();
  const addSharedNoteMutation = useAddSharedNote();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // form state
  const [educationLevel, setEducationLevel] = useState("");
  const [stream, setStream] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [profilePrefilled, setProfilePrefilled] = useState(false);

  // result state
  const [generatedNote, setGeneratedNote] = useState<GeneratedNote | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedToLibrary, setSavedToLibrary] = useState(false);

  // upload state
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadContent, setUploadContent] = useState("");
  const [uploadSubject, setUploadSubject] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // ── prepopulate from profile ──────────────────────────────────────────────
  useEffect(() => {
    if (profile && !profilePrefilled) {
      const decoded = decodeClassProfile(profile.interests);
      if (decoded.classLevel) {
        const lvl = mapProfileClassToLevel(decoded.classLevel);
        if (lvl) setEducationLevel(lvl);
        if (decoded.stream) {
          const s = mapProfileStreamToStream(decoded.stream);
          if (s) setStream(s);
        }
        setProfilePrefilled(true);
      }
    }
  }, [profile, profilePrefilled]);

  const needsStream = educationLevel === "11th" || educationLevel === "12th";

  // Compute available subjects
  const subjectKey = getSubjectKey(educationLevel, stream);
  const availableSubjects: string[] = SUBJECT_MAP[subjectKey] ?? [];

  // Reset subject when education level or stream changes
  const handleEducationLevelChange = (v: string) => {
    setEducationLevel(v);
    setSubject("");
    if (v !== "11th" && v !== "12th") setStream("");
  };

  const handleStreamChange = (v: string) => {
    setStream(v);
    setSubject("");
  };

  const canGenerate =
    !!educationLevel &&
    (!needsStream || !!stream) &&
    !!subject &&
    !!topic.trim();

  // ── generate ────────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!educationLevel) {
      toast.error("Please select an education level.");
      return;
    }
    if (needsStream && !stream) {
      toast.error("Please select your stream.");
      return;
    }
    if (!subject) {
      toast.error("Please select a subject.");
      return;
    }
    if (!topic.trim()) {
      toast.error("Please enter a topic / chapter name.");
      return;
    }

    setIsGenerating(true);
    setSavedToLibrary(false);

    await new Promise((r) => setTimeout(r, 800));

    const noteData = generateNoteContent(
      educationLevel,
      needsStream ? stream : "",
      subject,
      topic.trim(),
    );
    const note: GeneratedNote = { ...noteData, timestamp: Date.now() };
    setGeneratedNote(note);
    setIsGenerating(false);
    toast.success("Notes generated successfully!");
  };

  // ── copy ─────────────────────────────────────────────────────────────────────
  const handleCopy = async () => {
    if (!generatedNote) return;
    const text = [
      `TOPIC: ${generatedNote.topicTitle}`,
      "",
      "SHORT EXPLANATION:",
      generatedNote.explanation,
      "",
      "KEY POINTS:",
      ...generatedNote.keyPoints.map((p, i) => `${i + 1}. ${p}`),
      "",
      generatedNote.formulas.length > 0
        ? "IMPORTANT FORMULAS / DEFINITIONS:"
        : "",
      ...generatedNote.formulas,
      "",
      "SUMMARY:",
      generatedNote.summary,
      "",
      "Generated by CareerNest | Maharashtra Students Platform",
    ]
      .filter((l) => l !== undefined)
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Notes copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy. Please copy manually.");
    }
  };

  // ── download PDF ─────────────────────────────────────────────────────────────
  const handleDownloadPDF = () => {
    if (!generatedNote) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow pop-ups to download PDF.");
      return;
    }

    const logoUrl =
      "/assets/uploads/file_00000000afac7208abab2d62179b0676-1-1-1.png";
    const formulasHTML =
      generatedNote.formulas.length > 0
        ? `<h2>Important Formulas / Definitions</h2><ul>${generatedNote.formulas.map((f) => `<li>${f}</li>`).join("")}</ul>`
        : "";
    const streamLabel = generatedNote.stream
      ? ` &mdash; ${STREAMS.find((s) => s.value === generatedNote.stream)?.label ?? generatedNote.stream}`
      : "";
    const levelLabel =
      EDUCATION_LEVELS.find((l) => l.value === generatedNote.educationLevel)
        ?.label ?? generatedNote.educationLevel;

    printWindow.document.write(`
      <!DOCTYPE html><html><head><meta charset="utf-8">
      <title>${generatedNote.topicTitle}</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body { font-family: Georgia, serif; line-height: 1.7; color: #222; margin: 0; }
        .cover { page-break-after: always; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; text-align:center; }
        .cover img { max-width: 280px; height:auto; }
        h1 { font-size:22px; border-bottom:2px solid #333; padding-bottom:8px; margin-top:30px; }
        h2 { font-size:16px; color:#2c3e50; margin-top:24px; }
        ul { padding-left:20px; } li { margin-bottom:6px; }
        .meta { color:#555; font-size:13px; margin-bottom:20px; }
        .summary-box { background:#f5f5f5; border-left:4px solid #555; padding:12px 16px; border-radius:4px; }
        @media print { .no-print { display:none; } }
      </style></head><body>
      <div class="cover"><img src="${logoUrl}" alt="CareerNest Logo" onerror="this.style.display='none'" /></div>
      <h1>${generatedNote.topicTitle}</h1>
      <p class="meta">${levelLabel}${streamLabel} &bull; ${generatedNote.subject} &bull; Maharashtra Education</p>
      <h2>Short Explanation</h2><p>${generatedNote.explanation.replace(/\n/g, "<br/>")}</p>
      <h2>Key Points</h2><ul>${generatedNote.keyPoints.map((p) => `<li>${p}</li>`).join("")}</ul>
      ${formulasHTML}
      <h2>Summary</h2><div class="summary-box"><p>${generatedNote.summary.replace(/\n/g, "<br/>")}</p></div>
      <p style="margin-top:40px; font-size:12px; color:#888;">Generated by CareerNest &mdash; Maharashtra Students Platform</p>
      <script>window.onload=function(){setTimeout(function(){window.print();},400);}; window.onafterprint=function(){window.close();};<\/script>
      </body></html>`);
    printWindow.document.close();
  };

  // ── save to library ───────────────────────────────────────────────────────────
  const handleSaveToLibrary = async () => {
    if (!generatedNote) return;
    const content = [
      `TOPIC: ${generatedNote.topicTitle}`,
      "",
      "SHORT EXPLANATION:",
      generatedNote.explanation,
      "",
      "KEY POINTS:",
      ...generatedNote.keyPoints.map((p, i) => `${i + 1}. ${p}`),
      "",
      generatedNote.formulas.length > 0
        ? "IMPORTANT FORMULAS / DEFINITIONS:"
        : "",
      ...generatedNote.formulas,
      "",
      "SUMMARY:",
      generatedNote.summary,
    ]
      .filter((l) => l !== undefined)
      .join("\n");

    try {
      const board = "Maharashtra State Board";
      const levelLabel =
        EDUCATION_LEVELS.find((l) => l.value === generatedNote.educationLevel)
          ?.label ?? generatedNote.educationLevel;
      const streamLabel = generatedNote.stream
        ? (STREAMS.find((s) => s.value === generatedNote.stream)?.label ??
          generatedNote.stream)
        : "";
      await generateMutation.mutateAsync({
        educationLevel: levelLabel,
        board,
        className: streamLabel || levelLabel,
        subject: generatedNote.subject,
        chapter: generatedNote.topic,
        content,
      });
      setSavedToLibrary(true);
      toast.success("Notes saved to your library!");
    } catch {
      toast.error("Failed to save notes. Please try again.");
    }
  };

  // ── upload own notes ──────────────────────────────────────────────────────────
  const handleUploadNotes = async () => {
    if (!uploadTitle.trim() || !uploadContent.trim() || !uploadSubject.trim()) {
      toast.error("Please fill in the title, subject, and your notes content.");
      return;
    }
    setIsUploading(true);
    try {
      const uploaderName = profile?.name || "Student";
      await addSharedNoteMutation.mutateAsync({
        title: uploadTitle.trim(),
        educationLevel: educationLevel || "General",
        board: "Maharashtra State Board",
        subject: uploadSubject.trim(),
        topic: uploadTitle.trim(),
        content: uploadContent.trim(),
        uploaderName,
      });
      setUploadTitle("");
      setUploadContent("");
      setUploadSubject("");
      toast.success(
        "Your notes have been uploaded and are visible to all students!",
      );
    } catch {
      toast.error("Failed to upload notes. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // ── delete from library ────────────────────────────────────────────────────────
  const handleDeleteSaved = async (timestamp: bigint) => {
    try {
      await deleteMutation.mutateAsync(timestamp);
      toast.success("Note deleted.");
    } catch {
      toast.error("Failed to delete note.");
    }
  };

  const formatDate = (ts: bigint) =>
    new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* ── header ─────────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-serif font-bold">AI Notes Generator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Generate structured, Maharashtra syllabus-aligned study notes
          instantly.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* ── left: form ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            className="shadow-soft border-primary/20"
            data-ocid="ai-notes.form.card"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Generate Notes
              </CardTitle>
              <CardDescription>
                Select your details and click Generate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Education Level */}
              <div className="space-y-2">
                <Label htmlFor="edu-level">
                  Education Level <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={educationLevel}
                  onValueChange={handleEducationLevelChange}
                >
                  <SelectTrigger
                    id="edu-level"
                    data-ocid="ai-notes.education_level.select"
                  >
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_LEVELS.map((lvl) => (
                      <SelectItem key={lvl.value} value={lvl.value}>
                        {lvl.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Stream – only for 11th & 12th */}
              {needsStream && (
                <div className="space-y-2">
                  <Label htmlFor="stream">
                    Stream <span className="text-destructive">*</span>
                  </Label>
                  <Select value={stream} onValueChange={handleStreamChange}>
                    <SelectTrigger
                      id="stream"
                      data-ocid="ai-notes.stream.select"
                    >
                      <SelectValue placeholder="Select stream" />
                    </SelectTrigger>
                    <SelectContent>
                      {STREAMS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Subject – smart dropdown */}
              <div className="space-y-2">
                <Label htmlFor="subject">
                  Subject <span className="text-destructive">*</span>
                </Label>
                {availableSubjects.length > 0 ? (
                  <Select
                    value={subject}
                    onValueChange={setSubject}
                    disabled={!educationLevel || (needsStream && !stream)}
                  >
                    <SelectTrigger
                      id="subject"
                      data-ocid="ai-notes.subject.select"
                    >
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubjects.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2 border border-input">
                    {educationLevel
                      ? needsStream && !stream
                        ? "Select a stream first to see subjects"
                        : "No subjects found for this level"
                      : "Select an education level first"}
                  </div>
                )}
              </div>

              {/* Topic */}
              <div className="space-y-2">
                <Label htmlFor="topic">
                  Topic / Chapter Name{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="topic"
                  data-ocid="ai-notes.topic.input"
                  placeholder="e.g., Quadratic Equations, Photosynthesis"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={!subject}
                />
              </div>

              <Button
                data-ocid="ai-notes.generate.primary_button"
                className="w-full"
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating || !canGenerate}
              >
                {isGenerating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Notes
                  </>
                )}
              </Button>

              {!canGenerate && educationLevel && (
                <p className="text-xs text-muted-foreground text-center">
                  {needsStream && !stream
                    ? "Select stream → subject → topic to generate"
                    : !subject
                      ? "Select a subject to continue"
                      : "Enter a topic to generate notes"}
                </p>
              )}
            </CardContent>
          </Card>

          {/* ── upload own notes ─────────────────────────────────────────── */}
          <Card
            className="shadow-soft border-secondary/20"
            data-ocid="ai-notes.upload.card"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="h-5 w-5 text-secondary" />
                Upload Your Notes
              </CardTitle>
              <CardDescription>
                Share your notes — visible to all students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upload-title">Title</Label>
                <Input
                  id="upload-title"
                  data-ocid="ai-notes.upload_title.input"
                  placeholder="e.g., Algebra Quick Revision"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upload-subject">Subject</Label>
                <Input
                  id="upload-subject"
                  data-ocid="ai-notes.upload_subject.input"
                  placeholder="e.g., Mathematics"
                  value={uploadSubject}
                  onChange={(e) => setUploadSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upload-content">Notes Content</Label>
                <textarea
                  id="upload-content"
                  data-ocid="ai-notes.upload_content.textarea"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Type or paste your notes here..."
                  value={uploadContent}
                  onChange={(e) => setUploadContent(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Your uploaded notes will be visible to all CareerNest students
                after admin review.
              </p>
              <Button
                data-ocid="ai-notes.upload.primary_button"
                className="w-full"
                variant="outline"
                onClick={handleUploadNotes}
                disabled={isUploading || addSharedNoteMutation.isPending}
              >
                {isUploading || addSharedNoteMutation.isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Notes
                  </>
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/*"
                className="hidden"
              />
            </CardContent>
          </Card>
        </div>

        {/* ── right: generated output + library ───────────────────────────── */}
        <div className="lg:col-span-3 space-y-6">
          {/* Generated Notes Output */}
          {(isGenerating || generatedNote) && (
            <Card
              className="shadow-soft border-primary/30"
              data-ocid="ai-notes.output.card"
            >
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Generated Notes
                    </CardTitle>
                    {generatedNote && (
                      <CardDescription className="mt-1">
                        {EDUCATION_LEVELS.find(
                          (l) => l.value === generatedNote.educationLevel,
                        )?.label ?? generatedNote.educationLevel}
                        {generatedNote.stream
                          ? ` · ${
                              STREAMS.find(
                                (s) => s.value === generatedNote.stream,
                              )?.label ?? generatedNote.stream
                            }`
                          : ""}
                        {" · "}
                        {generatedNote.subject}
                      </CardDescription>
                    )}
                  </div>
                  {generatedNote && (
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        data-ocid="ai-notes.copy.secondary_button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                      >
                        {copied ? (
                          <>
                            <Check className="mr-1 h-4 w-4 text-green-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-1 h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        data-ocid="ai-notes.download.secondary_button"
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadPDF}
                      >
                        <Download className="mr-1 h-4 w-4" />
                        Download PDF
                      </Button>
                      <Button
                        data-ocid="ai-notes.save.secondary_button"
                        variant={savedToLibrary ? "outline" : "default"}
                        size="sm"
                        onClick={handleSaveToLibrary}
                        disabled={savedToLibrary || generateMutation.isPending}
                      >
                        {savedToLibrary ? (
                          <>
                            <CheckCircle2 className="mr-1 h-4 w-4 text-green-600" />
                            Saved!
                          </>
                        ) : (
                          <>
                            <Save className="mr-1 h-4 w-4" />
                            Save to Library
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {isGenerating ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                ) : generatedNote ? (
                  <div className="space-y-6">
                    {/* Topic Title */}
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-primary">
                        {generatedNote.topicTitle}
                      </h2>
                      <div className="flex gap-2 flex-wrap mt-2">
                        <Badge variant="secondary">
                          {EDUCATION_LEVELS.find(
                            (l) => l.value === generatedNote.educationLevel,
                          )?.label ?? generatedNote.educationLevel}
                        </Badge>
                        {generatedNote.stream && (
                          <Badge variant="outline">
                            {STREAMS.find(
                              (s) => s.value === generatedNote.stream,
                            )?.label ?? generatedNote.stream}
                          </Badge>
                        )}
                        <Badge variant="outline">{generatedNote.subject}</Badge>
                      </div>
                    </div>

                    <Separator />

                    {/* Short Explanation */}
                    <div>
                      <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary font-bold">
                          1
                        </span>
                        Short Explanation
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {generatedNote.explanation}
                      </p>
                    </div>

                    {/* Key Points */}
                    <div>
                      <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary font-bold">
                          2
                        </span>
                        Key Points
                      </h3>
                      <ul className="space-y-2">
                        {generatedNote.keyPoints.map((pt, i) => (
                          <li key={pt} className="flex items-start gap-3">
                            <span className="w-5 h-5 mt-0.5 bg-primary/15 rounded-full flex items-center justify-center text-xs text-primary font-bold shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-sm">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Formulas / Definitions */}
                    {generatedNote.formulas.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                          <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary font-bold">
                            3
                          </span>
                          Important Formulas / Definitions
                        </h3>
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                          {generatedNote.formulas.map((f) => (
                            <div key={f} className="flex items-start gap-2">
                              <span className="text-primary mt-0.5">📌</span>
                              <span className="text-sm font-mono">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    <div>
                      <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary font-bold">
                          {generatedNote.formulas.length > 0 ? "4" : "3"}
                        </span>
                        Summary
                      </h3>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {generatedNote.summary}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground text-center pt-2">
                      Generated for Maharashtra Students · CareerNest
                      Educational Platform
                    </p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {/* Empty state before first generation */}
          {!isGenerating && !generatedNote && (
            <div
              data-ocid="ai-notes.output.empty_state"
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-16 text-center"
            >
              <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="font-medium text-muted-foreground">
                Your notes will appear here
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Select education level, subject, topic, then click Generate
                Notes
              </p>
            </div>
          )}

          {/* ── saved library ──────────────────────────────────────────────── */}
          <Card className="shadow-soft" data-ocid="ai-notes.library.card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5" />
                My Notes Library
              </CardTitle>
              <CardDescription>Notes you have saved</CardDescription>
            </CardHeader>
            <CardContent>
              {savedLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : savedNotes && savedNotes.length > 0 ? (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  data-ocid="ai-notes.library.list"
                >
                  {[...savedNotes]
                    .sort((a, b) => Number(b.timestamp - a.timestamp))
                    .map((note, idx) => (
                      <AccordionItem
                        key={Number(note.timestamp)}
                        value={String(note.timestamp)}
                        data-ocid={`ai-notes.library.item.${idx + 1}`}
                      >
                        <AccordionTrigger className="text-sm hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <div>
                              <div className="font-medium">{note.chapter}</div>
                              <div className="text-xs text-muted-foreground">
                                {note.subject} · {note.educationLevel} ·{" "}
                                {formatDate(note.timestamp)}
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="whitespace-pre-wrap text-sm text-muted-foreground bg-muted/30 rounded-lg p-4 mb-3">
                            {note.content}
                          </div>
                          <Button
                            data-ocid={`ai-notes.library.delete_button.${idx + 1}`}
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteSaved(note.timestamp)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              ) : (
                <div
                  data-ocid="ai-notes.library.empty_state"
                  className="text-center py-10 text-muted-foreground"
                >
                  <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No saved notes yet.</p>
                  <p className="text-xs mt-1">
                    Generate notes and click &quot;Save to Library&quot;.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
