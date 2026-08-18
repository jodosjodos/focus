import { useQuery } from '@tanstack/react-query';

// wger.de — free, open-source exercise database. Public read endpoints need
// no API key/auth. See https://wger.de/en/software/api for docs.
const WGER_BASE = 'https://wger.de/api/v2';
const ENGLISH_LANGUAGE_ID = 2;

export interface WgerCategory {
  id: number;
  name: string;
}

export interface WgerExercise {
  id: number;
  name: string;
  imageUrl: string | null;
  categoryId: number;
}

interface RawExerciseInfo {
  id: number;
  category: { id: number; name: string };
  images: Array<{
    is_main: boolean;
    thumbnails: { medium: string; small: string };
  }>;
  translations: Array<{ name: string; language: number }>;
}

function mapExercise(raw: RawExerciseInfo): WgerExercise | null {
  const translation = raw.translations.find((t) => t.language === ENGLISH_LANGUAGE_ID);
  if (!translation || !translation.name) return null;
  const mainImage = raw.images.find((img) => img.is_main) ?? raw.images[0];
  return {
    id: raw.id,
    name: translation.name,
    imageUrl: mainImage?.thumbnails.medium ?? null,
    categoryId: raw.category.id,
  };
}

export function useExerciseCategories() {
  return useQuery({
    queryKey: ['wger', 'categories'],
    queryFn: async (): Promise<WgerCategory[]> => {
      const res = await fetch(`${WGER_BASE}/exercisecategory/?format=json`);
      const data = await res.json();
      return data.results;
    },
    staleTime: Infinity,
  });
}

export function useExercisesByCategory(categoryId: number | null) {
  return useQuery({
    queryKey: ['wger', 'exercises', categoryId],
    queryFn: async (): Promise<WgerExercise[]> => {
      const res = await fetch(
        `${WGER_BASE}/exerciseinfo/?category=${categoryId}&language=${ENGLISH_LANGUAGE_ID}&limit=60&format=json`,
      );
      const data = await res.json();
      const results: RawExerciseInfo[] = data.results;
      return results
        .map(mapExercise)
        .filter((e): e is WgerExercise => e !== null)
        // Prefer exercises with a real photo — a picker full of blank cards
        // isn't actually better than the free-text field it's replacing.
        .sort((a, b) => Number(!!b.imageUrl) - Number(!!a.imageUrl));
    },
    enabled: categoryId !== null,
    staleTime: 1000 * 60 * 60,
  });
}
