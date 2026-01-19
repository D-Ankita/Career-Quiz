'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, GraduationCap, Target, AlertTriangle, CheckCircle, 
  TrendingUp, Brain, Heart, Lightbulb, ArrowRight, Download,
  BarChart3, Sparkles, Clock, BookOpen
} from 'lucide-react';

interface ReportData {
  studentName: string;
  educationLevel: string;
  results: {
    trackScores: Record<string, number>;
    trackPercentages: Record<string, number>;
    meterScores: {
      routineTolerance: number;
      stressTolerance: number;
      clarity: number;
    };
    confidence: number;
    riskFlags: string[];
    streamRecommendation: string;
    jeeRecommendation: string;
    topTracks: Array<{
      track: string;
      score: number;
      percentage: number;
    }>;
    nextSteps: string[];
    codingAddon: boolean;
    automotiveInterest: boolean;
    userProfile: {
      name: string;
      educationLevel: string;
    };
  };
  answers: Record<string, string | string[]>;
  exportedAt: string;
}

const TRACK_NAMES: Record<string, string> = {
  jee_pcm: 'Engineering / JEE',
  pcb_med: 'Medical / Biology',
  commerce: 'Commerce / Business',
  coding_it: 'Coding / IT',
  design_creative: 'Design / Creative',
  govt_defense: 'Govt Services',
  automotive_mech: 'Automotive / Mechanical',
  upsc_civil: 'UPSC / Civil Services',
  defense_forces: 'Armed Forces',
  aviation: 'Aviation / Aerospace',
  maritime: 'Maritime / Navy',
  law_legal: 'Law / Legal',
  media_journalism: 'Media / Journalism',
  psychology: 'Psychology / Counseling',
  sports_fitness: 'Sports / Fitness',
  research_academia: 'Research / Academia',
  agriculture: 'Agriculture / Agritech',
  hospitality: 'Hospitality / Tourism',
};

// Reports data - In production, this would come from a database
const REPORTS: Record<string, ReportData> = {
  'gagan-2026': {
    studentName: 'Gagan',
    educationLevel: '10th_passed',
    results: {
      trackScores: {
        jee_pcm: 20, pcb_med: 4, commerce: 35, coding_it: 10, design_creative: 12,
        govt_defense: 0, automotive_mech: 19, upsc_civil: 0, defense_forces: 7,
        aviation: 4, maritime: 0, law_legal: 0, media_journalism: 4, psychology: 0,
        sports_fitness: 9, research_academia: 3, agriculture: 3, hospitality: 4
      },
      trackPercentages: {
        jee_pcm: 33, pcb_med: 13, commerce: 78, coding_it: 22, design_creative: 22,
        govt_defense: 0, automotive_mech: 38, upsc_civil: 0, defense_forces: 23,
        aviation: 16, maritime: 0, law_legal: 0, media_journalism: 20, psychology: 0,
        sports_fitness: 45, research_academia: 15, agriculture: 15, hospitality: 27
      },
      meterScores: { routineTolerance: 10, stressTolerance: 5, clarity: 10 },
      confidence: 10,
      riskFlags: [],
      streamRecommendation: 'PCM',
      jeeRecommendation: 'GO',
      topTracks: [
        { track: 'commerce', score: 35, percentage: 78 },
        { track: 'jee_pcm', score: 20, percentage: 33 },
        { track: 'automotive_mech', score: 19, percentage: 38 },
      ],
      nextSteps: [
        '📚 Recommended Stream: PCM',
        'Choose Physics, Chemistry, Maths in 11th standard',
        '✅ JEE Coaching recommended',
        '🏎️ Strong automotive interest detected!',
      ],
      codingAddon: true,
      automotiveInterest: true,
      userProfile: { name: 'Gagan', educationLevel: '10th_passed' }
    },
    answers: {
      q1: 'c', q2: ['e', 'd'], q3: 'c', q4: 'a', q5: 'a', q6: 'a', q7: 'b',
      q8: ['f', 'd'], q9: 'b', q10: 'b', q11: 'b', q12: 'b',
      q13: ['c', 'e', 'l'], q14: 'd', q15: 'a', q16: 'g', q17: 'f', q18: 'b',
      q19: ['a', 'c'], q20: 'd', q21: 'a', q22: 'b', q23: 'b', q24: 'c',
      q25: 'a', q26: 'b', q27: 'c', q28: 'b', q29: 'c', q30: ['c', 'f'],
      q31: 'b', q32: 'c', q33: 'c', q34: 'a', q35: 'd', q36: 'e', q37: 'a',
      q38: 'f', q39: 'd', q40: 'b'
    },
    exportedAt: '2026-01-19T07:52:41.741Z'
  }
};

export default function ParentReportPage() {
  const params = useParams();
  const reportId = params.id as string;
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const data = REPORTS[reportId];
      setReport(data || null);
      setLoading(false);
    }, 500);
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-ocean border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Report Not Found</h1>
          <p className="text-white/60">The report ID "{reportId}" does not exist.</p>
        </div>
      </div>
    );
  }

  const { results, answers } = report;

  return (
    <div className="min-h-screen py-8 md:py-12">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto px-4 mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
              Parent Report 📊
            </h1>
            <p className="text-white/60 mt-1">
              Detailed career analysis for {report.studentName}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ocean/20 border border-ocean/30">
            <Clock className="w-4 h-4 text-ocean" />
            <span className="text-ocean text-sm">
              {new Date(report.exportedAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </motion.header>

      {/* Student Profile Card */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-5xl mx-auto px-4 mb-8"
      >
        <div className="p-6 rounded-2xl bg-gradient-to-r from-ocean/20 to-lavender/20 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ocean to-lavender flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{report.studentName}</h2>
              <p className="text-white/60">Class 10 Passed • Exploring 11th Stream Options</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick Summary */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-5xl mx-auto px-4 mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-ocean" />
          Quick Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-3xl font-bold text-ocean">{results.trackPercentages.commerce}%</p>
            <p className="text-white/60 text-sm">Commerce Match</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-3xl font-bold text-lavender">{results.meterScores.clarity}/10</p>
            <p className="text-white/60 text-sm">Clarity Score</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-3xl font-bold text-sunset">{results.meterScores.stressTolerance}/10</p>
            <p className="text-white/60 text-sm">Stress Tolerance</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-3xl font-bold text-emerald-400">{results.confidence}/10</p>
            <p className="text-white/60 text-sm">Confidence</p>
          </div>
        </div>
      </motion.section>

      {/* Critical Analysis Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-5xl mx-auto px-4 mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-lavender" />
          Critical Analysis
        </h3>
        
        <div className="space-y-6">
          {/* The Contradiction */}
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <h4 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Key Finding: The PCM vs Commerce Contradiction
            </h4>
            <p className="text-white/80 leading-relaxed mb-4">
              The quiz recommended <strong className="text-ocean">PCM + JEE</strong> based on Gagan's high routine tolerance (10/10) 
              and his confidence that he can handle 2 years of strict preparation. However, a deeper look at his 
              <strong className="text-amber-400"> actual interests</strong> tells a different story:
            </p>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <span>When asked what he'd choose <em>"if no one judged him"</em> → <strong className="text-white">Commerce/Business</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <span>Why JEE? → <em>"For a good college/career"</em> (not passion for the subject)</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <span>His "automotive interest" is actually <strong className="text-white">business-oriented</strong> (prices, market trends)</span>
              </li>
            </ul>
          </div>

          {/* Pattern Analysis */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="text-lg font-semibold text-ocean mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Pattern Analysis: What His Answers Really Show
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-white mb-2">🚗 "Automotive Interest" Decoded:</h5>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Sees a cool car → Thinks about <strong className="text-ocean">PRICE</strong></li>
                  <li>• Vehicle fascination → <strong className="text-ocean">Market & sales trends</strong></li>
                  <li>• Dream job "F1 Engineer" but...</li>
                  <li>• Documentary choice → <strong className="text-ocean">Business empires</strong></li>
                  <li>• With ₹50L → <strong className="text-ocean">Start a business</strong></li>
                </ul>
                <p className="text-white/50 text-xs mt-2 italic">
                  This is NOT an engineering mindset. This is an entrepreneur who LIKES cars.
                </p>
              </div>
              
              <div>
                <h5 className="font-medium text-white mb-2">💼 True Business Orientation:</h5>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• YouTube: Business/success stories</li>
                  <li>• Topics: Money/markets/business</li>
                  <li>• At 25: Flying/traveling (lifestyle focus)</li>
                  <li>• Matters most: High salary + Freedom</li>
                  <li>• Wants to understand: Stock markets</li>
                </ul>
                <p className="text-white/50 text-xs mt-2 italic">
                  Every "deep" question points to commerce/entrepreneurship.
                </p>
              </div>
            </div>
          </div>

          {/* Stress Flag */}
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30">
            <h4 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Concern: Stress Sensitivity
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-white/80 mb-2"><strong>Evidence:</strong></p>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• "When parents expect a lot" → <strong className="text-red-400">Stresses him out</strong></li>
                  <li>• Biggest struggle → <strong className="text-red-400">Pressure/anxiety</strong></li>
                  <li>• Stress Tolerance score: Only <strong className="text-red-400">5/10</strong></li>
                </ul>
              </div>
              <div>
                <p className="text-white/80 mb-2"><strong>Implication for JEE:</strong></p>
                <p className="text-white/70 text-sm">
                  JEE is a high-pressure environment. While Gagan <em>thinks</em> he can handle strict routines, 
                  his stress sensitivity could become a challenge during the intense preparation phase.
                </p>
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <h4 className="text-lg font-semibold text-emerald-400 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Clear Strengths
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl mb-2">🎯</p>
                <p className="text-white font-medium">High Clarity</p>
                <p className="text-white/60 text-sm">Knows what he wants deep down</p>
              </div>
              <div className="text-center">
                <p className="text-3xl mb-2">💡</p>
                <p className="text-white font-medium">Creative Thinker</p>
                <p className="text-white/60 text-sm">Self-identified as "idea person"</p>
              </div>
              <div className="text-center">
                <p className="text-3xl mb-2">🔄</p>
                <p className="text-white font-medium">Adaptable</p>
                <p className="text-white/60 text-sm">Would combine multiple interests</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Recommendation */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-5xl mx-auto px-4 mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-sunset" />
          Parent Recommendation
        </h3>
        
        <div className="p-6 rounded-2xl bg-gradient-to-r from-sunset/20 to-coral/20 border border-sunset/30">
          <h4 className="text-lg font-semibold text-white mb-4">Before deciding on PCM + JEE, consider:</h4>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-sunset/30 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sunset font-bold">1</span>
              </div>
              <div>
                <p className="text-white font-medium">Have a heart-to-heart about WHY JEE</p>
                <p className="text-white/60 text-sm">Is it genuine interest in engineering, or peer/societal pressure?</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-sunset/30 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sunset font-bold">2</span>
              </div>
              <div>
                <p className="text-white font-medium">Explore Commerce as a serious option</p>
                <p className="text-white/60 text-sm">CA, CS, MBA, BBA, Entrepreneurship paths are equally rewarding</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-sunset/30 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sunset font-bold">3</span>
              </div>
              <div>
                <p className="text-white font-medium">Consider the "Automotive Business" angle</p>
                <p className="text-white/60 text-sm">EV startups, auto dealerships, auto finance - business roles in the car industry</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-sunset/30 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sunset font-bold">4</span>
              </div>
              <div>
                <p className="text-white font-medium">Take the Deep Dive Quiz</p>
                <p className="text-white/60 text-sm">We've prepared a follow-up quiz to confirm his true interests</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Deep Dive CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-5xl mx-auto px-4 mb-8"
      >
        <div className="p-8 rounded-2xl bg-gradient-to-r from-ocean to-lavender text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Deep Dive Complete! 🎯
          </h3>
          <p className="text-white/80 mb-6">
            Gagan has completed the 40-question deep dive quiz. View the detailed analysis.
          </p>
          <a
            href={`/reports/deep-dive/${reportId}`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-ocean font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <BarChart3 className="w-5 h-5" />
            View Deep Dive Report
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </motion.section>

      {/* Full Score Breakdown */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-5xl mx-auto px-4 mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-ocean" />
          Complete Score Breakdown
        </h3>
        
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="space-y-3">
            {Object.entries(results.trackPercentages)
              .sort(([,a], [,b]) => b - a)
              .map(([track, percentage]) => (
                <div key={track} className="flex items-center gap-4">
                  <div className="w-40 text-white/70 text-sm truncate">
                    {TRACK_NAMES[track] || track}
                  </div>
                  <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.1 }}
                      className={`h-full rounded-full ${
                        percentage >= 50 ? 'bg-gradient-to-r from-ocean to-lavender' :
                        percentage >= 25 ? 'bg-ocean/60' : 'bg-white/20'
                      }`}
                    />
                  </div>
                  <div className="w-12 text-right text-white font-medium">
                    {percentage}%
                  </div>
                </div>
              ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="max-w-5xl mx-auto px-4 text-center text-white/40 text-sm"
      >
        <p>Report generated by Career Discovery Quiz • {new Date(report.exportedAt).toLocaleDateString('en-IN')}</p>
        <p className="mt-1">Report ID: {reportId}</p>
      </motion.footer>
    </div>
  );
}
