'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Download, RefreshCw, BarChart3, Sparkles } from 'lucide-react';
import ResultCards from '@/app/components/ResultCards';
import ParentDashboard from '@/app/components/ParentDashboard';
import { QuizResults, UserAnswers } from '@/app/types';
import { getSavedResults, getSavedAnswers, clearAllData, downloadJSON } from '@/app/lib/storage';
import { exportResultsJSON } from '@/app/lib/scoring';

export default function ResultsPage() {
  const router = useRouter();
  
  const [results, setResults] = useState<QuizResults | null>(null);
  const [answers, setAnswers] = useState<UserAnswers | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedResults = getSavedResults();
    const savedAnswers = getSavedAnswers();
    
    if (!savedResults) {
      router.push('/');
      return;
    }
    
    setResults(savedResults);
    setAnswers(savedAnswers);
    setIsLoading(false);
  }, [router]);

  const handleDownload = () => {
    if (results && answers) {
      const jsonContent = exportResultsJSON(results, answers);
      const fileName = `${results.userProfile.name.replace(/\s+/g, '_')}_career_results.json`;
      downloadJSON(jsonContent, fileName);
    }
  };

  const handleRetake = () => {
    clearAllData();
    router.push('/quiz');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (isLoading || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-ocean border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoHome}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">Home</span>
          </motion.button>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Toggle View Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDetailedView(!showDetailedView)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${
                showDetailedView
                  ? 'bg-ocean/20 text-ocean border-ocean/30'
                  : 'bg-lavender/20 text-lavender border-lavender/30'
              }`}
            >
              {showDetailedView ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span className="hidden sm:inline">Simple View</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5" />
                  <span className="hidden sm:inline">Detailed View</span>
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRetake}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="hidden sm:inline">Retake</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-10 px-4"
      >
        {showDetailedView ? (
          <>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              Detailed Analysis 📊
            </h1>
            <p className="text-white/60">Complete scoring breakdown for {results.userProfile.name}</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-2">
              Your Results Are Here! 🎉
            </h1>
            <p className="text-white/60">Here's what we discovered about you, {results.userProfile.name}</p>
          </>
        )}
      </motion.div>

      {/* Results content */}
      {showDetailedView ? (
        <ParentDashboard results={results} onExport={handleDownload} />
      ) : (
        <ResultCards results={results} />
      )}

      {/* Bottom actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="max-w-4xl mx-auto mt-10 px-4"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Download Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-ocean to-lavender text-white font-semibold shadow-lg shadow-ocean/30 transition-all"
          >
            <Download className="w-5 h-5" />
            Download Results
          </motion.button>
        </div>
        
        {/* Auto-submitted notice */}
        <p className="text-center text-white/40 text-sm mt-4">
          ✓ Results automatically saved
        </p>
      </motion.div>
    </div>
  );
}
