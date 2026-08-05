import 'dotenv/config';
import dataSource from './data-source';
import { ReadingEntry } from '../modules/reading/entities/reading-entry.entity';
import { VideoLink } from '../modules/video-quests/entities/video-link.entity';
import { QuestTemplate } from '../modules/quests/entities/quest-template.entity';
import { Achievement } from '../modules/achievements/entities/achievement.entity';
import { MotivationCard } from '../modules/motivation/entities/motivation-card.entity';
import { READING_ENTRIES_SEED } from '../modules/reading/seeds/reading-entries.seed';
import { VIDEO_LINKS_SEED } from '../modules/video-quests/seeds/video-links.seed';
import { QUEST_TEMPLATES_SEED } from '../modules/quests/seeds/quest-templates.seed';
import { ACHIEVEMENTS_SEED } from '../modules/achievements/seeds/achievements.seed';
import { MOTIVATION_CARDS_SEED } from '../modules/motivation/seeds/motivation-cards.seed';

async function seed() {
  await dataSource.initialize();

  const readingRepo = dataSource.getRepository(ReadingEntry);
  const videoRepo = dataSource.getRepository(VideoLink);
  const templateRepo = dataSource.getRepository(QuestTemplate);

  const readingIdByTitle = new Map<string, string>();
  for (const entry of READING_ENTRIES_SEED) {
    const existing = await readingRepo.findOne({
      where: { title: entry.title },
    });
    const saved = existing
      ? existing
      : await readingRepo.save(readingRepo.create(entry));
    readingIdByTitle.set(entry.title, saved.id);
  }
  console.log(`Reading entries: ${readingIdByTitle.size} present`);

  const videoIdByTitle = new Map<string, string>();
  for (const link of VIDEO_LINKS_SEED) {
    const existing = await videoRepo.findOne({ where: { title: link.title } });
    const saved = existing
      ? existing
      : await videoRepo.save(videoRepo.create(link));
    videoIdByTitle.set(link.title, saved.id);
  }
  console.log(`Video links: ${videoIdByTitle.size} present`);

  let templateCount = 0;
  for (const { sourceContentTitle, ...templateData } of QUEST_TEMPLATES_SEED) {
    const existing = await templateRepo.findOne({
      where: { title: templateData.title },
    });
    if (existing) {
      templateCount += 1;
      continue;
    }

    let sourceContentId: string | null = null;
    if (sourceContentTitle) {
      sourceContentId =
        readingIdByTitle.get(sourceContentTitle) ??
        videoIdByTitle.get(sourceContentTitle) ??
        null;
      if (!sourceContentId) {
        throw new Error(
          `QuestTemplate "${templateData.title}" references unknown source content "${sourceContentTitle}"`,
        );
      }
    }

    await templateRepo.save(
      templateRepo.create({ ...templateData, sourceContentId }),
    );
    templateCount += 1;
  }
  console.log(`Quest templates: ${templateCount} present`);

  const achievementRepo = dataSource.getRepository(Achievement);
  let achievementCount = 0;
  for (const achievement of ACHIEVEMENTS_SEED) {
    const existing = await achievementRepo.findOne({
      where: { key: achievement.key },
    });
    if (!existing) {
      await achievementRepo.save(achievementRepo.create(achievement));
    }
    achievementCount += 1;
  }
  console.log(`Achievements: ${achievementCount} present`);

  const motivationCardRepo = dataSource.getRepository(MotivationCard);
  let motivationCardCount = 0;
  for (const card of MOTIVATION_CARDS_SEED) {
    const existing = await motivationCardRepo.findOne({
      where: { quoteText: card.quoteText },
    });
    if (!existing) {
      await motivationCardRepo.save(motivationCardRepo.create(card));
    }
    motivationCardCount += 1;
  }
  console.log(`Motivation cards: ${motivationCardCount} present`);

  await dataSource.destroy();
}

seed()
  .then(() => {
    console.log('Seed complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
