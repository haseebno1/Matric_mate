import React, { useState } from 'react';
import { StudySession, UserProfile, ActiveTab } from '../types';
import { MATRIC_SUBJECTS } from '../data/subjectsData';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  Bot, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Check,
  Circle,
  HelpCircle
} from 'lucide-react';

interface ScheduleViewProps {
  sessions: StudySession[];
  profile: UserProfile;
  onToggleSessionComplete: (sessionId: string) => void;
  onRescheduleSession: (session: StudySession) => void;
  onOpenOnboarding: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  sessions,
  profile,
  onToggleSessionComplete,
  onRescheduleSession,
  onOpenOnboarding,
  setActiveTab,
}) => {
  const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Date navigation
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Selected session for detail modal
  const [activeSessionModal, setActiveSessionModal] = useState<StudySession | null>(null);

  // Get current week dates (7 days surrounding selectedDateStr or starting today)
  const weekDates = React.useMemo(() => {
    const dates: string[] = [];
    const base = new Date(selectedDateStr);
    const dayOfWeek = base.getDay(); // 0 is Sun
    const startOfWeek = new Date(base);
    startOfWeek.setDate(base.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Monday as start

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }, [selectedDateStr]);

  // Filter sessions
  const filteredSessions = React.useMemo(() => {
    return sessions.filter((s) => {
      if (selectedSubject !== 'all' && s.subjectId !== selectedSubject) return false;
      if (selectedStatus !== 'all' && s.status !== selectedStatus) return false;
      return true;
    });
  }, [sessions, selectedSubject, selectedStatus]);

  const handlePrevWeek = () => {
    const d = new Date(selectedDateStr);
    d.setDate(d.getDate() - 7);
    setSelectedDateStr(d.toISOString().split('T')[0]);
  };

  const handleNextWeek = () => {
    const d = new Date(selectedDateStr);
    d.setDate(d.getDate() + 7);
    setSelectedDateStr(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDateStr(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar: Title + Regenerate Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Study Timetable & Planner</h2>
          <p className="text-xs text-slate-500 mt-1">
            AI-optimized revision slots synced with exam dates and confidence scores.
          </p>
        </div>

        <button
          id="regenerate-schedule-btn"
          onClick={onOpenOnboarding}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Regenerate AI Schedule</span>
        </button>
      </div>

      {/* Control Bar: View Toggle + Filters + Week Navigator */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* View Mode Toggle (Weekly / Daily) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full md:w-auto">
          <button
            onClick={() => setViewMode('weekly')}
            className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'weekly' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weekly View
          </button>
          <button
            onClick={() => setViewMode('daily')}
            className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'daily' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily View
          </button>
        </div>

        {/* Date Navigator */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevWeek}
            className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 font-bold hover:bg-slate-100"
          >
            Today
          </button>
          <span className="text-xs font-bold text-slate-700 px-2">
            {new Date(weekDates[0]).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })} –{' '}
            {new Date(weekDates[6]).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}
          </span>
          <button
            onClick={handleNextWeek}
            className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Subject & Status Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Subjects</option>
            {profile.subjects.map((s) => {
              const subDef = MATRIC_SUBJECTS.find((m) => m.id === s.subjectId);
              return (
                <option key={s.subjectId} value={s.subjectId}>
                  {subDef?.name || s.subjectId}
                </option>
              );
            })}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
          </select>
        </div>
      </div>

      {/* WEEKLY GRID VIEW */}
      {viewMode === 'weekly' ? (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDates.map((dateStr) => {
            const dateObj = new Date(dateStr);
            const dayName = dateObj.toLocaleDateString('en-ZA', { weekday: 'short' });
            const dayNum = dateObj.getDate();
            const isToday = dateStr === new Date().toISOString().split('T')[0];

            const daySessions = filteredSessions.filter((s) => s.date === dateStr);

            return (
              <div
                key={dateStr}
                className={`p-3 rounded-2xl border flex flex-col min-h-[320px] ${
                  isToday
                    ? 'bg-indigo-50/40 border-indigo-300 ring-1 ring-indigo-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Date Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block uppercase">{dayName}</span>
                    <span className={`text-base font-black ${isToday ? 'text-indigo-600' : 'text-slate-900'}`}>
                      {dayNum}
                    </span>
                  </div>
                  {isToday && (
                    <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-indigo-600 text-white rounded">
                      TODAY
                    </span>
                  )}
                </div>

                {/* Session Cards for Day */}
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {daySessions.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-[11px] italic">No sessions</div>
                  ) : (
                    daySessions.map((session) => {
                      const subDef = MATRIC_SUBJECTS.find((m) => m.id === session.subjectId);
                      const isDone = session.status === 'completed';
                      const isMissed = session.status === 'missed';

                      return (
                        <div
                          key={session.id}
                          onClick={() => setActiveSessionModal(session)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all space-y-1.5 hover:scale-[1.02] ${
                            isDone
                              ? 'bg-emerald-50 border-emerald-200 text-slate-600'
                              : isMissed
                              ? 'bg-rose-50 border-rose-200'
                              : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className="px-1.5 py-0.5 rounded text-[9px] font-extrabold border"
                              style={{
                                backgroundColor: `${subDef?.color || '#3b82f6'}15`,
                                color: subDef?.color || '#2563eb',
                                borderColor: `${subDef?.color || '#3b82f6'}30`,
                              }}
                            >
                              {subDef?.code || 'SUB'}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleSessionComplete(session.id);
                              }}
                              className="text-slate-400 hover:text-emerald-600"
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-slate-400" />
                              )}
                            </button>
                          </div>

                          <h5 className={`text-xs font-bold line-clamp-2 ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {session.topic}
                          </h5>

                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{session.timeSlot}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DAILY DETAILED VIEW */
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              Schedule for {new Date(selectedDateStr).toLocaleDateString('en-ZA', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            <input
              type="date"
              value={selectedDateStr}
              onChange={(e) => setSelectedDateStr(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
            />
          </div>

          <div className="space-y-3">
            {filteredSessions.filter((s) => s.date === selectedDateStr).length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No sessions scheduled for this date.
              </div>
            ) : (
              filteredSessions
                .filter((s) => s.date === selectedDateStr)
                .map((session) => {
                  const subDef = MATRIC_SUBJECTS.find((m) => m.id === session.subjectId);
                  const isDone = session.status === 'completed';

                  return (
                    <div
                      key={session.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <button onClick={() => onToggleSessionComplete(session.id)}>
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold" style={{ color: subDef?.color }}>
                              {subDef?.name}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">• {session.timeSlot} ({session.durationMinutes} mins)</span>
                          </div>
                          <h4 className={`text-sm font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {session.topic}
                          </h4>
                          {session.notes && <p className="text-xs text-slate-500 mt-0.5">{session.notes}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isDone && (
                          <button
                            onClick={() => onRescheduleSession(session)}
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl flex items-center gap-1 shadow-2xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                            <span>Reschedule</span>
                          </button>
                        )}
                        <button
                          onClick={() => setActiveTab('buddy')}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-xl flex items-center gap-1 shadow-xs"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span>Study with AI</span>
                        </button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* Session Details Modal */}
      {activeSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-900">
            <div className="flex justify-between items-start">
              <div>
                <span
                  className="px-2.5 py-0.5 rounded-md text-xs font-bold border"
                  style={{
                    backgroundColor: `${
                      MATRIC_SUBJECTS.find((m) => m.id === activeSessionModal.subjectId)?.color || '#3b82f6'
                    }15`,
                    color: MATRIC_SUBJECTS.find((m) => m.id === activeSessionModal.subjectId)?.color || '#2563eb',
                  }}
                >
                  {MATRIC_SUBJECTS.find((m) => m.id === activeSessionModal.subjectId)?.name}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{activeSessionModal.topic}</h3>
              </div>
              <button
                onClick={() => setActiveSessionModal(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Scheduled Date:</span>
                <strong className="text-slate-900">{activeSessionModal.date}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Time Block:</span>
                <strong className="text-indigo-600">{activeSessionModal.timeSlot}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Duration:</span>
                <strong className="text-slate-900">{activeSessionModal.durationMinutes} Minutes</strong>
              </div>
            </div>

            {activeSessionModal.notes && (
              <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-900">
                💡 <strong>Study Tip:</strong> {activeSessionModal.notes}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 gap-2">
              <button
                onClick={() => {
                  onToggleSessionComplete(activeSessionModal.id);
                  setActiveSessionModal(null);
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 ${
                  activeSessionModal.status === 'completed'
                    ? 'bg-slate-100 text-slate-700 border border-slate-200'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{activeSessionModal.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}</span>
              </button>

              <button
                onClick={() => {
                  onRescheduleSession(activeSessionModal);
                  setActiveSessionModal(null);
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 border border-slate-200"
              >
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Reschedule</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
