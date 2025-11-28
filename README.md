# librilabs-translator-v2

Monorepo containing the frontend and backend applications for Librilabs Translator.

## Project Structure

This repository contains two independent projects:

- **`frontend/`** - Next.js 16.0.4 web application
- **`backend/`** - FastAPI (Python 3.14) backend application (to be created)

Each project is completely independent and can be copied/moved separately if needed.

## Architecture

The project follows a fullstack monolith architecture with modular design:

- **Platform:** Railway (hosting, database, CI/CD)
- **API Versioning:** All endpoints use `/api/v1/` prefix
- **Frontend:** Next.js 16.0.4 with React 19, TypeScript, Untitled UI components
- **Backend:** FastAPI monolith with extractable service modules
- **Database:** PostgreSQL (Railway managed) with SQLAlchemy 2.0
- **External Services:** OpenAI API (translation), Resend (post-MVP authentication)

For complete architecture details, see [docs/architecture.md](./docs/architecture.md).

## Getting Started

### Frontend

See [frontend/README.md](./frontend/README.md) for frontend setup instructions.

### Backend

Backend setup instructions will be added when the backend project is created.

## Development Tools

### BMad Method

This project uses [BMad Method](https://github.com/bmad-method/bmad-method) (v4.44.3) - a universal AI agent framework for project management and documentation.

**Installation:**
```bash
npx bmad-method install
```

**Configuration:**
- PRD (Product Requirements Document) is sharded into multiple files
- Architecture documentation is sharded into multiple files
- No IDE integration configured (can be added manually if needed)

**Documentation:**
- User guide: `.bmad-core/user-guide.md`
- Framework files: `.bmad-core/` directory

For more information about the BMad workflow and how to use the agents effectively, refer to the user guide.