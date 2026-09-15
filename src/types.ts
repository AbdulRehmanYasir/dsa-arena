export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Topic =
  | 'Arrays'
  | 'Strings'
  | 'Hash Maps'
  | 'Linked Lists'
  | 'Stacks'
  | 'Queues'
  | 'Trees'
  | 'Graphs'
  | 'Recursion'
  | 'Sorting'
  | 'Searching'
  | 'Dynamic Programming';

export type Language =
  | 'c'
  | 'cpp'
  | 'java'
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'csharp'
  | 'go'
  | 'rust';

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  explanation?: string;
}

export interface ProblemHints {
  hint1: string;
  hint2: string;
  hint3: string;
  hint4: string;
  hint5: string;
  approach?: string;
  solution?: {
    javascript?: string;
    python?: string;
    cpp?: string;
    explanation?: string;
  };
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topic: Topic;
  description: string;
  examples: Example[];
  constraints: string[];
  starterCode: Record<Language, string>;
  testCases: TestCase[];
  hints: ProblemHints;
  acceptanceRate?: number;
  authorNote?: string;
}

export interface TestResult {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  error?: string;
  executionTimeMs: number;
}

export type ExecutionStatusType =
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'COMPILATION_ERROR'
  | 'RUNTIME_ERROR'
  | 'TIME_LIMIT_EXCEEDED'
  | 'EMPTY_OUTPUT'
  | 'INVALID_INPUT'
  | 'SYNTAX_VERIFIED'
  | 'SERVER_ERROR';

export interface ExecutionResult {
  success: boolean;
  statusType?: ExecutionStatusType;
  testsPassed: number;
  totalTests: number;
  results: TestResult[];
  runtimeMs: number;
  memoryMB: number;
  error?: string;
  stdout?: string;
  isSimulated?: boolean;
  note?: string;
}

export interface Submission {
  id: string;
  problemId: string;
  problemTitle: string;
  difficulty: Difficulty;
  topic: Topic;
  language: Language;
  code: string;
  passed: boolean;
  testsPassed: number;
  totalTests: number;
  runtimeMs: number;
  memoryMB?: number;
  score: number;
  submittedAt: string;
  timestamp?: string;
  mode?: 'practice' | 'arena';
}

export interface RatingPoint {
  date: string;
  rating: number;
  reason: string;
}

export interface UserProgress {
  rating: number;
  xp: number;
  streakDays: number;
  longestStreak: number;
  lastActiveDate: string;
  solvedProblemIds: string[];
  attemptedProblemIds: string[];
  submissions: Submission[];
  ratingHistory: RatingPoint[];
  unlockedAchievementIds: string[];
  bestScores: Record<string, number>;
  solvedDailyChallengeDates?: string[];
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role?: 'admin' | 'user';
  passwordHash?: string;
  salt?: string;
  createdAt: string;
  avatar: string;
  avatarUrl?: string;
  title: string;
  bio: string;
  preferredLanguage: Language;
  githubHandle?: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  avatarUrl?: string;
  rating: number;
  problemsSolved: number;
  xp: number;
  streak: number;
  badge?: string;
  isCurrentUser?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  icon?: string;
  category: 'problems' | 'streak' | 'arena' | 'mastery';
  unlockedAt?: string;
}

export type PageTab =
  | 'login'
  | 'register'
  | 'landing'
  | 'dashboard'
  | 'practice'
  | 'problem'
  | 'arena'
  | 'progress'
  | 'leaderboard'
  | 'profile'
  | 'settings';