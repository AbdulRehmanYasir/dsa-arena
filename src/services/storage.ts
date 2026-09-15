import { UserProgress, Submission, RatingPoint, Language } from '../types';
import { getCurrentUser } from './auth';

export const STORAGE_VERSION_KEY = 'dsa_arena_storage_version';
export const CURRENT_STORAGE_VERSION = 'v4_isolated_user_data_2026';

export const DEFAULT_PROGRESS: UserProgress = {
  rating: 1000,
  xp: 0,
  streakDays: 0,
  longestStreak: 0,
  lastActiveDate: '',
  solvedProblemIds: [],
  attemptedProblemIds: [],
  submissions: [],
  ratingHistory: [
    {
      date: new Date().toISOString().split('T')[0],
      rating: 1000,
      reason: 'Initial Rating',
    },
  ],
  unlockedAchievementIds: [],
  bestScores: {},
};

function resolveUserId(explicitUserId?: string): string {
  if (explicitUserId && explicitUserId.trim()) {
    return explicitUserId.trim();
  }

  const current = getCurrentUser();

  if (current && current.id) {
    return current.id;
  }

  return 'usr_guest_session';
}

function getUserProgressKey(userId: string): string {
  return `dsa_arena_user_${userId}_progress`;
}

function getUserSavedCodeKey(userId: string): string {
  return `dsa_arena_user_${userId}_saved_code`;
}

function getUserDailyChallengesKey(userId: string): string {
  return `dsa_arena_user_${userId}_daily_challenges`;
}

function getUserArenaMatchesKey(userId: string): string {
  return `dsa_arena_user_${userId}_arena_matches`;
}

export function checkAndMigrateStorage(): void {
  try {
    const existingVersion = localStorage.getItem(STORAGE_VERSION_KEY);

    if (existingVersion !== CURRENT_STORAGE_VERSION) {
      const oldGlobalKeys = [
        'dsa_arena_user_progress_v1',
        'dsa_arena_user_progress_v2',
        'dsa_arena_user_progress',
        'dsa_arena_matches',
        'dsa_arena_daily_challenge',
        'dsa_arena_daily_challenge_v2',
        'dsa_arena_arena_matches_v2',
        'dsa_user_progress',
        'dsa_arena_submissions',
      ];

      oldGlobalKeys.forEach((key) => localStorage.removeItem(key));

      localStorage.setItem(
        STORAGE_VERSION_KEY,
        CURRENT_STORAGE_VERSION
      );
    }
  } catch (err) {
    console.error('Storage migration notice:', err);
  }
}

// -------------------------------------------------------------
// USER-SCOPED PROGRESS
// -------------------------------------------------------------

export function getStoredUserProgress(
  explicitUserId?: string
): UserProgress {
  try {
    checkAndMigrateStorage();

    const uid = resolveUserId(explicitUserId);
    const key = getUserProgressKey(uid);
    const raw = localStorage.getItem(key);

    if (!raw) {
      saveUserProgress(DEFAULT_PROGRESS, uid);
      return { ...DEFAULT_PROGRESS };
    }

    const parsed = JSON.parse(raw);

    const solvedIds = Array.isArray(parsed.solvedProblemIds)
      ? parsed.solvedProblemIds
      : [];

    const rating =
      typeof parsed.rating === 'number'
        ? parsed.rating
        : 1000;

    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      rating,
      xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
      streakDays:
        typeof parsed.streakDays === 'number'
          ? parsed.streakDays
          : 0,
      longestStreak:
        typeof parsed.longestStreak === 'number'
          ? parsed.longestStreak
          : 0,
      solvedProblemIds: solvedIds,
      attemptedProblemIds: Array.isArray(
        parsed.attemptedProblemIds
      )
        ? parsed.attemptedProblemIds
        : [],
      submissions: Array.isArray(parsed.submissions)
        ? parsed.submissions
        : [],
      unlockedAchievementIds: Array.isArray(
        parsed.unlockedAchievementIds
      )
        ? parsed.unlockedAchievementIds
        : [],
      ratingHistory:
        Array.isArray(parsed.ratingHistory) &&
        parsed.ratingHistory.length > 0
          ? parsed.ratingHistory
          : [
              {
                date: new Date().toISOString().split('T')[0],
                rating,
                reason: 'Initial Rating',
              },
            ],
      bestScores:
        typeof parsed.bestScores === 'object' &&
        parsed.bestScores !== null
          ? parsed.bestScores
          : {},
    };
  } catch (err) {
    console.error('Failed to load user progress:', err);
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveUserProgress(
  progress: UserProgress,
  explicitUserId?: string
): void {
  try {
    const uid = resolveUserId(explicitUserId);
    const key = getUserProgressKey(uid);

    localStorage.setItem(key, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save user progress:', err);
  }
}

// -------------------------------------------------------------
// USER-SCOPED SAVED CODE
// -------------------------------------------------------------

export function getUserSavedCode(
  problemId: string,
  language: Language,
  explicitUserId?: string
): string | null {
  try {
    const uid = resolveUserId(explicitUserId);
    const key = getUserSavedCodeKey(uid);
    const raw = localStorage.getItem(key);

    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (
      parsed &&
      parsed[problemId] &&
      typeof parsed[problemId][language] === 'string'
    ) {
      return parsed[problemId][language];
    }

    return null;
  } catch {
    return null;
  }
}

export function saveUserSavedCode(
  problemId: string,
  language: Language,
  code: string,
  explicitUserId?: string
): void {
  try {
    const uid = resolveUserId(explicitUserId);
    const key = getUserSavedCodeKey(uid);
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : {};

    if (!parsed[problemId]) {
      parsed[problemId] = {};
    }

    parsed[problemId][language] = code;

    localStorage.setItem(key, JSON.stringify(parsed));
  } catch (err) {
    console.error('Failed to save user code:', err);
  }
}

export function clearUserSavedCode(
  problemId: string,
  language: Language,
  explicitUserId?: string
): void {
  try {
    const uid = resolveUserId(explicitUserId);
    const key = getUserSavedCodeKey(uid);
    const raw = localStorage.getItem(key);

    if (!raw) return;

    const parsed = JSON.parse(raw);

    if (parsed && parsed[problemId]) {
      delete parsed[problemId][language];
      localStorage.setItem(key, JSON.stringify(parsed));
    }
  } catch {
    // Ignore storage errors.
  }
}

// -------------------------------------------------------------
// USER-SCOPED DAILY CHALLENGE
// -------------------------------------------------------------

export function isDailyChallengeCompleted(
  problemId: string,
  explicitUserId?: string
): boolean {
  try {
    const uid = resolveUserId(explicitUserId);
    const todayStr = new Date().toISOString().split('T')[0];
    const key = getUserDailyChallengesKey(uid);
    const raw = localStorage.getItem(key);

    if (!raw) return false;

    const parsed = JSON.parse(raw);

    return (
      Array.isArray(parsed.completedDates) &&
      parsed.completedDates.includes(
        `${todayStr}_${problemId}`
      )
    );
  } catch {
    return false;
  }
}

export function recordDailyChallengeCompletion(
  problemId: string,
  explicitUserId?: string
): void {
  try {
    const uid = resolveUserId(explicitUserId);
    const todayStr = new Date().toISOString().split('T')[0];
    const itemKey = `${todayStr}_${problemId}`;
    const key = getUserDailyChallengesKey(uid);
    const raw = localStorage.getItem(key);

    const parsed = raw
      ? JSON.parse(raw)
      : { completedDates: [] };

    const dates = Array.isArray(parsed.completedDates)
      ? parsed.completedDates
      : [];

    if (!dates.includes(itemKey)) {
      dates.push(itemKey);

      localStorage.setItem(
        key,
        JSON.stringify({
          completedDates: dates,
        })
      );
    }
  } catch (err) {
    console.error(
      'Failed to record daily challenge:',
      err
    );
  }
}

// -------------------------------------------------------------
// USER-SCOPED ARENA MATCHES
// -------------------------------------------------------------

export function getUserArenaMatches(
  explicitUserId?: string
): any[] {
  try {
    const uid = resolveUserId(explicitUserId);
    const key = getUserArenaMatchesKey(uid);
    const raw = localStorage.getItem(key);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed.matches)
      ? parsed.matches
      : [];
  } catch {
    return [];
  }
}

export function getArenaMatchesCount(
  explicitUserId?: string
): number {
  return getUserArenaMatches(explicitUserId).length;
}

export function recordArenaMatch(
  matchData: any,
  explicitUserId?: string
): void {
  try {
    const uid = resolveUserId(explicitUserId);
    const key = getUserArenaMatchesKey(uid);
    const raw = localStorage.getItem(key);

    const parsed = raw
      ? JSON.parse(raw)
      : { matches: [] };

    const matches = Array.isArray(parsed.matches)
      ? parsed.matches
      : [];

    matches.unshift(matchData);

    localStorage.setItem(
      key,
      JSON.stringify({
        matches: matches.slice(0, 50),
      })
    );
  } catch (err) {
    console.error('Failed to record arena match:', err);
  }
}

// -------------------------------------------------------------
// SUBMISSIONS
// -------------------------------------------------------------

export function recordSubmission(
  submission: Submission,
  ratingDelta = 0,
  xpEarned = 0,
  explicitUserId?: string
): {
  updatedProgress: UserProgress;
  newAchievements: string[];
} {
  const uid = resolveUserId(explicitUserId);
  const current = getStoredUserProgress(uid);

  const updatedSolved = [...current.solvedProblemIds];

  if (
    submission.passed &&
    !updatedSolved.includes(submission.problemId)
  ) {
    updatedSolved.push(submission.problemId);
  }

  const updatedAttempted = [
    ...current.attemptedProblemIds,
  ];

  if (!updatedAttempted.includes(submission.problemId)) {
    updatedAttempted.push(submission.problemId);
  }

  // Update streak logic
  const todayStr = new Date().toISOString().split('T')[0];

  let newStreak = current.streakDays;

  if (!current.lastActiveDate) {
    newStreak = 1;
  } else if (current.lastActiveDate !== todayStr) {
    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayStr = yesterday
      .toISOString()
      .split('T')[0];

    if (current.lastActiveDate === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
  }

  // Calculate new rating and XP
  const newRating = Math.max(
    0,
    current.rating + ratingDelta
  );

  const newXP = current.xp + xpEarned;

  const newRatingHistory: RatingPoint[] = [
    ...current.ratingHistory,
  ];

  if (ratingDelta !== 0) {
    newRatingHistory.push({
      date: todayStr,
      rating: newRating,
      reason: `${
        submission.passed ? 'Passed' : 'Attempted'
      } ${submission.problemTitle}`,
    });
  }

  // Best score for problem
  const bestScores = {
    ...current.bestScores,
  };

  const currentBest =
    bestScores[submission.problemId] || 0;

  if (submission.score > currentBest) {
    bestScores[submission.problemId] =
      submission.score;
  }

  const updatedSubmissions = [
    submission,
    ...current.submissions,
  ].slice(0, 50);

  // Check achievement triggers
  const newAchievements: string[] = [];

  const checkAndAdd = (id: string) => {
    if (
      !current.unlockedAchievementIds.includes(id) &&
      !newAchievements.includes(id)
    ) {
      newAchievements.push(id);
    }
  };

  if (updatedSolved.length >= 1) {
    checkAndAdd('first-blood');
  }

  if (updatedSolved.length >= 10) {
    checkAndAdd('10-problems');
  }

  if (updatedSolved.length >= 50) {
    checkAndAdd('50-problems');
  }

  if (updatedSolved.length >= 100) {
    checkAndAdd('100-problems');
  }

  if (newStreak >= 7) {
    checkAndAdd('7-day-streak');
  }

  if (newStreak >= 30) {
    checkAndAdd('30-day-streak');
  }

  if (
    submission.passed &&
    submission.score === 100
  ) {
    checkAndAdd('perfect-solution');
  }

  if (
    submission.mode === 'arena' &&
    submission.score >= 200
  ) {
    checkAndAdd('arena-master');
  }

  const updatedProgress: UserProgress = {
    ...current,
    rating: newRating,
    xp: newXP,
    streakDays: newStreak,
    longestStreak: Math.max(
      current.longestStreak || 0,
      newStreak
    ),
    lastActiveDate: todayStr,
    solvedProblemIds: updatedSolved,
    attemptedProblemIds: updatedAttempted,
    submissions: updatedSubmissions,
    ratingHistory: newRatingHistory,
    unlockedAchievementIds: [
      ...current.unlockedAchievementIds,
      ...newAchievements,
    ],
    bestScores,
  };

  saveUserProgress(updatedProgress, uid);

  return {
    updatedProgress,
    newAchievements,
  };
}

export function resetProgress(
  explicitUserId?: string
): UserProgress {
  const uid = resolveUserId(explicitUserId);

  saveUserProgress(DEFAULT_PROGRESS, uid);

  try {
    localStorage.removeItem(
      getUserDailyChallengesKey(uid)
    );

    localStorage.removeItem(
      getUserArenaMatchesKey(uid)
    );

    localStorage.removeItem(
      getUserSavedCodeKey(uid)
    );
  } catch (err) {
    console.error(
      'Failed to clear user scoped state:',
      err
    );
  }

  return { ...DEFAULT_PROGRESS };
}