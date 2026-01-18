'use client';

import { motion } from 'framer-motion';
import { QuizResults, TRACK_INFO, EDUCATION_LEVELS } from '@/app/types';
import { Sparkles, TrendingUp, ArrowRight, Code, AlertTriangle, User, GraduationCap, Plane, Ship, Scale, Target } from 'lucide-react';

interface ResultCardsProps {
  results: QuizResults;
}

export default function ResultCards({ results }: ResultCardsProps) {
  const getStreamColor = (stream: string) => {
    switch (stream) {
      case 'PCM': return 'from-blue-500 to-indigo-600';
      case 'PCB': return 'from-emerald-500 to-teal-600';
      case 'PCMB': return 'from-cyan-500 to-blue-600';
      case 'Commerce': return 'from-amber-500 to-orange-600';
      case 'Arts/Design': return 'from-pink-500 to-rose-600';
      default: return 'from-slate-500 to-gray-700';
    }
  };

  const getJEEBadge = (rec: string) => {
    switch (rec) {
      case 'GO':
        return { color: 'bg-emerald-500', text: 'JEE Coaching: Good Fit! ✅' };
      case 'MAYBE':
        return { color: 'bg-amber-500', text: 'JEE Coaching: Consider Carefully 🤔' };
      case 'NO':
        return { color: 'bg-rose-500', text: 'JEE Coaching: Explore Other Paths ❌' };
      default:
        return null;
    }
  };

  const jeeBadge = getJEEBadge(results.jeeRecommendation);
  const showStreamRec = results.streamRecommendation !== 'Not Applicable';
  const profile = results.userProfile;
  const educationInfo = EDUCATION_LEVELS[profile.educationLevel];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 px-4">
      {/* User info card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex items-center gap-4"
      >
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-ocean to-lavender flex items-center justify-center text-2xl">
          <User className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{profile.name}</h2>
          <p className="text-white/60 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            {educationInfo.label}
          </p>
        </div>
      </motion.div>

      {/* Main recommendation card (for 10th passed) */}
      {showStreamRec && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getStreamColor(results.streamRecommendation)} p-1`}
        >
          <div className="bg-midnight/90 backdrop-blur-xl rounded-[22px] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-gold" />
              <span className="text-gold font-medium">Recommended Stream for 11th</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              {results.streamRecommendation}
            </h2>
            
            <p className="text-white/70 text-lg mb-6">
              Based on your interests and strengths, this stream aligns best with your profile.
            </p>

            {/* JEE Badge */}
            {jeeBadge && (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${jeeBadge.color} text-white font-medium`}>
                {jeeBadge.text}
              </div>
            )}

            {/* Special interests */}
            <div className="flex flex-wrap gap-3 mt-4">
              {results.automotiveInterest && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 text-red-300 text-sm"
                >
                  🏎️ Strong Automotive Interest
                </motion.div>
              )}
              {results.codingAddon && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/20 text-violet-300 text-sm"
                >
                  <Code className="w-4 h-4" /> Learn Coding Too!
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Top career paths */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-ocean" />
          <h3 className="text-xl font-semibold text-white">Your Top Career Paths</h3>
        </div>

        <div className="grid gap-4">
          {results.topTracks.slice(0, 5).map((item, index) => {
            const trackInfo = TRACK_INFO[item.track];
            return (
              <motion.div
                key={item.track}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`relative p-5 rounded-2xl bg-gradient-to-r ${trackInfo.color} overflow-hidden`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{trackInfo.icon}</div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{trackInfo.name}</h4>
                      <p className="text-white/80 text-sm mb-2">{trackInfo.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {trackInfo.careers.slice(0, 3).map((career, i) => (
                          <span key={i} className="text-xs bg-white/20 px-2 py-1 rounded-full text-white">
                            {career}
                          </span>
                        ))}
                      </div>
                      {trackInfo.exams && (
                        <p className="text-white/60 text-xs mt-2">
                          Exams: {trackInfo.exams.slice(0, 2).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white/30">#{index + 1}</div>
                    <div className="text-white font-bold">{item.percentage}%</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Special interest indicators */}
      {(results.trackScores.defense_forces > 10 || 
        results.trackScores.aviation > 10 || 
        results.trackScores.maritime > 10 ||
        results.trackScores.upsc_civil > 10) && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-gold" />
            <h3 className="text-lg font-semibold text-white">Special Interests Detected</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {results.trackScores.defense_forces > 10 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-800/30 border border-green-600/30 text-green-300">
                🪖 Defense Forces
              </div>
            )}
            {results.trackScores.aviation > 10 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-800/30 border border-sky-600/30 text-sky-300">
                <Plane className="w-4 h-4" /> Aviation
              </div>
            )}
            {results.trackScores.maritime > 10 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-800/30 border border-cyan-600/30 text-cyan-300">
                <Ship className="w-4 h-4" /> Maritime / Navy
              </div>
            )}
            {results.trackScores.upsc_civil > 10 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-800/30 border border-yellow-600/30 text-yellow-300">
                <Scale className="w-4 h-4" /> Civil Services
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Next steps */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <ArrowRight className="w-6 h-6 text-mint" />
          <h3 className="text-xl font-semibold text-white">Your Next Steps</h3>
        </div>

        <div className="space-y-3">
          {results.nextSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ocean to-lavender flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
              <p className="text-white/80 leading-relaxed">{step}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Risk flags (if any) */}
      {results.riskFlags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-amber-500/10 backdrop-blur-xl rounded-2xl p-5 border border-amber-500/20"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-medium">Things to think about</span>
          </div>
          <ul className="space-y-2">
            {results.riskFlags.map((flag, index) => (
              <li key={index} className="text-white/70 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {flag}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
