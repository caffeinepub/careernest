import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  CheckCircle,
  Eye,
  Filter,
  Flag,
  Heart,
  Loader2,
  Search,
  Star,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useAddSharedNote,
  useDeleteSharedNote,
  useGetAllAdminNotes,
  useGetAllSharedNotes,
  useGetMySharedNotes,
  useLikeSharedNote,
  useReportSharedNote,
} from "../hooks/useQueries";
import { EDUCATION_LEVELS, MAHARASHTRA_BOARDS } from "../lib/maharashtra";

type SharedNote = {
  id: bigint;
  title: string;
  educationLevel: string;
  board: string;
  subject: string;
  topic: string;
  content: string;
  uploaderName: string;
  timestamp: bigint;
  likes: bigint;
  reports: bigint;
  isVisible: boolean;
  isApproved: boolean;
};

type AdminNote = {
  id: bigint;
  title: string;
  educationLevel: string;
  board: string;
  subject: string;
  topic: string;
  content: string;
  timestamp: bigint;
  isVerified: boolean;
  isFeatured: boolean;
};

type CombinedNote =
  | { kind: "shared"; note: SharedNote }
  | { kind: "admin"; note: AdminNote };

function formatTs(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function NoteViewDialog({
  note,
  isAdmin,
}: { note: SharedNote | AdminNote; isAdmin: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          data-ocid="notes.open_modal_button"
        >
          <Eye className="h-3 w-3" /> View
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        data-ocid="notes.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{note.title}</DialogTitle>
          <DialogDescription>
            {note.educationLevel} • {note.board} • {note.subject}
            {isAdmin && (
              <Badge className="ml-2" variant="secondary">
                ✓ Verified by CareerNest
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed mt-4">
          {note.content}
        </div>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            const blob = new Blob([note.content], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${note.title}.txt`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Download
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default function SharedNotesPage() {
  const { data: sharedNotesRaw, isLoading: loadingShared } =
    useGetAllSharedNotes();
  const { data: myNotesRaw, isLoading: loadingMine } = useGetMySharedNotes();
  const { data: adminNotesRaw, isLoading: loadingAdmin } =
    useGetAllAdminNotes();

  const sharedNotes = sharedNotesRaw as SharedNote[] | undefined;
  const myNotes = myNotesRaw as SharedNote[] | undefined;
  const adminNotes = adminNotesRaw as AdminNote[] | undefined;

  const addNote = useAddSharedNote();
  const likeNote = useLikeSharedNote();
  const reportNote = useReportSharedNote();
  const deleteNote = useDeleteSharedNote();

  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterBoard, setFilterBoard] = useState("all");
  const [filterSubject, setFilterSubject] = useState("");

  const [uploadForm, setUploadForm] = useState({
    title: "",
    educationLevel: "",
    board: "",
    subject: "",
    topic: "",
    content: "",
    uploaderName: "",
  });

  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const allNotes: CombinedNote[] = useMemo(() => {
    const result: CombinedNote[] = [];
    for (const n of adminNotes ?? []) result.push({ kind: "admin", note: n });
    for (const n of sharedNotes ?? []) result.push({ kind: "shared", note: n });
    return result;
  }, [sharedNotes, adminNotes]);

  const filteredNotes = useMemo(() => {
    return allNotes.filter(({ note }) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.subject.toLowerCase().includes(q) ||
        note.topic.toLowerCase().includes(q);
      const matchLevel =
        filterLevel === "all" || note.educationLevel === filterLevel;
      const matchBoard = filterBoard === "all" || note.board === filterBoard;
      const matchSubject =
        !filterSubject ||
        note.subject.toLowerCase().includes(filterSubject.toLowerCase());
      return matchSearch && matchLevel && matchBoard && matchSubject;
    });
  }, [allNotes, search, filterLevel, filterBoard, filterSubject]);

  const handleUpload = async () => {
    const {
      title,
      educationLevel,
      board,
      subject,
      topic,
      content,
      uploaderName,
    } = uploadForm;
    if (
      !title ||
      !educationLevel ||
      !board ||
      !subject ||
      !topic ||
      !content ||
      !uploaderName
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await addNote.mutateAsync(uploadForm);
      toast.success("Note uploaded! Pending approval.");
      setUploadForm({
        title: "",
        educationLevel: "",
        board: "",
        subject: "",
        topic: "",
        content: "",
        uploaderName: "",
      });
    } catch {
      toast.error("Failed to upload note. Please try again.");
    }
  };

  const isLoading = loadingShared || loadingAdmin;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
            <Users className="h-6 w-6 text-secondary" />
          </div>
          <h1 className="text-4xl font-serif font-bold">
            Shared Student Notes
          </h1>
        </div>
        <p className="text-muted-foreground">
          Share and discover study notes from students across Maharashtra
        </p>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="bg-muted" data-ocid="notes.tab">
          <TabsTrigger value="browse" data-ocid="notes.tab">
            <Search className="mr-2 h-4 w-4" />
            Browse Notes
          </TabsTrigger>
          <TabsTrigger value="uploads" data-ocid="notes.tab">
            <BookOpen className="mr-2 h-4 w-4" />
            My Uploads
          </TabsTrigger>
          <TabsTrigger value="upload-new" data-ocid="notes.tab">
            <Upload className="mr-2 h-4 w-4" />
            Upload Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="grid lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-1 h-fit lg:sticky lg:top-20 border-primary/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <Input
                    placeholder="Title, subject, topic..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    data-ocid="notes.search_input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Education Level</Label>
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger data-ocid="notes.select">
                      <SelectValue placeholder="All levels" />
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
                </div>
                <div className="space-y-2">
                  <Label>Board / University</Label>
                  <Select value={filterBoard} onValueChange={setFilterBoard}>
                    <SelectTrigger data-ocid="notes.select">
                      <SelectValue placeholder="All boards" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Boards</SelectItem>
                      {MAHARASHTRA_BOARDS.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    placeholder="e.g., Mathematics"
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    data-ocid="notes.input"
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearch("");
                    setFilterLevel("all");
                    setFilterBoard("all");
                    setFilterSubject("");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-3 space-y-4">
              {isLoading ? (
                <div className="space-y-4" data-ocid="notes.loading_state">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-36" />
                  ))}
                </div>
              ) : filteredNotes.length === 0 ? (
                <Card data-ocid="notes.empty_state">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <BookOpen className="h-14 w-14 text-muted-foreground/40 mb-4" />
                    <p className="text-lg font-medium mb-1">No notes found</p>
                    <p className="text-sm text-muted-foreground">
                      {search ||
                      filterLevel !== "all" ||
                      filterBoard !== "all" ||
                      filterSubject
                        ? "Try adjusting your filters"
                        : "Be the first to share your notes!"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    {filteredNotes.length} note
                    {filteredNotes.length !== 1 ? "s" : ""} found
                  </p>
                  {filteredNotes.map(({ kind, note }, idx) => (
                    <Card
                      key={`${kind}-${note.id}`}
                      className="border-primary/20 hover:shadow-soft transition-shadow"
                      data-ocid={`notes.item.${idx + 1}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <CardTitle className="text-lg font-serif">
                                {note.title}
                              </CardTitle>
                              {kind === "admin" && (
                                <Badge
                                  variant="secondary"
                                  className="gap-1 text-xs"
                                >
                                  <CheckCircle className="h-3 w-3" /> Verified
                                </Badge>
                              )}
                              {kind === "admin" &&
                                (note as AdminNote).isFeatured && (
                                  <Badge className="gap-1 text-xs">
                                    <Star className="h-3 w-3" /> Featured
                                  </Badge>
                                )}
                            </div>
                            <CardDescription>
                              {note.educationLevel} • {note.board}
                            </CardDescription>
                            <p className="text-xs text-muted-foreground mt-1">
                              {note.subject} — {note.topic}
                            </p>
                          </div>
                          <NoteViewDialog
                            note={note}
                            isAdmin={kind === "admin"}
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {note.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {kind === "shared" && (
                              <span>
                                by {(note as SharedNote).uploaderName}
                              </span>
                            )}
                            {kind === "admin" && (
                              <span>by CareerNest Admin</span>
                            )}
                            <span>• {formatTs(note.timestamp)}</span>
                          </div>
                          {kind === "shared" && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1 text-xs"
                                onClick={() =>
                                  likeNote.mutate((note as SharedNote).id)
                                }
                                data-ocid={`notes.toggle.${idx + 1}`}
                              >
                                <Heart className="h-3 w-3" />
                                {(note as SharedNote).likes.toString()}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1 text-xs text-destructive hover:text-destructive"
                                onClick={() => {
                                  reportNote.mutate((note as SharedNote).id);
                                  toast.success("Note reported");
                                }}
                                data-ocid={`notes.secondary_button.${idx + 1}`}
                              >
                                <Flag className="h-3 w-3" /> Report
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="uploads" className="space-y-4">
          {loadingMine ? (
            <div className="space-y-4" data-ocid="my-notes.loading_state">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : !myNotes || myNotes.length === 0 ? (
            <Card data-ocid="my-notes.empty_state">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Upload className="h-14 w-14 text-muted-foreground/40 mb-4" />
                <p className="text-lg font-medium mb-2">No uploads yet</p>
                <p className="text-sm text-muted-foreground">
                  Upload notes using the "Upload Notes" tab
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {myNotes.map((note, idx) => (
                <Card
                  key={note.id.toString()}
                  className="border-primary/20"
                  data-ocid={`my-notes.item.${idx + 1}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {note.title}
                        </CardTitle>
                        <CardDescription>
                          {note.subject} • {note.topic}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant={note.isApproved ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {note.isApproved ? "Approved" : "Pending"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(note.id)}
                          data-ocid={`my-notes.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {note.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatTs(note.timestamp)}</span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {note.likes.toString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upload-new">
          <Card className="max-w-2xl mx-auto border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload Your Notes
              </CardTitle>
              <CardDescription>
                Share your study notes with Maharashtra students. Notes will be
                reviewed before publishing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="up-title">Title *</Label>
                <Input
                  id="up-title"
                  placeholder="e.g., Quadratic Equations Notes"
                  value={uploadForm.title}
                  onChange={(e) =>
                    setUploadForm((p) => ({ ...p, title: e.target.value }))
                  }
                  data-ocid="upload.input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Education Level *</Label>
                  <Select
                    value={uploadForm.educationLevel}
                    onValueChange={(v) =>
                      setUploadForm((p) => ({ ...p, educationLevel: v }))
                    }
                  >
                    <SelectTrigger data-ocid="upload.select">
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
                <div className="space-y-2">
                  <Label>Board / University *</Label>
                  <Select
                    value={uploadForm.board}
                    onValueChange={(v) =>
                      setUploadForm((p) => ({ ...p, board: v }))
                    }
                  >
                    <SelectTrigger data-ocid="upload.select">
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="up-subject">Subject *</Label>
                  <Input
                    id="up-subject"
                    placeholder="e.g., Mathematics"
                    value={uploadForm.subject}
                    onChange={(e) =>
                      setUploadForm((p) => ({ ...p, subject: e.target.value }))
                    }
                    data-ocid="upload.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="up-topic">Topic / Chapter *</Label>
                  <Input
                    id="up-topic"
                    placeholder="e.g., Quadratic Equations"
                    value={uploadForm.topic}
                    onChange={(e) =>
                      setUploadForm((p) => ({ ...p, topic: e.target.value }))
                    }
                    data-ocid="upload.input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="up-name">Your Name *</Label>
                <Input
                  id="up-name"
                  placeholder="Display name"
                  value={uploadForm.uploaderName}
                  onChange={(e) =>
                    setUploadForm((p) => ({
                      ...p,
                      uploaderName: e.target.value,
                    }))
                  }
                  data-ocid="upload.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="up-content">Notes Content *</Label>
                <Textarea
                  id="up-content"
                  placeholder="Paste or type your notes here..."
                  rows={10}
                  value={uploadForm.content}
                  onChange={(e) =>
                    setUploadForm((p) => ({ ...p, content: e.target.value }))
                  }
                  data-ocid="upload.textarea"
                />
              </div>
              <Button
                onClick={handleUpload}
                disabled={addNote.isPending}
                className="w-full"
                data-ocid="upload.submit_button"
              >
                {addNote.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Notes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="notes.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="notes.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="notes.confirm_button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (deleteId !== null) {
                  await deleteNote.mutateAsync(deleteId);
                  toast.success("Note deleted");
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
