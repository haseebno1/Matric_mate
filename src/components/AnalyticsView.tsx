import React from 'react';
import { UserProfile, StudySession, QuizResult, Badge } from '../types';
import { MATRIC_SUBJECTS } from '../data/subjectsData';
import { 
  BarChart3, 
  Flame, 
  Trophy, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Star,
  Zap,
  Target
} from 'lucide-react';

interface AnalyticsViewProps {
  profile: UserProfile;
  sessions: StudySession[];
  quizResults: QuizResult[];
  badges: Badge[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  profile,
  sessions,
  quizResults,
  badges,
}) => {
  // Compute overall statistics
  const totalCompleted = sessions.filter((s) => s.status === 'completed').length;
  const totalHours = Math.round(
    sessions
      .filter((s) => s.status === 'completed')
      .reduce((acc, s) => acc + (s.durationMinutes || 60), 0) / 60
  );

  const totalQuizzes = quizResults.length;
  const avgQuizScore =
    totalQuizzes > 0
      ? Math.round(
          (quizResults.reduce((acc, q) => acc + (q.score / q.totalQuestions) * 100, 0) /
            totalQuizzes)
        )
      : 80;

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Progress & Analytics Dashboard</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track study completion, confidence improvements, and earned achievement badges.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span>{profile.streakDays || 1} Day Streak</span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold">Total Hours Studied</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalHours} <span className="text-xs font-medium text-slate-500">Hours</span></div>
          <p className="text-[10px] text-slate-400">Across all Matric subjects</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold font-sans">Completed Sessions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalCompleted} <span className="text-xs font-medium text-slate-500">Sessions</span></div>
          <p className="text-[10px] text-slate-400">Topics covered in full</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold">Avg Quiz Score</span>
            <Trophy className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{avgQuizScore}%</div>
          <p className="text-[10px] text-slate-400">{totalQuizzes} Quizzes taken</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold">Badges Unlocked</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700">
            {badges.filter((b) => b.progress >= b.maxProgress).length} / {badges.length}
          </div>
          <p className="text-[10px] text-slate-400">Achievements earned</p>
        </div>
      </div>

      {/* Grid: Per-Subject Progress Bars + Confidence Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Per-Subject Completion Progress Bars */}
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Per-Subject Revision Completion</span>
          </h3>

          <div className="space-y-4">
            {profile.subjects.map((cfg) => {
              const subDef = MATRIC_SUBJECTS.find((m) => m.id === cfg.subjectId);
              const subSessions = sessions.filter((s) => s.subjectId === cfg.subjectId);
              const subCompleted = subSessions.filter((s) => s.status === 'completed').length;
              const subPct = subSessions.length > 0 ? Math.round((subCompleted / subSessions.length) * 100) : 0;

              return (
                <div key={cfg.subjectId} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{subDef?.name || cfg.subjectId}</span>
                    <span className="font-bold" style={{ color: subDef?.color || '#3b82f6' }}>
                      {subPct}% ({subCompleted}/{subSessions.length})
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${subPct}%`,
                        backgroundColor: subDef?.color || '#3b82f6',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Confidence Growth (Before vs. After Quiz) */}
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Subject Confidence Ratings</span>
          </h3>

          <div className="space-y-3">
            {profile.subjects.map((cfg) => {
              const subDef = MATRIC_SUBJECTS.find((m) => m.id === cfg.subjectId);
              const confidence = cfg.confidence; // 1-5

              return (
                <div key={cfg.subjectId} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs"
                      style={{ backgroundColor: `${subDef?.color || '#3b82f6'}15`, color: subDef?.color }}
                    >
                      {subDef?.code}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{subDef?.name}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Exam Target: {cfg.targetGrade || '75%+'}</p>
                    </div>
                  </div>

                  {/* Star rating display */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= confidence ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1">{confidence}/5</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Badges Earned Gallery */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          <span>Matric Achievements & Badges</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {badges.map((b) => {
            const isUnlocked = b.progress >= b.maxProgress;

            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/60 border-amber-200 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                    isUnlocked ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Trophy className="w-5 h-5" />
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className={`text-xs font-bold ${isUnlocked ? 'text-slate-900' : 'text-slate-600'}`}>
                      {b.title}
                    </h4>
                    {isUnlocked && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-extrabold">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">{b.description}</p>

                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${Math.min(100, (b.progress / b.maxProgress) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
