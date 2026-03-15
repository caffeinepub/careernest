# CareerNest

## Current State
- SplashPage shows CareerNest logo image with loading animation (works)
- Navigation header shows "CN" text fallback instead of logo image
- TextbooksPage has hardcoded static TEXTBOOKS data (20+ books across streams)
- StudyNotesPage has AI notes generator (generates mock notes, saves via backend)
- QuizPage has hardcoded static quiz questions
- QuestionPapersPage has hardcoded static papers list
- AdminDashboardPage has tabs: Users, Notes Moderation, Admin Notes, User Stats
- Backend has AdminNote type (id, title, educationLevel, board, subject, topic, content) used for storing admin-created content
- Backend has SharedNote type for student-uploaded notes with approve/reject workflow

## Requested Changes (Diff)

### Add
- Logo image in Navigation header (replace "CN" text with actual logo image)
- Admin Content Management section: upload textbooks, study notes, learning materials (using addAdminNote with topic="textbook"|"notes"|"material"|"paper")
- Admin Assessment Management section: create MCQ assessments with 10-15 questions per assessment (stored as AdminNote with topic="assessment", JSON in content field)
- Admin can add/edit/delete quiz questions with options and mark correct answer
- Student quiz-taking interface: load admin-created assessments, answer MCQ questions, see score after completion
- Student content view: textbooks and notes from admin uploads
- Empty state placeholders in all content sections (no preloaded data shown)

### Modify
- TextbooksPage: remove all hardcoded TEXTBOOKS/SAMPLE_CONTENT static data. Load from AdminNote where topic="textbook". Show empty state if no content uploaded.
- QuizPage/AssessmentPage: remove hardcoded questions. Load admin-created assessments (AdminNote topic="assessment", parse JSON content). Students select an assessment and take it.
- QuestionPapersPage: remove all hardcoded paper data. Load from AdminNote where topic="paper". Show empty state.
- AdminDashboardPage: overhaul with 4 tabs:
  1. Content Management (upload textbooks, notes, papers, materials)
  2. Assessment Management (create MCQ assessments with question editor)
  3. Student Notes (approve/reject/delete shared notes)
  4. Users (existing user management)
- StudyNotesPage: keep AI generator but add a "Notes Library" tab showing admin notes (topic="notes"|"material") and approved shared notes

### Remove
- All hardcoded static textbook data from TextbooksPage
- All hardcoded static quiz question data from QuizPage  
- All hardcoded static question paper data from QuestionPapersPage
- Pre-seeded/sample content that is not from actual admin uploads

## Implementation Plan

1. Update Navigation.tsx: show logo image in header (with CN fallback)
2. Update TextbooksPage.tsx: remove static data, load admin notes with topic="textbook", show reader modal for content, show empty state
3. Update QuestionPapersPage.tsx: remove static data, load admin notes with topic="paper", show empty state
4. Update QuizPage.tsx (or create new AssessmentStudentPage): load admin assessment notes (topic="assessment"), parse JSON, allow student to take quiz and see score
5. Update StudyNotesPage.tsx: add Notes Library tab alongside AI generator, showing admin notes (topic="notes"|"material") and approved shared notes
6. Overhaul AdminDashboardPage.tsx with 4 tabs:
   - Content tab: form to add textbook/notes/paper/material with type selector, list of existing items with delete
   - Assessment tab: create assessment with name, subject, add 10-15 MCQ questions each with 4 options and correct answer selection, edit/delete assessment
   - Student Notes tab: pending approval queue + reported notes
   - Users tab: existing functionality
7. Assessment JSON format stored in AdminNote.content:
   ```json
   {"title":"...","subject":"...","educationLevel":"...","questions":[{"question":"...","options":["...","...","...","..."],"correctIndex":0}]}
   ```
