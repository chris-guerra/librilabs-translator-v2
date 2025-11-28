# Database Schema

Concrete database schema definitions using PostgreSQL DDL. The schema supports MVP session-based access and future authentication integration.

## Schema Definition

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (created for post-MVP authentication, not used in MVP)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL CHECK (file_size > 0 AND file_size <= 10485760), -- Max 10MB
    source_language VARCHAR(10) NOT NULL, -- ISO 639-1 code
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL for MVP
    session_id VARCHAR(255), -- Anonymous session identifier for MVP
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT documents_user_or_session CHECK (
        (user_id IS NOT NULL) OR (session_id IS NOT NULL)
    )
);

-- Translations table
CREATE TABLE translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    target_language VARCHAR(10) NOT NULL, -- ISO 639-1 code
    translated_content TEXT, -- Can be NULL during translation
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    translation_state JSONB, -- Flexible JSON for chunking, paragraph mapping, resume data
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL for MVP
    session_id VARCHAR(255), -- Anonymous session identifier for MVP
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT translations_user_or_session CHECK (
        (user_id IS NOT NULL) OR (session_id IS NOT NULL)
    ),
    CONSTRAINT unique_document_target_language UNIQUE (document_id, target_language)
);

-- Indexes for performance
CREATE INDEX idx_documents_user_id ON documents(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_documents_session_id ON documents(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);

CREATE INDEX idx_translations_document_id ON translations(document_id);
CREATE INDEX idx_translations_user_id ON translations(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_translations_session_id ON translations(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX idx_translations_status ON translations(status);
CREATE INDEX idx_translations_created_at ON translations(created_at DESC);

-- Full-text search indexes (for future search functionality)
CREATE INDEX idx_documents_content_fts ON documents USING gin(to_tsvector('english', content));
CREATE INDEX idx_translations_content_fts ON translations USING gin(to_tsvector('english', translated_content)) WHERE translated_content IS NOT NULL;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translations_updated_at BEFORE UPDATE ON translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Schema Rationale

**Design Decisions:**
1. **UUID Primary Keys:** UUIDs provide globally unique identifiers, suitable for distributed systems and avoid sequential ID exposure
2. **TEXT Storage:** Document and translation content stored as TEXT type (supports up to ~1GB, sufficient for MVP's 10MB limit)
3. **Nullable user_id:** Both documents and translations have nullable user_id to support MVP anonymous sessions and future authentication
4. **Session_id Support:** session_id VARCHAR(255) allows anonymous session association for MVP
5. **Check Constraints:** File size validation, status enum validation, and progress percentage range validation at database level
6. **Unique Constraint:** `unique_document_target_language` prevents duplicate translations of the same document to the same target language
7. **Cascade Deletes:** ON DELETE CASCADE ensures data consistency when documents or users are deleted
8. **Indexes:** Strategic indexes on foreign keys, session_id, status, and created_at for query performance
9. **Full-Text Search:** GIN indexes on content fields enable future search functionality without schema changes
10. **Updated_at Triggers:** Automatic timestamp updates ensure consistency

**Schema Evolution:**
- **MVP:** Users table exists but unused. All queries use session_id for filtering
- **Post-MVP:** User authentication populates user_id fields. Queries can filter by user_id or session_id
- **Future:** Additional tables can be added (e.g., document_history, translation_versions) without breaking existing schema

**Performance Considerations:**
- Indexes on foreign keys and frequently queried fields (status, created_at)
- Full-text search indexes prepared for future search features
- TEXT type is efficient for document storage up to 10MB
- JSONB for translation_state provides flexible schema with good query performance

**Data Integrity:**
- Foreign key constraints ensure referential integrity
- Check constraints validate data at database level
- Unique constraints prevent duplicate translations
- NOT NULL constraints on required fields
- CHECK constraint ensures either user_id or session_id is present

---
