import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, SubjectConfig } from '../types';
import { getSubjectsForGradeAndGroup, getSubjectById, SubjectDef } from '../data/curriculumData';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Star, 
  Loader2, 
  Check,
  ShieldCheck,
  BookOpen,
  Compass
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
  const [name, setName] = useState(profile.name || '');
  const [grade, setGrade] = useState<'Grade 9' | 'Grade 10'>(profile.grade || 'Grade 10');
  const [group, setGroup] = useState<'Science' | 'Computer Science' | 'Arts'>(profile.group || 'Science');
  const [email, setEmail] = useState(profile.email || '');
  const [dailyHours, setDailyHours] = useState(profile.dailyStudyHours || 3);

  const prevIsOpenRef = useRef(false);
  const prevGradeRef = useRef(grade);
  const prevGroupRef = useRef(group);

  // Dynamic list of subjects based on grade and group
  const availableSubjects: SubjectDef[] = getSubjectsForGradeAndGroup(grade, group);

  // Selected subjects state
  const [selectedSubjectConfigs, setSelectedSubjectConfigs] = useState<SubjectConfig[]>(() => {
    if (profile.subjects && profile.subjects.length > 0 && profile.subjects[0].subjectId.includes('-')) {
      return profile.subjects;
    }
    return getDefaultSubjects(grade, group);
  });

  // Reset/Initialize modal state ONLY when modal transitions from closed to open
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setStep(1);
      const initialName = profile.name || '';
      const initialEmail = profile.email || '';
      const initialGrade = profile.grade || 'Grade 10';
      const initialGroup = profile.group || 'Science';
      const initialHours = profile.dailyStudyHours || 3;

      setName(initialName);
      setEmail(initialEmail);
      setGrade(initialGrade);
      setGroup(initialGroup);
      setDailyHours(initialHours);

      prevGradeRef.current = initialGrade;
      prevGroupRef.current = initialGroup;

      const list = getSubjectsForGradeAndGroup(initialGrade, initialGroup);
      if (profile.subjects && profile.subjects.length > 0) {
        const validSubs = profile.subjects.filter((s) =>
          list.some((l) => l.subject_id === s.subjectId)
        );
        if (validSubs.length > 0) {
          setSelectedSubjectConfigs(validSubs);
        } else {
          setSelectedSubjectConfigs(getDefaultSubjects(initialGrade, initialGroup));
        }
      } else {
        setSelectedSubjectConfigs(getDefaultSubjects(initialGrade, initialGroup));
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, profile]);

  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Automatically update selected subjects when user changes grade or group INSIDE the wizard
  useEffect(() => {
    if (!isOpen) return;
    if (grade === prevGradeRef.current && group === prevGroupRef.current) return;

    prevGradeRef.current = grade;
    prevGroupRef.current = group;

    const list = getSubjectsForGradeAndGroup(grade, group);
    const updated = list.map((sub, idx) => {
      const existing = selectedSubjectConfigs.find((s) => s.subjectId === sub.subject_id);
      if (existing) return existing;

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
    setSelectedSubjectConfigs(updated);
  }, [grade, group, isOpen]);

  if (!isOpen) return null;

  function getFutureDate(daysAhead: number): string {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  }

  function getDefaultSubjects(g: 'Grade 9' | 'Grade 10', grp: 'Science' | 'Computer Science' | 'Arts'): SubjectConfig[] {
    const list = getSubjectsForGradeAndGroup(g, grp);
    return list.map((sub, idx) => {
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

  const toggleSubject = (subjectId: string) => {
    const exists = selectedSubjectConfigs.find((s) => s.subjectId === subjectId);
    if (exists) {
      if (selectedSubjectConfigs.length <= 1) return; // keep at least 1
      setSelectedSubjectConfigs(selectedSubjectConfigs.filter((s) => s.subjectId !== subjectId));
    } else {
      const subDef = getSubjectById(subjectId);
      const chapterConf: Record<number, number> = {};
      subDef?.chapters.forEach((ch) => {
        chapterConf[ch.chapter_number] = 3;
      });
      setSelectedSubjectConfigs([
        ...selectedSubjectConfigs,
        { subjectId, examDate: getFutureDate(21), confidence: 3, chapterConfidences: chapterConf },
      ]);
    }
  };

  const updateExamDate = (subjectId: string, examDate: string) => {
    setSelectedSubjectConfigs(
      selectedSubjectConfigs.map((s) => (s.subjectId === subjectId ? { ...s, examDate } : s))
    );
  };

  const updateChapterConfidence = (subjectId: string, chapterNumber: number, rating: number) => {
    setSelectedSubjectConfigs((prev) =>
      prev.map((s) => {
        if (s.subjectId !== subjectId) return s;
        const subDef = getSubjectById(subjectId);
        const updatedConf: Record<number, number> = { ...(s.chapterConfidences || {}) };
        
        // ensure default for all chapters if missing
        subDef?.chapters.forEach((ch) => {
          if (updatedConf[ch.chapter_number] === undefined) {
            updatedConf[ch.chapter_number] = 3;
          }
        });
        updatedConf[chapterNumber] = rating;

        const ratings = Object.values(updatedConf);
        const avg = Math.round(ratings.reduce((a, b) => a + b, 0) / (ratings.length || 1));

        return {
          ...s,
          confidence: avg,
          chapterConfidences: updatedConf,
        };
      })
    );
  };

  const updateOverallConfidence = (subjectId: string, confidence: number) => {
    setSelectedSubjectConfigs((prev) =>
      prev.map((s) => {
        if (s.subjectId !== subjectId) return s;
        const subDef = getSubjectById(subjectId);
        const updatedConf: Record<number, number> = { ...(s.chapterConfidences || {}) };
        subDef?.chapters.forEach((ch) => {
          updatedConf[ch.chapter_number] = confidence;
        });
        return {
          ...s,
          confidence,
          chapterConfidences: updatedConf,
        };
      })
    );
  };

  const handleFinishSetup = async () => {
    setIsGenerating(true);
    const updated: UserProfile = {
      ...profile,
      name,
      grade,
      group,
      board: 'BISE Lahore',
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
      setStep(6);
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
            <span className="font-bold text-sm tracking-wide text-indigo-950">BISE Lahore Matric Setup</span>
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Compass className="w-3.5 h-3.5 text-indigo-600" />
                  <span>BISE Lahore • PCTB / SNC Framework</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome to MatricMate
                </h2>
                <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base font-medium">
                  Your AI study planner & exam revision companion powered by the official BISE Lahore Class 9–10 curriculum.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto pt-2">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <Sparkles className="w-5 h-5 text-indigo-600 mb-1" />
                  <h4 className="font-bold text-xs text-slate-900">Official Curriculum</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Pre-loaded with official PCTB Class 9 & 10 chapters and key topics.</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <BookOpen className="w-5 h-5 text-cyan-600 mb-1" />
                  <h4 className="font-bold text-xs text-slate-900">AI Board Tutor</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Ask doubts on any chapter and get step-by-step exam solutions.</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                  <h4 className="font-bold text-xs text-slate-900">Smart Quizzes</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Test understanding with BISE board SLO taxonomy questions.</p>
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

          {/* STEP 2: Profile & Stream Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Profile & Academic Stream</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Select your Grade level and Academic Group under BISE Lahore.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ali Raza"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Grade / Class</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Grade 9">SSC Part I (Class 9)</option>
                      <option value="Grade 10">SSC Part II (Class 10)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Group</label>
                    <select
                      value={group}
                      onChange={(e) => setGroup(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Science">Science (Bio, Phy, Chem)</option>
                      <option value="Computer Science">Computer Science (CS, Phy, Chem)</option>
                      <option value="Arts">Arts (General Math & Gen Science)</option>
                    </select>
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
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Available BISE Lahore subjects for {grade} ({group} Group):
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {availableSubjects.map((sub) => {
                  const isSelected = selectedSubjectConfigs.some((s) => s.subjectId === sub.subject_id);
                  return (
                    <div
                      key={sub.subject_id}
                      onClick={() => toggleSubject(sub.subject_id)}
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
                          <h4 className="text-xs font-bold text-slate-900">{sub.subject_name}</h4>
                          <p className="text-[10px] text-slate-500 font-medium">{sub.chapters.length} Chapters in Syllabus</p>
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
                <p className="text-xs text-slate-500 font-medium mt-1">When do your final BISE board exams start for each subject?</p>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {selectedSubjectConfigs.map((cfg) => {
                  const subDef = getSubjectById(cfg.subjectId);
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
                        <span className="text-xs font-bold text-slate-900">{subDef?.subject_name || cfg.subjectId}</span>
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

          {/* STEP 5: Confidence Rating (Per-Chapter Sourced from Knowledge Base) */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Per-Chapter Confidence Ratings</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Rate your confidence (1 = Needs urgent revision, 5 = Mastered) for each official curriculum chapter.
                </p>
              </div>

              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {selectedSubjectConfigs.map((cfg) => {
                  const subDef = getSubjectById(cfg.subjectId);
                  const chapters = subDef?.chapters || [];
                  const isExpanded = expandedSubjectId === cfg.subjectId || selectedSubjectConfigs.length <= 2;

                  return (
                    <div key={cfg.subjectId} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px]"
                            style={{ backgroundColor: `${subDef?.color || '#3b82f6'}15`, color: subDef?.color }}
                          >
                            {subDef?.code}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{subDef?.subject_name || cfg.subjectId}</h4>
                            <p className="text-[10px] text-slate-500">{chapters.length} Curriculum Chapters</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                            Avg: {cfg.confidence}/5
                          </span>
                          <button
                            type="button"
                            onClick={() => setExpandedSubjectId(isExpanded ? null : cfg.subjectId)}
                            className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline"
                          >
                            {isExpanded ? 'Collapse Chapters' : 'Expand Chapters'}
                          </button>
                        </div>
                      </div>

                      {/* Overall Quick Set bar */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 bg-white p-2 rounded-xl border border-slate-200">
                        <span>Set all chapters to:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => updateOverallConfidence(cfg.subjectId, star)}
                              className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 border border-slate-200"
                            >
                              {star}★
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Per Chapter List */}
                      {isExpanded && (
                        <div className="space-y-2 pt-1 border-t border-slate-200">
                          {chapters.map((ch) => {
                            const currentRating =
                              cfg.chapterConfidences?.[ch.chapter_number] ?? cfg.confidence ?? 3;

                            return (
                              <div
                                key={ch.chapter_number}
                                className="p-2.5 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                              >
                                <div>
                                  <span className="text-[11px] font-bold text-slate-900">
                                    Ch {ch.chapter_number}: {ch.chapter_title}
                                  </span>
                                  <p className="text-[10px] text-slate-400 font-medium truncate max-w-xs">
                                    {ch.key_topics.slice(0, 2).join(', ')}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1 self-end sm:self-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => updateChapterConfidence(cfg.subjectId, ch.chapter_number, star)}
                                      className={`p-1 rounded-lg border text-[10px] font-bold flex items-center gap-0.5 transition-all ${
                                        currentRating >= star
                                          ? 'bg-amber-50 border-amber-300 text-amber-900 font-extrabold'
                                          : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                                      }`}
                                    >
                                      <Star
                                        className={`w-3 h-3 ${
                                          currentRating >= star ? 'fill-amber-400 text-amber-500' : ''
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
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
                  MatricMate AI has crafted your personalized revision timetable synced with your BISE Lahore exam dates & confidence ratings.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Target Class & Group:</span>
                  <strong className="text-slate-900">{grade} ({group})</strong>
                </div>
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
                      .map((s) => getSubjectById(s.subjectId)?.code)
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
