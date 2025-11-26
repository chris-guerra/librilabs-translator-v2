# librilabs-translator-v2

Monorepo containing the frontend and backend applications for Librilabs Translator.

## Project Structure

This repository contains two independent projects:

- **`frontend/`** - Next.js web application
- **`backend/`** - FastAPI backend application (to be added)

Each project is completely independent and can be copied/moved separately if needed.

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