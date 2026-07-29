export interface ChapterDef {
  chapter_number: number;
  chapter_title: string;
  key_topics: string[];
}

export interface SubjectDef {
  subject_id: string;
  subject_name: string;
  subject_type: 'Compulsory' | 'Elective';
  applicable_groups: ('Science' | 'Computer Science' | 'Arts')[];
  chapters: ChapterDef[];
  code: string;
  color: string;
  iconName: string;
}

export interface GradeCurriculum {
  grade: number;
  grade_code: 'SSC_PART_1' | 'SSC_PART_2';
  subjects: SubjectDef[];
}

export const BISE_CURRICULUM_METADATA = {
  education_board: "BISE Lahore",
  curriculum_framework: "Punjab Curriculum and Textbook Board (PCTB) / Single National Curriculum (SNC)",
  target_degrees: ["SSC Part I (Class 9)", "SSC Part II (Class 10)"],
  groups_supported: ["Science", "Computer Science", "Arts"],
  version: "2025.1",
  schema_type: "EdTech_Knowledge_Base_Dataset"
};

export const MATRIC_CURRICULUM: GradeCurriculum[] = [
  {
    grade: 9,
    grade_code: "SSC_PART_1",
    subjects: [
      {
        subject_id: "ENG-09",
        subject_name: "English (Class 9)",
        subject_type: "Compulsory",
        applicable_groups: ["Science", "Computer Science", "Arts"],
        code: "ENG",
        color: "#f43f5e",
        iconName: "BookOpen",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "The Saviour of Mankind",
            key_topics: [
              "Pre-Islamic Arabia contextual narrative",
              "Comprehension and contextual vocabulary",
              "Glossary and word meanings",
              "Grammar: Adjectives, Prepositions, Past Indefinite Tense"
            ]
          },
          {
            chapter_number: 2,
            chapter_title: "Patriotism",
            key_topics: [
              "National devotion principles",
              "Abstract Nouns and Modal Verbs",
              "Translation and comprehension analysis"
            ]
          },
          {
            chapter_number: 3,
            chapter_title: "Media and Its Impact",
            key_topics: [
              "Role of print and electronic media",
              "Noun phrases and Active/Passive voice",
              "Comprehension and formal expression"
            ]
          },
          {
            chapter_number: 4,
            chapter_title: "Hazrat Asma (R.A)",
            key_topics: [
              "Historical narrative of Hijrah",
              "Compound prepositions and abstract nouns",
              "Contextual reading and summary composition"
            ]
          },
          {
            chapter_number: 5,
            chapter_title: "Daffodils",
            key_topics: [
              "Poetic imagery and nature themes",
              "Simile, metaphor, and personification",
              "Stanza paraphrasing and central idea summary"
            ]
          },
          {
            chapter_number: 6,
            chapter_title: "Quaid's Vision and Pakistan",
            key_topics: [
              "Ideological foundation of Pakistan",
              "Direct and indirect speech conversion",
              "Character sketch and analytical essay writing"
            ]
          },
          {
            chapter_number: 7,
            chapter_title: "Allama Iqbal",
            key_topics: [
              "Iqbal's message to youth",
              "Conditional sentences and syntax",
              "Reflective composition and vocabulary expansion"
            ]
          },
          {
            chapter_number: 8,
            chapter_title: "'Hope' is the Thing with Feathers",
            key_topics: [
              "Poetic symbolism and metaphor analysis",
              "Rhyme schemes and stanza structures",
              "Central idea and poem summary"
            ]
          },
          {
            chapter_number: 9,
            chapter_title: "The Fantastic Shoemaker",
            key_topics: [
              "Short story prose evaluation",
              "Adverbial clauses and modifiers",
              "Character analysis and theme exposition"
            ]
          },
          {
            chapter_number: 10,
            chapter_title: "Technology in Everyday Life",
            key_topics: [
              "Informational reading on modern tools",
              "Technical vocabulary acquisition",
              "Expository and cause-and-effect essay composition"
            ]
          },
          {
            chapter_number: 11,
            chapter_title: "Safety First",
            key_topics: [
              "First aid emergency procedures",
              "Imperative sentence structures",
              "Procedural and instructional composition"
            ]
          },
          {
            chapter_number: 12,
            chapter_title: "The Old Woman",
            key_topics: [
              "Social empathy and age themes",
              "Poetic analysis and stanza breakdown",
              "Comprehension and moral reflection"
            ]
          },
          {
            chapter_number: 13,
            chapter_title: "Letter to the Newspaper Editor",
            key_topics: [
              "Formal editorial letter mechanics",
              "Civic advocacy and persuasive tone",
              "Argument development and structure"
            ]
          },
          {
            chapter_number: 14,
            chapter_title: "Biodiversity in Pakistan",
            key_topics: [
              "Environmental conservation issues",
              "Report writing formats",
              "Expository scientific prose analysis"
            ]
          },
          {
            chapter_number: 15,
            chapter_title: "Abou Ben Adhem",
            key_topics: [
              "Ethical poetry and altruistic themes",
              "Stanza breakdown and paraphrase",
              "Moral comprehension evaluation"
            ]
          }
        ]
      },
      {
        subject_id: "PHY-09",
        subject_name: "Physics (Class 9)",
        subject_type: "Elective",
        applicable_groups: ["Science", "Computer Science"],
        code: "PHY",
        color: "#8b5cf6",
        iconName: "Atom",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "Physical Quantities and Measurements",
            key_topics: [
              "Physical vs non-physical quantities",
              "SI base and derived units",
              "Scientific notation and prefixes",
              "Measuring instruments: Vernier Calliper, Screw Gauge, Stopwatch",
              "Precision, accuracy, and uncertainty estimation"
            ]
          },
          {
            chapter_number: 2,
            chapter_title: "Kinematics",
            key_topics: [
              "Rest, motion, and motion classifications",
              "Scalars and vectors",
              "Distance, displacement, speed, velocity, acceleration",
              "Graphical analysis of motion",
              "Derivation and application of kinematic equations"
            ]
          },
          {
            chapter_number: 3,
            chapter_title: "Dynamics",
            key_topics: [
              "Force, mass, and inertia",
              "Newton's three laws of motion",
              "Momentum and force relationships",
              "Friction and coefficient of friction",
              "Centripetal force and circular motion mechanics"
            ]
          },
          {
            chapter_number: 4,
            chapter_title: "Turning Effects of Forces",
            key_topics: [
              "Like and unlike parallel forces",
              "Torque and moment arm calculation",
              "Center of mass and center of gravity",
              "Couples and moment of couple",
              "Conditions and states of equilibrium"
            ]
          },
          {
            chapter_number: 5,
            chapter_title: "Work, Energy and Power",
            key_topics: [
              "Work definition and units",
              "Kinetic and Potential Energy formulas",
              "Interconversion of energy forms",
              "Efficiency calculation",
              "Power rating and commercial energy units"
            ]
          },
          {
            chapter_number: 6,
            chapter_title: "Mechanical Properties of Matter",
            key_topics: [
              "Density and pressure principles",
              "Atmospheric pressure measurement",
              "Archimedes Principle and flotation law",
              "Hooke's Law and Young's Modulus"
            ]
          },
          {
            chapter_number: 7,
            chapter_title: "Thermal Properties of Matter",
            key_topics: [
              "Temperature vs heat concepts",
              "Thermometer scales and calibration",
              "Specific heat capacity and heat capacity",
              "Latent heat of fusion and vaporization",
              "Thermal expansion of solids, liquids, and gases"
            ]
          },
          {
            chapter_number: 8,
            chapter_title: "Magnetism",
            key_topics: [
              "Magnetic fields and field lines",
              "Right-hand grip rule application",
              "Ferromagnetic, paramagnetic, and diamagnetic materials",
              "Temporary electromagnets vs permanent magnets"
            ]
          },
          {
            chapter_number: 9,
            chapter_title: "Nature of Science",
            key_topics: [
              "Scientific method steps",
              "Core physics branches",
              "Interdisciplinary physics fields: Biophysics, Medical Physics"
            ]
          }
        ]
      },
      {
        subject_id: "CHM-09",
        subject_name: "Chemistry (Class 9)",
        subject_type: "Elective",
        applicable_groups: ["Science", "Computer Science"],
        code: "CHM",
        color: "#06b6d4",
        iconName: "FlaskConical",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "States of Matter and Phase Changes",
            key_topics: [
              "Branches of chemistry",
              "Kinetic molecular theory of solid, liquid, gas, plasma",
              "Phase changes and latent heat curves",
              "Elements, compounds, and mixtures"
            ]
          },
          {
            chapter_number: 2,
            chapter_title: "Atomic Structure and Fundamentals",
            key_topics: [
              "Subatomic particle discovery",
              "Rutherford and Bohr atomic models",
              "Electronic configuration (s, p, d, f subshells)",
              "Isotopes and their industrial/medical uses"
            ]
          },
          {
            chapter_number: 3,
            chapter_title: "Periodic Table and Periodicity",
            key_topics: [
              "Historical evolution of periodic table",
              "Periods, groups, and block classification",
              "Periodic trends: Atomic radius, Ionization Energy, Electron Affinity, Electronegativity"
            ]
          },
          {
            chapter_number: 4,
            chapter_title: "Chemical Bonding",
            key_topics: [
              "Ionic, covalent, and coordinate covalent bonds",
              "Metallic bonding theory",
              "Intermolecular forces and hydrogen bonding"
            ]
          },
          {
            chapter_number: 5,
            chapter_title: "Physical States and Solutions",
            key_topics: [
              "Solution types and concentration units",
              "Solubility dynamics and crystallization",
              "Colloids, suspensions, and allotropic forms"
            ]
          },
          {
            chapter_number: 6,
            chapter_title: "Electrochemistry",
            key_topics: [
              "Oxidation and reduction state determination",
              "Electrolytic vs Voltaic cell mechanics",
              "Corrosion protection and electroplating methods"
            ]
          },
          {
            chapter_number: 7,
            chapter_title: "Acids, Bases, and Salts",
            key_topics: [
              "Arrhenius and Bronsted-Lowry acid-base models",
              "pH and pOH scale computations",
              "Neutralization reactions and salt preparation"
            ]
          },
          {
            chapter_number: 8,
            chapter_title: "Group Properties and Elements",
            key_topics: [
              "Properties of Group 1 (Alkali Metals)",
              "Properties of Group 17 (Halogens)",
              "Transition elements characteristics",
              "Physical/chemical contrast of metals and non-metals"
            ]
          }
        ]
      },
      {
        subject_id: "BIO-09",
        subject_name: "Biology (Class 9)",
        subject_type: "Elective",
        applicable_groups: ["Science"],
        code: "BIO",
        color: "#10b981",
        iconName: "Dna",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "Introduction to Biology",
            key_topics: [
              "Divisions and sub-fields of biology",
              "Interdisciplinary scientific relationships",
              "Levels of biological organization"
            ]
          },
          {
            chapter_number: 2,
            chapter_title: "Solving a Biological Problem",
            key_topics: [
              "Biological method and hypothesis formulation",
              "Experimental control and deduction set-up",
              "Malaria investigation case study"
            ]
          },
          {
            chapter_number: 3,
            chapter_title: "Biodiversity",
            key_topics: [
              "Five-kingdom classification framework",
              "Binomial nomenclature systems",
              "Conservation issues and endangered species in Pakistan"
            ]
          },
          {
            chapter_number: 4,
            chapter_title: "Cells and Tissues",
            key_topics: [
              "Light and electron microscopy principles",
              "Organelle structures and fluid mosaic model",
              "Plant and animal tissue classifications"
            ]
          },
          {
            chapter_number: 5,
            chapter_title: "Cell Cycle",
            key_topics: [
              "Mitosis phases and significance",
              "Meiosis stages and genetic recombination",
              "Apoptosis vs necrosis mechanics"
            ]
          },
          {
            chapter_number: 6,
            chapter_title: "Enzymes",
            key_topics: [
              "Enzyme activation energy principles",
              "Lock and Key vs Induced Fit models",
              "Temperature, pH, and substrate concentration factors"
            ]
          },
          {
            chapter_number: 7,
            chapter_title: "Bioenergetics",
            key_topics: [
              "ATP role and redox reactions in living systems",
              "Photosynthetic light and dark reaction pathways",
              "Aerobic vs anaerobic cellular respiration"
            ]
          },
          {
            chapter_number: 8,
            chapter_title: "Nutrition",
            key_topics: [
              "Human alimentary canal anatomy",
              "Macronutrient and micronutrient roles",
              "Balanced diets and mineral deficiency disorders"
            ]
          },
          {
            chapter_number: 9,
            chapter_title: "Transport",
            key_topics: [
              "Transpiration pull and sap transport in plants",
              "Human circulatory architecture and heart structure",
              "Blood components and cardiovascular pathologies"
            ]
          }
        ]
      },
      {
        subject_id: "CSC-09",
        subject_name: "Computer Science (Class 9)",
        subject_type: "Elective",
        applicable_groups: ["Computer Science"],
        code: "CSC",
        color: "#0284c7",
        iconName: "Monitor",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "Problem Solving",
            key_topics: [
              "Problem-solving stages and decomposition",
              "Flowchart symbols and logical design",
              "Algorithm design and trace table verification"
            ]
          },
          {
            chapter_number: 2,
            chapter_title: "User Interface",
            key_topics: [
              "Operating system types and responsibilities",
              "GUI vs CLI features",
              "File management and desktop utilities"
            ]
          },
          {
            chapter_number: 3,
            chapter_title: "Office Automation",
            key_topics: [
              "Word processor editing and formatting",
              "Spreadsheet structures, formulas, and functions",
              "Data visualization and chart building"
            ]
          },
          {
            chapter_number: 4,
            chapter_title: "Data Communication",
            key_topics: [
              "Sender-receiver communication models",
              "Guided vs unguided transmission media",
              "Analog vs digital signals and modem features"
            ]
          },
          {
            chapter_number: 5,
            chapter_title: "Computer Networks",
            key_topics: [
              "Network topologies: Star, Bus, Ring, Mesh",
              "LAN, MAN, and WAN architectures",
              "OSI model functional layers and IP address formats"
            ]
          }
        ]
      },
      {
        subject_id: "GMA-09",
        subject_name: "General Mathematics (Class 9)",
        subject_type: "Elective",
        applicable_groups: ["Arts"],
        code: "GMA",
        color: "#3b82f6",
        iconName: "Calculator",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "Percentage, Ratio, and Proportion",
            key_topics: [
              "Percentage conversion and practical calculations",
              "Ratio and proportion problem solving",
              "Direct and inverse variations"
            ]
          },
          {
            chapter_number: 2,
            chapter_title: "Real Numbers",
            key_topics: [
              "Rational and irrational classifications",
              "Radicals and radands properties",
              "Real line geometric representation"
            ]
          },
          {
            chapter_number: 3,
            chapter_title: "Business Mathematics",
            key_topics: [
              "Profit, loss, and trade discount calculations",
              "Partnership profit sharing models",
              "Commercial transactions"
            ]
          },
          {
            chapter_number: 4,
            chapter_title: "Financial Mathematics",
            key_topics: [
              "Zakat and Ushr rules and computations",
              "Commercial banking operations and loans",
              "Insurance policy mechanics and simple interest"
            ]
          },
          {
            chapter_number: 5,
            chapter_title: "Consumer Mathematics",
            key_topics: [
              "Utility bill breakdowns and tax calculations",
              "Personal budgeting and income tax structures",
              "Compound interest and annuity computations"
            ]
          }
        ]
      },
      {
        subject_id: "GSC-09",
        subject_name: "General Science (Class 9)",
        subject_type: "Elective",
        applicable_groups: ["Arts"],
        code: "GSC",
        color: "#f59e0b",
        iconName: "Sparkles",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "Introduction and Role of Science",
            key_topics: [
              "Historical evolution of scientific thought",
              "Islamic scientific contributions",
              "Modern branches of science and social impacts"
            ]
          },
          {
            chapter_number: 2,
            chapter_title: "Our Life and Chemistry",
            key_topics: [
              "Essential chemical elements in human bodies",
              "Physical and chemical properties of water",
              "Atmospheric gases and food chemistry"
            ]
          },
          {
            chapter_number: 3,
            chapter_title: "Biochemistry and Biotechnology",
            key_topics: [
              "Carbohydrates, proteins, and lipids structures",
              "Fermentation applications in daily life",
              "Biotechnology tools in food and medicine"
            ]
          },
          {
            chapter_number: 4,
            chapter_title: "Human Health and Diseases",
            key_topics: [
              "Infectious vs non-infectious disease vectors",
              "Human immune response mechanisms",
              "Vaccination principles and preventive hygiene"
            ]
          },
          {
            chapter_number: 5,
            chapter_title: "Environment and Natural Resources",
            key_topics: [
              "Ecosystem components and energy balances",
              "Air, water, and soil pollution management",
              "Natural resource conservation and waste recycling"
            ]
          }
        ]
      },
      {
        subject_id: "MATH-09",
        subject_name: "Mathematics Science (Class 9)",
        subject_type: "Elective",
        applicable_groups: ["Science", "Computer Science"],
        code: "MTH",
        color: "#6366f1",
        iconName: "Calculator",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "Matrices and Determinants",
            key_topics: [
              "Types of matrices: Row, Column, Rectangular, Square, Identity, Zero",
              "Addition, subtraction, and multiplication of matrices",
              "Determinant of 2x2 matrix and multiplicative inverse",
              "Solving linear equations: Matrix Inversion Method and Cramer's Rule"
            ]
          },
          {
            chapter_number: 2,
            chapter_title: "Real and Complex Numbers",
            key_topics: [
              "Real number properties and line representation",
              "Radicals and radands simplification",
              "Complex numbers i (iota) properties and conjugate",
              "Basic operations on complex numbers a + bi"
            ]
          },
          {
            chapter_number: 3,
            chapter_title: "Logarithms",
            key_topics: [
              "Scientific notation and logarithmic forms",
              "Common (Briggsian) and Natural (Naperian) logarithms",
              "Laws of Logarithms: Product, Quotient, Power, Base Change",
              "Application of logs in numerical calculations"
            ]
          },
          {
            chapter_number: 4,
            chapter_title: "Algebraic Expressions & Formulas",
            key_topics: [
              "Polynomials and rational expressions",
              "Algebraic identities: (a+b)², (a-b)², a²-b², (a+b)³, a³+b³",
              "Surds and their simplification",
              "Rationalizing denominators of surds"
            ]
          },
          {
            chapter_number: 5,
            chapter_title: "Factorization",
            key_topics: [
              "Types of factorization of polynomials",
              "Remainder Theorem and Factor Theorem",
              "Factorizing cubic polynomials using synthetic division"
            ]
          },
          {
            chapter_number: 6,
            chapter_title: "Algebraic Manipulation",
            key_topics: [
              "Highest Common Factor (HCF) by factorization & division",
              "Least Common Multiple (LCM)",
              "Basic operations on rational expressions",
              "Square root of algebraic expressions"
            ]
          },
          {
            chapter_number: 7,
            chapter_title: "Linear Equations & Inequalities",
            key_topics: [
              "Linear equations in one variable",
              "Equations involving absolute values |x|",
              "Linear inequalities and real number solutions"
            ]
          },
          {
            chapter_number: 8,
            chapter_title: "Linear Graphs & Their Application",
            key_topics: [
              "Cartesian plane and ordered pairs (x, y)",
              "Drawing linear graphs y = mx + c",
              "Graphical solution of simultaneous linear equations"
            ]
          },
          {
            chapter_number: 9,
            chapter_title: "Introduction to Coordinate Geometry",
            key_topics: [
              "Distance formula d = √((x₂-x₁)² + (y₂-y₁)²)",
              "Collinear points and triangle classifications",
              "Midpoint formula"
            ]
          },
          {
            chapter_number: 10,
            chapter_title: "Congruent Triangles",
            key_topics: [
              "Congruency postulates: SSS, SAS, ASA, RHS",
              "Geometric proofs of congruent triangles"
            ]
          }
        ]
      },
      {
        subject_id: "URD-09",
        subject_name: "Urdu (Class 9)",
        subject_type: "Compulsory",
        applicable_groups: ["Science", "Computer Science", "Arts"],
        code: "URD",
        color: "#16a34a",
        iconName: "BookOpen",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "Hijrat-e-Nabvi (S.A.W.W)",
            key_topics: [
              "Historical narrative of Holy Prophet's Migration",
              "Vocabulary and textual comprehension",
              "Summary composition and grammer analysis"
            ]
          },
          {
            chapter_number: 2,
            chapter_title: "Mirza Ghalib ke Akhlaq-o-Aadaat",
            key_topics: [
              "Biography of Ghalib by Maulana Hali",
              "Textual analysis and character sketch",
              "Word meanings and idioms"
            ]
          },
          {
            chapter_number: 3,
            chapter_title: "Kahili",
            key_topics: [
              "Essay by Sir Syed Ahmed Khan",
              "Theme of hard work and self-reliance",
              "Grammar: Ism-e-Nakra and Ism-e-Ma'rifa"
            ]
          },
          {
            chapter_number: 4,
            chapter_title: "Nazm: Hamd (Maulana Hali)",
            key_topics: [
              "Tafseer and explanation of couplets",
              "Poetic devices and central theme summary"
            ]
          },
          {
            chapter_number: 5,
            chapter_title: "Nazm: Naat (Amir Meenai)",
            key_topics: [
              "Explanation of verses",
              "Rhyme and meter in Naat"
            ]
          },
          {
            chapter_number: 6,
            chapter_title: "Ghazal (Mir Taqi Mir)",
            key_topics: [
              "Hasti Apni Habaab Ki Si Hai",
              "Ghazal terminology: Matla, Maqta, Radif, Qafiya"
            ]
          }
        ]
      },
      {
        subject_id: "ISL-09",
        subject_name: "Islamiat Lazmi (Class 9)",
        subject_type: "Compulsory",
        applicable_groups: ["Science", "Computer Science", "Arts"],
        code: "ISL",
        color: "#0d9488",
        iconName: "BookOpen",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "Quran-e-Majeed (Surah Anfal)",
            key_topics: [
              "Translation & Explanation of Verses 1-30",
              "Battle of Badr lessons and rules of spoils of war"
            ]
          },
          {
            chapter_number: 2,
            chapter_title: "Ahadeeth-e-Nabvi (S.A.W.W)",
            key_topics: [
              "Translation and practical guidance of Ahadith 1 to 10",
              "Moral duties, brotherhood, and honesty"
            ]
          },
          {
            chapter_number: 3,
            chapter_title: "Imaniyaat wa Ibadaat",
            key_topics: [
              "Tawheed, Risalat, and Belief in Hereafter",
              "Namaz, Roza, and spiritual purifications"
            ]
          },
          {
            chapter_number: 4,
            chapter_title: "Seerat-e-Tayyiba (S.A.W.W)",
            key_topics: [
              "Patience, tolerance, and justice of Holy Prophet ﷺ",
              "Treaty of Hudaibiya and Conquest of Makkah background"
            ]
          }
        ]
      },
      {
        subject_id: "TQ-09",
        subject_name: "Tarjuma-tul-Quran (Class 9)",
        subject_type: "Compulsory",
        applicable_groups: ["Science", "Computer Science", "Arts"],
        code: "TQ",
        color: "#059669",
        iconName: "BookOpen",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "Surah Maryam",
            key_topics: [
              "Translation of key passages",
              "Story of Hazrat Maryam (A.S) & Hazrat Isa (A.S)"
            ]
          },
          {
            chapter_number: 2,
            chapter_title: "Surah Taha",
            key_topics: [
              "Passage translation and commentary",
              "Story of Hazrat Musa (A.S) and Pharaoh"
            ]
          },
          {
            chapter_number: 3,
            chapter_title: "Surah Al-Anbiya",
            key_topics: [
              "Prophetic narratives and central themes",
              "Word-for-word vocabulary"
            ]
          }
        ]
      },
      {
        subject_id: "CIV-09",
        subject_name: "Civics & Citizenship (Class 9)",
        subject_type: "Elective",
        applicable_groups: ["Arts"],
        code: "CIV",
        color: "#8b5cf6",
        iconName: "Compass",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "Introduction to Civics",
            key_topics: [
              "Scope, utility, and relationship with other social sciences",
              "Civic consciousness development"
            ]
          },
          {
            chapter_number: 2,
            chapter_title: "Individual and Society",
            key_topics: [
              "Social groups, institutions, and community living",
              "Family, school, and state roles"
            ]
          },
          {
            chapter_number: 3,
            chapter_title: "State and Nation",
            key_topics: [
              "Elements of State: Population, Territory, Government, Sovereignty",
              "Distinction between State and Government"
            ]
          }
        ]
      },
      {
        subject_id: "ISE-09",
        subject_name: "Islamic Studies Elective (Class 9)",
        subject_type: "Elective",
        applicable_groups: ["Arts"],
        code: "ISE",
        color: "#d97706",
        iconName: "BookOpen",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "Quranic Sciences and History",
            key_topics: [
              "Compilation history of the Holy Quran",
              "Tafseer methodology and principles"
            ]
          },
          {
            chapter_number: 2,
            chapter_title: "Hadith Sciences",
            key_topics: [
              "Classification of Hadith: Sahih, Hasan, Da'if",
              "Sihah-e-Sitta compilers and history"
            ]
          }
        ]
      }
    ]
  },
  {
    grade: 10,
    grade_code: "SSC_PART_2",
    subjects: [
      {
        subject_id: "ENG-10",
        subject_name: "English (Class 10)",
        subject_type: "Compulsory",
        applicable_groups: ["Science", "Computer Science", "Arts"],
        code: "ENG",
        color: "#f43f5e",
        iconName: "BookOpen",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "Hazrat Muhammad ﷺ an Embodiment of Justice",
            key_topics: [
              "Textual analysis and contextual vocabulary",
              "Complex sentence composition mechanics",
              "Summary and main idea derivation"
            ]
          },
          {
            chapter_number: 2,
            chapter_title: "Chinese New Year",
            key_topics: [
              "Cultural tradition analysis",
              "Passive voice usage in formal context",
              "Expository essay composition"
            ]
          },
          {
            chapter_number: 3,
            chapter_title: "Try Again",
            key_topics: [
              "Poetic theme and message analysis",
              "Figurative language and stanza paraphrasing",
              "Poem summary"
            ]
          },
          {
            chapter_number: 4,
            chapter_title: "First Aid",
            key_topics: [
              "Emergency response procedures",
              "Imperative verb structures",
              "Procedural instruction writing"
            ]
          },
          {
            chapter_number: 5,
            chapter_title: "The Rain",
            key_topics: [
              "Poetic metaphors and imagery analysis",
              "Environmental themes",
              "Stanza breakdown and central idea"
            ]
          },
          {
            chapter_number: 6,
            chapter_title: "Television vs. Newspapers",
            key_topics: [
              "Media comparison and evaluation",
              "Argumentative essay writing",
              "Modal auxiliary verb applications"
            ]
          },
          {
            chapter_number: 7,
            chapter_title: "Little by Little One Walks Far",
            key_topics: [
              "Narrative composition analysis",
              "Personal reflection and growth themes",
              "Transition words and comprehension"
            ]
          },
          {
            chapter_number: 8,
            chapter_title: "Peace",
            key_topics: [
              "Poetic symbolism and imagery",
              "Personification evaluation",
              "Critical thinking analysis"
            ]
          },
          {
            chapter_number: 9,
            chapter_title: "Selecting the Right Career",
            key_topics: [
              "Vocational orientation prose",
              "Professional vocabulary in context",
              "Persuasive essay composition"
            ]
          },
          {
            chapter_number: 10,
            chapter_title: "A World Without Books",
            key_topics: [
              "Literary advocacy and value of reading",
              "Persuasive writing structures",
              "Critical reading comprehension"
            ]
          },
          {
            chapter_number: 11,
            chapter_title: "Great Expectations",
            key_topics: [
              "Novel overview and character evaluation",
              "Narrative sequencing",
              "Direct and indirect speech conversion"
            ]
          },
          {
            chapter_number: 12,
            chapter_title: "Population Growth and Food Supplies",
            key_topics: [
              "Socio-economic challenges prose",
              "Data interpretation in text",
              "Expository essay writing"
            ]
          },
          {
            chapter_number: 13,
            chapter_title: "Faithfulness",
            key_topics: [
              "Moral character evaluation narrative",
              "Textual analysis and comprehension",
              "Formal essay composition"
            ]
          }
        ]
      },
      {
        subject_id: "PHY-10",
        subject_name: "Physics (Class 10)",
        subject_type: "Elective",
        applicable_groups: ["Science", "Computer Science"],
        code: "PHY",
        color: "#8b5cf6",
        iconName: "Atom",
        chapters: [
          {
            chapter_number: 10,
            chapter_title: "Simple Harmonic Motion and Waves",
            key_topics: [
              "SHM in mass-spring system, ball-and-bowl, simple pendulum",
              "Damped oscillations mechanics",
              "Transverse vs longitudinal mechanical waves",
              "Wave properties: reflection, refraction, diffraction via ripple tank"
            ]
          },
          {
            chapter_number: 11,
            chapter_title: "Sound",
            key_topics: [
              "Sound wave production and propagation",
              "Loudness, pitch, quality, and intensity",
              "Sound intensity level formula and decibel scale",
              "Echo and reverberation principles",
              "Audible frequency range and ultrasound applications"
            ]
          },
          {
            chapter_number: 12,
            chapter_title: "Geometrical Optics",
            key_topics: [
              "Reflection laws and spherical mirror optics",
              "Refraction laws and Snell's Law",
              "Total internal reflection and optical fiber systems",
              "Lens formula and ray tracing",
              "Human eye structure, defects (myopia/hyperopia), and optical tools"
            ]
          },
          {
            chapter_number: 13,
            chapter_title: "Electrostatics",
            key_topics: [
              "Electric charge properties and Coulomb's Law",
              "Electric field lines and potential difference",
              "Capacitance, unit Farad, and parallel plate capacitors",
              "Combination of capacitors in series and parallel"
            ]
          },
          {
            chapter_number: 14,
            chapter_title: "Current Electricity",
            key_topics: [
              "Electric current and potential difference",
              "Ohm's Law, resistance, and resistivity factor",
              "Series and parallel resistor circuits",
              "Electrical power and Joule's Law",
              "AC vs DC, household safety (fuses, circuit breakers, grounding)"
            ]
          },
          {
            chapter_number: 15,
            chapter_title: "Electromagnetism",
            key_topics: [
              "Magnetic effect of steady current",
              "Force on a current-carrying conductor in a magnetic field",
              "Electromagnetic induction and Faraday's Law",
              "Lenz's Law and mutual induction",
              "Step-up and step-down transformer operation"
            ]
          },
          {
            chapter_number: 16,
            chapter_title: "Basic Electronics",
            key_topics: [
              "Thermionic emission and electron gun",
              "Cathode-Ray Oscilloscope (CRO) functions",
              "Analog vs digital electronics",
              "Truth tables for logic gates: AND, OR, NOT, NAND, NOR"
            ]
          },
          {
            chapter_number: 17,
            chapter_title: "Information and Communication Technology",
            key_topics: [
              "ICT framework and hardware/software components",
              "Transmission systems: telephone, radio, fiber optic",
              "Data storage devices: magnetic, optical, flash",
              "Internet, email, and cybersecurity basics"
            ]
          },
          {
            chapter_number: 18,
            chapter_title: "Atomic and Nuclear Physics",
            key_topics: [
              "Atomic structure and nuclide notation (Z and A)",
              "Natural radioactivity (alpha, beta, gamma radiation properties)",
              "Half-life calculations and radioisotope applications",
              "Nuclear fission and fusion reactions",
              "Radiation hazards and safety precautions"
            ]
          }
        ]
      },
      {
        subject_id: "CHM-10",
        subject_name: "Chemistry (Class 10)",
        subject_type: "Elective",
        applicable_groups: ["Science", "Computer Science"],
        code: "CHM",
        color: "#06b6d4",
        iconName: "FlaskConical",
        chapters: [
          {
            chapter_number: 9,
            chapter_title: "Chemical Equilibrium",
            key_topics: [
              "Reversible reactions and dynamic equilibrium state",
              "Law of Mass Action derivation",
              "Equilibrium constant (Kc) expression and units",
              "Le Chatelier's principle industrial applications"
            ]
          },
          {
            chapter_number: 10,
            chapter_title: "Acids, Bases, and Salts",
            key_topics: [
              "Auto-ionization of water and Kw constant",
              "pH and pOH logarithmic scale computations",
              "Lewis acid-base electron pair model",
              "Buffer solutions and salt preparation methods"
            ]
          },
          {
            chapter_number: 11,
            chapter_title: "Organic Chemistry",
            key_topics: [
              "Organic compound general characteristics",
              "Functional groups identification",
              "Homologous series properties",
              "Structural isomerism types"
            ]
          },
          {
            chapter_number: 12,
            chapter_title: "Hydrocarbons",
            key_topics: [
              "Alkanes synthesis and halogenation reactions",
              "Alkenes preparation and addition reactions",
              "Alkynes combustion and industrial synthesis"
            ]
          },
          {
            chapter_number: 13,
            chapter_title: "Biochemistry",
            key_topics: [
              "Carbohydrate classifications (mono-, oligo-, polysaccharides)",
              "Amino acid structures and peptide bonding in proteins",
              "Lipid and fatty acid physiological roles",
              "Nucleic acids architecture (DNA and RNA)"
            ]
          },
          {
            chapter_number: 14,
            chapter_title: "Environmental Chemistry I: Atmosphere",
            key_topics: [
              "Atmospheric layers: Troposphere, Stratosphere",
              "Greenhouse effect and global warming trends",
              "Acid rain chemical origins and ecological damage",
              "Ozone depletion mechanisms"
            ]
          },
          {
            chapter_number: 15,
            chapter_title: "Environmental Chemistry II: Water",
            key_topics: [
              "Soft vs hard water definitions and causes",
              "Temporary vs permanent hardness removal techniques",
              "Industrial effluents and heavy metal toxicity",
              "Waterborne pathogen transmission and treatment"
            ]
          },
          {
            chapter_number: 16,
            chapter_title: "Chemical Industries",
            key_topics: [
              "Metallurgical operations: Concentration, Roasting, Smelting",
              "Solvay process for soda ash production",
              "Urea manufacturing synthesis steps",
              "Petroleum refining and fractional distillation"
            ]
          }
        ]
      },
      {
        subject_id: "BIO-10",
        subject_name: "Biology (Class 10)",
        subject_type: "Elective",
        applicable_groups: ["Science"],
        code: "BIO",
        color: "#10b981",
        iconName: "Dna",
        chapters: [
          {
            chapter_number: 10,
            chapter_title: "Gaseous Exchange",
            key_topics: [
              "Plant stomatal movement mechanics",
              "Human airway passages and alveoli anatomy",
              "Breathing mechanics",
              "Respiratory diseases: Bronchitis, Emphysema, Pneumonia, Asthma, Lung Cancer"
            ]
          },
          {
            chapter_number: 11,
            chapter_title: "Homeostasis",
            key_topics: [
              "Plant osmoregulation, thermoregulation, and excretion",
              "Human skin and urinary system architecture",
              "Nephron ultrafiltration, reabsorption, and secretion",
              "Kidney failure treatments: Dialysis and transplantation"
            ]
          },
          {
            chapter_number: 12,
            chapter_title: "Coordination and Control",
            key_topics: [
              "Central and Peripheral nervous systems",
              "Neuron types and reflex arc action",
              "Endocrine glands and hormone regulation",
              "Nervous system disorders: Paralysis, Alzheimer's"
            ]
          },
          {
            chapter_number: 13,
            chapter_title: "Support and Movement",
            key_topics: [
              "Human axial and appendicular skeleton parts",
              "Bone vs cartilage structures",
              "Joint classifications and antagonist muscle mechanics",
              "Bone disorders: Osteoporosis, Arthritis"
            ]
          },
          {
            chapter_number: 14,
            chapter_title: "Reproduction",
            key_topics: [
              "Asexual reproduction methods",
              "Angiosperm plant reproduction stages",
              "Human reproductive system physiology"
            ]
          },
          {
            chapter_number: 15,
            chapter_title: "Inheritance",
            key_topics: [
              "Chromosomes, genes, and DNA replication structure",
              "Mendel's Laws of Segregation and Independent Assortment",
              "Monohybrid and dihybrid crosses",
              "Gene mutations and variation sources"
            ]
          },
          {
            chapter_number: 16,
            chapter_title: "Man and His Environment",
            key_topics: [
              "Ecosystem biotic and abiotic interactions",
              "Energy flow: Food chains and ecological pyramids",
              "Biogeochemical cycles: Carbon and Nitrogen",
              "Symbiotic relationships: Parasitism, Mutualism, Commensalism"
            ]
          },
          {
            chapter_number: 17,
            chapter_title: "Biotechnology",
            key_topics: [
              "Fermentation applications in food and medicine",
              "Genetic engineering tools and recombinant DNA",
              "Human insulin synthesis and single-cell protein"
            ]
          },
          {
            chapter_number: 18,
            chapter_title: "Pharmacology",
            key_topics: [
              "Medicinal vs addictive drug classifications",
              "Antibiotic types and bacterial resistance mechanisms",
              "Vaccine action principles and immunization"
            ]
          }
        ]
      },
      {
        subject_id: "CSC-10",
        subject_name: "Computer Science (Class 10)",
        subject_type: "Elective",
        applicable_groups: ["Computer Science"],
        code: "CSC",
        color: "#0284c7",
        iconName: "Monitor",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "Data Types and Input/Output",
            key_topics: [
              "Programming character sets, keywords, and identifiers",
              "Data types: int, float, char",
              "Header files and preprocessor directives",
              "Formatted input (scanf) and output (printf) operations"
            ]
          },
          {
            chapter_number: 2,
            chapter_title: "Control Structures",
            key_topics: [
              "Sequential control flow",
              "Conditional branching: if, if-else, else-if ladder",
              "Switch-case statements and break statements"
            ]
          },
          {
            chapter_number: 3,
            chapter_title: "Loop Control Structures",
            key_topics: [
              "For loop syntax and iteration bounds",
              "While and Do-While condition loops",
              "Nested loop logic and execution"
            ]
          },
          {
            chapter_number: 4,
            chapter_title: "Arrays and Memory",
            key_topics: [
              "Single-dimensional array allocation",
              "Array indexing, traversal, and initialization",
              "Linear searching techniques in arrays"
            ]
          },
          {
            chapter_number: 5,
            chapter_title: "Functions and Subprograms",
            key_topics: [
              "Modular programming advantages",
              "Built-in vs user-defined functions",
              "Function parameters, arguments, and return statements"
            ]
          }
        ]
      },
      {
        subject_id: "GMA-10",
        subject_name: "General Mathematics (Class 10)",
        subject_type: "Elective",
        applicable_groups: ["Arts"],
        code: "GMA",
        color: "#3b82f6",
        iconName: "Calculator",
        chapters: [
          {
            chapter_number: 6,
            chapter_title: "Algebraic Expressions and Formulas",
            key_topics: [
              "Algebraic expansion identities",
              "Polynomial operations",
              "Basic algebraic factorization methods"
            ]
          },
          {
            chapter_number: 7,
            chapter_title: "Linear Equations and Inequalities",
            key_topics: [
              "Solving single-variable linear equations",
              "Graphing linear equations",
              "Absolute value inequalities"
            ]
          },
          {
            chapter_number: 8,
            chapter_title: "Quadratic Equations",
            key_topics: [
              "Solving quadratic equations via factorization",
              "Completing the square technique",
              "Applying the quadratic formula"
            ]
          },
          {
            chapter_number: 9,
            chapter_title: "Basic Trigonometry",
            key_topics: [
              "Trigonometric ratios: sine, cosine, tangent",
              "Right-angle triangle applications",
              "Angle of elevation and depression calculations"
            ]
          },
          {
            chapter_number: 10,
            chapter_title: "Practical Geometry",
            key_topics: [
              "Triangle constructions and medians",
              "Circle geometry properties and tangents",
              "Angle and line bisector constructions"
            ]
          }
        ]
      },
      {
        subject_id: "GSC-10",
        subject_name: "General Science (Class 10)",
        subject_type: "Elective",
        applicable_groups: ["Arts"],
        code: "GSC",
        color: "#f59e0b",
        iconName: "Sparkles",
        chapters: [
          {
            chapter_number: 6,
            chapter_title: "Energy and Conservation",
            key_topics: [
              "Energy forms and work-energy relationships",
              "Law of Conservation of Energy applications",
              "Electrical power generation dynamics"
            ]
          },
          {
            chapter_number: 7,
            chapter_title: "Electricity and Magnetism",
            key_topics: [
              "Household electric circuit wiring",
              "Magnetic effects of electric currents",
              "Electromagnets and circuit safety devices"
            ]
          },
          {
            chapter_number: 8,
            chapter_title: "Basic Electronics",
            key_topics: [
              "Semiconductor basics and p-n junctions",
              "Diodes and rectification applications",
              "Transistors and modern microelectronics"
            ]
          },
          {
            chapter_number: 9,
            chapter_title: "Space and Nuclear Program",
            key_topics: [
              "Artificial satellite orbital mechanics",
              "Pakistan's space achievements (SUPARCO)",
              "Nuclear power plants and peaceful radiation applications"
            ]
          },
          {
            chapter_number: 10,
            chapter_title: "Science and Technology",
            key_topics: [
              "Industrial and surgical laser uses",
              "Fiber optic telecommunication lines",
              "Medical diagnostic tools: X-rays, MRI, CT scans, ECG, EEG"
            ]
          }
        ]
      },
      {
        subject_id: "MATH-10",
        subject_name: "Mathematics Science (Class 10)",
        subject_type: "Elective",
        applicable_groups: ["Science", "Computer Science"],
        code: "MTH",
        color: "#6366f1",
        iconName: "Calculator",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "Quadratic Equations",
            key_topics: [
              "Standard form ax² + bx + c = 0",
              "Solution methods: Factorization, Completing the Square, Quadratic Formula",
              "Equations reducible to quadratic form",
              "Reciprocal equations and exponential equations"
            ]
          },
          {
            chapter_number: 2,
            chapter_title: "Theory of Quadratic Equations",
            key_topics: [
              "Nature of roots using Discriminant b² - 4ac",
              "Cube roots of unity (1, ω, ω²) and properties",
              "Roots-coefficients relation: Sum α + β and Product αβ",
              "Symmetric functions of roots and Synthetic Division"
            ]
          },
          {
            chapter_number: 3,
            chapter_title: "Variations",
            key_topics: [
              "Ratio, proportion, and antecedents/consequents",
              "Direct variation y ∝ x and Inverse variation y ∝ 1/x",
              "Joint variation and Combined variation",
              "Theorems on proportion: Componendo-Dividendo theorem"
            ]
          },
          {
            chapter_number: 4,
            chapter_title: "Partial Fractions",
            key_topics: [
              "Proper vs Improper rational fractions",
              "Resolution into partial fractions: non-repeated linear factors",
              "Repeated linear factors and quadratic factors"
            ]
          },
          {
            chapter_number: 5,
            chapter_title: "Sets and Functions",
            key_topics: [
              "Set operations: Union, Intersection, Difference, Complement",
              "Venn Diagrams and De Morgan's Laws",
              "Binary relations and Domain / Range",
              "Function types: Into, Onto, One-One, Bijective"
            ]
          },
          {
            chapter_number: 6,
            chapter_title: "Basic Statistics",
            key_topics: [
              "Frequency distribution and tally marks",
              "Cumulative frequency and histograms",
              "Measures of Central Tendency: Arithmetic Mean, Median, Mode",
              "Measures of Dispersion: Range, Variance, Standard Deviation"
            ]
          },
          {
            chapter_number: 7,
            chapter_title: "Introduction to Trigonometry",
            key_topics: [
              "Sexagesimal system (degree, minute, second) and Radians",
              "Relation l = rθ between arc length and angle",
              "Trigonometric ratios: sin, cos, tan, csc, sec, cot",
              "Fundamental identities sin²θ + cos²θ = 1"
            ]
          },
          {
            chapter_number: 8,
            chapter_title: "Projection of a Side of a Triangle",
            key_topics: [
              "Acute angle triangle theorem proof",
              "Obtuse angle triangle theorem proof",
              "Appollonius theorem application"
            ]
          },
          {
            chapter_number: 9,
            chapter_title: "Chords of a Circle",
            key_topics: [
              "Perpendicular from center to a chord bisects the chord",
              "Equal chords are equidistant from the center"
            ]
          },
          {
            chapter_number: 10,
            chapter_title: "Practical Geometry - Circles",
            key_topics: [
              "Constructing tangents to a circle from an external point",
              "Direct and transverse common tangents to two circles",
              "Inscribed and circumscribed circles of triangles"
            ]
          }
        ]
      },
      {
        subject_id: "URD-10",
        subject_name: "Urdu (Class 10)",
        subject_type: "Compulsory",
        applicable_groups: ["Science", "Computer Science", "Arts"],
        code: "URD",
        color: "#16a34a",
        iconName: "BookOpen",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "Mirza Mohammad Saeed",
            key_topics: [
              "Biography and literary evaluation by Shahid Ahmed Dehlvi",
              "Comprehension, vocabulary, and grammar"
            ]
          },
          {
            chapter_number: 2,
            chapter_title: "Nazariya-e-Pakistan",
            key_topics: [
              "Ideology of Pakistan essay by Dr. Ghulam Mustafa Khan",
              "Historical consciousness and essay analysis"
            ]
          },
          {
            chapter_number: 3,
            chapter_title: "Parthan ki Sair",
            key_topics: [
              "Travelogue prose analysis",
              "Grammar and sentence syntax"
            ]
          },
          {
            chapter_number: 4,
            chapter_title: "Nazm: Hamd (Ehsan Danish)",
            key_topics: [
              "Couplet explanations and spiritual central idea"
            ]
          },
          {
            chapter_number: 5,
            chapter_title: "Nazm: Naat (Hafeez Jalandhari)",
            key_topics: [
              "Verses commentary and poetic imagery"
            ]
          },
          {
            chapter_number: 6,
            chapter_title: "Ghazal (Hasrat Mohani)",
            key_topics: [
              "Roshan Jamal-e-Yaar Se Hai Anjuman Tamam",
              "Poetic commentary and Ghazal structures"
            ]
          }
        ]
      },
      {
        subject_id: "PST-10",
        subject_name: "Pakistan Studies (Class 10)",
        subject_type: "Compulsory",
        applicable_groups: ["Science", "Computer Science", "Arts"],
        code: "PST",
        color: "#0284c7",
        iconName: "Globe",
        chapters: [
          {
            chapter_number: 5,
            chapter_title: "History of Pakistan II (1971 to Present)",
            key_topics: [
              "Zulfikar Ali Bhutto era reforms (1971-1977)",
              "Zia-ul-Haq era and Islamization process",
              "Democratic governments (1988-1999): Benazir Bhutto & Nawaz Sharif",
              "Pervez Musharraf era and local government system",
              "Pakistan as a Nuclear Power (28th May 1998 Yum-e-Takbeer)"
            ]
          },
          {
            chapter_number: 6,
            chapter_title: "Pakistan's Foreign Policy & World Affairs",
            key_topics: [
              "Objectives and principles of Pakistan's foreign policy",
              "Pakistan's relations with neighbors: China, India, Afghanistan, Iran",
              "Pakistan & the Muslim World (OIC role)",
              "Pakistan's role in UNO, SAARC, and ECO"
            ]
          },
          {
            chapter_number: 7,
            chapter_title: "Economic Development of Pakistan",
            key_topics: [
              "Agricultural sector importance and major crops",
              "Industrial sector and major manufacturing industries",
              "Energy resources: Hydro, Thermal, Solar, Nuclear",
              "Trade and Commerce: Major exports and imports",
              "CPEC (China-Pakistan Economic Corridor) significance"
            ]
          },
          {
            chapter_number: 8,
            chapter_title: "Population, Society, and Culture of Pakistan",
            key_topics: [
              "Population growth, distribution, and literacy rates",
              "Salient features of Pakistani society and culture",
              "Regional languages of Pakistan: Punjabi, Pashto, Sindhi, Balochi",
              "National integration and cultural harmony"
            ]
          }
        ]
      },
      {
        subject_id: "TQ-10",
        subject_name: "Tarjuma-tul-Quran (Class 10)",
        subject_type: "Compulsory",
        applicable_groups: ["Science", "Computer Science", "Arts"],
        code: "TQ",
        color: "#059669",
        iconName: "BookOpen",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "Surah Al-Ahzab",
            key_topics: [
              "Translation and commentary of key passages",
              "Battle of the Trench (Khandaq) and social etiquette"
            ]
          },
          {
            chapter_number: 2,
            chapter_title: "Surah Saba & Surah Fatir",
            key_topics: [
              "Translation of selected verses",
              "Monotheism and divine power signs"
            ]
          },
          {
            chapter_number: 3,
            chapter_title: "Surah Yaseen",
            key_topics: [
              "Heart of the Quran translation and key messages",
              "Resurrection and prophetic proof"
            ]
          }
        ]
      },
      {
        subject_id: "CIV-10",
        subject_name: "Civics & Citizenship (Class 10)",
        subject_type: "Elective",
        applicable_groups: ["Arts"],
        code: "CIV",
        color: "#8b5cf6",
        iconName: "Compass",
        chapters: [
          {
            chapter_number: 4,
            chapter_title: "Democratic System & Elections",
            key_topics: [
              "Democracy principles, electoral process, and voting rights",
              "Political parties and public opinion role"
            ]
          },
          {
            chapter_number: 5,
            chapter_title: "Local Self-Government in Pakistan",
            key_topics: [
              "Union Councils, Tehsil Councils, and District Councils structure",
              "Devolution of power plan"
            ]
          }
        ]
      },
      {
        subject_id: "ISE-10",
        subject_name: "Islamic Studies Elective (Class 10)",
        subject_type: "Elective",
        applicable_groups: ["Arts"],
        code: "ISE",
        color: "#d97706",
        iconName: "BookOpen",
        chapters: [
          {
            chapter_number: 3,
            chapter_title: "Islamic Ethics and Social Life",
            key_topics: [
              "Rights of parents, neighbors, and non-Muslims in Islam",
              "Islamic economic principles and interest-free banking"
            ]
          }
        ]
      }
    ]
  }
];

/**
 * Get all subjects flattened across Class 9 and 10
 */
export function getAllCurriculumSubjects(): SubjectDef[] {
  const list: SubjectDef[] = [];
  for (const gradeObj of MATRIC_CURRICULUM) {
    for (const sub of gradeObj.subjects) {
      if (!list.some(s => s.subject_id === sub.subject_id)) {
        list.push(sub);
      }
    }
  }
  return list;
}

/**
 * Get subjects filtered by Grade Code and Academic Group
 */
export function getSubjectsForGradeAndGroup(
  gradeCode: 'SSC_PART_1' | 'SSC_PART_2' | 'Grade 9' | 'Grade 10',
  group?: 'Science' | 'Computer Science' | 'Arts'
): SubjectDef[] {
  const normGrade: 'SSC_PART_1' | 'SSC_PART_2' = 
    (gradeCode === 'Grade 9' || gradeCode === 'SSC_PART_1') ? 'SSC_PART_1' : 'SSC_PART_2';

  const gradeData = MATRIC_CURRICULUM.find(g => g.grade_code === normGrade);
  if (!gradeData) return [];

  if (!group) return gradeData.subjects;

  return gradeData.subjects.filter(s => s.applicable_groups.includes(group));
}

/**
 * Get subject details by subject_id
 */
export function getSubjectById(subjectId: string): SubjectDef | undefined {
  return getAllCurriculumSubjects().find(s => s.subject_id === subjectId);
}
