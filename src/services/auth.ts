import { UserProfile, Language } from '../types';

const AUTH_USER_KEY = 'dsa_arena_auth_user_v2';
const ACCOUNTS_DB_KEY = 'dsa_arena_accounts_v2';

export interface StoredAccount {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  passwordHash: string;
  avatar: string;
  title: string;
  bio: string;
  preferredLanguage: Language;
  createdAt: string;
}

export const DEMO_SEED_ACCOUNT: StoredAccount = {
  id: 'usr_demo_contender',
  username: 'demo_user',
  email: 'demo@dsa-arena.dev',
  role: 'user',
  passwordHash: hashPassword('demo123'),
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=demo_contender_arena',
  title: 'Novice Contender',
  bio: 'Algorithmic explorer and competitive programmer on DSA Arena.',
  preferredLanguage: 'javascript',
  createdAt: '2026-01-01T00:00:00.000Z',
};

export const ADMIN_SEED_ACCOUNT: StoredAccount = {
  id: 'usr_admin_master',
  username: 'admin',
  email: 'admin@dsa-arena.local',
  role: 'admin',
  passwordHash: hashPassword('admin@123'),
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin_master_crown',
  title: 'Arena Administrator',
  bio: 'DSA Arena System Administrator & Algorithmic Lead.',
  preferredLanguage: 'javascript',
  createdAt: '2026-01-01T00:00:00.000Z',
};

export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(16) + '_' + password.length;
}

export function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_DB_KEY);
    let accounts: StoredAccount[] = [];
    if (raw) {
      accounts = JSON.parse(raw);
    }

    // Ensure demo account is seeded
    const demoIndex = accounts.findIndex(
      (a) => a.username.toLowerCase() === 'demo_user' || a.username.toLowerCase() === 'demo'
    );
    if (demoIndex === -1) {
      accounts.unshift(DEMO_SEED_ACCOUNT);
      localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(accounts));
    }

    // Ensure admin account is seeded
    const adminIndex = accounts.findIndex(
      (a) => a.username.toLowerCase() === 'admin'
    );
    if (adminIndex === -1) {
      accounts.unshift(ADMIN_SEED_ACCOUNT);
      localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(accounts));
    } else if (!accounts[adminIndex].role || accounts[adminIndex].role !== 'admin') {
      accounts[adminIndex].role = 'admin';
      accounts[adminIndex].passwordHash = hashPassword('admin@123');
      localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(accounts));
    }

    return accounts;
  } catch (err) {
    console.error('Failed to get stored accounts:', err);
    return [DEMO_SEED_ACCOUNT, ADMIN_SEED_ACCOUNT];
  }
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.id || !parsed.username) {
      return null;
    }
    return {
      id: parsed.id,
      username: parsed.username,
      email: parsed.email || '',
      role: parsed.role || (parsed.username.toLowerCase() === 'admin' ? 'admin' : 'user'),
      avatar: parsed.avatar || parsed.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(parsed.username)}`,
      title: parsed.title || (parsed.role === 'admin' ? 'Arena Administrator' : 'Pupil Contender'),
      bio: parsed.bio || '',
      preferredLanguage: parsed.preferredLanguage || 'javascript',
      createdAt: parsed.createdAt || new Date().toISOString(),
    };
  } catch (err) {
    console.error('Failed to load current user:', err);
    return null;
  }
}

export function saveCurrentUser(user: UserProfile | null): void {
  try {
    if (!user) {
      localStorage.removeItem(AUTH_USER_KEY);
    } else {
      // Strip any sensitive fields before persisting session
      const sanitized: UserProfile = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || (user.username.toLowerCase() === 'admin' ? 'admin' : 'user'),
        avatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.username)}`,
        title: user.title,
        bio: user.bio,
        preferredLanguage: user.preferredLanguage || 'javascript',
        createdAt: user.createdAt,
      };
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sanitized));
    }
  } catch (err) {
    console.error('Failed to save current user:', err);
  }
}

export function registerAccount(
  username: string,
  email: string,
  password: string,
  preferredLanguage: Language = 'javascript'
): { success: boolean; user?: UserProfile; error?: string } {
  const accounts = getStoredAccounts();

  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedUsername || trimmedUsername.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters.' };
  }
  if (!trimmedEmail || !trimmedEmail.includes('@')) {
    return { success: false, error: 'Please provide a valid email address.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  if (accounts.some((a) => a.username.toLowerCase() === trimmedUsername.toLowerCase())) {
    return { success: false, error: 'Username is already taken. Please choose another.' };
  }
  if (accounts.some((a) => a.email.toLowerCase() === trimmedEmail)) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const role: 'admin' | 'user' = trimmedUsername.toLowerCase() === 'admin' ? 'admin' : 'user';

  const newAccount: StoredAccount = {
    id: 'usr_' + Math.random().toString(36).substring(2, 11),
    username: trimmedUsername,
    email: trimmedEmail,
    role,
    passwordHash: hashPassword(password),
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedUsername)}`,
    title: role === 'admin' ? 'Arena Administrator' : 'Apprentice Contender',
    bio: 'DSA Arena Contender ready to conquer algorithms.',
    preferredLanguage,
    createdAt: new Date().toISOString(),
  };

  accounts.push(newAccount);
  localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(accounts));

  const profile: UserProfile = {
    id: newAccount.id,
    username: newAccount.username,
    email: newAccount.email,
    role: newAccount.role,
    avatar: newAccount.avatar,
    title: newAccount.title,
    bio: newAccount.bio,
    preferredLanguage: newAccount.preferredLanguage,
    createdAt: newAccount.createdAt,
  };

  saveCurrentUser(profile);
  return { success: true, user: profile };
}

export function loginAccount(
  identifier: string,
  password: string
): { success: boolean; user?: UserProfile; error?: string } {
  const accounts = getStoredAccounts();
  const cleanId = identifier.trim().toLowerCase();
  const targetHash = hashPassword(password);

  const account = accounts.find(
    (a) => a.username.toLowerCase() === cleanId || a.email.toLowerCase() === cleanId
  );

  if (!account) {
    return { success: false, error: 'Account not found. Check your username or email.' };
  }

  // Check password against hash (or demo/admin preset passwords)
  const isMatch =
    account.passwordHash === targetHash ||
    (account.username.toLowerCase() === 'admin' && password === 'admin@123') ||
    ((account.username.toLowerCase() === 'demo_user' || account.username.toLowerCase() === 'demo') &&
      (password === 'demo123' || password === 'demo@123'));

  if (!isMatch) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  const role: 'admin' | 'user' = account.role || (account.username.toLowerCase() === 'admin' ? 'admin' : 'user');

  const profile: UserProfile = {
    id: account.id,
    username: account.username,
    email: account.email,
    role,
    avatar: account.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(account.username)}`,
    title: account.title || (role === 'admin' ? 'Arena Administrator' : 'Pupil Contender'),
    bio: account.bio || 'DSA Arena Contender.',
    preferredLanguage: account.preferredLanguage || 'javascript',
    createdAt: account.createdAt,
  };

  saveCurrentUser(profile);
  return { success: true, user: profile };
}

export function logoutAccount(): void {
  saveCurrentUser(null);
}

export function updateUserProfile(updates: Partial<UserProfile>): UserProfile | null {
  const current = getCurrentUser();
  if (!current) return null;

  const updated: UserProfile = {
    ...current,
    ...updates,
  };
  saveCurrentUser(updated);

  // Also update in accounts database
  const accounts = getStoredAccounts();
  const idx = accounts.findIndex((a) => a.id === current.id);
  if (idx !== -1) {
    accounts[idx] = {
      ...accounts[idx],
      username: updated.username || accounts[idx].username,
      title: updated.title || accounts[idx].title,
      bio: updated.bio || accounts[idx].bio,
      avatar: updated.avatar || accounts[idx].avatar,
      preferredLanguage: updated.preferredLanguage || accounts[idx].preferredLanguage,
    };
    localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(accounts));
  }

  return updated;
}
