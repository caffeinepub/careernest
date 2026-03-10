# CareerNest

## Current State
CareerNest is a Maharashtra-focused educational platform. Students have a `UserProfile` with `name`, `academicLevel` (highSchool/undergraduate/postgraduate), `interests`, and `goals`. A `ProfileSetupModal` is shown on first login. The backend stores this profile and provides notes, shared notes, admin notes, career guidance, and mini-games.

## Requested Changes (Diff)

### Add
- `classLevel` field to `UserProfile` (string): 10th, 11th, 12th, Diploma, Engineering, BSc, BCA, OtherUG
- `stream` field to `UserProfile` (string): Science, Commerce, Arts (for 11th/12th)
- `branch` field to `UserProfile` (string): Computer/Mechanical/Civil/Electrical/Electronics/OtherBranch (for Engineering/Diploma)
- Conditional stream/branch selection in `ProfileSetupModal` based on chosen class
- Personalized dashboard sections showing notes/guidance relevant to the student's class and stream
- Edit capability for classLevel/stream/branch in `ProfilePage`

### Modify
- `UserProfile` backend type: add `classLevel`, `stream`, `branch` as optional strings
- `ProfileSetupModal`: replace generic academic level with specific class/stream/branch dropdowns
- `ProfilePage`: show and allow editing of classLevel, stream, branch
- `HomePage`: show personalized sections based on profile class/stream

### Remove
- Nothing removed

## Implementation Plan
1. Regenerate Motoko backend with updated `UserProfile` including `classLevel`, `stream`, `branch` fields
2. Update `backend.d.ts` with new UserProfile shape
3. Rewrite `ProfileSetupModal` with class dropdown + conditional stream/branch dropdowns
4. Update `ProfilePage` to display and edit class/stream/branch
5. Update `HomePage` to show personalized dashboard sections based on profile data
