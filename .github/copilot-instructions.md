# Electric Poultry Mailsender — Copilot Instructions

## Commands

### Backend (`cd backend`)
```bash
npm run dev      # ts-node-dev with hot reload → http://localhost:3001
npm run build    # tsc compile to dist/
npm start        # run compiled dist/index.js
```

### Frontend (`cd frontend`)
```bash
npm run dev      # Vite dev server → http://localhost:5173
npm run build    # tsc + vite build
npm run preview  # preview the production build locally
```

There are no automated tests in this project.

### Docker / Production
```bash
# Root Dockerfile — single container (backend serves frontend static files)
docker build -t ep-mailsender .
docker-compose up  # local docker: separate frontend (nginx:80) + backend (3001)

# Fly.io deploy (uses root Dockerfile)
fly deploy
```

## Architecture

This is a monorepo with `backend/` (Node.js + Express + TypeScript) and `frontend/` (React + TypeScript + Vite).

**In development**: Vite proxies all `/api` requests to `http://127.0.0.1:3001` (configured in `frontend/vite.config.ts`). The two processes run independently.

**In production / Docker**: The root `Dockerfile` is a multi-stage build that compiles the frontend and copies it into the backend image. Express serves the React SPA from `./frontend` as static files and catches all non-API routes with `app.get('*', ...)` to return `index.html`. A single process runs on port 8080.

**Fly.io** deploys the single-container setup. The `fly.toml` targets region `ams`, sets `PORT=3001` (overridden to 8080 in the Dockerfile), and sets `NODE_TLS_REJECT_UNAUTHORIZED=0` for MongoDB Atlas TLS compatibility.

### Route Structure
- `POST /api/auth/login`, `GET /api/auth/me` — public, returns JWT
- `GET /api/public/gigs` — unauthenticated, CORS-open (consumed by the public band website)
- `GET /api/public/trivia` — unauthenticated, CORS-open
- `GET /api/public/preview-template` — unauthenticated (so previews open in any browser)
- All other `/api/*` routes — require `Authorization: Bearer <token>` JWT

### Authentication
JWT is stored in `localStorage`. The axios instance in `frontend/src/api/index.ts` attaches it via a request interceptor and reloads the page on 401 responses. The `requireAuth` middleware in `backend/src/middleware/auth.ts` verifies the token using `JWT_SECRET`.

### Email Flow
Sending an email (`POST /api/email/send/:venueId`) follows this priority:
1. Use the `templateId` from the request body if provided
2. Fall back to the default DB Template matching the venue's `preferredLanguage`
3. Fall back to the hardcoded templates in `backend/src/templates/emailTemplates.ts`

After a successful send, the venue's `status` is set to `'sent'` and `emailSentAt` is stamped.

The template placeholder for the recipient name is `{{recipientName}}` (applied via `applyPlaceholder()` in the email route).

### Public API
`/api/public/gigs` and `/api/public/trivia` are intentionally unauthenticated with `Access-Control-Allow-Origin: *`. These are polled by the band's public website at [electricpoultry.com](https://electricpoultry.com). Only `confirmed: true` gigs are returned.

## Key Conventions

### Shared Types
Backend Mongoose models (`backend/src/models/`) and frontend types (`frontend/src/types/index.ts`) are **manually kept in sync** — there is no shared package. When changing a model, update both files. The frontend uses `_id: string` (serialised) while the backend uses Mongoose `Document`.

`STATUS_LABELS` and `STATUS_COLORS` (keyed by `VenueStatus`) live in `frontend/src/types/index.ts` and are the source of truth for rendering venue status in the UI.

### VenueStatus lifecycle
`not_contacted` → `sent` → `positive` | `negative` → `booked` → `played`

### Templates vs. Hardcoded Email
DB Templates (managed via the Templates page) store `htmlBody` / `textBody` with `{{recipientName}}` as the only supported placeholder. The hardcoded fallbacks in `emailTemplates.ts` exist as a safety net; prefer creating a default DB Template per language instead of editing the hardcoded file.

### Environment Variables (backend/.env)
```
MONGODB_URI=
GMAIL_USER=
GMAIL_APP_PASSWORD=
JWT_SECRET=
BACKEND_URL=          # used for generating public asset URLs
```

### Frontend API Layer
All API calls go through the single axios instance exported from `frontend/src/api/index.ts`. Add new resource APIs to that file rather than creating separate axios instances.

### Toast Notifications
The `ToastProvider` wraps the entire app. Use the `useToast()` hook from `frontend/src/components/Toast.tsx` to show success/error feedback after mutations.
