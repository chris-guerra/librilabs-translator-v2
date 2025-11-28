# Epic 3: Editing, Progress Saving & Export

**Epic Goal:**
Implement in-place editing capabilities with auto-save, progress saving and resume functionality for long documents, and download/export capability. This enables users to edit translations directly in the comparison view, save their progress for long documents, and export the final translated text, completing the core MVP workflow and delivering the full integrated review experience.

## Story 3.1: Implement In-Place Editing in Comparison View

As a user,  
I want to edit translated text directly in the side-by-side comparison view,  
so that I can make corrections and refinements without switching to external tools.

**Acceptance Criteria:**
1. Translated text column in comparison view becomes editable (original text remains read-only)
2. Editing uses plain text editing (no markdown rendering in MVP)
3. Users can click on translated text to edit it directly in place
4. Editing preserves paragraph alignment with original text (editing doesn't break alignment)
5. Edited content is visually distinct (e.g., shows as modified/unsaved)
6. Editing works smoothly with synchronized scrolling
7. Component uses Untitled UI editable components or textarea/input components
8. Editing follows brand styling and accessibility requirements
9. Keyboard navigation works correctly in edit mode
10. Editing handles edge cases (very long paragraphs, special characters, line breaks)

## Story 3.2: Implement Auto-Save for Edited Translations

As a user,  
I want my edits to be automatically saved,  
so that I don't lose my work and don't need to manually save changes.

**Acceptance Criteria:**
1. Auto-save functionality saves edited translation content automatically
2. Auto-save triggers after a debounce period (e.g., 2-3 seconds after user stops typing)
3. Auto-save updates translation record in database via API endpoint
4. Visual indicator shows save status (saving, saved, error)
5. Auto-save works reliably without disrupting user editing experience
6. Failed saves are retried automatically with user notification if retries fail
7. Auto-save integrates with TanStack Query for API calls
8. Save status indicator is unobtrusive but visible
9. Auto-save handles network errors gracefully
10. Edited content persists across page refreshes (if user navigates away and returns)

## Story 3.3: Implement Translation Progress Saving

As a user,  
I want to save translation progress for long documents,  
so that I can pause and resume translation work on lengthy content.

**Acceptance Criteria:**
1. Translation progress is saved automatically during translation processing
2. Progress includes: current chunk/segment being translated, percentage complete, translated content so far
3. Progress is persisted to database (stored in translation record or separate progress table)
4. Progress saving happens incrementally (not just at completion)
5. Progress saving has <1 second save/load time as per NFR
6. Progress data is stored efficiently (JSON field or normalized structure)
7. Progress saving works reliably for documents up to 100 pages
8. Progress is associated with specific document_id and target_language combination
9. Progress can be queried and retrieved via API endpoint

## Story 3.4: Implement Translation Resume Functionality

As a user,  
I want to resume an interrupted translation,  
so that I can continue translating long documents from where I left off.

**Acceptance Criteria:**
1. Resume functionality detects incomplete translations (status: in_progress or failed)
2. Resume endpoint accepts translation_id and continues from saved progress
3. Resume functionality loads saved progress (translated content, current position)
4. Translation continues from last saved chunk/segment
5. Resume works correctly even if translation was interrupted mid-chunk
6. Resume functionality has 90%+ success rate for documents >10 pages (per NFR)
7. Resume handles edge cases (corrupted progress, missing chunks, network interruptions)
8. User can manually trigger resume via UI (e.g., "Resume Translation" button)
9. Resume status is clearly communicated to user
10. Resume functionality integrates with translation progress UI

## Story 3.5: Create Download/Export API Endpoint

As a user,  
I want to download my translated document as a TXT file,  
so that I can use the final translation outside the application.

**Acceptance Criteria:**
1. GET `/translations/{translation_id}/download` endpoint returns translated content as TXT file
2. Endpoint validates translation exists and is completed
3. Endpoint returns file with appropriate Content-Type header (text/plain)
4. Endpoint returns file with appropriate Content-Disposition header (filename)
5. Filename is derived from original document name (e.g., "document_translated.txt")
6. Endpoint handles error cases (translation not found, translation incomplete)
7. Endpoint returns appropriate HTTP status codes
8. Translated content includes all user edits (final edited version, not just raw translation)
9. API documentation in Swagger shows correct response schema

## Story 3.6: Implement Download/Export UI Component

As a user,  
I want to download my translated document through the web interface,  
so that I can easily export the final translation.

**Acceptance Criteria:**
1. Download button/component is created using Untitled UI components
2. Component is integrated into comparison view (header/toolbar area)
3. Component triggers download API call when clicked
4. Component shows download state (downloading, complete, error)
5. Component handles file download in browser (triggers browser download)
6. Component displays user-friendly error messages if download fails
7. Component is accessible (keyboard navigable, screen reader support)
8. Component follows brand styling
9. Component is visible and accessible from comparison view
10. After download, user remains in comparison view (can continue editing if needed)

## Story 3.7: Implement Progress Saving for Edited Content

As a user,  
I want my editing progress to be saved,  
so that I can resume editing long documents even if I close the browser.

**Acceptance Criteria:**
1. Edited translation content is saved to database (updates translation record)
2. Save includes full edited content, not just changes/diffs
3. Edited content persists across browser sessions (if user closes and reopens)
4. Resume editing loads last saved edited content
5. Progress saving for edits works in conjunction with translation progress saving
6. Edited content is stored efficiently in database
7. Save/load operations have acceptable performance (<1 second as per NFR)
8. Edited content is associated with specific translation_id
9. System distinguishes between raw translation and edited translation
10. User can see when content was last saved

---
