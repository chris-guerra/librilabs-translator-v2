# User Interface Design Goals

## Overall UX Vision

The interface prioritizes simplicity and workflow integration. The goal is a focused, document-first experience that eliminates tool switching. The UI guides users through: upload → translate → compare → edit → download, with clear progress indicators and minimal cognitive load. Visual design should be clean and uncluttered, emphasizing the side-by-side comparison view as the core interaction. The experience should feel fast and responsive, even for long documents, with clear feedback during translation processing.

## Key Interaction Paradigms

1. **Side-by-Side Comparison with Synchronized Scrolling:** The primary interaction mode displays original and translated text in two columns with synchronized scrolling, keeping paragraphs aligned for efficient comparison.

2. **In-Place Editing:** Users edit translated text directly in the comparison view with auto-save, eliminating export/import cycles.

3. **Progressive Disclosure:** The interface reveals features as needed—upload interface first, then translation progress, then comparison view—avoiding overwhelming users upfront.

4. **Context Preservation:** The interface maintains document context throughout the workflow, with clear navigation and progress indicators so users always know where they are.

5. **Responsive Feedback:** All user actions (upload, translation start, editing, save) provide immediate visual feedback to confirm the system is working.

## Core Screens and Views

1. **Upload Screen:** File upload interface with drag-and-drop support, file format validation feedback, and language selection (source and target dropdowns). Includes file size and format guidance. Authenticated users land directly on this screen.

2. **Translation Progress Screen:** Real-time progress indicator showing estimated time remaining (e.g., "Estimated time: 2 minutes remaining") with a progress bar or percentage indicator. No paragraph-by-paragraph status—focus on overall progress and time estimate. Allows users to see progress for long documents.

3. **Side-by-Side Comparison/Edit View:** Primary working interface with original text (left, read-only) and translated text (right, editable) in synchronized columns. Includes paragraph markers, scroll synchronization, and editing controls. Transforms from progress view when translation completes. After download, users remain in this view to continue editing if needed.

4. **Download/Export Interface:** Export controls integrated into the comparison view (e.g., download button in header/toolbar) to download the final translated text as TXT.

**MVP Scope Clarifications:**
- Single document focus in MVP (no document history/list view)
- Authenticated users go directly to upload screen
- After download, users stay in comparison view (can continue editing or start new translation)

## Accessibility: WCAG AA

The interface should meet WCAG AA standards, including:
- Keyboard navigation for all interactive elements
- Screen reader compatibility for translation content and UI controls
- Sufficient color contrast for text readability
- Focus indicators for keyboard navigation
- Alt text for icons and non-text elements
- Form labels and error messages accessible to assistive technologies

## Branding

**Color Palette:**
- **Background Colors:** Primary (#FFFFFF), Secondary (#F4F5F7), Sidebar (#F7F8FA)
- **Text Colors:** Primary (#111827), Secondary (#6B7280)
- **Border Colors:** Light (#E5E7EB)
- **Accent Colors:** Orange (#F97316 - primary accent), Orange Soft (#FFF7ED), Blue Soft (#EEF2FF), Green (#16A34A - success), Red (#DC2626 - error)
- **Interactive States:** Hover (#F3F4FF), Active (#FFF7ED)

**Typography:**
- **Font Family:** System font stack (-apple-system, BlinkMacSystemFont, system-ui, Segoe UI, sans-serif)
- **Font Sizes:** xs (12px), sm (13px), md (14px - base), lg (16px), xl (20px), display (24px)
- **Font Weights:** regular (400), medium (500), semibold (600), bold (700)

**Logo & Brand Identity:**
- **Text Logo:** "Librilabs" (18px, semibold/600, #111827)
- **Brand Color:** Orange (#F97316) as primary accent
- **Tone of Voice:** Professional

**Implementation Note:** All branding elements must be implemented using Untitled UI components exclusively (no custom components). Colors and typography should be applied through Tailwind CSS configuration to match the Untitled UI design system while respecting the brand palette where possible.

## Target Device and Platforms: Web Responsive

The MVP targets web-responsive design supporting:
- **Desktop:** Windows, macOS, Linux (Chrome, Firefox, Safari, Edge - latest 2 versions)
- **Tablet:** iPad, Android tablets (responsive web interface)
- **Mobile:** iOS Safari, Android Chrome (responsive web, not native apps for MVP)

The interface should adapt to different screen sizes, with the side-by-side view optimized for desktop/tablet landscape orientation. Mobile view may require a stacked or tabbed layout for smaller screens.

---
