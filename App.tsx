import React, { useState, useEffect, useMemo } from 'react';
import { Flashcard as FlashcardType, Rating, SRSState, Language } from './types';
import { INITIAL_QUESTIONS, STORAGE_KEY } from './constants';
import { calculateNextReview, getInitialSRSState, shuffleArray } from './utils/srs';
import { Dashboard } from './components/Dashboard';
import { Flashcard } from './components/Flashcard';
import { QuestionList } from './components/QuestionList';
import { Moon, Sun, ArrowLeft, Languages } from 'lucide-react';

const SETTINGS_KEY = 'leetcode-flash-settings';

const App: React.FC = () => {
  const [cards, setCards] = useState<FlashcardType[]>([]);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [sessionQueue, setSessionQueue] = useState<number[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lang, setLang] = useState<Language>('zh');
  const [dailyNewLimit, setDailyNewLimit] = useState(10);
  
  const [viewCategory, setViewCategory] = useState<'new' | 'learning' | 'mastered' | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = INITIAL_QUESTIONS.map(q => {
          const found = parsed.find((p: FlashcardType) => p.id === q.id);
          return found ? { ...q, srs: found.srs, isNew: found.isNew } : { ...q, srs: getInitialSRSState(), isNew: true };
        });
        setCards(merged);
      } catch (e) {
        resetAllData();
      }
    } else {
      resetAllData();
    }

    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        const { dailyNewLimit } = JSON.parse(savedSettings);
        if (typeof dailyNewLimit === 'number') setDailyNewLimit(dailyNewLimit);
      } catch (e) {}
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    }
  }, [cards, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ dailyNewLimit }));
    }
  }, [dailyNewLimit, isLoaded]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const activeCardId = sessionQueue[currentCardIndex];
  const activeCard = useMemo(() => cards.find(c => c.id === activeCardId), [activeCardId, cards]);

  const resetAllData = () => {
    setCards(INITIAL_QUESTIONS.map(q => ({ ...q, srs: getInitialSRSState(), isNew: true })));
  };

  const startSession = () => {
    const now = Date.now();
    const dueCards = cards.filter(c => !c.isNew && c.srs.dueDate <= now);
    const newCards = cards.filter(c => c.isNew).slice(0, dailyNewLimit);
    const pool = [...dueCards, ...newCards];
    
    if (pool.length === 0) return;

    const shuffledQueue = shuffleArray(pool.map(c => c.id));
    setSessionQueue(shuffledQueue);
    setCurrentCardIndex(0);
    setIsStudyMode(true);
    setViewCategory(null);
  };

  const handleRate = (rating: Rating) => {
    if (!activeCard) return;
    const newSRS = calculateNextReview(activeCard.srs, rating);
    
    setCards(prev => prev.map(c => c.id === activeCard.id ? { ...c, srs: newSRS, isNew: false } : c));
    
    if (currentCardIndex < sessionQueue.length - 1) {
      setTimeout(() => setCurrentCardIndex(prev => prev + 1), 300);
    } else {
      setTimeout(() => { setIsStudyMode(false); setSessionQueue([]); }, 500);
    }
  };

  const handleBatchReset = (ids: number[]) => {
    const idsSet = new Set(ids);
    setCards(prev => prev.map(c => 
      idsSet.has(c.id) ? { ...c, srs: getInitialSRSState(), isNew: true } : c
    ));
  };

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleLang = () => setLang(prev => prev === 'en' ? 'zh' : 'en');

  const getCategoryCards = () => {
    switch (viewCategory) {
      case 'new': return cards.filter(c => c.isNew);
      case 'learning': return cards.filter(c => !c.isNew && c.srs.interval <= 21);
      case 'mastered': return cards.filter(c => c.srs.interval > 21);
      default: return [];
    }
  };

  if (!isLoaded) return <div className="min-h-screen"></div>;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Navbar - Minimalist */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 transition-all duration-300">
        <div className="flex items-center gap-4">
          {(isStudyMode || viewCategory) && (
            <button 
              onClick={() => { setIsStudyMode(false); setViewCategory(null); }} 
              className="p-2 rounded-full hover:bg-white/20 transition-colors text-slate-700 dark:text-slate-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          {!isStudyMode && !viewCategory && (
            <span className="text-xl font-serif italic font-bold text-slate-700 dark:text-slate-200 opacity-80">
              LeetCode Flash
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 glass rounded-full px-2 py-1">
          <button onClick={toggleLang} className="p-2 rounded-full hover:bg-white/30 transition-all text-slate-600 dark:text-slate-300">
            <Languages className="w-4 h-4" />
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/30 transition-all">
             {darkMode ? <Sun className="w-4 h-4 text-orange-200" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </nav>

      <main className="container max-w-5xl mx-auto px-4 py-24 flex-1">
        {isStudyMode && activeCard ? (
          <div className="space-y-8 animate-fade-in">
             {/* Subtle Progress Line */}
             <div className="w-full max-w-xs mx-auto flex items-center gap-4 opacity-50">
               <span className="text-xs font-serif italic text-slate-600 dark:text-slate-400">{currentCardIndex + 1}</span>
               <div className="flex-1 h-px bg-slate-300 dark:bg-white/20">
                  <div className="h-full bg-slate-800 dark:bg-white transition-all duration-700 ease-in-out" style={{ width: `${((currentCardIndex + 1) / sessionQueue.length) * 100}%` }} />
               </div>
               <span className="text-xs font-serif italic text-slate-600 dark:text-slate-400">{sessionQueue.length}</span>
             </div>
             
             <Flashcard card={activeCard} onRate={handleRate} lang={lang} toggleLang={toggleLang} />
          </div>
        ) : viewCategory ? (
          <QuestionList 
            category={viewCategory} 
            cards={getCategoryCards()} 
            onBack={() => setViewCategory(null)}
            onResetBatch={handleBatchReset}
          />
        ) : (
          <Dashboard 
            cards={cards} 
            onStartStudy={startSession} 
            lang={lang} 
            onViewCategory={setViewCategory}
            onResetAll={resetAllData}
            dailyNewLimit={dailyNewLimit}
            onSetDailyNewLimit={setDailyNewLimit}
          />
        )}
      </main>
    </div>
  );
};

export default App;