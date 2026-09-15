import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProgress,
  PageTab,
  Problem,
  Submission,
  Achievement,
  UserProfile,
  Language,
} from '../types';
import { PROBLEMS_DATA } from '../data/problems';
import { ACHIEVEMENTS_DATA } from '../data/achievements';
import { INITIAL_LEADERBOARD } from '../data/leaderboard';
import {
  getStoredUserProgress,
  saveUserProgress,
  recordSubmission as recordSubmissionToStorage,
  resetProgress as resetStorageProgress,
  getUserSavedCode,
  saveUserSavedCode,
  clearUserSavedCode,
  isDailyChallengeCompleted as isDailyDoneInStorage,
  recordDailyChallengeCompletion as markDailyDoneInStorage,
  recordArenaMatch as recordArenaMatchInStorage,
  DEFAULT_PROGRESS,
} from '../services/storage';
import {
  getCurrentUser,
  logoutAccount,
  updateUserProfile as updateStoredUserProfile,
} from '../services/auth';

interface Toast {
  id: string;
  title: string;
  description: string;
  type: 'achievement' | 'submission' | 'info';
}

interface AppContextType {
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
  selectedProblem: Problem;
  setSelectedProblem: (problem: Problem) => void;
  userProgress: UserProgress;
  problems: Problem[];
  achievements: Achievement[];
  leaderboard: typeof INITIAL_LEADERBOARD;
  toasts: Toast[];
  removeToast: (id: string) => void;
  currentUser: UserProfile | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  onUserLogin: (user: UserProfile) => void;
  onUserLogout: () => void;
  updateUserBio: (bio: string, preferredLang: Language) => void;
  recordUserSubmission: (
    submission: Submission,
    ratingDelta?: number,
    xpEarned?: number
  ) => void;
  resetAllProgress: () => void;
  selectProblemById: (id: string) => void;
  openProblemForSolve: (problem: Problem) => void;
  openArenaForProblem: (problem: Problem) => void;
  dailyChallengeProblem: Problem;
  isDailyChallengeDone: (problemId: string) => boolean;
  markDailyChallengeDone: (problemId: string) => void;
  saveProblemCode: (problemId: string, language: Language, code: string) => void;
  getProblemCode: (problemId: string, language: Language) => string | null;
  clearProblemCode: (problemId: string, language: Language) => void;
  recordArenaMatch: (matchData: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [activeTab, setActiveTabState] = useState<PageTab>(() => (getCurrentUser() ? 'dashboard' : 'login'));
  const [selectedProblem, setSelectedProblem] = useState<Problem>(PROBLEMS_DATA[0]);
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const user = getCurrentUser();
    return user ? getStoredUserProgress(user.id) : { ...DEFAULT_PROGRESS };
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Daily Challenge: Deterministic problem selection based on current year/month/day
  const today = new Date();
  const dateSeed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  const dailyChallengeProblem =
    PROBLEMS_DATA[dateSeed % PROBLEMS_DATA.length] || PROBLEMS_DATA[0];

  // Rehydrate state on active user change
  useEffect(() => {
    const storedUser = getCurrentUser();
    setCurrentUser(storedUser);

    if (storedUser) {
      setUserProgress(getStoredUserProgress(storedUser.id));
    } else {
      setUserProgress({ ...DEFAULT_PROGRESS });
      setActiveTabState('login');
    }
  }, []);

  // Secure route navigation helper
  const setActiveTab = (tab: PageTab) => {
    const isAuthed = !!getCurrentUser();

    if (!isAuthed && tab !== 'login' && tab !== 'register') {
      setActiveTabState('login');
      return;
    }

    setActiveTabState(tab);
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);

    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const onUserLogin = (user: UserProfile) => {
    setCurrentUser(user);

    const freshProgress = getStoredUserProgress(user.id);
    setUserProgress(freshProgress);
    setActiveTabState('dashboard');
    setIsAuthModalOpen(false);

    addToast({
      title: `Welcome, ${user.username}!`,
      description:
        user.role === 'admin'
          ? 'Logged in as Arena Administrator.'
          : 'Your session is active.',
      type: 'info',
    });
  };

  const onUserLogout = () => {
    logoutAccount();
    setCurrentUser(null);
    setUserProgress({ ...DEFAULT_PROGRESS });
    setActiveTabState('login');

    addToast({
      title: 'Signed Out',
      description: 'You have been safely signed out.',
      type: 'info',
    });
  };

  const updateUserBio = (bio: string, preferredLang: Language) => {
    const updated = updateStoredUserProfile({
      bio,
      preferredLanguage: preferredLang,
    });

    if (updated) {
      setCurrentUser(updated);

      addToast({
        title: 'Profile Updated',
        description: 'Your bio and language preferences were saved.',
        type: 'info',
      });
    }
  };

  const recordUserSubmission = (
    submission: Submission,
    ratingDelta = 0,
    xpEarned = 0
  ) => {
    const currentUid = currentUser?.id;

    const { updatedProgress, newAchievements } = recordSubmissionToStorage(
      submission,
      ratingDelta,
      xpEarned,
      currentUid
    );

    setUserProgress(updatedProgress);

    if (
      submission.problemId === dailyChallengeProblem.id &&
      submission.passed
    ) {
      markDailyDoneInStorage(dailyChallengeProblem.id, currentUid);
    }

    addToast({
      title: submission.passed
        ? 'Solution Accepted!'
        : 'Submission Failed',
      description: `${submission.problemTitle} — ${submission.testsPassed}/${submission.totalTests} tests passed (${submission.runtimeMs}ms)`,
      type: 'submission',
    });

    for (const achId of newAchievements) {
      const ach = ACHIEVEMENTS_DATA.find((a) => a.id === achId);

      if (ach) {
        addToast({
          title: `🏆 Achievement Unlocked: ${ach.title}`,
          description: ach.description,
          type: 'achievement',
        });
      }
    }
  };

  const resetAllProgress = () => {
    const defaultState = resetStorageProgress(currentUser?.id);
    setUserProgress(defaultState);

    addToast({
      title: 'Progress Reset',
      description:
        'Your rating, XP, streak and submissions have been cleared.',
      type: 'info',
    });
  };

  const isDailyChallengeDone = (problemId: string): boolean => {
    return (
      isDailyDoneInStorage(problemId, currentUser?.id) ||
      userProgress.solvedProblemIds.includes(problemId)
    );
  };

  const markDailyChallengeDone = (problemId: string) => {
    markDailyDoneInStorage(problemId, currentUser?.id);
  };

  const saveProblemCode = (
    problemId: string,
    language: Language,
    code: string
  ) => {
    saveUserSavedCode(problemId, language, code, currentUser?.id);
  };

  const getProblemCode = (
    problemId: string,
    language: Language
  ): string | null => {
    return getUserSavedCode(
      problemId,
      language,
      currentUser?.id
    );
  };

  const clearProblemCode = (
    problemId: string,
    language: Language
  ) => {
    clearUserSavedCode(
      problemId,
      language,
      currentUser?.id
    );
  };

  const recordArenaMatch = (matchData: any) => {
    recordArenaMatchInStorage(
      matchData,
      currentUser?.id
    );
  };

  const selectProblemById = (id: string) => {
    const found = PROBLEMS_DATA.find((p) => p.id === id);

    if (found) {
      setSelectedProblem(found);
    }
  };

  const openProblemForSolve = (problem: Problem) => {
    setSelectedProblem(problem);
    setActiveTab('problem');
  };

  const openArenaForProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setActiveTab('arena');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedProblem,
        setSelectedProblem,
        userProgress,
        problems: PROBLEMS_DATA,
        achievements: ACHIEVEMENTS_DATA,
        leaderboard: INITIAL_LEADERBOARD,
        toasts,
        removeToast,
        currentUser,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        onUserLogin,
        onUserLogout,
        updateUserBio,
        recordUserSubmission,
        resetAllProgress,
        selectProblemById,
        openProblemForSolve,
        openArenaForProblem,
        dailyChallengeProblem,
        isDailyChallengeDone,
        markDailyChallengeDone,
        saveProblemCode,
        getProblemCode,
        clearProblemCode,
        recordArenaMatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
};