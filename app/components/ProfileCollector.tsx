'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, GraduationCap, BookOpen, ChevronRight, ChevronLeft } from 'lucide-react';
import { 
  UserProfile, 
  EducationLevel, 
  Stream, 
  DegreeType,
  EDUCATION_LEVELS,
  STREAM_INFO 
} from '@/app/types';

interface ProfileCollectorProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

const DEGREE_TYPES: { value: DegreeType; label: string }[] = [
  { value: 'btech_engineering', label: 'B.Tech / B.E. (Engineering)' },
  { value: 'bsc_science', label: 'B.Sc (Science)' },
  { value: 'bcom_commerce', label: 'B.Com (Commerce)' },
  { value: 'ba_arts', label: 'B.A. (Arts / Humanities)' },
  { value: 'mbbs_medical', label: 'MBBS / BDS (Medical)' },
  { value: 'bba_management', label: 'BBA / Management' },
  { value: 'bca_computer', label: 'BCA (Computer Applications)' },
  { value: 'law_llb', label: 'LLB / Law' },
  { value: 'bdes_design', label: 'B.Des (Design)' },
  { value: 'other', label: 'Other' },
];

export default function ProfileCollector({ onComplete, initialProfile }: ProfileCollectorProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initialProfile?.name || '');
  const [educationLevel, setEducationLevel] = useState<EducationLevel | null>(
    initialProfile?.educationLevel || null
  );
  const [currentStream, setCurrentStream] = useState<Stream | null>(
    initialProfile?.currentStream || null
  );
  const [degreeType, setDegreeType] = useState<DegreeType | null>(
    initialProfile?.degreeType || null
  );
  const [degreeName, setDegreeName] = useState(initialProfile?.degreeName || '');

  const needsStream = educationLevel === '11th_current' || 
                      educationLevel === '12th_current' || 
                      educationLevel === '12th_passed';
  
  const needsDegree = educationLevel === 'degree_current' || 
                      educationLevel === 'degree_completed';

  const totalSteps = 1 + (needsStream || needsDegree ? 1 : 0) + 1; // name + education + (stream/degree) + 1

  const canProceed = () => {
    if (step === 1) return name.trim().length >= 2;
    if (step === 2) return educationLevel !== null;
    if (step === 3) {
      if (needsStream) return currentStream !== null;
      if (needsDegree) return degreeType !== null && (degreeType !== 'other' || degreeName.trim().length > 0);
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 2 && !needsStream && !needsDegree) {
      // Skip to completion
      handleComplete();
      return;
    }
    if (step === 3 || (step === 2 && !needsStream && !needsDegree)) {
      handleComplete();
      return;
    }
    setStep(step + 1);
  };

  const handleComplete = () => {
    const profile: UserProfile = {
      name: name.trim(),
      educationLevel: educationLevel!,
      currentStream: needsStream ? currentStream! : 'not_applicable',
      degreeType: needsDegree ? degreeType! : 'not_applicable',
      degreeName: degreeName.trim() || undefined,
    };
    onComplete(profile);
  };

  const educationOptions: { value: EducationLevel; emoji: string }[] = [
    { value: '10th_passed', emoji: '🎓' },
    { value: '11th_current', emoji: '📚' },
    { value: '12th_current', emoji: '📖' },
    { value: '12th_passed', emoji: '🎯' },
    { value: 'degree_current', emoji: '🏛️' },
    { value: 'degree_completed', emoji: '👨‍🎓' },
  ];

  const streamOptions: Stream[] = ['pcm', 'pcb', 'pcmb', 'commerce_maths', 'commerce_no_maths', 'arts_humanities', 'other'];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].slice(0, totalSteps).map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-ocean w-8' : 'bg-white/20 w-4'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Name */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-ocean to-lavender flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                Hey there! 👋
              </h2>
              <p className="text-white/60 mb-8">What should we call you?</p>
              
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-6 py-4 rounded-2xl bg-white/10 border-2 border-white/20 
                  text-white text-xl text-center placeholder:text-white/40
                  focus:outline-none focus:border-ocean transition-colors"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
              />
            </motion.div>
          )}

          {/* Step 2: Education Level */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-lavender to-sunset flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                Nice to meet you, {name}! ✨
              </h2>
              <p className="text-white/60 mb-8">Where are you in your journey?</p>
              
              <div className="grid gap-3">
                {educationOptions.map(({ value, emoji }) => (
                  <motion.button
                    key={value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setEducationLevel(value);
                      // Reset dependent values
                      setCurrentStream(null);
                      setDegreeType(null);
                      setDegreeName('');
                    }}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                      educationLevel === value
                        ? 'bg-gradient-to-r from-ocean/30 to-lavender/30 border-2 border-ocean'
                        : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{emoji}</span>
                      <div>
                        <p className="text-white font-medium">{EDUCATION_LEVELS[value].label}</p>
                        <p className="text-white/50 text-sm">{EDUCATION_LEVELS[value].description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Stream or Degree */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-sunset to-coral flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              
              {needsStream && (
                <>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                    What's your stream? 📚
                  </h2>
                  <p className="text-white/60 mb-8">
                    {educationLevel === '10th_passed' 
                      ? "Which stream are you planning to take?"
                      : "Which stream are you currently in?"
                    }
                  </p>
                  
                  <div className="grid gap-3">
                    {streamOptions.map((stream) => (
                      <motion.button
                        key={stream}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentStream(stream)}
                        className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                          currentStream === stream
                            ? 'bg-gradient-to-r from-ocean/30 to-lavender/30 border-2 border-ocean'
                            : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <p className="text-white font-medium">{STREAM_INFO[stream].label}</p>
                        {STREAM_INFO[stream].subjects && (
                          <p className="text-white/50 text-sm">{STREAM_INFO[stream].subjects}</p>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </>
              )}

              {needsDegree && (
                <>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                    What's your degree? 🎓
                  </h2>
                  <p className="text-white/60 mb-8">
                    {educationLevel === 'degree_current' 
                      ? "Which degree are you currently pursuing?"
                      : "Which degree did you complete?"
                    }
                  </p>
                  
                  <div className="grid gap-3 max-h-80 overflow-y-auto pr-2">
                    {DEGREE_TYPES.map(({ value, label }) => (
                      <motion.button
                        key={value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setDegreeType(value)}
                        className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                          degreeType === value
                            ? 'bg-gradient-to-r from-ocean/30 to-lavender/30 border-2 border-ocean'
                            : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <p className="text-white font-medium">{label}</p>
                      </motion.button>
                    ))}
                  </div>

                  {degreeType === 'other' && (
                    <motion.input
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="text"
                      value={degreeName}
                      onChange={(e) => setDegreeName(e.target.value)}
                      placeholder="Enter your degree name"
                      className="w-full mt-4 px-6 py-4 rounded-xl bg-white/10 border-2 border-white/20 
                        text-white placeholder:text-white/40
                        focus:outline-none focus:border-ocean transition-colors"
                    />
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <motion.button
            whileHover={{ scale: step > 1 ? 1.05 : 1 }}
            whileTap={{ scale: step > 1 ? 0.95 : 1 }}
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
              step > 1 
                ? 'bg-white/10 text-white hover:bg-white/20' 
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </motion.button>

          <motion.button
            whileHover={{ scale: canProceed() ? 1.05 : 1 }}
            whileTap={{ scale: canProceed() ? 0.95 : 1 }}
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-ocean to-lavender text-white shadow-lg shadow-ocean/30'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            {(step === 3 || (step === 2 && !needsStream && !needsDegree)) ? 'Start Quiz' : 'Continue'}
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
