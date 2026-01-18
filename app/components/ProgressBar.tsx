'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  round?: string;
}

export default function ProgressBar({ current, total, round }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white/60">
          {current} of {total}
        </span>
        {round && (
          <span className="text-sm font-semibold text-ocean bg-ocean/20 px-3 py-1 rounded-full">
            {round}
          </span>
        )}
        <span className="text-sm font-medium text-white/60">
          {percentage}%
        </span>
      </div>
      
      <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div
          className="h-full bg-gradient-to-r from-ocean via-lavender to-sunset rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      
      {/* Milestone dots */}
      <div className="relative h-4 mt-1">
        {[25, 50, 75, 100].map((milestone) => (
          <div
            key={milestone}
            className={`absolute top-0 w-2 h-2 rounded-full transform -translate-x-1/2 transition-colors duration-300 ${
              percentage >= milestone ? 'bg-ocean' : 'bg-white/20'
            }`}
            style={{ left: `${milestone}%` }}
          />
        ))}
      </div>
    </div>
  );
}
