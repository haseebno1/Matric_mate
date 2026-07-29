import React from 'react';
import { ActiveTab, UserProfile, StudySession } from '../types';
import { MATRIC_SUBJECTS } from '../data/subjectsData';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Bot, 
  BrainCircuit, 
  BookMarked, 
  BarChart3, 
  CalendarDays,
  Flame,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface DashboardViewProps {
  profile: UserProfile;
  sessions: StudySession[];
  setActiveTab: (tab: ActiveTab) => void;
  onToggleSessionComplete: (sessionId: string) => void;
  onRescheduleSession: (session: StudySession) => void;
  onOpenOnboarding: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  sessions,
  setActiveTab,
  onToggleSessionComplete,
  onRescheduleSession,
  onOpenOnboarding,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Filter today's tasks
  const todaySessions = React.useMemo(() => {
    return sessions.filter((s) => s.date === todayStr);
  }, [sessions, todayStr]);

  // Overall progress calculation across all sessions
  const completedCount = sessions.filter((s) => s.status === 'completed').length;
  const totalCount = sessions.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Find nearest exam
  const nearestExam = React.useMemo(() => {
    if (!profile.subjects || profile.subjects.length === 0) return null;
    const sorted = [...profile.subjects]
      .map((s) => {
        const subDef = MATRIC_SUBJECTS.find((m) => m.id === s.subjectId);
        const examDate = new Date(s.examDate);
        const today = new Date();
        today.setHours(0,0,0,0);
        const diffDays = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return {
          subjectName: subDef?.name || s.subjectId,
          daysLeft: diffDays,
          examDate: s.examDate,
          color: subDef?.color || '#3b82f6',
          code: subDef?.code || 'SUB',
        };
      })
      .filter((e) => e.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft);

    return sorted[0] || null;
  }, [profile.subjects]);

  const formattedTodayDate = new Date().toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-600 text-white p-6 sm:p-8 shadow-sm">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {profile.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={profile.name || 'User Profile'}
                referrerPolicy="no-referrer"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white/40 shadow-md shrink-0"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-md shrink-0">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'S'}
              </div>
            )}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                  {profile.grade || 'Grade 10'} Matric Prep
                </span>
                {profile.email && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-indigo-900/60 text-indigo-100 border border-indigo-400/30">
                    {profile.email}
                  </span>
                )}
                <span className="text-xs text-indigo-100 font-medium hidden sm:inline">• {formattedTodayDate}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Hello, {profile.name || 'Student'}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
                Consistency is key to Matric success. You have{' '}
                <strong className="text-white font-bold">{todaySessions.length} study tasks</strong> scheduled for today.
              </p>
            </div>
          </div>

          {/* Quick Stats Pill Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center gap-3 min-w-[130px]">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-200 border border-orange-400/30 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5 fill-orange-400 text-orange-300" />
              </div>
              <div>
                <p className="text-[10px] text-indigo-100 font-medium">Study Streak</p>
                <p className="text-base font-extrabold text-white">{profile.streakDays || 1} Days</p>
              </div>
            </div>

            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center gap-3 min-w-[130px]">
              <div className="w-9 h-9 rounded-xl bg-white/20 text-white border border-white/30 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-indigo-100 font-medium">Syllabus Progress</p>
                <p className="text-base font-extrabold text-white">{progressPercent}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Exam Countdown + Today's Checklist + Progress Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2 Cols wide on desktop): Nearest Exam & Today's Study Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Nearest Exam Highlight Card */}
          {nearestExam && (
            <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center font-extrabold text-amber-900 text-lg shadow-xs">
                  {nearestExam.code}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Nearest Final Exam</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-200/60 text-amber-900 font-bold">
                      High Priority
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                    {nearestExam.subjectName} Examination
                  </h3>
                  <p className="text-xs text-slate-600">Scheduled for {nearestExam.examDate}</p>
                </div>
              </div>

              <div className="text-right pl-2">
                <div className="text-2xl sm:text-3xl font-black text-amber-900 tracking-tight">
                  {nearestExam.daysLeft} <span className="text-xs font-bold text-amber-700">Days</span>
                </div>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className="mt-1 text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 justify-end"
                >
                  <span>View Sessions</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Today's Tasks Checklist */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">Today’s Study Checklist</h3>
                <span className="px-2.5 py-0.5 text-xs bg-slate-100 text-slate-700 font-bold rounded-full border border-slate-200">
                  {todaySessions.filter((s) => s.status === 'completed').length} / {todaySessions.length}
                </span>
              </div>
              <button
                onClick={() => setActiveTab('schedule')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Full Timetable <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todaySessions.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-sm font-bold text-slate-800">No remaining tasks scheduled for today!</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Take a break, try an AI Quiz to test weak topics, or regenerate your timetable for the week.
                </p>
                <button
                  onClick={onOpenOnboarding}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Regenerate Timetable
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {todaySessions.map((session) => {
                  const subDef = MATRIC_SUBJECTS.find((m) => m.id === session.subjectId);
                  const isDone = session.status === 'completed';
                  const isMissed = session.status === 'missed';

                  return (
                    <div
                      key={session.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isDone
                          ? 'bg-emerald-50/60 border-emerald-200 opacity-90'
                          : isMissed
                          ? 'bg-rose-50/60 border-rose-200'
                          : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => onToggleSessionComplete(session.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                          )}
                        </button>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold border"
                              style={{
                                backgroundColor: `${subDef?.color || '#3b82f6'}15`,
                                color: subDef?.color || '#2563eb',
                                borderColor: `${subDef?.color || '#3b82f6'}30`,
                              }}
                            >
                              {subDef?.name || session.subjectId}
                            </span>

                            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{session.timeSlot}</span>
                              <span>• {session.durationMinutes}m</span>
                            </div>
                          </div>

                          <h4 className={`text-sm font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {session.topic}
                          </h4>

                          {session.notes && (
                            <p className="text-xs text-slate-500 italic">Tip: {session.notes}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {!isDone && (
                          <button
                            onClick={() => onRescheduleSession(session)}
                            className="px-3 py-1.5 text-xs bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 rounded-xl flex items-center gap-1 shadow-2xs"
                            title="Reschedule to next available study gap"
                          >
                            <RotateCcw className="w-3 h-3 text-amber-600" />
                            <span>Reschedule</span>
                          </button>
                        )}
                        <button
                          onClick={() => setActiveTab('buddy')}
                          className="px-3 py-1.5 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200 rounded-xl flex items-center gap-1 transition-colors"
                        >
                          <Bot className="w-3 h-3" />
                          <span>Ask AI</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Syllabus Completion Ring + Quick Access Features */}
        <div className="space-y-6">
          {/* Syllabus Completion Ring */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm text-center space-y-4">
            <h3 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">Overall Revision Progress</h3>

            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="58"
                  stroke="#e2e8f0"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="58"
                  stroke="#4f46e5"
                  strokeWidth="12"
                  strokeDasharray={364}
                  strokeDashoffset={364 - (364 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900">{progressPercent}%</span>
                <span className="text-[10px] text-slate-500 font-medium">Completed</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              {completedCount} of {totalCount} total study sessions completed.
            </p>
          </div>

          {/* Quick Access Feature Hub */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Quick Access Tools</span>
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                id="quick-buddy-btn"
                onClick={() => setActiveTab('buddy')}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl flex items-center justify-between text-left transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">AI Study Buddy</h4>
                    <p className="text-[10px] text-slate-500">Get step-by-step topic explanations</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
              </button>

              <button
                id="quick-quiz-btn"
                onClick={() => setActiveTab('quiz')}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl flex items-center justify-between text-left transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">Take AI Quiz</h4>
                    <p className="text-[10px] text-slate-500">Test knowledge & catch weak spots</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
              </button>

              <button
                id="quick-timetable-btn"
                onClick={() => setActiveTab('schedule')}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl flex items-center justify-between text-left transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700">Timetable Schedule</h4>
                    <p className="text-[10px] text-slate-500">View & manage weekly time blocks</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
              </button>

              <button
                id="quick-notes-btn"
                onClick={() => setActiveTab('notes')}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl flex items-center justify-between text-left transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center">
                    <BookMarked className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700">Saved Notes Library</h4>
                    <p className="text-[10px] text-slate-500">Review saved AI study cards</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
