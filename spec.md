# CareerNest

## Current State
- SplashPage (`/`) shows CareerNest logo only and auto-redirects to `/login` after 2 seconds — correct.
- HomePage (dashboard, after login) has a large AI Notes Generator Hero Banner as the first prominent section, followed by quick stats and a personalized learning path.
- AINotesGeneratorPage has fields for education level, stream, subject, and topic but does not filter subjects based on the student's class profile.
- StudyNotesPage and SharedNotesPage exist but don't filter by the student's enrolled class/stream.
- All features are already behind authentication.

## Requested Changes (Diff)

### Add
- Smart filtering on AINotesGeneratorPage: prepopulate education level and stream from student profile; restrict subject suggestions to curriculum-relevant ones for the selected level.
- Dashboard feature cards grid on HomePage showing: AI Notes Generator, Notes Library (Study Notes), Career Guidance, Upload Notes, Mini Games — cleanly displayed after welcome section.
- Subject lists per education level for the AI Notes Generator (only valid Maharashtra syllabus subjects).

### Modify
- Remove the AI Notes Generator Hero Banner section from HomePage — the hero banner linking to `/ai-notes` should be deleted.
- HomePage welcome section retains the logo, welcome text, and personalized subtitle.
- AINotesGeneratorPage: add subject dropdown populated based on selected education level/stream; block or warn if topic seems unrelated to education.
- Quick stats cards remain on homepage.

### Remove
- The `<section data-ocid="home.ai_notes.section">` hero banner block from HomePage.tsx.

## Implementation Plan
1. Remove the AI Notes Generator hero banner from `HomePage.tsx`.
2. Add a clean "Features" grid section to `HomePage.tsx` with cards for: AI Notes Generator, Study Notes Library, Career Guidance, Upload Notes, Mini Games.
3. In `AINotesGeneratorPage.tsx`, add a subject dropdown that is populated based on the selected education level + stream, using a curated Maharashtra syllabus subject map.
4. Prepopulate education level and stream in AINotesGeneratorPage from the student's saved profile.
5. Add validation that prevents generating notes for clearly off-topic inputs.
