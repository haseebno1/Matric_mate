import { getAllCurriculumSubjects, SubjectDef as FullSubjectDef } from './curriculumData';

export interface SubjectDef {
  id: string;
  name: string;
  code: string;
  color: string;
  bgLight: string;
  badgeBg: string;
  textDark: string;
  iconName: string;
  defaultTopics: string[];
  chapters?: Array<{ chapter_number: number; chapter_title: string; key_topics: string[] }>;
}

/**
 * Legacy interface wrapper mapping to the official BISE Lahore curriculum dataset
 */
export const MATRIC_SUBJECTS: SubjectDef[] = getAllCurriculumSubjects().map((sub) => {
  const topics = sub.chapters.map(
    (ch) => `Ch ${ch.chapter_number}: ${ch.chapter_title}`
  );

  return {
    id: sub.subject_id,
    name: sub.subject_name,
    code: sub.code,
    color: sub.color,
    bgLight: 'bg-indigo-500/10',
    badgeBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    textDark: 'text-indigo-400',
    iconName: sub.iconName,
    defaultTopics: topics,
    chapters: sub.chapters,
  };
});

export const INITIAL_BADGES = [
  {
    id: 'b1',
    title: 'Planner Pioneer',
    description: 'Set up your BISE Lahore Matric study schedule',
    iconName: 'CalendarCheck',
    category: 'study' as const,
    progress: 1,
    maxProgress: 1,
    unlockedAt: new Date().toISOString()
  },
  {
    id: 'b2',
    title: 'Streak Starter',
    description: 'Complete study sessions 3 days in a row',
    iconName: 'Zap',
    category: 'streak' as const,
    progress: 1,
    maxProgress: 3
  },
  {
    id: 'b3',
    title: 'Quiz Master',
    description: 'Score 80%+ on any subject quiz',
    iconName: 'Trophy',
    category: 'quiz' as const,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'b4',
    title: 'Doubt Destroyer',
    description: 'Ask 5 questions in AI Study Buddy',
    iconName: 'MessageSquare',
    category: 'study' as const,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'b5',
    title: 'Confidence Climber',
    description: 'Improve a subject confidence score from 1-2 up to 4-5',
    iconName: 'TrendingUp',
    category: 'confidence' as const,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'b6',
    title: 'Revision Titan',
    description: 'Complete 20 total study sessions',
    iconName: 'Award',
    category: 'study' as const,
    progress: 0,
    maxProgress: 20
  }
];
