# Frontend Architecture

Frontend-specific architecture details for the Next.js application. This section defines component organization, state management, routing, and service layer patterns.

## Component Architecture

### Component Organization

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing/Upload page
│   ├── compare/                  # Comparison view route
│   │   └── [translationId]/
│   │       └── page.tsx
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── ui/                      # Untitled UI components (imported)
│   ├── document/                # Document-related components
│   │   ├── DocumentUpload.tsx
│   │   └── LanguageSelector.tsx
│   ├── translation/             # Translation-related components
│   │   ├── TranslationProgress.tsx
│   │   ├── SideBySideView.tsx
│   │   └── TranslationEditor.tsx
│   └── layout/                  # Layout components
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/                          # Utilities and configurations
│   ├── api/                     # API client
│   │   ├── client.ts            # fetch wrapper
│   │   └── endpoints.ts         # API endpoint definitions
│   ├── hooks/                   # Custom React hooks
│   │   ├── useSession.ts        # Session management
│   │   └── useTranslation.ts    # Translation data fetching
│   └── utils/                   # Utility functions
│       ├── fileValidation.ts
│       └── languageCodes.ts
├── stores/                       # State management (if using Zustand)
│   └── uiStore.ts               # UI state (modals, selected items)
└── types/                        # TypeScript types
    ├── api.ts                   # API response types
    ├── document.ts              # Document types
    └── translation.ts           # Translation types
```

### Component Template

```typescript
// components/document/DocumentUpload.tsx
'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button, FileUpload } from '@untitled-ui/react';
import { uploadDocument } from '@/lib/api/endpoints';
import { validateFile } from '@/lib/utils/fileValidation';

interface DocumentUploadProps {
  onUploadSuccess: (documentId: string) => void;
}

export function DocumentUpload({ onUploadSuccess }: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState<string>('en');

  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: (data) => {
      onUploadSuccess(data.id);
    },
  });

  const handleFileSelect = (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      // Show error
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadMutation.mutate({
      file: selectedFile,
      sourceLanguage,
    });
  };

  return (
    <div>
      <FileUpload onFileSelect={handleFileSelect} />
      {/* Language selector */}
      <Button onClick={handleUpload} loading={uploadMutation.isPending}>
        Upload Document
      </Button>
    </div>
  );
}
```

## State Management Architecture

### State Structure

```typescript
// Server State (TanStack Query)
// Managed automatically by TanStack Query
// - Document data
// - Translation data
// - Translation status/progress
// - Language list

// UI/Local State (useState/useReducer or Zustand)
interface UIState {
  selectedDocumentId: string | null;
  selectedTranslationId: string | null;
  isModalOpen: boolean;
  sidebarOpen: boolean;
}

// Example with Zustand (optional, for complex UI state)
import { create } from 'zustand';

interface UIStore {
  selectedDocumentId: string | null;
  setSelectedDocumentId: (id: string | null) => void;
  selectedTranslationId: string | null;
  setSelectedTranslationId: (id: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedDocumentId: null,
  setSelectedDocumentId: (id) => set({ selectedDocumentId: id }),
  selectedTranslationId: null,
  setSelectedTranslationId: (id) => set({ selectedTranslationId: id }),
}));
```

### State Management Patterns

- **Server State:** TanStack Query manages all API data, caching, loading states, and error states automatically
- **Form State:** React Hook Form manages form inputs and validation
- **UI State:** useState/useReducer for component-local state, Zustand (optional) for cross-component UI state
- **Session State:** session_id stored in sessionStorage, managed via custom hook
- **Optimistic Updates:** TanStack Query optimistic updates for immediate UI feedback

## Routing Architecture

### Route Organization

```
app/
├── page.tsx                    # / - Upload screen
├── compare/
│   └── [translationId]/
│       └── page.tsx           # /compare/[translationId] - Comparison view
└── layout.tsx                  # Root layout with header
```

**Route Structure:**
- `/` - Landing/Upload screen (default route)
- `/compare/[translationId]` - Side-by-side comparison view with editing

### Protected Route Pattern

```typescript
// For post-MVP authentication
// app/compare/[translationId]/page.tsx
'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTranslation } from '@/lib/api/endpoints';
import { SideBySideView } from '@/components/translation/SideBySideView';

export default function ComparePage({
  params,
}: {
  params: Promise<{ translationId: string }>;
}) {
  const { translationId } = use(params);

  const { data: translation, isLoading } = useQuery({
    queryKey: ['translation', translationId],
    queryFn: () => getTranslation(translationId),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!translation) return <div>Translation not found</div>;

  return <SideBySideView translation={translation} />;
}
```

### Side-by-Side View Component with Paragraph Markers

```typescript
// components/translation/SideBySideView.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDocument, getTranslation } from '@/lib/api/endpoints';

interface SideBySideViewProps {
  translationId: string;
  documentId: string;
}

export function SideBySideView({ translationId, documentId }: SideBySideViewProps) {
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);

  const { data: document } = useQuery({
    queryKey: ['document', documentId],
    queryFn: () => getDocument(documentId),
  });

  const { data: translation } = useQuery({
    queryKey: ['translation', translationId],
    queryFn: () => getTranslation(translationId),
  });

  // Parse text into paragraphs
  useEffect(() => {
    if (document?.content && translation?.translated_content) {
      const originalParagraphs = document.content.split(/\n\s*\n/);
      const translatedParagraphs = translation.translated_content.split(/\n\s*\n/);
      
      // Create paragraph mapping for alignment
      const mappedParagraphs = originalParagraphs.map((original, index) => ({
        id: `para-${index}`,
        originalText: original,
        translatedText: translatedParagraphs[index] || '',
        originalIndex: index,
        translatedIndex: index,
      }));
      
      setParagraphs(mappedParagraphs);
    }
  }, [document, translation]);

  // Synchronized scrolling
  const handleLeftScroll = () => {
    if (rightScrollRef.current && leftScrollRef.current) {
      const scrollRatio = leftScrollRef.current.scrollTop / 
        (leftScrollRef.current.scrollHeight - leftScrollRef.current.clientHeight);
      rightScrollRef.current.scrollTop = scrollRatio * 
        (rightScrollRef.current.scrollHeight - rightScrollRef.current.clientHeight);
    }
  };

  const handleRightScroll = () => {
    if (leftScrollRef.current && rightScrollRef.current) {
      const scrollRatio = rightScrollRef.current.scrollTop / 
        (rightScrollRef.current.scrollHeight - rightScrollRef.current.clientHeight);
      leftScrollRef.current.scrollTop = scrollRatio * 
        (leftScrollRef.current.scrollHeight - leftScrollRef.current.clientHeight);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Column - Original Text (Read-only) */}
      <div className="w-1/2 border-r overflow-auto" ref={leftScrollRef} onScroll={handleLeftScroll}>
        {paragraphs.map((para, index) => (
          <div key={para.id} id={para.id} className="p-4 border-b">
            <span className="text-xs text-gray-500 mr-2">¶{index + 1}</span>
            <div className="whitespace-pre-wrap">{para.originalText}</div>
          </div>
        ))}
      </div>

      {/* Right Column - Translated Text (Editable) */}
      <div className="w-1/2 overflow-auto" ref={rightScrollRef} onScroll={handleRightScroll}>
        {paragraphs.map((para, index) => (
          <div key={para.id} className="p-4 border-b">
            <span className="text-xs text-gray-500 mr-2">¶{index + 1}</span>
            <textarea
              className="w-full min-h-[100px] whitespace-pre-wrap"
              value={para.translatedText}
              onChange={(e) => {
                // Handle paragraph edit with auto-save
                const updated = [...paragraphs];
                updated[index].translatedText = e.target.value;
                setParagraphs(updated);
                // Trigger debounced auto-save
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface Paragraph {
  id: string;
  originalText: string;
  translatedText: string;
  originalIndex: number;
  translatedIndex: number;
}
```

**Paragraph Markers Implementation:**
- **Visual Indicators:** Paragraph markers (¶1, ¶2, etc.) displayed before each paragraph in both columns
- **Alignment:** Paragraphs aligned by index (original[0] ↔ translated[0])
- **Navigation:** Paragraph IDs enable scroll-to-paragraph functionality
- **Parsing:** Text split by double newlines (`\n\s*\n`) to identify paragraph boundaries
- **Synchronization:** Scroll synchronization maintains paragraph alignment during scrolling

## Frontend Services Layer

### API Client Setup

```typescript
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const sessionId = getSessionId(); // From sessionStorage

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Session-Id': sessionId,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}
```

### Service Example

```typescript
// lib/api/endpoints.ts
import { apiClient } from './client';
import type { Document, Translation, TranslationStatus } from '@/types/api';

export async function uploadDocument(
  file: File,
  sourceLanguage: string
): Promise<Document> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('source_language', sourceLanguage);

  const response = await fetch(`${API_BASE_URL}/api/v1/documents/upload`, {
    method: 'POST',
    headers: {
      'X-Session-Id': getSessionId(),
    },
    body: formData,
  });

  if (!response.ok) throw new Error('Upload failed');
  return response.json();
}

export async function createTranslation(
  documentId: string,
  targetLanguage: string
): Promise<Translation> {
  return apiClient<Translation>('/api/v1/translations/create', {
    method: 'POST',
    body: JSON.stringify({ document_id: documentId, target_language: targetLanguage }),
  });
}

export async function getTranslationStatus(
  translationId: string
): Promise<TranslationStatus> {
  return apiClient<TranslationStatus>(`/api/v1/translations/${translationId}/status`);
}

export async function updateTranslation(
  translationId: string,
  translatedContent: string
): Promise<Translation> {
  return apiClient<Translation>(`/api/v1/translations/${translationId}`, {
    method: 'PUT',
    body: JSON.stringify({ translated_content: translatedContent }),
  });
}
```

**Rationale for Frontend Architecture:**

**Design Decisions:**
1. **Next.js App Router:** Modern Next.js routing with server components where beneficial
2. **Component Organization:** Feature-based organization (document/, translation/) for maintainability
3. **Untitled UI Only:** All UI components from Untitled UI library, no custom components
4. **TanStack Query:** Handles all server state, caching, and loading states automatically
5. **TypeScript Throughout:** Full type safety across components, API calls, and state
6. **Session Management:** Simple sessionStorage-based session ID management for MVP
7. **API Client Abstraction:** Centralized API client with session handling and error management

**Key Patterns:**
- **Client Components:** Use `'use client'` directive for interactive components
- **Server Components:** Use server components for initial page loads where possible
- **Custom Hooks:** Encapsulate data fetching logic in custom hooks (useTranslation, useDocument)
- **Error Boundaries:** React error boundaries for graceful error handling
- **Loading States:** TanStack Query provides loading states automatically

---
