# Epic 2: Translation Processing & Side-by-Side Comparison

**Epic Goal:**
Implement the core translation functionality using OpenAI integration with progress tracking, and deliver the side-by-side comparison view with synchronized scrolling. This enables users to translate their uploaded documents and view the original and translated text side-by-side for efficient review, validating the core value proposition of integrated translation and comparison.

## Story 2.1: Create Translation Model and Persistence Layer

As a developer,  
I want a translation data model that references documents and stores translated content,  
so that I can persist translations and associate them with their source documents.

**Acceptance Criteria:**
1. Translation SQLAlchemy model is created with fields: id, document_id (foreign key), target_language, translated_content (TEXT), status (pending/in_progress/completed/failed), progress_percentage, estimated_time_remaining, created_at, updated_at
2. Translation model has foreign key relationship to Document model
3. Alembic migration creates `translations` table in database with proper indexes
4. Basic CRUD operations are implemented (create, read by id, update status/progress)
5. Translation content is stored as TEXT in PostgreSQL
6. Model supports querying translations by document_id and target_language
7. Async database operations work correctly with AsyncSession
8. Model includes proper constraints (unique constraint on document_id + target_language if needed)

## Story 2.2: Implement OpenAI Translation Service Module

As a developer,  
I want a translation service module that integrates with OpenAI API and preserves original paragraph structure information,  
so that I can translate document content with quality optimization while maintaining alignment capabilities.

**Acceptance Criteria:**
1. `services.translation` package is created with modular structure
2. OpenAI API client is configured with proper authentication
3. Translation function accepts text content, source_language, and target_language
4. Translation includes chunking logic for long documents (split into manageable segments)
5. Translation preserves or tracks original paragraph boundaries for alignment purposes
6. Translation includes additional quality optimization logic beyond basic API calls
7. Service handles API errors and retries appropriately
8. Service implements API rate limit handling (respects rate limits, implements exponential backoff, handles 429 responses)
9. Service includes rate limit monitoring/logging to track API usage and prevent quota exhaustion
10. Service returns translated text with proper formatting preservation
11. Service maintains information about original paragraph structure to support side-by-side alignment
12. Service is designed to be extractable to separate microservice if needed
13. Translation service is testable with mocked OpenAI responses
14. Service supports offline development mode via USE_MOCK_OPENAI environment variable (returns deterministic mock translations for local testing without API costs or rate limits)
15. Mock mode is disabled in production/staging environments (enforced by environment check)

## Story 2.3: Implement Translation API Endpoint with Progress Tracking

As a user,  
I want to initiate translation through an API endpoint that tracks progress,  
so that I can translate my uploaded documents and monitor the translation status.

**Acceptance Criteria:**
1. POST `/translations/create` endpoint accepts document_id and target_language
2. Endpoint validates document exists and target_language is valid
3. Endpoint creates translation record with status "pending"
4. Translation processing happens asynchronously (background task or async processing)
5. Endpoint returns translation_id immediately (non-blocking)
6. GET `/translations/{translation_id}/status` endpoint returns current status, progress_percentage, and estimated_time_remaining
7. Status updates are persisted to database during translation
8. Translation status transitions: pending → in_progress → completed (or failed)
9. Error handling returns appropriate error responses for failures
10. API documentation in Swagger shows correct request/response schemas

## Story 2.4: Implement Translation Progress UI Component

As a user,  
I want to see translation progress with estimated time remaining,  
so that I know how long the translation will take for long documents.

**Acceptance Criteria:**
1. Progress component is created using Untitled UI components
2. Component displays progress percentage (progress bar or similar)
3. Component displays estimated time remaining (e.g., "Estimated time: 2 minutes remaining")
4. Component polls translation status endpoint at appropriate intervals
5. Component shows "Translating..." status message
6. Component transitions to comparison view when translation completes
7. Component handles error states with user-friendly error messages
8. Component integrates with TanStack Query for status polling
9. Component follows brand styling and accessibility requirements
10. Component does NOT show paragraph-by-paragraph progress (only overall progress and time estimate)

## Story 2.5: Create Side-by-Side Comparison View Layout

As a user,  
I want to view original and translated text side-by-side in two columns,  
so that I can compare the original and translation efficiently.

**Acceptance Criteria:**
1. Side-by-side layout component is created using Untitled UI components
2. Layout displays original text in left column (read-only)
3. Layout displays translated text in right column (read-only initially, editable in next story)
4. Both columns are scrollable independently
5. Layout is responsive and works on desktop/tablet (mobile optimization deferred)
6. Layout includes proper spacing and typography following brand guidelines
7. Component receives document content and translation content as props
8. Component handles loading states while fetching content
9. Component follows accessibility requirements (keyboard navigation, screen reader support)
10. Layout transforms from progress view when translation completes

## Story 2.6: Implement Synchronized Scrolling Between Columns

As a user,  
I want synchronized scrolling between original and translated text columns,  
so that corresponding paragraphs stay aligned while I scroll.

**Acceptance Criteria:**
1. Synchronized scrolling is implemented between left and right columns
2. Scrolling one column automatically scrolls the other to keep paragraphs aligned
3. Paragraph alignment is based on original document's paragraph boundaries (original text structure dictates alignment)
4. Even if translated text has different paragraph breaks (e.g., 3 \n in translation vs. 1 in original), alignment follows original paragraph structure
5. Scrolling performance is smooth (60fps) even for long documents (up to 100 pages)
6. Synchronization works in both directions (scrolling left affects right, scrolling right affects left)
7. Scrolling handles edge cases (beginning/end of document, different content lengths, translation paragraph breaks that don't match original)
8. Performance is optimized for documents up to 100 pages
9. Scrolling does not cause layout shifts or visual glitches

## Story 2.7: Add Paragraph Markers for Navigation

As a user,  
I want paragraph markers in the side-by-side view based on the original document structure,  
so that I can navigate between paragraphs and see alignment between original and translated text.

**Acceptance Criteria:**
1. Paragraph markers are based on the original document's paragraph structure (original text dictates marker placement)
2. Markers are displayed in both columns, but alignment follows original paragraph boundaries
3. If translation splits a single original paragraph into multiple paragraphs (e.g., 3 \n in translation), they still align to the single original paragraph marker
4. Markers indicate paragraph boundaries clearly based on original structure
5. Markers help users identify corresponding content between columns, even when translation has different paragraph breaks
6. Markers are visually distinct but not intrusive
7. Markers are accessible (visible to screen readers, keyboard navigable)
8. Markers work with synchronized scrolling (scrolling aligns to original paragraph boundaries)
9. Markers are styled consistently with brand guidelines
10. Markers handle edge cases (single paragraph documents, very long paragraphs, mismatched paragraph breaks between original and translation)

**Note:** The original document's paragraph structure is the source of truth for alignment. Translation paragraph breaks may differ, but markers and scrolling alignment follow the original structure.

---
