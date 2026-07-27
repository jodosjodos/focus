# FOCUS — Project Description

Version 1 · 28 Jul 2026
What Focus is, who it's for, and how every product system works. This is the "what and why" document. For "how to build it, phase by phase," see `FOCUS-development-plan.md`.

---

## 1. What Focus is

Focus is a free, iOS-first mobile app that runs a 66-day (21-day minimum) self-improvement program. A user answers a short honest quiz, gets a real plan built from their actual answers, and works through daily quests that visibly raise five stats — Discipline, Focus, Strength, Confidence, Wisdom — while collecting streaks, achievement cards, and daily motivation cards along the way.

It's modeled on Life Reset's proven structure (66-day framing, 5-stat RPG-lite skin, card collectibles) but fixes what that app got wrong: quests that don't actually change per person, a reading library disconnected from the reward loop, a paywall dropped right after emotional investment, guilt-toned notifications, and a dead end at Day 66. Full teardown of what's kept vs fixed lives in `FOCUS-app-structure-and-screen-flow.md` §5.

## 2. Who it's for & platform

Built to be public/shippable eventually, but designed exactly the way Jodos wants it, and he's the primary user/tester first. **Core program is free forever** — no paywall on habits, quests, XP, stats, or achievements. If it ever becomes a business, monetization would live outside the core loop, never gating progress.

**Platform: iOS only for now.** Android is deferred entirely, not built cross-platform in anticipation — a separate future effort, not in parallel.

## 3. Program structure

- **Length:** default 66 days, minimum 21 days, user's choice.
- **Daily quests:** guided default (~3–5/day) suggested from onboarding answers, fully editable.
- **Quest hierarchy:** one or more flagged Main Quest(s) per day (worth more XP) alongside regular side quests.
- **Hard Mode:** opt-in, softer than the reference app — missing a day costs a streak reset / XP penalty / penalty quest, never a full wipe to Day 1.
- **Milestones:** full-screen celebration moments at Day 3, 7, 14, 21, 33, 50, 66 (scaled to whatever's reachable within the chosen length) — Day 1 vs Now comparison, animation.

## 4. Design system

Direction: keep the "anime/RPG energy, broadened" feel already locked, but lead with a light, warm, legible UI rather than a dark gamer-mode default — this matches where the reference app itself has moved, and reads as more universal.

### Color

| Role | Color | Hex | Use |
|---|---|---|---|
| Background | Warm off-white | `#FAF9F6` | Base canvas |
| Text (primary) | Warm charcoal | `#292524` | Body text, headers |
| Primary accent | Orange | `#F97316` | CTAs, streak flame, Main Quest highlight, progress fills |
| Success | Green | `#16A34A` | Quest complete, positive deltas |
| Strength | Crimson | `#DC2626` | Stat bar + icon tint |
| Discipline | Slate | `#334155` | Stat bar + icon tint |
| Focus | Blue | `#2563EB` | Stat bar + icon tint |
| Wisdom | Indigo | `#7C3AED` | Stat bar + icon tint |
| Confidence | Amber | `#D97706` | Stat bar + icon tint |
| Surface / card | White | `#FFFFFF` | Cards on the off-white background, subtle shadow not border |

Each stat gets its own color identity, which the reference app never did (everything read as generic white text) — a small thing that makes Home and Stats screens instantly more legible and gives the 5-stat system real visual weight. Orange stays the single primary accent.

### Typography

- **Body / UI text:** system font (SF Pro on iOS) — free, fast, accessible, no licensing overhead.
- **Display / headline** (day counter, XP numbers, level-up, milestone headlines): a rounded, slightly bold geometric sans — e.g. Nunito or Baloo 2 (free, Google Fonts) — reserved for big numbers and short headlines only, to give a bit of "game" personality without needing illustration work.

This is the pre-art-pass design system. A later phase (see development plan) replaces flat icon/color treatment with generated art for the character visual, achievement cards, and motivation cards, using this palette as the art style's color anchor so that transition feels consistent, not a re-skin.

## 5. Core systems, in depth

### 5.1 XP & Leveling
- Easy quest = 10 XP · Medium = 20 XP · Hard = 35 XP · Bonus Quest = 1.5× its base value
- Level thresholds flat-increment: Level 1 = 500 XP cumulative, Level 2 = 1000, Level 3 = 1500, etc. (cumulative threshold for level *n* = `500 × n`)
- XP awarded the moment a quest is marked complete; level-up gets its own small celebration, distinct from and slightly bigger than the quest-complete micro-celebration, though not full-screen like a day milestone.

### 5.2 Stat mapping (confirmed 28 Jul 2026)
Locked as the default. Flexibility lives in the product itself, not in leaving this open: every quest shows its mapping on the card and can be edited per-quest, and the Custom category exists for anything that doesn't fit.

| Quest type | Primary stat | Secondary stat |
|---|---|---|
| Workout / physical | Strength | Discipline |
| Reading / learning | Wisdom | Focus |
| Meditation / mindfulness | Focus | Confidence |
| Cold shower / discomfort challenge | Confidence | Discipline |
| Sleep / wake-time / consistency | Discipline | — |
| Quit-habit (screen time, etc.) | Discipline | Confidence |
| Video / learning | Wisdom | Focus |
| Wealth-mapped (budgeting, spend tracking) | Discipline | Wisdom |
| Relationships-mapped (call someone, reach out) | Confidence | — |
| Career-mapped (focused work on your goal) | Wisdom | Discipline |
| Custom | user-assigned at creation | optional |

### 5.3 Plan-generation algorithm

Runs once at onboarding (Program Preview) and again incrementally each day to assemble that day's quest list.

**Inputs from the quiz:**
- `improvement_areas`: 3–5 chosen from {Sleep, Body, Focus, Discipline, Confidence, Mind, Wealth, Relationships, Career, Habits}
- `baseline`: sleep_hours, water_liters, exercise_frequency (never / 1-2x / 3+x per week), screen_time_hours
- `program_length`: 21–66 days

**Step 1 — Area → stat/category mapping.** Each chosen improvement area maps to one or more quest categories via the table in §5.2 (Sleep→Discipline, Body→Strength, Focus→Focus, Discipline→Discipline, Confidence→Confidence, Mind→Wisdom, Wealth→Discipline/Wisdom, Relationships→Confidence, Career→Wisdom/Discipline, Habits→Discipline).

**Step 2 — Template selection.** For each chosen area, select one quest template tagged to that category, preferring variety of quest type across the day's list (don't hand someone five checkbox quests), and avoiding duplicate categories if two areas map to the same one.

**Step 3 — Difficulty & target scaling from baseline.** Don't hand everyone the same target:
- Water quest: baseline "under 1L" → start at 2L; "1-2L" → start at 2.5L; "2L+" → start at 3L. Increase by 0.25L every 2 weeks the quest is completed consistently (>80% of days).
- Workout difficulty: baseline "never" → Easy; "1-2x/week" → Medium; "3+x/week" → Hard.
- Screen-time / quit-habit target: scaled from baseline hours (e.g. baseline 6h → target under 4.5h, not an unrealistic jump to 1h).
- Sleep quest: baseline under 6h → a gentle wake/sleep-time shift of 30 min per week, not an immediate full schedule change.

**Step 4 — Count & Main Quest.** Total daily quests: 3 if length ≤30 days and 3 areas chosen; up to 5 if length ≥45 days and 4-5 areas chosen — stays inside the 3–5/day range. One quest per day flagged as Main Quest, rotating round-robin across chosen areas so each gets its "front and center" moment across the week.

**Step 5 — Bonus Quest.** Each day, one optional quest one difficulty tier harder than the user's current average, worth 1.5× its base XP, no penalty if skipped.

**Step 6 — Weekly Quest.** At the start of each 7-day block, one bigger goal tied to the user's top-weighted improvement area (the first one selected in the quiz) — e.g. "finish one book this week," "hit the gym 4x this week."

**Step 7 — Quiet difficulty ramp.** Every 2 weeks, re-run Step 3's scaling logic against the user's actual current stats (not just baseline), so quests keep pace with real progress without ever feeling like a sudden spike.

**Editability:** Program Preview always shows the Step 1–6 output before the user commits, and every quest can be swapped for another template in the same category — the algorithm produces a starting point, never a locked plan.

### 5.4 Rewards system
1. **XP & Levels** — §5.1
2. **5 Stats rising** — visible per-quest gain (§5.2), no hidden mapping
3. **Streaks** — daily counter, resets softly under Hard Mode (§5.6). Milestone markers at Day 3, 7, 14, 21, 33, 50, 66.
4. **Achievement Cards** — unlocked by milestone days AND hidden/quirky behaviors (e.g. "every quest before 8am for 3 days," "first perfect week"). Each card: art, a quote, the unlock condition text, date earned.
5. **Motivation Cards** — one per day, pulled from the quote dataset matched to the user's chosen improvement areas (not random). Rarity tiers Common → Rare → Master-Rare → X-Rare, each with a serial number (e.g. `C214`).
6. **Program Complete recap** — Day 1 vs Day Final across all 5 stats, total quests completed, longest streak, journal entry count.

Explicitly excluded: gear, loot, equipment, boss fights. Character Mode is visual-only, stat-driven, no combat system.

### 5.5 Quest system
Quest types: checkbox, quantity-logger (inline `+250mL` style stepper), duration-timer (meditation/deep work), reading-quest (wired to XP, tied to a reading library entry), video-quest (external link, self-report complete, wired to XP), workout-logger (sets/reps/tempo or sets/kg). Difficulty tiers Easy/Medium/Hard scale XP per §5.1.

Two additional mechanics: Bonus Quest and Weekly Quest, per §5.3 Steps 5–6.

### 5.6 Hard Mode
Opt-in via Settings. If enabled and a day rolls over with quests still pending: streak resets to 0, a clear factual message is shown (not punitive language), and the next day starts as a lighter make-up day (fewer/easier quests) rather than wiping progress back to Day 1. No full-reset penalty at any point — a deliberate softening of the reference app's mechanic.

### 5.7 Notification system
8 types, tone locked encouraging/authentic, never guilt:
1. Daily quests ready (morning, rollover-timed)
2. Tasks remaining check-in (afternoon/evening if quests open)
3. Streak-at-risk (evening, only if streak would break at rollover)
4. Milestone reached (Day 3/7/14/21/33/50/66)
5. Screen Blocker session start/end confirmation
6. Today's Motivation Card ready
7. Journal nudge (evening, optional, never mandatory)
8. Weekly recap (stats/progress summary)

## 6. Screen inventory

Full screen-by-screen detail lives in `FOCUS-app-structure-and-screen-flow.md` — 28 screens across pre-app onboarding (6), main 5-tab shell (16), and triggered overlays (6):

- **Pre-app:** Splash, Welcome, Onboarding Quiz, Baseline Result, Program Preview, Account creation
- **Main shell (5 tabs — Home, Stats, Journal, Tools, Profile):** Home, Quest detail/logging modal, Stats, Journal list, Journal new/edit entry, Tools hub, Reading Library, Reading lesson/reader view, Video Quests, Meditation, Pomodoro, Workout Logger, Screen Blocker, Profile, Achievements, Settings
- **Overlays:** Today's Motivation Card, Quest complete micro-celebration, Milestone Celebration, Hard Mode missed-day consequence, Program Complete, Restart/New Program

## 7. Still open (product-level)

None remaining — all three product-level open items resolved 28 Jul 2026 (see below). Anything that surfaces once the app is actually in use (e.g. a stat mapping that feels wrong in practice) gets revisited then, not treated as pre-existing open work.

**Resolved 28 Jul 2026:**
- **Stat-mapping table** — confirmed final (§5.2).
- **Content sourcing** — approach confirmed: seed a small starter set in the DB to start (already the Phase 1 plan), pull from content APIs where a suitable one exists for quotes/books (requiring an API key — normal, budget for it), and for public-domain books Jodos finds free sites/authors himself and brings them to Claude to verify public-domain status before anything is added. This is an ongoing, additive pipeline (add sources over time, not a one-time scrape) rather than a single upfront license decision. Reading quests also track a duration value (e.g. "30 min of this book") tied to XP, per the quest-logging pattern already defined in §5.5.
- **Onboarding question copy** — final 7-screen quiz written, see `FOCUS-app-structure-and-screen-flow.md` §3. Two gaps caught during drafting and fixed: the optional "what's not working" answer now gets echoed back on Baseline Result instead of going unused, and Screen 1's 3-5 selection limit is a specified UI rule, not just copy.

---

Related documents: `FOCUS-development-plan.md` (tech stack, data models, phase-by-phase build spec), `FOCUS-app-structure-and-screen-flow.md` (full screen detail), `FOCUS-user-story.md` (narrative walkthrough), `LIFE-RESET-RESEARCH.md` (competitor teardown).
