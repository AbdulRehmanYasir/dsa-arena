import { Achievement } from '../types';

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 'first-blood',
    title: 'First Blood',
    description: 'Solve your first DSA problem in the arena.',
    iconName: 'Zap',
    category: 'problems',
  },
  {
    id: '10-problems',
    title: '10 Problems',
    description: 'Solve 10 problems across any topic.',
    iconName: 'Award',
    category: 'problems',
  },
  {
    id: '50-problems',
    title: '50 Problems',
    description: 'Solve 50 problems to reach intermediate mastery.',
    iconName: 'Crown',
    category: 'problems',
  },
  {
    id: '100-problems',
    title: '100 Problems',
    description: 'Solve 100 problems and join the grandmaster tier.',
    iconName: 'ShieldAlert',
    category: 'problems',
  },
  {
    id: '7-day-streak',
    title: '7 Day Streak',
    description: 'Maintain a 7-day daily coding practice streak.',
    iconName: 'Flame',
    category: 'streak',
  },
  {
    id: '30-day-streak',
    title: '30 Day Streak',
    description: 'Code every day for a full month.',
    iconName: 'Sparkles',
    category: 'streak',
  },
  {
    id: 'arena-master',
    title: 'Arena Master',
    description: 'Win a timed Arena match with a score above 200 points.',
    iconName: 'Swords',
    category: 'arena',
  },
];
