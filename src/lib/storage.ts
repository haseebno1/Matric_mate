import { UserProfile, StudySession, NoteItem, QuizResult, ChatMessage, Badge } from '../types';
import { MATRIC_SUBJECTS, INITIAL_BADGES } from '../data/subjectsData';

const KEYS = {
  PROFILE: 'matricmate_profile',
  SESSIONS: 'matricmate_sessions',
  NOTES: 'matricmate_notes',
  QUIZZES: 'matricmate_quizzes',
  CHAT: 'matricmate_chat',
  BADGES: 'matricmate_badges',
};

// Initial Sample Data for rich out-of-the-box preview
const defaultProfile: UserProfile = {
  id: 'user-1',
  name: 'Sipho Dlamini',
  email: 'sipho@matricmate.co.za',
  phone: '+27 82 123 4567',
  grade: 'Grade 10',
  dailyStudyHours: 3,
  onboardingCompleted: false,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  subjects: [
    { subjectId: 'math', examDate: getFutureDate(12), confidence: 2, targetGrade: '80%' },
    { subjectId: 'physics', examDate: getFutureDate(18), confidence: 3, targetGrade: '75%' },
    { subjectId: 'life_sci', examDate: getFutureDate(24), confidence: 4, targetGrade: '85%' },
    { subjectId: 'english', examDate: getFutureDate(8), confidence: 5, targetGrade: '90%' },
  ],
  badgesEarned: ['b1'],
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

const defaultSessions: StudySession[] = [
  {
    id: 's-1',
    subjectId: 'math',
    topic: 'Quadratic Equations & Formula',
    date: getTodayStr(0),
    timeSlot: '16:00 - 17:00',
    durationMinutes: 60,
    status: 'completed',
    notes: 'Focus on factoring using x = (-b ± √(b²-4ac))/2a',
  },
  {
    id: 's-2',
    subjectId: 'physics',
    topic: 'Newton’s Second Law (F = ma)',
    date: getTodayStr(0),
    timeSlot: '17:30 - 18:30',
    durationMinutes: 60,
    status: 'pending',
    notes: 'Practice free body diagrams and inclined plane force components',
  },
  {
    id: 's-3',
    subjectId: 'english',
    topic: 'Poetry Analysis: Sonnet 18',
    date: getTodayStr(0),
    timeSlot: '19:00 - 19:45',
    durationMinutes: 45,
    status: 'pending',
    notes: 'Review iambic pentameter and imagery',
  },
  {
    id: 's-4',
    subjectId: 'life_sci',
    topic: 'DNA Replication & Transcription',
    date: getTodayStr(1),
    timeSlot: '16:00 - 17:00',
    durationMinutes: 60,
    status: 'pending',
    notes: 'Understand mRNA vs tRNA complementary base pairs',
  },
  {
    id: 's-5',
    subjectId: 'math',
    topic: 'Trigonometric Identities & Sine Rule',
    date: getTodayStr(1),
    timeSlot: '17:30 - 18:30',
    durationMinutes: 60,
    status: 'pending',
  },
  {
    id: 's-6',
    subjectId: 'physics',
    topic: 'Ohm’s Law & Series Parallel Circuits',
    date: getTodayStr(-1),
    timeSlot: '16:00 - 17:00',
    durationMinutes: 60,
    status: 'completed',
  },
  {
    id: 's-7',
    subjectId: 'english',
    topic: 'Transactional Writing: Formal Letters',
    date: getTodayStr(-1),
    timeSlot: '17:30 - 18:15',
    durationMinutes: 45,
    status: 'missed',
  },
];

const defaultNotes: NoteItem[] = [
  {
    id: 'n-1',
    title: 'Newton’s Laws Quick Summary',
    subjectId: 'physics',
    topic: 'Newton’s Laws of Motion',
    content: '1st Law: Inertia (an object stays at rest or uniform motion unless acted upon by a net force).\n2nd Law: F_net = m * a (acceleration is directly proportional to net force).\n3rd Law: Action & Reaction forces are equal in magnitude and opposite in direction on DIFFERENT objects.',
    keyTakeaways: ['F_net is always a vector sum', 'Normal force is perpendicular to the surface'],
    createdAt: getTodayStr(-2),
  },
  {
    id: 'n-2',
    title: 'Quadratic Formula Derivation',
    subjectId: 'math',
    topic: 'Algebra & Equations',
    content: 'When ax² + bx + c = 0, x = (-b ± √(b² - 4ac)) / (2a).\nDiscriminant Δ = b² - 4ac:\n- Δ > 0: 2 real unequal roots\n- Δ = 0: 2 real equal roots\n- Δ < 0: non-real/imaginary roots',
    keyTakeaways: ['Check discriminant Δ first to determine root nature'],
    createdAt: getTodayStr(-1),
  }
];

const defaultChatMessages: ChatMessage[] = [
  {
    id: 'c-1',
    role: 'user',
    text: 'How do I remember the difference between Series and Parallel circuits?',
    subjectId: 'physics',
    topic: 'Electric Circuits & Ohm’s Law',
    timestamp: '10:15 AM',
  },
  {
    id: 'c-2',
    role: 'assistant',
    text: 'Great question! Think of a circuit like water flowing through pipes:\n\n1. **Series Circuit (Single Pathway):**\n- Water has to flow through EVERY pipe one after another.\n- If one pipe breaks, all water stops!\n- Current (I) is the SAME everywhere. Voltage (V) splits up.\n\n2. **Parallel Circuit (Multiple Pathways):**\n- Water splits into multiple side rivers.\n- If one branch closes, water still flows down the other branches!\n- Voltage (V) is the SAME across each branch. Current (I) splits up.\n\n💡 **Quick Takeaway:** In Series, Current stays same. In Parallel, Voltage stays same!',
    subjectId: 'physics',
    topic: 'Electric Circuits & Ohm’s Law',
    timestamp: '10:16 AM',
    keyTakeaway: 'Series = Same Current, Parallel = Same Voltage across branches.',
  }
];

// Local Storage Helpers
export function loadProfile(): UserProfile {
  try {
    const data = localStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : defaultProfile;
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
    return data ? JSON.parse(data) : defaultSessions;
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
    return data ? JSON.parse(data) : defaultNotes;
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
    return data ? JSON.parse(data) : defaultChatMessages;
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
    return data ? JSON.parse(data) : [
      {
        id: 'qres-1',
        subjectId: 'math',
        topic: 'Algebra & Equations',
        score: 4,
        totalQuestions: 5,
        date: getTodayStr(-1),
        weakTopicsIdentified: ['DiscriminantDelta'],
      }
    ];
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
