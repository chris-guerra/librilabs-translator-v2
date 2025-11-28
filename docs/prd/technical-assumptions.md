# Technical Assumptions

## Repository Structure: Monorepo

The project uses a monorepo structure with:
- `frontend/` - Next.js application (independent, can be moved separately)
- `backend/` - FastAPI application (to be created, independent)
- `docs/` - Documentation directory
- Shared types/interfaces if needed (TypeScript definitions)

**Rationale:** Monorepo structure is already established in the project. It simplifies development, enables code sharing, and maintains consistency across frontend and backend. Both applications remain independent and can be extracted to separate repositories if needed in the future.

## Service Architecture: Monolith

The MVP uses a **Monolith FastAPI service with modular design**:

**Frontend (Next.js 16.0.4):**
- Client-side application
- API calls to backend using native `fetch` + TanStack Query
- React Server Components where beneficial
- Server-side rendering where beneficial

**Backend (FastAPI Monolith):**
- Single FastAPI application (Python 3.14) with modular design
- **API Routers:** `/auth/*`, `/users/*`, `/documents/*`, `/translations/*`
- **Modular Packages:**
  - `services.translation` - Translation logic (OpenAI integration, chunking, progress tracking) - extractable to separate service
  - `services.auth` - Authentication logic (email code/magic-link, JWT) - post-MVP
  - `services.persistence` - Database operations (SQLAlchemy models, queries)
- **Design Philosophy:** Modular structure allows future extraction to microservices if translation load requires it

**Database Layer:**
- PostgreSQL (Railway's managed Postgres)
- SQLAlchemy 2.0 with declarative mappings and AsyncSession
- Alembic for database migrations
- asyncpg driver for async database operations
- JSON fields for flexible translation state storage

**File Storage (MVP):**
- No separate storage service for MVP (TXT files only)
- Store TXT content directly in PostgreSQL (TEXT column or `document_chunks` table - to be determined during technical design)
- Max file size: ~10MB (suitable for text in Postgres)

**Rationale:** Monolith architecture is optimal for MVP - simpler infrastructure, easier debugging, simpler observability, and faster development. The modular design allows extraction of `services.translation` into a separate translation worker service if translation load explodes in the future. This balances MVP simplicity with future scalability.

## Testing Requirements: Full Testing Pyramid

**Frontend Testing:**
- **Unit/Integration:** Vitest + React Testing Library
- **E2E:** Playwright

**Backend Testing:**
- **Unit/Integration:** Pytest for FastAPI + httpx test client

**Testing Strategy:**
- Unit tests for individual components and functions
- Integration tests for API endpoints and database interactions
- E2E tests for critical user workflows (upload → translate → edit → download)

**Rationale:** Full testing pyramid ensures quality across all layers. Vitest provides fast unit testing for React components, Playwright ensures end-to-end workflow validation, and Pytest with httpx provides comprehensive backend API testing. This approach catches bugs early and maintains code quality as the product evolves.

## Additional Technical Assumptions and Requests

1. **Component Library:** Untitled UI exclusively (no custom components) - all UI components must use Untitled UI to maintain design consistency and reduce maintenance burden.

2. **Styling:** Tailwind CSS for styling consistency - apply brand colors and typography through Tailwind configuration to match Untitled UI design system.

3. **State Management (Frontend):**
   - **Server State:** TanStack Query (React Query) for API data caching, loading/error states, retries, pagination
   - **UI/Local State:** Minimal approach - useState/useReducer or Zustand for cross-page UI state (selected document, modals)

4. **Form Handling (Frontend):** React Hook Form - lightweight, TypeScript-friendly, good performance, works well with Untitled UI.

5. **API Client (Frontend):** Native `fetch` API (Next.js optimized) combined with TanStack Query for caching and status management.

6. **Hosting/Infrastructure:**
   - **Primary Platform:** Railway for application hosting
   - Containerization (Docker) for consistent deployments
   - CI/CD pipeline for automated testing and deployment
   - Environment-based configuration (dev, staging, production)

7. **Email Service:** Resend for email delivery - email code/magic-link authentication (post-MVP, not part of MVP), user notifications and transactional emails.

8. **Translation Service:** OpenAI API integration with additional logic layer in `services.translation` package - handles chunking, progress tracking, and quality optimization.

9. **Authentication (Post-MVP):** Custom FastAPI implementation with Resend - flow: User enters email → FastAPI generates code/magic-link → Resend sends email → User submits → FastAPI issues JWT/session → User record stored in Postgres. **Important:** While authentication is post-MVP, the data model and API design must be structured to allow seamless addition of authentication without major refactoring. Documents and translations should be designed with user_id fields (nullable for MVP) to support future authentication integration.

10. **API Documentation:** OpenAPI/Swagger for FastAPI backend - enables API exploration and documentation.

11. **Security/Compliance:**
    - GDPR compliance considerations (user data, document content)
    - Rate limiting, CORS configuration, input validation
    - Encrypt sensitive data at rest and in transit (HTTPS, database encryption)
    - Secure file upload validation
    - User authentication and authorization for document access

12. **Performance Requirements:**
    - Translation API response time: <30 seconds for 10-page document (50,000 characters)
    - Comparison view load time: <3 seconds for documents up to 100 pages
    - Side-by-side scrolling: Smooth, 60fps performance
    - File upload: Support up to 10MB files (TXT format)
    - Progress saving: <1 second save/load time

13. **Future Scalability Considerations:**
    - Current: Monolith FastAPI for MVP and early growth
    - Future (if translation load explodes): Can extract `services.translation` into separate "translation worker" service consuming jobs from queue (Redis, RabbitMQ, or DB-backed job queue)

14. **Browser/OS Support:**
    - Modern browsers (Chrome, Firefox, Safari, Edge) - latest 2 versions
    - Desktop: Windows, macOS, Linux
    - Mobile: iOS Safari, Android Chrome (responsive web, not native apps for MVP)

15. **Post-MVP Integrations (Not in MVP):**
    - Payment Processing: Stripe or similar for subscription management
    - Analytics: Basic usage analytics (PostHog, Mixpanel, or similar)
    - File Storage Service: Consider separate storage service for larger files and multiple formats (PDF, Word, EPUB)

---
