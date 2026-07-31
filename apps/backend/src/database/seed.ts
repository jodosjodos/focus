import 'dotenv/config';
import dataSource from './data-source';
import { ReadingEntry } from '../modules/reading/entities/reading-entry.entity';
import { VideoLink } from '../modules/video-quests/entities/video-link.entity';
import { QuestTemplate } from '../modules/quests/entities/quest-template.entity';
import { READING_ENTRIES_SEED } from '../modules/reading/seeds/reading-entries.seed';
import { VIDEO_LINKS_SEED } from '../modules/video-quests/seeds/video-links.seed';
import { QUEST_TEMPLATES_SEED } from '../modules/quests/seeds/quest-templates.seed';

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
