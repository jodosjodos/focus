# FOCUS — Development Plan

Version 1 · 28 Jul 2026
Tech stack, data models, and a deep phase-by-phase build spec. This is the "how to build it" document. For "what Focus is and how each system works," see `FOCUS-project-description.md` — this document assumes that one as context and references it throughout.

---

## 1. Tech stack & architecture

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React Native | No Swift experience; shared code gives a path to Android later (not in scope now) |
| Backend | Full custom NestJS | Deliberate choice over Supabase — Jodos wants to own the whole stack. Respect this; it's informed, not a mistake. |
| Auth | Passport.js strategies (Apple, Google) + JWT + hashed passwords (email) inside NestJS | Established libraries, no hand-rolled crypto |
| Database | Postgres, managed hosting provider | Not self-hosting the DB server — contains operational risk within the "full custom" choice |
| Dev workflow | Local-first | Build and test on local dev backend; stand up real hosted backend in Phase 8 when Jodos is ready to run it on his own phone |

**Why NestJS over Supabase, for the record:** Supabase gives you a managed Postgres + auth + storage + realtime out of the box; NestJS means writing all of that yourself in code. Jodos chose NestJS knowingly to own the whole stack rather than depend on a vendor. The mitigation baked into the stack above (Passport.js instead of hand-rolled auth, managed Postgres instead of self-hosted) is there specifically to keep that choice from becoming a bigger operational burden than it needs to be.

## 2. Core data models (introduced Phase 0, extended later)

**User**
- id, email, auth_provider (apple/google/email), password_hash (nullable), display_name, created_at
- current_program_id (nullable, FK)
- hard_mode_enabled (bool)

**Program** (one per run — a user can have multiple over time, sequential)
- id, user_id (FK), length_days (21–66), start_date, status (active/completed/abandoned)
- baseline_stats (JSON snapshot of Day 1 five stats)
- current_stats (Discipline, Focus, Strength, Confidence, Wisdom — live values)
- current_day (int, 1-indexed)
- streak_count, longest_streak
- total_xp, current_level

**QuestTemplate** (library — not user-specific)
- id, title, description, quest_type (checkbox / quantity / duration / reading / video / workout)
- primary_stat, secondary_stat (nullable)
- difficulty (easy/medium/hard), base_xp
- category (Strength/Discipline/Focus/Wisdom/Confidence/Custom)
- default_target (e.g. "2.5L", "30min", "8 reps") — starting point, scaled per user at generation time
- source_content_id (nullable FK — links to a ReadingEntry or VideoLink row for those quest types)

**Quest** (a QuestTemplate instantiated into a specific user's Program on a specific day)
- id, program_id (FK), quest_template_id (FK), day_number
- is_main_quest (bool), is_bonus_quest (bool)
- status (pending/complete/skipped)
- logged_value (nullable — actual mL/reps/minutes logged)
- xp_awarded, completed_at

**Streak**
- tracked on Program (streak_count, longest_streak) plus a StreakEvent log (date, broke_at_day, reason) for Hard Mode history

Later models (introduced in the phase that needs them, not Phase 0): Achievement, AchievementUnlock, MotivationCard, MotivationCardPull, JournalEntry, ReadingEntry, VideoLink, WeeklyQuest.

---

## 3. Development phases — deep specification

Each phase is written so it can be executed on its own: goal, screens involved, data model changes, business logic, and a definition of done. Sequential — don't start a phase until the previous one's DoD is met. No fixed timeline; quality over speed is the locked pace decision. All system logic referenced below (XP formula, stat mapping, plan-generation algorithm, rewards, notifications) is defined in full in `FOCUS-project-description.md` §5 — this document tells you when/where to build it, that one tells you exactly how it works.

---

### Phase 0 — Technical Foundation
*Not user-facing. No UI ships in this phase.*

**Goal:** a working local dev environment with the app shell and backend skeleton talking to each other, and the core data models in place.

**Build:**
- React Native project scaffolded (React Navigation for the 5-tab + stack shell)
- NestJS project scaffolded: modules for `users`, `programs`, `quests` (empty logic, just CRUD skeletons)
- Postgres schema migrations for: User, Program, QuestTemplate, Quest, plus Streak fields on Program (per §2)
- Passport.js wired for at least one strategy end-to-end (email/password) to prove the auth pipeline before adding Apple/Google
- Local dev docker-compose or equivalent for Postgres, so environment is reproducible
- Basic health-check endpoint + a "hello world" screen in React Native that successfully calls it, proving the full round trip

**Definition of Done:**
- App boots on simulator, hits local NestJS API, gets a real response from Postgres
- A user row can be created via the API and read back
- Auth: can register + log in with email/password and receive a JWT
- No UI beyond a proof-of-life screen — Phase 1 builds the real screens

---

### Phase 1 — Onboarding + Starter Library + Core Loop
*The first version Jodos actually installs and uses.*

**Goal:** a complete, personalized first-run experience and a working daily loop, backed by real (if small) content.

**Screens:** Splash, Welcome, Onboarding Quiz, Baseline Result, Program Preview, Account creation, Home, Quest detail/logging modal, basic Stats screen.

**Starter content to build/seed (ships as DB seed data, not scraped at runtime):**
- ~35 QuestTemplate rows across the 5 stat categories + Custom, covering all 6 quest types
- ~8–10 ReadingEntry rows (mix of original short lessons + public-domain excerpts — verify public-domain status per entry, don't just assume)
- ~10–15 VideoLink rows, curated, categorized
- (Motivation Card quote seed data is Phase 2, not needed yet — Phase 1 has no card UI)

**Business logic:**
- Onboarding quiz captures `improvement_areas`, `baseline`, `program_length` per the plan-generation algorithm's inputs (project description §5.3)
- Baseline Result computes Day 1 Rating: base 30 + adjustment from relevant baseline answers, shifting each stat ±0-15 points off a 30-45 default range — personalized but not arbitrary
- Program Preview runs the full plan-generation algorithm (project description §5.3 Steps 1–4; Bonus/Weekly Quest come in Phase 2) and renders it editable — swap, add, remove before confirming
- Account creation: Apple/Google/email via the Phase 0 auth pipeline, extended with Apple + Google Passport strategies; skippable, falls back to local-only until the user signs in later
- Home: daily quest list generated per Program's current_day, Main Quest flagged, complete/skip actions call quest-completion endpoint which awards XP, updates Stats, updates Streak (all per project description §5.1/§5.2)
- Basic Stats screen: Current vs Potential toggle (Potential = a simple projected end-state number, not yet the full trend-chart version)

**Definition of Done:**
- A new user can complete the quiz, see a real Baseline Result, edit and confirm a Program Preview, optionally create an account, and land on Home with Day 1 quests
- Completing a quest updates XP, the relevant stat(s), and the streak counter, live
- Skipping a quest doesn't crash the day-complete logic
- Day rolls over correctly at whatever cutoff time is chosen (pick one, e.g. 4am local, document it — see §4 open items)
- This version is installed on Jodos's own phone and used for at least a few real days before Phase 2 starts

---

### Phase 2 — Reward Layer

**Goal:** make progress feel rewarding beyond the raw numbers — streaks with real celebration, collectible cards, and the two new quest mechanics.

**Screens:** Milestone Celebration (full-screen), Achievements grid + card detail, Today's Motivation Card overlay, Quest complete micro-celebration (upgraded from Phase 1's plain state change).

**Data model additions:** Achievement, AchievementUnlock, MotivationCard, MotivationCardPull, WeeklyQuest (extends Quest or a parallel table — a WeeklyQuest row per Program per week, same status/logging shape as Quest but spanning 7 days).

**Content to seed:** ~150 starter quotes for Motivation Cards, tagged by which improvement area(s) they resonate with (for the matching logic); a starter Achievement list covering the 7 milestone days plus 5-10 hidden/quirky ones.

**Business logic:**
- Milestone check runs on day-rollover: if current_day matches {3,7,14,21,33,50,66} (scaled to what's reachable within the chosen program_length), trigger Milestone Celebration with Day 1 vs Now stat comparison, and unlock any Achievement tied to that day
- Hidden achievement checks run as a set of small rules evaluated on relevant events (e.g. quest-completed-before-8am counter, perfect-week counter) — implement as a simple rules table, not hardcoded scattered conditionals, so adding a new hidden achievement later doesn't mean touching completion logic everywhere
- Motivation Card: one pull per day, matched via a simple weighted-random selection favoring quotes tagged to the user's improvement_areas over the full pool
- Bonus Quest generation per project description §5.3 Step 5; completion awards 1.5× XP
- Weekly Quest generation per project description §5.3 Step 6; progress tracked across the 7-day span, completion/failure resolved at week boundary

**Definition of Done:**
- Hitting a milestone day produces the full-screen celebration with real before/after numbers and (where applicable) an unlocked Achievement Card
- Achievements grid shows locked (`?`) vs unlocked cards correctly, tapping an unlocked one shows its full detail
- A Motivation Card appears once daily, dismissible, showing rarity + serial number
- Bonus Quest and Weekly Quest both appear correctly and award XP/progress as designed

---

### Phase 3 — Journal + Tools

**Goal:** round out the daily toolkit — reflection, focus tools, and the two content-browsing screens that make Reading/Video quests feel like real libraries, not just quest-list line items.

**Screens:** Journal list, Journal new/edit entry, Tools hub, Reading Library browse, Video Quest list, Meditation player, Pomodoro/Focus Timer, Workout Logger.

**Data model additions:** JournalEntry (mood scale, text, optional photo URL, date, program_id).

**Business logic:**
- Journal: simple CRUD, chronological + optionally calendar view, photo attach via device picker
- Reading Library: browsable by category, independent of whether a given entry is assigned as today's quest — browsing and completing from the library also awards XP/Wisdom if that entry maps to an active Quest row, otherwise marks it as "read" without XP (so users can read ahead or explore without gaming the reward loop)
- Video Quest list: same pattern as Reading Library — external link out, return to app, self-report complete
- Meditation: guided session player (audio playback — flag now: needs either a TTS pipeline or recorded audio asset, decide which before building this screen, don't default silently — see §4 open items)
- Pomodoro: standard focus timer, completion feeds Focus quests if one is active that day
- Workout Logger: per-exercise set table (reps/tempo or kg), add/remove sets, feeds Strength quests

**Definition of Done:**
- All four tools (Journal, Meditation, Pomodoro, Workout Logger) function standalone, independent of whether a quest is tied to them that day
- Reading Library and Video Quest browsing screens show the full starter catalog from Phase 1, with clear visual distinction between "assigned as today's quest" and "just browsing"

---

### Phase 4 — Screen Blocker, Both Modes

**Goal:** ship both the low-risk Reminder Mode and the real OS-level Block Mode, since both were locked as v1 scope.

**Screens:** Tools → Screen Blocker (mode picker, session setup, active-session state for Block Mode).

**Business logic:**
- Reminder Mode: in-app scheduled reminder/nudge, no OS permission needed — build and ship this first since it carries no native-integration risk
- Block Mode: requires iOS Screen Time frameworks — FamilyControls (authorization request), ManagedSettings (applying the actual restriction), DeviceActivity (scheduling/monitoring the session window). Needs: a permission request flow (one clear explanatory prompt, not buried), an app-selection picker (using FamilyActivityPicker), session start/end logic, and a way to end early with deliberate override (not silently bypassable, but not a dead-end trap either)
- This phase is explicitly flagged as the hardest native-integration work in the whole roadmap — budget real research/spike time before committing to an implementation approach, since Screen Time APIs are iOS-version-sensitive and have real edge cases (e.g. what happens if the app is force-quit mid-session)

**Definition of Done:**
- User can pick Reminder Mode or Block Mode per session (or set a default)
- Block Mode genuinely restricts selected apps for the session duration on a real device (simulator won't fully prove this — needs physical device testing)
- Screen Blocker session start/end notifications fire correctly (notification type 5, project description §5.7)

---

### Phase 5 — Full Content Expansion

**Goal:** scale content now that the mechanics are proven — this is explicitly sequenced after Phases 1-4, not before, per the sequencing fix Jodos caught earlier in the process.

**Build:**
- Expand ReadingEntry library well beyond the ~8-10 starter entries — more categories, more depth, continued public-domain-only sourcing (or clearly licensed original content) with the sourcing method itself decided here (still an open item — resolve licensing approach before scraping anything at volume)
- Build out the full Motivation Card quote dataset toward real scale, replacing the ~150-quote starter set, with better area-tagging for the matching logic
- Expand VideoLink curation across more categories

**Definition of Done:**
- Reading Library and Video Quest lists no longer feel like a "starter demo" — meaningful browsing depth
- Motivation Card matching feels genuinely varied over weeks of daily use, not repetitive
- A documented content-sourcing/licensing method exists and was actually followed, not assumed

---

### Phase 6 — AI Art Pass

**Goal:** replace the Phase 0-1 minimal design system (project description §4) with generated art, now that the mechanics it needs to represent are stable.

**Build:**
- Character visual: generated art states that shift in appearance as the 5 stats rise (define the mapping — e.g. distinct visual tiers per stat threshold — before generating assets, so the art pipeline has a spec to hit, not vibes)
- Achievement Card art: one illustration per achievement, consistent style/prompt template so the collection feels like a coherent set, not a grab-bag
- Motivation Card art: consistent template per rarity tier (Common through X-Rare should visually escalate)
- All new art keys off the design system's color palette as its anchor, so the transition from flat-design to illustrated doesn't feel like a different app

**Definition of Done:**
- Every Achievement and every rarity tier of Motivation Card has real generated art, not a placeholder icon
- Character visual updates are visibly distinct across at least a few stat thresholds

---

### Phase 7 — Notification System Polish

**Goal:** build out and tune all 8 notification types (project description §5.7) to full production quality (some may have had rough stub versions earlier alongside the feature they belong to — e.g. Screen Blocker session notifications from Phase 4 — this phase is where the full system gets built consistently and tuned).

**Build:**
- All 8 types implemented with the locked encouraging/authentic tone, no guilt language anywhere
- Timing logic finalized: rollover time, evening check-in window, streak-at-risk trigger condition
- Settings toggle per notification type (or grouped), respecting the locked "tone is not configurable to guilt-mode" rule — user can turn notifications on/off, not change their tone

**Definition of Done:**
- All 8 notification types fire at the correct trigger conditions in real testing over at least a few real days
- Copy for every notification type has been actually written (not placeholder "Notification text here")

---

### Phase 8 — Backend Hardening + Publish Prep

**Goal:** move from local dev to something Jodos can actually run and eventually submit.

**Build:**
- Stand up the real hosted backend (managed Postgres provider + NestJS deployment target — pick a host, e.g. Railway/Render/Fly.io-style managed deploy, decide when this phase starts)
- Environment config separation (dev/prod), secrets handling, basic monitoring/error logging
- App Store submission prep: App Store Connect listing, screenshots, privacy policy (needed even for a free app that collects account data), TestFlight build for real-device testing before submission

**Definition of Done:**
- App runs against the real hosted backend from Jodos's own phone, not localhost
- TestFlight build installed and used for a real multi-day test
- App Store submission materials complete and ready to submit

**Explicitly not on this roadmap:** Friends/Seasons (social layer), Android, in-app video playback, avatar customization — all deferred, not cut, no phase assigned yet.

**New idea, captured 30 Jul 2026, not yet brainstormed:** a budget management system — a shortcut-style mechanism that automatically detects incoming messages related to payments/debt received, surfacing that on a web companion. No design decisions made — quest type, data model, notification tie-in, and whether this connects to the existing Wealth-mapped quests (project description §5.2) are all open for a real brainstorm later. Captured here only so it isn't lost.

---

## 4. Still open (technical)

- Hosting provider choice for Phase 8 — the only item still genuinely open, and it doesn't need deciding until that phase starts

**Resolved 28 Jul 2026:**
- **Day-rollover cutoff:** 4am local. Chosen over midnight to give a grace window for staying up late without cutting the day short — standard pattern in habit/streak apps.
- **Meditation audio:** TTS (text-to-speech) to start. Write scripts, engine reads them live — fast to ship, easy to expand the session library. Can swap to recorded human audio later in Phase 6 (art/polish pass) if the robotic voice doesn't hold up in real use.

---

Related documents: `FOCUS-project-description.md` (product vision, systems, screens), `FOCUS-app-structure-and-screen-flow.md` (full screen detail), `FOCUS-user-story.md` (narrative walkthrough), `LIFE-RESET-RESEARCH.md` (competitor teardown), `DEFERRED-IMPLEMENTATION.md` (implementation-level gaps/stubs tracked per phase).
