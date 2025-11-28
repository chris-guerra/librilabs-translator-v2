# Coding Standards

MINIMAL but CRITICAL standards for AI agents. Focus only on project-specific rules that prevent common mistakes.

## Critical Fullstack Rules

- **Type Sharing:** Always define types in `packages/shared` and import from there when shared between frontend and backend
- **API Calls:** Never make direct HTTP calls - use the API client service layer (`lib/api/client.ts`)
- **Environment Variables:** Access only through config objects, never `process.env` directly in frontend (use `NEXT_PUBLIC_*` prefix)
- **Error Handling:** All API routes must use the standard error handler and return structured error responses
- **State Updates:** Never mutate state directly - use proper state management patterns (TanStack Query mutations, React setState)
- **Session Management:** Always use `getSessionId()` helper function, never access sessionStorage directly
- **Database Queries:** Always use repository pattern, never raw SQL queries
- **File Validation:** Always validate file type, size, and content before processing

## Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| Components | PascalCase | - | `UserProfile.tsx` |
| Hooks | camelCase with 'use' | - | `useAuth.ts` |
| API Routes | - | kebab-case | `/api/v1/user-profile` |
| Database Tables | - | snake_case | `user_profiles` |
| Functions | camelCase | snake_case | `getUserProfile()` / `get_user_profile()` |
| Constants | UPPER_SNAKE_CASE | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |

---
