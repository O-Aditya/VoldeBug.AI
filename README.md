# Voldebug AI Education Portal

A gamified AI education platform connecting students (ages 12–18) with AI tools through teacher-assigned activities and self-directed exploration.

## Architecture

Monorepo powered by Turborepo + pnpm workspaces.

```
voldebug/
├── apps/
│   ├── web/          # Next.js 14+ frontend (App Router)
│   └── api/          # Express.js backend
├── packages/
│   ├── config/       # Shared ESLint, Prettier, TS configs
│   └── types/        # Shared TypeScript types & Zod schemas
└── CLAUDE.md         # Single source of truth for agent directives
```

## Commands

- `pnpm dev` — Start all apps in development mode
- `pnpm build` — Build all apps
- `pnpm lint` — Lint all apps
- `pnpm typecheck` — Type check all apps
- `pnpm format` — Format all code

## Getting Started

1. Copy `.env.example` to `.env` and fill in required values
2. `pnpm install`
3. `pnpm dev`
