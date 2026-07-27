---
description: Scaffold a new QuestTemplate seed entry following the schema in the development plan.
---

Ask for whatever isn't already given: title, description, quest_type (checkbox / quantity / duration / reading / video / workout), primary_stat, secondary_stat (optional), difficulty (easy / medium / hard — this sets base_xp per the XP formula in `docs/FOCUS-project-description.md` §5.1), category (Strength / Discipline / Focus / Wisdom / Confidence / Custom), default_target.

Generate a seed entry matching the QuestTemplate schema in `docs/FOCUS-development-plan.md` §2, and add it to the appropriate seed file under `apps/backend/src/modules/quests/`. If the quest type is `reading` or `video`, confirm a matching `ReadingEntry`/`VideoLink` row exists (or needs creating) before wiring `source_content_id`.
