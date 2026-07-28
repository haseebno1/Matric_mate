import React, { useState, useEffect } from 'react';
import { ActiveTab, UserProfile, StudySession, NoteItem, ChatMessage, QuizResult, Badge } from './types';
import { 
  loadProfile, saveProfile, 
  loadSessions, saveSessions, 
  loadNotes, saveNotes, 
  loadChatMessages, saveChatMessages, 
  loadBadges, saveBadges, 
  loadQuizResults, saveQuizResults 
} from './lib/storage';

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
import {
  generateFallbackSchedule,
  generateFallbackBuddyReply,
} from './lib/fallbackAI';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [sessions, setSessions] = useState<StudySession[]>(loadSessions);
  const [notes, setNotes] = useState<NoteItem[]>(loadNotes);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(loadChatMessages);
  const [badges, setBadges] = useState<Badge[]>(loadBadges);
  const [quizResults, setQuizResults] = useState<QuizResult[]>(loadQuizResults);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(!profile.onboardingCompleted);

  // Sync to local storage
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    saveChatMessages(chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    saveBadges(badges);
  }, [badges]);

  useEffect(() => {
    saveQuizResults(quizResults);
  }, [quizResults]);

  // Handle Setup & Timetable Generation
  const handleSaveProfileAndGenerateSchedule = async (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);

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
          return;
        }
      }
      throw new Error('Fallback to local schedule generator');
    } catch (e) {
      console.warn('Using local fallback schedule generator:', e);
      const fallback = generateFallbackSchedule(updatedProfile.subjects, updatedProfile.dailyStudyHours || 3);
      setSessions(fallback);
    }
  };

  // Toggle Session Completion
  const handleToggleSessionComplete = (sessionId: string) => {
    const updated = sessions.map((s) => {
      if (s.id === sessionId) {
        const newStatus: 'completed' | 'pending' = s.status === 'completed' ? 'pending' : 'completed';
        return { ...s, status: newStatus };
      }
      return s;
    });

    setSessions(updated);

    // Update streak if completing
    const completedNow = updated.find((s) => s.id === sessionId)?.status === 'completed';
    if (completedNow) {
      const newStreak = profile.streakDays + 1;
      setProfile({ ...profile, streakDays: newStreak });

      // Update badge progress
      const updatedBadges = badges.map((b) => {
        if (b.id === 'b2') return { ...b, progress: Math.min(b.maxProgress, newStreak) };
        if (b.id === 'b6') return { ...b, progress: b.progress + 1 };
        return b;
      });
      setBadges(updatedBadges);
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
        // Mark current as missed or updated date
        const newSession = data.rescheduledSession;
        const updated = sessions.map((s) => (s.id === session.id ? { ...s, status: 'missed' as const } : s));
        setSessions([newSession, ...updated]);
      }
    } catch (e) {
      console.error('Reschedule error', e);
      // Fallback local reschedule
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + 2);
      const rescheduled: StudySession = {
        ...session,
        id: `s-resched-${Date.now()}`,
        date: newDate.toISOString().split('T')[0],
        status: 'pending',
        notes: 'Rescheduled revision slot',
      };
      setSessions([rescheduled, ...sessions.map((s) => (s.id === session.id ? { ...s, status: 'missed' as const } : s))]);
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
          setBadges(badges.map((b) => (b.id === 'b4' ? { ...b, progress: Math.min(b.maxProgress, b.progress + 1) } : b)));
          return;
        }
      }
      throw new Error('Using fallback reply');
    } catch (e) {
      console.warn('Chat API error, using fallback:', e);
      const fallbackText = generateFallbackBuddyReply(question, subDef?.name || subjectId, topic);
      const assistantMsg: ChatMessage = {
        id: `c-ai-${Date.now()}`,
        role: 'assistant',
        text: fallbackText,
        subjectId,
        topic,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        keyTakeaway: `${topic}: Show all working steps clearly in Matric exams.`,
      };
      setChatMessages([...newHistory, assistantMsg]);
      setBadges(badges.map((b) => (b.id === 'b4' ? { ...b, progress: Math.min(b.maxProgress, b.progress + 1) } : b)));
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
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((n) => n.id !== noteId));
  };

  // Quiz Completed
  const handleQuizCompleted = (result: QuizResult) => {
    setQuizResults([result, ...quizResults]);

    // Update Quiz badge if score >= 80%
    if (result.score / result.totalQuestions >= 0.8) {
      setBadges(
        badges.map((b) => (b.id === 'b3' ? { ...b, progress: 1, unlockedAt: new Date().toISOString() } : b))
      );
    }
  };

  // Add Weak Topics to Schedule from Quiz
  const handleAddWeakTopicsToSchedule = async (weakTopics: string[], subjectId: string) => {
    try {
      const res = await fetch('/api/schedule/reschedule-missed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSchedule: sessions,
          weakTopics,
          subjectId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.rescheduledSession) {
          setSessions([data.rescheduledSession, ...sessions]);
          return;
        }
      }
      throw new Error('Using fallback weak topic schedule insert');
    } catch (e) {
      console.warn('Failed to add weak topics via API, using fallback:', e);
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
    }
  };

  // Reset All Data
  const handleResetAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onOpenOnboarding={() => setOnboardingOpen(true)}
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
            onSaveProfile={(p) => setProfile(p)}
            onResetAllData={handleResetAllData}
            onOpenOnboarding={() => setOnboardingOpen(true)}
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
