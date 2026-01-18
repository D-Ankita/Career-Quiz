import {
  Track,
  TrackScores,
  MeterScores,
  RiskFlag,
  StreamRecommendation,
  JEERecommendation,
  QuizResults,
  UserAnswers,
  Question,
  UserProfile,
  CareerPath,
  TRACK_INFO,
  EducationLevel,
  Stream,
} from '@/app/types';

// All tracks
const ALL_TRACKS: Track[] = [
  'jee_pcm', 'pcb_med', 'commerce', 'coding_it', 'design_creative', 
  'govt_defense', 'automotive_mech', 'upsc_civil', 'defense_forces',
  'aviation', 'maritime', 'law_legal', 'media_journalism', 'psychology',
  'sports_fitness', 'research_academia', 'agriculture', 'hospitality'
];

// Initialize empty track scores
export function initTrackScores(): TrackScores {
  return {
    jee_pcm: 0,
    pcb_med: 0,
    commerce: 0,
    coding_it: 0,
    design_creative: 0,
    govt_defense: 0,
    automotive_mech: 0,
    upsc_civil: 0,
    defense_forces: 0,
    aviation: 0,
    maritime: 0,
    law_legal: 0,
    media_journalism: 0,
    psychology: 0,
    sports_fitness: 0,
    research_academia: 0,
    agriculture: 0,
    hospitality: 0,
  };
}

// Initialize empty meter scores
export function initMeterScores(): MeterScores {
  return {
    routineTolerance: 5, // Start at neutral
    stressTolerance: 5,
    clarity: 5,
  };
}

// Filter questions based on user profile
export function filterQuestions(questions: Question[], profile: UserProfile): Question[] {
  return questions.filter(q => {
    // Check education level filter
    if (q.showFor && !q.showFor.includes(profile.educationLevel)) {
      return false;
    }
    
    // Check stream filter (for 11th/12th students)
    if (q.showForStreams && profile.currentStream && profile.currentStream !== 'not_applicable') {
      if (!q.showForStreams.includes(profile.currentStream)) {
        return false;
      }
    }
    
    return true;
  });
}

// Calculate raw scores from answers
export function calculateRawScores(
  answers: UserAnswers,
  questions: Question[]
): { trackScores: TrackScores; meterScores: MeterScores; maybeCount: number; strongNegativeCount: number } {
  const trackScores = initTrackScores();
  const meterScores = initMeterScores();
  let maybeCount = 0;
  let strongNegativeCount = 0;

  for (const question of questions) {
    const answer = answers[question.id];
    if (!answer) continue;

    const selectedOptionIds = Array.isArray(answer) ? answer : [answer];

    for (const optionId of selectedOptionIds) {
      const option = question.options.find(o => o.id === optionId);
      if (!option) continue;

      const score = option.score;

      // Add track scores
      for (const track of ALL_TRACKS) {
        if (score[track]) {
          trackScores[track] += score[track];
        }
      }

      // Add meter scores
      if (score.routineTolerance) {
        meterScores.routineTolerance += score.routineTolerance;
      }
      if (score.stressTolerance) {
        meterScores.stressTolerance += score.stressTolerance;
      }
      if (score.clarity) {
        meterScores.clarity += score.clarity;
      }

      // Count maybes and strong negatives for confidence
      if (option.label.toLowerCase().includes('maybe') || option.label.includes('🤔')) {
        maybeCount++;
      }
      if (option.label.toLowerCase().includes('no') && option.label.includes('❌')) {
        strongNegativeCount++;
      }
      if (option.label.toLowerCase().includes('quit') || option.label.includes('🚪')) {
        strongNegativeCount++;
      }
    }
  }

  // Clamp meter scores to 0-10
  meterScores.routineTolerance = Math.max(0, Math.min(10, meterScores.routineTolerance));
  meterScores.stressTolerance = Math.max(0, Math.min(10, meterScores.stressTolerance));
  meterScores.clarity = Math.max(0, Math.min(10, meterScores.clarity));

  return { trackScores, meterScores, maybeCount, strongNegativeCount };
}

// Calculate percentages for tracks
export function calculatePercentages(trackScores: TrackScores): TrackScores {
  const maxPossible: TrackScores = {
    jee_pcm: 60,
    pcb_med: 30,
    commerce: 45,
    coding_it: 45,
    design_creative: 55,
    govt_defense: 20,
    automotive_mech: 50,
    upsc_civil: 25,
    defense_forces: 30,
    aviation: 25,
    maritime: 20,
    law_legal: 20,
    media_journalism: 20,
    psychology: 20,
    sports_fitness: 20,
    research_academia: 20,
    agriculture: 20,
    hospitality: 15,
  };

  const percentages = initTrackScores();
  
  for (const track of ALL_TRACKS) {
    const percentage = Math.round((trackScores[track] / maxPossible[track]) * 100);
    percentages[track] = Math.max(0, Math.min(100, percentage));
  }

  return percentages;
}

// Calculate confidence score
export function calculateConfidence(maybeCount: number, strongNegativeCount: number): number {
  const confidence = 10 - (maybeCount * 1) - (strongNegativeCount * 2);
  return Math.max(0, Math.min(10, confidence));
}

// Check if a track is relevant for user's education level and stream
export function isTrackRelevant(
  track: Track, 
  profile: UserProfile
): boolean {
  const trackInfo = TRACK_INFO[track];
  
  // Check if available for education level
  if (!trackInfo.availableFor.includes(profile.educationLevel)) {
    return false;
  }
  
  // Check if stream matches (for 11th/12th students)
  if (trackInfo.requiredStreams && profile.currentStream && profile.currentStream !== 'not_applicable') {
    if (!trackInfo.requiredStreams.includes(profile.currentStream)) {
      return false;
    }
  }
  
  return true;
}

// Determine risk flags
export function determineRiskFlags(
  trackScores: TrackScores,
  meterScores: MeterScores,
  answers: UserAnswers,
  profile: UserProfile
): RiskFlag[] {
  const flags: RiskFlag[] = [];

  // Routine mismatch for JEE
  if (trackScores.jee_pcm > 15 && meterScores.routineTolerance < 4) {
    flags.push('Routine mismatch for JEE');
  }

  // High test stress
  if (meterScores.stressTolerance < 3) {
    flags.push('High test stress');
  }

  // Low concept persistence (Q10 answered with "quit")
  const q10Answer = answers['q10'];
  if (q10Answer === 'c') {
    flags.push('Low concept persistence');
  }

  // Low clarity
  if (meterScores.clarity < 4) {
    flags.push('Low clarity');
  }

  // External motivation only (Q23 answered "because everyone says so")
  const q23Answer = answers['q23'];
  if (q23Answer === 'c') {
    flags.push('External motivation only');
  }

  return flags;
}

// Determine stream recommendation (only for 10th passed)
export function determineStreamRecommendation(
  trackScores: TrackScores,
  profile: UserProfile
): StreamRecommendation {
  // Only recommend stream for 10th passed students
  if (profile.educationLevel !== '10th_passed') {
    return 'Not Applicable';
  }

  const tracks: { track: Track; score: number }[] = [
    { track: 'jee_pcm', score: trackScores.jee_pcm + trackScores.automotive_mech + trackScores.aviation },
    { track: 'pcb_med', score: trackScores.pcb_med + trackScores.agriculture },
    { track: 'commerce', score: trackScores.commerce + trackScores.hospitality },
    { track: 'design_creative', score: trackScores.design_creative + trackScores.media_journalism },
  ];

  tracks.sort((a, b) => b.score - a.score);
  const topTrack = tracks[0].track;

  // Check for PCMB (both science interests strong)
  if (trackScores.jee_pcm > 15 && trackScores.pcb_med > 15) {
    return 'PCMB';
  }

  if (topTrack === 'pcb_med') {
    return 'PCB';
  } else if (topTrack === 'jee_pcm') {
    return 'PCM';
  } else if (topTrack === 'commerce') {
    return 'Commerce';
  } else if (topTrack === 'design_creative') {
    return 'Arts/Design';
  }

  return 'PCM';
}

// Determine JEE recommendation
export function determineJEERecommendation(
  trackScores: TrackScores,
  meterScores: MeterScores,
  answers: UserAnswers,
  riskFlags: RiskFlag[],
  profile: UserProfile
): JEERecommendation {
  // Only for 10th passed or 11th/12th in PCM
  const relevantLevels: EducationLevel[] = ['10th_passed', '11th_current', '12th_current'];
  if (!relevantLevels.includes(profile.educationLevel)) {
    return 'Not Applicable';
  }
  
  // If not in PCM stream (and not 10th passed), JEE not applicable
  if (profile.educationLevel !== '10th_passed' && 
      profile.currentStream && 
      !['pcm', 'pcmb'].includes(profile.currentStream)) {
    return 'Not Applicable';
  }

  const jeeThreshold = 15;
  
  // Check Q21 and Q22 for negative responses
  const q21Answer = answers['q21'];
  const q22Answer = answers['q22'];
  const hasNegativeQ21Q22 = q21Answer === 'c' || q22Answer === 'c';

  // Check for routine mismatch
  const hasRoutineMismatch = riskFlags.includes('Routine mismatch for JEE');
  const hasLowPersistence = riskFlags.includes('Low concept persistence');

  // GO conditions
  if (
    trackScores.jee_pcm >= jeeThreshold &&
    meterScores.routineTolerance >= 6 &&
    meterScores.stressTolerance >= 5 &&
    !hasNegativeQ21Q22
  ) {
    return 'GO';
  }

  // NO conditions
  if (hasRoutineMismatch || hasLowPersistence || hasNegativeQ21Q22) {
    return 'NO';
  }

  // MAYBE for everything else with some interest
  if (trackScores.jee_pcm > 5) {
    return 'MAYBE';
  }

  return 'NO';
}

// Get top tracks (filtered by relevance)
export function getTopTracks(
  trackScores: TrackScores,
  trackPercentages: TrackScores,
  profile: UserProfile
): { track: Track; score: number; percentage: number }[] {
  const sortedTracks = ALL_TRACKS
    .filter(track => isTrackRelevant(track, profile))
    .map(track => ({
      track,
      score: trackScores[track],
      percentage: trackPercentages[track],
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Top 5 for more options

  return sortedTracks;
}

// Generate career paths with relevance
export function generateCareerPaths(
  trackScores: TrackScores,
  trackPercentages: TrackScores,
  profile: UserProfile
): CareerPath[] {
  return ALL_TRACKS
    .map(track => {
      const info = TRACK_INFO[track];
      const isRelevant = isTrackRelevant(track, profile);
      
      return {
        track,
        name: info.name,
        percentage: trackPercentages[track],
        description: info.description,
        careers: info.careers,
        exams: info.exams,
        colleges: info.colleges,
        isRelevant,
      };
    })
    .sort((a, b) => {
      // Sort by relevance first, then by percentage
      if (a.isRelevant !== b.isRelevant) {
        return a.isRelevant ? -1 : 1;
      }
      return b.percentage - a.percentage;
    });
}

// Generate next steps based on results and profile
export function generateNextSteps(
  streamRecommendation: StreamRecommendation,
  jeeRecommendation: JEERecommendation,
  trackScores: TrackScores,
  topTracks: { track: Track; score: number; percentage: number }[],
  profile: UserProfile,
  automotiveInterest: boolean
): string[] {
  const steps: string[] = [];

  // Education level specific advice
  switch (profile.educationLevel) {
    case '10th_passed':
      // Stream selection advice
      if (streamRecommendation !== 'Not Applicable') {
        steps.push(`📚 Recommended Stream: ${streamRecommendation}`);
        
        switch (streamRecommendation) {
          case 'PCM':
            steps.push('Choose Physics, Chemistry, Maths in 11th standard');
            if (jeeRecommendation === 'GO') {
              steps.push('✅ JEE Coaching recommended - you have the aptitude!');
            } else if (jeeRecommendation === 'MAYBE') {
              steps.push('🤔 Try self-study for 3 months before joining coaching');
            } else {
              steps.push('Focus on board exams; explore other engineering paths');
            }
            break;
          case 'PCB':
            steps.push('Choose Physics, Chemistry, Biology in 11th standard');
            steps.push('Start NEET preparation alongside boards');
            break;
          case 'PCMB':
            steps.push('Consider taking all 4 subjects if school allows');
            steps.push('This keeps both engineering and medical options open');
            break;
          case 'Commerce':
            steps.push('Choose Commerce stream in 11th standard');
            steps.push('Take Maths if interested in CA/finance');
            break;
          case 'Arts/Design':
            steps.push('Choose Arts/Humanities or Commerce');
            steps.push('Start building your creative portfolio');
            break;
        }
      }
      break;

    case '11th_current':
    case '12th_current':
      steps.push('Focus on your current subjects and boards');
      if (jeeRecommendation === 'GO' && ['pcm', 'pcmb'].includes(profile.currentStream || '')) {
        steps.push('JEE preparation aligns well with your interests');
      }
      if (topTracks.length > 0) {
        steps.push(`Explore: ${TRACK_INFO[topTracks[0].track].name}`);
      }
      break;

    case '12th_passed':
      steps.push('Time to choose your degree/career path!');
      if (topTracks.length > 0) {
        const top = topTracks[0];
        const info = TRACK_INFO[top.track];
        if (info.exams) {
          steps.push(`Key exams to consider: ${info.exams.slice(0, 3).join(', ')}`);
        }
        if (info.colleges) {
          steps.push(`Top colleges: ${info.colleges.slice(0, 3).join(', ')}`);
        }
      }
      break;

    case 'degree_current':
      steps.push('Explore internships and skill-building opportunities');
      if (topTracks.length > 0) {
        steps.push(`Your interests align with: ${TRACK_INFO[topTracks[0].track].name}`);
      }
      break;

    case 'degree_completed':
      steps.push('Consider these career paths based on your profile:');
      topTracks.slice(0, 3).forEach(t => {
        const info = TRACK_INFO[t.track];
        steps.push(`• ${info.name}: ${info.careers.slice(0, 2).join(', ')}`);
      });
      break;
  }

  // Automotive interest addon
  if (automotiveInterest && ['10th_passed', '11th_current', '12th_current'].includes(profile.educationLevel)) {
    steps.push('🏎️ Strong automotive interest detected!');
    steps.push('Look into Mechanical/Automobile Engineering branches');
    steps.push('Explore Formula Student teams & SAE competitions');
  }

  // Defense interest
  if (trackScores.defense_forces > 15) {
    steps.push('🪖 Consider NDA after 12th or CDS after graduation');
    steps.push('Start physical fitness preparation early');
  }

  // UPSC interest
  if (trackScores.upsc_civil > 15 && ['degree_current', 'degree_completed', '12th_passed'].includes(profile.educationLevel)) {
    steps.push('⚖️ UPSC Civil Services could be a great fit');
    steps.push('Any graduation degree works; start reading newspapers');
  }

  // General advice
  steps.push('💬 Talk to professionals in your areas of interest');

  return steps;
}

// Main scoring function
export function calculateResults(
  answers: UserAnswers,
  questions: Question[],
  profile: UserProfile
): QuizResults {
  const { trackScores, meterScores, maybeCount, strongNegativeCount } = calculateRawScores(answers, questions);
  
  const trackPercentages = calculatePercentages(trackScores);
  const confidence = calculateConfidence(maybeCount, strongNegativeCount);
  const riskFlags = determineRiskFlags(trackScores, meterScores, answers, profile);
  const streamRecommendation = determineStreamRecommendation(trackScores, profile);
  const jeeRecommendation = determineJEERecommendation(trackScores, meterScores, answers, riskFlags, profile);
  const topTracks = getTopTracks(trackScores, trackPercentages, profile);
  const careerPaths = generateCareerPaths(trackScores, trackPercentages, profile);
  
  // Check for special interests
  const codingAddon = trackScores.coding_it >= 10 && topTracks[0]?.track !== 'coding_it';
  const automotiveInterest = trackScores.automotive_mech >= 15;

  const nextSteps = generateNextSteps(
    streamRecommendation, 
    jeeRecommendation, 
    trackScores, 
    topTracks, 
    profile,
    automotiveInterest
  );

  return {
    trackScores,
    trackPercentages,
    meterScores,
    confidence,
    riskFlags,
    streamRecommendation,
    jeeRecommendation,
    topTracks,
    careerPaths,
    nextSteps,
    codingAddon,
    automotiveInterest,
    timestamp: new Date().toISOString(),
    userProfile: profile,
  };
}

// Export results as JSON
export function exportResultsJSON(results: QuizResults, answers: UserAnswers): string {
  const exportData = {
    studentName: results.userProfile.name,
    educationLevel: results.userProfile.educationLevel,
    results,
    answers,
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(exportData, null, 2);
}
