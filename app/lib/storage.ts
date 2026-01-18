import { SavedState, UserAnswers, QuizResults, UserProfile } from '@/app/types';

const STORAGE_KEYS = {
  QUIZ_STATE: 'career_discovery_quiz_state',
  QUIZ_RESULTS: 'career_discovery_quiz_results',
  QUIZ_ANSWERS: 'career_discovery_quiz_answers',
  USER_PROFILE: 'career_discovery_user_profile',
};

// Check if we're in browser
const isBrowser = typeof window !== 'undefined';

// Save user profile
export function saveUserProfile(profile: UserProfile): void {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

// Get saved user profile
export function getSavedProfile(): UserProfile | null {
  if (!isBrowser) return null;
  
  const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (!saved) return null;
  
  try {
    return JSON.parse(saved) as UserProfile;
  } catch {
    return null;
  }
}

// Save quiz progress
export function saveQuizProgress(currentQuestion: number, answers: UserAnswers, profile: UserProfile): void {
  if (!isBrowser) return;
  
  const state: SavedState = {
    currentQuestion,
    answers,
    userProfile: profile,
    startedAt: getSavedState()?.startedAt || new Date().toISOString(),
    lastSavedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEYS.QUIZ_STATE, JSON.stringify(state));
}

// Get saved state
export function getSavedState(): SavedState | null {
  if (!isBrowser) return null;
  
  const saved = localStorage.getItem(STORAGE_KEYS.QUIZ_STATE);
  if (!saved) return null;
  
  try {
    return JSON.parse(saved) as SavedState;
  } catch {
    return null;
  }
}

// Clear quiz progress
export function clearQuizProgress(): void {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEYS.QUIZ_STATE);
}

// Save quiz results
export function saveQuizResults(results: QuizResults, answers: UserAnswers): void {
  if (!isBrowser) return;
  
  localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(results));
  localStorage.setItem(STORAGE_KEYS.QUIZ_ANSWERS, JSON.stringify(answers));
}

// Get saved results
export function getSavedResults(): QuizResults | null {
  if (!isBrowser) return null;
  
  const saved = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
  if (!saved) return null;
  
  try {
    return JSON.parse(saved) as QuizResults;
  } catch {
    return null;
  }
}

// Get saved answers
export function getSavedAnswers(): UserAnswers | null {
  if (!isBrowser) return null;
  
  const saved = localStorage.getItem(STORAGE_KEYS.QUIZ_ANSWERS);
  if (!saved) return null;
  
  try {
    return JSON.parse(saved) as UserAnswers;
  } catch {
    return null;
  }
}

// Clear all saved data
export function clearAllData(): void {
  if (!isBrowser) return;
  
  localStorage.removeItem(STORAGE_KEYS.QUIZ_STATE);
  localStorage.removeItem(STORAGE_KEYS.QUIZ_RESULTS);
  localStorage.removeItem(STORAGE_KEYS.QUIZ_ANSWERS);
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
}

// Download JSON file
export function downloadJSON(content: string, filename: string): void {
  if (!isBrowser) return;
  
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
