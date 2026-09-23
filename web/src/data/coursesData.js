export const dummyCourses = [
  {
    id: 'gs-1',
    category: 'GS COURSES',
    title: 'GS Foundation Comprehensive Program 2026',
    description: 'Master General Studies Papers I, II, III & IV with structured video lectures, analytical notes, and daily answer writing guidance.',
    shortDescription: 'Complete GS Prelims & Mains foundation batch with mentorship.',
    price: '18,999',
    salePrice: '12,999',
    difficulty: 'Intermediate',
    duration: '240 hours',
    totalLessons: 85,
    level: ['Beginner', 'Intermediate'],
    thumbnail: '/courses/architecture.png',
    isNew: true,
    tags: ['GS', 'Prelims', 'Mains', 'Foundation'],
    mentorName: 'Dr. Sahil Khanna & Senior Faculty',
  },
  {
    id: 'gs-2',
    category: 'GS COURSES',
    title: 'Indian Polity, Governance & Constitution In-Depth',
    description: 'Comprehensive coverage of Indian Constitution, statutory bodies, public policy, and landmark Supreme Court verdicts for GS Paper II.',
    shortDescription: 'Master Indian Constitution, Governance & Landmark Judgments.',
    price: '9,999',
    salePrice: '5,999',
    difficulty: 'Intermediate',
    duration: '90 hours',
    totalLessons: 42,
    level: ['Intermediate'],
    thumbnail: '/courses/typography.png',
    isNew: false,
    tags: ['GS', 'Polity', 'Governance', 'GS Paper 2'],
    mentorName: 'Adv. Rajesh Verma',
  },
  {
    id: 'gs-3',
    category: 'GS COURSES',
    title: 'Modern Indian History, Art & Culture Masterclass',
    description: 'From 18th century decline of Mughals to Freedom Struggle, Post-Independence consolidation and Indian architectural heritage.',
    shortDescription: 'Complete History & Art-Culture syllabus breakdown.',
    price: '8,499',
    salePrice: '4,999',
    difficulty: 'Beginner',
    duration: '75 hours',
    totalLessons: 36,
    level: ['Beginner'],
    thumbnail: '/courses/motion.png',
    isNew: true,
    tags: ['GS', 'History', 'Culture', 'GS Paper 1'],
    mentorName: 'Prof. Ananya Sen',
  },
  {
    id: 'opt-1',
    category: 'OPTIONAL COURSES',
    title: 'Public Administration Optional - Theory & Practice',
    description: 'Complete Paper 1 (Administrative Theory) and Paper 2 (Indian Administration) syllabus coverage with previous 10 years question solutions.',
    shortDescription: 'Comprehensive Pub Ad Optional batch with 10-year PYQ analysis.',
    price: '24,999',
    salePrice: '16,499',
    difficulty: 'Advanced',
    duration: '180 hours',
    totalLessons: 68,
    level: ['Advanced'],
    thumbnail: '/courses/curator.png',
    isNew: true,
    tags: ['Optional', 'Pub Ad', 'Administration', 'Mains'],
    mentorName: 'Dr. Sahil Khanna',
  },
  {
    id: 'opt-2',
    category: 'OPTIONAL COURSES',
    title: 'Sociology Optional: Thinkers & Social Systems',
    description: 'Deep dive into classical sociological thinkers (Marx, Weber, Durkheim) and contemporary Indian social structure and transformations.',
    shortDescription: 'High-scoring Sociology Optional framework with model answers.',
    price: '22,999',
    salePrice: '15,999',
    difficulty: 'Intermediate',
    duration: '160 hours',
    totalLessons: 60,
    level: ['Intermediate', 'Advanced'],
    thumbnail: '/courses/narrative.png',
    isNew: false,
    tags: ['Optional', 'Sociology', 'Thinkers', 'Mains'],
    mentorName: 'Dr. Meera Nambiar',
  },
  {
    id: 'opt-3',
    category: 'OPTIONAL COURSES',
    title: 'Geography Optional - Physical & Human Landscapes',
    description: 'Geomorphology, Climatology, Oceanography, and Economic Geography mapped with diagrammatic answer writing techniques.',
    shortDescription: 'Diagram-oriented Geography Optional preparation program.',
    price: '23,499',
    salePrice: '15,499',
    difficulty: 'Advanced',
    duration: '175 hours',
    totalLessons: 64,
    level: ['Advanced'],
    thumbnail: '/courses/pricing.png',
    isNew: true,
    tags: ['Optional', 'Geography', 'Mapping', 'Mains'],
    mentorName: 'Prof. Vikram Chauhan',
  }
];

export const testSeriesData = [
  {
    id: 'test-1',
    title: 'GS Prelims Paper 1 All-India Mock Test 2026',
    category: 'GS Prelims Mock',
    questionsCount: 20,
    durationMinutes: 25,
    difficulty: 'Intermediate',
    rating: 4.9,
    attempts: '18.4k',
    badge: 'National Mock',
    description: 'Full-syllabus UPSC Prelims General Studies simulated examination with negative marking analytics and subject-wise breakdown.',
    questions: [
      {
        question: 'Under which Article of the Indian Constitution is the provision for the Finance Commission established?',
        options: ['Article 280', 'Article 324', 'Article 312', 'Article 356'],
        correctIndex: 0,
        explanation: 'Article 280 of the Constitution of India provides for a Finance Commission as a quasi-judicial body constituted by the President every five years.'
      },
      {
        question: 'Which of the following Indus Valley Civilization sites provides the evidence of a ploughed field?',
        options: ['Harappa', 'Kalibangan', 'Lothal', 'Mohenjo-daro'],
        correctIndex: 1,
        explanation: 'Kalibangan in Rajasthan provides evidence of a ploughed field belonging to the early Harappan phase.'
      },
      {
        question: 'The term "Western Disturbances" in Indian meteorology refers to weather systems originating from which region?',
        options: ['Bay of Bengal', 'Arabian Sea', 'Mediterranean Sea', 'Indian Ocean'],
        correctIndex: 2,
        explanation: 'Western Disturbances originate in the Mediterranean region and travel eastwards, bringing crucial winter rainfall to North-Western India.'
      },
      {
        question: 'Which Schedule of the Indian Constitution contains provisions regarding the administration and control of Scheduled Areas and Scheduled Tribes?',
        options: ['Fourth Schedule', 'Fifth Schedule', 'Sixth Schedule', 'Seventh Schedule'],
        correctIndex: 1,
        explanation: 'The Fifth Schedule deals with the administration and control of Scheduled Areas and Scheduled Tribes in states other than Assam, Meghalaya, Tripura, and Mizoram (which are covered under Sixth Schedule).'
      },
      {
        question: 'What is the primary indicator used by the Reserve Bank of India (RBI) to measure headline retail inflation?',
        options: ['Wholesale Price Index (WPI)', 'Consumer Price Index - Combined (CPI-C)', 'GDP Deflator', 'Index of Industrial Production (IIP)'],
        correctIndex: 1,
        explanation: 'The Reserve Bank of India uses the Consumer Price Index - Combined (CPI-C) as the primary anchor for inflation targeting in its monetary policy framework.'
      }
    ]
  },
  {
    id: 'test-2',
    title: 'Indian Polity & Constitutional Framework Speed Quiz',
    category: 'Subject Mock',
    questionsCount: 15,
    durationMinutes: 20,
    difficulty: 'Intermediate',
    rating: 4.8,
    attempts: '12.1k',
    badge: 'High Yield',
    description: 'Focused test covering Fundamental Rights, Directive Principles, Parliamentary Procedures, and Constitutional Amendments.',
    questions: [
      {
        question: 'Which constitutional amendment added the Fundamental Duty of parent/guardian to provide education to children aged 6-14 years?',
        options: ['42nd Amendment Act', '44th Amendment Act', '86th Amendment Act', '91st Amendment Act'],
        correctIndex: 2,
        explanation: 'The 86th Constitutional Amendment Act, 2002 inserted Article 21A, modified Article 45, and added Article 51A(k).'
      },
      {
        question: 'A money bill can be introduced in which house of the Indian Parliament?',
        options: ['Only in Lok Sabha', 'Only in Rajya Sabha', 'In either House of Parliament', 'In a joint sitting of both Houses'],
        correctIndex: 0,
        explanation: 'Under Article 109, a Money Bill can be introduced only in the Lok Sabha with the prior recommendation of the President.'
      },
      {
        question: 'Who acts as the Chairman of the Rajya Sabha?',
        options: ['Speaker of Lok Sabha', 'Prime Minister of India', 'Vice-President of India', 'Chief Justice of India'],
        correctIndex: 2,
        explanation: 'Under Article 64, the Vice-President of India is the ex-officio Chairman of the Council of States (Rajya Sabha).'
      }
    ]
  },
  {
    id: 'test-3',
    title: 'Modern Indian History & National Movement Quiz',
    category: 'History & Culture',
    questionsCount: 20,
    durationMinutes: 25,
    difficulty: 'Beginner to Medium',
    rating: 4.9,
    attempts: '14.8k',
    badge: 'PYQ Mapped',
    description: 'From the socio-religious reform movements and 1857 revolt to Gandhian phase and independence struggle.',
    questions: [
      {
        question: 'Who among the following was known as the "Grand Old Man of India"?',
        options: ['Gopal Krishna Gokhale', 'Dadabhai Naoroji', 'Bal Gangadhar Tilak', 'Surendranath Banerjee'],
        correctIndex: 1,
        explanation: 'Dadabhai Naoroji was revered as the "Grand Old Man of India" and pioneered the Drain of Wealth theory.'
      },
      {
        question: 'In which year did the Non-Cooperation Movement formally commence under Mahatma Gandhi?',
        options: ['1919', '1920', '1922', '1930'],
        correctIndex: 1,
        explanation: 'The Non-Cooperation Movement was launched in August 1920 by Mahatma Gandhi following the Jallianwala Bagh massacre and Khilafat issue.'
      },
      {
        question: 'The Ryotwari System of land revenue settlement was primarily introduced in which region of British India?',
        options: ['Bengal and Bihar', 'Madras and Bombay Presidencies', 'Punjab and North-West Provinces', 'Awadh and Rohilkhand'],
        correctIndex: 1,
        explanation: 'The Ryotwari system was formulated by Thomas Munro and Captain Read and introduced across the Madras and Bombay Presidencies.'
      }
    ]
  },
  {
    id: 'test-4',
    title: 'CSAT Paper 2: Quantitative Aptitude & Analytical Reasoning Sprint',
    category: 'CSAT Sprint',
    questionsCount: 15,
    durationMinutes: 30,
    difficulty: 'Medium to Hard',
    rating: 4.7,
    attempts: '9.6k',
    badge: 'Qualifying Booster',
    description: 'Speed-based practice on number systems, logical deductions, reading comprehension inferences, and data interpretation.',
    questions: [
      {
        question: 'If 30% of a number is added to 84, the result is the number itself. What is the number?',
        options: ['120', '140', '160', '180'],
        correctIndex: 0,
        explanation: 'Let number be x. 0.30x + 84 = x => 0.70x = 84 => x = 84 / 0.70 = 120.'
      },
      {
        question: 'A train 150 meters long is running at a speed of 54 km/h. How much time will it take to cross a standing electric pole?',
        options: ['8 seconds', '10 seconds', '12 seconds', '15 seconds'],
        correctIndex: 1,
        explanation: 'Speed = 54 * (5/18) = 15 m/s. Time = Distance / Speed = 150 / 15 = 10 seconds.'
      }
    ]
  },
  {
    id: 'test-5',
    title: 'Public Administration & Governance Case Quiz',
    category: 'Optional Mock',
    questionsCount: 15,
    durationMinutes: 20,
    difficulty: 'Advanced',
    rating: 5.0,
    attempts: '6.2k',
    badge: 'Optional Drill',
    description: 'Theoretical models of Taylor, Weber, Simon, and Riggs applied to contemporary administrative problem statements.',
    questions: [
      {
        question: 'Who introduced the "Bounded Rationality" and "Satisficing" decision-making model in administrative theory?',
        options: ['Herbert A. Simon', 'Chester Barnard', 'Max Weber', 'F.W. Taylor'],
        correctIndex: 0,
        explanation: 'Herbert Simon received the Nobel Memorial Prize for his pioneering work on bounded rationality and decision-making processes in organizations.'
      },
      {
        question: 'The "Prismatic Model" and "Sala Model" of developing societies administration was formulated by which scholar?',
        options: ['Dwight Waldo', 'Fred W. Riggs', 'Chris Argyris', 'Elton Mayo'],
        correctIndex: 1,
        explanation: 'Fred W. Riggs proposed the Ecological Approach in Public Administration including the Agraria-Industria and Prismatic-Sala models.'
      }
    ]
  },
  {
    id: 'test-6',
    title: 'Environment, Ecology & Climate Action Weekly Diagnostic',
    category: 'Current Affairs & Eco',
    questionsCount: 15,
    durationMinutes: 20,
    difficulty: 'Intermediate',
    rating: 4.9,
    attempts: '11.3k',
    badge: 'Eco Focus',
    description: 'Biodiversity hotspots, Ramsar wetlands, UNFCCC COP resolutions, wildlife corridors, and environmental jurisprudence in India.',
    questions: [
      {
        question: 'Which Indian National Park is renowned as the last remaining natural refuge of the One-Horned Rhinoceros (Rhinoceros unicornis)?',
        options: ['Jim Corbett National Park', 'Kaziranga National Park', 'Sundarbans National Park', 'Gir National Park'],
        correctIndex: 1,
        explanation: 'Kaziranga National Park in Assam holds the worlds largest population of Great Indian One-Horned Rhinoceroses and is a UNESCO World Heritage site.'
      },
      {
        question: 'Montreux Record under the Ramsar Convention is a register of wetland sites that are:',
        options: [
          'Designated as international marine reserves',
          'Facing ecological character changes due to human interference',
          'Free from all industrial pollution',
          'Situated strictly along international boundaries'
        ],
        correctIndex: 1,
        explanation: 'The Montreux Record is a register of wetland sites on the Ramsar List where changes in ecological character have occurred, are occurring, or are likely to occur as a result of technological developments, pollution or other human interference.'
      }
    ]
  }
];

export const buyBooksData = [
  {
    id: 'book-1',
    title: 'GS Foundation Compendium: Indian Polity & Governance (Vol. 1)',
    category: 'General Studies',
    author: 'OS Academy Academic Research Faculty',
    format: 'eBook (PDF) + Printable Mindmaps',
    pages: 340,
    fileSize: '16.4 MB',
    rating: 4.9,
    reviewsCount: 380,
    price: '₹499',
    originalPrice: '₹999',
    discount: '50% OFF',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    description: 'Exhaustive topic-by-topic handbook covering Constitution formulation, Fundamental Rights, Federal structure, Emergency provisions, and Supreme Court constitutional jurisprudence with diagrams.',
    highlights: [
      'Complete Article-wise breakdown from Article 1 to 395',
      '50+ High-yield visual constitutional mindmaps',
      'Previous 15 years Prelims & Mains solved questions with model frameworks',
      'Annotated landmark judgments up to 2026'
    ],
    sampleExcerpt: 'Chapter 3: The Basic Structure Doctrine — Tracing the evolutionary arc from Shankari Prasad (1951) and Golaknath (1967) to Kesavananda Bharati (1973) and Minerva Mills (1980).'
  },
  {
    id: 'book-2',
    title: 'Indian History & Architectural Heritage Handbook (Vol. 2)',
    category: 'General Studies',
    author: 'Prof. Ananya Sen & OS Academy Faculty',
    format: 'eBook (PDF) + Chronology Timelines',
    pages: 410,
    fileSize: '24.8 MB',
    rating: 5.0,
    reviewsCount: 512,
    price: '₹549',
    originalPrice: '₹1,199',
    discount: '54% OFF',
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
    description: 'Structured narrative of Ancient, Medieval, Modern Indian History, Tribal and Peasant uprisings, and classical Indian art, sculpture, and Temple architecture styles.',
    highlights: [
      'High-resolution temple architecture architectural cross-sections',
      'Chronological timelines of Governor-Generals and key policies',
      'Sub-altern perspectives on Indian national freedom struggle',
      'Bhakti & Sufi movement literature compendium'
    ],
    sampleExcerpt: 'Chapter 7: Temple Architecture Typology — Nagara, Dravida, and Vesara styles: Shikhara geometry, Mandapa arrangements, and regional Deccan idioms.'
  },
  {
    id: 'book-3',
    title: 'Public Administration Mastery: Administrative Thinkers & Indian Polity',
    category: 'Optional Subjects',
    author: 'Dr. Sahil Khanna',
    format: 'eBook (PDF) + Answer Writing Blueprints',
    pages: 380,
    fileSize: '19.2 MB',
    rating: 4.9,
    reviewsCount: 420,
    price: '₹699',
    originalPrice: '₹1,499',
    discount: '53% OFF',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
    description: 'The definitive guide for Public Administration Optional students. Synthesizes classical & modern organizational thinkers with real administrative case studies from Indian governance.',
    highlights: [
      'Comparative thinker matrix: Taylor, Fayol, Weber, Simon, Waldo',
      'New Public Management (NPM) & Digital Governance paradigms',
      'Paper 2 Indian Administration contemporary challenges analysis',
      '25 Model 20-markers answers with diagrams'
    ],
    sampleExcerpt: 'Chapter 4: Herbert Simons Decision-Making Theory — Fact-value dichotomy, cognitive limitations of administrators, and algorithmic governance applications.'
  },
  {
    id: 'book-4',
    title: 'Sociology Optional: Sociological Thinkers & Indian Social Structure',
    category: 'Optional Subjects',
    author: 'Dr. Meera Nambiar',
    format: 'eBook (PDF) + Essay Templates',
    pages: 350,
    fileSize: '17.5 MB',
    rating: 4.8,
    reviewsCount: 290,
    price: '₹649',
    originalPrice: '₹1,299',
    discount: '50% OFF',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    description: 'Comprehensive study notes on classical sociology (Marx, Durkheim, Weber, Parsons, Merton, Mead) and structural analysis of Caste, Class, Kinship, and Religion in India.',
    highlights: [
      'Core sociological concepts explained with contemporary Indian examples',
      'Perspective comparisons: Functionalist vs Conflict vs Phenomenological',
      'Social movements, agrarian transitions, and gender inequality essays',
      'Direct PYQ solutions with quote references'
    ],
    sampleExcerpt: 'Chapter 2: Emile Durkheims Division of Labour and Suicide — Mechanical vs Organic solidarity and the conceptual application of Anomie to modern urban stress.'
  },
  {
    id: 'book-5',
    title: 'Ethics, Integrity & Case Studies Workbook (GS Paper IV)',
    category: 'General Studies',
    author: 'OS Academy Ethics Board',
    format: 'eBook (PDF) + 100 Case Studies Solver',
    pages: 290,
    fileSize: '14.0 MB',
    rating: 5.0,
    reviewsCount: 630,
    price: '₹449',
    originalPrice: '₹899',
    discount: '50% OFF',
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=600&auto=format&fit=crop&q=80',
    description: 'Master moral philosophy, administrative ethics, emotional intelligence, and 100+ real-world ethical dilemma case studies with ethical framework decision matrices.',
    highlights: [
      'Deontological, Utilitarian, and Virtue Ethics simplified',
      'Nolan Committee 7 principles of public life deep dive',
      '100 Real-life administrative case study solutions step-by-step',
      'Quotations, idioms and ethical thinkers handbook'
    ],
    sampleExcerpt: 'Case Study 14: Conflict between loyalty to immediate departmental superior and statutory whistleblower duty under environmental protection laws.'
  },
  {
    id: 'book-6',
    title: 'Geography Optional: Physical Geomorphology & Climatology Atlas',
    category: 'Optional Subjects',
    author: 'Prof. Vikram Chauhan',
    format: 'eBook (PDF) + High-Res Geological Maps',
    pages: 420,
    fileSize: '29.5 MB',
    rating: 4.9,
    reviewsCount: 310,
    price: '₹699',
    originalPrice: '₹1,399',
    discount: '50% OFF',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=80',
    description: 'Full coverage of Plate Tectonics, Davis & Penck cycles of erosion, Jet streams, El Nino-Southern Oscillation, and Indian Monsoon dynamics with 200+ hand-drawn illustrations.',
    highlights: [
      '200+ Diagrammatic illustrations for GS and Optional papers',
      'Plate tectonic boundaries and seismic zone classifications',
      'Koppen and Thornthwaite climatic classification models',
      'Comprehensive regional planning & resource geography notes'
    ],
    sampleExcerpt: 'Chapter 5: Tropical Cyclogenesis — Thermodynamic criteria, Coriolis threshold, Upper tropospheric divergence, and Bay of Bengal cyclonic tracks.'
  }
];
