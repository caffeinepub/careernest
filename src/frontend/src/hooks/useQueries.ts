import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AssessmentResult,
  CareerPath,
  MoodEntry,
  UserProfile,
  UserStatistics,
  WellnessResource,
} from "../backend";
import { UserRole } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// Career Paths
export function useGetAllCareerPaths() {
  const { actor, isFetching } = useActor();

  return useQuery<CareerPath[]>({
    queryKey: ["careerPaths"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCareerPaths();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCareerPathByTitle(title: string) {
  const { actor, isFetching } = useActor();

  return useQuery<CareerPath | null>({
    queryKey: ["careerPath", title],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCareerPathByTitle(title);
    },
    enabled: !!actor && !isFetching && !!title,
  });
}

// Assessment Results
export function useGetUserAssessments() {
  const { actor, isFetching } = useActor();

  return useQuery<AssessmentResult[]>({
    queryKey: ["userAssessments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserAssessments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveAssessmentResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (result: AssessmentResult) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveAssessmentResult(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAssessments"] });
    },
  });
}

// Mood Tracking
export function useGetMoodHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<MoodEntry[]>({
    queryKey: ["moodHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMoodHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMoodEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: MoodEntry) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addMoodEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moodHistory"] });
    },
  });
}

// Wellness Resources
export function useGetAllWellnessResources() {
  const { actor, isFetching } = useActor();

  return useQuery<WellnessResource[]>({
    queryKey: ["wellnessResources"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWellnessResources();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetViewedResources() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint[]>({
    queryKey: ["viewedResources"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getViewedResources();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveViewedResource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resourceId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveViewedResource(resourceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["viewedResources"] });
    },
  });
}

// Study Notes
export function useGetAllStudyNotes() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["studyNotes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudyNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGenerateStudyNotes() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      educationLevel: string;
      board: string;
      className: string;
      subject: string;
      chapter: string;
      content: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.generateStudyNotes(
        params.educationLevel,
        params.board,
        params.className,
        params.subject,
        params.chapter,
        params.content,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyNotes"] });
    },
  });
}

export function useDeleteStudyNotes() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (timestamp: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteStudyNotes(timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyNotes"] });
    },
  });
}

// Admin Queries
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Principal, UserProfile]>>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserStatistics() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["userStatistics"],
    queryFn: async () => {
      if (!actor)
        return {
          totalUsers: 0n,
          usersWithProfiles: 0n,
          usersWithAssessments: 0n,
          usersWithMoodEntries: 0n,
          totalSharedNotes: 0n,
          totalAdminNotes: 0n,
          totalReports: 0n,
        };
      return actor.getUserStatistics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAssignAdminRole() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor || !identity) throw new Error("Not authenticated");
      await actor.assignCallerUserRole(identity.getPrincipal(), UserRole.admin);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isCallerAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["userRole"] });
    },
  });
}

// Shared Notes
export function useGetAllSharedNotes() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["sharedNotes"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllSharedNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMySharedNotes() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["mySharedNotes"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getMySharedNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllAdminNotes() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["adminNotes"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllAdminNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPendingSharedNotes() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["pendingNotes"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getPendingSharedNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReportedSharedNotes() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["reportedNotes"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getReportedSharedNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlockedUsers() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["blockedUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getBlockedUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSharedNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      educationLevel: string;
      board: string;
      subject: string;
      topic: string;
      content: string;
      uploaderName: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).addSharedNote(
        params.title,
        params.educationLevel,
        params.board,
        params.subject,
        params.topic,
        params.content,
        params.uploaderName,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sharedNotes"] });
      queryClient.invalidateQueries({ queryKey: ["mySharedNotes"] });
    },
  });
}

export function useLikeSharedNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await (actor as any).likeSharedNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sharedNotes"] });
    },
  });
}

export function useReportSharedNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await (actor as any).reportSharedNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sharedNotes"] });
    },
  });
}

export function useDeleteSharedNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await (actor as any).deleteSharedNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sharedNotes"] });
      queryClient.invalidateQueries({ queryKey: ["mySharedNotes"] });
    },
  });
}

export function useApproveSharedNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await (actor as any).approveSharedNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingNotes"] });
      queryClient.invalidateQueries({ queryKey: ["sharedNotes"] });
    },
  });
}

export function useRejectSharedNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await (actor as any).rejectSharedNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingNotes"] });
    },
  });
}

export function useAddAdminNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      educationLevel: string;
      board: string;
      subject: string;
      topic: string;
      content: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).addAdminNote(
        params.title,
        params.educationLevel,
        params.board,
        params.subject,
        params.topic,
        params.content,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotes"] });
      queryClient.invalidateQueries({ queryKey: ["userStatistics"] });
    },
  });
}

export function useDeleteAdminNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await (actor as any).deleteAdminNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotes"] });
      queryClient.invalidateQueries({ queryKey: ["userStatistics"] });
    },
  });
}

export function useToggleFeaturedAdminNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await (actor as any).toggleFeaturedAdminNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotes"] });
    },
  });
}

export function useBlockUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error("Actor not available");
      await (actor as any).blockUser(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
    },
  });
}

export function useUnblockUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error("Actor not available");
      await (actor as any).unblockUser(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
    },
  });
}
