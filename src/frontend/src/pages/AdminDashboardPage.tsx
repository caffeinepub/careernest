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
  Activity,
  BarChart3,
  BookOpen,
  CheckCircle,
  FileText,
  Flag,
  Loader2,
  Plus,
  Shield,
  Star,
  StarOff,
  Trash2,
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
  useGetAllUsers,
  useGetBlockedUsers,
  useGetPendingSharedNotes,
  useGetReportedSharedNotes,
  useGetUserStatistics,
  useIsCallerAdmin,
  useRejectSharedNote,
  useToggleFeaturedAdminNote,
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

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: statistics, isLoading: statsLoading } = useGetUserStatistics();
  const { data: allUsers, isLoading: usersLoading } = useGetAllUsers();
  const { data: adminNotes, isLoading: adminNotesLoading } =
    useGetAllAdminNotes();
  const { data: pendingNotes, isLoading: pendingLoading } =
    useGetPendingSharedNotes();
  const { data: reportedNotes, isLoading: reportedLoading } =
    useGetReportedSharedNotes();
  const { data: blockedUsers } = useGetBlockedUsers();

  const addAdminNote = useAddAdminNote();
  const deleteAdminNote = useDeleteAdminNote();
  const toggleFeatured = useToggleFeaturedAdminNote();
  const approveNote = useApproveSharedNote();
  const rejectNote = useRejectSharedNote();
  const deleteSharedNote = useDeleteSharedNote();
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();

  // Add admin note form
  const [noteForm, setNoteForm] = useState({
    title: "",
    educationLevel: "",
    board: "",
    subject: "",
    topic: "",
    content: "",
  });
  const [userSearch, setUserSearch] = useState("");

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const blockedSet = new Set((blockedUsers || []).map((p) => p.toString()));

  const filteredUsers = (allUsers || []).filter(([p, prof]) => {
    const q = userSearch.toLowerCase();
    return (
      !q ||
      p.toString().toLowerCase().includes(q) ||
      prof.name.toLowerCase().includes(q)
    );
  });

  const handleAddNote = async () => {
    const { title, educationLevel, board, subject, topic, content } = noteForm;
    if (!title || !educationLevel || !board || !subject || !topic || !content) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await addAdminNote.mutateAsync(noteForm);
      toast.success("Admin note added successfully");
      setNoteForm({
        title: "",
        educationLevel: "",
        board: "",
        subject: "",
        topic: "",
        content: "",
      });
    } catch {
      toast.error("Failed to add note");
    }
  };

  const statCards = [
    {
      label: "Total Users",
      value: statistics?.totalUsers,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Shared Notes",
      value: (statistics as any)?.totalSharedNotes,
      icon: FileText,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      label: "Admin Notes",
      value: (statistics as any)?.totalAdminNotes,
      icon: BookOpen,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Reports",
      value: (statistics as any)?.totalReports,
      icon: Flag,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-serif font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground">
          Manage notes, users, and platform moderation
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <div
                className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}
              >
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className={`text-3xl font-bold ${color}`}>
                  {value?.toString() ?? "0"}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="notes" className="space-y-6">
        <TabsList className="bg-muted" data-ocid="admin.tab">
          <TabsTrigger value="notes" data-ocid="admin.tab">
            Notes Management
          </TabsTrigger>
          <TabsTrigger value="users" data-ocid="admin.tab">
            User Management
          </TabsTrigger>
          <TabsTrigger value="reports" data-ocid="admin.tab">
            Reports
          </TabsTrigger>
        </TabsList>

        {/* ─── Notes Management ─── */}
        <TabsContent value="notes" className="space-y-6">
          <Tabs defaultValue="admin-notes">
            <TabsList>
              <TabsTrigger value="admin-notes">
                Admin Notes ({adminNotes?.length ?? 0})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending Approval ({pendingNotes?.length ?? 0})
              </TabsTrigger>
            </TabsList>

            {/* Admin Notes sub-tab */}
            <TabsContent value="admin-notes" className="space-y-6 pt-4">
              {/* Add Note Form */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Official Note
                  </CardTitle>
                  <CardDescription>
                    Notes added here will be marked as Verified by CareerNest
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label>Title *</Label>
                      <Input
                        placeholder="Note title"
                        value={noteForm.title}
                        onChange={(e) =>
                          setNoteForm((p) => ({ ...p, title: e.target.value }))
                        }
                        data-ocid="admin.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Education Level *</Label>
                      <Select
                        value={noteForm.educationLevel}
                        onValueChange={(v) =>
                          setNoteForm((p) => ({ ...p, educationLevel: v }))
                        }
                      >
                        <SelectTrigger data-ocid="admin.select">
                          <SelectValue placeholder="Select" />
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
                        value={noteForm.board}
                        onValueChange={(v) =>
                          setNoteForm((p) => ({ ...p, board: v }))
                        }
                      >
                        <SelectTrigger data-ocid="admin.select">
                          <SelectValue placeholder="Select" />
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
                    <div className="space-y-2">
                      <Label>Subject *</Label>
                      <Input
                        placeholder="e.g., Mathematics"
                        value={noteForm.subject}
                        onChange={(e) =>
                          setNoteForm((p) => ({
                            ...p,
                            subject: e.target.value,
                          }))
                        }
                        data-ocid="admin.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Topic / Chapter *</Label>
                      <Input
                        placeholder="e.g., Quadratic Equations"
                        value={noteForm.topic}
                        onChange={(e) =>
                          setNoteForm((p) => ({ ...p, topic: e.target.value }))
                        }
                        data-ocid="admin.input"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Content *</Label>
                      <Textarea
                        placeholder="Full note content..."
                        rows={8}
                        value={noteForm.content}
                        onChange={(e) =>
                          setNoteForm((p) => ({
                            ...p,
                            content: e.target.value,
                          }))
                        }
                        data-ocid="admin.textarea"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddNote}
                    disabled={addAdminNote.isPending}
                    data-ocid="admin.submit_button"
                  >
                    {addAdminNote.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Note
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Admin Notes List */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>
                    Official Notes ({adminNotes?.length ?? 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {adminNotesLoading ? (
                    <div
                      className="space-y-3"
                      data-ocid="admin-notes.loading_state"
                    >
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16" />
                      ))}
                    </div>
                  ) : !adminNotes || adminNotes.length === 0 ? (
                    <div
                      className="text-center py-10 text-muted-foreground"
                      data-ocid="admin-notes.empty_state"
                    >
                      <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
                      <p>No admin notes yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {adminNotes.map((note, idx) => (
                        <div
                          key={note.id.toString()}
                          className="flex items-center justify-between p-3 border rounded-lg"
                          data-ocid={`admin-notes.item.${idx + 1}`}
                        >
                          <div className="flex-1 min-w-0 mr-4">
                            <p className="font-medium truncate">{note.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {note.educationLevel} • {note.subject} •{" "}
                              {note.topic}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {note.isFeatured && (
                              <Badge
                                variant="secondary"
                                className="text-xs gap-1"
                              >
                                <Star className="h-3 w-3" />
                                Featured
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Toggle Featured"
                              onClick={() => toggleFeatured.mutate(note.id)}
                              data-ocid={`admin-notes.toggle.${idx + 1}`}
                            >
                              {note.isFeatured ? (
                                <StarOff className="h-4 w-4" />
                              ) : (
                                <Star className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                deleteAdminNote.mutate(note.id);
                                toast.success("Note deleted");
                              }}
                              data-ocid={`admin-notes.delete_button.${idx + 1}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pending sub-tab */}
            <TabsContent value="pending" className="pt-4">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Pending Student Notes</CardTitle>
                  <CardDescription>
                    Review and approve or reject student-submitted notes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingLoading ? (
                    <div
                      className="space-y-3"
                      data-ocid="pending.loading_state"
                    >
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-20" />
                      ))}
                    </div>
                  ) : !pendingNotes || pendingNotes.length === 0 ? (
                    <div
                      className="text-center py-10 text-muted-foreground"
                      data-ocid="pending.empty_state"
                    >
                      <CheckCircle className="h-10 w-10 mx-auto mb-3 opacity-40" />
                      <p>No pending notes</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingNotes.map((note, idx) => (
                        <div
                          key={note.id.toString()}
                          className="flex items-start justify-between p-4 border rounded-lg gap-4"
                          data-ocid={`pending.item.${idx + 1}`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{note.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {note.educationLevel} • {note.board} •{" "}
                              {note.subject}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              by {note.uploaderName}
                            </p>
                            <p className="text-sm mt-2 line-clamp-2 text-muted-foreground">
                              {note.content}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              className="gap-1 bg-success hover:bg-success/90 text-success-foreground"
                              onClick={() => {
                                approveNote.mutate(note.id);
                                toast.success("Note approved");
                              }}
                              data-ocid={`pending.confirm_button.${idx + 1}`}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="gap-1"
                              onClick={() => {
                                rejectNote.mutate(note.id);
                                toast.success("Note rejected");
                              }}
                              data-ocid={`pending.delete_button.${idx + 1}`}
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ─── User Management ─── */}
        <TabsContent value="users">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                View all users. Block or unblock as needed.
              </CardDescription>
              <div className="relative mt-3">
                <Input
                  placeholder="Search by name or principal..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-4"
                  data-ocid="admin.search_input"
                />
              </div>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="space-y-3" data-ocid="users.loading_state">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-14" />
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div
                  className="text-center py-10 text-muted-foreground"
                  data-ocid="users.empty_state"
                >
                  <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p>
                    {allUsers?.length === 0 ? "No users yet" : "No results"}
                  </p>
                </div>
              ) : (
                <Table data-ocid="users.table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Principal</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(([principal, profile], idx) => {
                      const pStr = principal.toString();
                      const isBlocked = blockedSet.has(pStr);
                      return (
                        <TableRow key={pStr} data-ocid={`users.row.${idx + 1}`}>
                          <TableCell>
                            <TruncatedPrincipal p={principal} />
                          </TableCell>
                          <TableCell className="font-medium">
                            {profile.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {profile.academicLevel}
                            </Badge>
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
                                className="gap-1"
                                onClick={() => {
                                  unblockUser.mutate(principal);
                                  toast.success("User unblocked");
                                }}
                                data-ocid={`users.toggle.${idx + 1}`}
                              >
                                <UserCheck className="h-4 w-4" />
                                Unblock
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="gap-1"
                                onClick={() => {
                                  blockUser.mutate(principal);
                                  toast.success("User blocked");
                                }}
                                data-ocid={`users.toggle.${idx + 1}`}
                              >
                                <UserX className="h-4 w-4" />
                                Block
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Reports ─── */}
        <TabsContent value="reports">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-destructive" />
                Reported Notes
              </CardTitle>
              <CardDescription>
                Notes reported by students for inappropriate content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportedLoading ? (
                <div className="space-y-3" data-ocid="reports.loading_state">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : !reportedNotes || reportedNotes.length === 0 ? (
                <div
                  className="text-center py-10 text-muted-foreground"
                  data-ocid="reports.empty_state"
                >
                  <Activity className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p>No reported notes</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reportedNotes.map((note, idx) => (
                    <div
                      key={note.id.toString()}
                      className="flex items-start justify-between p-4 border border-destructive/20 rounded-lg gap-4"
                      data-ocid={`reports.item.${idx + 1}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{note.title}</p>
                          <Badge variant="destructive" className="text-xs">
                            {note.reports.toString()} reports
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {note.educationLevel} • {note.subject} by{" "}
                          {note.uploaderName}
                        </p>
                        <p className="text-sm mt-2 line-clamp-2 text-muted-foreground">
                          {note.content}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1"
                        onClick={() => {
                          deleteSharedNote.mutate(note.id);
                          toast.success("Note deleted");
                        }}
                        data-ocid={`reports.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
