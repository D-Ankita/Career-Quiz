# 🎯 Career Discovery Quiz - AI-Powered Career Counselling

A **gamified, AI-assisted career discovery platform** for Indian students to find their ideal career path. Built with modern web technologies and designed to feel like a game, not an exam.

🔗 **Live Demo**: [career-quiz-ten.vercel.app](https://career-quiz-ten.vercel.app)

---

## ✨ Features

### 🎮 Gamified Experience
- **40+ situational questions** - No "What do you want to become?" boring stuff
- **Card-based choices** with visual icons
- **This-or-that** style questions that reveal true interests
- **Friendly copy** - feels like chatting with a friend

### 📊 Smart Multi-Track Scoring
Scores across **18 career tracks**:
- Engineering (JEE/PCM)
- Medical (PCB/NEET)
- Commerce & Finance
- Coding/IT
- Design/Creative
- UPSC/Civil Services
- Armed Forces (NDA/CDS)
- Aviation & Aerospace
- Maritime/Navy
- Law/Legal
- Media & Journalism
- Psychology & Counseling
- Sports & Fitness
- Research & Academia
- Agriculture & AgriTech
- Hospitality Management
- **Automotive Business** ⭐ (Dealerships, Sales)
- **Automotive Engineering** ⭐ (R&D, Design)

### 🧠 Intelligent Analysis
- **Stress Tolerance** meter
- **Routine Tolerance** meter
- **Clarity Score** - How sure are they about their path?
- **Confidence Score** - Based on answer consistency
- **Risk Flags** - Potential concerns highlighted

### 🚗 Deep Dive Quiz (40 Questions)
A follow-up assessment for deeper analysis:
- **Alignment Check** - True interests vs perceived interests
- **Stress Test** - How they handle pressure (MBA/CA context)
- **Passion Probe** - What genuinely excites them
- **Reality Check** - Confronting real motivations
- **Values Assessment** - What matters most in a career
- **Commerce Validation** - Is business the right fit?
- **Automotive Dealership** - Interest in car business
- **Ground Reality** - Ready for real-world challenges?

### 📤 Data Export & Webhook
- **Auto-submit to Google Sheets** on quiz completion
- **Download JSON reports** with full answers
- **All answers saved** - not just scores
- **Parent/Counselor view** with detailed breakdown

### 🌓 User Experience
- **Dark/Light theme toggle** (Dark default)
- **Mobile-first responsive design**
- **Save & Resume** - Progress saved locally
- **No login required** - Privacy-focused

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/D-Ankita/Career-Quiz.git
cd Career-Quiz

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
app/
├── components/
│   ├── NavigationButtons.tsx
│   ├── ParentDashboard.tsx    # Detailed analysis view
│   ├── ProfileCollector.tsx   # Name, education level
│   ├── ProgressBar.tsx
│   ├── QuestionCard.tsx
│   ├── QuizWizard.tsx         # Main quiz orchestrator
│   ├── ResultCards.tsx        # Student results view
│   └── ThemeToggle.tsx        # Dark/Light toggle
├── data/
│   └── questions.json         # 40+ main quiz questions
├── deep-dive/
│   └── [id]/page.tsx          # 40-question deep dive quiz
├── reports/
│   └── [id]/page.tsx          # Individual report pages
├── lib/
│   ├── scoring.ts             # Scoring algorithms
│   ├── storage.ts             # localStorage utilities
│   └── webhook.ts             # Google Sheets integration
├── types/
│   └── index.ts               # TypeScript definitions
├── quiz/page.tsx              # Main quiz page
├── results/page.tsx           # Results display
├── globals.css                # Tailwind + custom styles
├── layout.tsx                 # Root layout with theme
└── page.tsx                   # Landing page
```

---

## 📊 Scoring Model

### Track Scores
Each answer adds points to one or more career tracks. Final scores are normalized to percentages for easy comparison.

### Meters (0-10 scale)
| Meter | What it measures |
|-------|-----------------|
| Routine Tolerance | Can handle structured daily schedules |
| Stress Tolerance | Can handle exam pressure and uncertainty |
| Clarity | Has clear career direction |
| Confidence | Answer consistency and self-assurance |

### Deep Dive Scores (40 questions)
| Score | What it measures |
|-------|-----------------|
| Commerce | Overall business/commerce interest |
| Engineering | Technical/engineering interest |
| Automotive Business | Car sales, dealerships, marketing |
| Automotive Engineering | Car design, R&D, mechanics |
| Financial Interest | Interest in money/finance topics |
| Risk Tolerance | Comfort with business uncertainty |
| Passion | Genuine excitement level |

### Risk Flags
- "Routine mismatch for chosen path"
- "High test stress"
- "Low concept persistence"
- "Low clarity - needs exploration"
- "External motivation only"

---

## 📋 Google Sheets Integration

Results auto-submit to Google Sheets for data collection. See `WEBHOOK_SETUP.md` for setup instructions.

### Data Collected
- Student profile (name, education level)
- All track scores
- Top 3 recommendations
- Stream recommendation
- All meter readings
- Risk flags
- **Full answers JSON** - Every answer to every question
- **Full results JSON** - Complete analysis

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework (App Router) |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations |
| **Lucide React** | Icons |
| **localStorage** | Client-side persistence |
| **Google Apps Script** | Webhook for data collection |
| **Vercel** | Hosting & deployment |

---

## 🎯 Use Cases

1. **Career Counselors** - Use as assessment tool before counseling sessions
2. **Schools** - Integrate into career guidance programs
3. **Parents** - Understand child's genuine interests
4. **Students** - Self-discovery without pressure

---

## 📈 Future Roadmap

- [ ] Multiple language support (Hindi, regional)
- [ ] AI-generated personalized career paths
- [ ] Integration with course/college databases
- [ ] Psychometric assessment layer
- [ ] Parent mobile app for reports

---

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines before submitting PRs.

---

## 📄 License

MIT License - Feel free to use for educational purposes.

---

## 🙏 Credits

Built with ❤️ for helping students find their true calling.

**Developer**: [Ankita Dodamani](https://github.com/D-Ankita)
