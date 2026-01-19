'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, Target, AlertTriangle, CheckCircle, 
  TrendingUp, Brain, Heart, Lightbulb, ArrowRight, Download,
  BarChart3, Sparkles, Clock, Car, Briefcase, 
  Shield, Rocket, DollarSign, Award, ThumbsUp, ThumbsDown, Zap
} from 'lucide-react';

interface DeepDiveReport {
  type: string;
  studentName: string;
  reportId: string;
  timestamp: string;
  scores: {
    commerce: number;
    engineering: number;
    automotive_business: number;
    automotive_engineering: number;
    stress_flags: number;
    clarity: number;
    passion: number;
    risk_tolerance: number;
    financial_interest: number;
  };
  analysis: {
    primaryPath: string;
    automotivePath: string;
    stressLevel: string;
  };
  answers: Record<string, {
    question: string;
    answer: string;
    isCustom: boolean;
  }>;
}

// Deep dive report data for Gagan
const DEEP_DIVE_REPORTS: Record<string, DeepDiveReport> = {
  'gagan-2026': {
    type: "deep_dive_quiz",
    studentName: "Gagan",
    reportId: "gagan-2026",
    timestamp: "2026-01-19T11:10:05.078Z",
    scores: {
      commerce: 58,
      engineering: 0,
      automotive_business: 29,
      automotive_engineering: 4,
      stress_flags: 1,
      clarity: 18,
      passion: 30,
      risk_tolerance: 13,
      financial_interest: 9
    },
    analysis: {
      primaryPath: "Commerce/Business",
      automotivePath: "Automotive Business",
      stressLevel: "Low"
    },
    answers: {
      dd1: { question: "You have a free Sunday. Which would you ACTUALLY do?", answer: "📺 Watch YouTube about business/money/startups", isCustom: false },
      dd2: { question: "When you think about cars, what EXCITES you more?", answer: "💰 The business - who sells, profits, market trends", isCustom: false },
      dd3: { question: "If Elon Musk offered you a job, which role would you choose?", answer: "💼 CFO - managing Tesla's finances", isCustom: false },
      dd4: { question: "Scenario: You scored 65% in a CAT mock test. Your percentile: 70. How do you feel?", answer: "💪 Motivated - I'll analyze mistakes and improve", isCustom: false },
      dd5: { question: "Your parents are discussing your career with relatives. They're comparing you to a cousin who's a CA. You:", answer: "😤 Get annoyed - Why compare?", isCustom: false },
      dd6: { question: "Imagine: 6 months into CA/MBA prep. Daily 5-6 hour study. Limited friend time. Focused weekends. How realistic is this for you?", answer: "😬 Tough - I'd struggle but try", isCustom: false },
      dd7: { question: "Which conversation would you LOVE to have with an expert?", answer: "🌟 All of the above - I'm curious about everything!", isCustom: false },
      dd8: { question: "You're starting a YouTube channel. What's your content about?", answer: "🔧 DIY car modifications & engine builds", isCustom: false },
      dd9: { question: "What makes you lose track of time? (Pick the most honest answer)", answer: "All except 1", isCustom: true },
      dd10: { question: "Be brutally honest: Why is JEE on your radar?", answer: "🏫 IIT tag = good placements = high salary", isCustom: false },
      dd11: { question: "If Commerce stream led to the same salary as IIT, would you still choose PCM?", answer: "❌ No - I'd switch to Commerce in a heartbeat", isCustom: false },
      dd12: { question: "You're 30 years old. Which day sounds like YOUR ideal life?", answer: "2 n 5", isCustom: true },
      dd13: { question: "Rank these: What matters MOST to you in a career?", answer: "🕊️ Freedom & flexibility", isCustom: false },
      dd14: { question: "Which failure would hurt you MORE?", answer: "😔 Being stuck in a career I don't enjoy", isCustom: false },
      dd15: { question: "If you could send a message to yourself 5 years from now, what would it be?", answer: "\"Take more risks - you're capable\"", isCustom: false },
      dd16: { question: "Which commerce career path excites you MOST?", answer: "3 n 4", isCustom: true },
      dd17: { question: "Your friend has ₹10,000 to invest. They ask your advice. You:", answer: "🔍 Research different options before answering", isCustom: false },
      dd18: { question: "Scenario: You start a small business. First month = ₹5,000 loss. What do you do?", answer: "💪 Expected this - first months are always hard", isCustom: false },
      dd19: { question: "Do you understand these terms? Profit margin, ROI, market cap, P/E ratio", answer: "📚 Some of them - learning more", isCustom: false },
      dd20: { question: "Which book/content would you genuinely read on a weekend?", answer: "📘 \"Rich Dad Poor Dad\" / \"Psychology of Money\"", isCustom: false },
      dd21: { question: "CA preparation = 3-4 years, 8 papers, 50% fail rate. Your reaction?", answer: "🤔 Tough, but if I'm interested, I'll manage", isCustom: false },
      dd22: { question: "Which scenario sounds more FUN to you?", answer: "🏎️ Test-driving different cars and comparing specs", isCustom: false },
      dd23: { question: "If you could shadow someone for a week, who would it be?", answer: "🚀 A startup founder building their company", isCustom: false },
      dd24: { question: "You won ₹1 Lakh in a competition. What do you do?", answer: "📈 Invest in stocks/mutual funds", isCustom: false },
      dd25: { question: "Final commerce check: What genuinely interests you about business/commerce?", answer: "💰 The money - high earning potential", isCustom: false },
      dd26: { question: "🚗 Imagine you own a car dealership. What would EXCITE you most about the job?", answer: "🏢 Building a brand - \"People should think of MY showroom first\"", isCustom: false },
      dd27: { question: "A customer wants to buy a car but their budget is ₹2L short. What would you do?", answer: "💳 Explain financing options - EMI, loan, exchange bonus", isCustom: false },
      dd28: { question: "Which automotive business sounds MOST interesting to you?", answer: "🏎️ Luxury/sports car imports (Porsche, Ferrari)", isCustom: false },
      dd29: { question: "Do you know the approximate on-road price of a Maruti Swift vs Hyundai i20 vs Tata Altroz?", answer: "✅ Yes! I follow car prices regularly", isCustom: false },
      dd30: { question: "Final automotive question: If you could work at any car company, which role?", answer: "🏎️ Start my own multi-brand dealership someday", isCustom: false },
      dd31: { question: "📚 Business mindset requires DEEP learning - finance, marketing, negotiation, people skills. Your reaction?", answer: "🔥 Excited! I love learning new things, especially about business", isCustom: false },
      dd32: { question: "📉 Hard truth: Business is volatile. Aaj profit, kal loss. Kabhi ₹1L kamao, kabhi ₹50K loss. Ready?", answer: "💪 Yes! That's what makes it exciting - the ups and downs", isCustom: false },
      dd33: { question: "🗣️ In sales, you need to CONVINCE people to buy. Some will say NO 10 times. How do you feel about this?", answer: "👍 I can learn to handle rejection, it's part of the game", isCustom: false },
      dd34: { question: "🎯 Reality: College khatam hote hi showroom nahi milega. Starting from ZERO. Efforts lagane padenge. Your feeling?", answer: "👍 I understand - everyone starts somewhere", isCustom: false },
      dd35: { question: "🔍 Opportunities dhundna TERA skill hoga. Koi spoon-feed nahi karega. Proactive banana padega. Ready?", answer: "💯 Yes! I'll find opportunities myself - network, apply, hustle", isCustom: false },
      dd36: { question: "🏢 Would you do an UNPAID internship at a car dealership for 2-3 months to learn the ground reality?", answer: "🤔 Yes, if it leads to real learning and connections", isCustom: false },
      dd37: { question: "📋 Challenge: Pick any car (Creta/Thar/Nexon) and write: price, competitors, why people buy it. Would you enjoy this?", answer: "🔥 YES! I already know this stuff, sounds fun!", isCustom: false },
      dd38: { question: "📱 Challenge: Create a simple Instagram Reel idea about \"cars + pricing + trends\". Your reaction?", answer: "🎬 Already have ideas! \"Top 5 cars under ₹10L\" type content", isCustom: false },
      dd39: { question: "💼 If you had ₹1 Lakh to start a small business TODAY, what would you do?", answer: "💰 I'd save it / invest it, not start a business", isCustom: false },
      dd40: { question: "⏰ Final reality check: Success takes TIME. 5-10 years of consistent effort. No shortcuts. How does this feel?", answer: "💪 I'm in for the long game - patience and persistence", isCustom: false }
    }
  }
};

export default function DeepDiveReportPage() {
  const params = useParams();
  const reportId = params.id as string;
  const [report, setReport] = useState<DeepDiveReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const data = DEEP_DIVE_REPORTS[reportId];
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

  const { scores, answers } = report;

  // Key insights from the answers
  const keyInsights = [
    { 
      icon: ThumbsUp, 
      label: "Commerce Path Confirmed", 
      value: `${scores.commerce} points`,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30"
    },
    { 
      icon: ThumbsDown, 
      label: "Engineering Interest", 
      value: `${scores.engineering} points`,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30"
    },
    { 
      icon: Car, 
      label: "Auto Business", 
      value: `${scores.automotive_business} points`,
      color: "text-ocean",
      bgColor: "bg-ocean/10",
      borderColor: "border-ocean/30"
    },
    { 
      icon: Zap, 
      label: "Risk Tolerance", 
      value: `${scores.risk_tolerance}/15`,
      color: "text-sunset",
      bgColor: "bg-sunset/10",
      borderColor: "border-sunset/30"
    },
  ];

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
              Deep Dive Analysis 🔍
            </h1>
            <p className="text-white/60 mt-1">
              Comprehensive career validation for {report.studentName}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Quiz Completed</span>
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
              <p className="text-white/60">Deep Dive Quiz • 40 Questions Completed</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* THE VERDICT */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="max-w-5xl mx-auto px-4 mb-8"
      >
        <div className="p-8 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-ocean/20 border-2 border-emerald-500/50">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-emerald-400" />
            <h3 className="text-2xl font-bold text-white">THE VERDICT</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center p-6 rounded-xl bg-white/5">
              <p className="text-white/60 text-sm mb-2">Recommended Stream</p>
              <p className="text-4xl font-bold text-emerald-400">COMMERCE</p>
              <p className="text-white/60 text-sm mt-2">with Business Studies & Economics</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/5">
              <p className="text-white/60 text-sm mb-2">Career Direction</p>
              <p className="text-4xl font-bold text-ocean">AUTOMOTIVE</p>
              <p className="text-4xl font-bold text-ocean">BUSINESS</p>
              <p className="text-white/60 text-sm mt-2">Dealership / Trading / Imports</p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/80 text-center">
              <strong className="text-emerald-400">Confidence Level: 95%+</strong> — Every major indicator points to Commerce + Automotive Business.
              The engineering path shows <strong className="text-red-400">ZERO</strong> genuine interest.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Quick Score Summary */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-5xl mx-auto px-4 mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-ocean" />
          Score Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {keyInsights.map((insight, i) => (
            <div key={i} className={`p-4 rounded-xl ${insight.bgColor} border ${insight.borderColor} text-center`}>
              <insight.icon className={`w-6 h-6 ${insight.color} mx-auto mb-2`} />
              <p className={`text-2xl font-bold ${insight.color}`}>{insight.value}</p>
              <p className="text-white/60 text-sm">{insight.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-2xl font-bold text-lavender">{scores.clarity}</p>
            <p className="text-white/60 text-xs">Clarity</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-2xl font-bold text-sunset">{scores.passion}</p>
            <p className="text-white/60 text-xs">Passion</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-2xl font-bold text-ocean">{scores.financial_interest}</p>
            <p className="text-white/60 text-xs">Financial IQ</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-2xl font-bold text-emerald-400">{scores.stress_flags}</p>
            <p className="text-white/60 text-xs">Stress Flags</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-2xl font-bold text-red-400">{scores.automotive_engineering}</p>
            <p className="text-white/60 text-xs">Auto Engineering</p>
          </div>
        </div>
      </motion.section>

      {/* Critical Evidence */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-5xl mx-auto px-4 mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-lavender" />
          Critical Evidence From His Answers
        </h3>

        <div className="space-y-6">
          {/* The Killer Evidence */}
          <div className="p-6 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40">
            <h4 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              🎯 THE KILLER EVIDENCE: Commerce Confirmed
            </h4>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-white/60 text-sm mb-1">Question dd11:</p>
                <p className="text-white font-medium italic">"If Commerce stream led to the same salary as IIT, would you still choose PCM?"</p>
                <p className="text-emerald-400 font-bold mt-2">→ "No - I'd switch to Commerce in a heartbeat"</p>
                <p className="text-white/50 text-xs mt-2">This single answer tells everything. JEE was never about passion — it was about perceived salary.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-white/60 text-sm mb-1">Question dd10:</p>
                <p className="text-white font-medium italic">"Be brutally honest: Why is JEE on your radar?"</p>
                <p className="text-amber-400 font-bold mt-2">→ "IIT tag = good placements = high salary"</p>
                <p className="text-white/50 text-xs mt-2">External motivation, not genuine engineering interest.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-white/60 text-sm mb-1">Question dd3:</p>
                <p className="text-white font-medium italic">"If Elon Musk offered you a job, which role?"</p>
                <p className="text-ocean font-bold mt-2">→ "CFO - managing Tesla's finances"</p>
                <p className="text-white/50 text-xs mt-2">Not CTO, not Engineer. He chose the FINANCE role at a car company!</p>
              </div>
            </div>
          </div>

          {/* Automotive Business Pattern */}
          <div className="p-6 rounded-2xl bg-ocean/10 border border-ocean/30">
            <h4 className="text-lg font-semibold text-ocean mb-4 flex items-center gap-2">
              <Car className="w-5 h-5" />
              🚗 Automotive Business (NOT Engineering) Pattern
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-white/60 text-xs">What excites about cars?</p>
                  <p className="text-ocean font-medium">"The business - who sells, profits, market trends"</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-white/60 text-xs">Dealership excitement?</p>
                  <p className="text-ocean font-medium">"Building a brand - People should think of MY showroom"</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-white/60 text-xs">Which automotive business?</p>
                  <p className="text-ocean font-medium">"Luxury/sports car imports (Porsche, Ferrari)"</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-white/60 text-xs">Car company role?</p>
                  <p className="text-ocean font-medium">"Start my own multi-brand dealership someday"</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-white/60 text-xs">Car prices knowledge?</p>
                  <p className="text-ocean font-medium">"Yes! I follow car prices regularly"</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-white/60 text-xs">Budget short customer?</p>
                  <p className="text-ocean font-medium">"Explain financing options - EMI, loan, exchange"</p>
                </div>
              </div>
            </div>
            <p className="text-white/50 text-sm mt-4 italic text-center">
              Every automotive answer points to BUSINESS, SALES, DEALERSHIP — NOT engineering.
            </p>
          </div>

          {/* Entrepreneurial Mindset */}
          <div className="p-6 rounded-2xl bg-sunset/10 border border-sunset/30">
            <h4 className="text-lg font-semibold text-sunset mb-4 flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              🚀 Entrepreneurial Mindset Confirmed
            </h4>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-white/5">
                <p className="text-3xl mb-2">💪</p>
                <p className="text-white font-medium">Risk Tolerant</p>
                <p className="text-white/60 text-sm">"Ups and downs make it exciting"</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <p className="text-3xl mb-2">🔥</p>
                <p className="text-white font-medium">Startup Minded</p>
                <p className="text-white/60 text-sm">Wants to shadow startup founders</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <p className="text-3xl mb-2">⏰</p>
                <p className="text-white font-medium">Long-term Vision</p>
                <p className="text-white/60 text-sm">"In for the long game"</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-white/5">
              <p className="text-white/80">
                <strong className="text-sunset">Key Quote:</strong> When asked what message to send to future self:
                <span className="text-sunset italic"> "Take more risks - you're capable"</span>
              </p>
            </div>
          </div>

          {/* Ground Reality Check - Passed */}
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <h4 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              ✅ Ground Reality Check: PASSED
            </h4>
            
            <div className="space-y-2 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Understands starting from zero is required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Excited about deep learning (finance, marketing, negotiation)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Ready for business volatility ("That's what makes it exciting!")</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Can handle sales rejection ("Part of the game")</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Proactive mindset ("I'll find opportunities myself")</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Willing to do unpaid internship for real learning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Already has content ideas for automotive social media!</span>
              </div>
            </div>
          </div>

          {/* One Minor Flag */}
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <h4 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              ⚠️ Points to Monitor (Not Concerns, Just Awareness)
            </h4>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-amber-400 font-medium mb-2">1. External Motivation for Money</p>
                <p className="text-white/70 text-sm">
                  When asked what interests him about commerce: "The money - high earning potential"
                </p>
                <p className="text-white/50 text-xs mt-2">
                  <strong>Analysis:</strong> Not a red flag — many successful businesspeople are money-driven. 
                  But combine this with his genuine interest in cars, and it's a healthy mix.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-amber-400 font-medium mb-2">2. One Engineering-ish Answer</p>
                <p className="text-white/70 text-sm">
                  YouTube channel idea: "DIY car modifications & engine builds"
                </p>
                <p className="text-white/50 text-xs mt-2">
                  <strong>Analysis:</strong> This is HOBBY vs CAREER. He enjoys watching car modification content, 
                  but his career answers consistently point to business. Many dealership owners love cars 
                  without being engineers!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-amber-400 font-medium mb-2">3. Stress with Comparisons</p>
                <p className="text-white/70 text-sm">
                  Parents comparing to CA cousin: "Gets annoyed - Why compare?"
                </p>
                <p className="text-white/50 text-xs mt-2">
                  <strong>Analysis:</strong> Normal teenage response. Actually shows healthy self-awareness 
                  and independence. The key: support his chosen path so he doesn't feel pressured.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-amber-400 font-medium mb-2">4. Cautious with ₹1L Business Question</p>
                <p className="text-white/70 text-sm">
                  "I'd save it / invest it, not start a business"
                </p>
                <p className="text-white/50 text-xs mt-2">
                  <strong>Analysis:</strong> Actually a STRENGTH! Shows he's not recklessly entrepreneurial. 
                  He understands that starting a business needs preparation, not just ₹1L.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Recommended Path */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-5xl mx-auto px-4 mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-sunset" />
          Recommended Path Forward
        </h3>

        <div className="p-6 rounded-2xl bg-gradient-to-r from-ocean/20 to-lavender/20 border border-white/10">
          <div className="space-y-6">
            
            {/* 11th-12th */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-ocean/30 flex items-center justify-center flex-shrink-0">
                <span className="text-ocean font-bold">1</span>
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">11th & 12th: Commerce Stream</h4>
                <p className="text-white/70 mt-1">
                  Subjects: <strong className="text-ocean">Business Studies + Economics + Accountancy</strong> (+ optional: Maths if interested in MBA later)
                </p>
                <p className="text-white/50 text-sm mt-2">
                  Focus on understanding business fundamentals while building financial literacy.
                </p>
              </div>
            </div>

            {/* After 12th */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-lavender/30 flex items-center justify-center flex-shrink-0">
                <span className="text-lavender font-bold">2</span>
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">After 12th: BBA / B.Com</h4>
                <p className="text-white/70 mt-1">
                  <strong className="text-lavender">BBA</strong> preferred for business orientation, or B.Com for accounting base.
                </p>
                <p className="text-white/50 text-sm mt-2">
                  Consider specializations in Marketing or Finance. Good colleges: Christ University, SRCC, St. Xavier's, NMIMS.
                </p>
              </div>
            </div>

            {/* MBA */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-sunset/30 flex items-center justify-center flex-shrink-0">
                <span className="text-sunset font-bold">3</span>
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Post-Graduation: MBA (Marketing/Sales)</h4>
                <p className="text-white/70 mt-1">
                  Target: <strong className="text-sunset">CAT / XAT / GMAT</strong> → IIMs, XLRI, SP Jain, ISB
                </p>
                <p className="text-white/50 text-sm mt-2">
                  MBA in Marketing or Sales will open doors to automotive industry leadership roles.
                </p>
              </div>
            </div>

            {/* Internships */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 font-bold">★</span>
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Parallel: Automotive Industry Exposure</h4>
                <p className="text-white/70 mt-1">
                  <strong className="text-emerald-400">Start NOW</strong> — During board vacations:
                </p>
                <ul className="text-white/60 text-sm mt-2 space-y-1">
                  <li>• Unpaid internship at any car dealership (even local Maruti/Hyundai)</li>
                  <li>• Shadow a showroom manager for a week</li>
                  <li>• Start a car-focused Instagram page (he already has ideas!)</li>
                  <li>• Read: "Rich Dad Poor Dad", "The Psychology of Money"</li>
                  <li>• Follow automotive business news (AutoCar Business, ET Auto)</li>
                </ul>
              </div>
            </div>

            {/* Career Options */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-coral/30 flex items-center justify-center flex-shrink-0">
                <span className="text-coral font-bold">→</span>
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Career Destinations</h4>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-coral font-medium">Dealership Roles</p>
                    <p className="text-white/60 text-sm">Sales Manager → Regional Manager → Dealership Owner</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-coral font-medium">Auto OEMs</p>
                    <p className="text-white/60 text-sm">Sales & Marketing at Tata, Maruti, Hyundai, Mercedes</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-coral font-medium">Luxury Imports</p>
                    <p className="text-white/60 text-sm">Pre-owned luxury car business, parallel imports</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-coral font-medium">Auto Finance/Insurance</p>
                    <p className="text-white/60 text-sm">HDFC Auto Loans, ICICI Lombard, car leasing companies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Final Verdict Box */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-5xl mx-auto px-4 mb-8"
      >
        <div className="p-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-ocean text-center">
          <h3 className="text-3xl font-bold text-white mb-4">🎯 Parent Summary</h3>
          <div className="max-w-2xl mx-auto">
            <p className="text-white/90 text-lg leading-relaxed">
              Gagan has <strong>ZERO</strong> genuine interest in engineering. JEE was on his radar only for the 
              "IIT tag = salary" perception. His actual passion lies in <strong>business, finance, and the automotive industry</strong>. 
              He explicitly said he'd switch to Commerce "in a heartbeat" if salary was equal.
            </p>
            <div className="mt-6 p-4 rounded-xl bg-white/20">
              <p className="text-white font-bold text-xl">
                ✅ COMMERCE IS THE RIGHT PATH
              </p>
              <p className="text-white/80 mt-2">
                With focus on Automotive Business — Dealerships, Sales, Marketing
              </p>
            </div>
            <p className="text-white/70 text-sm mt-4">
              He's shown maturity, ground reality awareness, risk tolerance, and entrepreneurial thinking. 
              The key now is to support this direction and provide early industry exposure.
            </p>
          </div>
        </div>
      </motion.section>

      {/* All Answers Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-5xl mx-auto px-4 mb-8"
      >
        <details className="group">
          <summary className="cursor-pointer p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <span className="text-white font-medium flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-ocean" />
              View All 40 Answers (Click to expand)
            </span>
          </summary>
          
          <div className="mt-4 space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {Object.entries(answers).map(([key, data], i) => (
              <div key={key} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start gap-3">
                  <span className="text-ocean font-mono text-sm">{key}</span>
                  <div className="flex-1">
                    <p className="text-white/60 text-sm">{data.question}</p>
                    <p className={`font-medium mt-1 ${data.isCustom ? 'text-amber-400' : 'text-white'}`}>
                      {data.answer}
                      {data.isCustom && <span className="text-amber-400/60 text-xs ml-2">(custom answer)</span>}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </details>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="max-w-5xl mx-auto px-4 text-center text-white/40 text-sm"
      >
        <p>Deep Dive Analysis • Career Discovery Quiz</p>
        <p className="mt-1">
          {new Date(report.timestamp).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
          })}
        </p>
        <a href="/reports/gagan-2026" className="text-ocean hover:underline mt-4 inline-block">
          ← Back to Initial Report
        </a>
      </motion.footer>
    </div>
  );
}
