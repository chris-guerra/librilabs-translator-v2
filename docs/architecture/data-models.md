# Data Models

The core data models support the translation workflow: document upload, translation processing, progress tracking, and editing. Models are designed to support MVP session-based access while allowing future authentication integration.

## Document

**Purpose:** Represents an uploaded TXT file that serves as the source for translation. A single document can be translated into multiple target languages, so target language is not stored in the Document model.

**Key Attributes:**
- `id`: UUID (primary key) - Unique document identifier
- `content`: TEXT - Full text content of the uploaded TXT file (max ~10MB)
- `file_name`: VARCHAR(255) - Original filename from upload
- `file_size`: INTEGER - File size in bytes (for validation and display)
- `source_language`: VARCHAR(10) - ISO 639-1 language code (e.g., 'en', 'es', 'fr')
- `user_id`: UUID (nullable, foreign key to users) - Owner of the document. NULL for MVP anonymous sessions, populated post-MVP
- `session_id`: VARCHAR(255) (nullable) - Anonymous session identifier for MVP. Used to associate documents with browser sessions
- `created_at`: TIMESTAMP - Document upload timestamp
- `updated_at`: TIMESTAMP - Last modification timestamp

**TypeScript Interface:**

```typescript
interface Document {
  id: string; // UUID
  content: string; // Full text content
  file_name: string;
  file_size: number; // bytes
  source_language: string; // ISO 639-1 code
  user_id: string | null; // UUID, nullable for MVP
  session_id: string | null; // Anonymous session, nullable post-MVP
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}
```

**Relationships:**
- One Document has many Translations (one-to-many)
- One Document belongs to one User (many-to-one, nullable for MVP)
- Documents are associated with Session via session_id (for MVP anonymous access)

## Translation

**Purpose:** Represents a translation of a document into a specific target language. Stores translated content, translation status, and progress information for long-running translations.

**Key Attributes:**
- `id`: UUID (primary key) - Unique translation identifier
- `document_id`: UUID (foreign key to documents) - Source document being translated
- `target_language`: VARCHAR(10) - ISO 639-1 language code for target language
- `translated_content`: TEXT - Translated text content (can be partial during translation)
- `status`: VARCHAR(20) - Translation status: 'pending', 'in_progress', 'completed', 'failed'
- `progress_percentage`: INTEGER (0-100) - Translation progress for long documents
- `translation_state`: JSONB (nullable) - Flexible state storage for chunking, paragraph mapping, resume data
- `user_id`: UUID (nullable, foreign key to users) - Owner of the translation. NULL for MVP, populated post-MVP
- `session_id`: VARCHAR(255) (nullable) - Anonymous session identifier for MVP
- `created_at`: TIMESTAMP - Translation start timestamp
- `updated_at`: TIMESTAMP - Last update timestamp (updated during progress and editing)

**TypeScript Interface:**

```typescript
interface Translation {
  id: string; // UUID
  document_id: string; // UUID, FK to Document
  target_language: string; // ISO 639-1 code
  translated_content: string; // Translated text (can be partial)
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress_percentage: number; // 0-100
  translation_state: TranslationState | null; // JSON structure for chunking/resume
  user_id: string | null; // UUID, nullable for MVP
  session_id: string | null; // Anonymous session, nullable post-MVP
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

interface TranslationState {
  chunks?: ChunkProgress[]; // For tracking translation progress by chunk
  paragraph_mapping?: ParagraphMapping[]; // For side-by-side alignment
  last_edited_at?: string; // Last edit timestamp for auto-save
  // Flexible JSON structure for future needs
}

interface ChunkProgress {
  chunk_index: number;
  original_text: string;
  translated_text: string | null;
  status: 'pending' | 'in_progress' | 'completed';
}

interface ParagraphMapping {
  original_paragraph_index: number;
  translated_paragraph_index: number;
  original_start_char: number;
  original_end_char: number;
}
```

**Relationships:**
- One Translation belongs to one Document (many-to-one)
- One Translation belongs to one User (many-to-one, nullable for MVP)
- Translations are associated with Session via session_id (for MVP anonymous access)

## User (Post-MVP)

**Purpose:** Represents authenticated users. Model structure is defined for MVP but not used until authentication is implemented post-MVP.

**Key Attributes:**
- `id`: UUID (primary key) - Unique user identifier
- `email`: VARCHAR(255) (unique) - User email address (used for authentication)
- `created_at`: TIMESTAMP - Account creation timestamp
- `updated_at`: TIMESTAMP - Last update timestamp

**TypeScript Interface:**

```typescript
interface User {
  id: string; // UUID
  email: string; // Unique email
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}
```

**Relationships:**
- One User has many Documents (one-to-many)
- One User has many Translations (one-to-many)

**Note:** User model will be created in database schema but not actively used during MVP. Documents and Translations will have nullable user_id fields that are populated post-MVP.

## Session (MVP Anonymous Sessions)

**Purpose:** For MVP, anonymous sessions are managed via browser sessionStorage/localStorage and cookies. No database model is required for MVP. Session identifiers are stored in Document and Translation models via `session_id` field.

**MVP Implementation:**
- Frontend generates session ID (UUID) on first visit
- Session ID stored in browser sessionStorage
- Session ID included in API requests via header or cookie
- Backend associates documents/translations with session_id
- No separate Session table needed for MVP

**Post-MVP:** If session management becomes more complex, a Session table can be added with fields: id, user_id (nullable), expires_at, created_at.

**Rationale for Data Models:**

**Design Decisions:**
1. **Separate Document and Translation models:** A document can be translated into multiple languages, so translations are separate entities. This supports future multi-language translation features.
2. **Nullable user_id fields:** Documents and Translations include nullable user_id to support future authentication without refactoring. MVP uses session_id for anonymous access.
3. **JSONB translation_state:** Flexible JSON storage for chunking progress, paragraph mapping, and resume data. Allows evolution without schema changes.
4. **TEXT storage for content:** Document and Translation content stored as PostgreSQL TEXT (suitable for ~10MB files). No separate storage service needed for MVP.
5. **Status tracking:** Translation status field enables progress UI and resume functionality for long documents.
6. **Progress percentage only:** Translation progress tracked via percentage (0-100) without time estimates, simplifying the model and focusing on completion status.
7. **ISO 639-1 language codes:** Standard language codes ensure compatibility with translation APIs and future language features.

**Trade-offs:**
- **TEXT vs. document_chunks table:** Storing full content in TEXT is simpler for MVP. If performance issues arise, can normalize into chunks table later.
- **Session management:** Browser-based sessions are simpler for MVP but less robust than database sessions. Acceptable trade-off for MVP simplicity.
- **User model pre-creation:** Creating User model structure now avoids migration complexity post-MVP, even though it's unused during MVP.

**Areas for Validation:**
- Translation state JSON structure (may need refinement during implementation)
- Paragraph mapping approach for side-by-side alignment
- Session ID generation and validation strategy

---
