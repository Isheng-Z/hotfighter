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
        // Check if we should reset to initial state completely
        // Only load user data if it's properly structured
        const merged = INITIAL_QUESTIONS.map(q => {
          const found = parsed.find((p: FlashcardType) => p.id === q.id);
          // If we have valid SRS data from localStorage, use it; otherwise reset to initial
          if (found && found.srs && typeof found.isNew !== 'undefined') {
             return { 
               ...q, 
               srs: { 
                 interval: found.srs.interval,
                 repetition: found.srs.repetition,
                 efactor: found.srs.efactor,
                 dueDate: found.srs.dueDate
               }, 
               isNew: found.isNew 
             };
          }
          // If no valid data found in localStorage, use initial state
          return { ...q, srs: getInitialSRSState(), isNew: true };
        });
        setCards(merged);
      } catch (e) {
        console.error("Failed to load data, resetting.", e);
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
    if (darkMode) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ dailyNewLimit, theme: 'dark' }));
      document.documentElement.classList.add('dark');
    } else {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ dailyNewLimit, theme: 'light' }));
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
    if (isLoaded) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ dailyNewLimit, theme: darkMode ? 'dark' : 'light' }));
    }
  }, [dailyNewLimit, isLoaded, darkMode]);

  const activeCardId = sessionQueue[currentCardIndex];
  const activeCard = useMemo(() => cards.find(c => c.id === activeCardId), [activeCardId, cards]);

  const resetAllData = () => {
    if (window.confirm("确定要重置所有数据吗？所有学习进度将丢失。")) {
      // 1. Clear storage explicitly
      localStorage.removeItem(STORAGE_KEY);

      // 2. Reconstruct completely fresh state from constants
      // Use spread syntax to ensure we have fresh object references for srs
      const newCards = INITIAL_QUESTIONS.map(q => ({ 
        ...q, 
        srs: { ...getInitialSRSState() }, 
        isNew: true 
      }));
      
      // 3. Reset all app state
      setCards(newCards);
      setSessionQueue([]);
      setIsStudyMode(false);
      setCurrentCardIndex(0);
      setViewCategory(null);
      setDailyNewLimit(10);
      
      // 4. Force save immediately to prevent race conditions
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCards));
    }
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
    if (ids.length === 0) return;
    
    const idsSet = new Set(ids);
    setCards(prev => {
      const next = prev.map(c => 
        idsSet.has(c.id) ? { ...c, srs: { ...getInitialSRSState() }, isNew: true } : c
      );
      // Force immediate save to ensure persistence even if app closes
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
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

  if (!isLoaded) return <div className="h-screen w-full bg-slate-50 dark:bg-slate-900"></div>;

  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden bg-slate-50 dark:bg-slate-900">
      
      {/* Navbar - Minimalist */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 lg:px-6 py-4 transition-all duration-300 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
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
        {isStudyMode && activeCard ? (
          <div className="h-full flex flex-col space-y-4 lg:space-y-8 animate-fade-in overflow-hidden">
             {/* Subtle Progress Line */}
             <div className="w-full max-w-xs mx-auto flex items-center gap-4 opacity-50 flex-none">
               <span className="text-xs font-serif italic text-slate-600 dark:text-slate-400">{currentCardIndex + 1}</span>
               <div className="flex-1 h-px bg-slate-300 dark:bg-white/20">
                  <div className="h-full bg-slate-800 dark:bg-white transition-all duration-700 ease-in-out" style={{ width: `${((currentCardIndex + 1) / sessionQueue.length) * 100}%` }} />
               </div>
               <span className="text-xs font-serif italic text-slate-600 dark:text-slate-400">{sessionQueue.length}</span>
             </div>
             
             <div className="flex-1 min-h-0">
                <Flashcard card={activeCard} onRate={handleRate} lang={lang} toggleLang={toggleLang} />
             </div>
          </div>
        ) : viewCategory ? (
          <div className="h-full overflow-hidden flex flex-col">
            <QuestionList 
              category={viewCategory} 
              cards={getCategoryCards()} 
              onBack={() => setViewCategory(null)}
              onResetBatch={handleBatchReset}
            />
          </div>
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