'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import NavigationButtons from './NavigationButtons';
import ProfileCollector from './ProfileCollector';
import { Question, UserAnswers, QuestionsData, UserProfile } from '@/app/types';
import { saveQuizProgress, getSavedState, clearQuizProgress, saveQuizResults, saveUserProfile, getSavedProfile } from '@/app/lib/storage';
import { calculateResults, filterQuestions } from '@/app/lib/scoring';
import { submitToWebhook } from '@/app/lib/webhook';
import questionsData from '@/app/data/questions.json';

export default function QuizWizard() {
  const router = useRouter();
  const data = questionsData as QuestionsData;
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileCollector, setShowProfileCollector] = useState(true);

  // Load saved state on mount
  useEffect(() => {
    const savedState = getSavedState();
    const savedProfile = getSavedProfile();
    
    if (savedState && savedProfile) {
      setUserProfile(savedProfile);
      setCurrentIndex(savedState.currentQuestion);
      setAnswers(savedState.answers);
      setShowProfileCollector(false);
      
      // Filter questions based on profile
      const filtered = filterQuestions(data.questions, savedProfile);
      setQuestions(filtered);
    } else if (savedProfile) {
      // Has profile but no quiz progress
      setUserProfile(savedProfile);
      const filtered = filterQuestions(data.questions, savedProfile);
      setQuestions(filtered);
      setShowProfileCollector(false);
    }
    
    setIsLoading(false);
  }, [data.questions]);

  // Auto-save on change
  useEffect(() => {
    if (!isLoading && userProfile && !showProfileCollector) {
      saveQuizProgress(currentIndex, answers, userProfile);
    }
  }, [currentIndex, answers, isLoading, userProfile, showProfileCollector]);

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    saveUserProfile(profile);
    
    // Filter questions based on profile
    const filtered = filterQuestions(data.questions, profile);
    setQuestions(filtered);
    setShowProfileCollector(false);
  };

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const handleSelect = useCallback((optionId: string) => {
    if (!currentQuestion) return;
    
    setAnswers(prev => {
      if (currentQuestion.type === 'multi') {
        const currentSelections = Array.isArray(prev[currentQuestion.id]) 
          ? prev[currentQuestion.id] as string[] 
          : [];
        
        if (currentSelections.includes(optionId)) {
          return {
            ...prev,
            [currentQuestion.id]: currentSelections.filter(id => id !== optionId)
          };
        } else {
          const max = currentQuestion.multiSelectMax || data.meta.multiSelectMaxDefault;
          if (currentSelections.length < max) {
            return {
              ...prev,
              [currentQuestion.id]: [...currentSelections, optionId]
            };
          }
          return prev;
        }
      } else {
        return {
          ...prev,
          [currentQuestion.id]: optionId
        };
      }
    });
  }, [currentQuestion, data.meta.multiSelectMaxDefault]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleNext = useCallback(async () => {
    if (!userProfile) return;
    
    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    } else {
      // Calculate and save results
      const results = calculateResults(answers, questions, userProfile);
      saveQuizResults(results, answers);
      clearQuizProgress();
      
      // Auto-submit to Google Sheets in the background
      submitToWebhook(results, answers).then(result => {
        console.log('Auto-submit result:', result.message);
      }).catch(err => {
        console.error('Auto-submit failed:', err);
      });
      
      router.push('/results');
    }
  }, [currentIndex, questions, answers, router, userProfile]);

  const handleSaveExit = useCallback(() => {
    if (userProfile) {
      saveQuizProgress(currentIndex, answers, userProfile);
    }
    router.push('/');
  }, [currentIndex, answers, router, userProfile]);

  const hasAnswer = currentQuestion?.type === 'multi'
    ? Array.isArray(currentAnswer) && currentAnswer.length > 0
    : !!currentAnswer;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-ocean border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show profile collector if no profile
  if (showProfileCollector || !userProfile) {
    return (
      <ProfileCollector 
        onComplete={handleProfileComplete}
        initialProfile={userProfile || undefined}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col py-8 md:py-12">
      {/* Welcome message */}
      <div className="text-center mb-4 px-4">
        <p className="text-white/60 text-sm">
          Hey <span className="text-ocean font-medium">{userProfile.name}</span>! Let's discover your path ✨
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8 md:mb-12">
        <ProgressBar
          current={currentIndex + 1}
          total={questions.length}
          round={currentQuestion.round}
        />
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center">
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={currentAnswer}
          onSelect={handleSelect}
          direction={direction}
        />
      </div>

      {/* Multi-select indicator */}
      {currentQuestion.type === 'multi' && (
        <div className="text-center mt-4 px-4">
          <p className="text-white/50 text-sm">
            Select up to {currentQuestion.multiSelectMax || data.meta.multiSelectMaxDefault} options
            {Array.isArray(currentAnswer) && (
              <span className="text-ocean ml-2">
                ({currentAnswer.length} selected)
              </span>
            )}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 md:mt-12">
        <NavigationButtons
          onBack={handleBack}
          onNext={handleNext}
          onSaveExit={handleSaveExit}
          canGoBack={currentIndex > 0}
          canGoNext={hasAnswer}
          isLast={currentIndex === questions.length - 1}
          hasAnswer={hasAnswer}
        />
      </div>
    </div>
  );
}
