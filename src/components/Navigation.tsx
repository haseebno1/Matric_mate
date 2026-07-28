import React from 'react';
import { ActiveTab, UserProfile } from '../types';
import { MATRIC_SUBJECTS } from '../data/subjectsData';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Bot, 
  BrainCircuit, 
  BarChart3, 
  BookMarked, 
  Settings,
  Flame,
  GraduationCap,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: UserProfile;
  onOpenOnboarding: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenOnboarding,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Find nearest exam
  const sortedExams = React.useMemo(() => {
    if (!profile.subjects || profile.subjects.length === 0) return [];
    return [...profile.subjects]
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
        };
      })
      .filter((e) => e.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [profile.subjects]);

  const nearestExam = sortedExams[0];

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'schedule', label: 'Timetable', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'buddy', label: 'Study Buddy', icon: <Bot className="w-4 h-4" /> },
    { id: 'quiz', label: 'AI Quiz', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes', icon: <BookMarked className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm font-bold">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  MatricMate
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Grade 9–10 Revision Companion</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Status Bar */}
          <div className="flex items-center gap-3">
            {/* Nearest Exam Countdown pill */}
            {nearestExam && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>
                  {nearestExam.subjectName} Exam: <strong className="text-amber-950 font-bold">{nearestExam.daysLeft}d left</strong>
                </span>
              </div>
            )}

            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-600" />
              <span>{profile.streakDays || 1} Days Strong</span>
            </div>

            {/* Profile Avatar & Re-Run Setup */}
            <button
              id="user-profile-button"
              onClick={onOpenOnboarding}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              title="Click to re-run setup wizard or edit timetable"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-200">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 hidden sm:block" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
