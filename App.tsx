
// leetcode-flash/App.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { Question, Language } from './types';
import { INITIAL_QUESTIONS } from './constants';
import { shuffleArray } from './utils/srs';
import { Dashboard } from './components/Dashboard';
import { Flashcard } from './components/Flashcard';
import { QuestionList } from './components/QuestionList';
import { SessionSummary } from './components/SessionSummary';
import { Moon, Sun, Languages } from 'lucide-react';

const SETTINGS_KEY = 'leetcode-flash-settings';

type ViewMode = 'dashboard' | 'session' | 'summary' | 'library' | 'card-detail';

const App: React.FC = () => {
  // Static data
  const allQuestions = INITIAL_QUESTIONS;

  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<Language>('zh');

  // Session State
  const [sessionQueue, setSessionQueue] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState<boolean[]>([]); // true = known, false = unknown

  // Library/Detail State
  const [selectedCard, setSelectedCard] = useState<Question | null>(null);

  // --- THEME & SETTINGS ---
  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
       try {
         const { theme } = JSON.parse(savedSettings);
         if (theme === 'dark') setDarkMode(true);
       } catch(e) {}
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ theme: darkMode ? 'dark' : 'light' }));
  }, [darkMode]);

  // --- ACTIONS ---

  const startPractice = (count: number) => {
    const shuffled = shuffleArray([...allQuestions]);
    const selection = shuffled.slice(0, count);
    setSessionQueue(selection);
    setCurrentIndex(0);
    setSessionResults([]); // Reset results
    setViewMode('session');
  };

  const handleAnswerInSession = (known: boolean) => {
    // Record result
    const newResults = [...sessionResults, known];
    setSessionResults(newResults);

    // Move next or finish
    if (currentIndex < sessionQueue.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Session finished, go to summary
      setViewMode('summary');
    }
  };

  const openLibrary = () => {
    setViewMode('library');
  };

  const selectCardFromLibrary = (card: Question) => {
    setSelectedCard(card);
    setViewMode('card-detail');
  };

  const backToLibrary = () => {
    setSelectedCard(null);
    setViewMode('library');
  };

  const backToDashboard = () => {
    setViewMode('dashboard');
    setSessionQueue([]);
    setSessionResults([]);
    setSelectedCard(null);
  };

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleLang = () => setLang(prev => prev === 'en' ? 'zh' : 'en');

  // --- RENDER ---

  const renderContent = () => {
    switch (viewMode) {
      case 'dashboard':
        return (
          <Dashboard 
            totalCount={allQuestions.length}
            onStartPractice={startPractice}
            onOpenLibrary={openLibrary}
            lang={lang}
          />
        );
      
      case 'session':
        if (sessionQueue.length === 0) return null;
        const activeCard = sessionQueue[currentIndex];
        return (
          <div className="h-full flex flex-col animate-fade-in">
             <Flashcard 
               card={activeCard} 
               onAnswer={handleAnswerInSession}
               lang={lang} 
               toggleLang={toggleLang}
               isSession={true}
               progressText={`${currentIndex + 1} / ${sessionQueue.length}`}
             />
          </div>
        );

      case 'summary':
        return (
          <SessionSummary 
            results={sessionResults}
            onHome={backToDashboard}
            lang={lang}
          />
        );

      case 'library':
        return (
          <QuestionList 
            cards={allQuestions}
            onBack={backToDashboard}
            onSelect={selectCardFromLibrary}
          />
        );

      case 'card-detail':
        if (!selectedCard) return null;
        return (
          <div className="h-full flex flex-col animate-fade-in">
             <Flashcard 
               card={selectedCard}
               onBack={backToLibrary}
               lang={lang}
               toggleLang={toggleLang}
               isSession={false}
             />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden bg-slate-50 dark:bg-slate-900">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 lg:px-6 py-4 transition-all duration-300 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          {viewMode !== 'dashboard' && (
             <button 
               onClick={backToDashboard}
               className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-bold uppercase tracking-widest flex items-center gap-2"
             >
               LeetCode Flash
             </button>
          )}
          {viewMode === 'dashboard' && (
             <span className="text-xl font-serif italic font-bold text-slate-700 dark:text-slate-200 opacity-80">
               LeetCode Flash
             </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 glass rounded-full px-2 py-1 pointer-events-auto">
          <button onClick={toggleLang} className="p-2 rounded-full hover:bg-white/30 transition-all text-slate-600 dark:text-slate-300">
            <Languages className="w-4 h-4" />
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/30 transition-all">
             {darkMode ? <Sun className="w-4 h-4 text-orange-200" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col h-full w-full max-w-5xl mx-auto px-3 lg:px-4 pt-20 pb-4 relative z-0">
         {renderContent()}
      </main>
    </div>
  );
};

export default App;
