# FOCUS — User Story

*A day-by-day walkthrough of what it's actually like to use the app, start to finish. Read it like a story — every screen and system from the structure doc shows up here in the order you'd actually meet it.*

---

## Before Day 1

You hear about Focus, or you just decide today's the day. You open the app for the first time.

**Splash → Welcome.** No fake numbers, no "1.5M people started their reset." Just: *"Pick what to fix. Get a plan built around your answers. Do it for 21 to 66 days. Watch yourself change."* One tap, and you're into the quiz.

**The Onboarding Quiz.** It doesn't try to manipulate you — no "what happens if you do nothing" guilt trip, no fake urgency. It asks what it actually needs to ask: what you want to improve (you pick Sleep, Discipline, and Focus), how much you currently sleep, how much water you drink, whether you exercise, how much screen time you rack up. Then it asks how long you want to commit — the default is 66 days, but you could go as short as 21. You pick the full 66.

**Baseline Result.** A screen appears showing your **Day 1 Rating** — five stats, built from what you just answered, not a random number:

> Discipline 34 · Focus 41 · Strength 29 · Confidence 45 · Wisdom 38

Next to it, a preview of where you *could* be by Day 66. That gap is the whole hook, and because it's built from your real answers, it actually means something.

**Program Preview.** Your plan appears — five quests, generated from your quiz. And here's the difference from every app you've tried before: **each quest tells you exactly what it's for.**

- *Wake up at 7AM* — feeds Discipline
- *Drink 2.5L water* — feeds Discipline
- *20 min reading* — feeds Wisdom, Focus
- *Cold shower* — feeds Confidence, Discipline
- *30 min workout* — feeds Strength, Discipline

You swap the cold shower for a run, because that's more you. It updates instantly. You hit confirm.

**Account.** You sign in with Apple in two taps, mostly so your data backs up. You could've skipped it — it's your app, your phone, your call.

You land on Home. Day 1 of 66.

---

## Day 1

Day 1 is deliberately light — three small quests, nothing that could make you quit on day one. You open Home, see the day counter, tap through them one by one. Each tap gives a small satisfying tick — XP ticks up, a stat bar nudges, the streak flame lights for the first time.

That evening, a notification: *"Nice work today — 3 for 3. Your quests for Day 2 are ready when you are."* No guilt, no gimmick. Just true and warm.

---

## A Normal Day (Day 12)

This is what most of your days will actually look like.

**Morning.** A notification: *"Day 12 is ready — 4 quests today."* You open the app. Home shows `Day 12/66`, your streak at 🔥11, XP ticking near the next level. One quest is flagged as your **Main Quest** today — *30 min deep work* — worth more XP than the rest, front and center.

You start a **Focus session** from the Tools tab. This is where the real Screen Blocker lives now — not just a reminder, but actual blocking: you pick which apps to lock (Instagram, TikTok, whatever pulls you), set 30 minutes, and your phone genuinely can't open them until the timer ends or you deliberately override it. iOS asks for Screen Time permission the first time you set this up — one clear prompt, explained honestly, not buried in settings.

30 minutes later: *"Focus session complete — 30 min protected."* The quest auto-completes. Focus and Discipline tick up.

**Afternoon.** You knock out *Drink 2.5L water* by tapping the `+250mL` logger through the day. A **Today's Motivation Card** notification appears once — a real quote, matched to what you told the quiz mattered to you, not random. You glance at it, dismiss it, move on.

**Evening.** Two quests left. A gentle nudge: *"2 quests left today — you've got time."* Not "don't let yourself down." Just true.

You finish your last quest. A small celebration — XP bar fills, stat numbers bump — nothing that interrupts you, just a satisfying beat. A soft prompt: *"Want to jot down how today felt?"* You write two lines in the Journal, attach a photo of your workout, done.

---

## A Missed Day (Day 18)

You had Hard Mode on. Life happened — you missed two quests and the day rolls over incomplete.

No wipe back to Day 1. Instead: *"Day 18 didn't go your way — your streak resets to 0, and today's a lighter make-up day."* Clear, factual, not punishing. The app doesn't pretend nothing happened, but it doesn't erase two and a half weeks of real progress either. You start Day 19 with a clean streak and the same program.

---

## Day 21 — A Real Checkpoint

Even inside your 66-day run, Day 21 gets a moment — it's the minimum program length, so the app treats it as a genuine milestone for anyone watching that number. **Full-screen celebration.** Your Day 1 stats sit next to your Day 21 stats:

> Discipline 34 → 52 · Focus 41 → 58 · Strength 29 → 44 · Confidence 45 → 51 · Wisdom 38 → 55

An achievement card unlocks — not just a badge, a real collectible with art and a line that means something. You screenshot it, honestly, because it feels earned.

---

## Day 33 — The Midpoint

Same full-screen treatment. By now the app knows you: your quests have quietly gotten harder because your stats have grown, your streak is your longest yet, and the Stats tab shows real trend lines — your average sleep is up 40 minutes since Day 1, and unlike the app you researched before building this one, it doesn't claim your Focus went up *because* of that. It just shows you both numbers and lets you draw your own line.

---

## Day 66 — Program Complete

Your last quest for the day checks off. This time the celebration is the biggest one in the app.

**Program Complete.** Day 1 vs Day 66, all five stats, side by side. Total quests completed. Longest streak. How many journal entries you wrote — a real timeline of 66 days, readable back to front if you want to relive it.

And then — the thing the app you researched never built — **a real next step**, not a dead end:

- Start a new program, longer or harder, carrying your stats forward
- Keep using Tools standalone — reading, workouts, focus sessions — without restarting the whole arc
- Just stop. No dark pattern trying to drag you back in.

You pick to go again, 66 more days, Hard Mode on this time.

---

## Where each part of this lives (cross-reference)

| Story moment | Screen(s) from the structure doc |
|---|---|
| Before Day 1 | Splash, Welcome, Onboarding Quiz, Baseline Result, Program Preview, Account creation |
| Day 1 / Normal day | Home, Quest detail modal, Quest complete micro-celebration |
| Focus session / blocking | Tools → Screen Blocker (now full OS-level, not reminder-only) |
| Motivation card | Today's Motivation Card overlay |
| Evening reflection | Journal — new/edit entry |
| Missed day | Hard Mode: missed-day consequence screen |
| Day 21 / Day 33 | Milestone Celebration |
| Day 66 | Program Complete, Restart / New Program |
| Notifications throughout | See the Notification System list in `focus-app-decisions.md` |
