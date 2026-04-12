# CLAUDE.md — Voldebug AI Education Portal
## Agent Directive & Build Constitution

---

## 1. PROJECT IDENTITY

**Product Name:** Voldebug AI Education Portal
**Mission:** A gamified AI education platform connecting students (ages 12–18) with AI tools through teacher-assigned activities and self-directed exploration.
**Audience:** Two distinct user types — Students (ages 12–18) and Teachers — with an Admin tier for school management.
**Platform Priority:** Web-first (React/Next.js) → PWA → Native wrappers.
**Guiding Principle:** Every screen must feel like a premium consumer product — not an enterprise tool, not an AI chatbot interface. Students should want to open it. Teachers should trust it.

---

## 2. VISUAL DESIGN PHILOSOPHY

### 2.1 Core Aesthetic Direction

The interface must feel **alive, energetic, and deeply intentional**. Think: the design language of a AAA mobile game meets the trustworthiness of an educational institution. It should never feel like a generic SaaS dashboard or an AI tool interface.

- **Primary Mood:** Electric optimism. Bright but not childish. Dynamic but not chaotic. Confident but not corporate.
- **Never Feel Like AI:** No purple gradients on white backgrounds. No Inter/Roboto fonts everywhere. No flat cards with thin borders. No "AI startup" aesthetic. The product should feel like it was designed by a world-class consumer app studio.
- **Student vs Teacher:** Students get the full gamified energy. Teachers get the same quality with slightly more structured, professional density. Same design language — different composition priority.

### 2.2 Color System

- Build a **dominant accent system** — one electric primary color (e.g., a vivid electric blue, or a plasma violet, or a charged amber — pick one and commit fully) paired with sharp complementary accents.
- Use **dark-first theming** as the default — deep charcoal or near-black backgrounds with glowing elements, not flat dark surfaces.
- Backgrounds must have **atmosphere** — gradient meshes, subtle noise textures, or geometric depth layers. Never a flat solid color.
- Use color **purposefully for state communication**: XP gain, deadlines, level-ups, alerts — each has its own chromatic identity.
- Teacher UI may use the same palette with slightly more contrast and structural weight.
- All color tokens must be defined as CSS custom properties at the root. Nothing hardcoded inline.

### 2.3 Typography Rules

- Use **two typefaces maximum**: one high-character display font (for headings, scores, XP values, badge names) and one refined, highly legible sans-serif for body and UI text.
- Display font must have personality — geometric, slightly futuristic, or editorial. Not Space Grotesk, not Nunito, not Poppins.
- Body font must be crisp and readable at 13–16px across all devices.
- Type scale must be deliberate: establish a clear hierarchy across H1–H4, body, caption, and label sizes.
- XP numbers, level indicators, and scoreboard ranks should be typographically spectacular — large, weighted, with optical precision.

### 2.4 Motion & Animation Principles

- **Every meaningful state change must be animated.** XP gains, level-ups, badge unlocks, submission confirmations, rank changes — all require carefully choreographed motion.
- Use **staggered entrance animations** on page load — elements appear in a deliberate sequence, not all at once.
- Micro-interactions on every interactive element: buttons, cards, toggles, inputs must respond to hover and focus with subtle, satisfying feedback.
- XP bar fills must animate smoothly with easing curves. Level-up events get a full screen celebration moment (confetti, glow pulse, modal).
- Leaderboard rank changes must animate — sliding elements, number tickers, position transitions.
- Avoid gratuitous animation. Every motion must serve a purpose: reward, feedback, orientation, or delight.
- Animation duration guidelines: micro-interactions 100–200ms, state transitions 250–400ms, celebration sequences 600–1200ms.
- Use CSS animations for static transitions; use a motion library (Framer Motion in React contexts) for complex orchestration and layout animations.

### 2.5 Layout & Spatial Composition

- Layouts must feel **designed**, not generated. Use asymmetry intentionally. Allow elements to breathe with generous whitespace in some areas and controlled density in others.
- Cards must have **depth** — layered shadows, glowing borders on active states, subtle inner light effects, not flat rectangles with a 1px border.
- The dashboard is a **stage** — the most important elements (XP progress, current rank, active assignment) are visually dominant. Everything else supports them.
- Mobile-first responsive design is mandatory. Layouts must be tested at 375px, 768px, 1024px, and 1440px.
- Sidebar navigation on desktop; bottom tab bar on mobile.
- Grid systems must be consistent — define a spacing scale (4px base unit) and never deviate.

### 2.6 Iconography & Illustration

- Use a **consistent icon library** throughout — Lucide React is acceptable as a foundation, but icons should feel cohesive with the overall aesthetic.
- XP badges, achievement icons, and level indicators should be visually distinct and memorable — not generic emoji or flat icons. Design them as real artifacts of achievement.
- The mascot (Volt the robot) must be referenced in onboarding and empty states. It should feel like a character, not clipart.
- Empty states must never be blank — use illustrated empty states with helpful prompts.

---

## 3. PRODUCT FEATURES & SCREEN INVENTORY

Build the following screens and flows in this order. Each must be fully functional, not a prototype.

### 3.1 Authentication & Onboarding

**Landing Page**
- Marketing-level quality. First impression of the product.
- Hero section with animated mascot (Volt), platform stats, and clear CTAs for Student and Teacher sign-in.
- Showcase the gamification system visually — show a sample leaderboard, badge icons, XP system preview.
- No lorem ipsum. All content is real and purposeful.

**Login Screen**
- Google OAuth as primary CTA, Microsoft OAuth as secondary, Email/Password as tertiary.
- Visually spectacular — not a generic login card.
- Role selection (Student / Teacher / Admin) post-authentication for new users.
- Show the right onboarding flow based on selected role.

**Student Onboarding (3-step wizard)**
- Step 1: Welcome — animated Volt mascot, brief emotional hook.
- Step 2: How It Works — visual walkthrough of tools, assignments, and XP system.
- Step 3: Profile Setup — avatar upload, grade level, student ID.
- Progress indicator throughout. Completion triggers confetti animation.

**Teacher Onboarding**
- Streamlined: account setup, class creation, school linkage.
- Preview of the teacher dashboard.

### 3.2 Student Dashboard

The most-visited screen. Must be exceptional.

**Widgets (all required, all real-time capable):**
- Welcome banner with personalized greeting and level-up progress message.
- XP Progress Bar — animated, shows current XP, level, and XP needed for next level. Glows when close to level-up.
- Stats Row — Daily Streak (with fire animation on active streak), Class Rank (with trophy), Badges earned (with count and grid preview).
- Daily Challenge card — refreshes at midnight, shows tool + action + XP reward, completion tracked.
- Active Assignments list — due date color-coding (green > 3 days, amber < 3 days, red < 1 day), progress indicators.
- Quick Access Tools row — 4–6 most recently or frequently used tools, one tap to open.
- Recent Activity feed — timestamped actions: submissions, grades, badges, tool usage.

**Bottom Navigation (mobile) / Sidebar (desktop):**
Home | Tools | Classroom | Submit | Scoreboard | Profile

### 3.3 AI Tools Library

**Grid View:**
- Category filter tabs (Chat AI, Code AI, Image AI, Writing AI, Research AI).
- Search input with live filtering.
- Tool cards: logo, name, category tag, brief description, "Open" CTA.
- Tool cards must use the tool's brand color as a subtle accent — not the platform's color.
- Badges overlay on cards: "New", "Popular", "Used in Assignment".

**Tool Detail Page:**
- Full description, use cases, subjects, step-by-step how-to, example prompts, pro tips.
- "Open Tool" CTA opens the tool in a new tab and tracks usage.
- Related active assignments from the student's class.
- Usage count (how many students in class have used this tool).

### 3.4 Classroom & Assignments

**Assignment List (Student View):**
- Tabs: All | Active | Completed | Overdue.
- Assignment cards: title, due date, tool badge, XP reward, status, progress indicator if started.
- Empty state for each tab — illustrated, not blank.

**Assignment Detail Page:**
- Full assignment view: title, teacher name, deadline countdown, instructions, requirements.
- Suggested AI tool with direct open link.
- Teacher's notes section.
- Attachments viewer.
- Submission panel: file upload component, notes field, draft auto-save.
- Submit button triggers confirmation modal, then success animation.

**Submission History:**
- List of all past submissions with status, score, grade, feedback, XP awarded.
- Filter by status (submitted, graded, returned).

### 3.5 File Upload & Submission Flow

**File Upload Component:**
- Drag-and-drop zone with visual feedback on drag.
- File type and size validation with clear error states.
- Upload progress bar — animated, percentage shown.
- Supports: PDF, DOCX, TXT, PNG, JPG. Max 50MB.
- Uploaded files shown as attachment chips, removable.

**Submission Confirmation Modal:**
- Shows file name, tool used, optional note to teacher.
- Warning that submission cannot be edited post-submit.
- Confirm action triggers: confetti animation, XP gain toast, redirect to submission history.

### 3.6 Scoreboard & Leaderboard

**Class Leaderboard:**
- Toggle: Weekly | All-Time.
- Top 3 podium — visually prominent, with avatars, names, levels, XP.
- Full ranked list with rank number, avatar, name, level badge, XP, XP gained this period.
- Current user row is persistently highlighted — even if scrolled out of view, it's pinned or clearly marked.
- Real-time rank animations when rankings change via Socket.io.
- "Your Stats" summary: XP gained this week, assignments completed, rank change, distance to next rank.

### 3.7 Profile Page

- Avatar, name, level badge, student ID, class.
- XP history chart (last 30 days).
- Badge collection grid — earned and locked badges with progress indicators.
- Streak history calendar.
- Assignment completion stats.

### 3.8 Teacher Dashboard

**Overview:**
- Stats cards: Active Assignments, Pending Submissions (needs grading), Students in Class.
- Recent Submissions queue — name, assignment, time submitted, tool used, "View & Grade" CTA.
- Class Performance Overview: Average Grade, Completion Rate, Most Used Tool.
- Quick Actions: Create Assignment, Post Announcement, View Class.

**Create Assignment Form:**
- Rich text editor for instructions (not a plain textarea).
- Class selector, tool suggestion dropdown (with tool icons), due date/time picker.
- Points, XP Reward (auto-calculated suggestion), early submission bonus.
- File attachments for rubrics/examples.
- Submission format checkboxes.
- Notification options.
- Save as Draft | Publish — both clearly differentiated.

**Grading Interface:**
- Student submission details: submitted time, tool used, student notes.
- Inline file viewer (PDF/image preview without download required).
- Score input, grade selector, feedback text area.
- XP breakdown: base + bonuses, quality bonus (teacher-adjustable).
- Notify student toggle.
- Save Draft | Submit Grade.

**Class Analytics:**
- Assignment completion rates over time.
- Tool usage breakdown by student and by assignment.
- Grade distribution.
- Top performers and at-risk students (low activity flags).

### 3.9 Notification System

- In-app notification bell with unread badge count.
- Notification dropdown/panel: assignment created, grade received, badge earned, level-up, teacher message, deadline reminders.
- Toast notification system for real-time events (XP gains, badge unlocks, rank changes).
- Push notification support via Firebase Cloud Messaging (PWA).

---

## 4. SYSTEM DESIGN STANDARDS

### 4.1 Architecture Philosophy

- **Modular Monolith First:** Single codebase with clean internal module boundaries. Extract to microservices only under explicit scaling pressure.
- **API-First:** Every feature is accessible via a clean REST API. Frontend consumes the same API as any future mobile client.
- **Real-Time by Default:** Socket.io for live features (scoreboard, XP updates, grading notifications). Every real-time event must have a graceful non-real-time fallback.
- **Offline Capable (PWA Phase):** Service Worker caching for critical routes. Core read-only views work without connectivity.

### 4.2 Frontend Architecture

- **Framework:** Next.js 14+ with App Router. Use Server Components for data-heavy pages. Use Client Components only where interactivity or browser APIs are needed.
- **Language:** TypeScript strict mode everywhere. No `any` types. No implicit returns. All API response types are shared between frontend and backend.
- **Styling:** Tailwind CSS with a custom design token configuration. All design tokens (colors, spacing, typography, shadows) defined in `tailwind.config.ts`. Never hardcode colors inline.
- **Component Library:** Shadcn/ui as the accessible primitive foundation. All components are extended and themed — never used raw out of the box.
- **Animation:** Framer Motion for complex choreography. CSS transitions for micro-interactions. Never skip animations for gamification events.
- **State Management:** Zustand for global client state (auth, gamification, user preferences). TanStack Query (React Query) for all server state — caching, background refetch, optimistic updates.
- **Forms:** React Hook Form + Zod. All form schemas are shared with backend validation schemas.
- **Real-Time:** Socket.io client initialized once on auth, shared via context. Automatic reconnection and event deduplication.

### 4.3 Backend Architecture

- **Runtime:** Node.js 20+ LTS.
- **Framework:** Express.js 4+, structured as a modular monolith with clearly separated modules: `/auth`, `/users`, `/classes`, `/assignments`, `/submissions`, `/tools`, `/gamification`, `/scoreboard`, `/notifications`, `/analytics`, `/admin`.
- **Language:** TypeScript 5+ with strict mode.
- **Database:** PostgreSQL 15+ via Supabase. Prisma 5+ as the ORM — type-safe queries, migration-driven schema.
- **Caching:** Redis via Upstash — sessions, leaderboard cache (5-minute TTL), rate limiting, daily challenge completion tracking, Socket.io adapter for horizontal scaling.
- **File Storage:** AWS S3 or Cloudflare R2 — presigned URL pattern for direct client uploads. Never pipe file uploads through the backend server.
- **Authentication:** NextAuth.js 5 — Google OAuth (primary), Microsoft OAuth (secondary), email/password fallback. JWT sessions, 30-day max age.
- **Task Queue:** BullMQ (Redis-based) — async jobs for: email notifications, badge evaluation, streak updates, analytics event processing.
- **Email:** Resend or SendGrid for transactional email: grade notifications, assignment created, deadline reminders, parental consent.
- **Push Notifications:** Firebase Cloud Messaging.

### 4.4 Database Design Principles

- All primary keys are `cuid()` strings — never auto-incrementing integers.
- All tables have `createdAt` and `updatedAt` timestamps.
- All relationships use explicit foreign keys with referential integrity enforced at the database level.
- Indexes are mandatory on all foreign keys and any column used in a `WHERE`, `ORDER BY`, or `JOIN` clause in performance-critical queries.
- Leaderboard queries use composite indexes: `(classId, xp DESC)` and `(level DESC, xp DESC)`.
- Soft deletes preferred over hard deletes for any user-generated content (assignments, submissions).
- Row-level security enabled on Supabase for sensitive tables.

### 4.5 API Design Principles

- Base URL: `https://api.voldebug.ai/v1`
- All endpoints return consistent JSON envelope: `{ data, error, meta }`.
- Error responses always include a machine-readable `code` and human-readable `message`.
- Authentication via `Authorization: Bearer <JWT>` header on all protected routes.
- All list endpoints support `page`, `limit`, `sort`, and `filter` query params.
- Pagination uses offset-based for simple lists; cursor-based for real-time feeds.
- All mutation endpoints validate input with Zod schemas before processing.
- HTTP status codes are semantically correct: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Unprocessable Entity, 429 Too Many Requests, 500 Internal Server Error.
- API documentation generated via OpenAPI/Swagger, kept in sync with implementation.

### 4.6 Real-Time Architecture

- Socket.io server with Redis adapter (enables horizontal scaling across multiple Node instances).
- Authentication middleware on socket connection — token verified before any room join.
- Room structure: `user:{userId}` for personal events, `class:{classId}` for class-wide events.
- Event naming convention: `resource:action` (e.g., `xp:updated`, `assignment:graded`, `scoreboard:update`, `badge:earned`).
- All events have a typed payload interface shared between client and server.
- Clients must handle events idempotently — server may re-emit on reconnect.
- Socket connection status is visible to the user (subtle indicator) — not silently broken.

### 4.7 Gamification Engine

**XP System:**
- XP is always awarded via the server — never trust client-side XP calculations.
- Every XP award creates an `XPTransaction` record — full audit trail, no silent mutations.
- Level is derived from total XP using `floor(sqrt(totalXP / 100)) + 1` — computed, not stored, to ensure consistency.
- All XP awards emit a Socket.io event immediately — the UI must react in real time.
- XP sources: assignment submission (50 XP), assignment grade (variable by score), daily login (10 XP), first tool use (20 XP), early submission (25 XP), daily challenge (50 XP), streak bonus (5 × streak days), badge earned (100+ XP), teacher bonus (variable).

**Badge System:**
- Badge evaluation runs after every XP-triggering event — never on a schedule alone.
- Badge conditions are pure functions over user state — easy to test, easy to extend.
- New badges emit a Socket.io `badge:earned` event immediately.
- Badges are never revoked once earned.
- Badge definitions are data-driven (stored in DB) — adding a new badge requires no code deployment.

**Streak System:**
- Streak is calculated server-side at login time using `lastActiveAt` timestamp.
- A streak is maintained if the user logs in within 24–48 hours of their last login.
- Streak break resets to 1, not 0.
- Streak bonus XP scales with streak length.

**Daily Challenge:**
- Generated deterministically from `userId + date` seed — same user sees same challenge all day.
- Completion tracked in Redis with 24-hour TTL — prevents double-claim.
- Challenge variety: try a tool, submit an assignment, achieve a score threshold.

### 4.8 Security Standards

- All traffic over HTTPS (TLS 1.3). WebSocket connections over WSS.
- Rate limiting on all endpoints via Redis: 100 req/15min general, 5 req/15min for auth routes, 20 req/hour for file uploads.
- Input validation and sanitization on every endpoint. No raw user input reaches the database.
- HTML content (rich text fields) sanitized with an allowlist of safe tags before storage.
- File uploads: type validation by MIME type (not just extension), size limit enforcement (50MB), path traversal prevention, optional virus scanning integration.
- File storage keys are namespaced by `userId/assignmentId/timestamp_filename` — no predictable paths.
- Presigned URLs for file upload expire in 1 hour.
- COPPA compliance: parental consent flow for users under 13, data minimization, parent data access rights.
- FERPA compliance: student records accessible only by the student, their teacher, or school admin.
- All role checks performed server-side — never trust client-reported roles.
- SQL injection prevented by Prisma's parameterized query engine — no raw SQL strings with user input.

### 4.9 Performance Standards

| Metric | Target | Hard Ceiling |
|---|---|---|
| First Contentful Paint | < 1.5s | 3s |
| Time to Interactive | < 3s | 5s |
| API response time (p95) | < 200ms | 500ms |
| Database query time (p95) | < 100ms | 300ms |
| WebSocket latency | < 50ms | 200ms |
| Lighthouse Score | > 90 | 70 |

**Frontend Performance Rules:**
- Heavy components (confetti, charts, rich text editors) must be dynamically imported with `next/dynamic`.
- All images served via Next.js `<Image>` component — WebP with fallback, lazy loading.
- No layout shift on font load — use `font-display: swap` with size-adjust fallback.
- React Query cache: 5-minute stale time, 10-minute garbage collection.
- Service Worker caches shell assets and critical routes for PWA offline support.

**Backend Performance Rules:**
- Connection pooling on all database connections (max 20 connections in pool).
- Leaderboard queries cached in Redis with 5-minute TTL, invalidated on any XP change in that class.
- All list queries paginated — no unbounded `findMany` calls.
- Background jobs (notifications, badge checks, analytics) processed via BullMQ — never in the request lifecycle.
- Gzip compression enabled on all API responses.

---

## 5. CODE QUALITY STANDARDS

### 5.1 TypeScript

- Strict mode enabled (`strict: true` in `tsconfig.json`).
- No `any` types. Use `unknown` and narrow with type guards.
- All shared types (API payloads, database models, Socket.io events) defined in a `packages/types` shared package.
- Enums for all categorical fields (roles, statuses, badge types, XP sources, notification types).
- All async functions return typed Promises. No implicit `any` from untyped libraries — write declaration files if necessary.

### 5.2 Component Architecture

- Single responsibility per component. Large components are split into composable parts.
- Props interfaces are explicit and documented. No spreading unknown props.
- Loading, error, and empty states are first-class — every data-fetching component handles all three.
- Accessibility is non-negotiable: all interactive elements have accessible labels, keyboard navigation works, focus management is handled on modals and drawers.
- No inline styles except for dynamic values (e.g., progress bar width from JS). All styling via Tailwind or CSS modules.

### 5.3 Backend Structure

- Each module (auth, users, assignments, etc.) contains: `router.ts`, `controller.ts`, `service.ts`, `schema.ts`, `types.ts`.
- Controllers are thin — only parse request, call service, return response.
- Services contain all business logic — testable without HTTP context.
- All database access goes through Prisma in the service layer — never in controllers or middleware.
- Middleware: authentication, authorization, rate limiting, request logging, error handling — all centralized.
- Error handling: a global error handler catches all unhandled errors, logs them, and returns a safe error response without leaking internals.

### 5.4 Testing Requirements

- Unit tests for all gamification logic: XP calculation, level derivation, badge condition evaluation, streak logic, daily challenge generation.
- Integration tests for all API endpoints: happy path, auth failure, validation failure, forbidden access.
- E2E tests for critical user journeys: student login → view assignment → submit file → see XP update. Teacher login → create assignment → grade submission → student sees notification.
- Test coverage target: 80% on business logic (services, gamification engine).
- Use Vitest for unit and integration. Playwright for E2E.

---

## 6. DEVELOPMENT WORKFLOW STANDARDS

### 6.1 Repository Structure

- Monorepo using Turborepo.
- `apps/web` — Next.js frontend.
- `apps/api` — Express.js backend.
- `packages/types` — Shared TypeScript types.
- `packages/ui` — Shared UI component library (if component sharing is needed).
- `packages/config` — Shared ESLint, Prettier, TypeScript configs.

### 6.2 Environment Configuration

- Three environments: `development`, `staging`, `production`.
- All secrets via environment variables — never committed to version control.
- `.env.example` always kept up to date with all required variables documented.
- Environment-specific configuration validated at startup using Zod — the app refuses to start with invalid config.

### 6.3 Database Migration Policy

- All schema changes via Prisma migrations — never manual SQL edits in production.
- Every migration is reviewed before applying to staging or production.
- Migrations that drop columns or tables require a two-phase deploy: deprecate (stop writing), then drop.
- Production database is backed up before every migration.
- Migrations are additive by default — new columns have defaults or are nullable to avoid downtime.

### 6.4 CI/CD Standards

- GitHub Actions pipeline: type check → lint → unit tests → integration tests → deploy staging → E2E tests → deploy production.
- No direct pushes to `main`. All changes via Pull Requests with at least one review.
- Pull Request deployments via Vercel preview URLs — every PR gets a live preview.
- Deployment to production is automated on merge to `main`, gated by passing all tests.
- Failed production deployments trigger automatic rollback.
- Slack/notification webhook on deployment events.

### 6.5 Monitoring & Observability

- Sentry for error tracking on both frontend and backend — source maps uploaded, all uncaught errors reported.
- Vercel Analytics for Core Web Vitals on the frontend.
- Structured logging (Winston) on the backend — all logs include `requestId`, `userId` if authenticated, `duration`.
- Health check endpoint (`GET /health`) returns database connectivity, Redis connectivity, and uptime.
- Alerts on: error rate > 1% sustained, p95 API latency > 500ms, database connection failures.

---

## 7. BUILD ORDER & PRIORITIES

Build in this strict sequence. Do not skip ahead. Each phase should be fully functional before the next begins.

**Phase 1 — Foundation**
Infrastructure setup, database schema, Prisma migrations, environment configuration, authentication (Google OAuth + email), role-based routing, onboarding flows, base design system (tokens, fonts, color system, component primitives).

**Phase 2 — Student Core**
Student dashboard (all widgets, real-time XP bar, stats), AI Tools library (grid, filters, tool detail, usage tracking), Assignments list and detail page, File upload system (presigned URL flow, progress, validation), Submission flow with confirmation and success animation.

**Phase 3 — Gamification Engine**
XP system (all sources, transaction logging, level calculation), Badge system (all six badges, evaluation service, real-time unlock), Streak system (login detection, bonus XP, reset logic), Daily challenge system (generation, completion tracking, Redis TTL), Scoreboard and leaderboard with real-time Socket.io updates.

**Phase 4 — Teacher Panel**
Teacher dashboard, Create/Edit Assignment form (rich text, tool selection, attachments), Grading interface (file viewer, score entry, feedback, XP breakdown), Class analytics overview, Pending submissions queue.

**Phase 5 — Notifications & Polish**
In-app notification system (bell, panel, unread count), Toast notifications for real-time events, Email notifications (grades, assignments, deadlines), Push notifications via FCM, PWA manifest and Service Worker, Performance optimization pass, Accessibility audit and fixes, Final visual polish across all screens.

**Phase 6 — Admin & Production Hardening**
School/Admin management (user management, class management, school settings), Rate limiting and security hardening review, Full test coverage audit, Load testing and database index verification, Production deployment pipeline, Monitoring and alerting setup.

---

## 8. WHAT THIS PRODUCT MUST NEVER DO

- Ship a screen that is not fully implemented — no placeholders, no "coming soon" sections in shipped features.
- Use generic, template-looking design — every screen must feel intentionally designed for this product.
- Trust client-side data for XP, scores, or grades — all business logic lives on the server.
- Block the request lifecycle with file processing — all file handling is async and direct-to-storage.
- Expose internal error details to the client — all error responses are sanitized.
- Skip accessibility — all interactive elements must be keyboard navigable and screen-reader compatible.
- Allow unbounded database queries — every list operation is paginated.
- Embed secrets in source code — all credentials are environment variables.
- Ship without input validation — every user input is validated before processing.
- Let real-time features degrade silently — Socket.io disconnections must be visible to the user and handled gracefully.

---

## 9. DEFINITION OF DONE

A feature is complete when:
- It is fully functional end-to-end (frontend + backend + database).
- It handles loading, error, and empty states visually.
- It is responsive at all breakpoints (375px, 768px, 1024px, 1440px).
- It has unit tests for core business logic.
- It has at least one integration test covering the happy path.
- It meets the performance targets defined in Section 4.9.
- It is accessible (WCAG 2.1 AA minimum).
- It matches the visual design standards defined in Section 2.
- Real-time features are connected and functional.
- It has been reviewed and is deployed to staging without errors.

---

*This document is the single source of truth for the Voldebug AI agent. All implementation decisions must align with the principles, standards, and build order defined here. When in doubt, choose the option that is more production-ready, more visually exceptional, and more consistent with the platform's identity as a world-class gamified education product.*
