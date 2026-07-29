import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  onSnapshot, 
  deleteDoc, 
  writeBatch,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, StudySession, NoteItem, QuizResult, ChatMessage, Badge } from '../types';
import { INITIAL_BADGES } from '../data/subjectsData';

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Recursively removes any keys with `undefined` values from an object,
 * as Firestore throws an invalid data error when receiving `undefined`.
 */
function cleanUndefined<T extends Record<string, any>>(obj: T): Record<string, any> {
  const cleaned: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (val !== undefined) {
      if (val !== null && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
        cleaned[key] = cleanUndefined(val);
      } else {
        cleaned[key] = val;
      }
    }
  });
  return cleaned;
}

export function createInitialProfile(uid: string, email: string, displayName?: string): UserProfile {
  return {
    id: uid,
    name: displayName || email.split('@')[0] || 'Student',
    email: email,
    grade: 'Grade 10',
    group: 'Science',
    board: 'BISE Lahore',
    dailyStudyHours: 3,
    onboardingCompleted: false,
    streakDays: 1,
    lastActiveDate: getTodayStr(),
    subjects: [],
    badgesEarned: [],
  };
}

// ----------------------------------------------------
// User Profile Firestore Methods
// ----------------------------------------------------
export function subscribeProfile(uid: string, onUpdate: (profile: UserProfile | null) => void) {
  const userRef = doc(db, 'users', uid);
  return onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      onUpdate(snapshot.data() as UserProfile);
    } else {
      onUpdate(null);
    }
  }, (err) => {
    console.error('Error listening to user profile:', err);
    onUpdate(null);
  });
}

export async function saveProfileToFirestore(uid: string, profile: UserProfile): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, cleanUndefined({ ...profile, id: uid }), { merge: true });
}

// ----------------------------------------------------
// Study Sessions Firestore Methods
// ----------------------------------------------------
export function subscribeSessions(uid: string, onUpdate: (sessions: StudySession[]) => void) {
  const sessionsCol = collection(db, 'users', uid, 'sessions');
  return onSnapshot(sessionsCol, (snapshot) => {
    const list: StudySession[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as StudySession);
    });
    // Sort by date then timeSlot
    list.sort((a, b) => a.date.localeCompare(b.date));
    onUpdate(list);
  }, (err) => {
    console.error('Error listening to study sessions:', err);
    onUpdate([]);
  });
}

export async function saveSessionToFirestore(uid: string, session: StudySession): Promise<void> {
  const ref = doc(db, 'users', uid, 'sessions', session.id);
  await setDoc(ref, cleanUndefined(session), { merge: true });
}

export async function saveSessionsBatchToFirestore(uid: string, sessions: StudySession[]): Promise<void> {
  const batch = writeBatch(db);
  sessions.forEach((s) => {
    const ref = doc(db, 'users', uid, 'sessions', s.id);
    batch.set(ref, cleanUndefined(s), { merge: true });
  });
  await batch.commit();
}

export async function deleteSessionFromFirestore(uid: string, sessionId: string): Promise<void> {
  const ref = doc(db, 'users', uid, 'sessions', sessionId);
  await deleteDoc(ref);
}

// ----------------------------------------------------
// Study Notes Firestore Methods
// ----------------------------------------------------
export function subscribeNotes(uid: string, onUpdate: (notes: NoteItem[]) => void) {
  const notesCol = collection(db, 'users', uid, 'notes');
  return onSnapshot(notesCol, (snapshot) => {
    const list: NoteItem[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as NoteItem);
    });
    list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    onUpdate(list);
  }, (err) => {
    console.error('Error listening to notes:', err);
    onUpdate([]);
  });
}

export async function saveNoteToFirestore(uid: string, note: NoteItem): Promise<void> {
  const ref = doc(db, 'users', uid, 'notes', note.id);
  await setDoc(ref, cleanUndefined(note), { merge: true });
}

export async function deleteNoteFromFirestore(uid: string, noteId: string): Promise<void> {
  const ref = doc(db, 'users', uid, 'notes', noteId);
  await deleteDoc(ref);
}

// ----------------------------------------------------
// Quiz Results Firestore Methods
// ----------------------------------------------------
export function subscribeQuizzes(uid: string, onUpdate: (quizzes: QuizResult[]) => void) {
  const quizzesCol = collection(db, 'users', uid, 'quizzes');
  return onSnapshot(quizzesCol, (snapshot) => {
    const list: QuizResult[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as QuizResult);
    });
    list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    onUpdate(list);
  }, (err) => {
    console.error('Error listening to quizzes:', err);
    onUpdate([]);
  });
}

export async function saveQuizResultToFirestore(uid: string, quizResult: QuizResult): Promise<void> {
  const ref = doc(db, 'users', uid, 'quizzes', quizResult.id);
  await setDoc(ref, cleanUndefined(quizResult), { merge: true });
}

// ----------------------------------------------------
// Chat Messages Firestore Methods
// ----------------------------------------------------
export function subscribeChat(uid: string, onUpdate: (messages: ChatMessage[]) => void) {
  const chatCol = collection(db, 'users', uid, 'chat');
  return onSnapshot(chatCol, (snapshot) => {
    const list: ChatMessage[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as ChatMessage);
    });
    // Sort by id / timestamp
    list.sort((a, b) => a.id.localeCompare(b.id));
    onUpdate(list);
  }, (err) => {
    console.error('Error listening to chat:', err);
    onUpdate([]);
  });
}

export async function saveChatMessageToFirestore(uid: string, chatMessage: ChatMessage): Promise<void> {
  const ref = doc(db, 'users', uid, 'chat', chatMessage.id);
  await setDoc(ref, cleanUndefined(chatMessage), { merge: true });
}

// ----------------------------------------------------
// Badges Firestore Methods
// ----------------------------------------------------
export function subscribeBadges(uid: string, onUpdate: (badges: Badge[]) => void) {
  const badgesCol = collection(db, 'users', uid, 'badges');
  return onSnapshot(badgesCol, (snapshot) => {
    if (snapshot.empty) {
      // Seed initial empty badges in Firestore if not seeded yet
      const initial: Badge[] = INITIAL_BADGES.map((b) => {
        const item: Badge = {
          ...b,
          id: b.id,
          progress: b.id === 'b1' ? 1 : 0,
        };
        if (b.id === 'b1') {
          item.unlockedAt = new Date().toISOString();
        }
        return item;
      });
      saveBadgesBatchToFirestore(uid, initial).then(() => {
        onUpdate(initial);
      }).catch((err) => {
        console.error('Error saving initial badges batch:', err);
        onUpdate(initial);
      });
    } else {
      const list: Badge[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as Badge);
      });
      onUpdate(list);
    }
  }, (err) => {
    console.error('Error listening to badges:', err);
    onUpdate(INITIAL_BADGES);
  });
}

export async function saveBadgeToFirestore(uid: string, badge: Badge): Promise<void> {
  const ref = doc(db, 'users', uid, 'badges', badge.id);
  await setDoc(ref, cleanUndefined(badge), { merge: true });
}

export async function saveBadgesBatchToFirestore(uid: string, badges: Badge[]): Promise<void> {
  const batch = writeBatch(db);
  badges.forEach((b) => {
    const ref = doc(db, 'users', uid, 'badges', b.id);
    batch.set(ref, cleanUndefined(b), { merge: true });
  });
  await batch.commit();
}

export const saveBadgesToFirestore = saveBadgesBatchToFirestore;
