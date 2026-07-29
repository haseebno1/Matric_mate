import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { getSubjectById, getAllCurriculumSubjects } from './src/data/curriculumData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'MatricMateAI',
      },
    },
  });
}

// ----------------------------------------------------
// 1. API Endpoint: Generate Adaptive Study Timetable
// ----------------------------------------------------
app.post('/api/schedule/generate', async (req, res) => {
  try {
    const { subjects, dailyHours = 3, startDate } = req.body;
    
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ error: 'Subjects array is required' });
    }

    const ai = getGeminiClient();

    // Map subjects to official chapters in BISE Lahore knowledge base
    const subjectsSyllabus = subjects.map((s: any) => {
      const subObj = getSubjectById(s.subjectId);
      const chaptersInfo = subObj
        ? subObj.chapters.map(ch => `Ch ${ch.chapter_number}: ${ch.chapter_title} (Topics: ${ch.key_topics.join(', ')})`).join('\n  ')
        : 'General curriculum chapters';

      return `- Subject: ${subObj?.subject_name || s.name || s.subjectId} (ID: ${s.subjectId})
  Exam Date: ${s.examDate}
  Student Confidence: ${s.confidence}/5
  Syllabus Chapters:
  ${chaptersInfo}`;
    }).join('\n\n');
    
    const prompt = `
You are MatricMate, an expert AI Study Planner for BISE Lahore (PCTB/SNC Framework) Matric students (Class 9-10).
Generate a structured, realistic, and highly optimized daily study schedule grounded strictly in the official BISE Lahore curriculum chapters provided below.

Student Profile & Enrolled Syllabus:
Target Daily Hours: ${dailyHours} hours/day
Start Date: ${startDate || new Date().toISOString().split('T')[0]}

Syllabus & Confidence Details:
${subjectsSyllabus}

Scheduling Rules:
1. Allocate more time and earlier revision dates to subjects and chapters with LOW confidence (1-2) and NEARBY exam dates.
2. For each day starting from today for the next 7 to 10 days, create 2 to 3 manageable study sessions (30 to 60 mins each).
3. Session topic names MUST reference real chapter numbers and titles from the student's syllabus (e.g., "Ch 10: Simple Harmonic Motion and Waves - Numericals").
4. Time slots should reflect typical study blocks (e.g. "16:00 - 17:00", "17:30 - 18:30", "19:00 - 20:00").

Return ONLY a valid JSON array matching this exact schema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'List of study sessions',
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              subjectId: { type: Type.STRING },
              topic: { type: Type.STRING },
              date: { type: Type.STRING, description: 'YYYY-MM-DD' },
              timeSlot: { type: Type.STRING, description: 'e.g. 16:00 - 17:00' },
              durationMinutes: { type: Type.INTEGER },
              notes: { type: Type.STRING, description: 'Key tip or focus area for this session' },
            },
            required: ['subjectId', 'topic', 'date', 'timeSlot', 'durationMinutes'],
          },
        },
      },
    });

    const text = response.text || '[]';
    const schedule = JSON.parse(text);
    
    // Add default status
    const finalizedSchedule = schedule.map((item: any, idx: number) => ({
      ...item,
      id: item.id || `session-${Date.now()}-${idx}`,
      status: 'pending',
    }));

    res.json({ schedule: finalizedSchedule });
  } catch (error: any) {
    console.error('Error generating schedule:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate schedule' });
  }
});

// ----------------------------------------------------
// 2. API Endpoint: AI Study Buddy (Chat Q&A)
// ----------------------------------------------------
app.post('/api/chat/study-buddy', async (req, res) => {
  try {
    const { question, subjectId, subjectName, topic, history = [] } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const ai = getGeminiClient();

    // Pull grounded chapter knowledge
    const subObj = subjectId ? getSubjectById(subjectId) : undefined;
    let syllabusContext = '';
    if (subObj) {
      const activeChapter = subObj.chapters.find(ch => 
        topic && (topic.includes(ch.chapter_title) || topic.includes(`Ch ${ch.chapter_number}`))
      );
      if (activeChapter) {
        syllabusContext = `Official Syllabus Context for Chapter ${activeChapter.chapter_number} (${activeChapter.chapter_title}): Key Exam Topics: ${activeChapter.key_topics.join(', ')}.`;
      } else {
        syllabusContext = `Subject Curriculum: ${subObj.subject_name}. Key Chapters: ${subObj.chapters.map(c => `Ch ${c.chapter_number}: ${c.chapter_title}`).join('; ')}.`;
      }
    }

    const systemInstruction = `
You are MatricMate's AI Study Buddy, an expert tutor for BISE Lahore (PCTB/SNC framework) Matric (Grade 9-10) students.
Subject context: ${subObj?.subject_name || subjectName || 'Matric Sciences & Math'}${topic ? ` (Topic: ${topic})` : ''}.
${syllabusContext}

Rules for your response:
1. Explain concepts strictly aligned with BISE Lahore board exam standards and PCTB textbook definitions.
2. Provide step-by-step solutions or explanations. Use bold key terms and clean formatting.
3. Highlight common exam traps, mark allocation hints (e.g. method marks for formulas and unit conversion), or step-by-step calculations.
4. End with a "💡 Quick Key Exam Takeaway" box and a 1-sentence practice question.
`;

    const contents: any[] = [];
    
    // Format past history if present
    for (const msg of history.slice(-6)) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: question }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I am sorry, I could not generate an answer right now. Please try again!';

    res.json({ reply });
  } catch (error: any) {
    console.error('Error in Study Buddy chat:', error);
    res.status(500).json({ error: error?.message || 'Failed to answer doubt' });
  }
});

// ----------------------------------------------------
// 3. API Endpoint: AI Quiz Generator
// ----------------------------------------------------
app.post('/api/quiz/generate', async (req, res) => {
  try {
    const { subjectId, subjectName, topic, numQuestions = 5 } = req.body;

    if (!subjectName || !topic) {
      return res.status(400).json({ error: 'subjectName and topic are required' });
    }

    const ai = getGeminiClient();

    // Pull grounded key topics from curriculum
    const subObj = subjectId ? getSubjectById(subjectId) : undefined;
    let groundedTopicsStr = '';
    if (subObj) {
      const activeChapter = subObj.chapters.find(ch => 
        topic.includes(ch.chapter_title) || topic.includes(`Ch ${ch.chapter_number}`)
      );
      if (activeChapter) {
        groundedTopicsStr = `Ground questions strictly in these official chapter key topics: ${activeChapter.key_topics.join(', ')}.`;
      }
    }

    const prompt = `
You are MatricMate's quiz generation engine for BISE Lahore (PCTB/SNC framework) Matric students.
Subject: ${subObj?.subject_name || subjectName}
Topic / Chapter: ${topic}
${groundedTopicsStr}

Instructions:
1. Create exactly ${numQuestions} multiple-choice questions (4 options each, 1 correct index 0-3).
2. Distribute cognitive levels according to BISE Lahore SLO taxonomy: Knowledge (40%), Understanding (40%), Application/Numericals (20%).
3. Each question must test core concepts, formulas, definitions, or calculations from this chapter.
4. Provide a clear 2-sentence explanation highlighting the correct answer and mark allocation rules.

Return ONLY a valid JSON array matching the specified schema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '4 choice options',
              },
              correctIndex: { type: Type.INTEGER, description: '0 to 3' },
              explanation: { type: Type.STRING },
              topic: { type: Type.STRING },
            },
            required: ['question', 'options', 'correctIndex', 'explanation'],
          },
        },
      },
    });

    const text = response.text || '[]';
    const questions = JSON.parse(text).map((q: any, i: number) => ({
      ...q,
      id: q.id || `q-${Date.now()}-${i}`,
      topic: topic,
    }));

    res.json({ questions });
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate quiz' });
  }
});

// ----------------------------------------------------
// 4. API Endpoint: Reschedule Missed Sessions / Weak Topics
// ----------------------------------------------------
app.post('/api/schedule/reschedule-missed', async (req, res) => {
  try {
    const { currentSchedule, missedSession, weakTopics = [], examDates = {} } = req.body;

    const ai = getGeminiClient();

    const prompt = `
You are MatricMate's adaptive scheduler for BISE Lahore Matric exams.
A student missed a study session or flagged weak topics in a diagnostic quiz.

Missed/Weak Topic: "${missedSession?.topic || weakTopics.join(', ')}" (Subject ID: ${missedSession?.subjectId || 'general'})
Current Schedule Summary:
${JSON.stringify(currentSchedule ? currentSchedule.slice(0, 15) : [])}

Exam Dates: ${JSON.stringify(examDates)}

Instructions:
1. Re-insert a new high-priority 45-minute revision session for this topic into an upcoming empty or low-load day prior to the exam date.
2. Return JSON in the format: { "rescheduledSession": { "subjectId": "...", "topic": "...", "date": "YYYY-MM-DD", "timeSlot": "17:00 - 18:00", "durationMinutes": 45, "notes": "Rescheduled revision session" } }
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rescheduledSession: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                subjectId: { type: Type.STRING },
                topic: { type: Type.STRING },
                date: { type: Type.STRING },
                timeSlot: { type: Type.STRING },
                durationMinutes: { type: Type.INTEGER },
                notes: { type: Type.STRING },
              },
              required: ['subjectId', 'topic', 'date', 'timeSlot', 'durationMinutes'],
            },
          },
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    const newSession = result.rescheduledSession || {
      id: `session-resched-${Date.now()}`,
      subjectId: missedSession?.subjectId || 'PHY-10',
      topic: missedSession?.topic || weakTopics[0] || 'Revision Topic',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      timeSlot: '17:00 - 18:00',
      durationMinutes: 45,
      notes: 'Rescheduled adaptive revision slot',
      status: 'pending',
    };

    res.json({ rescheduledSession: { ...newSession, id: `session-${Date.now()}`, status: 'pending' } });
  } catch (error: any) {
    console.error('Error rescheduling missed session:', error);
    res.status(500).json({ error: error?.message || 'Failed to reschedule session' });
  }
});

// ----------------------------------------------------
// Vite Middleware for Dev / Static serving for Production
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MatricMate Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
