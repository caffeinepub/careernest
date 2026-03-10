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
} from "@/components/ui/dialog";
import {
  BookOpen,
  Calendar,
  Download,
  Flag,
  Heart,
  Image as ImageIcon,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type SharedNote,
  reportNote,
  toggleNoteLike,
} from "../utils/localStorage";

interface SharedNoteCardProps {
  note: SharedNote;
  onUpdate: () => void;
}

export default function SharedNoteCard({
  note,
  onUpdate,
}: SharedNoteCardProps) {
  const { identity } = useInternetIdentity();
  const [expanded, setExpanded] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  const userId = identity?.getPrincipal().toString() || "";
  const isLiked = note.likes.includes(userId);
  const isReported = note.reports.includes(userId);

  const handleLike = () => {
    if (!identity) {
      toast.error("Please log in to like notes");
      return;
    }
    toggleNoteLike(note.id, userId);
    onUpdate();
    toast.success(isLiked ? "Like removed" : "Note liked!");
  };

  const handleReport = () => {
    if (!identity) {
      toast.error("Please log in to report notes");
      return;
    }
    if (isReported) {
      toast.info("You have already reported this note");
      return;
    }
    reportNote(note.id, userId);
    onUpdate();
    setShowReportDialog(false);
    toast.success("Note reported. Thank you for keeping the community safe.");
  };

  const handleDownload = () => {
    const content = `${note.topic}\n\n${note.subject} - ${note.className}\n${note.board}\n\nNotes by: ${note.uploaderName}\n\n${note.content}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.topic.replace(/[^a-z0-9]/gi, "_")}_notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Notes downloaded!");
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Card
        className="border-primary/20 shadow-soft hover:shadow-glow transition-all cursor-pointer"
        onClick={() => setExpanded(true)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg mb-1 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">{note.topic}</span>
              </CardTitle>
              <CardDescription className="text-sm">
                {note.subject} • {note.className}
              </CardDescription>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{note.uploaderName}</span>
                <span>•</span>
                <Calendar className="h-3 w-3" />
                <span>{formatDate(note.timestamp)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 items-end shrink-0">
              <Badge variant="outline" className="text-xs">
                {note.educationLevel}
              </Badge>
              {note.imageData && (
                <Badge variant="secondary" className="text-xs">
                  <ImageIcon className="h-3 w-3 mr-1" />
                  Image
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
              {note.content.substring(0, 120)}...
            </p>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className="gap-1"
              >
                <Heart
                  className={`h-4 w-4 ${isLiked ? "fill-destructive text-destructive" : ""}`}
                />
                <span className="text-xs">{note.likes.length}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expanded View Dialog */}
      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">
              {note.topic}
            </DialogTitle>
            <DialogDescription>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline">{note.educationLevel}</Badge>
                <Badge variant="secondary">{note.board}</Badge>
                <Badge>{note.className}</Badge>
                <Badge variant="outline">{note.subject}</Badge>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{note.uploaderName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(note.timestamp)}</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-6">
            {/* Image if available */}
            {note.imageData && (
              <div className="rounded-lg overflow-hidden border border-border">
                <img
                  src={note.imageData}
                  alt="Note attachment"
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm text-foreground bg-muted/50 rounded-lg p-4">
                {note.content}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button
                variant={isLiked ? "default" : "outline"}
                onClick={handleLike}
                className="gap-2"
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "Liked" : "Like"} ({note.likes.length})
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowReportDialog(true)}
                disabled={isReported}
                className="gap-2 ml-auto text-muted-foreground hover:text-destructive"
              >
                <Flag className="h-4 w-4" />
                {isReported ? "Reported" : "Report"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Confirmation Dialog */}
      <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Report This Note?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to report this note as inappropriate? Notes
              with multiple reports will be automatically hidden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReport}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
