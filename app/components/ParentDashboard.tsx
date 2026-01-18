'use client';

import { motion } from 'framer-motion';
import { QuizResults, TRACK_INFO, Track, EDUCATION_LEVELS, STREAM_INFO } from '@/app/types';
import { 
  BarChart3, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle,
  XCircle,
  HelpCircle,
  Download,
  User,
  GraduationCap
} from 'lucide-react';

interface ParentDashboardProps {
  results: QuizResults;
  onExport: () => void;
}

function MeterGauge({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const percentage = (value / 10) * 100;
  
  return (
    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="text-white font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-full rounded-full ${color}`}
          />
        </div>
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-white/40">/10</span>
      </div>
      <p className="text-white/50 text-sm mt-2">
        {value >= 7 ? 'High' : value >= 4 ? 'Moderate' : 'Low'}
      </p>
    </div>
  );
}

export default function ParentDashboard({ results, onExport }: ParentDashboardProps) {
  // Get all tracks that have some score
  const relevantTracks = (Object.keys(results.trackScores) as Track[])
    .filter(track => results.trackScores[track] > 0)
    .sort((a, b) => results.trackScores[b] - results.trackScores[a]);
  
  const profile = results.userProfile;
  const educationInfo = EDUCATION_LEVELS[profile.educationLevel];
  const streamInfo = profile.currentStream && profile.currentStream !== 'not_applicable' 
    ? STREAM_INFO[profile.currentStream] 
    : null;

  const getJEEStatusIcon = () => {
    switch (results.jeeRecommendation) {
      case 'GO': return <CheckCircle className="w-6 h-6 text-emerald-400" />;
      case 'MAYBE': return <HelpCircle className="w-6 h-6 text-amber-400" />;
      case 'NO': return <XCircle className="w-6 h-6 text-rose-400" />;
      default: return null;
    }
  };

  const getJEEStatusColor = () => {
    switch (results.jeeRecommendation) {
      case 'GO': return 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30';
      case 'MAYBE': return 'from-amber-500/20 to-amber-600/20 border-amber-500/30';
      case 'NO': return 'from-rose-500/20 to-rose-600/20 border-rose-500/30';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lavender to-ocean flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Detailed Analysis</h1>
            <p className="text-white/60">Complete scoring breakdown</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExport}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-ocean to-lavender text-white font-medium shadow-lg shadow-ocean/30"
        >
          <Download className="w-5 h-5" />
          Export Results
        </motion.button>
      </motion.div>

      {/* Student info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-ocean to-lavender flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
            <div className="flex flex-wrap gap-4 mt-2 text-white/60">
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                {educationInfo.label}
              </span>
              {streamInfo && (
                <span className="text-ocean">
                  {streamInfo.label}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Stream recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-ocean/20 to-lavender/20 rounded-2xl p-6 border border-ocean/30"
        >
          <h3 className="text-white/60 text-sm font-medium mb-2">
            {profile.educationLevel === '10th_passed' ? 'Recommended Stream' : 'Top Career Track'}
          </h3>
          <p className="text-3xl font-bold text-white">
            {results.streamRecommendation !== 'Not Applicable' 
              ? results.streamRecommendation 
              : TRACK_INFO[results.topTracks[0]?.track]?.name || 'N/A'}
          </p>
        </motion.div>

        {/* JEE recommendation */}
        {results.jeeRecommendation !== 'Not Applicable' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-gradient-to-br ${getJEEStatusColor()} rounded-2xl p-6 border`}
          >
            <h3 className="text-white/60 text-sm font-medium mb-2">JEE Coaching</h3>
            <div className="flex items-center gap-3">
              {getJEEStatusIcon()}
              <p className="text-3xl font-bold text-white">{results.jeeRecommendation}</p>
            </div>
          </motion.div>
        )}

        {/* Confidence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gold/20 to-sunset/20 rounded-2xl p-6 border border-gold/30"
        >
          <h3 className="text-white/60 text-sm font-medium mb-2">Response Confidence</h3>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-white">{results.confidence}</p>
            <span className="text-white/40">/10</span>
          </div>
        </motion.div>
      </div>

      {/* All track scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-ocean" />
          <h3 className="text-xl font-semibold text-white">All Track Scores</h3>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {relevantTracks.map((track, index) => {
            const trackInfo = TRACK_INFO[track];
            const rawScore = results.trackScores[track];
            const percentage = results.trackPercentages[track];
            
            return (
              <motion.div
                key={track}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${trackInfo.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {trackInfo.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium truncate">{trackInfo.name}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-white/40 text-sm">Raw: {rawScore}</span>
                      <span className="text-white font-bold">{percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + index * 0.05 }}
                      className={`h-full rounded-full bg-gradient-to-r ${trackInfo.color}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Meters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid md:grid-cols-3 gap-4"
      >
        <MeterGauge
          label="Routine Tolerance"
          value={results.meterScores.routineTolerance}
          icon={<Activity className="w-5 h-5 text-ocean" />}
          color="bg-gradient-to-r from-ocean to-lavender"
        />
        <MeterGauge
          label="Stress Tolerance"
          value={results.meterScores.stressTolerance}
          icon={<TrendingUp className="w-5 h-5 text-mint" />}
          color="bg-gradient-to-r from-mint to-ocean"
        />
        <MeterGauge
          label="Career Clarity"
          value={results.meterScores.clarity}
          icon={<CheckCircle className="w-5 h-5 text-gold" />}
          color="bg-gradient-to-r from-gold to-sunset"
        />
      </motion.div>

      {/* Risk flags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          <h3 className="text-xl font-semibold text-white">Risk Flags</h3>
        </div>

        {results.riskFlags.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {results.riskFlags.map((flag, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
              >
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span className="text-white/80">{flag}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-white/80">No significant risk flags detected</span>
          </div>
        )}
      </motion.div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-br from-lavender/10 to-ocean/10 rounded-3xl p-6 md:p-8 border border-lavender/20"
      >
        <h3 className="text-xl font-semibold text-white mb-4">💡 Key Insights</h3>
        <ul className="space-y-3 text-white/80">
          <li className="flex items-start gap-3">
            <span className="text-ocean">•</span>
            <span>
              {results.meterScores.routineTolerance >= 6 
                ? "Your child can handle structured routines well - competitive exam preparation may suit them."
                : "Your child may need flexibility - avoid overly rigid coaching schedules."}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-ocean">•</span>
            <span>
              {results.meterScores.stressTolerance >= 5
                ? "They handle pressure reasonably well."
                : "High stress environments may affect their performance - consider supportive learning environments."}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-ocean">•</span>
            <span>
              {results.confidence >= 7
                ? "They seem clear about their preferences - support their interests!"
                : "They may need more exposure to different fields before deciding."}
            </span>
          </li>
          {results.topTracks.length > 0 && (
            <li className="flex items-start gap-3">
              <span className="text-ocean">•</span>
              <span>
                Top interest area: <strong className="text-ocean">{TRACK_INFO[results.topTracks[0].track].name}</strong> - 
                Consider arranging mentorship or field visits in this area.
              </span>
            </li>
          )}
        </ul>
      </motion.div>

      {/* Timestamp */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-white/40 text-sm"
      >
        Results generated on {new Date(results.timestamp).toLocaleString()}
      </motion.p>
    </div>
  );
}
