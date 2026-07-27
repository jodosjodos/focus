# Life Reset — Full Competitive Teardown

**Research compiled:** 25 July 2026
**Purpose:** Reference document for building our own 66-day self-improvement app (project "focus").
**Method:** Scraped official site, help center, both app stores, social accounts, founder interviews, and third-party growth analysis.

---

## 1. Company & Product Identity

| Field | Value |
|---|---|
| Current name | **Life Reset: 66 Day Habit** |
| Former name | **Rise: Life reset in 66 days** (renamed Nov 2024) |
| Why renamed | Trademark lawsuit from a VC-backed app that owns "Rise" |
| Tagline | "Transform your life in 66 days" / "The #1 self-improvement app to become better" |
| Play Store subtitle | "Gamified daily habit tracker. Build streaks, earn XP, level up your life." |
| Website | lifereset.com (Framer) — old site riseapp.life still live |
| Help center | help.lifereset.com (Intercom + Fin AI) |
| Support | support@lifereset.com · +852 5625 6284 |
| iOS publisher | Savvy Tech Limited |
| Android publisher | Design and Build (dev: Tong Ka Wai) |
| Registered address | Flat D, 10/F, Blk 1, New Haven, 363 Sha Tsui Rd, Tsuen Wan, Hong Kong |
| Bundle IDs | iOS `id6478942469` · Android `build.designand.riselife` |
| Category | Health & Fitness |
| Agency/brand | Design + Build (designand.build) |

### Founders
- **Desmond** ([@desmondhth](https://x.com/desmondhth)) and his brother **Peter** ([@himtkw](https://x.com/himtkw)) — indie hackers from Hong Kong. Desmond was ~24 when the app hit $2M ARR.
- Desmond started building apps in 2022; **launched 4 products before Rise, all failed**.
- Origin story: he hit personal rock bottom, used a 66-day reset program on himself, then turned it into an app.
- Built **iOS-first with Swift/SwiftUI** ("Apple Native"), deliberately skipping Android at launch — "iPhone users are more willing to pay." Built in ~55 days with ~$8K starting costs.

---

## 2. Timeline & Revenue Trajectory ⚠️ *most important section*

| Date | Milestone |
|---|---|
| Mar 2024 | Launched as "Rise" on iOS |
| Jun 2024 | $1K/mo, 5K downloads |
| Aug 2024 | $11K/mo |
| Oct 2024 | Android launched on Google Play |
| Nov 2024 | $20K MRR — renamed to "Life Reset" after trademark suit |
| Aug 2025 | **Peak ~$300K/month** (~$90K/week iOS) |
| Full-year 2025 | **~$1.3M revenue** |
| Feb 2026 | Zero new ad creatives launched — revenue collapse |
| Mar 2026 | ~$19-20K/month — **95% revenue drop**; began recovery |
| Jul 2026 | v6.4.1 shipping; still rebuilding |

### Why it collapsed (per Sparrow Apps teardown, Mar 2026)
1. **Creative volume dropped to zero.** Meta ad creatives launched: Oct 2025 = 73, Nov = 51, Dec = 6, Jan = 6, **Feb = 0**. Revenue tracked it exactly.
2. **Missed the January window** — peak season for health & fitness (New Year's resolutions).
3. **Crossed $1M → Apple commission jumped 15% → 30%**, likely wiping out thin unit economics.
4. **100% dependent on Meta Ads**, no channel diversification.
5. **No weekly subscription tier** — annual plans drive fast early growth but mean no traffic = no revenue, instantly.
6. **Niche RPG/anime aesthetic** resonates hard with young men but caps the addressable market.

> **Takeaway for us:** the product wasn't the problem — the acquisition engine was. Any clone of this business model inherits a paid-acquisition treadmill unless we build an organic/retention-led motion.

---

## 3. Traction Numbers (and their inconsistencies)

| Metric | Value | Source |
|---|---|---|
| Claimed total downloads | 1,500,000+ | App Store description, current |
| Website claims | "1M+", "800K+", "1,500,000+" — **all three appear on different pages** | lifereset.com |
| iOS rating | **4.7** from ~12K ratings | App Store |
| Android rating | **4.4** (Play) / **3.87** (AppBrain calc, 2,433 reviews) | Play / AppBrain |
| Android downloads | 100K+ badge; AppBrain estimates **440K total**, ~18K/mo, ~600/day | AppBrain |
| Countries claimed | "76 countries" (meta) vs "100+" (homepage) | lifereset.com |
| iOS app size | 450.6 MB · Android APK 153.4 MB | stores |
| Languages | 17 (EN, zh-Hant, zh-Hans, JA, KO, ES, FR, DE, EL, RU, PL, PT, TR, ID, MS, KM, HR) | store |
| Min OS | iOS 18.0+ (aggressive) | App Store |
| Instagram @bylifereset | 79.6K followers, 388 posts | Instagram |
| TikTok @bylifereset | **only 371 followers** (new account; old @riseapplife had the audience) | TikTok |
| Play rankings | Top-100 Health & Fitness; Top Grossing #89 SA, #92 CZ, #106 IN, #143 IT, #153 AU | AppBrain |

⚠️ **The download/country numbers are marketing copy, not audited.** They contradict each other across their own pages.

---

## 4. Full Feature Inventory

### 4.1 Core loop
- **66-day program.** Starts immediately on signup. Day 1 is deliberately light and easy.
- **Cannot be paused or stopped** once started — you can only restart from Day 1.
- **New day starts at 4:00 AM** in the user's timezone (consistent all 66 days).
- Tasks editable anytime via Settings → Edit Program (add/delete, adjust **intensity, frequency, schedule**).
- Original Rise version focused on **6 areas: Sleep, Water, Exercise, Mind, Screen Time, Shower.**

### 4.2 Home screen anatomy
**Top bar:** Day Counter (Day X / 66) · Streak 🔥 · Achievements 🏆 · Rating ✨ (XP) · Settings ⚙️
**Task filters:** To-dos / Done / Skipped
**Task card:** name, frequency & difficulty, streak badge
**Bottom nav (6 tabs):** Home · Stats · Journal · Seasons · Friends · Mini Tools

### 4.3 Streaks, Achievements, Ratings
- A day counts toward streak only if you complete **at least 2 tasks**.
- Six streak milestones: **7, 14, 33, 66, 96, 132 days**.
- Achievements unlock via streak length, rating level, or hitting specific days (7, 33, 66).
- **Three ratings shown:** Day 1 Rating (baseline) · Current Rating · Day 66 Rating (max potential). This is a clever "gap visualization" motivator.

### 4.4 Character Mode (RPG layer)
Turns the 66 days into an RPG journey:
- Daily habits become **quests**
- 5 core stats: **Discipline, Focus, Strength, Confidence, Wisdom**
- Task completion rate determines **win/lose on boss fights**
- Different **monsters** as you progress
- **Gear and equipment** ("loot") earned from quests
- Character animates through the day — training, resting, meditating, running

> Heavily inspired by **Solo Leveling** (anime). Devs confirmed this in App Store review replies. Users repeatedly request deeper skill trees and visual character transformation.

### 4.5 Hard Mode
- Miss a day → **back to Day 1**
- Program can't be edited
- Skipping a task = penalty
- One skip day allowed
- **Cannot be manually turned off.** After 2 consecutive failed days the app offers an exit path that preserves progress.

### 4.6 Season Challenge (competitive layer)
- Time-limited **global challenge** with its own duration, XP system, ranks, leaderboard
- Users take a **"Season Oath"** to commit and play fair — and can **see other users' oaths**
- Placed into a **league**, ranked worldwide, tiers (Silver, Gold…)
- Rankings lock when the season timer ends

### 4.7 Motivation Cards (collectible layer)
- **One card per day**, refreshes at 6:00 AM (same card if you retry same day)
- Real quotes from real books/authors
- 5 categories: **Wisdom, Strength, Focus, Confidence, Discipline**
- 4 rarity tiers: **Common, Rare, Master-Rare, X-Rare**
- Explicitly positioned as anti-"quote spam"

### 4.8 Friends & Social
- Invite via **code or link** (iMessage, IG DM, WhatsApp, X)
- Add existing users by invite code → friend request
- Join the same Season, track each other's progress, nudge notifications

### 4.9 Journal
- Daily feelings/thoughts, **emotion tracking**, attach media
- Builds a personal timeline of the transformation

### 4.10 Mini Tools — *note the drift*
| Website says (5 tools) | App Store says (7 tools) |
|---|---|
| Meditation (guided, AI voice) | AI Calorie Tracker |
| Pomodoro / Focus Timer | Focus Timer |
| Workout Counter | Book Summary |
| Book Summary | Meditation |
| Screen Blocker | Screen Blocker |
| | + 2 more (unlisted) |

The website is stale. The app has moved on.

### 4.11 Other
- **Home screen widgets** (iOS small/medium/large; Android resizable) showing day, task progress, streak
- **Dark Mode** (Pro only)
- **Discord community** (Pro only)
- Offline-capable for basic task completion; sync/XP/community need connection
- Manual + cloud backup from Settings
- "Past programs" archive — restarting doesn't delete old data

---

## 5. Monetization

### Free vs Pro
**Free:** onboarding quiz, personalized assessment, custom program generation, basic task completion.
**Pro unlocks:** all mini tools · custom tasks · Seasons Challenge · Hard Mode · historical statistics · Discord community · Dark Mode.

⚠️ Note the contradiction: the App Store description says **all** features require subscription, while the help center says Pro is "a premium addition to the Free program experience." In practice users report a hard paywall right after the quiz.

### Pricing (US App Store IAP list)
$12.99 · $17.99 · $28.99 · $39.99 · $49.99 · $59.99 · $69.99 (Premium)
Multiple SKUs = heavy price testing. **7-day free trial included with the yearly plan.**

### "Win Your Money Back" program
- Complete the 66-day program → **100% subscription refund, keep the subscription**
- Requires: **≥70% task completion** · proof emailed within **7 days** of program end · **paid via Stripe only** (not Apple/Google IAP)
- **US-only since 16 Jan 2026**
- Once per completed 66-day cycle

> Smart mechanic: drives commitment, and the Stripe-only requirement pushes users to the web checkout where they avoid Apple's 30%.

### Refunds
Standard: non-refundable, handled by Apple/Google. Cancelling doesn't retroactively refund.

---

## 6. Marketing & Growth Engine

### Channel
**Meta Ads only**, mostly US-targeted. 800+ creatives in the Meta Ads Library, ~120 active as of Mar 2026.

### Video ad hooks (UGC-dominant)
1. **UGC/personal story** — "Falling in love with turning my life into a game"
2. **Founder hook** — "I made an app that turns your life into Solo Leveling"
3. **Negative list** — "If you want failure: P*rn, Drugs, Fast-food, Procrastination, Social media, Loneliness…"
4. **POV meme** — "POV: that bro with p*rn addiction coming at me 66 days later"
5. **Challenge documentation** — "I turned my life into an RPG game for the next 66 days"
6. **Objection handling** — "You can't just pretend your life is a video game…" then disproves it

### Banner hooks (→ web quiz funnel)
- "SUNDAY, MARCH 22ND we start the LIFE RESET CHALLENGE" (date urgency)
- **"Duolingo, but for self-improvement"**
- "WE'RE LOOKING FOR MEN who haven't exercised in years"
- "The Better-Dad Game" (dads) · "DON'T LET ADHD CONTROL YOU" (ADHD segment, dinosaur mascot)
- "She might leave. But your XP stays forever."

### 🔴 The web funnel pivot — biggest live signal
`lifereset.com/quiz/generic` is now running and it has **changed the core promise**:

- **"Become the strongest version of you in 21 days"** — not 66
- **3-minute quiz**
- **Gender selection first** with two named characters: **Kai** (male) and **Lumi** (female)
- Social proof: "1.5M+ people have started their 21-day reset", 4.7 rating
- Testimonials all rewritten around 21 days
- Payment on web (Stripe) → no Apple commission, better attribution, higher LTV, harder to cancel

> **They are actively testing a shorter 21-day commitment.** That's a strong hint that 66 days is too big an ask at the point of purchase. Worth noting for our own scoping.

### Organic
Desmond's original $0→$20K MRR in 4 months came from **3 viral organic short-form posts**. The IG account (79.6K) is the surviving organic asset; their new TikTok has almost no following.

### The Instagram post you flagged
`instagram.com/p/DaCtkYHgGB-/` — posted **26 June 2026**
> "I made an app that gives me real-life side quests 🎮 Complete daily quests, level up, unlock the version of you you've been promising yourself. #lifereset #sidequest #rpg"

**Performance:** 270,436 views · 7,115 likes · 63 comments

**Comment sentiment — overwhelmingly pricing complaints:**
- "And it will have a subscription" — **272 likes** (top comment)
- "I should I make this for free?" — 49 likes
- "High subscription" — 19 likes
- "I really love it but im broke broo 💔"
- "Make it free pls"
- One commenter promoting their own free DIY alternative

> The single loudest, most-liked reaction to their best-performing creative is **anger about the paywall**. This is the clearest opening in the whole market.

---

## 7. User Sentiment — What People Actually Say

### What they love
- The **RPG / Solo Leveling framing** — "finally makes self-improvement feel like a real-life RPG"
- **Clean art and UI** — repeatedly called out as better than competitors
- The **"1% better each day"** point system
- **Loot/gear reveal** after a day's completion — one long-time user said this was the single thing keeping them in the app
- **Hard Mode** for people who want real stakes

### What they hate
1. **The paywall.** By far #1. "It felt like a free app… after going through all the set-up and excitement you can't go further without paying." Android users especially got no free trial. "Couldn't even start using the app, it's just not free."
2. **Bugs, badly.** Lost streaks, tasks that won't delete, crashes on open, task edits reverting, missing loot images, friends not loading, sync failures. The v6.0 redesign (Jun 2026) introduced a wave of regressions the team publicly admitted to.
3. **Shallow gamification.** Multiple users want deeper RPG: skill trees, visible character transformation, workouts→strength stat, reading→intelligence stat, unlockable abilities.
4. **Overwhelming UI** — "some icons make no sense", hard to reach settings like the screen-blocker timer.
5. **No long-term retention.** "After a year you realise you don't need the app." It motivates via leaderboards/levels rather than working alongside you.
6. **Ads oversell.** "The ads definitely promise more than it has to offer."
7. **Broken promises** — a user reported a promised post-100-day call with a developer where nobody showed up.
8. **JustUseApp safety score: 22.2/100** (mostly driven by billing complaints).

### Named competitors users bring up unprompted
**Habit Legends** (no subscription, story-driven, more flexible task editing), **Finch** (warmer, more engaging), **Habitica** ("just a stylized Habitica with cards"), **Kaizen AI: Reset Life 66 Days**, **Lock In**, **DAWG**, **Arise: Level Up In Real Life**, **QUITTR**, **MainQuest**, **KUBBO**, **Victus**.

---

## 8. Technical & Operational Notes

- **iOS: native Swift/SwiftUI.** Android exists but is the weaker build — most bug complaints come from Android.
- **Backend needs:** accounts (Apple/Google/email), program generation, task state, streak logic, XP/leveling, cross-device sync, cloud + manual backup, leaderboards, friend graph, journal with media storage.
- **iOS 18.0 minimum** — unusually aggressive, cuts off older devices.
- **450 MB iOS app** — very large; suggests heavy bundled art/animation assets rather than streamed.
- **Intercom** for support with Fin AI agent.
- **Stripe** for web payments alongside Apple/Google IAP.
- **Privacy:** collects name, email, contact, payment credentials. Tracks users across apps via Contact Info + Identifiers. Play data safety says "no data shared with third parties," encrypted in transit, deletion on request. Privacy policy last updated 20 Aug 2025 and is thin/boilerplate — Android listing still links to the old riseapp.life policy.
- **32 Android permissions requested.**
- **No ads** in-app.

---

## 9. The 66-Day Claim — Is It Real?

Based on **Lally et al. (2009), University College London**, published in the *European Journal of Social Psychology*. 96 participants adopted a new daily habit; automaticity plateaued at a **median of 66 days**.

⚠️ **The important caveat the whole category ignores:** the actual range was **18 to 254 days**, depending on person and behavior. 66 is a median, not a rule. It's scientifically defensible as a headline but should not be presented as a guarantee.

---

## 10. Strategic Read — Openings for Our App

| # | Opening | Evidence |
|---|---|---|
| 1 | **Generous free tier.** Their most-liked comment on their best creative is a paywall complaint. Every negative review is about the same thing. | IG comments (272 likes), Play reviews, JustUseApp |
| 2 | **Reliability as a feature.** Their bug situation is severe enough to lose paying long-term users. Rock-solid streak/sync logic is a real differentiator. | Reviews across both stores + dev admissions |
| 3 | **Deeper RPG mechanics.** Users are literally writing the spec: skill trees, stat mapping (workout→strength, reading→wisdom), visual character evolution, unlockable abilities. | Multiple detailed App Store reviews |
| 4 | **Retention beyond day 66.** Their own users say the app becomes useless after one cycle. Nobody has solved "what happens after the reset." | Play review, Jun 2026 |
| 5 | **Android quality.** Android is their weak build and where the complaints cluster. | Play reviews, 3.87 vs 4.7 rating gap |
| 6 | **Broader positioning.** RPG/anime skews young male. A warmer or gender-neutral framing (they're now testing Kai/Lumi) opens a much bigger market. | Sparrow analysis + their own quiz pivot |
| 7 | **Shorter first commitment.** They're testing 21 days on the web funnel. 66 may be too big an initial ask. | lifereset.com/quiz/generic |
| 8 | **Don't build a paid-acquisition-only business.** Their collapse was 100% an ad-engine failure. | Sparrow teardown |

---

## 11. Confidence & Gaps

**High confidence (directly observed):** all feature descriptions from the help center, App Store/Play listing copy, pricing SKUs, version history, ratings, IG post metrics, quiz funnel content, founder identity and story, help center structure.

**Medium confidence (single third-party source):** revenue figures ($1.3M 2025, $300K peak, ~$19K now) — all from the Sparrow Apps teardown, which cites Appfigures-style estimates, not company financials. Ad creative counts likewise.

**Low confidence / contradictory:**
- Download counts. The company itself publishes 800K, 1M, and 1.5M on different pages. AppBrain estimates 440K on Android. The real cross-platform number is unknown.
- Country count (76 vs 100+).
- Mini tool count (5 on web vs 7 in store).
- Whether Free tier genuinely allows program use (store copy and help center disagree).

**Not yet gathered:**
- In-app screenshots of actual screens (would need to install the app)
- The full quiz question sequence (funnel requires clicking through)
- Their Discord community size/activity
- The free PDF program they give away (linked from IG bio)
- The paywall screen itself and exact price points shown per geo
- Meta Ads Library creative deep-dive (page ID 239327222605495)

---

## Sources

- [Life Reset — homepage](https://www.lifereset.com/)
- [Life Reset — privacy & terms](https://www.lifereset.com/privacy-policy)
- [Life Reset web quiz funnel (21-day)](https://lifereset.com/quiz/generic)
- [Rise — old site](https://www.riseapp.life/)
- [Help Center — 66-Day Program](https://help.lifereset.com/en/articles/13355468-66-day-life-reset-program)
- [Help Center — Streaks, Achievements, Ratings](https://help.lifereset.com/en/articles/13355441-streaks-achievements-ratings)
- [Help Center — Character Mode](https://help.lifereset.com/en/articles/13355321-character-mode)
- [Help Center — Hard Mode](https://help.lifereset.com/en/articles/13355290-hard-mode)
- [Help Center — Season Challenge](https://help.lifereset.com/en/articles/13355327-season-challenge)
- [Help Center — Motivation Cards](https://help.lifereset.com/en/articles/13355342-motivation-cards)
- [Help Center — Friends and Social](https://help.lifereset.com/en/articles/13355421-friends-and-social)
- [Help Center — Win Your Money Back](https://help.lifereset.com/en/articles/13365697-win-your-money-back-program)
- [Help Center — Home Page anatomy](https://help.lifereset.com/en/articles/13355208-exploring-the-life-reset-home-page)
- [Help Center — Subscriptions and Payments](https://help.lifereset.com/en/articles/13271338-subscriptions-and-payments)
- [Help Center — Common Issues](https://help.lifereset.com/en/articles/13355297-common-issues)
- [App Store — Life Reset: 66 Day Habit](https://apps.apple.com/us/app/life-reset-66-day-habit/id6478942469)
- [Google Play — Life Reset: 66 Day Habit](https://play.google.com/store/apps/details?id=build.designand.riselife)
- [AppBrain — download & ranking estimates](https://www.appbrain.com/app/life-reset-66-day-habit/build.designand.riselife)
- [Sparrow Apps — "From $300K/month to $19K: What killed Life Reset's growth"](https://blog.sparrowapps.io/p/from-300k-month-to-19k-what-killed-life-reset-s-growth)
- [BuildWith.app — Rise founder interview](https://buildwith.app/apps/rise)
- [Starter Story — How Desmond Grew RiseApp to $20K/MRR](https://www.starterstory.com/riseapp-breakdown)
- [Desmond on X — rename announcement](https://x.com/desmondhth/status/1958919275420557413)
- [Instagram — @bylifereset](https://www.instagram.com/bylifereset/)
- [Instagram — the "side quests" post](https://www.instagram.com/p/DaCtkYHgGB-/)
- [TikTok — @bylifereset](https://www.tiktok.com/@bylifereset)
- [JustUseApp — Life Reset reviews](https://justuseapp.com/en/app/6478942469/rise-life-reset-in-66-days/reviews)
- [PsyBlog — 66-day habit formation research summary](https://www.spring.org.uk/2024/11/form-habit-66.php)
