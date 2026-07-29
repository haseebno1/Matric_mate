import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { AuthView } from './components/AuthView';
import {
  subscribeProfile,
  saveProfileToFirestore,
  subscribeSessions,
  saveSessionsBatchToFirestore,
  saveSessionToFirestore,
  subscribeNotes,
  saveNoteToFirestore,
  deleteNoteFromFirestore,
  subscribeChat,
  saveChatMessageToFirestore,
  subscribeBadges,
  saveBadgesToFirestore,
  subscribeQuizzes,
  saveQuizResultToFirestore,
} from './lib/firestoreStorage';

import { ActiveTab, UserProfile, StudySession, NoteItem, ChatMessage, QuizResult, Badge } from './types';
import { loadBadges } from './lib/storage';

import { Navigation } from './components/Navigation';
import { OnboardingModal } from './components/OnboardingModal';
import { DashboardView } from './components/DashboardView';
import { ScheduleView } from './components/ScheduleView';
import { StudyBuddyView } from './components/StudyBuddyView';
import { QuizView } from './components/QuizView';
import { AnalyticsView } from './components/AnalyticsView';
import { NotesView } from './components/NotesView';
import { SettingsView } from './components/SettingsView';
import { MATRIC_SUBJECTS } from './data/subjectsData';
import { generateScheduleAI, chatBuddyAI } from './lib/clientAI';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [profile, setProfile] = useState<UserProfile>({
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
    lastActiveDate: new Date().toISOString().split('T')[0],
    subjects: [],
    badgesEarned: [],
  });
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [badges, setBadges] = useState<Badge[]>(loadBadges);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(false);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore subscriptions for authenticated user
  useEffect(() => {
    if (!user) return;
    const uid = user.uid;

    const unsubProfile = subscribeProfile(uid, (p) => {
      const authName = user.displayName || user.email?.split('@')[0] || 'Student';
      const authEmail = user.email || '';
      const authPhoto = user.photoURL || undefined;

      if (p) {
        const mergedName = p.name && p.name !== 'Student' ? p.name : (authName || p.name);
        const mergedEmail = p.email || authEmail;
        const mergedPhoto = p.photoUrl || authPhoto;

        const updated: UserProfile = {
          ...p,
          name: mergedName,
          email: mergedEmail,
          photoUrl: mergedPhoto,
        };

        if (updated.name !== p.name || updated.email !== p.email || updated.photoUrl !== p.photoUrl) {
          saveProfileToFirestore(uid, updated);
        }

        setProfile(updated);
        if (!p.onboardingCompleted) {
          setOnboardingOpen(true);
        }
      } else {
        const initialProfile: UserProfile = {
          id: uid,
          name: authName,
          email: authEmail,
          photoUrl: authPhoto,
          phone: '',
          grade: 'Grade 10',
          group: 'Science',
          board: 'BISE Lahore',
          dailyStudyHours: 3,
          onboardingCompleted: false,
          streakDays: 1,
          lastActiveDate: new Date().toISOString().split('T')[0],
          subjects: [],
          badgesEarned: [],
        };
        saveProfileToFirestore(uid, initialProfile);
        setProfile(initialProfile);
        setOnboardingOpen(true);
      }
    });

    const unsubSessions = subscribeSessions(uid, (data) => setSessions(data));
    const unsubNotes = subscribeNotes(uid, (data) => setNotes(data));
    const unsubChat = subscribeChat(uid, (data) => setChatMessages(data));
    const unsubBadges = subscribeBadges(uid, (data) => {
      if (data && data.length > 0) {
        setBadges(data);
      }
    });
    const unsubQuizzes = subscribeQuizzes(uid, (data) => setQuizResults(data));

    return () => {
      unsubProfile();
      unsubSessions();
      unsubNotes();
      unsubChat();
      unsubBadges();
      unsubQuizzes();
    };
  }, [user]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  // Handle Setup & Timetable Generation
  const handleSaveProfileAndGenerateSchedule = async (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    if (user) {
      saveProfileToFirestore(user.uid, updatedProfile);
    }

    // Call AI Backend to generate personalized schedule
    try {
      const formattedSubjects = updatedProfile.subjects.map((s) => {
        const subDef = MATRIC_SUBJECTS.find((m) => m.id === s.subjectId);
        return {
          subjectId: s.subjectId,
          name: subDef?.name || s.subjectId,
          examDate: s.examDate,
          confidence: s.confidence,
        };
      });

      const res = await fetch('/api/schedule/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjects: formattedSubjects,
          dailyHours: updatedProfile.dailyStudyHours || 3,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.schedule && data.schedule.length > 0) {
          setSessions(data.schedule);
          if (user) saveSessionsBatchToFirestore(user.uid, data.schedule);
          return;
        }
      }
      throw new Error('Server API unavailable, trying client AI');
    } catch (e) {
      console.warn('Backend endpoint unavailable, attempting client Gemini API / fallback:', e);
      const schedule = await generateScheduleAI(updatedProfile.subjects, updatedProfile.dailyStudyHours || 3, updatedProfile.apiKey);
      setSessions(schedule);
      if (user) saveSessionsBatchToFirestore(user.uid, schedule);
    }
  };

  // Toggle Session Completion
  const handleToggleSessionComplete = (sessionId: string) => {
    const updated = sessions.map((s) => {
      if (s.id === sessionId) {
        const newStatus: 'completed' | 'pending' = s.status === 'completed' ? 'pending' : 'completed';
        const updatedS = { ...s, status: newStatus };
        if (user) saveSessionToFirestore(user.uid, updatedS);
        return updatedS;
      }
      return s;
    });

    setSessions(updated);

    // Update streak if completing
    const completedNow = updated.find((s) => s.id === sessionId)?.status === 'completed';
    if (completedNow) {
      const newStreak = (profile.streakDays || 0) + 1;
      const updatedP = { ...profile, streakDays: newStreak };
      setProfile(updatedP);
      if (user) saveProfileToFirestore(user.uid, updatedP);

      // Update badge progress
      const updatedBadges = badges.map((b) => {
        if (b.id === 'b2') return { ...b, progress: Math.min(b.maxProgress, newStreak) };
        if (b.id === 'b6') return { ...b, progress: b.progress + 1 };
        return b;
      });
      setBadges(updatedBadges);
      if (user) saveBadgesToFirestore(user.uid, updatedBadges);
    }
  };

  // Reschedule Session (calls AI backend)
  const handleRescheduleSession = async (session: StudySession) => {
    try {
      const examDates = profile.subjects.reduce((acc: any, s) => {
        acc[s.subjectId] = s.examDate;
        return acc;
      }, {});

      const res = await fetch('/api/schedule/reschedule-missed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSchedule: sessions,
          missedSession: session,
          examDates: examDates,
        }),
      });

      const data = await res.json();
      if (data.rescheduledSession) {
        const newSession = data.rescheduledSession;
        const missedSession = { ...session, status: 'missed' as const };
        const updated = sessions.map((s) => (s.id === session.id ? missedSession : s));
        const newSessions = [newSession, ...updated];
        setSessions(newSessions);
        if (user) {
          saveSessionToFirestore(user.uid, missedSession);
          saveSessionToFirestore(user.uid, newSession);
        }
      }
    } catch (e) {
      console.error('Reschedule error', e);
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + 2);
      const rescheduled: StudySession = {
        ...session,
        id: `s-resched-${Date.now()}`,
        date: newDate.toISOString().split('T')[0],
        status: 'pending',
        notes: 'Rescheduled revision slot',
      };
      const missedSession = { ...session, status: 'missed' as const };
      const newSessions = [rescheduled, ...sessions.map((s) => (s.id === session.id ? missedSession : s))];
      setSessions(newSessions);
      if (user) {
        saveSessionToFirestore(user.uid, missedSession);
        saveSessionToFirestore(user.uid, rescheduled);
      }
    }
  };

  // Send Study Buddy Question
  const handleSendBuddyMessage = async (question: string, subjectId: string, topic: string) => {
    const subDef = MATRIC_SUBJECTS.find((m) => m.id === subjectId);
    const userMsg: ChatMessage = {
      id: `c-user-${Date.now()}`,
      role: 'user',
      text: question,
      subjectId,
      topic,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    if (user) saveChatMessageToFirestore(user.uid, userMsg);

    try {
      const res = await fetch('/api/chat/study-buddy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          subjectName: subDef?.name || subjectId,
          topic,
          history: newHistory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          const assistantMsg: ChatMessage = {
            id: `c-ai-${Date.now()}`,
            role: 'assistant',
            text: data.reply,
            subjectId,
            topic,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            keyTakeaway: `${topic}: Master the core formula and double check unit conversions.`,
          };
          setChatMessages([...newHistory, assistantMsg]);
          if (user) saveChatMessageToFirestore(user.uid, assistantMsg);
          const updatedBadges = badges.map((b) => (b.id === 'b4' ? { ...b, progress: Math.min(b.maxProgress, b.progress + 1) } : b));
          setBadges(updatedBadges);
          if (user) saveBadgesToFirestore(user.uid, updatedBadges);
          return;
        }
      }
      throw new Error('Using client AI reply');
    } catch (e) {
      console.warn('Chat API unavailable, attempting client Gemini API / fallback:', e);
      const aiReply = await chatBuddyAI(question, subDef?.name || subjectId, topic, profile.apiKey);
      const assistantMsg: ChatMessage = {
        id: `c-ai-${Date.now()}`,
        role: 'assistant',
        text: aiReply,
        subjectId,
        topic,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        keyTakeaway: `${topic}: Show all working steps clearly in Matric exams.`,
      };
      setChatMessages([...newHistory, assistantMsg]);
      if (user) saveChatMessageToFirestore(user.uid, assistantMsg);
      const updatedBadges = badges.map((b) => (b.id === 'b4' ? { ...b, progress: Math.min(b.maxProgress, b.progress + 1) } : b));
      setBadges(updatedBadges);
      if (user) saveBadgesToFirestore(user.uid, updatedBadges);
    }
  };

  // Save Note
  const handleSaveToNotes = (noteData: Omit<NoteItem, 'id' | 'createdAt'>) => {
    const newNote: NoteItem = {
      ...noteData,
      id: `n-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setNotes([newNote, ...notes]);
    if (user) saveNoteToFirestore(user.uid, newNote);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((n) => n.id !== noteId));
    if (user) deleteNoteFromFirestore(user.uid, noteId);
  };

  // Quiz Completed
  const handleQuizCompleted = (result: QuizResult) => {
    setQuizResults([result, ...quizResults]);
    if (user) saveQuizResultToFirestore(user.uid, result);

    // Update Quiz badge if score >= 80%
    if (result.score / result.totalQuestions >= 0.8) {
      const updatedBadges = badges.map((b) => (b.id === 'b3' ? { ...b, progress: 1, unlockedAt: new Date().toISOString() } : b));
      setBadges(updatedBadges);
      if (user) saveBadgesToFirestore(user.uid, updatedBadges);
    }
  };

  // Add Weak Topics to Schedule from Quiz
  const handleAddWeakTopicsToSchedule = async (weakTopics: string[], subjectId: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const newSession: StudySession = {
      id: `s-weak-${Date.now()}`,
      subjectId: subjectId,
      topic: weakTopics[0] || 'Targeted Revision',
      date: tomorrow.toISOString().split('T')[0],
      timeSlot: '17:00 - 18:00',
      durationMinutes: 45,
      notes: `Priority revision slot added after quiz review: ${weakTopics.join(', ')}`,
      status: 'pending',
    };
    setSessions([newSession, ...sessions]);
    if (user) saveSessionToFirestore(user.uid, newSession);
  };

  // Reset All Data
  const handleResetAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-sm font-bold text-slate-300">Loading MatricMate Platform...</p>
      </div>
    );
  }

  // Auth View if not logged in
  if (!user) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onOpenOnboarding={() => setOnboardingOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            sessions={sessions}
            setActiveTab={setActiveTab}
            onToggleSessionComplete={handleToggleSessionComplete}
            onRescheduleSession={handleRescheduleSession}
            onOpenOnboarding={() => setOnboardingOpen(true)}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleView
            sessions={sessions}
            profile={profile}
            onToggleSessionComplete={handleToggleSessionComplete}
            onRescheduleSession={handleRescheduleSession}
            onOpenOnboarding={() => setOnboardingOpen(true)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'buddy' && (
          <StudyBuddyView
            messages={chatMessages}
            profile={profile}
            onSendMessage={handleSendBuddyMessage}
            onSaveToNotes={handleSaveToNotes}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            profile={profile}
            onQuizCompleted={handleQuizCompleted}
            onAddWeakTopicsToSchedule={handleAddWeakTopicsToSchedule}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            profile={profile}
            sessions={sessions}
            quizResults={quizResults}
            badges={badges}
          />
        )}

        {activeTab === 'notes' && (
          <NotesView
            notes={notes}
            profile={profile}
            onSaveNote={handleSaveToNotes}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            profile={profile}
            onSaveProfile={(p) => {
              setProfile(p);
              if (user) saveProfileToFirestore(user.uid, p);
            }}
            onResetAllData={handleResetAllData}
            onOpenOnboarding={() => setOnboardingOpen(true)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Onboarding Setup Wizard Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        profile={profile}
        onSaveProfileAndGenerate={handleSaveProfileAndGenerateSchedule}
      />
    </div>
  );
}
