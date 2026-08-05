# Deferred Implementation

Things skipped, stubbed, or simplified during active development — tracked here so they don't get lost, per phase. Not product-level "explicitly deferred" items (those live in the other docs' own sections) — this is implementation-level: real work that needs to happen, blocked on something (usually external credentials or a later phase's infra), or a placeholder decision worth revisiting once there's real usage.

---

## From Phase 1

### Apple Sign-In — blocked on credentials
Account creation screen renders an Apple button, disabled/"Coming soon". Real wiring needs:
- Apple Developer Program membership (paid, $99/yr)
- Sign In with Apple capability enabled on the App ID
- A Services ID + private key for the Passport `apple` strategy (`apps/backend/src/modules/auth/strategies/apple.strategy.ts` — not yet created)

Come back once Jodos has (or gets) these.

### Google Sign-In — blocked on credentials
Same pattern, disabled "Coming soon" button. Needs:
- A Google Cloud project + OAuth 2.0 client ID/secret
- Configured redirect URI for the Passport `google` strategy (`apps/backend/src/modules/auth/strategies/google.strategy.ts` — not yet created)

### True offline / local-only account mode — not built
Docs originally described account creation as "skippable — local storage works standalone." Decided in Phase 1 planning to make account creation effectively required instead (fast email/password, not a heavy wall) rather than duplicate plan-generation + XP/stat/streak logic client-side. If a real need for genuine offline-first use emerges later, this needs its own design pass — it's a meaningful scope item, not a quick add.

### Step 7 — quiet difficulty ramp — deferred
Project description §5.3 Step 7 (re-running Step 3's scaling logic every 2 weeks against current stats, not just baseline). Deferred to land alongside Phase 2's Bonus/Weekly Quest infra, since they touch the same generation cadence code.

### Video content — search-sourced, not fully curated
Phase 1 seeds ~10-15 VideoLink rows found via live web search (real URLs, not fabricated) to satisfy Program Preview needing real variety. This is *not* the real curation pass — Phase 5 (Full Content Expansion) is where video curation gets done properly across more categories.

### Reading content — original lessons only
~8-10 original short lessons (written directly, not sourced) to avoid any public-domain verification risk during active build. Public-domain excerpts are still the plan (per the locked content-sourcing decision in `FOCUS-project-description.md` §7) — Jodos brings vetted sources when ready, verified before adding, same seed-file pattern.

### Placeholder numeric formulas — revisit once there's real usage
These were genuine gaps in the spec (no exact numbers given), so I picked defensible defaults. Each lives in one isolated function, easy to retune:
- **Day 1 Rating deltas**: Discipline/Strength driven by real baseline answers; Focus/Wisdom/Confidence default to a flat +7 (quiz has no direct numeric signal for these three).
- **Day-Final "Potential"**: flat `baseline + 20` (capped 100), regardless of program length.
- **Stat gain per quest completion**: +2/+3/+4 primary (easy/medium/hard), +1/+1/+2 secondary.
- **Daily quest count**: one quest per chosen improvement area, capped at 4/day for programs ≤30 days.

None of these are architecture — all safe to change in-place once Jodos has used the app for real and something feels off.

### Program Complete screen — stub only
If a program's computed day exceeds `lengthDays`, the backend clamps and marks `status='completed'`; Home shows a plain text stub, not the real full-screen recap (Day1 vs Final stats, longest streak, etc.). That screen isn't in Phase 1's screen list — building it properly is still open, no phase explicitly assigned yet beyond "obviously needed eventually."

### Typography — display font
Design system (`FOCUS-project-description.md` §4) calls for a rounded geometric sans (Nunito or Baloo 2) for headline/big-number text. Not wired in Phase 0's proof-of-life screen; wired starting Phase 1 since real day-counter/XP numbers exist now.

### Resolved: emoji tofu boxes on iOS 26.3 Simulator runtime
🔥/⚡ rendered as tofu boxes early in Phase 1 testing — traced to a confirmed Apple bug: the iOS 26.2/26.3 Simulator runtime ships with a corrupted/missing Color Emoji font (real devices and other simulator runtimes are unaffected; fixed upstream in Xcode 26.4+). Confirmed via a bare unstyled `<Text>` emoji test that still failed, and confirmed persistent across a full simulator reboot — ruled out font-conflict/app bug entirely.

**Fix:** switched the dev simulator from the iPhone 17 (iOS 26.3.1) device to the iPhone 17 (iOS 26.5) device already available locally (`xcrun simctl list runtimes`) — emoji render correctly there. Emoji are back in Home/Stats. If emoji ever show as tofu again on a given simulator, check its runtime version first before assuming an app bug — avoid the 26.2/26.3 runtimes for this project's simulator testing.

---

## From the visual system overhaul (30 Jul 2026)

Design source: Claude Design project **"Focus app mobile prototype"** (`projectId: 30309de8-9873-4834-8dbe-a77086ebaa2a`, `https://claude.ai/design/p/30309de8-9873-4834-8dbe-a77086ebaa2a`, file `Focus App.dc.html`). It sketches the **entire app across every phase** — only the Phase 1 screens (onboarding funnel, Home, Stats) were built from it. When each later phase starts, pull its screens from this same project first before designing from scratch:
- **Phase 2** (Rewards): Achievements grid/detail, Motivation Card overlay, Milestone Celebration overlay, Quest-complete overlay — all sketched (`isAchievements`, `isOverlayMotivation`, `isOverlayMilestone`, `isOverlayQuestComplete`)
- **Phase 3** (Journal + Tools): Journal list/entry, Reading Library + lesson reader, Video Quest list, Meditation player, Pomodoro, Workout Logger (`isJournal`, `isJournalEntry`, `isReading`, `isReadingLesson`, `isVideo`, `isMeditation`, `isPomodoro`, `isWorkout`)
- **Phase 4** (Screen Blocker): real Block Mode screen (`isBlocker`) — the onboarding `LockTeaserScreen` built now is just a static teaser, not the real feature
- **Phase 7** (Hard Mode consequence): `isOverlayHardMode`, `isOverlayRestart`

### Age — collected, not persisted
`AgeScreen` collects age into `OnboardingContext` (default 24) but it's never sent to the backend — no column on `Program`/`User` for it, and nothing currently reads it. Wire it up once there's an actual use (e.g. age-adjusted baseline scaling), rather than adding a dead column now.

### Week-dots strip and Stats sleep-trend chart — deferred
Both appear in the design's Home/Stats screens but need a new backend endpoint aggregating multiple days of quest/sleep history that doesn't exist yet (today's endpoints are single-day). Revisit once there's a real reason to build day-range aggregation (Phase 2's streak/milestone work is a natural place to add it).

### Achievements link, Bonus Quest card, Weekly Quest card — omitted from Home/Profile
All three appear in the design but their generation logic is Phase 2 scope (`plan-generation.service.ts` only implements §5.3 Steps 1-4). Showing the static cards now would be fake UI with no data behind it — add them back when Phase 2 builds the real thing.

### Glass card treatment — first use of `expo-blur`
`GlassCard` (`apps/mobile/src/components/GlassCard.tsx`) wraps `BlurView` — this is the first screen work using it. Reuse this component for any new card surface in later phases rather than re-implementing the blur/tint/border recipe inline, so the look stays consistent.

### Journal count, real avatar photo — not built
Profile's stat-pill row omits a "journal entries" pill (Journal doesn't exist until Phase 3) and the avatar is an icon placeholder, not a real photo picker (no photo pipeline yet, same reasoning as quest-card images below).

### Quest card / Program Preview images — colored icon block, not photos
The design uses real photo images per quest (`image-slot`). Built version uses a colored square tinted to the quest's primary stat instead — no photo curation pipeline exists yet. Revisit if/when quest imagery becomes a priority (no phase currently assigned).

---

## Plan-generation algorithm — smarter selection, not built

Current `plan-generation.service.ts` picks templates by fixed rule: filter category+difficulty, dedupe, pick first fit. Deterministic, explainable, zero personalization signal beyond the quiz answers + baseline scaling. Works fine for v1, but has real room to grow once there's usage data:

- **Completion-rate weighted picking**: track per-template complete/skip rate per user (or globally). Prefer templates the user actually finishes over ones they skip, instead of first-match. Needs a `QuestTemplate` completion-stats aggregate — doesn't exist yet.
- **Skip/swap signal feedback loop**: if a user repeatedly swaps a template out in Program Preview or skips it once assigned, treat that as a negative signal for future day-generation for that user (not global) — currently swaps/skips are pure UI/completion actions, they don't feed back into `generateDay()` at all.
- **Smarter Step 7 ramp** (already flagged above, Phase 1 section): once quiet difficulty ramp is built, could feed the same completion-rate signal instead of pure baseline-vs-checkpoint scaling.
- **Variety over longer windows**: today's "avoid duplicate categories same day" is single-day only — no cross-day variety check, so the same template can repeat every single day of a 66-day program if it's the only match for a category. Worth a "recently assigned" exclusion window once template pool per category is large enough (Phase 5 content expansion makes this matter more).
- **True recommendation ranking**: the "genius" version — score every eligible template per user (completion history + baseline fit + variety + recency) instead of rule-based first-fit. Real scope item, not a quick add — would need its own design pass, likely after Phase 5 (needs enough template volume for ranking to matter) and enough real usage data (needs Phase 8 hosted backend + real users, not just Jodos's own testing).

No phase assigned — natural home is either alongside Phase 2's Step 7 ramp work or post-Phase 5 once content volume justifies it. Flagging now so it isn't lost.
