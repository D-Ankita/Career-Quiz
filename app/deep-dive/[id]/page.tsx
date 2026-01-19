'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, Check, Brain, Target, 
  Lightbulb, Heart, Zap, Shield, Download, Loader2, CheckCircle
} from 'lucide-react';

interface DeepDiveQuestion {
  id: string;
  category: 'alignment' | 'stress_test' | 'passion_probe' | 'reality_check' | 'values' | 'commerce_validation';
  prompt: string;
  context?: string;
  allowCustom?: boolean; // Allow text input
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
      risk_tolerance?: number;
      financial_interest?: number;
    };
  }[];
}

const DEEP_DIVE_QUESTIONS: DeepDiveQuestion[] = [
  // ALIGNMENT QUESTIONS
  {
    id: 'dd1',
    category: 'alignment',
    prompt: 'You have a free Sunday. Which would you ACTUALLY do?',
    context: 'Be honest - not what sounds impressive',
    allowCustom: true,
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
    allowCustom: true,
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
    allowCustom: true,
    options: [
      { id: 'a', label: '🔋 Battery Engineer - designing EV powertrains', signals: { engineering: 3, automotive_engineering: 3 } },
      { id: 'b', label: '📊 Business Analyst - market strategy & sales', signals: { commerce: 3, automotive_business: 2 } },
      { id: 'c', label: '💼 CFO - managing Tesla\'s finances', signals: { commerce: 3, clarity: 1 } },
      { id: 'd', label: '🚀 SpaceX Engineer - rockets & aerospace', signals: { engineering: 3, passion: 1 } },
    ]
  },

  // STRESS TEST
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

  // PASSION PROBE
  {
    id: 'dd7',
    category: 'passion_probe',
    prompt: 'Which conversation would you LOVE to have with an expert?',
    allowCustom: true,
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
    allowCustom: true,
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
    allowCustom: true,
    options: [
      { id: 'a', label: '📐 Solving a challenging math/physics problem', signals: { engineering: 3, passion: 2 } },
      { id: 'b', label: '💡 Thinking about business ideas', signals: { commerce: 3, passion: 2 } },
      { id: 'c', label: '🚗 Reading about cars, specs, comparisons', signals: { automotive_business: 2, passion: 1 } },
      { id: 'd', label: '💰 Learning about money, investing, finance', signals: { commerce: 3 } },
      { id: 'e', label: '🎮 Gaming / social media / entertainment', signals: { stress_flag: 1 } },
    ]
  },

  // REALITY CHECK
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
    allowCustom: true,
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
    prompt: 'If you could send a message to yourself 5 years from now, what would it be?',
    allowCustom: true,
    options: [
      { id: 'a', label: '"Trust the process - hard work pays off"', signals: { engineering: 1, clarity: 1 } },
      { id: 'b', label: '"Follow your gut, not others\' expectations"', signals: { commerce: 1, clarity: 2 } },
      { id: 'c', label: '"Take more risks - you\'re capable"', signals: { commerce: 2, passion: 1 } },
      { id: 'd', label: '"Find what you love, money will follow"', signals: { passion: 3, clarity: 2 } },
    ]
  },

  // COMMERCE VALIDATION - Deep dive into business/commerce fit
  {
    id: 'dd16',
    category: 'commerce_validation',
    prompt: 'Which commerce career path excites you MOST?',
    context: 'Be specific about what attracts you',
    allowCustom: true,
    options: [
      { id: 'a', label: '📊 Chartered Accountant (CA) - audits, tax, financial statements', signals: { commerce: 3, financial_interest: 3 } },
      { id: 'b', label: '🏢 MBA + Corporate Job - management, strategy, leadership', signals: { commerce: 3, clarity: 1 } },
      { id: 'c', label: '🚀 Entrepreneur - start my own business/startup', signals: { commerce: 3, risk_tolerance: 3, passion: 2 } },
      { id: 'd', label: '📈 Stock Trader / Investment Banker - markets & trading', signals: { commerce: 3, financial_interest: 3, risk_tolerance: 2 } },
      { id: 'e', label: '🤷 Not sure which specific path', signals: { clarity: -1 } },
    ]
  },
  {
    id: 'dd17',
    category: 'commerce_validation',
    prompt: 'Your friend has ₹10,000 to invest. They ask your advice. You:',
    options: [
      { id: 'a', label: '📈 Get excited - you know exactly what to suggest', signals: { financial_interest: 3, commerce: 2 } },
      { id: 'b', label: '🔍 Research different options before answering', signals: { commerce: 2, clarity: 1 } },
      { id: 'c', label: '🤷 Suggest they ask someone else - not your area', signals: { commerce: -2 } },
      { id: 'd', label: '💰 Tell them to save it in a bank', signals: { risk_tolerance: -1 } },
    ]
  },
  {
    id: 'dd18',
    category: 'commerce_validation',
    prompt: 'Scenario: You start a small business. First month = ₹5,000 loss. What do you do?',
    context: 'This tests entrepreneurial mindset',
    options: [
      { id: 'a', label: '📊 Analyze what went wrong, adjust strategy, try again', signals: { commerce: 3, risk_tolerance: 2, passion: 1 } },
      { id: 'b', label: '😰 Panic - this was a mistake', signals: { stress_flag: 2, risk_tolerance: -2 } },
      { id: 'c', label: '💪 Expected this - first months are always hard', signals: { commerce: 2, risk_tolerance: 3, clarity: 1 } },
      { id: 'd', label: '🚪 Cut losses and close the business', signals: { risk_tolerance: -2, commerce: -1 } },
    ]
  },
  {
    id: 'dd19',
    category: 'commerce_validation',
    prompt: 'Do you understand these terms? Profit margin, ROI, market cap, P/E ratio',
    options: [
      { id: 'a', label: '✅ Yes, I know most/all of them', signals: { financial_interest: 3, commerce: 2 } },
      { id: 'b', label: '📚 Some of them - learning more', signals: { commerce: 1, financial_interest: 1 } },
      { id: 'c', label: '❓ Heard them but don\'t really understand', signals: { financial_interest: -1 } },
      { id: 'd', label: '❌ No idea what these mean', signals: { financial_interest: -2, commerce: -1 } },
    ]
  },
  {
    id: 'dd20',
    category: 'commerce_validation',
    prompt: 'Which book/content would you genuinely read on a weekend?',
    allowCustom: true,
    options: [
      { id: 'a', label: '📘 "Rich Dad Poor Dad" / "Psychology of Money"', signals: { commerce: 3, financial_interest: 2 } },
      { id: 'b', label: '🔧 "How Cars Work" / Engineering textbooks', signals: { engineering: 3 } },
      { id: 'c', label: '🚀 Startup stories - Zerodha, Ola, Swiggy founders', signals: { commerce: 3, passion: 2 } },
      { id: 'd', label: '📱 Social media / entertainment only', signals: { clarity: -1 } },
    ]
  },
  {
    id: 'dd21',
    category: 'commerce_validation',
    prompt: 'CA preparation = 3-4 years, 8 papers, 50% fail rate. Your reaction?',
    context: 'CA is one of the toughest commerce exams',
    options: [
      { id: 'a', label: '💪 Challenge accepted - I can do it', signals: { commerce: 2, clarity: 1 } },
      { id: 'b', label: '🤔 Tough, but if I\'m interested, I\'ll manage', signals: { commerce: 1 } },
      { id: 'c', label: '😰 That sounds even harder than JEE!', signals: { stress_flag: 1 } },
      { id: 'd', label: '🚫 I\'d rather do MBA - shorter path', signals: { commerce: 1, risk_tolerance: -1 } },
    ]
  },
  {
    id: 'dd22',
    category: 'commerce_validation',
    prompt: 'Which scenario sounds more FUN to you?',
    options: [
      { id: 'a', label: '🧮 Analyzing a company\'s financial statements to find hidden value', signals: { financial_interest: 3, commerce: 3 } },
      { id: 'b', label: '⚙️ Debugging a complex engineering problem', signals: { engineering: 3 } },
      { id: 'c', label: '💼 Negotiating a business deal with a client', signals: { commerce: 2, passion: 1 } },
      { id: 'd', label: '🏎️ Test-driving different cars and comparing specs', signals: { automotive_business: 1, automotive_engineering: 1 } },
    ]
  },
  {
    id: 'dd23',
    category: 'commerce_validation',
    prompt: 'If you could shadow someone for a week, who would it be?',
    allowCustom: true,
    options: [
      { id: 'a', label: '🏦 A CA at a Big 4 firm (Deloitte, PwC, EY, KPMG)', signals: { commerce: 3, financial_interest: 2 } },
      { id: 'b', label: '🚀 A startup founder building their company', signals: { commerce: 3, risk_tolerance: 2, passion: 2 } },
      { id: 'c', label: '📈 A stock trader at a hedge fund', signals: { commerce: 2, financial_interest: 3, risk_tolerance: 2 } },
      { id: 'd', label: '🔧 An engineer at Tesla/ISRO', signals: { engineering: 3 } },
      { id: 'e', label: '🏎️ An F1 team principal (like Christian Horner)', signals: { automotive_business: 2, commerce: 1, passion: 1 } },
    ]
  },
  {
    id: 'dd24',
    category: 'commerce_validation',
    prompt: 'You won ₹1 Lakh in a competition. What do you do?',
    options: [
      { id: 'a', label: '📈 Invest in stocks/mutual funds', signals: { financial_interest: 3, risk_tolerance: 2 } },
      { id: 'b', label: '💼 Use it to start a small business', signals: { commerce: 3, risk_tolerance: 3 } },
      { id: 'c', label: '🎓 Save for future education (MBA/abroad)', signals: { commerce: 1, clarity: 1 } },
      { id: 'd', label: '🎁 Buy something I\'ve wanted + save the rest', signals: { risk_tolerance: -1 } },
      { id: 'e', label: '🔧 Buy tools/equipment for a hobby project', signals: { engineering: 2 } },
    ]
  },
  {
    id: 'dd25',
    category: 'commerce_validation',
    prompt: 'Final commerce check: What genuinely interests you about business/commerce?',
    context: 'Write in your own words if the options don\'t fit',
    allowCustom: true,
    options: [
      { id: 'a', label: '💰 The money - high earning potential', signals: { commerce: 1 } },
      { id: 'b', label: '🧠 The strategy - understanding how companies grow', signals: { commerce: 3, passion: 2 } },
      { id: 'c', label: '📊 The numbers - analyzing data, finding patterns', signals: { financial_interest: 3, commerce: 2 } },
      { id: 'd', label: '🤝 The people - networking, negotiations, deals', signals: { commerce: 2, passion: 1 } },
      { id: 'e', label: '🤷 I\'m not actually that interested in commerce', signals: { commerce: -3, clarity: 2 } },
    ]
  },

  // AUTOMOTIVE DEALERSHIP/RETAIL - Specific questions for car business interest
  {
    id: 'dd26',
    category: 'commerce_validation',
    prompt: '🚗 Imagine you own a car dealership. What would EXCITE you most about the job?',
    allowCustom: true,
    options: [
      { id: 'a', label: '💰 Negotiating deals - buying cars at ₹8L, selling at ₹10L', signals: { automotive_business: 3, commerce: 2, passion: 1 } },
      { id: 'b', label: '🤝 Meeting customers, understanding what they want', signals: { automotive_business: 2, commerce: 2 } },
      { id: 'c', label: '📊 Managing inventory - which cars sell fast, which don\'t', signals: { automotive_business: 2, financial_interest: 2 } },
      { id: 'd', label: '🏢 Building a brand - "People should think of MY showroom first"', signals: { automotive_business: 3, passion: 2 } },
      { id: 'e', label: '🤷 Honestly, running a dealership doesn\'t excite me much', signals: { automotive_business: -2 } },
    ]
  },
  {
    id: 'dd27',
    category: 'commerce_validation',
    prompt: 'A customer wants to buy a car but their budget is ₹2L short. What would you do?',
    context: 'This tests your sales/business mindset',
    options: [
      { id: 'a', label: '💳 Explain financing options - EMI, loan, exchange bonus', signals: { automotive_business: 3, financial_interest: 2 } },
      { id: 'b', label: '🚗 Show them a different car within budget', signals: { automotive_business: 2, commerce: 1 } },
      { id: 'c', label: '📞 Tell them to come back when they have the money', signals: { automotive_business: -1 } },
      { id: 'd', label: '🤝 Negotiate with your manager for a special discount', signals: { automotive_business: 2, commerce: 2, risk_tolerance: 1 } },
    ]
  },
  {
    id: 'dd28',
    category: 'commerce_validation',
    prompt: 'Which automotive business sounds MOST interesting to you?',
    allowCustom: true,
    options: [
      { id: 'a', label: '🏢 New car dealership (Maruti, Hyundai, Tata authorized)', signals: { automotive_business: 3, commerce: 2 } },
      { id: 'b', label: '🔄 Used car business (Cars24, Spinny style)', signals: { automotive_business: 3, risk_tolerance: 2, commerce: 2 } },
      { id: 'c', label: '🔧 Car accessories & modification shop', signals: { automotive_engineering: 2, automotive_business: 1 } },
      { id: 'd', label: '📱 Car comparison website/app (like CarDekho, CarWale)', signals: { automotive_business: 2, commerce: 2, passion: 1 } },
      { id: 'e', label: '🏎️ Luxury/sports car imports (Porsche, Ferrari)', signals: { automotive_business: 3, passion: 2 } },
    ]
  },
  {
    id: 'dd29',
    category: 'commerce_validation',
    prompt: 'Do you know the approximate on-road price of a Maruti Swift vs Hyundai i20 vs Tata Altroz?',
    context: 'Testing car market awareness',
    options: [
      { id: 'a', label: '✅ Yes! I follow car prices regularly', signals: { automotive_business: 3, passion: 2 } },
      { id: 'b', label: '🤔 Roughly - I know Swift is around ₹7-9L', signals: { automotive_business: 2, passion: 1 } },
      { id: 'c', label: '❓ Not really - I know the cars but not prices', signals: { automotive_engineering: 1 } },
      { id: 'd', label: '❌ No idea - I don\'t follow car prices', signals: { automotive_business: -1 } },
    ]
  },
  {
    id: 'dd30',
    category: 'commerce_validation',
    prompt: 'Final automotive question: If you could work at any car company, which role?',
    allowCustom: true,
    options: [
      { id: 'a', label: '🏢 Sales Manager at a dealership - hitting targets, managing team', signals: { automotive_business: 3, commerce: 2 } },
      { id: 'b', label: '📊 Regional Business Head - managing 10+ dealerships', signals: { automotive_business: 3, commerce: 3, clarity: 1 } },
      { id: 'c', label: '🔧 R&D Engineer at Tata Motors - designing new cars', signals: { automotive_engineering: 3, engineering: 3 } },
      { id: 'd', label: '📈 Marketing Head - launching new models, advertising', signals: { automotive_business: 2, commerce: 2, passion: 1 } },
      { id: 'e', label: '🏎️ Start my own multi-brand dealership someday', signals: { automotive_business: 3, risk_tolerance: 3, commerce: 2, passion: 2 } },
    ]
  },

  // GROUND REALITY CHECK - Based on real conversation insights
  {
    id: 'dd31',
    category: 'commerce_validation',
    prompt: '📚 Business mindset requires DEEP learning - finance, marketing, negotiation, people skills. Your reaction?',
    context: 'Be honest about your learning appetite',
    allowCustom: true,
    options: [
      { id: 'a', label: '🔥 Excited! I love learning new things, especially about business', signals: { commerce: 3, passion: 3, clarity: 2 } },
      { id: 'b', label: '👍 Ready to learn if it leads somewhere good', signals: { commerce: 2, clarity: 1 } },
      { id: 'c', label: '😐 I\'ll learn what\'s necessary, not more', signals: { commerce: 1, passion: -1 } },
      { id: 'd', label: '😰 That sounds like a lot of effort...', signals: { commerce: -1, stress_flag: 2 } },
    ]
  },
  {
    id: 'dd32',
    category: 'commerce_validation',
    prompt: '📉 Hard truth: Business is volatile. Aaj profit, kal loss. Kabhi ₹1L kamao, kabhi ₹50K loss. Ready?',
    context: 'This is the reality of business/sales',
    options: [
      { id: 'a', label: '💪 Yes! That\'s what makes it exciting - the ups and downs', signals: { risk_tolerance: 3, commerce: 3, passion: 2 } },
      { id: 'b', label: '🤔 I understand - need to be mentally prepared', signals: { risk_tolerance: 2, clarity: 1 } },
      { id: 'c', label: '😬 That\'s scary... I prefer stability', signals: { risk_tolerance: -2, stress_flag: 2 } },
      { id: 'd', label: '🤷 Never thought about this seriously', signals: { clarity: -1 } },
    ]
  },
  {
    id: 'dd33',
    category: 'commerce_validation',
    prompt: '🗣️ In sales, you need to CONVINCE people to buy. Some will say NO 10 times. How do you feel about this?',
    allowCustom: true,
    options: [
      { id: 'a', label: '😎 I enjoy convincing people - it\'s a skill I want to master', signals: { commerce: 3, passion: 2, automotive_business: 2 } },
      { id: 'b', label: '👍 I can learn to handle rejection, it\'s part of the game', signals: { commerce: 2, risk_tolerance: 1 } },
      { id: 'c', label: '😣 Rejection hurts me - I take it personally', signals: { stress_flag: 2, commerce: -1 } },
      { id: 'd', label: '🤔 Never tried sales, don\'t know how I\'d react', signals: { clarity: -1 } },
    ]
  },
  {
    id: 'dd34',
    category: 'commerce_validation',
    prompt: '🎯 Reality: College khatam hote hi showroom nahi milega. Starting from ZERO. Efforts lagane padenge. Your feeling?',
    context: 'This is the honest truth about any career',
    options: [
      { id: 'a', label: '🔥 EXCITING! I\'m ready to build from scratch', signals: { passion: 3, commerce: 3, risk_tolerance: 2, clarity: 2 } },
      { id: 'b', label: '👍 I understand - everyone starts somewhere', signals: { commerce: 2, clarity: 1 } },
      { id: 'c', label: '😰 Scary... I hoped for an easier path', signals: { stress_flag: 2, clarity: -1 } },
      { id: 'd', label: '🤔 I expected some family support to start', signals: { risk_tolerance: -1 } },
    ]
  },
  {
    id: 'dd35',
    category: 'commerce_validation',
    prompt: '🔍 Opportunities dhundna TERA skill hoga. Koi spoon-feed nahi karega. Proactive banana padega. Ready?',
    options: [
      { id: 'a', label: '💯 Yes! I\'ll find opportunities myself - network, apply, hustle', signals: { commerce: 3, passion: 2, clarity: 2 } },
      { id: 'b', label: '👍 I can be proactive with some guidance', signals: { commerce: 2 } },
      { id: 'c', label: '😬 I usually wait for opportunities to come to me', signals: { commerce: -1, passion: -1 } },
      { id: 'd', label: '🤷 I expect placements/campus recruitment to help', signals: { clarity: -1 } },
    ]
  },
  {
    id: 'dd36',
    category: 'commerce_validation',
    prompt: '🏢 Would you do an UNPAID internship at a car dealership for 2-3 months to learn the ground reality?',
    context: 'This is about your willingness to invest time to learn',
    allowCustom: true,
    options: [
      { id: 'a', label: '✅ Absolutely! Experience > Money at this stage', signals: { commerce: 3, passion: 3, automotive_business: 3, clarity: 2 } },
      { id: 'b', label: '🤔 Yes, if it leads to real learning and connections', signals: { commerce: 2, automotive_business: 2 } },
      { id: 'c', label: '😬 Unpaid? I\'d prefer at least some stipend', signals: { commerce: 1 } },
      { id: 'd', label: '❌ No way - my time has value', signals: { commerce: -1, automotive_business: -1 } },
    ]
  },
  {
    id: 'dd37',
    category: 'commerce_validation',
    prompt: '📋 Challenge: Pick any car (Creta/Thar/Nexon) and write: price, competitors, why people buy it. Would you enjoy this?',
    allowCustom: true,
    options: [
      { id: 'a', label: '🔥 YES! I already know this stuff, sounds fun!', signals: { automotive_business: 3, passion: 3, commerce: 2 } },
      { id: 'b', label: '👍 Interesting! I\'d research and figure it out', signals: { automotive_business: 2, commerce: 2 } },
      { id: 'c', label: '😐 I could do it, but it\'s not exciting', signals: { automotive_business: 1 } },
      { id: 'd', label: '😴 Sounds boring - not my thing', signals: { automotive_business: -2, commerce: -1 } },
    ]
  },
  {
    id: 'dd38',
    category: 'commerce_validation',
    prompt: '📱 Challenge: Create a simple Instagram Reel idea about "cars + pricing + trends". Your reaction?',
    allowCustom: true,
    options: [
      { id: 'a', label: '🎬 Already have ideas! "Top 5 cars under ₹10L" type content', signals: { automotive_business: 3, passion: 2, commerce: 2 } },
      { id: 'b', label: '🤔 Interesting idea - I\'d think about it and try', signals: { automotive_business: 2, commerce: 1 } },
      { id: 'c', label: '😐 Not really into content creation', signals: { automotive_business: 0 } },
      { id: 'd', label: '📸 I prefer watching reels, not making them', signals: { passion: -1 } },
    ]
  },
  {
    id: 'dd39',
    category: 'commerce_validation',
    prompt: '💼 If you had ₹1 Lakh to start a small business TODAY, what would you do?',
    context: 'Write your own idea if the options don\'t fit',
    allowCustom: true,
    options: [
      { id: 'a', label: '🚗 Car accessories / detailing / small service business', signals: { automotive_business: 3, commerce: 3, risk_tolerance: 2 } },
      { id: 'b', label: '📱 Reselling / dropshipping / online business', signals: { commerce: 3, risk_tolerance: 2 } },
      { id: 'c', label: '🤔 I\'d research options first before deciding', signals: { commerce: 2, clarity: 1 } },
      { id: 'd', label: '💰 I\'d save it / invest it, not start a business', signals: { risk_tolerance: -1, financial_interest: 1 } },
      { id: 'e', label: '🤷 I have no idea what business to start', signals: { clarity: -2 } },
    ]
  },
  {
    id: 'dd40',
    category: 'commerce_validation',
    prompt: '⏰ Final reality check: Success takes TIME. 5-10 years of consistent effort. No shortcuts. How does this feel?',
    options: [
      { id: 'a', label: '💪 I\'m in for the long game - patience and persistence', signals: { commerce: 3, clarity: 3, passion: 2 } },
      { id: 'b', label: '👍 I understand - good things take time', signals: { commerce: 2, clarity: 1 } },
      { id: 'c', label: '😰 5-10 years is too long... I want faster results', signals: { stress_flag: 2, clarity: -1 } },
      { id: 'd', label: '🤔 I never thought about the long-term timeline', signals: { clarity: -2 } },
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
  risk_tolerance: number;
  financial_interest: number;
}

interface AnswerData {
  selectedOption?: string;
  customText?: string;
}

// Webhook URL
const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || '';

export default function DeepDivePage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerData>>({});
  const [showResults, setShowResults] = useState(false);
  const [direction, setDirection] = useState(1);
  const [showCustomInput, setShowCustomInput] = useState<Record<string, boolean>>({});
  
  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = DEEP_DIVE_QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / DEEP_DIVE_QUESTIONS.length) * 100;

  const handleSelect = (optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { 
        ...prev[currentQuestion.id],
        selectedOption: optionId 
      }
    }));
    // Hide custom input when an option is selected
    setShowCustomInput(prev => ({ ...prev, [currentQuestion.id]: false }));
  };

  const handleCustomTextChange = (text: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { 
        ...prev[currentQuestion.id],
        customText: text 
      }
    }));
  };

  const toggleCustomInput = () => {
    setShowCustomInput(prev => ({ 
      ...prev, 
      [currentQuestion.id]: !prev[currentQuestion.id] 
    }));
    // Clear selected option when switching to custom
    if (!showCustomInput[currentQuestion.id]) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: { 
          ...prev[currentQuestion.id],
          selectedOption: undefined 
        }
      }));
    }
  };

  const hasAnswer = () => {
    const answer = answers[currentQuestion.id];
    if (!answer) return false;
    if (showCustomInput[currentQuestion.id]) {
      return answer.customText && answer.customText.trim().length > 0;
    }
    return !!answer.selectedOption;
  };

  const handleNext = async () => {
    if (currentIndex < DEEP_DIVE_QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    } else {
      // Submit to webhook before showing results
      await submitToWebhook();
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
      risk_tolerance: 0,
      financial_interest: 0,
    };

    Object.entries(answers).forEach(([qId, answerData]) => {
      if (!answerData.selectedOption) return; // Skip custom text answers for scoring
      
      const question = DEEP_DIVE_QUESTIONS.find(q => q.id === qId);
      if (!question) return;
      
      const option = question.options.find(o => o.id === answerData.selectedOption);
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

  const submitToWebhook = async () => {
    if (!WEBHOOK_URL) {
      console.log('Webhook URL not configured');
      return;
    }

    setIsSubmitting(true);

    try {
      const results = calculateResults();
      
      // Prepare answers for submission
      const formattedAnswers: Record<string, string> = {};
      DEEP_DIVE_QUESTIONS.forEach(q => {
        const answer = answers[q.id];
        if (answer?.customText) {
          formattedAnswers[q.id] = `[CUSTOM] ${answer.customText}`;
        } else if (answer?.selectedOption) {
          const option = q.options.find(o => o.id === answer.selectedOption);
          formattedAnswers[q.id] = option?.label || answer.selectedOption;
        }
      });

      const payload = {
        type: 'deep_dive',
        studentName: 'Gagan',
        reportId: reportId,
        timestamp: new Date().toISOString(),
        commerceScore: results.commerce,
        engineeringScore: results.engineering,
        automotiveBusinessScore: results.automotive_business,
        automotiveEngineeringScore: results.automotive_engineering,
        stressFlags: results.stress_flags,
        clarityScore: results.clarity,
        passionScore: results.passion,
        riskTolerance: results.risk_tolerance,
        financialInterest: results.financial_interest,
        commerceVerdict: results.commerce >= 20 && results.financial_interest >= 5 ? 'STRONG' : 
                         results.commerce >= 15 ? 'MODERATE' : 'WEAK',
        primaryPath: results.commerce > results.engineering ? 'Commerce' : 'Engineering',
        fullAnswersJSON: JSON.stringify(formattedAnswers),
        fullResultsJSON: JSON.stringify(results),
      };

      const formBody = Object.entries(payload)
        .map(([key, value]) => 
          encodeURIComponent(key) + '=' + encodeURIComponent(String(value))
        )
        .join('&');

      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody,
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Webhook error:', error);
      setIsSubmitted(true); // Still show as submitted even if there's an error
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadJSON = () => {
    const results = calculateResults();
    
    const formattedAnswers: Record<string, { question: string; answer: string; isCustom: boolean }> = {};
    DEEP_DIVE_QUESTIONS.forEach(q => {
      const answer = answers[q.id];
      if (answer?.customText) {
        formattedAnswers[q.id] = {
          question: q.prompt,
          answer: answer.customText,
          isCustom: true
        };
      } else if (answer?.selectedOption) {
        const option = q.options.find(o => o.id === answer.selectedOption);
        formattedAnswers[q.id] = {
          question: q.prompt,
          answer: option?.label || answer.selectedOption,
          isCustom: false
        };
      }
    });

    const exportData = {
      type: 'deep_dive_quiz',
      studentName: 'Gagan',
      reportId: reportId,
      timestamp: new Date().toISOString(),
      scores: results,
      analysis: {
        primaryPath: results.commerce > results.engineering ? 'Commerce/Business' : 'Engineering/JEE',
        automotivePath: results.automotive_business > results.automotive_engineering ? 'Automotive Business' : 'Automotive Engineering',
        stressLevel: results.stress_flags > 5 ? 'High' : results.stress_flags > 2 ? 'Moderate' : 'Low',
      },
      answers: formattedAnswers,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gagan_deep_dive_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'alignment': return <Target className="w-5 h-5" />;
      case 'stress_test': return <Shield className="w-5 h-5" />;
      case 'passion_probe': return <Heart className="w-5 h-5" />;
      case 'reality_check': return <Brain className="w-5 h-5" />;
      case 'values': return <Lightbulb className="w-5 h-5" />;
      case 'commerce_validation': return <Zap className="w-5 h-5" />;
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
      case 'commerce_validation': return 'from-yellow-500 to-yellow-500/50';
      default: return 'from-lavender to-lavender/50';
    }
  };

  if (showResults) {
    const results = calculateResults();

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

          {/* Submission Status */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {isSubmitting ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-ocean/20 text-ocean">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Saving to records...</span>
              </div>
            ) : isSubmitted ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Results saved!</span>
              </div>
            ) : null}
          </div>

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
                    style={{ width: `${Math.min((results.commerce / 50) * 100, 100)}%` }}
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
                    style={{ width: `${Math.min((results.engineering / 50) * 100, 100)}%` }}
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

          {/* Automotive Interest */}
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
                ? '💼 Gagan views cars from a BUSINESS lens - pricing, sales, market.'
                : results.automotive_engineering > results.automotive_business
                ? '🔧 Gagan is interested in HOW cars work - engines, design, technology.'
                : '🤔 Balanced interest - could explore both paths.'
              }
            </p>
          </div>

          {/* Custom Answers Section */}
          {Object.entries(answers).some(([, a]) => a.customText) && (
            <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/30 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">✍️ Custom Answers</h2>
              <div className="space-y-4">
                {DEEP_DIVE_QUESTIONS.map(q => {
                  const answer = answers[q.id];
                  if (!answer?.customText) return null;
                  return (
                    <div key={q.id} className="p-4 rounded-xl bg-white/5">
                      <p className="text-white/60 text-sm mb-1">{q.prompt}</p>
                      <p className="text-white italic">"{answer.customText}"</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stress & Clarity */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className={`p-6 rounded-2xl border ${results.stress_flags > 5 ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
              <h3 className="text-lg font-bold text-white mb-2">Stress Indicators</h3>
              <p className={`text-3xl font-bold ${results.stress_flags > 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                {results.stress_flags > 5 ? '⚠️ High' : results.stress_flags > 2 ? '😐 Moderate' : '✅ Low'}
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

          {/* Commerce Readiness Section */}
          <div className="p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">💼 Commerce Readiness Check</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-2xl font-bold text-yellow-400">{results.financial_interest}</p>
                <p className="text-white/60 text-xs">Financial Interest</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-2xl font-bold text-orange-400">{results.risk_tolerance}</p>
                <p className="text-white/60 text-xs">Risk Tolerance</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-2xl font-bold text-ocean">{results.commerce}</p>
                <p className="text-white/60 text-xs">Commerce Score</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-2xl font-bold text-pink-400">{results.passion}</p>
                <p className="text-white/60 text-xs">Passion Level</p>
              </div>
            </div>
            
            {/* Commerce Verdict */}
            <div className="p-4 rounded-xl bg-white/5 mt-4">
              <h4 className="font-semibold text-white mb-2">Commerce Verdict:</h4>
              {results.commerce >= 20 && results.financial_interest >= 5 ? (
                <div className="text-emerald-400">
                  <p className="font-medium">✅ STRONG Commerce Fit!</p>
                  <p className="text-white/70 text-sm mt-1">
                    High commerce score ({results.commerce}) + strong financial interest ({results.financial_interest}) = Commerce is likely the right path!
                    {results.risk_tolerance >= 5 && ' Bonus: Good risk tolerance for entrepreneurship.'}
                  </p>
                </div>
              ) : results.commerce >= 15 && results.financial_interest >= 3 ? (
                <div className="text-yellow-400">
                  <p className="font-medium">🤔 Moderate Commerce Fit</p>
                  <p className="text-white/70 text-sm mt-1">
                    Some commerce interest detected, but needs more exploration. Consider trying basic CA/finance courses to test genuine interest.
                  </p>
                </div>
              ) : (
                <div className="text-red-400">
                  <p className="font-medium">⚠️ Weak Commerce Signals</p>
                  <p className="text-white/70 text-sm mt-1">
                    Low commerce ({results.commerce}) and financial interest ({results.financial_interest}) scores suggest commerce may NOT be the right fit. 
                    {results.engineering > results.commerce ? ' Engineering scores are actually higher!' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadJSON}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <Download className="w-5 h-5" />
              Download JSON Report
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/reports/${reportId}`)}
              className="px-6 py-3 rounded-xl bg-ocean text-white hover:bg-ocean/80 transition-all"
            >
              ← Back to Full Report
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
                    answers[currentQuestion.id]?.selectedOption === option.id && !showCustomInput[currentQuestion.id]
                      ? 'bg-ocean/20 border-ocean text-white'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion.id]?.selectedOption === option.id && !showCustomInput[currentQuestion.id]
                        ? 'border-ocean bg-ocean'
                        : 'border-white/30'
                    }`}>
                      {answers[currentQuestion.id]?.selectedOption === option.id && !showCustomInput[currentQuestion.id] && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span>{option.label}</span>
                  </div>
                </motion.button>
              ))}

              {/* Custom Input Toggle */}
              {currentQuestion.allowCustom && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleCustomInput}
                    className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                      showCustomInput[currentQuestion.id]
                        ? 'bg-purple-500/20 border-purple-500 text-white'
                        : 'bg-white/5 border-dashed border-white/20 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        showCustomInput[currentQuestion.id] ? 'border-purple-500 bg-purple-500' : 'border-white/30'
                      }`}>
                        {showCustomInput[currentQuestion.id] && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span>✍️ I want to write my own answer...</span>
                    </div>
                  </motion.button>

                  {/* Custom Text Input */}
                  {showCustomInput[currentQuestion.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2"
                    >
                      <textarea
                        value={answers[currentQuestion.id]?.customText || ''}
                        onChange={(e) => handleCustomTextChange(e.target.value)}
                        placeholder="Write your own answer here... Be as detailed as you want!"
                        className="w-full p-4 rounded-xl bg-white/10 border-2 border-purple-500/50 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500 min-h-[120px] resize-none"
                        autoFocus
                      />
                    </motion.div>
                  )}
                </>
              )}
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
            whileHover={{ scale: hasAnswer() ? 1.05 : 1 }}
            whileTap={{ scale: hasAnswer() ? 0.95 : 1 }}
            onClick={handleNext}
            disabled={!hasAnswer()}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              hasAnswer()
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
