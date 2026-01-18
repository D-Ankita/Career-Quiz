'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '@/app/types';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | string[] | undefined;
  onSelect: (optionId: string) => void;
  direction: number;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  onSelect,
  direction,
}: QuestionCardProps) {
  const isSelected = (optionId: string) => {
    if (!selectedAnswer) return false;
    if (Array.isArray(selectedAnswer)) {
      return selectedAnswer.includes(optionId);
    }
    return selectedAnswer === optionId;
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={question.id}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="w-full max-w-2xl mx-auto px-4"
      >
        {/* Question prompt */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-display font-bold text-white text-center mb-8 leading-relaxed"
        >
          {question.prompt}
        </motion.h2>

        {/* Options grid */}
        <div className="grid gap-4 md:gap-5">
          {question.options.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.3 }}
              onClick={() => onSelect(option.id)}
              className={`
                relative group w-full p-5 md:p-6 rounded-2xl text-left
                transition-all duration-300 transform
                ${isSelected(option.id)
                  ? 'bg-gradient-to-r from-ocean/30 to-lavender/30 border-2 border-ocean shadow-lg shadow-ocean/20 scale-[1.02]'
                  : 'bg-white/5 border-2 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]'
                }
              `}
            >
              {/* Selection indicator */}
              <div className={`
                absolute top-4 right-4 w-6 h-6 rounded-full border-2 
                flex items-center justify-center transition-all duration-300
                ${isSelected(option.id)
                  ? 'border-ocean bg-ocean'
                  : 'border-white/30 group-hover:border-white/50'
                }
              `}>
                {isSelected(option.id) && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                )}
              </div>

              {/* Option content */}
              <span className="text-lg md:text-xl font-medium text-white pr-10 block">
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Multi-select hint */}
        {question.type === 'multi' && (
          <p className="text-center text-white/50 text-sm mt-4">
            You can select multiple options
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
