'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, RefreshCw, Sparkles, Compass, Star, Zap, Heart, Target, User } from 'lucide-react';
import { getSavedState, clearAllData, getSavedProfile, getSavedResults } from '@/app/lib/storage';
import { EDUCATION_LEVELS } from '@/app/types';

export default function Home() {
  const router = useRouter();
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [savedName, setSavedName] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const saved = getSavedState();
    const profile = getSavedProfile();
    const results = getSavedResults();
    
    setHasSavedProgress(!!saved);
    setHasResults(!!results);
    setSavedName(profile?.name || results?.userProfile?.name || null);
  }, []);

  const handleStart = () => {
    router.push('/quiz');
  };

  const handleViewResults = () => {
    router.push('/results');
  };

  const handleClearAndStart = () => {
    clearAllData();
    setHasSavedProgress(false);
    setHasResults(false);
    setSavedName(null);
    setShowClearConfirm(false);
    router.push('/quiz');
  };

  const features = [
    { icon: <Zap className="w-6 h-6" />, title: 'Quick & Fun', desc: '10-15 mins' },
    { icon: <Heart className="w-6 h-6" />, title: 'No Pressure', desc: 'Just vibes' },
    { icon: <Target className="w-6 h-6" />, title: 'Personalized', desc: 'For you' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-6xl opacity-20"
        >
          🚀
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 right-20 text-5xl opacity-20"
        >
          🎨
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-40 left-20 text-5xl opacity-20"
        >
          ✈️
        </motion.div>
        <motion.div
          animate={{ y: [0, 25, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-20 right-10 text-6xl opacity-20"
        >
          🏎️
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute top-60 left-1/2 text-5xl opacity-20"
        >
          🪖
        </motion.div>
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl mx-auto"
      >
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-ocean via-lavender to-sunset p-1"
        >
          <div className="w-full h-full rounded-xl bg-midnight flex items-center justify-center">
            <Compass className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        {/* Welcome back message */}
        {savedName && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center justify-center gap-2 text-ocean"
          >
            <User className="w-5 h-5" />
            <span>Welcome back, <strong>{savedName}</strong>!</span>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl font-display font-bold mb-4"
        >
          <span className="gradient-text">Discover</span>
          <br />
          <span className="text-white">Your Path</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-white/70 mb-8 leading-relaxed"
        >
          Confused about your future? Engineering, Medical, Defense, Aviation?
          <br />
          <span className="text-ocean">Let's figure it out together!</span>
        </motion.p>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-4 md:gap-6 mb-10 flex-wrap"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/10"
            >
              <div className="text-ocean">{feature.icon}</div>
              <div className="text-left">
                <p className="text-white font-medium text-sm">{feature.title}</p>
                <p className="text-white/50 text-xs">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* View results button (if has results) */}
          {hasResults && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewResults}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-gold to-sunset text-white font-semibold text-lg shadow-lg shadow-gold/30"
            >
              View My Results
            </motion.button>
          )}

          {/* Main start button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-ocean via-lavender to-sunset text-white font-semibold text-lg shadow-lg shadow-ocean/30 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {hasSavedProgress ? 'Continue Quiz' : hasResults ? 'Retake Quiz' : 'Start Your Quest'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-lavender via-sunset to-ocean opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.button>

          {/* Start fresh (if saved progress or results exist) */}
          {(hasSavedProgress || hasResults) && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 text-white/70 font-medium hover:bg-white/10 hover:text-white transition-all border border-white/10"
            >
              <RefreshCw className="w-5 h-5" />
              Start Fresh
            </motion.button>
          )}
        </motion.div>

        {/* Saved progress indicator */}
        {hasSavedProgress && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-white/50 text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            You have saved progress
          </motion.p>
        )}

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-12 flex items-center justify-center gap-6 text-white/40 text-sm flex-wrap"
        >
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-gold" />
            No sign-up
          </span>
          <span>•</span>
          <span>100% Private</span>
          <span>•</span>
          <span>40 Questions</span>
          <span>•</span>
          <span>18+ Career Tracks</span>
        </motion.div>
      </motion.div>

      {/* Clear confirmation modal */}
      {showClearConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowClearConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-midnight rounded-3xl p-8 border border-white/10 max-w-md w-full text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-sunset/20 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-sunset" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Start Fresh?</h3>
            <p className="text-white/60 mb-6">
              This will clear all your saved data including results. You'll start from the beginning.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-5 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAndStart}
                className="flex-1 px-5 py-3 rounded-xl bg-sunset text-white font-medium hover:bg-sunset/80 transition-colors"
              >
                Yes, Start Fresh
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
