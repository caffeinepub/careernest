import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserStatistics {
    usersWithAssessments: bigint;
    usersWithMoodEntries: bigint;
    totalUsers: bigint;
    usersWithProfiles: bigint;
    totalSharedNotes: bigint;
    totalAdminNotes: bigint;
    totalReports: bigint;
}
export type Time = bigint;
export interface StudyNotes {
    content: string;
    subject: string;
    user: Principal;
    timestamp: Time;
    board: string;
    chapter: string;
    className: string;
    educationLevel: string;
}
export interface SharedNote {
    id: bigint;
    title: string;
    educationLevel: string;
    board: string;
    subject: string;
    topic: string;
    content: string;
    uploaderName: string;
    uploader: Principal;
    timestamp: Time;
    likes: bigint;
    reports: bigint;
    isVisible: boolean;
    isApproved: boolean;
}
export interface AdminNote {
    id: bigint;
    title: string;
    educationLevel: string;
    board: string;
    subject: string;
    topic: string;
    content: string;
    timestamp: Time;
    isVerified: boolean;
    isFeatured: boolean;
}
export interface AssessmentResult {
    recommendedCareer: string;
    user: Principal;
    matchScore: bigint;
    timestamp: Time;
}
export interface CareerPath {
    title: string;
    description: string;
    requiredSkills: Array<string>;
    educationRequirements: string;
    industry: string;
}
export interface WellnessResource {
    title: string;
    content: string;
    type: string;
}
export interface UserProfile {
    academicLevel: AcademicLevel;
    interests: Array<string>;
    name: string;
    goals: string;
}
export interface MoodEntry {
    stressLevel: bigint;
    date: bigint;
    notes: string;
    moodLevel: bigint;
}
export enum AcademicLevel {
    highSchool = "highSchool",
    undergraduate = "undergraduate",
    postgraduate = "postgraduate"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCareerPath(path: CareerPath): Promise<void>;
    addMoodEntry(entry: MoodEntry): Promise<void>;
    addWellnessResource(resource: WellnessResource): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteStudyNotes(timestamp: Time): Promise<void>;
    generateStudyNotes(educationLevel: string, board: string, className: string, subject: string, chapter: string, content: string): Promise<Time>;
    getAllAssessments(): Promise<Array<[Principal, AssessmentResult]>>;
    getAllCareerPaths(): Promise<Array<CareerPath>>;
    getAllMoodEntries(): Promise<Array<[Principal, MoodEntry]>>;
    getAllStudyNotes(): Promise<Array<StudyNotes>>;
    getAllUsers(): Promise<Array<[Principal, UserProfile]>>;
    getAllWellnessResources(): Promise<Array<WellnessResource>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCareerPathByTitle(title: string): Promise<CareerPath | null>;
    getMoodHistory(): Promise<Array<MoodEntry>>;
    getUserAssessments(): Promise<Array<AssessmentResult>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserStatistics(): Promise<UserStatistics>;
    getViewedResources(): Promise<Array<bigint>>;
    isCallerAdmin(): Promise<boolean>;
    removeCareerPath(title: string): Promise<void>;
    removeWellnessResource(title: string): Promise<void>;
    saveAssessmentResult(result: AssessmentResult): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveViewedResource(resourceId: bigint): Promise<void>;
    // Shared Notes
    addSharedNote(title: string, educationLevel: string, board: string, subject: string, topic: string, content: string, uploaderName: string): Promise<bigint>;
    getAllSharedNotes(): Promise<Array<SharedNote>>;
    getMySharedNotes(): Promise<Array<SharedNote>>;
    likeSharedNote(id: bigint): Promise<void>;
    reportSharedNote(id: bigint): Promise<void>;
    deleteSharedNote(id: bigint): Promise<void>;
    approveSharedNote(id: bigint): Promise<void>;
    rejectSharedNote(id: bigint): Promise<void>;
    getPendingSharedNotes(): Promise<Array<SharedNote>>;
    getReportedSharedNotes(): Promise<Array<SharedNote>>;
    // Admin Notes
    addAdminNote(title: string, educationLevel: string, board: string, subject: string, topic: string, content: string): Promise<bigint>;
    addAdminNoteWithSecret(secret: string, title: string, educationLevel: string, board: string, subject: string, topic: string, content: string): Promise<bigint>;
    getAllAdminNotes(): Promise<Array<AdminNote>>;
    deleteAdminNote(id: bigint): Promise<void>;
    deleteAdminNoteWithSecret(secret: string, id: bigint): Promise<void>;
    toggleFeaturedAdminNote(id: bigint): Promise<void>;
    // User Blocking
    blockUser(user: Principal): Promise<void>;
    unblockUser(user: Principal): Promise<void>;
    isUserBlocked(user: Principal): Promise<boolean>;
    getBlockedUsers(): Promise<Array<Principal>>;
}
