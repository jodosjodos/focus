import { QuestCategory } from '../../quests/entities/quest-template.entity';

export interface ReadingEntrySeed {
  title: string;
  author: string | null;
  category: QuestCategory;
  content: string;
  isOriginal: boolean;
  estimatedMinutes: number;
}

// Original lessons written for Focus — no public-domain sourcing needed.
// Public-domain excerpts come later, per docs/FOCUS-project-description.md §7
// (Jodos brings vetted sources, verified before adding).
export const READING_ENTRIES_SEED: ReadingEntrySeed[] = [
  {
    title: 'The Two-Minute Rule',
    author: null,
    category: QuestCategory.DISCIPLINE,
    isOriginal: true,
    estimatedMinutes: 4,
    content: `Most habits die in the planning. You decide to "exercise more," and the
size of that goal is exactly why you never start. The fix is almost
insultingly simple: shrink the habit until starting takes under two
minutes. "Read before bed" becomes "read one page." "Work out"
becomes "put on your shoes."

This isn't a trick to feel productive while doing nothing. It's a
recognition that the hardest part of any habit is the decision to
begin — not the doing. Once your shoes are on, going for a walk is
the path of least resistance. Once the book is open to page one,
reading a second page is easier than closing it.

Discipline, in this framing, isn't a personality trait some people
have and others don't. It's a system of lowering the activation
energy for the behavior you want, over and over, until the behavior
becomes who you are rather than something you're forcing yourself to
do. Big transformations are just small starts, repeated past the
point where you needed motivation to keep going.`,
  },
  {
    title: 'Attention Is Not Free',
    author: null,
    category: QuestCategory.FOCUS,
    isOriginal: true,
    estimatedMinutes: 5,
    content: `Every app on your phone is designed by people whose job is to take
your attention and not give it back. That's not cynicism — it's the
literal business model. Which means the war for your focus isn't a
fair fight unless you change the terms.

The most reliable lever isn't willpower, it's friction. Willpower is
a finite, moody resource that's weakest exactly when you need it most
— tired, stressed, bored. Friction works whether you're motivated or
not. Put the phone in another room. Log out of the feed instead of
just closing the tab. Use a timer that makes switching tasks cost
something, even a few seconds.

None of this makes you a monk. It just rebalances a fight that was
never fair to begin with. Twenty-five focused minutes with your phone
in a drawer will produce more than two scattered hours with it on the
desk, screen-up, buzzing. Protect attention like the finite resource
it actually is, because to everyone selling you their app, that's
exactly what it is.`,
  },
  {
    title: 'The Stories We Tell About Ourselves',
    author: null,
    category: QuestCategory.CONFIDENCE,
    isOriginal: true,
    estimatedMinutes: 4,
    content: `"I'm just not a disciplined person." "I've never been good at
talking to strangers." Sentences like these feel like observations.
They're actually decisions, dressed up as facts, and they quietly
decide your next move before you've had a chance to try.

Every time you act, you're casting a small vote for the kind of
person you are. Skip the workout, and you've voted for "someone who
skips workouts" — not permanently, but that vote counts. Show up when
it's inconvenient, and you've voted the other way. Identity isn't
fixed at the top, driving behavior downward. It's built from the
bottom, one vote at a time, from what you actually do.

This means confidence isn't something you wait to feel before acting
— it's something you accumulate by acting first. You don't need to
believe "I am confident" to walk into the room. You need to walk into
enough rooms that the belief has no choice but to catch up with the
evidence.`,
  },
  {
    title: 'Progress Is Not a Straight Line',
    author: null,
    category: QuestCategory.WISDOM,
    isOriginal: true,
    estimatedMinutes: 4,
    content: `Plot any real improvement on a graph and it looks less like a ramp
and more like a staircase with a few steps missing — long flat
stretches where nothing seems to be happening, punctuated by sudden
jumps that feel disproportionate to the effort just before them.

The flat stretches aren't failure. They're compounding, quietly,
below the threshold where it shows. A habit repeated for three weeks
with no visible change isn't three weeks of nothing — it's three
weeks of a system being built that will eventually produce a result
all at once, in a way that looks sudden from the outside but wasn't.

The people who quit almost always quit during the flat part, mistaking
it for evidence that the method doesn't work. The people who don't
quit aren't smarter or more talented — they've just seen the shape of
this curve enough times to trust it, even when the graph in front of
them looks like nothing is happening at all.`,
  },
  {
    title: "Spend Like You'll See the Bill",
    author: null,
    category: QuestCategory.DISCIPLINE,
    isOriginal: true,
    estimatedMinutes: 3,
    content: `Money problems are rarely math problems. Almost nobody overspends
because they can't do arithmetic — they overspend because the
spending is invisible in the moment and the consequence arrives
weeks later, disconnected from the decision that caused it.

The single highest-leverage fix is to make spending visible again.
Not a full budget spreadsheet — just write down what you spend, the
same day, in one place. You don't even have to change a single
purchase for the first two weeks. The awareness alone changes
behavior, the same way people eat differently when they know they're
logging the meal.

Wealth, like every other stat in this app, isn't built from one
dramatic decision. It's built from a long run of small, visible ones
— the kind you can only make consistently if you can actually see
them.`,
  },
  {
    title: 'Rest Is Part of the Program, Not a Break From It',
    author: null,
    category: QuestCategory.STRENGTH,
    isOriginal: true,
    estimatedMinutes: 3,
    content: `It's tempting to treat rest days as the boring tax you pay for the
privilege of training. That's backwards. Muscle doesn't get stronger
during the workout — the workout is just the signal. The actual
adaptation happens afterward, while you sleep and recover, when the
body rebuilds slightly stronger than before to handle the same stress
next time.

Train without ever resting and you're sending the signal constantly
while never giving the body the window to respond to it. That's how
progress stalls even though effort is going up — the classic
overtraining trap.

Treat recovery as part of the program with the same seriousness as
the lifting itself: sleep on schedule, eat enough, take the rest day
when it's programmed instead of when guilt allows it. Strength is
built in the gap between sessions as much as in the session itself.`,
  },
  {
    title: 'The Five-Minute Favor',
    author: null,
    category: QuestCategory.CONFIDENCE,
    isOriginal: true,
    estimatedMinutes: 3,
    content: `Relationships don't erode all at once — they erode from the accumulation
of small check-ins that never happened. Nobody decides to stop caring
about a friendship; they just get busy for long enough that "busy"
quietly becomes the whole relationship.

The counter to this isn't a grand gesture. It's absurdly small: a
two-line message asking how someone's actually doing, sent before you
have time to overthink it. Something that costs you five minutes and
costs them nothing to receive.

Do this consistently and something changes that's hard to fake any
other way — the people around you start experiencing you as someone
who shows up. That reputation, once built, is one of the more durable
forms of confidence there is: not "I believe in myself" confidence,
but the quieter kind that comes from knowing you're the sort of
person who follows through.`,
  },
  {
    title: 'Decide Once',
    author: null,
    category: QuestCategory.WISDOM,
    isOriginal: true,
    estimatedMinutes: 4,
    content: `Every day you re-litigate whether to work out, you're spending
willpower on a decision you already made once. The people who stick
with hard things longest usually aren't more disciplined in the
moment — they've just removed the moment. They decided on Sunday
that Tuesday is a run day, full stop, and by Tuesday there's nothing
left to decide.

This is "decide once" thinking: front-load the decision-making into a
single calm moment, so the version of you that's tired, busy, or
unmotivated later never has to make the call. Tired-you doesn't
decide whether to go to the gym — tired-you just executes a decision
that clear-headed-you already made in advance.

It's a small trick with an outsized effect, because the number of
decisions you can make well in a day is limited, and most of them get
wasted re-arguing settled questions. Settle the question once. Spend
the willpower somewhere it's actually needed.`,
  },
];
