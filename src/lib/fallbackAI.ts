import { StudySession, QuizQuestion } from '../types';
import { getSubjectById } from '../data/curriculumData';

/**
 * Generate fallback study schedule grounded in BISE Lahore curriculum
 */
export function generateFallbackSchedule(
  subjectsConfig: { subjectId: string; examDate: string; confidence: number }[],
  dailyHours: number = 3
): StudySession[] {
  const sessions: StudySession[] = [];
  const today = new Date();

  // Typical study time slots
  const timeSlots = [
    '15:30 - 16:30',
    '17:00 - 18:00',
    '18:30 - 19:30',
    '20:00 - 21:00',
  ];

  // Priority sort: lower confidence first
  const sortedSubjects = [...subjectsConfig].sort((a, b) => a.confidence - b.confidence);

  let sessionCount = 0;
  // Generate schedule for 10 days
  for (let dayOffset = 0; dayOffset < 10; dayOffset++) {
    const currentDay = new Date(today);
    currentDay.setDate(today.getDate() + dayOffset);
    const dateStr = currentDay.toISOString().split('T')[0];

    const numSessionsToday = Math.min(timeSlots.length, Math.max(1, Math.round(dailyHours)));

    for (let slotIdx = 0; slotIdx < numSessionsToday; slotIdx++) {
      const config = sortedSubjects[sessionCount % sortedSubjects.length];
      const subObj = getSubjectById(config.subjectId);
      
      let selectedTopic = 'Core Concept Revision & Past Papers';
      if (subObj && subObj.chapters.length > 0) {
        const chap = subObj.chapters[(dayOffset + slotIdx) % subObj.chapters.length];
        const keyTopic = chap.key_topics[(slotIdx + dayOffset) % chap.key_topics.length];
        selectedTopic = `Ch ${chap.chapter_number}: ${chap.chapter_title} - ${keyTopic}`;
      }

      sessionCount++;
      sessions.push({
        id: `s-fallback-${dateStr}-${slotIdx}`,
        subjectId: config.subjectId,
        topic: selectedTopic,
        date: dateStr,
        timeSlot: timeSlots[slotIdx % timeSlots.length],
        durationMinutes: 60,
        notes: config.confidence <= 2 
          ? `Priority focus: Review core PCTB formulas, definitions, and past paper examples.` 
          : `Regular revision session: Test understanding with quick practice questions.`,
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

Here is a simple, step-by-step breakdown to solve questions on **${topic}** for BISE Lahore board exams:

1. **Understand the Core Definition**: Focus on the fundamental PCTB rules. Always identify given values and what the question asks you to find.
2. **Apply the Standard Formula & Units**: Write down the formula clearly before substituting values. Ensure correct SI units.
3. **Double Check Exam Pitfalls**: A common mistake students make in **${subjectName}** is rushing through basic arithmetic or skipping intermediate working steps. Show all working to secure method marks!

---
💡 **Quick Key Exam Takeaway:**
*Always write out your steps clearly. In BISE Lahore exams, up to 60% of marks are awarded for correct working steps even if the final calculation has a small arithmetic error!*

**Practice Question:** Can you state one key formula or definition used in **${topic}**?`;
}

/**
 * Generate fallback multiple-choice quiz questions
 */
export function generateFallbackQuiz(subjectName: string, topic: string): QuizQuestion[] {
  return [
    {
      id: `fq-${Date.now()}-1`,
      question: `Which of the following represents the correct fundamental approach when answering exam questions on ${topic}?`,
      options: [
        'Memorize definitions without understanding working steps',
        'Identify given values, write down the formula, and show clear step-by-step working with units',
        'Skip negative signs in calculations',
        'Only practice questions right before the exam',
      ],
      correctIndex: 1,
      explanation: 'In BISE Lahore board exams, showing clear working steps and identifying formulas gains essential method marks.',
      topic: topic,
    },
    {
      id: `fq-${Date.now()}-2`,
      question: `When solving numericals or conceptual questions on ${topic} in ${subjectName}, what is a common pitfall to avoid?`,
      options: [
        'Rushing through SI unit conversions without checking working',
        'Writing down too many correct steps',
        'Reading the question carefully twice',
        'Checking your answer using substitution',
      ],
      correctIndex: 0,
      explanation: 'Rushing through unit conversions (e.g. cm to m) or arithmetic without re-checking is the #1 cause of lost marks.',
      topic: topic,
    },
    {
      id: `fq-${Date.now()}-3`,
      question: `Why is it recommended to complete past BISE Lahore exam questions for ${topic}?`,
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
      question: `What is the best active study technique to master ${topic}?`,
      options: [
        'Re-reading notes passively 5 times',
        'Teaching or explaining the concept in simple terms without looking at solutions',
        'Highlighting entire textbook pages in yellow',
        'Only studying easy questions',
      ],
      correctIndex: 1,
      explanation: 'Active recall and self-explanation are scientifically proven to be the most effective study techniques for board exams.',
      topic: topic,
    },
  ];
}
