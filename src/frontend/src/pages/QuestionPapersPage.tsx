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
import { Download, FileText, X } from "lucide-react";
import { useState } from "react";
import { useGetAllAdminNotes } from "../hooks/useQueries";
import { EDUCATION_LEVELS } from "../lib/maharashtra";

export default function QuestionPapersPage() {
  const { data: adminNotes, isLoading } = useGetAllAdminNotes();
  const [filterLevel, setFilterLevel] = useState("all");
  const [selectedNote, setSelectedNote] = useState<any>(null);

  const papers = (adminNotes || []).filter(
    (note: any) => note.topic === "paper",
  );

  const filtered = papers.filter(
    (note: any) => filterLevel === "all" || note.educationLevel === filterLevel,
  );

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
          <FileText className="h-8 w-8 text-primary" />
          Previous Question Papers
        </h1>
        <p className="text-muted-foreground">
          Practice with past exam papers uploaded by your teachers.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Select value={filterLevel} onValueChange={setFilterLevel}>
          <SelectTrigger className="w-48" data-ocid="papers.select">
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
        {filterLevel !== "all" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilterLevel("all")}
            data-ocid="papers.cancel_button"
          >
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4" data-ocid="papers.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          data-ocid="papers.empty_state"
        >
          <FileText className="h-16 w-16 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No question papers available yet
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Question papers will appear here once your teacher uploads them.
          </p>
        </div>
      ) : (
        <div className="space-y-4" data-ocid="papers.list">
          {filtered.map((note: any, idx: number) => (
            <Card
              key={String(note.id)}
              className="hover:shadow-md transition-shadow"
              data-ocid={`papers.item.${idx + 1}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{note.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {note.subject} · {note.educationLevel}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {note.educationLevel || "General"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => setSelectedNote(note)}
                    data-ocid={`papers.item.${idx + 1}.button`}
                  >
                    View Paper
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(note)}
                    data-ocid={`papers.item.${idx + 1}.secondary_button`}
                  >
                    <Download className="h-3.5 w-3.5 mr-1" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Modal */}
      <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
        <DialogContent
          className="max-w-2xl max-h-[80vh] overflow-y-auto"
          data-ocid="papers.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
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
              data-ocid="papers.dialog.secondary_button"
            >
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedNote(null)}
              data-ocid="papers.dialog.close_button"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
