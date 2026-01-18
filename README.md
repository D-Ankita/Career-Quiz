# Career Discovery Game 🎮

A gamified career discovery quiz for 10th-grade students (India) to help them decide their 11th stream and whether JEE coaching is suitable.

## Features

- 🎯 **Gamified Experience**: No exam vibes! Situational questions, card-based choices, and friendly copy
- 📊 **Smart Scoring**: Tracks 6 career paths + stress/routine tolerance meters
- 🔒 **Parent Dashboard**: PIN-protected detailed analysis view
- 💾 **Save & Resume**: Progress saved locally, resume anytime
- 📥 **Export Results**: Download results as JSON

## Career Tracks Scored

1. **JEE/PCM** - Engineering path
2. **PCB/Medical** - Medical/Biology path
3. **Commerce** - Business/Finance path
4. **Coding/IT** - Software/Tech path
5. **Design/Creative** - Arts/Design path
6. **Govt/Defense** - Civil services path

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── components/          # React components
│   ├── NavigationButtons.tsx
│   ├── ParentDashboard.tsx
│   ├── PinModal.tsx
│   ├── ProgressBar.tsx
│   ├── QuestionCard.tsx
│   ├── QuizWizard.tsx
│   └── ResultCards.tsx
├── data/
│   └── questions.json   # All 32 questions with scoring
├── lib/
│   ├── scoring.ts       # Scoring logic & decision rules
│   └── storage.ts       # localStorage utilities
├── types/
│   └── index.ts         # TypeScript types
├── quiz/
│   └── page.tsx         # Quiz page
├── results/
│   └── page.tsx         # Results page
├── globals.css          # Global styles
├── layout.tsx           # Root layout
└── page.tsx             # Landing page
```

## Scoring Model

### Track Scores
Each answer adds points to one or more career tracks. Scores are normalized to percentages.

### Meters (0-10 scale)
- **Routine Tolerance**: Can handle structured daily schedules
- **Stress Tolerance**: Can handle exam pressure and rankings
- **Clarity**: Has clear career direction

### Confidence Score
`10 - (countMaybe × 1) - (countStrongNegatives × 2)`

### Risk Flags
- "Routine mismatch for JEE"
- "High test stress"
- "Low concept persistence"
- "Low clarity"
- "External motivation only"

### JEE Recommendation Rules

| Recommendation | Conditions |
|---------------|------------|
| **GO** | jee_pcm ≥ 15 AND routineTolerance ≥ 6 AND stressTolerance ≥ 5 AND Q21/Q22 not negative |
| **MAYBE** | Mid scores or "maybe" on routine questions |
| **NO** | Routine mismatch flags OR low persistence OR negative Q21/Q22 |

## Parent Access

Default PIN: `2580`

The parent dashboard shows:
- All track scores (raw + percentage)
- Detailed meter readings
- Risk flags with explanations
- Full results export

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Storage**: localStorage (no backend required)

## License

MIT
