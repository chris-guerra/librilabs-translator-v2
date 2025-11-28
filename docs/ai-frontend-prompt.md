# AI Frontend Generation Prompt for Librilabs Translator

**Generated:** 2025-01-27  
**Author:** Sally (UX Expert)  
**Purpose:** Master prompt for generating the Librilabs Translator frontend application using AI-driven tools (v0, Lovable.ai, etc.)

---

## Preamble: Project Context & Tech Stack

**Project Overview:** Librilabs Translator is a document translation web application that combines AI-powered translation with an integrated human review workflow. The MVP focuses on TXT file translation with side-by-side comparison, in-place editing, and progress saving—specifically designed for individual academics, researchers, and writers translating longform documents.

**Core Workflow:** Upload → Translate → Compare → Edit → Download

**Technology Stack (MANDATORY):**
- **Framework:** Next.js 16.0.4 (upgrade from current 14.2.5)
- **React:** React 19
- **Language:** TypeScript (latest stable)
- **UI Component Library:** Untitled UI (exclusively - NO custom components)
- **CSS Framework:** Tailwind CSS (latest)
- **State Management (Server):** TanStack Query (latest) for API data caching, loading/error states, retries
- **State Management (UI):** React useState/useReducer or Zustand for local/UI state
- **Form Handling:** React Hook Form (latest)
- **API Client:** Native `fetch` API with TanStack Query
- **Build Tool:** Next.js built-in (16.0.4)

**Repository Structure:** Monorepo with `frontend/` directory containing the Next.js application. The frontend is independent and can be moved separately if needed.

**Backend API:** FastAPI backend with RESTful endpoints. All API endpoints use `/api/v1/` prefix. Base API URL should be configurable via environment variable (e.g., `NEXT_PUBLIC_API_URL`).

---

## Visual Design Specifications

**Design System:** Untitled UI components exclusively. All UI components must use Untitled UI - no custom components allowed. Customize only through Tailwind CSS configuration (colors, typography).

**Color Palette:**
- **Primary Accent:** Orange (#F97316) - used for primary buttons, progress bars, focus states
- **Success:** Green (#16A34A) - used for success states, saved indicators
- **Error:** Red (#DC2626) - used for error messages, validation failures
- **Primary Text:** #111827 (dark gray) - main text content
- **Secondary Text:** #6B7280 (medium gray) - secondary text, labels
- **Primary Background:** #FFFFFF (white) - main background
- **Secondary Background:** #F4F5F7 (light gray) - upload areas, subtle backgrounds
- **Sidebar Background:** #F7F8FA (very light gray) - left column in comparison view
- **Light Border:** #E5E7EB - borders, dividers
- **Orange Soft:** #FFF7ED - hover states, active backgrounds
- **Blue Soft:** #EEF2FF - interactive hover states
- **Error Background:** #FEE2E2 - error message backgrounds

**Typography:**
- **Font Family:** System font stack (-apple-system, BlinkMacSystemFont, system-ui, Segoe UI, sans-serif)
- **Font Sizes:** xs (12px), sm (13px), md (14px - base), lg (16px), xl (20px), display (24px)
- **Font Weights:** regular (400), medium (500), semibold (600), bold (700)
- **Document Text:** 16px (lg), regular (400), line-height 1.6, #111827 color

**Brand Identity:**
- **Logo:** "Librilabs" text logo (18px, semibold/600, #111827)
- **Brand Color:** Orange (#F97316) as primary accent
- **Tone:** Professional, clean, document-focused

**Visual Style:**
- **Aesthetic:** Minimalist, clean, document-first experience
- **Spacing:** Use Untitled UI spacing scale (maintain consistency)
- **Border Radius:** 4px for small elements, 6px for buttons, 8px for containers
- **Shadows:** Minimal - use sparingly, subtle elevation only
- **Focus States:** 2px solid orange (#F97316) border with 2px outline-offset

**Responsive Design:**
- **Primary Target:** Desktop (Windows, macOS, Linux)
- **Secondary Target:** Tablet (iPad, Android tablets) - responsive web interface
- **Mobile:** Deferred to post-MVP, but design should consider mobile constraints

---

## High-Level Goal

Create a complete Next.js 16.0.4 frontend application for Librilabs Translator that implements a linear, workflow-driven translation interface. The application must support: (1) file upload with drag-and-drop, (2) language selection, (3) real-time translation progress tracking, (4) side-by-side comparison view with synchronized scrolling, (5) in-place editing with auto-save, and (6) document download. The interface must use Untitled UI components exclusively, follow the specified design system, and integrate with a FastAPI backend via RESTful APIs using TanStack Query for state management.

---

## Detailed, Step-by-Step Instructions

### Phase 1: Project Setup & Configuration

1. **Upgrade Next.js and React:**
   - Upgrade Next.js from 14.2.5 to 16.0.4
   - Upgrade React from 18.3.1 to React 19
   - Update all dependencies to compatible versions
   - Ensure TypeScript configuration is updated for React 19

2. **Install Required Dependencies:**
   - Install Untitled UI component library (latest version)
   - Install TanStack Query (latest): `@tanstack/react-query`
   - Install React Hook Form (latest): `react-hook-form`
   - Install Tailwind CSS (latest) if not already installed
   - Configure Tailwind CSS with brand colors and typography

3. **Configure Tailwind CSS:**
   - Update `tailwind.config.js` to include brand color palette
   - Configure typography to use system font stack
   - Ensure Untitled UI components work with Tailwind configuration
   - Set up custom colors: orange (#F97316), success (#16A34A), error (#DC2626), etc.

4. **Set Up TanStack Query:**
   - Create `lib/query-client.ts` with QueryClient configuration
   - Set up QueryClientProvider in root layout
   - Configure default options: retry logic, staleTime, cacheTime
   - Set up error handling for API calls

5. **Create API Client:**
   - Create `lib/api-client.ts` using native `fetch` API
   - Configure base URL from environment variable `NEXT_PUBLIC_API_URL`
   - Set up request/response interceptors for error handling
   - Create typed API functions for each endpoint (upload, translate, get progress, save edits, download)

6. **Set Up Environment Variables:**
   - Create `.env.local` with `NEXT_PUBLIC_API_URL` (default to `http://localhost:8000` for development)
   - Document environment variable requirements

### Phase 2: Core Layout & Navigation

7. **Create Persistent Header Component:**
   - Create `components/Header.tsx` using Untitled UI components
   - Left side: "Librilabs" text logo (18px, semibold, #111827)
   - Right side: Conditional buttons based on workflow state
     - Comparison view: "Download" button and "Start New Translation" button
     - Other views: No action buttons (or minimal)
   - Height: 64px, padding: 16px horizontal
   - Background: #FFFFFF, border-bottom: 1px solid #E5E7EB
   - Use Untitled UI Button components exclusively

8. **Create State Indicator Component:**
   - Create `components/StateIndicator.tsx`
   - Display current workflow step: "Step 1 of 3: Upload Document", "Step 2 of 3: Translating...", "Step 3 of 3: Review & Edit"
   - Position: 16px below header, centered horizontally
   - Font: 14px (md), regular (400), #6B7280 color
   - Margin-bottom: 24px

9. **Create Root Layout:**
   - Update `app/layout.tsx` to include Header component (persistent across all pages)
   - Set up QueryClientProvider wrapper
   - Configure global styles (Tailwind CSS)
   - Ensure proper TypeScript types

### Phase 3: Upload Screen Implementation

10. **Create Upload Screen Page:**
    - Create `app/page.tsx` (or `app/upload/page.tsx` if using routing)
    - Include StateIndicator showing "Step 1 of 3: Upload Document"
    - Center content with max-width: 600px

11. **Create File Upload Component:**
    - Create `components/FileUpload.tsx` using Untitled UI File Input/Dropzone component
    - Support drag-and-drop and click-to-upload
    - Visual specifications:
      - Max-width: 600px, centered
      - Height: 300px (min-height)
      - Border: 2px dashed #E5E7EB
      - Border-radius: 8px
      - Background: #F4F5F7
      - Padding: 48px
    - Hover state: Border #F97316, background #FFF7ED
    - Drag-over state: Solid border, background #FFF7ED
    - Text: "Drag and drop your .txt file here" or "Click to upload"
    - Secondary text: "Supported: .txt files up to 10MB"
    - Validate file format (.txt only) and size (10MB max)
    - Show error messages below upload area if validation fails
    - Display selected file name and size after successful upload
    - Use React Hook Form for form state management

12. **Create Language Selection Component:**
    - Create `components/LanguageSelector.tsx` using Untitled UI Select components
    - Two dropdowns side-by-side: "Source Language" and "Target Language"
    - Supported languages: English, Spanish, French (hardcoded for MVP)
    - Layout: Equal width (48% each), 4% gap between, max-width 600px, centered
    - Validation: Disable "Translate" button if same language selected
    - Show error message below dropdowns if same language selected
    - Use React Hook Form for form state

13. **Create Translate Button:**
    - Use Untitled UI Button component (primary variant)
    - Width: 200px, height: 44px
    - Background: #F97316 (orange accent)
    - Text color: #FFFFFF
    - Border-radius: 6px
    - Font: 16px (lg), semibold (600)
    - Disabled state: Background #E5E7EB, text #9CA3AF, cursor not-allowed
    - Disabled until: File uploaded AND both languages selected AND languages are different
    - Position: Centered below language selection, 32px margin-top

14. **Implement Upload Workflow:**
    - On "Translate" button click:
      - Validate file and languages
      - Call API endpoint: `POST /api/v1/documents` with file content and metadata
      - On success: Transition to progress screen (automatic, no manual "Next" button)
      - On error: Show error message with retry option
    - Use TanStack Query mutation for file upload
    - Handle loading states during upload

### Phase 4: Translation Progress Screen

15. **Create Progress Screen:**
    - Create `app/progress/[translationId]/page.tsx` (or use state-based routing)
    - Include StateIndicator showing "Step 2 of 3: Translating..."
    - Center content vertically and horizontally

16. **Create Progress Display Component:**
    - Create `components/TranslationProgress.tsx` using Untitled UI Progress component
    - Visual specifications:
      - Max-width: 600px, centered
      - Padding: 32px
      - Percentage display: 48px font size (display), semibold (600), #111827, centered, 24px margin-bottom
      - Progress bar: 8px height, 100% width, #E5E7EB background, #F97316 fill, 4px border-radius, 16px margin-bottom
      - Status message: 16px (lg), regular (400), #6B7280, centered, 16px margin-top
    - Animate progress bar fill smoothly (300ms ease-out transition)
    - Add pulse animation on progress bar fill (opacity 0.8-1.0, 1.5s duration, infinite loop)
    - Poll API endpoint: `GET /api/v1/translations/{translationId}/progress` every 2-3 seconds
    - Use TanStack Query with polling enabled
    - Auto-transition to comparison view when progress reaches 100%

17. **Implement Progress Polling:**
    - Use TanStack Query `useQuery` with `refetchInterval: 2000` (2 seconds)
    - Handle loading and error states
    - Update progress percentage and progress bar in real-time
    - Detect completion (progress = 100%) and automatically navigate to comparison view

### Phase 5: Side-by-Side Comparison View

18. **Create Comparison View Page:**
    - Create `app/comparison/[translationId]/page.tsx`
    - Include StateIndicator showing "Step 3 of 3: Review & Edit"
    - Header should show "Download" button and "Start New Translation" button

19. **Create Save Status Indicator:**
    - Create `components/SaveStatusIndicator.tsx`
    - Position: In header, between logo and action buttons
    - States:
      - Default: Hidden
      - Saving: "Saving..." with spinner icon, #6B7280 color, fade in 200ms
      - Saved: "Saved" with checkmark icon, #16A34A color, visible 2 seconds then fade out
      - Error: "Save failed" with error icon, #DC2626 color, remains visible
    - Use Untitled UI icons and components

20. **Create Side-by-Side Layout:**
    - Create `components/ComparisonView.tsx`
    - Two-column layout using Flexbox (flex, row direction)
    - Max-width: 1400px, centered
    - Gap: 0px (columns touch at divider)
    - Equal width columns (50/50 split)

21. **Create Original Text Column:**
    - Left column component: `components/OriginalTextColumn.tsx`
    - Width: 50% (flex: 1)
    - Background: #F7F8FA (sidebar background)
    - Border-right: 1px solid #E5E7EB
    - Header: "Original Text" with source language label (e.g., "(English)")
    - Header styling: 16px (lg), semibold (600), #111827, 12px padding-top, 8px padding-bottom, 24px horizontal padding
    - Content area: 24px horizontal padding, 16px vertical padding
    - Text: 16px (lg), regular (400), #111827, line-height 1.6
    - Scrollable: Yes, independent scroll
    - Read-only: Display only, no editing

22. **Create Translated Text Column (Editable):**
    - Right column component: `components/TranslatedTextColumn.tsx`
    - Width: 50% (flex: 1)
    - Background: #FFFFFF
    - Header: "Translated Text" with target language label (e.g., "(Spanish)")
    - Header styling: Same as original text column
    - Content area: Editable text area
    - Use `contenteditable` div or textarea (plain text editing, no markdown rendering)
    - Text: 16px (lg), regular (400), #111827, line-height 1.6
    - Focus state: 2px solid #F97316 border, 4px border-radius, outline: none
    - Scrollable: Yes, synchronized with left column

23. **Implement Paragraph Markers:**
    - Add visual paragraph boundaries in both columns
    - Use 2px height horizontal divider lines
    - Color: #E5E7EB
    - Margin: 16px top, 8px bottom
    - Full width within column
    - Parse document content by paragraphs (split by double newlines or paragraph breaks)

24. **Implement Synchronized Scrolling:**
    - Add scroll event listeners to both columns
    - When one column scrolls, calculate scroll percentage
    - Apply same scroll percentage to other column
    - Use `scrollTop` and `scrollHeight` for percentage calculation
    - Throttle scroll events to 60fps (16ms intervals) for performance
    - Use CSS `scroll-behavior: smooth` for smooth scrolling
    - Maintain paragraph alignment (align by paragraph boundaries, not exact pixel position)

25. **Implement In-Place Editing:**
    - Make translated text column editable (contenteditable div or textarea)
    - Track changes using React state
    - Implement debounce: Save after 2-3 seconds of user inactivity (no typing)
    - Show "Saving..." indicator when save is triggered
    - Call API endpoint: `PATCH /api/v1/translations/{translationId}` with updated content
    - Use TanStack Query mutation for save operation
    - Handle save success: Show "Saved" indicator for 2 seconds
    - Handle save error: Show error indicator, auto-retry with exponential backoff
    - Persist edited content across browser sessions (load from API on page load)

26. **Implement Download Functionality:**
    - Create download handler in Header component or separate component
    - Call API endpoint: `GET /api/v1/translations/{translationId}/download`
    - Trigger browser download of TXT file
    - File name: Original filename with "_translated" suffix (e.g., "document_translated.txt")
    - After download, user remains in comparison view to continue editing if needed

27. **Implement "Start New Translation" Button:**
    - Clear current document and translation state
    - Navigate back to upload screen (root page)
    - Reset all form fields and state

### Phase 6: Error Handling & Edge Cases

28. **Create Error Components:**
    - Create `components/ErrorMessage.tsx` using Untitled UI Alert/Error components
    - Support inline errors (below form fields) and full-screen errors
    - Inline error styling:
      - Font: 13px (sm), regular (400), #DC2626
      - Icon: 16px warning icon, #DC2626, 4px margin-right
      - Background: #FEE2E2, 8px padding, 4px border-radius
      - Margin-top: 8px
    - Full-screen error styling:
      - Centered, max-width 600px, padding 48px
      - Icon: 48px, #DC2626, centered, 24px margin-bottom
      - Title: 20px (xl), semibold (600), #111827, centered, 16px margin-bottom
      - Message: 16px (lg), regular (400), #6B7280, centered, 24px margin-bottom
      - Button: Primary action button, centered, 200px width

29. **Implement Error States:**
    - Upload errors: Invalid format, file too large, network failure
    - Translation errors: API failure, timeout, processing error
    - Save errors: Network failure, save conflict
    - All errors show clear messages and recovery paths (retry buttons)
    - Use TanStack Query error handling for API errors

30. **Implement Resume Functionality (Post-MVP Enhancement Note):**
    - Detect incomplete translations on page load
    - Show resume UI with progress and preview
    - Allow user to resume or start new translation
    - Note: This is a post-MVP feature, but architecture should support it

### Phase 7: Animations & Micro-Interactions

31. **Implement Progress Bar Animation:**
    - Smooth fill animation: 300ms ease-out transition
    - Use CSS `transform: scaleX()` for better performance (hardware acceleration)
    - Pulse animation: opacity 0.8-1.0, 1.5s duration, infinite loop

32. **Implement Auto-Save Indicator Animation:**
    - Fade in: 200ms ease-out
    - Fade out: 200ms ease-in (after 2 seconds for "Saved" state)
    - Spinner rotation: 360 degrees, 1s duration, linear, infinite

33. **Implement File Upload Interactions:**
    - Drag-and-drop hover: 150ms ease-out transition
    - Border color: #E5E7EB → #F97316
    - Background: #F4F5F7 → #FFF7ED
    - Border style: dashed → solid

34. **Implement Button Interactions:**
    - Primary button hover: 150ms ease-out
    - Background: #F97316 → #EA580C
    - Transform: translateY(-1px) (subtle lift)
    - Active state: translateY(0px), background #C2410C

35. **Implement Page Transitions:**
    - Upload → Progress: 300ms ease-in-out, opacity fade, translateY(-10px)
    - Progress → Comparison: 400ms ease-out, opacity fade, scale(0.98→1.0)

36. **Respect Reduced Motion:**
    - Use CSS `@media (prefers-reduced-motion: reduce)` to disable animations
    - Ensure functionality works without animations

### Phase 8: Accessibility & Performance

37. **Implement Accessibility Features:**
    - Keyboard navigation: Tab through all interactive elements
    - Screen reader support: ARIA labels, roles, descriptions
    - Focus indicators: 2px solid #F97316 border with 2px outline-offset
    - Color contrast: Ensure 4.5:1 ratio for text (WCAG AA compliance)
    - Error announcements: Use ARIA live regions for error messages
    - Form labels: Proper label associations for all form inputs

38. **Optimize Performance:**
    - Lazy load components where appropriate
    - Optimize scroll performance: Throttle to 60fps, use CSS transforms
    - Virtual scrolling: Consider for very long documents (100+ pages) if performance issues arise
    - Code splitting: Use Next.js dynamic imports for heavy components
    - Image optimization: N/A for MVP (no images)

39. **Implement Loading States:**
    - Use TanStack Query loading states
    - Show skeleton loaders or spinners during data fetching
    - Use Untitled UI loading components

### Phase 9: Testing & Validation

40. **Set Up Testing Infrastructure:**
    - Install Vitest for unit testing
    - Install React Testing Library for component testing
    - Install Playwright for E2E testing
    - Create test utilities and helpers

41. **Write Critical Tests:**
    - E2E test: Full workflow (upload → translate → edit → download)
    - Unit tests: File validation, language validation, auto-save debounce
    - Integration tests: API client, TanStack Query mutations/queries
    - Component tests: Key components (FileUpload, LanguageSelector, ComparisonView)

---

## Code Examples, Data Structures & Constraints

### API Endpoints (Backend Contract)

```typescript
// Document upload
POST /api/v1/documents
Body: { file: File, file_name: string }
Response: { document_id: string, file_name: string, content: string }

// Start translation
POST /api/v1/translations
Body: { document_id: string, source_language: string, target_language: string }
Response: { translation_id: string, status: string, progress: number }

// Get translation progress
GET /api/v1/translations/{translationId}/progress
Response: { translation_id: string, status: string, progress: number, translated_content?: string }

// Save translation edits
PATCH /api/v1/translations/{translationId}
Body: { translated_content: string }
Response: { translation_id: string, status: string }

// Download translated document
GET /api/v1/translations/{translationId}/download
Response: File download (TXT file)
```

### TypeScript Types

```typescript
// Document types
interface Document {
  id: string;
  file_name: string;
  content: string;
  created_at: string;
}

// Translation types
interface Translation {
  id: string;
  document_id: string;
  source_language: string;
  target_language: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  original_content: string;
  translated_content: string;
  created_at: string;
  updated_at: string;
}

// API response types
interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Language type
type Language = 'en' | 'es' | 'fr';
```

### TanStack Query Configuration Example

```typescript
// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### Auto-Save Debounce Implementation

```typescript
// Use this pattern for auto-save debounce
import { useEffect, useRef } from 'react';

function useAutoSave(content: string, saveFn: (content: string) => Promise<void>) {
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      saveFn(content);
    }, 2500); // 2.5 second debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [content, saveFn]);
}
```

### Synchronized Scrolling Implementation

```typescript
// Use this pattern for synchronized scrolling
import { useRef, useEffect } from 'react';

function useSynchronizedScroll(
  leftColumnRef: React.RefObject<HTMLDivElement>,
  rightColumnRef: React.RefObject<HTMLDivElement>
) {
  const isScrolling = useRef(false);

  useEffect(() => {
    const leftColumn = leftColumnRef.current;
    const rightColumn = rightColumnRef.current;

    if (!leftColumn || !rightColumn) return;

    const handleScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
      if (isScrolling.current) return;
      isScrolling.current = true;

      const scrollPercentage = source.scrollTop / (source.scrollHeight - source.clientHeight);
      const targetScrollTop = scrollPercentage * (target.scrollHeight - target.clientHeight);

      target.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      });

      requestAnimationFrame(() => {
        isScrolling.current = false;
      });
    };

    leftColumn.addEventListener('scroll', () => handleScroll(leftColumn, rightColumn));
    rightColumn.addEventListener('scroll', () => handleScroll(rightColumn, leftColumn));

    return () => {
      leftColumn.removeEventListener('scroll', () => handleScroll(leftColumn, rightColumn));
      rightColumn.removeEventListener('scroll', () => handleScroll(rightColumn, leftColumn));
    };
  }, [leftColumnRef, rightColumnRef]);
}
```

### Constraints & Requirements

**MANDATORY Constraints:**
1. **Untitled UI Only:** Use Untitled UI components exclusively. NO custom components unless absolutely necessary (and must be approved).
2. **No Markdown Rendering:** Translated text is plain text only. No markdown, HTML, or rich text rendering in MVP.
3. **Mobile-First Consideration:** Design should consider mobile constraints, but mobile optimization is deferred to post-MVP.
4. **Accessibility:** WCAG AA compliance is non-negotiable. All components must be keyboard accessible and screen reader compatible.
5. **Performance:** Side-by-side view must handle 100-page documents smoothly (60fps scrolling).
6. **Error Handling:** All API calls must have error handling with user-friendly error messages.
7. **Type Safety:** Use TypeScript strictly. No `any` types unless absolutely necessary.
8. **State Management:** Use TanStack Query for all server state. Use React state/Zustand only for UI state.
9. **Form Handling:** Use React Hook Form for all forms (file upload, language selection).
10. **No Backend Logic:** All business logic should be in backend. Frontend is presentation layer only.

**What NOT to Do:**
- ❌ Do NOT create custom UI components (use Untitled UI only)
- ❌ Do NOT implement authentication (post-MVP feature)
- ❌ Do NOT implement document history/list view (post-MVP feature)
- ❌ Do NOT implement markdown rendering (plain text only)
- ❌ Do NOT implement mobile-specific optimizations (deferred to post-MVP)
- ❌ Do NOT use state management libraries other than TanStack Query and React state/Zustand
- ❌ Do NOT hardcode API URLs (use environment variables)
- ❌ Do NOT skip error handling for any API calls
- ❌ Do NOT implement cancel translation functionality (users must wait for completion)
- ❌ Do NOT implement browser back/forward navigation between workflow states

---

## Define a Strict Scope

### Files to Create/Modify

**Core Application Files:**
- `app/layout.tsx` - Root layout with Header, QueryClientProvider
- `app/page.tsx` - Upload screen (or `app/upload/page.tsx`)
- `app/progress/[translationId]/page.tsx` - Progress screen
- `app/comparison/[translationId]/page.tsx` - Comparison view

**Component Files:**
- `components/Header.tsx` - Persistent header
- `components/StateIndicator.tsx` - Workflow step indicator
- `components/FileUpload.tsx` - File upload with drag-and-drop
- `components/LanguageSelector.tsx` - Language selection dropdowns
- `components/TranslationProgress.tsx` - Progress bar and status
- `components/ComparisonView.tsx` - Side-by-side layout container
- `components/OriginalTextColumn.tsx` - Left column (read-only)
- `components/TranslatedTextColumn.tsx` - Right column (editable)
- `components/SaveStatusIndicator.tsx` - Auto-save status
- `components/ErrorMessage.tsx` - Error display component

**Library/Utility Files:**
- `lib/query-client.ts` - TanStack Query configuration
- `lib/api-client.ts` - API client with fetch
- `lib/types.ts` - TypeScript type definitions
- `lib/hooks/useAutoSave.ts` - Auto-save hook
- `lib/hooks/useSynchronizedScroll.ts` - Synchronized scrolling hook

**Configuration Files:**
- `tailwind.config.js` - Tailwind configuration with brand colors
- `next.config.js` - Next.js configuration (update if needed)
- `tsconfig.json` - TypeScript configuration (update for React 19)
- `.env.local` - Environment variables (create if needed)

**Test Files (Optional but Recommended):**
- `__tests__/` - Unit and integration tests
- `e2e/` - Playwright E2E tests

### Files to Leave Untouched

- `backend/` directory - Backend is separate and should not be modified
- `docs/` directory - Documentation should not be modified
- `.bmad-core/` directory - BMad framework files should not be modified
- `README.md` - Only update if architecture changes significantly
- `package.json` (root) - Only update if monorepo configuration changes

### Scope Boundaries

**In Scope:**
- ✅ Complete frontend implementation for MVP workflow
- ✅ All three main screens (Upload, Progress, Comparison)
- ✅ File upload with validation
- ✅ Language selection
- ✅ Translation progress tracking
- ✅ Side-by-side comparison with synchronized scrolling
- ✅ In-place editing with auto-save
- ✅ Document download
- ✅ Error handling and recovery
- ✅ Responsive design (desktop and tablet)
- ✅ Accessibility (WCAG AA)
- ✅ Animations and micro-interactions

**Out of Scope (Post-MVP):**
- ❌ User authentication
- ❌ Document history/list view
- ❌ Multiple document management
- ❌ Mobile-specific optimizations
- ❌ Markdown rendering
- ❌ Rich text editing
- ❌ Translation cancellation
- ❌ Browser back/forward navigation
- ❌ Deep linking to specific documents
- ❌ Resume interrupted translations (architecture supports it, but UI deferred)

---

## Prompt Usage Instructions

**For AI Tools (v0, Lovable.ai, etc.):**

1. **Start with Preamble:** Copy the entire preamble section to provide project context and tech stack.

2. **Iterative Generation:** Do NOT attempt to generate the entire application in one prompt. Instead:
   - **First Prompt:** Generate project setup, configuration, and core layout (Phases 1-2)
   - **Second Prompt:** Generate upload screen and file handling (Phase 3)
   - **Third Prompt:** Generate progress screen (Phase 4)
   - **Fourth Prompt:** Generate comparison view with synchronized scrolling (Phase 5)
   - **Fifth Prompt:** Generate error handling, animations, and polish (Phases 6-7)
   - **Sixth Prompt:** Generate accessibility, performance, and testing (Phases 8-9)

3. **Reference This Document:** For each prompt, reference the relevant phase instructions and include the code examples and constraints from this document.

4. **Validate Output:** After each generation phase, validate that:
   - Untitled UI components are used exclusively
   - TypeScript types are correct
   - API integration matches the contract
   - Design specifications are followed
   - Accessibility requirements are met

5. **Iterate and Refine:** Use follow-up prompts to refine components, fix issues, and add missing features.

**Example First Prompt for v0/Lovable:**
```
[Copy Preamble section]

[Copy Phase 1-2 instructions]

Generate the project setup, configuration files, root layout, and persistent header component for Librilabs Translator. Use Next.js 16.0.4, React 19, TypeScript, Untitled UI components, and Tailwind CSS. Follow the design specifications exactly.
```

**Example Second Prompt:**
```
[Reference this document]

Generate the upload screen with file upload component (drag-and-drop), language selection, and translate button. Use Untitled UI components exclusively. Follow the visual specifications for the upload screen from the design system.
```

---

## Important Notes

⚠️ **CRITICAL:** All AI-generated code will require careful human review, testing, and refinement to be considered production-ready. This prompt provides a comprehensive foundation, but:

1. **Code Quality:** Review all generated code for best practices, performance, and security
2. **Testing:** Write and run comprehensive tests (unit, integration, E2E)
3. **Accessibility Audit:** Test with screen readers and keyboard navigation
4. **Performance Testing:** Test with large documents (100+ pages) to ensure smooth scrolling
5. **Browser Testing:** Test across all target browsers (Chrome, Firefox, Safari, Edge)
6. **API Integration:** Verify all API endpoints match the backend implementation
7. **Error Scenarios:** Test all error states and recovery paths
8. **User Testing:** Conduct user testing with target personas (academics, researchers, writers)

**Remember:** This is a comprehensive prompt, but AI tools work best when you iterate. Generate components incrementally, test frequently, and refine based on results.

---

**End of Prompt**

