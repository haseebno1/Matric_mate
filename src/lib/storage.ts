import { UserProfile, StudySession, NoteItem, QuizResult, ChatMessage, Badge } from '../types';
import { INITIAL_BADGES } from '../data/subjectsData';

const KEYS = {
  PROFILE: 'matricmate_profile',
  SESSIONS: 'matricmate_sessions',
  NOTES: 'matricmate_notes',
  QUIZZES: 'matricmate_quizzes',
  CHAT: 'matricmate_chat',
  BADGES: 'matricmate_badges',
};

function getFutureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

function getTodayStr(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

// Initial Empty Data Defaults for new users
const defaultProfile: UserProfile = {
  id: '',
  name: '',
  email: '',
  phone: '',
  grade: 'Grade 10',
  group: 'Science',
  board: 'BISE Lahore',
  dailyStudyHours: 3,
  onboardingCompleted: false,
  streakDays: 1,
  lastActiveDate: getTodayStr(0),
  subjects: [],
  badgesEarned: [],
};

const defaultSessions: StudySession[] = [];
const defaultNotes: NoteItem[] = [];
const defaultChatMessages: ChatMessage[] = [];
const defaultQuizResults: QuizResult[] = [];

// Local Storage Helpers
export function loadProfile(): UserProfile {
  try {
    const data = localStorage.getItem(KEYS.PROFILE);
    if (!data) return defaultProfile;
    const parsed = JSON.parse(data);
    // Migration check: if old subject IDs like 'math' exist in saved profile, reset or migrate
    if (parsed.subjects && parsed.subjects.some((s: any) => s.subjectId === 'math' || s.subjectId === 'physics')) {
      return defaultProfile;
    }
    return parsed;
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function loadSessions(): StudySession[] {
  try {
    const data = localStorage.getItem(KEYS.SESSIONS);
    if (!data) return defaultSessions;
    const parsed = JSON.parse(data);
    if (parsed.some((s: any) => s.subjectId === 'math' || s.subjectId === 'physics')) {
      return defaultSessions;
    }
    return parsed;
  } catch {
    return defaultSessions;
  }
}

export function saveSessions(sessions: StudySession[]): void {
  try {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save sessions', e);
  }
}

export function loadNotes(): NoteItem[] {
  try {
    const data = localStorage.getItem(KEYS.NOTES);
    if (!data) return defaultNotes;
    const parsed = JSON.parse(data);
    if (parsed.some((n: any) => n.subjectId === 'math' || n.subjectId === 'physics')) {
      return defaultNotes;
    }
    return parsed;
  } catch {
    return defaultNotes;
  }
}

export function saveNotes(notes: NoteItem[]): void {
  try {
    localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save notes', e);
  }
}

export function loadChatMessages(): ChatMessage[] {
  try {
    const data = localStorage.getItem(KEYS.CHAT);
    if (!data) return defaultChatMessages;
    const parsed = JSON.parse(data);
    if (parsed.some((c: any) => c.subjectId === 'math' || c.subjectId === 'physics')) {
      return defaultChatMessages;
    }
    return parsed;
  } catch {
    return defaultChatMessages;
  }
}

export function saveChatMessages(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(KEYS.CHAT, JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save chat', e);
  }
}

export function loadBadges(): Badge[] {
  try {
    const data = localStorage.getItem(KEYS.BADGES);
    return data ? JSON.parse(data) : INITIAL_BADGES;
  } catch {
    return INITIAL_BADGES;
  }
}

export function saveBadges(badges: Badge[]): void {
  try {
    localStorage.setItem(KEYS.BADGES, JSON.stringify(badges));
  } catch (e) {
    console.error('Failed to save badges', e);
  }
}

export function loadQuizResults(): QuizResult[] {
  try {
    const data = localStorage.getItem(KEYS.QUIZZES);
    if (!data) return [
      {
        id: 'qres-1',
        subjectId: 'PHY-10',
        topic: 'Ch 10: Simple Harmonic Motion and Waves',
        score: 4,
        totalQuestions: 5,
        date: getTodayStr(-1),
        weakTopicsIdentified: ['Damped oscillations mechanics'],
      }
    ];
    const parsed = JSON.parse(data);
    if (parsed.some((q: any) => q.subjectId === 'math' || q.subjectId === 'physics')) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

export function saveQuizResults(results: QuizResult[]): void {
  try {
    localStorage.setItem(KEYS.QUIZZES, JSON.stringify(results));
  } catch (e) {
    console.error('Failed to save quiz results', e);
  }
}
