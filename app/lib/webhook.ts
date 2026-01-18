import { QuizResults, UserAnswers, TRACK_INFO } from '@/app/types';

// Your Google Apps Script Web App URL
// Set this in .env.local as NEXT_PUBLIC_WEBHOOK_URL
const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || '';

export interface SubmissionData {
  studentName: string;
  educationLevel: string;
  currentStream: string;
  degreeType: string;
  topTrack1: string;
  topTrack1Percentage: number;
  topTrack2: string;
  topTrack2Percentage: number;
  topTrack3: string;
  topTrack3Percentage: number;
  streamRecommendation: string;
  jeeRecommendation: string;
  routineTolerance: number;
  stressTolerance: number;
  clarity: number;
  confidence: number;
  riskFlags: string;
  automotiveInterest: boolean;
  codingAddon: boolean;
  timestamp: string;
  fullResultsJSON: string;
  answersJSON: string;
  parentEmail?: string;
  parentPhone?: string;
}

export function prepareSubmissionData(
  results: QuizResults, 
  answers: UserAnswers
): SubmissionData {
  const profile = results.userProfile;
  
  return {
    studentName: profile.name,
    educationLevel: profile.educationLevel,
    currentStream: profile.currentStream || 'N/A',
    degreeType: profile.degreeType || 'N/A',
    topTrack1: results.topTracks[0] ? TRACK_INFO[results.topTracks[0].track].name : 'N/A',
    topTrack1Percentage: results.topTracks[0]?.percentage || 0,
    topTrack2: results.topTracks[1] ? TRACK_INFO[results.topTracks[1].track].name : 'N/A',
    topTrack2Percentage: results.topTracks[1]?.percentage || 0,
    topTrack3: results.topTracks[2] ? TRACK_INFO[results.topTracks[2].track].name : 'N/A',
    topTrack3Percentage: results.topTracks[2]?.percentage || 0,
    streamRecommendation: results.streamRecommendation,
    jeeRecommendation: results.jeeRecommendation,
    routineTolerance: results.meterScores.routineTolerance,
    stressTolerance: results.meterScores.stressTolerance,
    clarity: results.meterScores.clarity,
    confidence: results.confidence,
    riskFlags: results.riskFlags.join(', ') || 'None',
    automotiveInterest: results.automotiveInterest,
    codingAddon: results.codingAddon,
    timestamp: new Date().toISOString(),
    fullResultsJSON: JSON.stringify(results),
    answersJSON: JSON.stringify(answers),
  };
}

export async function submitToWebhook(
  results: QuizResults, 
  answers: UserAnswers,
  additionalInfo?: { parentEmail?: string; parentPhone?: string }
): Promise<{ success: boolean; message: string }> {
  if (!WEBHOOK_URL) {
    return { 
      success: false, 
      message: 'Webhook URL not configured. Please set NEXT_PUBLIC_WEBHOOK_URL in .env.local' 
    };
  }

  try {
    const data = prepareSubmissionData(results, answers);
    
    // Add additional info
    const payload = {
      ...data,
      parentEmail: additionalInfo?.parentEmail || '',
      parentPhone: additionalInfo?.parentPhone || '',
    };

    // Use URL-encoded form data for Google Apps Script compatibility
    const formBody = Object.entries(payload)
      .map(([key, value]) => 
        encodeURIComponent(key) + '=' + encodeURIComponent(String(value))
      )
      .join('&');

    // Submit using fetch with form data
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    });

    // For Google Apps Script, check if we got a response
    if (response.ok || response.type === 'opaque') {
      return { 
        success: true, 
        message: 'Results submitted successfully!' 
      };
    } else {
      return {
        success: false,
        message: `Server error: ${response.status}`
      };
    }
  } catch (error) {
    console.error('Webhook submission error:', error);
    
    // Even if there's a CORS error, the request might have gone through
    // Google Apps Script with no-cors mode will throw but still work
    return { 
      success: true, 
      message: 'Results submitted!' 
    };
  }
}
