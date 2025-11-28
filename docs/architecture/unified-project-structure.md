# Unified Project Structure

Monorepo structure accommodating both frontend and backend. Based on npm workspaces and Docker containerization.

## Project Structure

```
librilabs-translator-v2/
├── .github/                     # CI/CD workflows
│   └── workflows/
│       ├── ci.yml               # Continuous integration
│       └── deploy.yml           # Deployment automation
├── frontend/                    # Next.js frontend application
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── compare/
│   │   │   └── [translationId]/
│   │   │       └── page.tsx
│   │   └── globals.css
│   ├── components/              # React components
│   │   ├── ui/                  # Untitled UI imports
│   │   ├── document/
│   │   ├── translation/
│   │   └── layout/
│   ├── lib/                     # Utilities and configurations
│   │   ├── api/
│   │   ├── hooks/
│   │   └── utils/
│   ├── stores/                  # State management (Zustand, optional)
│   ├── types/                   # TypeScript types
│   ├── public/                  # Static assets
│   ├── tests/                   # Frontend tests
│   ├── .env.local.example       # Environment template
│   ├── next.config.js
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── backend/                     # FastAPI backend application
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── health.py        # /health endpoint (unversioned)
│   │   │   └── v1/              # API version 1 routes
│   │   │       ├── documents.py
│   │   │       ├── translations.py
│   │   │       ├── languages.py
│   │   │       └── auth.py
│   │   ├── services/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   └── config.py
│   ├── alembic/                 # Database migrations
│   │   ├── versions/
│   │   └── env.py
│   ├── tests/                    # Backend tests
│   ├── .env.example              # Environment template
│   ├── requirements.txt          # Python dependencies
│   ├── Dockerfile
│   └── pyproject.toml            # Python project config
├── packages/                    # Shared packages (if needed)
│   └── shared/                   # Shared TypeScript types
│       ├── src/
│       │   ├── types/
│       │   │   ├── document.ts
│       │   │   └── translation.ts
│       │   └── constants/
│       └── package.json
├── infrastructure/              # Infrastructure as Code (if needed)
│   └── docker-compose.yml       # Local development
├── docs/                        # Documentation
│   ├── prd.md
│   ├── front-end-spec.md
│   ├── architecture.md
│   └── ...
├── .env.example                  # Root environment template
├── .gitignore
├── package.json                 # Root package.json (npm workspaces)
├── README.md
└── docker-compose.yml           # Local development setup
```

## Root Package.json (npm workspaces)

```json
{
  "name": "librilabs-translator-v2",
  "version": "0.1.0",
  "private": true,
  "workspaces": [
    "frontend",
    "backend",
    "packages/*"
  ],
  "scripts": {
    "dev": "npm run dev --workspace=frontend & npm run dev --workspace=backend",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "lint": "npm run lint --workspaces"
  }
}
```

## Docker Compose for Local Development

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: librilabs
      POSTGRES_PASSWORD: librilabs_dev
      POSTGRES_DB: librilabs_translator
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql+asyncpg://librilabs:librilabs_dev@postgres:5432/librilabs_translator
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    command: npm run dev

volumes:
  postgres_data:
```

**Rationale for Project Structure:**

**Design Decisions:**
1. **Monorepo with npm workspaces:** Simplifies dependency management and enables code sharing
2. **Independent Applications:** Frontend and backend are separate packages that can be deployed independently
3. **Shared Packages:** `packages/shared/` allows sharing TypeScript types between frontend and backend
4. **Docker Compose:** Local development environment with all services (PostgreSQL, backend, frontend)
5. **Documentation at Root:** All documentation in `docs/` directory for easy access
6. **Workspace Scripts:** Root-level scripts for common operations across workspaces

**Key Benefits:**
- **Code Sharing:** TypeScript types can be shared via `packages/shared/`
- **Unified Development:** Single command to start all services locally
- **Independent Deployment:** Each application can be deployed separately to Railway
- **Consistent Tooling:** Shared linting, testing, and build configurations

---
