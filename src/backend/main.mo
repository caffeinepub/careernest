import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type AcademicLevel = {
    #highSchool;
    #undergraduate;
    #postgraduate;
  };

  module AcademicLevel {
    public func toText(level : AcademicLevel) : Text {
      switch (level) {
        case (#highSchool) { "High School" };
        case (#undergraduate) { "Undergraduate" };
        case (#postgraduate) { "Postgraduate" };
      };
    };
  };

  type UserProfile = {
    name : Text;
    academicLevel : AcademicLevel;
    interests : [Text];
    goals : Text;
  };

  type AssessmentResult = {
    user : Principal;
    recommendedCareer : Text;
    matchScore : Nat;
    timestamp : Time.Time;
  };

  type CareerPath = {
    title : Text;
    description : Text;
    requiredSkills : [Text];
    educationRequirements : Text;
    industry : Text;
  };

  module CareerPath {
    public func toText(path : CareerPath) : Text {
      path.title;
    };

    public func compare(path1 : CareerPath, path2 : CareerPath) : Order.Order {
      Text.compare(path1.title, path2.title);
    };
  };

  type MoodEntry = {
    moodLevel : Nat;
    stressLevel : Nat;
    date : Int;
    notes : Text;
  };

  type WellnessResource = {
    title : Text;
    content : Text;
    type_ : Text;
  };

  module WellnessResource {
    public func toText(resource : WellnessResource) : Text {
      resource.title;
    };
    public func compare(resource1 : WellnessResource, resource2 : WellnessResource) : Order.Order {
      Text.compare(resource1.title, resource2.title);
    };
  };

  type StudyNotes = {
    educationLevel : Text;
    board : Text;
    className : Text;
    subject : Text;
    chapter : Text;
    content : Text;
    timestamp : Time.Time;
    user : Principal;
  };

  type SharedNote = {
    id : Nat;
    title : Text;
    educationLevel : Text;
    board : Text;
    subject : Text;
    topic : Text;
    content : Text;
    uploaderName : Text;
    uploader : Principal;
    timestamp : Time.Time;
    likes : Nat;
    reports : Nat;
    isVisible : Bool;
    isApproved : Bool;
  };

  type AdminNote = {
    id : Nat;
    title : Text;
    educationLevel : Text;
    board : Text;
    subject : Text;
    topic : Text;
    content : Text;
    timestamp : Time.Time;
    isVerified : Bool;
    isFeatured : Bool;
  };

  type UserStatistics = {
    totalUsers : Nat;
    usersWithProfiles : Nat;
    usersWithAssessments : Nat;
    usersWithMoodEntries : Nat;
    totalSharedNotes : Nat;
    totalAdminNotes : Nat;
    totalReports : Nat;
  };

  // Storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  var careerPaths = List.empty<CareerPath>();
  let assessmentResults = Map.empty<Principal, List.List<AssessmentResult>>();
  let moodEntries = Map.empty<Principal, List.List<MoodEntry>>();
  var wellnessResources = List.empty<WellnessResource>();
  let userViewedResources = Map.empty<Principal, List.List<Nat>>();
  let studyNotes = Map.empty<Principal, List.List<StudyNotes>>();
  var sharedNotes = List.empty<SharedNote>();
  var adminNotes = List.empty<AdminNote>();
  var sharedNoteCounter : Nat = 0;
  var adminNoteCounter : Nat = 0;
  let blockedUsers = Map.empty<Principal, Bool>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Career Assessment Functions
  public shared ({ caller }) func saveAssessmentResult(result : AssessmentResult) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save assessment results");
    };
    let userResults = switch (assessmentResults.get(caller)) {
      case (null) {
        let resultList = List.empty<AssessmentResult>();
        resultList.add(result);
        resultList;
      };
      case (?existingResults) {
        existingResults.add(result);
        existingResults;
      };
    };
    assessmentResults.add(caller, userResults);
  };

  public query ({ caller }) func getUserAssessments() : async [AssessmentResult] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view assessments");
    };
    switch (assessmentResults.get(caller)) {
      case (null) { [] };
      case (?results) { results.toArray() };
    };
  };

  // Career Path Functions
  public query ({ caller }) func getAllCareerPaths() : async [CareerPath] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view career paths");
    };
    careerPaths.toArray().sort();
  };

  public query ({ caller }) func getCareerPathByTitle(title : Text) : async ?CareerPath {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view career paths");
    };
    careerPaths.values().find(func(c) { c.title == title });
  };

  public shared ({ caller }) func addCareerPath(path : CareerPath) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add career paths");
    };
    careerPaths.add(path);
  };

  public shared ({ caller }) func removeCareerPath(title : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can remove career paths");
    };
    careerPaths := careerPaths.filter(func(c) { c.title != title });
  };

  // Mood Tracking Functions
  public shared ({ caller }) func addMoodEntry(entry : MoodEntry) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add mood entries");
    };
    var userEntries = switch (moodEntries.get(caller)) {
      case (null) {
        let entryList = List.empty<MoodEntry>();
        entryList.add(entry);
        entryList;
      };
      case (?existingEntries) {
        existingEntries.add(entry);
        existingEntries;
      };
    };
    moodEntries.add(caller, userEntries);
  };

  public query ({ caller }) func getMoodHistory() : async [MoodEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view mood history");
    };
    switch (moodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.toArray() };
    };
  };

  // Wellness Resource Functions
  public query ({ caller }) func getAllWellnessResources() : async [WellnessResource] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view wellness resources");
    };
    wellnessResources.toArray().sort();
  };

  public shared ({ caller }) func addWellnessResource(resource : WellnessResource) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add wellness resources");
    };
    wellnessResources.add(resource);
  };

  public shared ({ caller }) func removeWellnessResource(title : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can remove wellness resources");
    };
    wellnessResources := wellnessResources.filter(func(r) { r.title != title });
  };

  public shared ({ caller }) func saveViewedResource(resourceId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save viewed resources");
    };
    var userResources = switch (userViewedResources.get(caller)) {
      case (null) {
        let resourceList = List.empty<Nat>();
        resourceList.add(resourceId);
        resourceList;
      };
      case (?existingResources) {
        existingResources.add(resourceId);
        existingResources;
      };
    };
    userViewedResources.add(caller, userResources);
  };

  public query ({ caller }) func getViewedResources() : async [Nat] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their viewed resources");
    };
    switch (userViewedResources.get(caller)) {
      case (null) { [] };
      case (?resources) { resources.toArray() };
    };
  };

  // Study Notes Functions
  public shared ({ caller }) func generateStudyNotes(
    educationLevel : Text,
    board : Text,
    className : Text,
    subject : Text,
    chapter : Text,
    content : Text
  ) : async Time.Time {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can generate study notes");
    };

    let timestamp = Time.now();

    let notes : StudyNotes = {
      educationLevel;
      board;
      className;
      subject;
      chapter;
      content;
      timestamp;
      user = caller;
    };

    let userNotes = switch (studyNotes.get(caller)) {
      case (null) {
        let notesList = List.empty<StudyNotes>();
        notesList.add(notes);
        notesList;
      };
      case (?existingNotes) {
        existingNotes.add(notes);
        existingNotes;
      };
    };
    studyNotes.add(caller, userNotes);
    timestamp;
  };

  public query ({ caller }) func getAllStudyNotes() : async [StudyNotes] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view study notes");
    };
    switch (studyNotes.get(caller)) {
      case (null) { [] };
      case (?notes) { notes.toArray() };
    };
  };

  public shared ({ caller }) func deleteStudyNotes(timestamp : Time.Time) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete study notes");
    };

    switch (studyNotes.get(caller)) {
      case (null) { Runtime.trap("No study notes found for user") };
      case (?userNotes) {
        let filteredNotes = userNotes.filter(
          func(note) { note.timestamp != timestamp }
        );
        studyNotes.add(caller, filteredNotes);
      };
    };
  };

  // ===== SHARED NOTES =====

  public shared ({ caller }) func addSharedNote(
    title : Text,
    educationLevel : Text,
    board : Text,
    subject : Text,
    topic : Text,
    content : Text,
    uploaderName : Text
  ) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can upload shared notes");
    };
    if (blockedUsers.get(caller) == ?true) {
      Runtime.trap("Your account has been blocked");
    };
    sharedNoteCounter += 1;
    let note : SharedNote = {
      id = sharedNoteCounter;
      title;
      educationLevel;
      board;
      subject;
      topic;
      content;
      uploaderName;
      uploader = caller;
      timestamp = Time.now();
      likes = 0;
      reports = 0;
      isVisible = true;
      isApproved = false;
    };
    sharedNotes.add(note);
    sharedNoteCounter;
  };

  public query ({ caller }) func getAllSharedNotes() : async [SharedNote] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    sharedNotes.toArray().filter(func(n) { n.isVisible and n.isApproved });
  };

  public query ({ caller }) func getMySharedNotes() : async [SharedNote] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    sharedNotes.toArray().filter(func(n) { n.uploader == caller });
  };

  public shared ({ caller }) func likeSharedNote(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    sharedNotes := sharedNotes.map(func(n) {
      if (n.id == id) {
        { n with likes = n.likes + 1 };
      } else { n };
    });
  };

  public shared ({ caller }) func reportSharedNote(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    sharedNotes := sharedNotes.map(func(n) {
      if (n.id == id) {
        let newReports = n.reports + 1;
        { n with reports = newReports; isVisible = newReports < 3 };
      } else { n };
    });
  };

  public shared ({ caller }) func deleteSharedNote(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    sharedNotes := sharedNotes.filter(func(n) {
      if (n.id == id) {
        not (isAdmin or n.uploader == caller);
      } else { true };
    });
  };

  public shared ({ caller }) func approveSharedNote(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can approve notes");
    };
    sharedNotes := sharedNotes.map(func(n) {
      if (n.id == id) { { n with isApproved = true } } else { n };
    });
  };

  public shared ({ caller }) func rejectSharedNote(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can reject notes");
    };
    sharedNotes := sharedNotes.map(func(n) {
      if (n.id == id) { { n with isVisible = false } } else { n };
    });
  };

  public query ({ caller }) func getPendingSharedNotes() : async [SharedNote] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    sharedNotes.toArray().filter(func(n) { not n.isApproved and n.isVisible });
  };

  public query ({ caller }) func getReportedSharedNotes() : async [SharedNote] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    sharedNotes.toArray().filter(func(n) { n.reports > 0 });
  };

  // ===== ADMIN NOTES =====

  public shared ({ caller }) func addAdminNote(
    title : Text,
    educationLevel : Text,
    board : Text,
    subject : Text,
    topic : Text,
    content : Text
  ) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add verified notes");
    };
    adminNoteCounter += 1;
    let note : AdminNote = {
      id = adminNoteCounter;
      title;
      educationLevel;
      board;
      subject;
      topic;
      content;
      timestamp = Time.now();
      isVerified = true;
      isFeatured = false;
    };
    adminNotes.add(note);
    adminNoteCounter;
  };

  public query ({ caller }) func getAllAdminNotes() : async [AdminNote] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    adminNotes.toArray();
  };

  public shared ({ caller }) func deleteAdminNote(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete admin notes");
    };
    adminNotes := adminNotes.filter(func(n) { n.id != id });
  };

  public shared ({ caller }) func toggleFeaturedAdminNote(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can feature notes");
    };
    adminNotes := adminNotes.map(func(n) {
      if (n.id == id) { { n with isFeatured = not n.isFeatured } } else { n };
    });
  };

  // ===== USER BLOCKING =====

  public shared ({ caller }) func blockUser(user : Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can block users");
    };
    blockedUsers.add(user, true);
  };

  public shared ({ caller }) func unblockUser(user : Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can unblock users");
    };
    blockedUsers.add(user, false);
  };

  public query ({ caller }) func isUserBlocked(user : Principal) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    blockedUsers.get(user) == ?true;
  };

  public query ({ caller }) func getBlockedUsers() : async [Principal] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    var blocked = List.empty<Principal>();
    blockedUsers.entries().forEach(func((p, isBlocked)) {
      if (isBlocked) { blocked.add(p) };
    });
    blocked.toArray();
  };

  // ===== ADMIN FUNCTIONS =====

  public query ({ caller }) func getAllUsers() : async [(Principal, UserProfile)] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userProfiles.toArray();
  };

  public query ({ caller }) func getUserStatistics() : async UserStatistics {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view user statistics");
    };
    let totalUsers = userProfiles.size();
    var usersWithAssessments = 0;
    var usersWithMoodEntries = 0;

    if (not assessmentResults.isEmpty()) {
      assessmentResults.keys().forEach(func(_userId) {
        usersWithAssessments += 1;
      });
    };

    if (not moodEntries.isEmpty()) {
      moodEntries.keys().forEach(func(_userId) {
        usersWithMoodEntries += 1;
      });
    };

    var totalReports = 0;
    sharedNotes.values().forEach(func(n) {
      if (n.reports > 0) { totalReports += 1 };
    });

    {
      totalUsers;
      usersWithProfiles = totalUsers;
      usersWithAssessments;
      usersWithMoodEntries;
      totalSharedNotes = sharedNotes.size();
      totalAdminNotes = adminNotes.size();
      totalReports;
    };
  };

  public query ({ caller }) func getAllMoodEntries() : async [(Principal, MoodEntry)] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view mood entries");
    };
    var allEntries = List.empty<(Principal, MoodEntry)>();
    if (not moodEntries.isEmpty()) {
      moodEntries.entries().forEach(func((userId, moodList)) {
        moodList.values().forEach(func(mood) {
          allEntries.add((userId, mood));
        });
      });
    };
    allEntries.toArray();
  };

  public query ({ caller }) func getAllAssessments() : async [(Principal, AssessmentResult)] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view assessments");
    };
    var allResults = List.empty<(Principal, AssessmentResult)>();
    if (not assessmentResults.isEmpty()) {
      assessmentResults.entries().forEach(func((userId, assessmentList)) {
        assessmentList.values().forEach(func(assessment) {
          allResults.add((userId, assessment));
        });
      });
    };
    allResults.toArray();
  };
};
