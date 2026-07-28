import React, { useState } from 'react';
import { UserProfile, SubjectConfig } from '../types';
import { MATRIC_SUBJECTS } from '../data/subjectsData';
import { 
  Settings, 
  User, 
  Bell, 
  BookOpen, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Calendar,
  Sliders
} from 'lucide-react';

interface SettingsViewProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onResetAllData: () => void;
  onOpenOnboarding: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onSaveProfile,
  onResetAllData,
  onOpenOnboarding,
}) => {
  const [name, setName] = useState(profile.name || '');
  const [grade, setGrade] = useState<'Grade 9' | 'Grade 10'>(profile.grade || 'Grade 10');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [dailyHours, setDailyHours] = useState(profile.dailyStudyHours || 3);

  // Notification states
  const [studyReminders, setStudyReminders] = useState(true);
  const [breakTimers, setBreakTimers] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    const updated: UserProfile = {
      ...profile,
      name,
      grade,
      email,
      phone,
      dailyStudyHours: dailyHours,
    };
    onSaveProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center">
            <Settings className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Account & Preference Settings</h2>
            <p className="text-xs text-slate-500 font-medium">Manage profile details, notification preferences, and subjects.</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-all"
        >
          {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Saved!' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Account Info Form */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
          <User className="w-4 h-4 text-indigo-600" />
          <span>Student Account Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Grade Level</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value as any)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10 (Matric Prep)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (Parent/Student)</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-700">Target Daily Study Time</label>
            <span className="text-xs font-bold text-indigo-600">{dailyHours} Hours/day</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            value={dailyHours}
            onChange={(e) => setDailyHours(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
          <Bell className="w-4 h-4 text-amber-600" />
          <span>Notification & Reminder Preferences</span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Daily Study Reminders</h4>
              <p className="text-[11px] text-slate-500 font-medium">Receive alerts 15 minutes before scheduled study slots</p>
            </div>
            <input
              type="checkbox"
              checked={studyReminders}
              onChange={(e) => setStudyReminders(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Pomodoro & Break Timers</h4>
              <p className="text-[11px] text-slate-500 font-medium">Prompt a 10-minute rest break every 50 minutes of studying</p>
            </div>
            <input
              type="checkbox"
              checked={breakTimers}
              onChange={(e) => setBreakTimers(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Streak Saver Alerts</h4>
              <p className="text-[11px] text-slate-500 font-medium">Notify me in the evening if today's study session is pending</p>
            </div>
            <input
              type="checkbox"
              checked={streakAlerts}
              onChange={(e) => setStreakAlerts(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Re-run Setup & Data Management */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
          <Sliders className="w-4 h-4 text-purple-600" />
          <span>Subjects & Timetable Re-configuration</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900">Re-run Setup Wizard</h4>
            <p className="text-[11px] text-slate-500 font-medium">Update subjects, exam dates, or baseline confidence scores</p>
          </div>

          <button
            onClick={onOpenOnboarding}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 rounded-xl transition-colors"
          >
            Open Setup Wizard
          </button>
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-rose-600">Reset Local Progress</h4>
            <p className="text-[11px] text-slate-500 font-medium">Clear local cache and restore sample Matric data</p>
          </div>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all schedule data?')) {
                onResetAllData();
              }
            }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 rounded-xl flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
