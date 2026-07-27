# Coding Conventions

## Repo layout
Single repo, no monorepo tooling.

```
focus/
  apps/
    mobile/       — React Native app
    backend/      — NestJS app
  docs/           — all FOCUS-*.md planning docs
  CLAUDE.md
  .claude/
```

## Backend (`apps/backend`)

Feature-module structure, TypeORM, Postgres. Adapted from an existing NestJS project pattern Jodos supplied as a template, trimmed to what Focus actually needs — the source project was a multi-tenant SaaS with modules Focus has no use for; those are listed as intentionally excluded below rather than silently dropped.

```
apps/backend/
  src/
    common/                — shared decorators, pipes, filters, interceptors
    migrations/             — TypeORM migrations
    config/                 — env config module
    database/               — TypeORM connection setup
    modules/
      auth/
        dto/
        entities/
        strategies/          — apple.strategy.ts, google.strategy.ts, jwt.strategy.ts, local.strategy.ts
        auth.controller.ts
        auth.module.ts
        auth.service.ts
        token.service.ts
      users/
        dto/
        entities/
        users.controller.ts
        users.module.ts
        users.service.ts
      programs/                — Program entity, streak logic, milestone checks
      quests/                  — QuestTemplate, Quest, WeeklyQuest, plan-generation algorithm
      achievements/            — Achievement, AchievementUnlock, hidden-achievement rules
      motivation-cards/        — MotivationCard, MotivationCardPull, matching logic
      journal/                 — JournalEntry (+ photo storage integration, added Phase 3)
      reading/                 — ReadingEntry
      video-quests/            — VideoLink
      notifications/           — the 8 notification types (built out fully in Phase 7)
      health/                  — standard health-check endpoint
    app.controller.ts
    app.module.ts
    app.service.ts
    main.ts
  test/
  .env / .env.example
  Dockerfile
  nest-cli.json
  package.json
  tsconfig.json
```

Each module: `controller` (HTTP layer), `service` (business logic), `module` (wiring), `dto/` (request/response shapes with class-validator), `entities/` (TypeORM entities). `strategies/` only exists inside `auth/`.

**Intentionally not included — add only when a real need appears, not by default:**
- `redis` — no evidence Focus needs caching at this scale
- `storage` — needed once Journal photo upload is actually built (Phase 3); add then
- `admin`, `mfa`, `audit`, `analytics`, `domains`, `workspaces` — all solve multi-tenant SaaS problems (admin panels, workspace isolation, compliance audit trails) that a single-user-then-small personal app doesn't have

## Mobile (`apps/mobile`)

```
apps/mobile/
  src/
    screens/
      onboarding/     — Splash, Welcome, Quiz, BaselineResult, ProgramPreview, Account
      home/
      stats/
      journal/
      tools/          — Reading, VideoQuests, Meditation, Pomodoro, WorkoutLogger, ScreenBlocker
      profile/        — Achievements, Settings
      overlays/       — MotivationCard, MilestoneCelebration, HardModeConsequence, ProgramComplete
    components/       — shared/reusable UI components
    navigation/       — React Navigation setup (tab + stack)
    api/              — TanStack Query hooks per backend module (useQuests, usePrograms, etc.)
    styles/           — NativeWind config, design tokens from the palette in the project description
    types/            — shared TypeScript types (mirrors backend DTOs where practical)
```

- **Styling:** NativeWind (Tailwind classNames for React Native). Design tokens — the color palette and typography from `docs/FOCUS-project-description.md` §4 — go in `tailwind.config.js` so every screen pulls from the same source instead of hardcoded hex values.
- **State management:** TanStack Query for all server state (quests, programs, stats — anything from the API), handling caching/refetching so screens don't hand-roll loading states. Local-only UI state (quiz step index, form inputs) uses plain React `useState`/`useReducer` — no separate global state library, since nothing in this app needs cross-screen client state beyond what the API already tracks.
- **Navigation:** React Navigation — bottom tab navigator (5 tabs) with a stack navigator nested per tab, matching the screen inventory in the project description.

## Naming
- Components/screens: PascalCase (`HomeScreen.tsx`, `QuestCard.tsx`)
- Functions/variables: camelCase
- Files outside components: kebab-case (`plan-generation.service.ts`)
- Backend files follow Nest convention: `<name>.controller.ts`, `.service.ts`, `.module.ts`, `.dto.ts`, `.entity.ts`

## TypeScript
Strict mode on, in both apps. Shared types between backend DTOs and the mobile API layer are hand-mirrored for now (no shared package) — revisit only if that duplication becomes a real maintenance problem, not preemptively.
