// Track types - Expanded for more career domains
export type Track = 
  | 'jee_pcm'           // Engineering / JEE
  | 'pcb_med'           // Medical / NEET
  | 'commerce'          // Commerce / Business
  | 'coding_it'         // Software / IT
  | 'design_creative'   // Design / Creative Arts
  | 'govt_defense'      // Government Services (General)
  | 'automotive_mech'   // Automotive / Mechanical
  | 'upsc_civil'        // UPSC / Civil Services (IAS, IPS, IFS)
  | 'defense_forces'    // Armed Forces (Army, Navy, Air Force, CDS)
  | 'aviation'          // Aviation / Aerospace / Pilots
  | 'maritime'          // Maritime / Merchant Navy / Ships
  | 'law_legal'         // Law / Legal
  | 'media_journalism'  // Media / Journalism
  | 'psychology'        // Psychology / Counseling
  | 'sports_fitness'    // Sports / Fitness / Athletics
  | 'research_academia' // Research / Academia / PhD
  | 'agriculture'       // Agriculture / Agritech
  | 'hospitality';      // Hotel Management / Hospitality

export type Meter = 'routineTolerance' | 'stressTolerance' | 'clarity';

// Education levels
export type EducationLevel = 
  | '10th_passed'       // Just completed 10th, choosing stream
  | '11th_current'      // Currently in 11th
  | '12th_current'      // Currently in 12th
  | '12th_passed'       // Completed 12th, choosing career
  | 'degree_current'    // Currently in degree
  | 'degree_completed'; // Completed degree

// Stream types
export type Stream = 
  | 'pcm'               // Physics, Chemistry, Maths
  | 'pcb'               // Physics, Chemistry, Biology
  | 'pcmb'              // All 4 subjects
  | 'commerce_maths'    // Commerce with Maths
  | 'commerce_no_maths' // Commerce without Maths
  | 'arts_humanities'   // Arts / Humanities
  | 'other'
  | 'not_applicable';   // For 10th passed

// Degree types
export type DegreeType = 
  | 'btech_engineering'
  | 'bsc_science'
  | 'bcom_commerce'
  | 'ba_arts'
  | 'mbbs_medical'
  | 'bba_management'
  | 'bca_computer'
  | 'law_llb'
  | 'bdes_design'
  | 'other'
  | 'not_applicable';

// User profile
export interface UserProfile {
  name: string;
  educationLevel: EducationLevel;
  currentStream?: Stream;
  degreeType?: DegreeType;
  degreeName?: string; // Custom degree name if "other"
}

// Score object for options
export interface OptionScore {
  jee_pcm?: number;
  pcb_med?: number;
  commerce?: number;
  coding_it?: number;
  design_creative?: number;
  govt_defense?: number;
  automotive_mech?: number;
  upsc_civil?: number;
  defense_forces?: number;
  aviation?: number;
  maritime?: number;
  law_legal?: number;
  media_journalism?: number;
  psychology?: number;
  sports_fitness?: number;
  research_academia?: number;
  agriculture?: number;
  hospitality?: number;
  routineTolerance?: number;
  stressTolerance?: number;
  clarity?: number;
}

// Question option
export interface QuestionOption {
  id: string;
  label: string;
  score: OptionScore;
}

// Question structure
export interface Question {
  id: string;
  round: string;
  type: 'single' | 'multi';
  prompt: string;
  options: QuestionOption[];
  multiSelectMax?: number;
  // Filter questions based on education level
  showFor?: EducationLevel[];
  // Filter questions based on current stream (for 11th/12th students)
  showForStreams?: Stream[];
}

// Questions JSON structure
export interface QuestionsData {
  meta: {
    title: string;
    version: string;
    multiSelectMaxDefault: number;
    parentPin: string;
  };
  tracks: Track[];
  questions: Question[];
}

// User answers
export interface UserAnswers {
  [questionId: string]: string | string[];
}

// Track scores
export interface TrackScores {
  jee_pcm: number;
  pcb_med: number;
  commerce: number;
  coding_it: number;
  design_creative: number;
  govt_defense: number;
  automotive_mech: number;
  upsc_civil: number;
  defense_forces: number;
  aviation: number;
  maritime: number;
  law_legal: number;
  media_journalism: number;
  psychology: number;
  sports_fitness: number;
  research_academia: number;
  agriculture: number;
  hospitality: number;
}

// Meter scores
export interface MeterScores {
  routineTolerance: number;
  stressTolerance: number;
  clarity: number;
}

// Risk flags
export type RiskFlag = 
  | 'Routine mismatch for JEE'
  | 'High test stress'
  | 'Low concept persistence'
  | 'Low clarity'
  | 'External motivation only'
  | 'Stream mismatch detected';

// Stream recommendation
export type StreamRecommendation = 'PCM' | 'PCB' | 'PCMB' | 'Commerce' | 'Arts/Design' | 'Humanities' | 'Not Applicable';

// JEE recommendation
export type JEERecommendation = 'GO' | 'MAYBE' | 'NO' | 'Not Applicable';

// Career path recommendation
export interface CareerPath {
  track: Track;
  name: string;
  percentage: number;
  description: string;
  careers: string[];
  exams?: string[];
  colleges?: string[];
  isRelevant: boolean; // Based on user's education level
}

// Results structure
export interface QuizResults {
  trackScores: TrackScores;
  trackPercentages: TrackScores;
  meterScores: MeterScores;
  confidence: number;
  riskFlags: RiskFlag[];
  streamRecommendation: StreamRecommendation;
  jeeRecommendation: JEERecommendation;
  topTracks: { track: Track; score: number; percentage: number }[];
  careerPaths: CareerPath[];
  nextSteps: string[];
  codingAddon: boolean;
  automotiveInterest: boolean;
  timestamp: string;
  userProfile: UserProfile;
}

// Saved state
export interface SavedState {
  currentQuestion: number;
  answers: UserAnswers;
  userProfile: UserProfile;
  startedAt: string;
  lastSavedAt: string;
}

// Track display info
export interface TrackInfo {
  name: string;
  icon: string;
  color: string;
  description: string;
  careers: string[];
  exams?: string[];
  colleges?: string[];
  // Which education levels can pursue this
  availableFor: EducationLevel[];
  // Which streams are required (for 11th/12th)
  requiredStreams?: Stream[];
}

export const TRACK_INFO: Record<Track, TrackInfo> = {
  jee_pcm: {
    name: 'Engineering / JEE',
    icon: '🔧',
    color: 'from-blue-500 to-indigo-600',
    description: 'Technical problem-solving, mathematics, and physics',
    careers: ['Engineer', 'IIT Graduate', 'Tech Lead', 'Researcher'],
    exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'State CETs'],
    colleges: ['IITs', 'NITs', 'BITS Pilani', 'IIITs'],
    availableFor: ['10th_passed', '11th_current', '12th_current', '12th_passed'],
    requiredStreams: ['pcm', 'pcmb']
  },
  pcb_med: {
    name: 'Medical / Biology',
    icon: '🩺',
    color: 'from-emerald-500 to-teal-600',
    description: 'Healthcare, life sciences, and helping people',
    careers: ['Doctor', 'Surgeon', 'Dentist', 'Pharmacist', 'Researcher'],
    exams: ['NEET UG', 'NEET PG', 'AIIMS', 'JIPMER'],
    colleges: ['AIIMS', 'CMC Vellore', 'JIPMER', 'Govt Medical Colleges'],
    availableFor: ['10th_passed', '11th_current', '12th_current', '12th_passed'],
    requiredStreams: ['pcb', 'pcmb']
  },
  commerce: {
    name: 'Commerce / Business',
    icon: '💼',
    color: 'from-amber-500 to-orange-600',
    description: 'Business, finance, and entrepreneurship',
    careers: ['CA', 'Entrepreneur', 'Investment Banker', 'CFO', 'Consultant'],
    exams: ['CA Foundation', 'CS', 'CMA', 'CAT', 'CLAT'],
    colleges: ['SRCC', 'Hindu College', 'Christ University', 'IIMs'],
    availableFor: ['10th_passed', '11th_current', '12th_current', '12th_passed', 'degree_current', 'degree_completed'],
    requiredStreams: ['commerce_maths', 'commerce_no_maths', 'pcm', 'pcmb']
  },
  coding_it: {
    name: 'Coding / IT',
    icon: '💻',
    color: 'from-violet-500 to-purple-600',
    description: 'Software development and technology',
    careers: ['Software Engineer', 'Data Scientist', 'AI/ML Engineer', 'Startup Founder'],
    exams: ['JEE (for CS)', 'GATE', 'Coding interviews'],
    colleges: ['IITs', 'IIIT Hyderabad', 'BITS', 'NITs'],
    availableFor: ['10th_passed', '11th_current', '12th_current', '12th_passed', 'degree_current', 'degree_completed']
  },
  design_creative: {
    name: 'Design / Creative',
    icon: '🎨',
    color: 'from-pink-500 to-rose-600',
    description: 'Visual arts, design, and creative expression',
    careers: ['UI/UX Designer', 'Animator', 'Fashion Designer', 'Architect', 'Content Creator'],
    exams: ['NID DAT', 'NIFT', 'UCEED', 'CEED'],
    colleges: ['NID', 'NIFT', 'Srishti', 'IDC IIT Bombay'],
    availableFor: ['10th_passed', '11th_current', '12th_current', '12th_passed', 'degree_current', 'degree_completed']
  },
  govt_defense: {
    name: 'Govt Services (General)',
    icon: '🏛️',
    color: 'from-slate-500 to-gray-700',
    description: 'Public service and government administration',
    careers: ['Bank PO', 'SSC Officer', 'Railway Officer', 'State Services'],
    exams: ['SSC CGL', 'Bank PO', 'State PSC', 'Railway'],
    availableFor: ['12th_passed', 'degree_current', 'degree_completed']
  },
  automotive_mech: {
    name: 'Automotive / Mechanical',
    icon: '🏎️',
    color: 'from-red-500 to-orange-600',
    description: 'Cars, engines, machines, and hands-on engineering',
    careers: ['Automotive Engineer', 'F1 Engineer', 'EV Specialist', 'Mechanical Designer'],
    exams: ['JEE (for Mech)', 'GATE ME'],
    colleges: ['IIT Delhi', 'IIT Bombay', 'VIT', 'Manipal', 'BITS'],
    availableFor: ['10th_passed', '11th_current', '12th_current', '12th_passed'],
    requiredStreams: ['pcm', 'pcmb']
  },
  upsc_civil: {
    name: 'UPSC / Civil Services',
    icon: '⚖️',
    color: 'from-yellow-600 to-amber-700',
    description: 'IAS, IPS, IFS - the prestigious civil services',
    careers: ['IAS Officer', 'IPS Officer', 'IFS Officer', 'IRS Officer'],
    exams: ['UPSC CSE Prelims', 'UPSC CSE Mains', 'Interview'],
    colleges: ['Any graduation', 'LAC Delhi', 'SRCC'],
    availableFor: ['degree_current', 'degree_completed', '12th_passed']
  },
  defense_forces: {
    name: 'Armed Forces',
    icon: '🪖',
    color: 'from-green-700 to-emerald-800',
    description: 'Army, Navy, Air Force - serve the nation',
    careers: ['Army Officer', 'Navy Officer', 'Air Force Officer', 'Para Commando'],
    exams: ['NDA', 'CDS', 'AFCAT', 'SSB Interview'],
    colleges: ['NDA Khadakwasla', 'IMA Dehradun', 'OTA Chennai', 'AFA Hyderabad'],
    availableFor: ['10th_passed', '11th_current', '12th_current', '12th_passed', 'degree_current', 'degree_completed']
  },
  aviation: {
    name: 'Aviation / Aerospace',
    icon: '✈️',
    color: 'from-sky-500 to-blue-600',
    description: 'Aircraft, pilots, aerospace engineering',
    careers: ['Commercial Pilot', 'Aerospace Engineer', 'ATC Officer', 'Aircraft Designer'],
    exams: ['DGCA CPL', 'JEE (Aerospace)', 'IGRUA'],
    colleges: ['IIT Bombay (Aero)', 'IIT Kanpur', 'IIST', 'Flying Schools'],
    availableFor: ['10th_passed', '11th_current', '12th_current', '12th_passed'],
    requiredStreams: ['pcm', 'pcmb']
  },
  maritime: {
    name: 'Maritime / Merchant Navy',
    icon: '🚢',
    color: 'from-cyan-600 to-teal-700',
    description: 'Ships, oceans, maritime trade',
    careers: ['Merchant Navy Officer', 'Marine Engineer', 'Ship Captain', 'Port Manager'],
    exams: ['IMU CET', 'TMISAT', 'JEE (Naval Architecture)'],
    colleges: ['IMU Chennai', 'MERI Kolkata', 'VELS', 'SCI Training'],
    availableFor: ['10th_passed', '11th_current', '12th_current', '12th_passed'],
    requiredStreams: ['pcm', 'pcmb']
  },
  law_legal: {
    name: 'Law / Legal',
    icon: '⚖️',
    color: 'from-amber-700 to-yellow-800',
    description: 'Legal profession, courts, justice system',
    careers: ['Advocate', 'Corporate Lawyer', 'Judge', 'Legal Consultant'],
    exams: ['CLAT', 'AILET', 'LSAT India', 'Judiciary Exams'],
    colleges: ['NLUs', 'NLSIU Bangalore', 'NALSAR', 'Faculty of Law DU'],
    availableFor: ['12th_passed', 'degree_current', 'degree_completed']
  },
  media_journalism: {
    name: 'Media / Journalism',
    icon: '📺',
    color: 'from-purple-600 to-pink-600',
    description: 'News, media, content creation, storytelling',
    careers: ['Journalist', 'News Anchor', 'Documentary Maker', 'PR Professional'],
    exams: ['IIMC Entrance', 'XIC Mumbai', 'ACJ Chennai'],
    colleges: ['IIMC', 'Asian College of Journalism', 'XIC Mumbai', 'Jamia'],
    availableFor: ['12th_passed', 'degree_current', 'degree_completed']
  },
  psychology: {
    name: 'Psychology / Counseling',
    icon: '🧠',
    color: 'from-teal-500 to-cyan-600',
    description: 'Understanding minds, helping people mentally',
    careers: ['Psychologist', 'Counselor', 'Therapist', 'HR Specialist'],
    exams: ['CUET', 'TISSNET', 'BHU'],
    colleges: ['TISS', 'Christ University', 'DU', 'JNU'],
    availableFor: ['12th_passed', 'degree_current', 'degree_completed']
  },
  sports_fitness: {
    name: 'Sports / Fitness',
    icon: '🏆',
    color: 'from-orange-500 to-red-600',
    description: 'Athletics, sports management, fitness training',
    careers: ['Professional Athlete', 'Sports Manager', 'Fitness Trainer', 'Sports Analyst'],
    exams: ['Sports Authority Tests', 'BPES', 'SAI'],
    colleges: ['LNIPE Gwalior', 'NSNIS Patiala', 'SAI Centers'],
    availableFor: ['10th_passed', '11th_current', '12th_current', '12th_passed', 'degree_current', 'degree_completed']
  },
  research_academia: {
    name: 'Research / Academia',
    icon: '🔬',
    color: 'from-indigo-600 to-purple-700',
    description: 'Scientific research, teaching, PhD paths',
    careers: ['Scientist', 'Professor', 'Research Fellow', 'Lab Director'],
    exams: ['CSIR NET', 'GATE', 'UGC NET', 'JEST'],
    colleges: ['IISc', 'TIFR', 'IITs', 'IISER', 'JNU'],
    availableFor: ['degree_current', 'degree_completed']
  },
  agriculture: {
    name: 'Agriculture / Agritech',
    icon: '🌾',
    color: 'from-lime-600 to-green-700',
    description: 'Farming, agricultural science, food technology',
    careers: ['Agricultural Scientist', 'Agripreneur', 'Food Technologist', 'Agronomist'],
    exams: ['ICAR AIEEA', 'State Agri Entrance', 'IARI'],
    colleges: ['IARI Delhi', 'TNAU', 'PAU', 'GBPUAT'],
    availableFor: ['10th_passed', '11th_current', '12th_current', '12th_passed'],
    requiredStreams: ['pcb', 'pcmb', 'pcm']
  },
  hospitality: {
    name: 'Hotel / Hospitality',
    icon: '🏨',
    color: 'from-rose-500 to-pink-600',
    description: 'Hotels, tourism, culinary arts',
    careers: ['Hotel Manager', 'Chef', 'Event Manager', 'Travel Consultant'],
    exams: ['NCHMCT JEE', 'IHM Entrance'],
    colleges: ['IHM Delhi', 'IHM Mumbai', 'WGSHA Manipal'],
    availableFor: ['12th_passed', 'degree_current', 'degree_completed']
  }
};

// Education level display info
export const EDUCATION_LEVELS: Record<EducationLevel, { label: string; description: string }> = {
  '10th_passed': { label: '10th Passed', description: 'Just completed 10th, choosing stream for 11th' },
  '11th_current': { label: 'In 11th Class', description: 'Currently studying in 11th standard' },
  '12th_current': { label: 'In 12th Class', description: 'Currently studying in 12th standard' },
  '12th_passed': { label: '12th Passed', description: 'Completed 12th, choosing career/college' },
  'degree_current': { label: 'In College', description: 'Currently pursuing graduation' },
  'degree_completed': { label: 'Degree Completed', description: 'Graduated, looking for career direction' }
};

// Stream display info
export const STREAM_INFO: Record<Stream, { label: string; subjects: string }> = {
  'pcm': { label: 'PCM (Science)', subjects: 'Physics, Chemistry, Maths' },
  'pcb': { label: 'PCB (Medical)', subjects: 'Physics, Chemistry, Biology' },
  'pcmb': { label: 'PCMB (All Science)', subjects: 'Physics, Chemistry, Maths, Biology' },
  'commerce_maths': { label: 'Commerce with Maths', subjects: 'Accounts, Economics, Maths' },
  'commerce_no_maths': { label: 'Commerce without Maths', subjects: 'Accounts, Economics, Business Studies' },
  'arts_humanities': { label: 'Arts / Humanities', subjects: 'History, Polity, Literature, etc.' },
  'other': { label: 'Other', subjects: 'Vocational / Other streams' },
  'not_applicable': { label: 'Not Applicable', subjects: '' }
};
