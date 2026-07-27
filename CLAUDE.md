# Focus — CLAUDE.md

Focus is a free, iOS-first mobile app running a 66-day (21-day minimum) self-improvement program — daily quests that raise 5 stats (Discipline, Focus, Strength, Confidence, Wisdom), with streaks, achievement cards, and daily motivation cards. Modeled on Life Reset's structure, fixing what it got wrong (see docs for the full teardown).

**Full detail lives in `/docs`, not duplicated here:**
@docs/FOCUS-project-description.md — product vision, all core systems (XP formula, stat mapping, plan-generation algorithm, rewards, notifications), design system, screen inventory
@docs/FOCUS-development-plan.md — tech stack, data models, phase-by-phase build spec with Definition of Done per phase

## Tech stack (quick reference — see development plan for the reasoning)
- **Frontend:** React Native, NativeWind (Tailwind for RN) for styling, TanStack Query for server state, React Navigation for routing
- **Backend:** NestJS, TypeORM, Postgres (managed host), Passport.js (Apple/Google/JWT)
- **Repo:** single repo, `apps/mobile` + `apps/backend`, no monorepo tooling (Turborepo/Nx) — not needed at this scale
- Full folder structure and naming conventions: `.claude/context/coding-conventions.md`

## Current status
Planning complete — all open product and technical decisions resolved (see development plan §4 and project description §7). Not yet started. **Phase 0 (Technical Foundation) is next.** See development plan §3 for the full phase sequence and Phase 0's Definition of Done before starting.

## Working rules
- **Ask before deciding.** Flag architecture or design decisions and ask rather than picking silently — this has been the standing rule through the whole planning process, and it carries into code. Small implementation details (variable names, minor refactors) don't need asking; anything that shapes the codebase's structure or a product behavior does.
- **Follow the phase sequence.** Don't start a phase before the previous one's Definition of Done is met (development plan §3).
- **Quality over speed.** No fixed timeline — this is a deliberate, locked pace decision, not a default.
- **Boundary:** clone Life Reset's proven structure, not its content. Original copy/branding/assets only.
- never push and commit 
