# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# FORMTION - Claude Code Project Instructions

## Project Overview

FORMTION is a Notion content gating and lead collection tool (MVP). It embeds Notion pages, applies blur/blind effects to content, and collects user information to unlock the content.

## Tech Stack

### Backend (`/backend`)
- **Runtime**: Python 3.11+
- **Framework**: FastAPI
- **Database**: SQLite with SQLAlchemy (async via aiosqlite)
- **Auth**: JWT (python-jose)
- **Package Manager**: uv

### Frontend (`/frontend`)
- **Runtime**: Node.js 18+
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: Zustand, React Context
- **Forms**: React Hook Form + Zod
- **Notion Rendering**: react-notion-x

## Project Structure

```
backend/
├── app/
│   ├── api/          # API routers (auth, projects, leads, webhooks, events, notion)
│   ├── core/         # Config, security, database
│   ├── models/       # SQLAlchemy models (user, project, lead, event_log)
│   ├── schemas/      # Pydantic schemas
│   ├── services/     # Business logic (webhook)
│   └── main.py       # App entrypoint
frontend/
├── src/
│   ├── components/   # UI components (ui/, admin/, viewer/)
│   ├── contexts/     # AuthContext, ToastContext
│   ├── layouts/      # AdminLayout
│   ├── lib/          # api.ts, utils.ts, guestStorage.ts
│   └── pages/        # admin/, viewer/, LandingPage, GuestPreviewPage
```

## Development Commands

```bash
# Start both servers (dev mode with hot reload)
./start-dev.sh

# Start both servers (background mode)
./start.sh

# Stop background servers
./stop.sh

# Backend only
cd backend && uv run uvicorn app.main:app --reload --port 8000

# Frontend only
cd frontend && npm run dev

# Frontend lint
cd frontend && npm run lint

# Frontend build
cd frontend && npm run build

# Backend lint/format (ruff)
cd backend && uv run ruff check .
cd backend && uv run ruff format .
```

## URLs

- Frontend: http://localhost:3001
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- API Docs (ReDoc): http://localhost:8000/redoc

## Code Conventions

### Backend (Python)
- Use async/await for database operations
- Pydantic schemas for request/response validation
- SQLAlchemy models in `/models`
- API routes in `/api` with dependency injection via `deps.py`
- Follow FastAPI best practices

### Frontend (TypeScript/React)
- Functional components with hooks
- TypeScript strict mode
- Tailwind CSS for styling (use `cn()` utility from `lib/utils.ts`)
- API calls through `lib/api.ts` axios instance
- Forms with react-hook-form + zod validation
- UI components in `components/ui/` (Button, Card, Input, Modal, etc.)

### Naming Conventions
- React components: PascalCase
- TypeScript files: PascalCase for components, camelCase for utilities
- Python files: snake_case
- API endpoints: kebab-case

## Key Patterns

### Authentication Flow
- JWT tokens stored in localStorage
- AuthContext provides user state and login/logout methods
- Protected routes check auth via context

### Viewer Page Flow
1. Load project settings by slug
2. Render Notion embed with react-notion-x
3. Apply blur overlay based on project settings
4. Show lead capture form (Top/Bottom, Modal, or Floating CTA)
5. On form submit, unlock content

### Lead Capture UX Patterns
- `top_bottom_form`: Form at top or bottom of page
- `entry_modal`: Modal on page load
- `floating_cta`: Floating button that opens modal
- `blur_overlay`: Blur effect on content until form submitted

## Environment Variables

### Backend (`backend/.env`)
```env
JWT_SECRET_KEY=your-secret-key
DATABASE_URL=sqlite+aiosqlite:///./formtion.db
CORS_ORIGINS=["http://localhost:3000"]
```

Note: Copy from `backend/env.template` if `.env` doesn't exist - the start scripts will do this automatically.

## Architecture Details

### Database Models
- `User`: Authentication and user management
- `Project`: Notion page configurations and UX settings
- `Lead`: Captured lead information linked to projects
- `EventLog`: Audit trail for user actions and system events

### Key Workflows
- **Project Creation**: User creates project → validates Notion URL → configures UX pattern → generates public slug
- **Lead Capture**: Visitor accesses `/view/{slug}` → sees content with overlay → submits form → content unlocked
- **Data Export**: Admin views leads → exports to CSV with filtering options

### Security Patterns
- JWT tokens for API authentication
- Public project access via slug (no auth required)
- Rate limiting on lead submission endpoints
- Input validation via Pydantic schemas

## Documentation

PRD documents are in `/docs/prd/` - reference for product requirements and design decisions.

## Language

- Code: English
- UI/UX content: Korean (한국어)
- Comments: Korean or English acceptable
