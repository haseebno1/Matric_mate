export interface SubjectDef {
  id: string;
  name: string;
  code: string;
  color: string; // Tailwind color name or hex
  bgLight: string;
  badgeBg: string;
  textDark: string;
  iconName: string;
  defaultTopics: string[];
}

export const MATRIC_SUBJECTS: SubjectDef[] = [
  {
    id: 'math',
    name: 'Mathematics',
    code: 'MATH',
    color: '#3b82f6', // blue-500
    bgLight: 'bg-blue-500/10',
    badgeBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    textDark: 'text-blue-400',
    iconName: 'Calculator',
    defaultTopics: [
      'Algebra & Equations',
      'Functions & Graphs',
      'Euclidean Geometry',
      'Trigonometry & Identities',
      'Analytical Geometry',
      'Probability & Statistics',
      'Financial Mathematics',
      'Calculus & Optimization'
    ]
  },
  {
    id: 'physics',
    name: 'Physical Sciences',
    code: 'PHYS',
    color: '#8b5cf6', // purple-500
    bgLight: 'bg-purple-500/10',
    badgeBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    textDark: 'text-purple-400',
    iconName: 'Atom',
    defaultTopics: [
      'Newton’s Laws of Motion',
      'Work, Energy & Power',
      'Electric Circuits & Ohm’s Law',
      'Electromagnetism',
      'Organic Chemistry',
      'Chemical Equilibrium & Kc',
      'Acids, Bases & Titrations',
      'Rates of Reaction'
    ]
  },
  {
    id: 'life_sci',
    name: 'Life Sciences',
    code: 'LIFE',
    color: '#10b981', // emerald-500
    bgLight: 'bg-emerald-500/10',
    badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    textDark: 'text-emerald-400',
    iconName: 'Dna',
    defaultTopics: [
      'DNA: The Code of Life',
      'Meiosis & Genetic Variation',
      'Genetics & Inheritance Patterns',
      'Human Nervous System',
      'Endocrine System & Homeostasis',
      'Human Reproduction',
      'Evolution & Natural Selection',
      'Human Impact on Environment'
    ]
  },
  {
    id: 'english',
    name: 'English HL / FAL',
    code: 'ENG',
    color: '#f43f5e', // rose-500
    bgLight: 'bg-rose-500/10',
    badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    textDark: 'text-rose-400',
    iconName: 'BookOpen',
    defaultTopics: [
      'Poetry Analysis & Literary Devices',
      'Novel Study & Character Development',
      'Drama / Shakespeare Analysis',
      'Transactional Writing (Essays & Letters)',
      'Language Conventions & Editing',
      'Visual Literacy & Advertising Analysis',
      'Comprehension & Summary Writing'
    ]
  },
  {
    id: 'accounting',
    name: 'Accounting',
    code: 'ACCT',
    color: '#f59e0b', // amber-500
    bgLight: 'bg-amber-500/10',
    badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    textDark: 'text-amber-400',
    iconName: 'Receipt',
    defaultTopics: [
      'Financial Statements & Ledger Accounts',
      'Reconciliations (Bank & Debtors)',
      'Value Added Tax (VAT)',
      'Inventory Valuation Systems',
      'Corporate Governance & Ethics',
      'Cash Flow Statements',
      'Cost Accounting & Manufacturing'
    ]
  },
  {
    id: 'history',
    name: 'History',
    code: 'HIST',
    color: '#ea580c', // orange-600
    bgLight: 'bg-orange-500/10',
    badgeBg: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    textDark: 'text-orange-400',
    iconName: 'Landmark',
    defaultTopics: [
      'The Cold War & Global Tensions',
      'Independent Africa & Post-Colonial Struggles',
      'Civil Society Protests (1960s–1970s)',
      'Resistance in South Africa (1970s–1980s)',
      'The Coming of Democracy in South Africa',
      'Globalization & The Post-1989 World Order'
    ]
  },
  {
    id: 'geography',
    name: 'Geography',
    code: 'GEOG',
    color: '#06b6d4', // cyan-500
    bgLight: 'bg-cyan-500/10',
    badgeBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    textDark: 'text-cyan-400',
    iconName: 'Globe',
    defaultTopics: [
      'Climate & Weather Systems',
      'Geomorphology & Drainage Basins',
      'Rural & Urban Settlement Patterns',
      'Economic Geography of South Africa',
      'GIS & Mapwork Calculations',
      'Environmental Issues & Sustainability'
    ]
  },
  {
    id: 'business',
    name: 'Business Studies',
    code: 'BUS',
    color: '#84cc16', // lime-500
    bgLight: 'bg-lime-500/10',
    badgeBg: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
    textDark: 'text-lime-400',
    iconName: 'Briefcase',
    defaultTopics: [
      'Business Environments & PESTLE',
      'Business Roles & Creative Thinking',
      'Business Operations & Quality',
      'Human Resources Function',
      'Investment & Financial Decisions',
      'Professionalism & Ethics',
      'Conflict Management & Teamwork'
    ]
  },
  {
    id: 'cat_it',
    name: 'Computer Applications / IT',
    code: 'CAT',
    color: '#0284c7', // sky-600
    bgLight: 'bg-sky-500/10',
    badgeBg: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    textDark: 'text-sky-400',
    iconName: 'Monitor',
    defaultTopics: [
      'System Technologies & Hardware',
      'Network Technologies & Cyber Safety',
      'Advanced Spreadsheets & Formulas',
      'Database Design & Queries (SQL)',
      'Word Processing & Document Layouts',
      'HTML/CSS & Web Design Basics',
      'Problem Solving & Algorithms'
    ]
  }
];

export const INITIAL_BADGES = [
  {
    id: 'b1',
    title: 'Planner Pioneer',
    description: 'Set up your Matric study schedule',
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
