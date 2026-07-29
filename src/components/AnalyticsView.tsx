import React from 'react';
import { UserProfile, StudySession, QuizResult, Badge } from '../types';
import { getSubjectById } from '../data/curriculumData';
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
  Target,
  Sparkles
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
  // Compute overall statistics from live user records
  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const totalCompleted = completedSessions.length;
  const totalHours = Math.round(
    completedSessions.reduce((acc, s) => acc + (s.durationMinutes || 60), 0) / 60
  );

  const totalQuizzes = quizResults.length;
  const avgQuizScore =
    totalQuizzes > 0
      ? Math.round(
          quizResults.reduce((acc, q) => acc + (q.score / q.totalQuestions) * 100, 0) /
            totalQuizzes
        )
      : 0;

  const hasActivity = totalCompleted > 0 || totalQuizzes > 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Progress &amp; Analytics Dashboard</h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time tracking for {profile.name || 'Student'} ({profile.grade} • {profile.group || 'Science'})
          </p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold self-start sm:self-auto">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span>{profile.streakDays || 1} Day Active Streak</span>
        </div>
      </div>

      {/* Honest Empty State Banner if no logged activity yet */}
      {!hasActivity && (
        <div className="p-6 bg-indigo-50/70 border border-indigo-200 rounded-3xl space-y-2 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">No study sessions or quizzes completed yet</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Complete your first revision session in the Timetable or take a 5-question AI Diagnostic Quiz to see your live progress charts and chapter confidence trends here.
              </p>
            </div>
          </div>
        </div>
      )}

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
              const subDef = getSubjectById(cfg.subjectId);
              const name = subDef?.subject_name || cfg.subjectId;
              const color = subDef?.color || '#3b82f6';

              const subSessions = sessions.filter((s) => s.subjectId === cfg.subjectId);
              const subCompleted = subSessions.filter((s) => s.status === 'completed').length;
              const subPct = subSessions.length > 0 ? Math.round((subCompleted / subSessions.length) * 100) : 0;

              return (
                <div key={cfg.subjectId} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{name}</span>
                    <span className="font-bold" style={{ color }}>
                      {subPct}% ({subCompleted}/{subSessions.length} slots)
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${subPct}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Confidence Ratings & Per-Chapter Confidence Breakdown */}
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Curriculum Confidence Ratings</span>
          </h3>

          <div className="space-y-3">
            {profile.subjects.map((cfg) => {
              const subDef = getSubjectById(cfg.subjectId);
              const name = subDef?.subject_name || cfg.subjectId;
              const code = subDef?.code || 'SUB';
              const color = subDef?.color || '#3b82f6';
              const confidence = cfg.confidence || 3;

              const chapterConfMap = cfg.chapterConfidences || {};
              const totalChapters = subDef?.chapters.length || 0;
              const ratedLow = Object.values(chapterConfMap).filter((c) => c <= 2).length;
              const ratedHigh = Object.values(chapterConfMap).filter((c) => c >= 4).length;

              return (
                <div key={cfg.subjectId} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs"
                        style={{ backgroundColor: `${color}15`, color }}
                      >
                        {code}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{name}</h4>
                        <p className="text-[10px] text-slate-500 font-medium">Exam Date: {cfg.examDate || 'Upcoming'}</p>
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

                  {/* Per-chapter summary breakdown */}
                  {totalChapters > 0 && (
                    <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 pt-2 border-t border-slate-200/80">
                      <span>{totalChapters} Official Chapters</span>
                      <div className="flex items-center gap-2">
                        {ratedLow > 0 && (
                          <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded font-bold border border-rose-100">
                            {ratedLow} Needs Revision
                          </span>
                        )}
                        {ratedHigh > 0 && (
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold border border-emerald-100">
                            {ratedHigh} Mastered
                          </span>
                        )}
                      </div>
                    </div>
                  )}
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
