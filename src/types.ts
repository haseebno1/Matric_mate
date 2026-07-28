export interface SubjectConfig {
  subjectId: string;
  examDate: string; // YYYY-MM-DD
  confidence: number; // 1-5
  targetGrade?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  grade: 'Grade 9' | 'Grade 10';
  subjects: SubjectConfig[];
  dailyStudyHours: number;
  onboardingCompleted: boolean;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  badgesEarned: string[]; // Badge IDs
}

export interface StudySession {
  id: string;
  subjectId: string;
  topic: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "16:00 - 17:00"
  durationMinutes: number;
  status: 'pending' | 'completed' | 'missed' | 'skipped';
  notes?: string;
  rescheduledCount?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export interface QuizResult {
  id: string;
  subjectId: string;
  topic: string;
  score: number;
  totalQuestions: number;
  date: string;
  weakTopicsIdentified: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  subjectId?: string;
  topic?: string;
  timestamp: string;
  keyTakeaway?: string;
  example?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  subjectId: string;
  topic: string;
  content: string;
  keyTakeaways?: string[];
  createdAt: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'streak' | 'quiz' | 'study' | 'confidence';
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export type ActiveTab = 'dashboard' | 'schedule' | 'buddy' | 'quiz' | 'analytics' | 'notes' | 'settings';
