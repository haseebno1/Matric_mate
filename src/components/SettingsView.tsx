import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserProfile, SubjectConfig } from '../types';
import { getSubjectsForGradeAndGroup } from '../data/curriculumData';
import { MATRIC_SUBJECTS } from '../data/subjectsData';
import { setClientApiKey, getClientApiKey } from '../lib/clientAI';
import { 
  Settings, 
  User, 
  Bell, 
  BookOpen, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Calendar,
  Sliders,
  Key,
  Sparkles,
  LogOut,
  Camera,
  Image as ImageIcon
} from 'lucide-react';

interface SettingsViewProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onResetAllData: () => void;
  onOpenOnboarding: () => void;
  onLogout?: () => void;
}

function getFutureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onSaveProfile,
  onResetAllData,
  onOpenOnboarding,
  onLogout,
}) => {
  const [name, setName] = useState(profile.name || '');
  const [photoUrl, setPhotoUrl] = useState(profile.photoUrl || '');
  const [grade, setGrade] = useState<'Grade 9' | 'Grade 10'>(profile.grade || 'Grade 10');
  const [group, setGroup] = useState<'Science' | 'Computer Science' | 'Arts'>(profile.group || 'Science');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [dailyHours, setDailyHours] = useState(profile.dailyStudyHours || 3);
  const [apiKey, setApiKey] = useState(getClientApiKey(profile.apiKey) || '');

  // Notification states
  const [studyReminders, setStudyReminders] = useState(true);
  const [breakTimers, setBreakTimers] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setClientApiKey(apiKey);
    
    // Sync with Firebase auth current user if available
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: name.trim() || undefined,
          photoURL: photoUrl.trim() || undefined,
        });
      } catch (e) {
        console.warn('Could not update Auth profile:', e);
      }
    }

    const groupOrGradeChanged = group !== profile.group || grade !== profile.grade;

    let updatedSubjects = profile.subjects;
    if (groupOrGradeChanged || !profile.subjects || profile.subjects.length === 0) {
      const list = getSubjectsForGradeAndGroup(grade, group);
      updatedSubjects = list.map((sub, idx) => {
        const chapterConf: Record<number, number> = {};
        sub.chapters.forEach((ch) => {
          chapterConf[ch.chapter_number] = 3;
        });
        return {
          subjectId: sub.subject_id,
          examDate: getFutureDate(15 + idx * 3),
          confidence: 3,
          chapterConfidences: chapterConf,
        };
      });
    }

    const updated: UserProfile = {
      ...profile,
      name: name.trim() || 'Student',
      photoUrl: photoUrl.trim() || undefined,
      grade,
      group,
      board: 'BISE Lahore',
      email: email.trim(),
      phone: phone.trim(),
      dailyStudyHours: dailyHours,
      apiKey: apiKey.trim(),
      subjects: updatedSubjects,
    };

    onSaveProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);

    if (groupOrGradeChanged) {
      setTimeout(() => {
        onOpenOnboarding();
      }, 350);
    }
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
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Authenticated Student Profile Details</span>
          </h3>
          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
            Firebase Auth Synced
          </span>
        </div>

        {/* Profile Picture Header Row */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
          <div className="relative shrink-0">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={name || 'Profile Picture'}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-xs"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-xs">
                {name ? name.charAt(0).toUpperCase() : 'S'}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-lg shadow border border-slate-200 text-indigo-600">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex-1 space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-extrabold text-slate-900">{name || 'Student Name'}</h4>
            <p className="text-xs text-slate-500 font-medium">{email || 'No email associated'}</p>
            <p className="text-[11px] text-slate-400">
              Authentication provider: Google Sign-In or Email Account
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name (Display Name)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ali Ahmed"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Profile Picture URL (Avatar Image)</span>
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://lh3.googleusercontent.com/... or custom image URL"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Populated automatically from Google Sign-In or custom URL.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Grade Level</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value as any)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="Grade 9">Grade 9 (SSC Part I)</option>
              <option value="Grade 10">Grade 10 (SSC Part II)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Group (BISE Lahore)</label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value as any)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="Science">Science (Bio, Phy, Chem)</option>
              <option value="Computer Science">Computer Science (CS, Phy, Chem)</option>
              <option value="Arts">Arts (General Math & Gen Science)</option>
            </select>
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

      {/* AI & Standalone API Key Configuration */}
      <div className="p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl shadow-sm space-y-4 border border-indigo-800">
        <div className="flex items-center justify-between border-b border-indigo-800/80 pb-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Gemini AI & Static Hosting Configuration (Netlify / Vercel)</span>
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Live AI Integration
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          When deployed to static hosts like Netlify, Vercel, or GitHub Pages without a Node server backend, you can provide a Gemini API key here or via the <code className="px-1.5 py-0.5 bg-slate-800 rounded text-amber-300">VITE_GEMINI_API_KEY</code> environment variable to enable live Gemini 2.5 Flash scheduling, tutor Q&amp;A, and quiz generation.
        </p>

        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-indigo-400" />
            <span>Google Gemini API Key</span>
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-slate-800/80 border border-indigo-700/60 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400"
            />
            {apiKey && (
              <button
                type="button"
                onClick={() => setApiKey('')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl font-medium border border-slate-700 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            Key is stored locally in browser storage. Leave empty to use fallback intelligent engines or backend proxy.
          </p>
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

        {onLogout && (
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Sign Out of Firebase Account</h4>
              <p className="text-[11px] text-slate-500 font-medium">Signed in as {profile.email || 'Student'}</p>
            </div>

            <button
              onClick={onLogout}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
