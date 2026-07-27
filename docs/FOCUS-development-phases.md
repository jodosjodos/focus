# FOCUS — Development Phases

Version 1 · 28 Jul 2026
Sequential build plan. Each phase should be something real and working before the next one starts — no rush, quality over speed, per the locked pace decision.

**A correction baked into this plan:** the original draft had onboarding personalization shipping before the content it depends on existed — a real contradiction Jodos caught. The fix threads through this whole document: content splits into a small **starter set** (real, ships in Phase 1) and a **full set** (the big scrape/curation, Phase 5). Onboarding never has nothing to work with.

---

## Phase 0 — Technical Foundation
*Not user-facing.*

- React Native app shell
- Backend service skeleton
- Core data models: User, Program, QuestTemplate, Quest instance, Stat, Streak
- Local dev environment set up; real hosted backend comes online later (Phase 8) when Jodos is ready to run this on his own phone

## Phase 1 — Onboarding + Starter Library + Core Loop
*The first version Jodos actually installs and uses.*

- Honest onboarding quiz (no manufactured urgency, per locked decision)
- Baseline Result screen — real Day 1 Rating computed from quiz answers
- Program Preview — quest selection logic pulling from a **starter quest library**:
  - ~35 quest templates across the 5 stats (Strength, Discipline, Focus, Wisdom, Confidence)
  - ~8–10 real reading entries (mix of original lessons + public-domain excerpts)
  - ~10–15 curated video quest links
  - Enough real variety that the generated plan is genuinely personalized, not empty
- Home screen — daily quest list, Main Quest flagging, complete/skip, day counter
- XP + 5 stats updating live
- Basic Stats screen (Current vs Potential toggle)
- Account creation (lightweight, skippable)

## Phase 2 — Reward Layer

- Streaks + milestone celebrations (day 3/7/14/21/33/50/66, full-screen)
- Achievement Cards (milestone + quirky/hidden unlocks, real card UI even with minimal art)
- Motivation Cards — small starter set (~150 quotes), rarity tiers + serial numbers
- Bonus Quest (optional, 1.5x XP)
- Weekly Quest (bigger goal spanning the week)

## Phase 3 — Journal + Tools

- Journal (mood, text, photo)
- Meditation player
- Pomodoro / Focus Timer
- Workout Logger (sets/reps/tempo or sets/kg)
- Reading Library browsing screen (built on Phase 1's starter content, categorized)
- Video Quest list screen

## Phase 4 — Screen Blocker, Both Modes

- Reminder Mode first (simple, low technical risk)
- Block Mode second — real iOS Screen Time integration: permission request flow, app-selection picker, session-based or scheduled blocking
- Flagged as one of the harder phases technically — native framework work, not just UI

## Phase 5 — Full Content Expansion

- Scrape/curate a much larger reading library — more books, more categories
- Build out the full quote dataset toward the matched-to-profile system
- Expand video quest curation across more categories
- This is deliberately *after* Phase 1–4 so the mechanics are already proven before investing in content scale

## Phase 6 — AI Art Pass

- Replace the minimal design system with generated art: character visuals (stat-driven appearance), achievement card illustrations, motivation card art
- Consistent style/prompt template across all generated assets

## Phase 7 — Notification System Polish

Full build-out of the 8 notification types (daily quests ready, tasks remaining, streak at risk, milestone reached, focus session start/end, motivation card ready, journal nudge, weekly recap) — tone locked to encouraging/authentic throughout. Some of these (like "quests ready") may get simple stub versions earlier alongside the feature they belong to; this phase is where the full system gets built and tuned properly.

## Phase 8 — Backend Hardening + Publish Prep

- Move from local dev backend to a real hosted backend
- App Store submission prep, TestFlight
- iOS only — Android is a separate future effort, not part of this roadmap

---

## Explicitly not on this roadmap yet

- Friends / Seasons (social layer)
- Android
- In-app video playback (v1 stays external-link)
- Avatar customization

These are deferred, not cut — see `focus-app-decisions.md` for the reasoning behind each.
