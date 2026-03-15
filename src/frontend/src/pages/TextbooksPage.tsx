import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Book, BookOpen, Download, Eye, X } from "lucide-react";
import { useState } from "react";
import { useGetAllAdminNotes } from "../hooks/useQueries";
import { EDUCATION_LEVELS } from "../lib/maharashtra";

export default function TextbooksPage() {
  const { data: adminNotes, isLoading } = useGetAllAdminNotes();
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [selectedNote, setSelectedNote] = useState<any>(null);

  const textbooks = (adminNotes || []).filter(
    (note: any) => note.topic === "textbook",
  );

  const subjects = Array.from(
    new Set(textbooks.map((n: any) => n.subject).filter(Boolean)),
  ) as string[];

  const filtered = textbooks.filter((note: any) => {
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2 flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Digital Textbooks
        </h1>
        <p className="text-muted-foreground">
          Access textbooks uploaded by your teachers for all subjects.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8" data-ocid="textbooks.section">
        <Select value={filterLevel} onValueChange={setFilterLevel}>
          <SelectTrigger className="w-48" data-ocid="textbooks.select">
            <SelectValue placeholder="Education Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {EDUCATION_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-48" data-ocid="textbooks.subject.select">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((sub) => (
              <SelectItem key={sub} value={sub}>
                {sub}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(filterLevel !== "all" || filterSubject !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilterLevel("all");
              setFilterSubject("all");
            }}
            data-ocid="textbooks.cancel_button"
          >
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="textbooks.loading_state"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          data-ocid="textbooks.empty_state"
        >
          <Book className="h-16 w-16 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No textbooks available yet
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Textbooks will appear here once your teacher uploads them. Check
            back soon!
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="textbooks.list"
        >
          {filtered.map((note: any, idx: number) => (
            <Card
              key={String(note.id)}
              className="hover:shadow-md transition-shadow border-border"
              data-ocid={`textbooks.item.${idx + 1}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Book className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {note.educationLevel || "General"}
                  </Badge>
                </div>
                <CardTitle className="text-base mt-2 line-clamp-2">
                  {note.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-1">
                  {note.subject}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  {note.board}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedNote(note)}
                    data-ocid={`textbooks.item.${idx + 1}.button`}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5" /> Read
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(note)}
                    data-ocid={`textbooks.item.${idx + 1}.secondary_button`}
                  >
                    <Download className="h-3.5 w-3.5" />
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
          data-ocid="textbooks.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              {selectedNote?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
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
              data-ocid="textbooks.dialog.secondary_button"
            >
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedNote(null)}
              data-ocid="textbooks.dialog.close_button"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
