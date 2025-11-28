# API Specification

The API uses RESTful design with OpenAPI 3.0 specification and URL-based versioning (`/api/v1/...`). FastAPI automatically generates OpenAPI/Swagger documentation accessible at `/docs`. All endpoints support session-based authentication for MVP (via session_id header/cookie), with user authentication to be added post-MVP.

**API Versioning Strategy:**
- **URL-based versioning:** All endpoints prefixed with `/api/v1/` (e.g., `/api/v1/documents/upload`)
- **Version 1 (v1):** Initial MVP API version
- **Future versions:** New versions (v2, v3, etc.) can be added alongside v1 for backward compatibility
- **Version deprecation:** Old versions will be maintained for a grace period before removal

## REST API Specification

```yaml
openapi: 3.0.0
info:
  title: Librilabs Translator API
  version: 1.0.0
  description: |
    REST API for Librilabs Translator - document translation and review workflow.
    Supports session-based authentication for MVP, with user authentication planned post-MVP.
    All endpoints are versioned under /api/v1/.
servers:
  - url: http://localhost:8000/api/v1
    description: Local development server
  - url: https://api.librilabs-translator.railway.app/api/v1
    description: Production server (Railway)

paths:
  /health:
    get:
      summary: Health check endpoint
      description: Returns system health status
      operationId: healthCheck
      tags:
        - System
      responses:
        '200':
          description: System is healthy
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: "healthy"
                  timestamp:
                    type: string
                    format: date-time

  /api/v1/documents/upload:
    post:
      summary: Upload a document
      description: Upload a TXT file for translation
      operationId: uploadDocument
      tags:
        - Documents
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              required:
                - file
                - source_language
              properties:
                file:
                  type: string
                  format: binary
                  description: TXT file to upload (max 10MB)
                source_language:
                  type: string
                  description: ISO 639-1 language code (e.g., 'en', 'es')
                  example: "en"
      responses:
        '201':
          description: Document uploaded successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DocumentResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '413':
          description: File too large (exceeds 10MB)
        '422':
          description: Invalid file format or language code

  /api/v1/documents/{document_id}:
    get:
      summary: Get document by ID
      description: Retrieve document metadata and content
      operationId: getDocument
      tags:
        - Documents
      parameters:
        - $ref: '#/components/parameters/DocumentId'
      responses:
        '200':
          description: Document retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DocumentResponse'
        '404':
          $ref: '#/components/responses/NotFound'

    put:
      summary: Update document
      description: Update document metadata (e.g., source language)
      operationId: updateDocument
      tags:
        - Documents
      parameters:
        - $ref: '#/components/parameters/DocumentId'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                source_language:
                  type: string
                  description: ISO 639-1 language code
      responses:
        '200':
          description: Document updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DocumentResponse'
        '404':
          $ref: '#/components/responses/NotFound'

  /api/v1/languages:
    get:
      summary: Get supported languages
      description: Returns list of supported source and target languages
      operationId: getLanguages
      tags:
        - Languages
      responses:
        '200':
          description: List of supported languages
          content:
            application/json:
              schema:
                type: object
                properties:
                  languages:
                    type: array
                    items:
                      $ref: '#/components/schemas/Language'

  /api/v1/translations/create:
    post:
      summary: Create a translation
      description: Initiate translation of a document to target language
      operationId: createTranslation
      tags:
        - Translations
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - document_id
                - target_language
              properties:
                document_id:
                  type: string
                  format: uuid
                  description: ID of document to translate
                target_language:
                  type: string
                  description: ISO 639-1 target language code
                  example: "es"
      responses:
        '201':
          description: Translation created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TranslationResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '404':
          $ref: '#/components/responses/NotFound'

  /api/v1/translations/{translation_id}:
    get:
      summary: Get translation by ID
      description: Retrieve translation content and metadata
      operationId: getTranslation
      tags:
        - Translations
      parameters:
        - $ref: '#/components/parameters/TranslationId'
      responses:
        '200':
          description: Translation retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TranslationResponse'
        '404':
          $ref: '#/components/responses/NotFound'

    put:
      summary: Update translation
      description: Update translated content (for in-place editing)
      operationId: updateTranslation
      tags:
        - Translations
      parameters:
        - $ref: '#/components/parameters/TranslationId'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - translated_content
              properties:
                translated_content:
                  type: string
                  description: Updated translated text content
      responses:
        '200':
          description: Translation updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TranslationResponse'
        '404':
          $ref: '#/components/responses/NotFound'

  /api/v1/translations/{translation_id}/status:
    get:
      summary: Get translation status
      description: Get current translation status and progress
      operationId: getTranslationStatus
      tags:
        - Translations
      parameters:
        - $ref: '#/components/parameters/TranslationId'
      responses:
        '200':
          description: Translation status retrieved
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                    format: uuid
                  status:
                    type: string
                    enum: [pending, in_progress, completed, failed]
                  progress_percentage:
                    type: integer
                    minimum: 0
                    maximum: 100
                  document_id:
                    type: string
                    format: uuid
                  target_language:
                    type: string
        '404':
          $ref: '#/components/responses/NotFound'

  /api/v1/translations/{translation_id}/download:
    get:
      summary: Download translated text
      description: Download translated content as TXT file
      operationId: downloadTranslation
      tags:
        - Translations
      parameters:
        - $ref: '#/components/parameters/TranslationId'
      responses:
        '200':
          description: Translated text file
          content:
            text/plain:
              schema:
                type: string
        '404':
          $ref: '#/components/responses/NotFound'

components:
  schemas:
    DocumentResponse:
      type: object
      properties:
        id:
          type: string
          format: uuid
        file_name:
          type: string
        file_size:
          type: integer
        source_language:
          type: string
        content:
          type: string
          description: Full document content (only in GET /documents/{id})
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    TranslationResponse:
      type: object
      properties:
        id:
          type: string
          format: uuid
        document_id:
          type: string
          format: uuid
        target_language:
          type: string
        translated_content:
          type: string
        status:
          type: string
          enum: [pending, in_progress, completed, failed]
        progress_percentage:
          type: integer
          minimum: 0
          maximum: 100
        translation_state:
          type: object
          nullable: true
          description: JSON structure for chunking/resume data
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    Language:
      type: object
      properties:
        code:
          type: string
          description: ISO 639-1 language code
          example: "en"
        name:
          type: string
          description: Language name
          example: "English"

  parameters:
    DocumentId:
      name: document_id
      in: path
      required: true
      schema:
        type: string
        format: uuid
      description: Document identifier

    TranslationId:
      name: translation_id
      in: path
      required: true
      schema:
        type: string
        format: uuid
      description: Translation identifier

  responses:
    BadRequest:
      description: Bad request - validation error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string
            details:
              type: object
            timestamp:
              type: string
              format: date-time
            request_id:
              type: string

  securitySchemes:
    SessionAuth:
      type: apiKey
      in: header
      name: X-Session-Id
      description: Session ID for anonymous authentication (MVP)

security:
  - SessionAuth: []

tags:
  - name: System
    description: System health and status endpoints
  - name: Documents
    description: Document upload and management
  - name: Languages
    description: Language selection and support
  - name: Translations
    description: Translation processing and management
```

**Rationale for API Specification:**

**Design Decisions:**
1. **RESTful Design:** Standard HTTP methods and resource-based URLs align with FastAPI patterns and simplify frontend integration
2. **URL-based Versioning:** All endpoints prefixed with `/api/v1/` to enable future API evolution while maintaining backward compatibility
3. **OpenAPI 3.0:** FastAPI automatically generates documentation from this specification, serving as the single source of truth for API contract
4. **Session-based Auth (MVP):** `X-Session-Id` header for anonymous session authentication. Post-MVP will add JWT-based user authentication
5. **Separate Status Endpoint:** `GET /api/v1/translations/{id}/status` allows polling for progress without fetching full translation content
6. **Download Endpoint:** Dedicated endpoint for downloading translated text as TXT file
7. **Error Format:** Consistent error response structure with code, message, details, timestamp, and request_id for debugging
8. **Language Codes:** ISO 639-1 standard ensures compatibility with translation APIs and future language features

**Key Endpoints:**
- **Document Upload:** `POST /api/v1/documents/upload` with multipart/form-data for file upload
- **Translation Creation:** `POST /api/v1/translations/create` initiates async translation (returns immediately)
- **Status Polling:** `GET /api/v1/translations/{id}/status` for progress updates during translation
- **Translation Update:** `PUT /api/v1/translations/{id}` for in-place editing with auto-save
- **Download:** `GET /api/v1/translations/{id}/download` for exporting translated text as TXT

**Trade-offs:**
- **Async Translation:** Non-blocking translation creation requires status polling, but acceptable for long-running operations
- **Content in Responses:** Full document/translation content included in GET endpoints. Consider pagination if needed for very large documents post-MVP
- **No Bulk Operations:** MVP focuses on single-document workflow. Bulk operations can be added post-MVP if needed

---
