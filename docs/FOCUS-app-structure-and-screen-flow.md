# FOCUS — App Structure & Screen Flow

Version 1 · 28 Jul 2026
Built from every decision locked in the 27–28 Jul brainstorm. See the Life Reset research docs for what we're deliberately keeping, cutting, and improving on.

---

## 1. Navigation shell

Bottom tab bar, 5 tabs:

| Tab | Icon idea | Purpose |
|---|---|---|
| **Home** | sun/quest | Today's quests — the screen you open 3x a day |
| **Stats** | bar chart | Your Rating, 5 stats, per-habit history |
| **Journal** | pencil | Daily mood + text + photo entry |
| **Tools** | grid | Reading, video, meditation, pomodoro, workout, screen blocker |
| **Profile** | avatar | Character visual, Achievements, Settings |

No Friends or Seasons tab in v1 — deferred and documented in section 6.

Home's top bar carries three persistent pills regardless of which tab you're on-screen from: 🔥 streak · ⚡ XP · a shortcut into Achievements. Settings is reachable from Profile (not duplicated on Home, unlike Life Reset's redundant gear icon).

---

## 2. Full screen inventory

### Pre-app (before the main shell)
1. Splash
2. Welcome (1–2 slides, honest value prop — no inflated stats, no fake urgency)
3. Onboarding Quiz (multi-step)
4. Baseline Result (Day 1 Rating)
5. Program Preview (auto-generated quests, fully editable before you commit)
6. Account creation (lightweight — Apple/Google/email, mainly for backup/sync; skippable for local-only use since this starts as a personal build)

### Main shell (5 tabs)
7. Home
8. Quest detail / logging modal (opens from Home)
9. Stats
10. Journal — entry list
11. Journal — new/edit entry
12. Tools hub
13. Tools → Reading Library
14. Tools → Reading Library → Lesson/reader view
15. Tools → Video Quests (external link list)
16. Tools → Meditation
17. Tools → Pomodoro / Focus Timer
18. Tools → Workout Logger
19. Tools → Screen Blocker (reminder version)
20. Profile
21. Profile → Achievements (grid + card detail)
22. Profile → Settings

### Overlays / full-screen moments (triggered, not navigated to)
23. Today's Motivation Card (daily, dismissible)
24. Quest complete micro-celebration
25. Milestone Celebration (full-screen, day markers)
26. Hard Mode: missed-day consequence screen
27. Program Complete (final day summary)
28. Restart / New Program

---

## 3. Screen-by-screen detail

### 1–2. Splash → Welcome
Logo, one-line value prop. No manufactured social proof numbers (we don't have 1.5M users — don't pretend to). 1–2 slides max explaining the idea: "Pick what to fix. Get a plan. Do it for 21–66 days. Watch yourself change." Continue → Quiz.

### 3. Onboarding Quiz (final copy, confirmed 28 Jul 2026)
Straightforward and honest, per the locked decision — this explicitly does **not** copy Life Reset's loss-aversion/affirmation-interstitial funnel. Real questions only, each one feeding the plan. 7 screens, progress bar, back button, one question per screen:

1. **What do you want to improve?** — "Pick 3 to 5. This shapes your whole plan." Multi-select: Sleep, Body, Focus, Discipline, Confidence, Mind, Wealth, Relationships, Career, Habits. (Reconciled naming: "Money" → "Wealth" to match the stat-mapping table.) **Selection rule:** Continue stays disabled until 3 are picked; a 6th tap is blocked until one is deselected — enforced in the UI, not just copy.
2. **How much do you usually sleep?** — Under 5h / 5–6h / 6–7h / 7–8h / 8+h
3. **How much water do you drink on a normal day?** — Under 1L / 1–2L / 2–3L / 3L+
4. **How often do you currently exercise?** — Never / 1–2x a week / 3+ times a week
5. **About how much screen time do you get in a day?** — Under 2h / 2–4h / 4–6h / 6+h
6. **How long do you want to commit?** — "66 days is the full program. You can start shorter — 21 days minimum." 21 / 33 / 50 / 66 days (default, pre-selected)
7. **Anything specific that's not working right now? (optional)** — "Totally optional — skip if you'd rather just start." Free text, Skip button always visible. **This answer is not decorative** — it's echoed back verbatim on the Baseline Result screen (see below), so it isn't a question the app asks and then does nothing with.

No dead-end affirmation screens with nothing to do but tap continue.

### 4. Baseline Result
Shows your **Day 1 Rating** — computed from quiz answers, not fake. Five stats at their starting values (Discipline, Focus, Strength, Confidence, Wisdom), plus a **Day-Final potential** preview so the gap is visible and motivating, same trick Life Reset uses well, just built on real numbers. If Screen 7 was answered, it's echoed back near the top ("You told us: '{their text}'") before the stats — small thing, but it's what makes that question worth asking at all.

### 5. Program Preview
The generated quest list (3–5/day default, editable), each one showing **which stat it feeds and how much** — visible upfront, unlike Life Reset which hides this entirely. Add/remove/edit before confirming. This is the screen that actually closes their "same plan for everyone" complaint: the plan must visibly trace back to quiz answers.

### 6. Account creation
Apple/Google/email sign-in for backup and future sync. Skippable — local storage works standalone since Jodos is the first real user.

---

### 7. Home
The core screen.

- Top pills: `🔥 streak` · `⚡ XP` · achievements shortcut
- `Day X / Length` with `<` `>` day-scrub, encouragement line
- Filter row: `To-dos` / `Done` / `Skipped`
- One or more **Main Quest** cards (flagged, worth more XP) + regular quest cards
- Each card: title, frequency, difficulty tier (Easy/Medium/Hard), streak badge, and **the stat(s) it feeds shown inline** (e.g. "+Strength +Discipline")
- Swipe or tap to complete/skip
- Quantity-based quests (water, distance) show inline progress like Life Reset's `+250mL` stepper

### 8. Quest detail / logging modal
Opens on tap for anything beyond a simple checkbox — reps/sets/tempo for workouts, mL for water, minutes for meditation. Shows the stat-gain preview before confirming.

### 9. Stats
- Rating card: Current vs Potential toggle, 5 stats with deltas
- Per-quest-type history charts (weekly bars, like Life Reset's water chart) — but **no fabricated causal claims** ("Focus +15% because...") — we show correlation as correlation, not asserted fact
- Journey time / days completed / longest streak

### 10–11. Journal
List view (chronological or calendar), new entry: mood scale, text, optional photo attach. Builds the 66-day timeline.

### 12. Tools hub
Grid of the six tools, each opening its own flow:

| Tool | v1 behavior |
|---|---|
| Reading Library | In-app, wired to XP (the actual gap we're closing) |
| Video Quests | Opens external link (YouTube etc.), self-report completion for XP |
| Meditation | Simple guided session player |
| Pomodoro | Focus timer |
| Workout Logger | Sets/reps/tempo or sets/kg, like Life Reset's actually-good gym logger |
| Screen Blocker | Reminder/warning only in v1 (full OS-level blocking is a later phase) |

### 13–14. Reading Library
Categories with counts (Psychology, Philosophy, Wealth, Discipline, etc.), cards with cover art, read time, source. Content is a mix of original short lessons and public-domain excerpts (per locked decision). **Every entry is a real quest — completing it earns XP and feeds Wisdom**, closing the exact gap Life Reset left open.

### 15. Video Quests
List of curated video links by category. Tap → opens externally → return to app → mark complete → XP awarded. Flagged for later: bring playback in-app so users never leave.

### 16–19. Meditation / Pomodoro / Workout Logger / Screen Blocker
Standard utility screens. Workout Logger mirrors Life Reset's genuinely good implementation: per-exercise set table (reps/tempo or kg), add/remove sets, exercise counter.

### 20. Profile
Simple character visual (per locked decision: **simplest version** — appearance shifts with your 5 stats, no gear, no fights, no loot system) + entry points to Achievements and Settings.

### 21. Achievements
Grid of collectible cards (locked = `?` tile, unlocked = full art). Unlocks are **milestones (day markers, streak length) plus quirky/hidden ones** (per locked decision) — e.g. "finished every quest before 8am," "first perfect week." Tapping a card shows art, a quote, the unlock condition, and the date earned — closer to Life Reset's actual card system (which is much richer than their public marketing suggests) than to a plain badge.

### 22. Settings
Edit Program (add/remove/adjust quests), Hard Mode toggle, Notifications tone (locked to encouraging/authentic — not configurable to guilt-mode), Backup, Language, Account, About.

---

### 23. Today's Motivation Card
Shown once per day (not gating anything — dismissible), pulled from the quote dataset and matched to the user's profile rather than random. Mix of real public-domain quotes and original lines, per locked decision.

### 24. Quest complete micro-celebration
Small animation on completing a quest — XP tick-up, stat bar nudge. Not a full-screen interrupt; keep the loop fast.

### 25. Milestone Celebration
Full-screen (per locked decision — bigger than a badge popup). Triggered at day markers (7, 21, 33, 66 or wherever the chosen program length lands). Shows Day 1 vs Now stat comparison, possibly unlocks an achievement card.

### 26. Hard Mode: missed-day consequence
If Hard Mode is on and a day is missed: **soft consequence**, not Life Reset's full wipe-to-Day-1. A streak reset, an XP penalty, or a penalty quest — shown clearly, framed factually, not punitively.

### 27. Program Complete
Final-day summary: Day 1 vs Day Final across all 5 stats, total quests completed, longest streak, journal entry count. This is the screen Life Reset never really built — their users say the app has "nothing after day 66." Ours should end with a clear next step, not a dead end.

### 28. Restart / New Program
Options from Program Complete: start a new (possibly harder/longer) program, keep using Tools standalone, or just stop — no dark patterns pushing a restart.

---

## 4. User flows

**First-time:** Splash → Welcome → Quiz → Baseline Result → Program Preview (edit if wanted) → Account (or skip) → Home, Day 1.

**Daily loop:** Open app → Today's Card (dismiss) → Home shows Day X → complete quests (XP + stat rise + streak) → day-complete micro-celebration → optional Journal entry → close.

**Weekly:** Check Stats for trends, check Achievements progress, use Tools as needed.

**Milestone:** Hitting a day marker → full-screen celebration → back to Home.

**Missed day (Hard Mode on):** soft penalty applied and explained → back to Home, program continues.

**Completion:** Final day's quests done → Program Complete summary → choose to restart, keep using Tools, or stop.

---

## 5. What we're deliberately fixing vs Life Reset

| Their gap | Our fix |
|---|---|
| Quiz asks 15+ questions, plan barely changes | Plan visibly traces to quiz answers; stat mapping shown upfront |
| Reading library disconnected from XP/quests | Reading is a real quest type, wired to XP and Wisdom |
| No video content at all | Video quests exist (external v1, in-app later) |
| Paywall right after emotional investment | No paywall, ever, on the core loop |
| Nothing after Day 66 | Program Complete screen with a real next step |
| Hidden habit→stat mapping | Shown on every quest card |
| Guilt-toned notifications | Encouraging, authentic tone, locked |
| Manufactured urgency in onboarding | Honest, straightforward quiz |
| Hard Mode either can't be turned off or contradicts itself in their docs | Ours is opt-in, softer, clearly explained |

---

## 6. Explicitly deferred (not cut — documented for a later phase)

- **Friends & Seasons** — social layer, leaderboards, oaths. Build once there's someone besides Jodos to use it with.
- **Full Screen Blocker** — real OS-level app blocking (iOS Screen Time APIs). v1 ships the reminder-only version.
- **In-app video playback** — v1 links out; later phase brings it native.
- **Avatar customization** — deferred per locked decision.

---

## 7. Still open

- Final stat-mapping table (proposed in `focus-app-decisions.md`, not yet confirmed in practice)
- Exact XP values per quest / leveling curve numbers
- Full onboarding question wording (style is locked: honest, no manipulation — exact copy not yet written)
- Tech stack (not discussed yet)
