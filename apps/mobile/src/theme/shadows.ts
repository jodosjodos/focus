// Extracted from the literal copy-pasted across QuestCard.tsx, WeeklyQuestCard.tsx,
// StatsScreen.tsx, ProfileScreen.tsx, AchievementsScreen.tsx, etc. New screens should
// import from here rather than adding another copy.
export const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.35,
  shadowRadius: 18,
  elevation: 6,
};

// Heavier variant used on Modals/overlays (AchievementDetailScreen, MotivationCardOverlay, etc.)
export const OVERLAY_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.4,
  shadowRadius: 22,
  elevation: 8,
};
