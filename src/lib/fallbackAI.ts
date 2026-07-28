import { StudySession, QuizQuestion } from '../types';
import { MATRIC_SUBJECTS } from '../data/subjectsData';

/**
 * Generate fallback study schedule when backend API is unreachable (e.g. Netlify static hosting)
 */
export function generateFallbackSchedule(
  subjectsConfig: { subjectId: string; examDate: string; confidence: number }[],
  dailyHours: number = 3
): StudySession[] {
  const sessions: StudySession[] = [];
  const today = new Date();

  // Time slots template
  const timeSlots = [
    '15:30 - 16:30',
    '17:00 - 18:00',
    '18:30 - 19:30',
    '20:00 - 21:00',
  ];

  // Sort subjects by priority: lowest confidence first
  const sortedSubjects = [...subjectsConfig].sort((a, b) => a.confidence - b.confidence);

  let sessionCount = 0;
  // Generate schedule for 10 days
  for (let dayOffset = 0; dayOffset < 10; dayOffset++) {
    const currentDay = new Date(today);
    currentDay.setDate(today.getDate() + dayOffset);
    const dateStr = currentDay.toISOString().split('T')[0];

    // Number of sessions per day based on dailyHours
    const numSessionsToday = Math.min(timeSlots.length, Math.max(1, Math.round(dailyHours)));

    for (let slotIdx = 0; slotIdx < numSessionsToday; slotIdx++) {
      // Pick subject in round-robin fashion, prioritizing lower confidence
      const config = sortedSubjects[sessionCount % sortedSubjects.length];
      const subDef = MATRIC_SUBJECTS.find((m) => m.id === config.subjectId);
      const topics = subDef?.defaultTopics || ['Core Practice', 'Exam Review'];
      const selectedTopic = topics[(dayOffset + slotIdx) % topics.length];

      sessionCount++;
      sessions.push({
        id: `s-fallback-${dateStr}-${slotIdx}`,
        subjectId: config.subjectId,
        topic: selectedTopic,
        date: dateStr,
        timeSlot: timeSlots[slotIdx % timeSlots.length],
        durationMinutes: 60,
        notes: config.confidence <= 2 
          ? `Priority focus: Review core formulas and past paper examples.` 
          : `Regular revision session: Test understanding with quick practice.`,
        status: 'pending',
      });
    }
  }

  return sessions;
}

/**
 * Generate fallback Q&A answer for Study Buddy
 */
export function generateFallbackBuddyReply(question: string, subjectName: string, topic: string): string {
  return `### **Understanding ${topic} in ${subjectName}**

Here is a simple, step-by-step breakdown to solve questions on **${topic}**:

1. **Understand the Core Definition**: Focus on the fundamental rules. Always identify the given values and what the question asks you to find.
2. **Apply the Standard Formula**: Write down the formula clearly before substituting values. Keep track of negative signs and units.
3. **Double Check Exam Pitfalls**: A common mistake students make in **${subjectName}** is rushing through basic arithmetic or skipping intermediate working steps. Show all working to secure method marks!

---
💡 **Quick Key Takeaway:**
*Always write out your steps clearly. In Matric exams, up to 60% of marks are awarded for correct working steps even if the final calculation has a small arithmetic error!*

**Practice Question:** Can you state one key formula or definition used in **${topic}**?`;
}

/**
 * Generate fallback multiple-choice quiz questions
 */
export function generateFallbackQuiz(subjectName: string, topic: string): QuizQuestion[] {
  return [
    {
      id: `fq-${Date.now()}-1`,
      question: `Which of the following represents the correct fundamental approach when studying ${topic}?`,
      options: [
        'Memorize definitions without understanding steps',
        'Identify given values, write down the formula, and show clear step-by-step working',
        'Skip negative signs in calculations',
        'Only practice questions right before the exam',
      ],
      correctIndex: 1,
      explanation: 'In Matric exams, showing clear working steps and identifying formulas gains essential method marks.',
      topic: topic,
    },
    {
      id: `fq-${Date.now()}-2`,
      question: `When answering exam questions on ${topic} in ${subjectName}, what is a common pitfall to avoid?`,
      options: [
        'Rushing through algebra/units without checking working',
        'Writing down too many correct steps',
        'Reading the question carefully twice',
        'Checking your answer using substitution',
      ],
      correctIndex: 0,
      explanation: 'Rushing through unit conversions or arithmetic without re-checking is the #1 cause of lost marks.',
      topic: topic,
    },
    {
      id: `fq-${Date.now()}-3`,
      question: `Why is it recommended to complete past exam questions for ${topic}?`,
      options: [
        'Past exam questions are never repeated',
        'It helps familiarize you with mark allocation, question phrasing, and exam pacing',
        'It is only useful for Grade 12 students',
        'It replaces the need for understanding core concepts',
      ],
      correctIndex: 1,
      explanation: 'Practicing past papers trains you on exact exam formatting, time management, and typical question patterns.',
      topic: topic,
    },
    {
      id: `fq-${Date.now()}-4`,
      question: `How should you handle a high-mark problem on ${topic} that you get stuck on during an exam?`,
      options: [
        'Spend 30 minutes on it immediately',
        'Write down known formulas/given values for partial credit, skip, and revisit at the end',
        'Leave the page completely blank',
        'Guess without showing any steps',
      ],
      correctIndex: 1,
      explanation: 'Writing down relevant formulas and steps earns partial working marks before moving forward.',
      topic: topic,
    },
    {
      id: `fq-${Date.now()}-5`,
      question: `What is the best technique to test your mastery of ${topic}?`,
      options: [
        'Re-reading notes passively 5 times',
        'Teaching or explaining the concept in simple terms without looking at solutions',
        'Highlighting entire textbook pages in yellow',
        'Only studying easy questions',
      ],
      correctIndex: 1,
      explanation: 'Active recall and self-explanation are scientifically proven to be the most effective study techniques.',
      topic: topic,
    },
  ];
}
