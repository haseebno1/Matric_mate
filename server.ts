import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

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
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------
// 1. API Endpoint: Generate Adaptive Study Timetable
// ----------------------------------------------------
app.post('/api/schedule/generate', async (req, res) => {
  try {
    const { subjects, dailyHours = 3, startDate, endDate } = req.body;
    
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ error: 'Subjects array is required' });
    }

    const ai = getGeminiClient();
    
    const prompt = `
You are MatricMate, an expert Matric (Grade 9-10) AI Study Planner.
Generate a structured, realistic, and highly optimized daily study schedule.

Student Input:
- Daily Study Target: ${dailyHours} hours/day
- Start Date: ${startDate || new Date().toISOString().split('T')[0]}
- Subjects & Exam Details:
${subjects.map((s: any) => `- ${s.name} (ID: ${s.subjectId}): Exam Date: ${s.examDate}, Student Confidence: ${s.confidence}/5 (1=Needs urgent help, 5=Mastered)`).join('\n')}

Instructions:
1. Allocate more time and earlier revision dates to subjects with LOW confidence (1-2) and NEARBY exam dates.
2. For each day starting from today for the next 7 to 10 days, create 2 to 3 manageable study sessions (30 to 60 mins each).
3. Select specific topics relevant to Grade 9/10 Matric curriculum for each subject.
4. Time slots should feel like typical study blocks after school or on weekends (e.g. "16:00 - 17:00", "17:30 - 18:30", "19:00 - 20:00").
5. Include topic names that are concise and actionable.

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
    const { question, subjectName, topic, history = [] } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `
You are MatricMate's AI Study Buddy, a friendly, patient, and highly engaging tutor for Grade 9-10 Matric students.
Subject context: ${subjectName || 'General Science & Math'}${topic ? ` (Topic: ${topic})` : ''}.

Rules for your response:
1. Explain concepts in simple, jargon-free language suitable for a high school student.
2. Use real-world examples or relatable analogies.
3. Keep formatting clean with bullet points, bold key terms, and concise paragraphs.
4. Always end with a "💡 Quick Key Takeaway" box and a 1-sentence practice question to test their understanding.
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
    const { subjectName, topic, numQuestions = 5 } = req.body;

    if (!subjectName || !topic) {
      return res.status(400).json({ error: 'subjectName and topic are required' });
    }

    const ai = getGeminiClient();

    const prompt = `
Create an engaging, past-exam-style revision quiz for a Matric (Grade 9/10) student.
Subject: ${subjectName}
Topic: ${topic}
Number of Questions: ${numQuestions}

Instructions:
1. Create ${numQuestions} multiple-choice questions testing core concepts, calculations, definitions, or application skills.
2. For each question, provide 4 options (A, B, C, D).
3. Specify the index of the correct option (0 for A, 1 for B, 2 for C, 3 for D).
4. Provide a clear, encouraging 2-sentence explanation of why the correct option is right.

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
You are MatricMate's adaptive scheduler.
A student missed a study session or flagged weak topics in a quiz.

Missed/Weak Topic: "${missedSession?.topic || weakTopics.join(', ')}" (Subject ID: ${missedSession?.subjectId || 'general'})
Current Schedule Summary:
${JSON.stringify(currentSchedule ? currentSchedule.slice(0, 15) : [])}

Exam Dates: ${JSON.stringify(examDates)}

Instructions:
1. Re-insert a new high-priority 45-minute revision session for this topic into an upcoming empty or low-load day prior to the exam date.
2. Return an updated JSON list of sessions or the newly placed session details.

Return JSON in the format: { "rescheduledSession": { "subjectId": "...", "topic": "...", "date": "YYYY-MM-DD", "timeSlot": "17:00 - 18:00", "durationMinutes": 45, "notes": "Rescheduled revision session" } }
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
      subjectId: missedSession?.subjectId || 'math',
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
