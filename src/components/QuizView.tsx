import React, { useState } from 'react';
import { QuizQuestion, QuizResult, UserProfile, StudySession } from '../types';
import { getSubjectById } from '../data/curriculumData';
import { MATRIC_SUBJECTS } from '../data/subjectsData';
import { generateFallbackQuiz } from '../lib/fallbackAI';
import { generateQuizAI } from '../lib/clientAI';
import { 
  BrainCircuit, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Loader2, 
  Trophy, 
  ArrowRight, 
  RotateCcw, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface QuizViewProps {
  profile: UserProfile;
  onQuizCompleted: (result: QuizResult) => void;
  onAddWeakTopicsToSchedule: (weakTopics: string[], subjectId: string) => Promise<void>;
}

export const QuizView: React.FC<QuizViewProps> = ({
  profile,
  onQuizCompleted,
  onAddWeakTopicsToSchedule,
}) => {
  const initialSubId = profile.subjects && profile.subjects[0] ? profile.subjects[0].subjectId : 'PHY-10';
  const [subjectId, setSubjectId] = useState<string>(initialSubId);

  const selectedSubDef = getSubjectById(subjectId);
  const initialTopic = selectedSubDef && selectedSubDef.chapters.length > 0
    ? `Ch ${selectedSubDef.chapters[0].chapter_number}: ${selectedSubDef.chapters[0].chapter_title}`
    : 'Core Concepts';

  const [topic, setTopic] = useState<string>(initialTopic);

  // Quiz state
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isAddingToSchedule, setIsAddingToSchedule] = useState(false);
  const [addedToScheduleSuccess, setAddedToScheduleSuccess] = useState(false);

  // Generate Quiz from AI API
  const handleStartQuiz = async () => {
    setIsGenerating(true);
    setQuizFinished(false);
    setSelectedAnswers([]);
    setCurrentIdx(0);
    setShowExplanation(false);
    setAddedToScheduleSuccess(false);

    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectName: selectedSubDef?.subject_name || 'Mathematics',
          topic: topic,
          numQuestions: 5,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
          return;
        }
      }
      throw new Error('Server API unavailable, trying client AI');
    } catch (e) {
      console.warn('Quiz API unavailable, attempting client Gemini API / fallback:', e);
      const questions = await generateQuizAI(selectedSubDef?.subject_name || 'Mathematics', topic, profile.apiKey);
      setQuestions(questions);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (optIdx: number) => {
    if (showExplanation) return; // locked after answering
    const updated = [...selectedAnswers];
    updated[currentIdx] = optIdx;
    setSelectedAnswers(updated);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowExplanation(selectedAnswers[currentIdx + 1] !== undefined);
    } else {
      // Finish Quiz
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let score = 0;
    const weak: string[] = [];

    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      } else {
        if (!weak.includes(q.topic)) weak.push(q.topic);
      }
    });

    const result: QuizResult = {
      id: `qres-${Date.now()}`,
      subjectId: subjectId,
      topic: topic,
      score: score,
      totalQuestions: questions.length,
      date: new Date().toISOString().split('T')[0],
      weakTopicsIdentified: weak,
    };

    onQuizCompleted(result);
    setQuizFinished(true);
  };

  const handleAddWeakToSchedule = async () => {
    setIsAddingToSchedule(true);
    try {
      const weakList = questions
        .filter((_, idx) => selectedAnswers[idx] !== questions[idx].correctIndex)
        .map((q) => q.topic);

      const targetTopics = weakList.length > 0 ? weakList : [topic];
      await onAddWeakTopicsToSchedule(targetTopics, subjectId);
      setAddedToScheduleSuccess(true);
    } catch (e) {
      console.error('Error adding weak topics', e);
    } finally {
      setIsAddingToSchedule(false);
    }
  };

  const currentQ = questions[currentIdx];
  const userScore = questions.reduce(
    (acc, q, idx) => (selectedAnswers[idx] === q.correctIndex ? acc + 1 : acc),
    0
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">AI Revision Quiz Generator</h2>
            <p className="text-xs text-slate-500 font-medium">Test your exam readiness & automatically reschedule weak topics.</p>
          </div>
        </div>
      </div>

      {/* QUIZ SETUP STATE */}
      {questions.length === 0 && !isGenerating && (
        <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">Choose Quiz Subject & Topic</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
              <select
                value={subjectId}
                onChange={(e) => {
                  const newSubId = e.target.value;
                  setSubjectId(newSubId);
                  const newSubDef = getSubjectById(newSubId);
                  if (newSubDef && newSubDef.chapters.length > 0) {
                    setTopic(`Ch ${newSubDef.chapters[0].chapter_number}: ${newSubDef.chapters[0].chapter_title}`);
                  }
                }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                {profile.subjects.map((s) => {
                  const sDef = getSubjectById(s.subjectId);
                  return (
                    <option key={s.subjectId} value={s.subjectId}>
                      {sDef ? sDef.subject_name : s.subjectId}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Curriculum Chapter / Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                {getSubjectById(subjectId)?.chapters.map((ch) => {
                  const titleStr = `Ch ${ch.chapter_number}: ${ch.chapter_title}`;
                  return (
                    <option key={ch.chapter_number} value={titleStr}>
                      {titleStr}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <button
            id="start-quiz-btn"
            onClick={handleStartQuiz}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate 5-Question AI Quiz</span>
          </button>
        </div>
      )}

      {/* GENERATING LOADING STATE */}
      {isGenerating && (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Generating AI Quiz...</h3>
          <p className="text-xs text-slate-500">
            Fetching exam-style questions for <strong className="text-emerald-700">{selectedSubDef?.subject_name}: {topic}</strong>...
          </p>
        </div>
      )}

      {/* ACTIVE QUIZ SCREEN (1 Question at a time) */}
      {questions.length > 0 && !quizFinished && (
        <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-3">
            <span className="font-bold text-slate-700">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-1">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-6 h-2 rounded-full ${
                    idx === currentIdx
                      ? 'bg-emerald-600'
                      : idx < currentIdx
                      ? selectedAnswers[idx] === questions[idx].correctIndex
                        ? 'bg-emerald-200'
                        : 'bg-rose-200'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase text-emerald-700 tracking-wider">
              {currentQ.topic}
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentIdx] === optIdx;
              const isCorrect = currentQ.correctIndex === optIdx;

              let btnClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300';

              if (showExplanation) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnClass = 'bg-rose-50 border-rose-300 text-rose-900 font-bold';
                } else {
                  btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={showExplanation}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium flex items-center justify-between transition-all ${btnClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {showExplanation && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {showExplanation && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Immediate Feedback Explanation Box */}
          {showExplanation && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 animate-fade-in">
              <div className="flex items-center gap-2">
                {selectedAnswers[currentIdx] === currentQ.correctIndex ? (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Incorrect
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next / Finish Button */}
          {showExplanation && (
            <button
              onClick={handleNextQuestion}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>{currentIdx < questions.length - 1 ? 'Next Question' : 'View Quiz Summary'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* END-OF-QUIZ SUMMARY SCREEN */}
      {quizFinished && (
        <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Quiz Completed!</h3>
            <p className="text-xs text-slate-500">
              Subject: <strong className="text-slate-900">{selectedSubDef?.subject_name}</strong> • Topic: <strong className="text-emerald-700">{topic}</strong>
            </p>
          </div>

          {/* Score Circle Card */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto space-y-2">
            <div className="text-4xl font-black text-emerald-600">
              {userScore} / {questions.length}
            </div>
            <p className="text-xs font-bold text-slate-800">
              Score: {Math.round((userScore / questions.length) * 100)}%
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              {userScore >= 4 ? '🎉 Excellent mastery! Keep up the momentum.' : '👍 Good effort! Consider scheduling extra revision for weak areas.'}
            </p>
          </div>

          {/* Weak Topics Reschedule Prompt */}
          <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-2xl text-left space-y-3 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Adaptive Schedule Prompt</span>
            </div>
            <p className="text-xs text-indigo-900/80">
              Want the AI to automatically insert targeted revision slots for flagged topics before your exam date?
            </p>

            <button
              id="add-weak-to-schedule-btn"
              onClick={handleAddWeakToSchedule}
              disabled={isAddingToSchedule || addedToScheduleSuccess}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-all shadow-xs"
            >
              {isAddingToSchedule ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rescheduling Timetable...</span>
                </>
              ) : addedToScheduleSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Added to Schedule!</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 text-amber-300" />
                  <span>Add Weak Topics to Timetable</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => {
              setQuestions([]);
              setQuizFinished(false);
            }}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200"
          >
            Take Another Quiz
          </button>
        </div>
      )}
    </div>
  );
};
