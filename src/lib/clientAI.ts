import { GoogleGenAI } from '@google/genai';
import { StudySession, QuizQuestion } from '../types';
import { MATRIC_SUBJECTS } from '../data/subjectsData';
import { generateFallbackSchedule, generateFallbackBuddyReply, generateFallbackQuiz } from './fallbackAI';

/**
 * Get active Gemini API Key for client-side static mode
 */
export function getClientApiKey(profileApiKey?: string): string | null {
  if (profileApiKey && profileApiKey.trim().length > 0) {
    return profileApiKey.trim();
  }
  const stored = localStorage.getItem('matricmate_gemini_api_key');
  if (stored && stored.trim().length > 0) {
    return stored.trim();
  }
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim().length > 0) {
    return envKey.trim();
  }
  return null;
}

/**
 * Save custom Gemini API key to local storage
 */
export function setClientApiKey(apiKey: string) {
  if (apiKey && apiKey.trim().length > 0) {
    localStorage.setItem('matricmate_gemini_api_key', apiKey.trim());
  } else {
    localStorage.removeItem('matricmate_gemini_api_key');
  }
}

/**
 * Generate study schedule using direct Gemini Client API if key is available,
 * otherwise fallback gracefully.
 */
export async function generateScheduleAI(
  subjectsConfig: { subjectId: string; examDate: string; confidence: number }[],
  dailyHours: number = 3,
  apiKeyOverride?: string
): Promise<StudySession[]> {
  const apiKey = getClientApiKey(apiKeyOverride);

  if (!apiKey) {
    return generateFallbackSchedule(subjectsConfig, dailyHours);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const formattedSubjects = subjectsConfig.map((s) => {
      const def = MATRIC_SUBJECTS.find((m) => m.id === s.subjectId);
      return {
        id: s.subjectId,
        name: def?.name || s.subjectId,
        examDate: s.examDate,
        confidence: s.confidence,
        topics: def?.defaultTopics || [],
      };
    });

    const prompt = `You are an expert Matric high school exam strategist. Create a realistic, highly effective 7-day study timetable for a student with these subjects:
${JSON.stringify(formattedSubjects, null, 2)}
Daily study target: ${dailyHours} hours.
Prioritize subjects with lower confidence ratings and imminent exam dates.

Return ONLY a valid JSON array of objects with these exact keys:
[
  {
    "id": "s-1",
    "subjectId": "maths",
    "topic": "Algebra & Quadratic Equations",
    "date": "YYYY-MM-DD",
    "timeSlot": "15:30 - 16:30",
    "durationMinutes": 60,
    "notes": "Focus on factoring and discriminant formula",
    "status": "pending"
  }
]
Dates should start from today (${new Date().toISOString().split('T')[0]}). Ensure 2 to 4 sessions per day matching ${dailyHours} hours. Return JSON array ONLY.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '';
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item, idx) => ({
        id: item.id || `s-ai-${Date.now()}-${idx}`,
        subjectId: item.subjectId || subjectsConfig[0]?.subjectId || 'maths',
        topic: item.topic || 'General Revision',
        date: item.date || new Date().toISOString().split('T')[0],
        timeSlot: item.timeSlot || '16:00 - 17:00',
        durationMinutes: item.durationMinutes || 60,
        notes: item.notes || 'AI Suggested session',
        status: 'pending',
      }));
    }
  } catch (err) {
    console.warn('Client-side Gemini Schedule API failed, using fallback schedule:', err);
  }

  return generateFallbackSchedule(subjectsConfig, dailyHours);
}

/**
 * Chat with Study Buddy using direct Gemini Client API if key is available
 */
export async function chatBuddyAI(
  question: string,
  subjectName: string,
  topic: string,
  apiKeyOverride?: string
): Promise<string> {
  const apiKey = getClientApiKey(apiKeyOverride);

  if (!apiKey) {
    return generateFallbackBuddyReply(question, subjectName, topic);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are "MatricMate Buddy", a supportive, clear tutor for Matric high school students.
Subject: ${subjectName}
Topic: ${topic}
Student Question: "${question}"

Provide a structured, step-by-step breakdown. Highlight common exam pitfalls or mark allocation rules. Keep explanation encouraging, clear, and focused on helping the student score maximum marks in Matric exams. Use markdown formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    if (response.text && response.text.trim().length > 0) {
      return response.text.trim();
    }
  } catch (err) {
    console.warn('Client-side Gemini Chat API failed, using fallback reply:', err);
  }

  return generateFallbackBuddyReply(question, subjectName, topic);
}

/**
 * Generate Quiz using direct Gemini Client API if key is available
 */
export async function generateQuizAI(
  subjectName: string,
  topic: string,
  apiKeyOverride?: string
): Promise<QuizQuestion[]> {
  const apiKey = getClientApiKey(apiKeyOverride);

  if (!apiKey) {
    return generateFallbackQuiz(subjectName, topic);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Generate 5 multiple-choice exam-style questions for a Matric high school student on:
Subject: ${subjectName}
Topic: ${topic}

Return ONLY a valid JSON array of 5 objects with this format:
[
  {
    "id": "q1",
    "question": "What is...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 1,
    "explanation": "Clear explanation of why option B is correct and common exam trap to avoid.",
    "topic": "${topic}"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '';
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((q, idx) => ({
        id: q.id || `q-ai-${Date.now()}-${idx}`,
        question: q.question,
        options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
        correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
        explanation: q.explanation || 'Verified answer based on curriculum rules.',
        topic: q.topic || topic,
      }));
    }
  } catch (err) {
    console.warn('Client-side Gemini Quiz API failed, using fallback quiz:', err);
  }

  return generateFallbackQuiz(subjectName, topic);
}
