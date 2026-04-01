export interface SubjectSyllabus {
  subject: string;
  topics: string;
  topicList: string[]; // parsed individual topics for multi-select
}

export interface ExamSyllabus {
  exam: string;
  category: string;
  syllabus: SubjectSyllabus[];
}

export const EXAM_SYLLABUS_DATA: ExamSyllabus[]                                                                                                                                                            = [
  {
    exam: 'RRB Exams (NTPC & Group D)',
    category: 'Government',
    syllabus: [
      {
        subject: 'Mathematics',
        topics: 'Number System, Decimals, Fractions, LCM/HCF, Ratio & Proportion, Percentages, Mensuration, Time & Work, Time & Distance, Simple & Compound Interest, Algebra, Geometry, Trigonometry, Elementary Statistics.',
        topicList: ['Number System', 'Decimals', 'Fractions', 'LCM/HCF', 'Ratio & Proportion', 'Percentages', 'Mensuration', 'Time & Work', 'Time & Distance', 'Simple & Compound Interest', 'Algebra', 'Geometry', 'Trigonometry', 'Elementary Statistics']
      },
      {
        subject: 'General Intelligence & Reasoning',
        topics: 'Analogies, Coding-Decoding, Mathematical Operations, Relationships, Syllogism, Jumbling, Venn Diagrams, Data Interpretation & Sufficiency, Decision Making, Analytical Reasoning.',
        topicList: ['Analogies', 'Coding-Decoding', 'Mathematical Operations', 'Relationships', 'Syllogism', 'Jumbling', 'Venn Diagrams', 'Data Interpretation & Sufficiency', 'Decision Making', 'Analytical Reasoning']
      },
      {
        subject: 'General Awareness',
        topics: 'Current Affairs, Indian Geography, Culture and History of India, Indian Polity and Constitution, Indian Economy.',
        topicList: ['Current Affairs', 'Indian Geography', 'Culture and History of India', 'Indian Polity and Constitution', 'Indian Economy']
      },
      {
        subject: 'General Science',
        topics: 'Physics, Chemistry, and Life Sciences (strictly based on the 10th standard CBSE syllabus).',
        topicList: ['Physics (Class 10 CBSE)', 'Chemistry (Class 10 CBSE)', 'Life Sciences (Class 10 CBSE)']
      }
    ]
  },
  {
    exam: 'SSC Exams (CGL, CHSL, MTS - Tier 1)',
    category: 'Government',
    syllabus: [
      {
        subject: 'General Intelligence & Reasoning',
        topics: 'Semantic Analogy, Symbolic/Number Analogy, Figural Analogy, Number Series, Problem Solving, Word Building, Coding & Decoding, Space Visualization.',
        topicList: ['Semantic Analogy', 'Symbolic/Number Analogy', 'Figural Analogy', 'Number Series', 'Problem Solving', 'Word Building', 'Coding & Decoding', 'Space Visualization']
      },
      {
        subject: 'General Awareness',
        topics: 'Current events, India and its neighboring countries (History, Culture, Geography, Economic Scene, General Policy, Scientific Research).',
        topicList: ['Current Events', 'History of India', 'Culture of India', 'Geography of India & Neighbors', 'Economic Scene', 'General Policy', 'Scientific Research']
      },
      {
        subject: 'Quantitative Aptitude',
        topics: 'Computation of Whole Numbers, Decimals, Fractions, Percentages, Ratio & Proportion, Averages, Interest, Profit & Loss, Discount, Basic Algebraic Identities, Geometry, Mensuration, Trigonometry, Statistical Charts.',
        topicList: ['Whole Numbers, Decimals & Fractions', 'Percentages', 'Ratio & Proportion', 'Averages', 'Interest (Simple & Compound)', 'Profit & Loss', 'Discount', 'Basic Algebraic Identities', 'Geometry', 'Mensuration', 'Trigonometry', 'Statistical Charts']
      },
      {
        subject: 'English Comprehension',
        topics: 'Spot the Error, Fill in the Blanks, Synonyms/Antonyms, Spelling, Idioms & Phrases, One-word substitution, Improvement of Sentences, Active/Passive Voice, Cloze Passage, Comprehension Passage.',
        topicList: ['Spot the Error', 'Fill in the Blanks', 'Synonyms/Antonyms', 'Spelling', 'Idioms & Phrases', 'One-word Substitution', 'Improvement of Sentences', 'Active/Passive Voice', 'Cloze Passage', 'Comprehension Passage']
      }
    ]
  },
  {
    exam: 'UPSC Civil Services Examination (Prelims)',
    category: 'Government',
    syllabus: [
      {
        subject: 'Paper 1 (General Studies)',
        topics: 'Current events of national and international importance, History of India and Indian National Movement, Indian and World Geography, Indian Polity and Governance, Economic and Social Development, General issues on Environmental Ecology/Biodiversity/Climate Change, General Science.',
        topicList: ['Current Events (National & International)', 'History of India & National Movement', 'Indian Geography', 'World Geography', 'Indian Polity & Governance', 'Economic & Social Development', 'Environmental Ecology & Biodiversity', 'Climate Change', 'General Science']
      },
      {
        subject: 'Paper 2 (CSAT)',
        topics: 'Comprehension, Interpersonal skills including communication skills, Logical reasoning and analytical ability, Decision-making and problem-solving, General mental ability, Basic numeracy (Class 10 level), Data interpretation (Class 10 level).',
        topicList: ['Comprehension', 'Interpersonal & Communication Skills', 'Logical Reasoning & Analytical Ability', 'Decision-Making & Problem-Solving', 'General Mental Ability', 'Basic Numeracy (Class 10)', 'Data Interpretation (Charts, Graphs, Tables)']
      }
    ]
  },
  {
    exam: 'NEET-UG',
    category: 'Medical and Engineering Entrances',
    syllabus: [
      {
        subject: 'Physics',
        topics: 'Mechanics, Kinematics, Thermodynamics, Behavior of Perfect Gas and Kinetic Theory, Electrodynamics, Optics, Electromagnetic Waves, Dual Nature of Matter and Radiation, Atoms and Nuclei, Electronic Devices.',
        topicList: ['Mechanics', 'Kinematics', 'Thermodynamics', 'Behavior of Perfect Gas & Kinetic Theory', 'Electrodynamics', 'Optics', 'Electromagnetic Waves', 'Dual Nature of Matter & Radiation', 'Atoms and Nuclei', 'Electronic Devices']
      },
      {
        subject: 'Chemistry',
        topics: 'Physical Chemistry (Structure of Atom, Thermodynamics, Equilibrium), Inorganic Chemistry (p-Block, d-Block, f-Block elements, Coordination Compounds), Organic Chemistry (Hydrocarbons, Haloalkanes, Alcohols, Phenols, Aldehydes, Polymers, Biomolecules).',
        topicList: ['Structure of Atom', 'Thermodynamics (Physical)', 'Chemical Equilibrium', 'p-Block Elements', 'd-Block & f-Block Elements', 'Coordination Compounds', 'Hydrocarbons', 'Haloalkanes & Haloarenes', 'Alcohols & Phenols', 'Aldehydes & Ketones', 'Polymers', 'Biomolecules']
      },
      {
        subject: 'Biology',
        topics: 'Botany and Zoology. Key topics: Structural Organization in Animals and Plants, Cell Structure and Function, Plant Physiology, Human Physiology, Reproduction, Genetics and Evolution, Biology and Human Welfare, Biotechnology, Ecology and Environment.',
        topicList: ['Structural Organization in Animals & Plants', 'Cell Structure & Function', 'Plant Physiology', 'Human Physiology', 'Reproduction', 'Genetics & Evolution', 'Biology & Human Welfare', 'Biotechnology & Its Applications', 'Ecology & Environment']
      }
    ]
  },
  {
    exam: 'JEE Main',
    category: 'Medical and Engineering Entrances',
    syllabus: [
      {
        subject: 'Mathematics',
        topics: 'Sets, Relations and Functions, Complex Numbers, Matrices and Determinants, Permutations and Combinations, Binomial Theorem, Sequence and Series, Limit/Continuity/Differentiability, Integral Calculus, Differential Equations, Coordinate Geometry, 3D Geometry, Vector Algebra, Statistics and Probability, Trigonometry.',
        topicList: ['Sets, Relations & Functions', 'Complex Numbers', 'Matrices & Determinants', 'Permutations & Combinations', 'Binomial Theorem', 'Sequence & Series', 'Limits, Continuity & Differentiability', 'Integral Calculus', 'Differential Equations', 'Coordinate Geometry', '3D Geometry', 'Vector Algebra', 'Statistics & Probability', 'Trigonometry']
      },
      {
        subject: 'Physics',
        topics: 'Physics and Measurement, Kinematics, Laws of Motion, Work/Energy/Power, Rotational Motion, Gravitation, Properties of Solids & Liquids, Thermodynamics, Kinetic Theory of Gases, Oscillations & Waves, Electrostatics, Current Electricity, Magnetic Effects, Electromagnetic Induction, Optics, Modern Physics.',
        topicList: ['Physics & Measurement', 'Kinematics', 'Laws of Motion', 'Work, Energy & Power', 'Rotational Motion', 'Gravitation', 'Properties of Solids & Liquids', 'Thermodynamics', 'Kinetic Theory of Gases', 'Oscillations & Waves', 'Electrostatics', 'Current Electricity', 'Magnetic Effects of Current', 'Electromagnetic Induction & AC', 'Optics', 'Modern Physics']
      },
      {
        subject: 'Chemistry',
        topics: 'Physical Chemistry (Class 11 & 12 level), Organic Chemistry (Class 11 & 12 level), Inorganic Chemistry (Class 11 & 12 level) with heavy mathematical and numerical application focus.',
        topicList: ['Atomic Structure & Chemical Bonding', 'States of Matter', 'Thermodynamics (Chemical)', 'Chemical Equilibrium & Ionic Equilibrium', 'Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry', 's-Block & p-Block Elements', 'd & f-Block Elements', 'Coordination Chemistry', 'Hydrocarbons', 'Organic Reactions & Mechanisms', 'Biomolecules & Polymers']
      }
    ]
  },
  {
    exam: 'CUET-UG',
    category: 'University Admissions',
    syllabus: [
      {
        subject: 'Section I (Language)',
        topics: 'Reading Comprehension (factual, literary, and narrative), Literary Aptitude, Vocabulary.',
        topicList: ['Factual Reading Comprehension', 'Literary Reading Comprehension', 'Narrative Reading Comprehension', 'Literary Aptitude', 'Vocabulary']
      },
      {
        subject: 'Section II (Domain Subject)',
        topics: 'Strictly based on the Class 12 NCERT textbook for the chosen domain subject (e.g., Accountancy, History, Physics, Legal Studies).',
        topicList: ['Accountancy (Class 12 NCERT)', 'Business Studies (Class 12 NCERT)', 'Economics (Class 12 NCERT)', 'History (Class 12 NCERT)', 'Political Science (Class 12 NCERT)', 'Geography (Class 12 NCERT)', 'Physics (Class 12 NCERT)', 'Chemistry (Class 12 NCERT)', 'Biology (Class 12 NCERT)', 'Mathematics (Class 12 NCERT)', 'Legal Studies (Class 12 NCERT)']
      },
      {
        subject: 'Section III (General Test)',
        topics: 'General Knowledge, Current Affairs, General Mental Ability, Numerical Ability, Quantitative Reasoning (Grade 8 level math), Logical and Analytical Reasoning.',
        topicList: ['General Knowledge', 'Current Affairs', 'General Mental Ability', 'Numerical Ability', 'Quantitative Reasoning (Grade 8)', 'Logical Reasoning', 'Analytical Reasoning']
      }
    ]
  },
  {
    exam: 'IBPS and SBI Exams (PO/Clerk - Prelims Phase)',
    category: 'Banking and Management',
    syllabus: [
      {
        subject: 'English Language',
        topics: 'Reading Comprehension, Cloze Test, Fillers, Spotting Errors, Sentence Improvement, Fill in the Blanks, Para Jumbles, Paragraph Completion.',
        topicList: ['Reading Comprehension', 'Cloze Test', 'Fillers', 'Spotting Errors', 'Sentence Improvement', 'Fill in the Blanks', 'Para Jumbles', 'Paragraph Completion']
      },
      {
        subject: 'Quantitative Aptitude',
        topics: 'Data Interpretation (Pie charts, Bar graphs, Line graphs, Tabular), Number Series, Simplification/Approximation, Quadratic Equations, Arithmetic (Age, Probability, Time & Work, Speed & Distance, Partnership, Profit & Loss, Simple/Compound Interest).',
        topicList: ['Data Interpretation (Pie Chart)', 'Data Interpretation (Bar/Line Graph)', 'Data Interpretation (Tables)', 'Number Series', 'Simplification & Approximation', 'Quadratic Equations', 'Problems on Ages', 'Probability', 'Time & Work', 'Speed, Distance & Time', 'Partnership', 'Profit & Loss', 'Simple & Compound Interest']
      },
      {
        subject: 'Reasoning Ability',
        topics: 'Puzzles, Seating Arrangement (Circular, Linear, Square), Syllogism, Blood Relations, Coding-Decoding, Inequalities, Direction Sense, Order and Ranking, Alphanumeric Series.',
        topicList: ['Puzzles', 'Circular Seating Arrangement', 'Linear Seating Arrangement', 'Syllogism', 'Blood Relations', 'Coding-Decoding', 'Inequalities', 'Direction Sense', 'Order & Ranking', 'Alphanumeric Series']
      }
    ]
  },
  {
    exam: 'CAT (Common Admission Test)',
    category: 'Banking and Management',
    syllabus: [
      {
        subject: 'Verbal Ability and Reading Comprehension (VARC)',
        topics: 'Reading Comprehension passages (philosophy, history, science, literature, etc.), Para-jumbles, Para-summary, Odd sentence out.',
        topicList: ['Reading Comprehension (Philosophy & History)', 'Reading Comprehension (Science & Technology)', 'Reading Comprehension (Literature)', 'Para-jumbles', 'Para-summary', 'Odd Sentence Out']
      },
      {
        subject: 'Data Interpretation and Logical Reasoning (DILR)',
        topics: 'Tables, Graphs, Pie Charts, Venn Diagrams, Blood Relations, Clocks and Calendars, Syllogism, Seating Arrangement, Complex Puzzles, Games & Tournaments.',
        topicList: ['Tables & Graphs', 'Pie Charts', 'Venn Diagrams', 'Blood Relations', 'Clocks & Calendars', 'Syllogism', 'Seating Arrangement', 'Complex Puzzles', 'Games & Tournaments']
      },
      {
        subject: 'Quantitative Aptitude (QA)',
        topics: 'Arithmetic (Percentages, Profit & Loss, Ratios, Time/Speed/Distance, Time & Work), Algebra (Linear & Quadratic equations, Logarithms, Functions), Geometry (Lines, Angles, Triangles, Circles, Polygons), Mensuration, Number System, Modern Math (Permutation & Combination, Probability).',
        topicList: ['Percentages', 'Profit & Loss', 'Ratios & Mixtures', 'Time, Speed & Distance', 'Time & Work', 'Linear & Quadratic Equations', 'Logarithms & Functions', 'Geometry (Lines, Angles, Triangles)', 'Circles & Polygons', 'Mensuration', 'Number System', 'Permutation & Combination', 'Probability']
      }
    ]
  }
];

export const EXAM_CATEGORIES = [...new Set(EXAM_SYLLABUS_DATA.map(e => e.category))];
