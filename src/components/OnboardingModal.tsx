import React, { useState } from 'react';
import { UserProfile, SubjectConfig } from '../types';
import { MATRIC_SUBJECTS } from '../data/subjectsData';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Star, 
  Clock, 
  Loader2, 
  Check,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfileAndGenerate: (updatedProfile: UserProfile) => Promise<void>;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfileAndGenerate,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [name, setName] = useState(profile.name || 'Sipho Dlamini');
  const [grade, setGrade] = useState<'Grade 9' | 'Grade 10'>(profile.grade || 'Grade 10');
  const [email, setEmail] = useState(profile.email || 'sipho@matricmate.co.za');
  const [dailyHours, setDailyHours] = useState(profile.dailyStudyHours || 3);
  
  // Selected subjects state
  const [selectedSubjectConfigs, setSelectedSubjectConfigs] = useState<SubjectConfig[]>(
    profile.subjects && profile.subjects.length > 0
      ? profile.subjects
      : [
          { subjectId: 'math', examDate: getFutureDate(14), confidence: 2 },
          { subjectId: 'physics', examDate: getFutureDate(20), confidence: 3 },
          { subjectId: 'life_sci', examDate: getFutureDate(26), confidence: 4 },
          { subjectId: 'english', examDate: getFutureDate(10), confidence: 5 },
        ]
  );

  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  function getFutureDate(daysAhead: number): string {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  }

  const toggleSubject = (subjectId: string) => {
    const exists = selectedSubjectConfigs.find((s) => s.subjectId === subjectId);
    if (exists) {
      if (selectedSubjectConfigs.length <= 1) return; // keep at least 1
      setSelectedSubjectConfigs(selectedSubjectConfigs.filter((s) => s.subjectId !== subjectId));
    } else {
      setSelectedSubjectConfigs([
        ...selectedSubjectConfigs,
        { subjectId, examDate: getFutureDate(21), confidence: 3 },
      ]);
    }
  };

  const updateExamDate = (subjectId: string, examDate: string) => {
    setSelectedSubjectConfigs(
      selectedSubjectConfigs.map((s) => (s.subjectId === subjectId ? { ...s, examDate } : s))
    );
  };

  const updateConfidence = (subjectId: string, confidence: number) => {
    setSelectedSubjectConfigs(
      selectedSubjectConfigs.map((s) => (s.subjectId === subjectId ? { ...s, confidence } : s))
    );
  };

  const handleFinishSetup = async () => {
    setIsGenerating(true);
    const updated: UserProfile = {
      ...profile,
      name,
      grade,
      email,
      dailyStudyHours: dailyHours,
      subjects: selectedSubjectConfigs,
      onboardingCompleted: true,
    };

    try {
      await onSaveProfileAndGenerate(updated);
      setStep(6);
    } catch (e) {
      console.error('Generation error', e);
      setStep(6); // still continue
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        {/* Step Indicator Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-sm tracking-wide text-indigo-950">MatricMate Setup Wizard</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <span>Step {step} of 6</span>
            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: Welcome Screen */}
          {step === 1 && (
            <div className="text-center space-y-6 py-2">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-600 p-1 flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-indigo-600 animate-bounce" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome to MatricMate
                </h2>
                <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base font-medium">
                  Your AI-powered study planner & exam revision companion designed specifically for Grade 9–10 Matric success.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto pt-2">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <Sparkles className="w-5 h-5 text-indigo-600 mb-1" />
                  <h4 className="font-bold text-xs text-slate-900">Adaptive Schedule</h4>
                  <p className="text-[11px] text-slate-500 font-medium">AI auto-allocates revision based on confidence & exam dates.</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <BookOpen className="w-5 h-5 text-cyan-600 mb-1" />
                  <h4 className="font-bold text-xs text-slate-900">AI Study Buddy</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Ask questions 24/7 & get simple step-by-step explanations.</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                  <h4 className="font-bold text-xs text-slate-900">Smart Quizzes</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Test understanding & automatically reschedule weak topics.</p>
                </div>
              </div>

              <button
                id="welcome-get-started-btn"
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 mx-auto transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Account Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Let’s set up your Profile</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Tell us your name and daily study availability.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sipho Dlamini"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Grade Level</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10 (Matric Prep)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email / Phone</label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@school.co.za"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">Target Daily Study Time</label>
                    <span className="text-xs font-bold text-indigo-600">{dailyHours} Hours / day</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                    <span>1h (Light)</span>
                    <span>3h (Recommended)</span>
                    <span>6h (Intensive)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-xs"
                >
                  <span>Select Subjects</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Subject Selection */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Select Your Subjects</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Choose all Matric subjects you are currently studying.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {MATRIC_SUBJECTS.map((sub) => {
                  const isSelected = selectedSubjectConfigs.some((s) => s.subjectId === sub.id);
                  return (
                    <div
                      key={sub.id}
                      onClick={() => toggleSubject(sub.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-300 text-slate-900 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs"
                          style={{ backgroundColor: `${sub.color}15`, color: sub.color }}
                        >
                          {sub.code}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{sub.name}</h4>
                          <p className="text-[10px] text-slate-500 font-medium">{sub.defaultTopics.length} Core Topics</p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-xs"
                >
                  <span>Exam Dates</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Exam Date Input */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Enter Exam Dates</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">When do your final or term exams start for each subject?</p>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {selectedSubjectConfigs.map((cfg) => {
                  const subDef = MATRIC_SUBJECTS.find((m) => m.id === cfg.subjectId);
                  return (
                    <div
                      key={cfg.subjectId}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px]"
                          style={{ backgroundColor: `${subDef?.color || '#3b82f6'}15`, color: subDef?.color }}
                        >
                          {subDef?.code}
                        </div>
                        <span className="text-xs font-bold text-slate-900">{subDef?.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          value={cfg.examDate}
                          onChange={(e) => updateExamDate(cfg.subjectId, e.target.value)}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-xs"
                >
                  <span>Confidence Rating</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Confidence Rating */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Rate Your Confidence</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  1 = Urgent help needed, 5 = Mastered. The AI will prioritize lower-rated subjects.
                </p>
              </div>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {selectedSubjectConfigs.map((cfg) => {
                  const subDef = MATRIC_SUBJECTS.find((m) => m.id === cfg.subjectId);
                  return (
                    <div key={cfg.subjectId} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-900">{subDef?.name}</span>
                        <span className="text-xs font-semibold text-indigo-600">
                          {cfg.confidence}/5 {cfg.confidence <= 2 ? '(Priority Revision)' : cfg.confidence >= 4 ? '(Strong)' : '(Moderate)'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => updateConfidence(cfg.subjectId, star)}
                            className={`flex-1 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                              cfg.confidence >= star
                                ? 'bg-amber-100 border-amber-300 text-amber-900'
                                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                            }`}
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                cfg.confidence >= star ? 'fill-amber-400 text-amber-500' : ''
                              }`}
                            />
                            <span>{star}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => setStep(4)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  onClick={handleFinishSetup}
                  disabled={isGenerating}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Generating AI Schedule...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Generate My Schedule</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Setup Complete Confirmation */}
          {step === 6 && (
            <div className="text-center space-y-6 py-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-slate-900">Your Schedule is Ready!</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto font-medium">
                  MatricMate AI has crafted your personalized revision timetable synced with your exam dates & confidence ratings.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Selected Subjects:</span>
                  <strong className="text-slate-900">{selectedSubjectConfigs.length} Subjects</strong>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Daily Study Allocation:</span>
                  <strong className="text-indigo-600">{dailyHours} Hours/day</strong>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>High Priority Subjects:</span>
                  <strong className="text-amber-700">
                    {selectedSubjectConfigs
                      .filter((s) => s.confidence <= 2)
                      .map((s) => MATRIC_SUBJECTS.find((m) => m.id === s.subjectId)?.code)
                      .join(', ') || 'Balanced'}
                  </strong>
                </div>
              </div>

              <button
                id="setup-go-to-dashboard-btn"
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 mx-auto transition-colors"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
