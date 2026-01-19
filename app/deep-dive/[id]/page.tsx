'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, Check, Brain, Target, 
  Lightbulb, Heart, Zap, Shield, TrendingUp
} from 'lucide-react';

interface DeepDiveQuestion {
  id: string;
  category: 'alignment' | 'stress_test' | 'passion_probe' | 'reality_check' | 'values';
  prompt: string;
  context?: string;
  options: {
    id: string;
    label: string;
    signals: {
      commerce?: number;
      engineering?: number;
      automotive_business?: number;
      automotive_engineering?: number;
      stress_flag?: number;
      clarity?: number;
      passion?: number;
    };
  }[];
}

const DEEP_DIVE_QUESTIONS: DeepDiveQuestion[] = [
  // ALIGNMENT QUESTIONS - Do actions match stated interests?
  {
    id: 'dd1',
    category: 'alignment',
    prompt: 'You have a free Sunday. Which would you ACTUALLY do?',
    context: 'Be honest - not what sounds impressive',
    options: [
      { id: 'a', label: '📺 Watch YouTube about business/money/startups', signals: { commerce: 3, clarity: 1 } },
      { id: 'b', label: '🔧 Take apart an old gadget to see how it works', signals: { engineering: 3, automotive_engineering: 2 } },
      { id: 'c', label: '🚗 Read about new car launches & their prices', signals: { automotive_business: 3, commerce: 1 } },
      { id: 'd', label: '💻 Code something / watch coding tutorials', signals: { engineering: 2, clarity: 1 } },
      { id: 'e', label: '🎮 Play games / chill with friends', signals: { stress_flag: 1 } },
    ]
  },
  {
    id: 'dd2',
    category: 'alignment',
    prompt: 'When you think about cars, what EXCITES you more?',
    options: [
      { id: 'a', label: '⚙️ The engineering - how engines, transmissions work', signals: { automotive_engineering: 3, engineering: 2 } },
      { id: 'b', label: '💰 The business - who sells, profits, market trends', signals: { automotive_business: 3, commerce: 2 } },
      { id: 'c', label: '🏁 The performance - racing, speed, handling', signals: { automotive_engineering: 1, passion: 1 } },
      { id: 'd', label: '🎨 The design - looks, interiors, styling', signals: { clarity: 1 } },
    ]
  },
  {
    id: 'dd3',
    category: 'alignment',
    prompt: 'If Elon Musk offered you a job, which role would you choose?',
    options: [
      { id: 'a', label: '🔋 Battery Engineer - designing EV powertrains', signals: { engineering: 3, automotive_engineering: 3 } },
      { id: 'b', label: '📊 Business Analyst - market strategy & sales', signals: { commerce: 3, automotive_business: 2 } },
      { id: 'c', label: '💼 CFO - managing Tesla\'s finances', signals: { commerce: 3, clarity: 1 } },
      { id: 'd', label: '🚀 SpaceX Engineer - rockets & aerospace', signals: { engineering: 3, passion: 1 } },
    ]
  },

  // STRESS TEST - Can you handle pressure scenarios?
  {
    id: 'dd4',
    category: 'stress_test',
    prompt: 'Scenario: You scored 65% in a practice JEE test. Your rank: 50,000. How do you feel?',
    context: 'This is a realistic JEE scenario',
    options: [
      { id: 'a', label: '💪 Motivated - I\'ll analyze mistakes and improve', signals: { engineering: 2, clarity: 1 } },
      { id: 'b', label: '😰 Stressed - What will people say?', signals: { stress_flag: 3 } },
      { id: 'c', label: '🤔 Questioning - Is this the right path for me?', signals: { clarity: 2, stress_flag: 1 } },
      { id: 'd', label: '😤 Frustrated - I worked hard, why didn\'t it show?', signals: { stress_flag: 2 } },
    ]
  },
  {
    id: 'dd5',
    category: 'stress_test',
    prompt: 'Your parents are discussing your career with relatives. They\'re comparing you to a cousin in IIT. You:',
    options: [
      { id: 'a', label: '😊 Feel confident - I\'ll prove myself my own way', signals: { clarity: 2 } },
      { id: 'b', label: '😤 Get annoyed - Why compare?', signals: { stress_flag: 1 } },
      { id: 'c', label: '😰 Feel pressure - I need to match expectations', signals: { stress_flag: 3 } },
      { id: 'd', label: '🤷 Don\'t care - Their opinions don\'t define me', signals: { clarity: 2 } },
    ]
  },
  {
    id: 'dd6',
    category: 'stress_test',
    prompt: 'Imagine: 6 months into JEE prep. Daily 8-hour study. Limited friend time. No games. How realistic is this for you?',
    options: [
      { id: 'a', label: '✅ Doable - I can sacrifice for my goal', signals: { engineering: 2, passion: 1 } },
      { id: 'b', label: '😬 Tough - I\'d struggle but try', signals: { stress_flag: 1 } },
      { id: 'c', label: '❌ Unrealistic - I need balance', signals: { stress_flag: 2, commerce: 1 } },
      { id: 'd', label: '🤔 Not sure - Never tried this intensity', signals: { clarity: -1 } },
    ]
  },

  // PASSION PROBE - Finding genuine interests
  {
    id: 'dd7',
    category: 'passion_probe',
    prompt: 'Which conversation would you LOVE to have with an expert?',
    options: [
      { id: 'a', label: '🔧 "How did you design this car engine?"', signals: { automotive_engineering: 3, engineering: 2 } },
      { id: 'b', label: '💰 "How did you build a ₹100Cr business?"', signals: { commerce: 3, passion: 2 } },
      { id: 'c', label: '📈 "How does the stock market really work?"', signals: { commerce: 3 } },
      { id: 'd', label: '🏎️ "What\'s it like being an F1 engineer?"', signals: { automotive_engineering: 2, passion: 2 } },
      { id: 'e', label: '🚗 "How do you decide car pricing strategies?"', signals: { automotive_business: 3, commerce: 2 } },
    ]
  },
  {
    id: 'dd8',
    category: 'passion_probe',
    prompt: 'You\'re starting a YouTube channel. What\'s your content about?',
    options: [
      { id: 'a', label: '🔧 DIY car modifications & engine builds', signals: { automotive_engineering: 3 } },
      { id: 'b', label: '💼 Business ideas & money tips for students', signals: { commerce: 3, passion: 2 } },
      { id: 'c', label: '🚗 Car reviews & which car to buy', signals: { automotive_business: 2, commerce: 1 } },
      { id: 'd', label: '💻 Coding tutorials & tech reviews', signals: { engineering: 2 } },
      { id: 'e', label: '🎬 Entertainment / vlogs / gaming', signals: {} },
    ]
  },
  {
    id: 'dd9',
    category: 'passion_probe',
    prompt: 'What makes you lose track of time? (Pick the most honest answer)',
    options: [
      { id: 'a', label: '📐 Solving a challenging math/physics problem', signals: { engineering: 3, passion: 2 } },
      { id: 'b', label: '💡 Thinking about business ideas', signals: { commerce: 3, passion: 2 } },
      { id: 'c', label: '🚗 Reading about cars, specs, comparisons', signals: { automotive_business: 2, passion: 1 } },
      { id: 'd', label: '💰 Learning about money, investing, finance', signals: { commerce: 3 } },
      { id: 'e', label: '🎮 Gaming / social media / entertainment', signals: { stress_flag: 1 } },
    ]
  },

  // REALITY CHECK - Understanding true motivations
  {
    id: 'dd10',
    category: 'reality_check',
    prompt: 'Be brutally honest: Why is JEE on your radar?',
    options: [
      { id: 'a', label: '❤️ I genuinely love Physics/Maths - want to be an engineer', signals: { engineering: 3, passion: 3, clarity: 2 } },
      { id: 'b', label: '🏫 IIT tag = good placements = high salary', signals: { commerce: 1, clarity: 1 } },
      { id: 'c', label: '👨‍👩‍👦 Parents/society expect it', signals: { stress_flag: 2, clarity: -1 } },
      { id: 'd', label: '🤷 Default option - don\'t know what else', signals: { clarity: -2 } },
      { id: 'e', label: '🎯 Specific goal - aerospace/robotics/AI', signals: { engineering: 3, passion: 2, clarity: 2 } },
    ]
  },
  {
    id: 'dd11',
    category: 'reality_check',
    prompt: 'If Commerce stream led to the same salary as IIT, would you still choose PCM?',
    options: [
      { id: 'a', label: '✅ Yes - I love science & engineering concepts', signals: { engineering: 3, passion: 2 } },
      { id: 'b', label: '❌ No - I\'d switch to Commerce in a heartbeat', signals: { commerce: 3, clarity: 2 } },
      { id: 'c', label: '🤔 I\'d seriously reconsider my choice', signals: { commerce: 2, clarity: 1 } },
      { id: 'd', label: '🤷 Money isn\'t my main driver anyway', signals: { passion: 1 } },
    ]
  },
  {
    id: 'dd12',
    category: 'reality_check',
    prompt: 'You\'re 30 years old. Which day sounds like YOUR ideal life?',
    options: [
      { id: 'a', label: '🔬 In a lab, solving complex engineering problems', signals: { engineering: 3, passion: 2 } },
      { id: 'b', label: '💼 Running my own business, meeting clients', signals: { commerce: 3, passion: 2 } },
      { id: 'c', label: '🏎️ Managing an automobile showroom/dealership', signals: { automotive_business: 3, commerce: 2 } },
      { id: 'd', label: '🚗 Designing cars at Tata/Mahindra R&D', signals: { automotive_engineering: 3, engineering: 2 } },
      { id: 'e', label: '📈 Trading stocks, managing investments', signals: { commerce: 3 } },
    ]
  },

  // VALUES - What matters most
  {
    id: 'dd13',
    category: 'values',
    prompt: 'Rank these: What matters MOST to you in a career?',
    context: 'Pick your #1 priority',
    options: [
      { id: 'a', label: '💸 Making lots of money', signals: { commerce: 2 } },
      { id: 'b', label: '🧠 Solving interesting problems', signals: { engineering: 2, passion: 1 } },
      { id: 'c', label: '🕊️ Freedom & flexibility', signals: { commerce: 2, stress_flag: -1 } },
      { id: 'd', label: '🏆 Status & recognition', signals: {} },
      { id: 'e', label: '🌍 Making an impact', signals: { passion: 2 } },
    ]
  },
  {
    id: 'dd14',
    category: 'values',
    prompt: 'Which failure would hurt you MORE?',
    options: [
      { id: 'a', label: '📉 Not cracking JEE after 2 years of effort', signals: { stress_flag: 1 } },
      { id: 'b', label: '😔 Being stuck in a career I don\'t enjoy', signals: { clarity: 2, passion: 2 } },
      { id: 'c', label: '💔 Disappointing my parents\' expectations', signals: { stress_flag: 2 } },
      { id: 'd', label: '💰 Not earning as much as my peers', signals: { commerce: 1 } },
    ]
  },
  {
    id: 'dd15',
    category: 'values',
    prompt: 'Last question: If you could send a message to yourself 5 years from now, what would it be?',
    options: [
      { id: 'a', label: '"Trust the process - hard work pays off"', signals: { engineering: 1, clarity: 1 } },
      { id: 'b', label: '"Follow your gut, not others\' expectations"', signals: { commerce: 1, clarity: 2 } },
      { id: 'c', label: '"Take more risks - you\'re capable"', signals: { commerce: 2, passion: 1 } },
      { id: 'd', label: '"Find what you love, money will follow"', signals: { passion: 3, clarity: 2 } },
    ]
  },
];

interface DeepDiveResults {
  commerce: number;
  engineering: number;
  automotive_business: number;
  automotive_engineering: number;
  stress_flags: number;
  clarity: number;
  passion: number;
}

export default function DeepDivePage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [direction, setDirection] = useState(1);

  const currentQuestion = DEEP_DIVE_QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / DEEP_DIVE_QUESTIONS.length) * 100;

  const handleSelect = (optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  };

  const handleNext = () => {
    if (currentIndex < DEEP_DIVE_QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const calculateResults = (): DeepDiveResults => {
    const results: DeepDiveResults = {
      commerce: 0,
      engineering: 0,
      automotive_business: 0,
      automotive_engineering: 0,
      stress_flags: 0,
      clarity: 0,
      passion: 0,
    };

    Object.entries(answers).forEach(([qId, optionId]) => {
      const question = DEEP_DIVE_QUESTIONS.find(q => q.id === qId);
      if (!question) return;
      
      const option = question.options.find(o => o.id === optionId);
      if (!option) return;

      Object.entries(option.signals).forEach(([key, value]) => {
        if (key === 'stress_flag') {
          results.stress_flags += value;
        } else if (key in results) {
          results[key as keyof DeepDiveResults] += value;
        }
      });
    });

    return results;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'alignment': return <Target className="w-5 h-5" />;
      case 'stress_test': return <Shield className="w-5 h-5" />;
      case 'passion_probe': return <Heart className="w-5 h-5" />;
      case 'reality_check': return <Brain className="w-5 h-5" />;
      case 'values': return <Lightbulb className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'alignment': return 'from-ocean to-ocean/50';
      case 'stress_test': return 'from-red-500 to-red-500/50';
      case 'passion_probe': return 'from-pink-500 to-pink-500/50';
      case 'reality_check': return 'from-amber-500 to-amber-500/50';
      case 'values': return 'from-emerald-500 to-emerald-500/50';
      default: return 'from-lavender to-lavender/50';
    }
  };

  if (showResults) {
    const results = calculateResults();
    const maxScore = Math.max(results.commerce, results.engineering);
    const primaryPath = results.commerce > results.engineering ? 'Commerce/Business' : 'Engineering/JEE';
    const autoPath = results.automotive_business > results.automotive_engineering ? 'Automotive Business' : 'Automotive Engineering';

    return (
      <div className="min-h-screen py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto px-4"
        >
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Deep Dive Results 🎯
          </h1>
          <p className="text-white/60 text-center mb-8">
            Here's what we discovered about Gagan's true interests
          </p>

          {/* Primary Finding */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-ocean/30 to-lavender/30 border border-ocean/30 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Primary Finding</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-white/70">Commerce/Business</span>
                  <span className="text-ocean font-bold">{results.commerce}</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-ocean rounded-full"
                    style={{ width: `${(results.commerce / 30) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-white/70">Engineering/JEE</span>
                  <span className="text-lavender font-bold">{results.engineering}</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-lavender rounded-full"
                    style={{ width: `${(results.engineering / 30) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-xl bg-white/5">
              <p className="text-white">
                <strong className="text-ocean">Verdict:</strong> {' '}
                {results.commerce > results.engineering + 5 
                  ? 'Strong Commerce/Business orientation confirmed. JEE may not be the best fit.'
                  : results.engineering > results.commerce + 5
                  ? 'Genuine Engineering interest detected. JEE could be a good path.'
                  : 'Mixed signals - needs more exploration before deciding.'
                }
              </p>
            </div>
          </div>

          {/* Automotive Interest Breakdown */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">🚗 Automotive Interest Analysis</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-2xl font-bold text-sunset">{results.automotive_business}</p>
                <p className="text-white/60 text-sm">Business Side</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-2xl font-bold text-lavender">{results.automotive_engineering}</p>
                <p className="text-white/60 text-sm">Engineering Side</p>
              </div>
            </div>
            <p className="text-white/70">
              {results.automotive_business > results.automotive_engineering
                ? '💼 Gagan views cars from a BUSINESS lens - pricing, sales, market. Consider: Car dealerships, Auto finance, EV startups, Automotive marketing.'
                : results.automotive_engineering > results.automotive_business
                ? '🔧 Gagan is interested in HOW cars work - engines, design, technology. Consider: Mechanical Engineering, Automobile Engineering.'
                : '🤔 Balanced interest - could explore both paths.'
              }
            </p>
          </div>

          {/* Stress & Clarity */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className={`p-6 rounded-2xl border ${results.stress_flags > 5 ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
              <h3 className="text-lg font-bold text-white mb-2">Stress Indicators</h3>
              <p className={`text-3xl font-bold ${results.stress_flags > 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                {results.stress_flags > 5 ? '⚠️ High' : results.stress_flags > 2 ? '😐 Moderate' : '✅ Low'}
              </p>
              <p className="text-white/60 text-sm mt-2">
                {results.stress_flags > 5 
                  ? 'Multiple stress signals detected. JEE pressure may be challenging.'
                  : 'Manageable stress levels for competitive exams.'
                }
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-ocean/10 border border-ocean/30">
              <h3 className="text-lg font-bold text-white mb-2">Clarity & Passion</h3>
              <div className="flex gap-4">
                <div>
                  <p className="text-2xl font-bold text-ocean">{results.clarity}</p>
                  <p className="text-white/60 text-sm">Clarity</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-pink-400">{results.passion}</p>
                  <p className="text-white/60 text-sm">Passion</p>
                </div>
              </div>
            </div>
          </div>

          {/* Final Recommendation */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-sunset/20 to-coral/20 border border-sunset/30 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">📋 Recommendation for Parents</h2>
            
            {results.commerce > results.engineering + 3 ? (
              <div className="space-y-3 text-white/80">
                <p>Based on the deep dive analysis, <strong className="text-white">Commerce stream appears to be a better fit</strong> for Gagan.</p>
                <p className="font-medium text-ocean">Suggested paths:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Commerce with Maths → CA/CS/CMA → Finance career</li>
                  <li>BBA → MBA from top B-school</li>
                  <li>Entrepreneurship in automotive sector (dealerships, startups)</li>
                  <li>Stock market / Investment banking track</li>
                </ul>
                <p className="text-amber-400 text-sm mt-4">
                  ⚠️ JEE preparation may lead to stress without genuine engineering interest.
                </p>
              </div>
            ) : results.engineering > results.commerce + 3 ? (
              <div className="space-y-3 text-white/80">
                <p><strong className="text-white">Engineering interest confirmed!</strong> JEE preparation could be a good choice.</p>
                <p className="font-medium text-ocean">Next steps:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Start JEE preparation with a reputed coaching</li>
                  <li>Focus on building problem-solving mindset</li>
                  <li>If automotive interest is strong, target Mechanical/Auto Engineering</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-3 text-white/80">
                <p><strong className="text-white">Mixed signals detected.</strong> More exploration needed before committing.</p>
                <p className="font-medium text-ocean">Suggestions:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Spend 2-3 months exploring both paths</li>
                  <li>Try basic JEE material - does problem-solving excite him?</li>
                  <li>Explore business/startup content - does he engage deeply?</li>
                  <li>Talk to professionals in both fields</li>
                </ul>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/reports/${reportId}`)}
              className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              ← Back to Full Report
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowResults(false);
                setCurrentIndex(0);
                setAnswers({});
              }}
              className="px-6 py-3 rounded-xl bg-ocean text-white hover:bg-ocean/80 transition-all"
            >
              Retake Deep Dive
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col py-8 md:py-12">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 mb-8 w-full">
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Deep Dive Quiz 🔍
        </h1>
        <p className="text-white/60 text-center mb-6">
          15 questions to confirm Gagan's true interests
        </p>
        
        {/* Progress */}
        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute h-full bg-gradient-to-r from-ocean to-lavender rounded-full"
          />
        </div>
        <p className="text-white/50 text-sm text-center mt-2">
          Question {currentIndex + 1} of {DEEP_DIVE_QUESTIONS.length}
        </p>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            className="w-full max-w-2xl"
          >
            {/* Category Badge */}
            <div className="flex justify-center mb-6">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getCategoryColor(currentQuestion.category)}`}>
                {getCategoryIcon(currentQuestion.category)}
                <span className="text-white text-sm capitalize">
                  {currentQuestion.category.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Question */}
            <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-2">
              {currentQuestion.prompt}
            </h2>
            {currentQuestion.context && (
              <p className="text-white/50 text-center text-sm mb-6 italic">
                {currentQuestion.context}
              </p>
            )}

            {/* Options */}
            <div className="space-y-3 mt-8">
              {currentQuestion.options.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                    answers[currentQuestion.id] === option.id
                      ? 'bg-ocean/20 border-ocean text-white'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion.id] === option.id
                        ? 'border-ocean bg-ocean'
                        : 'border-white/30'
                    }`}>
                      {answers[currentQuestion.id] === option.id && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span>{option.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="max-w-2xl mx-auto px-4 mt-8 w-full">
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: currentIndex > 0 ? 1.05 : 1 }}
            whileTap={{ scale: currentIndex > 0 ? 0.95 : 1 }}
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
              currentIndex > 0
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </motion.button>

          <motion.button
            whileHover={{ scale: answers[currentQuestion.id] ? 1.05 : 1 }}
            whileTap={{ scale: answers[currentQuestion.id] ? 0.95 : 1 }}
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              answers[currentQuestion.id]
                ? 'bg-gradient-to-r from-ocean to-lavender text-white shadow-lg shadow-ocean/30'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            {currentIndex === DEEP_DIVE_QUESTIONS.length - 1 ? 'See Results' : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
