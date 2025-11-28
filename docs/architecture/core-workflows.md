# Core Workflows

Key system workflows using sequence diagrams. These illustrate component interactions for critical user journeys from the PRD.

## Document Upload Workflow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend API
    participant Persistence Service
    participant Database

    User->>Frontend: Upload TXT file + select source language
    Frontend->>Frontend: Validate file (format, size)
    Frontend->>Backend API: POST /api/v1/documents/upload (multipart/form-data)
    Backend API->>Backend API: Validate file (TXT, <10MB)
    Backend API->>Backend API: Extract file content
    Backend API->>Backend API: Generate session_id (if new)
    Backend API->>Persistence Service: create_document(content, file_name, source_language, session_id)
    Persistence Service->>Database: INSERT INTO documents
    Database-->>Persistence Service: document_id
    Persistence Service-->>Backend API: Document object
    Backend API-->>Frontend: 201 Created {document_id, file_name, file_size}
    Frontend->>Frontend: Display success, show language selection
    Frontend-->>User: Upload complete, ready for translation
```

## Translation Processing Workflow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend API
    participant Translation Service
    participant OpenAI API
    participant Persistence Service
    participant Database

    User->>Frontend: Select target language, start translation
    Frontend->>Backend API: POST /api/v1/translations/create {document_id, target_language}
    Backend API->>Persistence Service: get_document(document_id)
    Persistence Service->>Database: SELECT document
    Database-->>Persistence Service: Document
    Persistence Service-->>Backend API: Document content
    Backend API->>Persistence Service: create_translation(document_id, target_language)
    Persistence Service->>Database: INSERT INTO translations (status='pending')
    Database-->>Persistence Service: translation_id
    Persistence Service-->>Backend API: Translation object
    Backend API-->>Frontend: 201 Created {translation_id}
    Frontend->>Frontend: Show progress screen, start polling
    
    Note over Backend API,OpenAI API: Async translation processing
    Backend API->>Translation Service: translate_document(document_id, source_lang, target_lang)
    Translation Service->>Translation Service: chunk_text(content)
    loop For each chunk
        Translation Service->>OpenAI API: POST /v1/chat/completions (translate chunk)
        OpenAI API-->>Translation Service: Translated chunk
        Translation Service->>Persistence Service: update_translation(progress_percentage)
        Persistence Service->>Database: UPDATE translations SET progress_percentage
    end
    Translation Service->>Translation Service: Combine translated chunks
    Translation Service->>Persistence Service: update_translation(status='completed', translated_content)
    Persistence Service->>Database: UPDATE translations
    Database-->>Persistence Service: Success
    
    loop Polling
        Frontend->>Backend API: GET /api/v1/translations/{id}/status
        Backend API->>Persistence Service: get_translation(translation_id)
        Persistence Service->>Database: SELECT translation
        Database-->>Persistence Service: Translation
        Persistence Service-->>Backend API: Translation status
        Backend API-->>Frontend: {status, progress_percentage}
        alt Translation completed
            Frontend->>Frontend: Transition to comparison view
        end
    end
```

## Side-by-Side Comparison and Editing Workflow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend API
    participant Persistence Service
    participant Database

    User->>Frontend: View comparison (translation completed)
    Frontend->>Backend API: GET /api/v1/documents/{id}
    Backend API->>Persistence Service: get_document(document_id)
    Persistence Service->>Database: SELECT document
    Database-->>Persistence Service: Document
    Persistence Service-->>Backend API: Document content
    Backend API-->>Frontend: Document {content}
    
    Frontend->>Backend API: GET /translations/{id}
    Backend API->>Persistence Service: get_translation(translation_id)
    Persistence Service->>Database: SELECT translation
    Database-->>Persistence Service: Translation
    Persistence Service-->>Backend API: Translation content
    Backend API-->>Frontend: Translation {translated_content}
    
    Frontend->>Frontend: Display side-by-side view<br/>(original left, translated right)
    Frontend->>Frontend: Enable synchronized scrolling
    Frontend->>Frontend: Enable editing on translated side
    
    User->>Frontend: Edit translated text
    Frontend->>Frontend: Debounce auto-save (2 seconds)
    Frontend->>Backend API: PUT /api/v1/translations/{id} {translated_content}
    Backend API->>Persistence Service: update_translation(translation_id, translated_content)
    Persistence Service->>Database: UPDATE translations SET translated_content
    Database-->>Persistence Service: Success
    Persistence Service-->>Backend API: Updated translation
    Backend API-->>Frontend: 200 OK {translation}
    Frontend->>Frontend: Show "Saved" indicator
```

## Progress Saving and Resume Workflow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend API
    participant Persistence Service
    participant Database

    Note over User,Database: User is editing translation
    User->>Frontend: Edit translated text
    Frontend->>Frontend: Auto-save triggered (debounced)
    Frontend->>Backend API: PUT /api/v1/translations/{id} {translated_content, translation_state}
    Backend API->>Persistence Service: update_translation(translation_id, translated_content, translation_state)
    Persistence Service->>Database: UPDATE translations SET translated_content, translation_state
    Database-->>Persistence Service: Success
    Persistence Service-->>Backend API: Updated translation
    Backend API-->>Frontend: 200 OK
    Frontend-->>User: "Saved" indicator
    
    Note over User,Database: User closes browser/leaves
    User->>Frontend: Close browser (progress saved in DB)
    
    Note over User,Database: User returns later
    User->>Frontend: Return to application
    Frontend->>Frontend: Retrieve session_id from sessionStorage
    Frontend->>Backend API: GET /translations/{id}
    Backend API->>Persistence Service: get_translation(translation_id, session_id)
    Persistence Service->>Database: SELECT translation WHERE id=translation_id AND session_id=session_id
    Database-->>Persistence Service: Translation with saved content
    Persistence Service-->>Backend API: Translation
    Backend API-->>Frontend: Translation {translated_content, translation_state}
    Frontend->>Frontend: Restore comparison view with saved content
    Frontend-->>User: Resume editing from saved state
```

## Download/Export Workflow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend API
    participant Persistence Service
    participant Database

    User->>Frontend: Click download button
    Frontend->>Backend API: GET /api/v1/translations/{id}/download
    Backend API->>Persistence Service: get_translation(translation_id)
    Persistence Service->>Database: SELECT translation
    Database-->>Persistence Service: Translation
    Persistence Service-->>Backend API: Translated content
    Backend API->>Backend API: Format as TXT file
    Backend API-->>Frontend: 200 OK (text/plain, Content-Disposition: attachment)
    Frontend->>Frontend: Trigger browser download
    Frontend-->>User: TXT file downloaded
    Note over User,Frontend: User remains in comparison view<br/>can continue editing
```

**Rationale for Core Workflows:**

**Design Decisions:**
1. **Async Translation:** Translation processing is asynchronous to avoid blocking API requests. Frontend polls for status updates.
2. **Auto-Save with Debouncing:** Editing changes are auto-saved with 2-second debounce to reduce API calls while ensuring progress is saved.
3. **Session-Based Resume:** Progress is saved to database with session_id, allowing users to resume work across browser sessions.
4. **Non-Blocking Download:** Download doesn't interrupt the editing workflow - users can continue editing after download.
5. **Synchronized Scrolling:** Frontend handles scroll synchronization client-side for smooth UX.

**Workflow Characteristics:**
- **Upload:** Simple, synchronous workflow with immediate feedback
- **Translation:** Async processing with progress polling for long-running operations
- **Editing:** Real-time auto-save with debouncing for optimal UX and data safety
- **Resume:** Database-backed persistence enables seamless workflow continuation
- **Download:** Simple GET request that doesn't disrupt the editing experience

**Error Handling:**
- All workflows include error paths (network failures, validation errors, etc.)
- Frontend provides user-friendly error messages
- Backend returns structured error responses with codes and messages
- Failed operations can be retried by users

---
