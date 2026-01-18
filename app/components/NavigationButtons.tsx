'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react';

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  onSaveExit: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  isLast: boolean;
  hasAnswer: boolean;
}

export default function NavigationButtons({
  onBack,
  onNext,
  onSaveExit,
  canGoBack,
  canGoNext,
  isLast,
  hasAnswer,
}: NavigationButtonsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-8">
      <div className="flex items-center justify-between gap-4">
        {/* Back button */}
        <motion.button
          whileHover={{ scale: canGoBack ? 1.05 : 1 }}
          whileTap={{ scale: canGoBack ? 0.95 : 1 }}
          onClick={onBack}
          disabled={!canGoBack}
          className={`
            flex items-center gap-2 px-5 py-3 rounded-xl font-medium
            transition-all duration-300
            ${canGoBack
              ? 'bg-white/10 text-white hover:bg-white/20'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
            }
          `}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </motion.button>

        {/* Save & Exit button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSaveExit}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium
            bg-white/5 text-white/70 hover:bg-white/10 hover:text-white
            transition-all duration-300 border border-white/10"
        >
          <Save className="w-5 h-5" />
          <span className="hidden sm:inline">Save & Exit</span>
        </motion.button>

        {/* Next / Finish button */}
        <motion.button
          whileHover={{ scale: hasAnswer ? 1.05 : 1 }}
          whileTap={{ scale: hasAnswer ? 0.95 : 1 }}
          onClick={onNext}
          disabled={!hasAnswer}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
            transition-all duration-300
            ${hasAnswer
              ? isLast
                ? 'bg-gradient-to-r from-sunset to-coral text-white shadow-lg shadow-sunset/30'
                : 'bg-gradient-to-r from-ocean to-lavender text-white shadow-lg shadow-ocean/30'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
            }
          `}
        >
          {isLast ? (
            <>
              <span>See Results</span>
              <CheckCircle className="w-5 h-5" />
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
