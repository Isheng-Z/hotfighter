
import React, { useState, useEffect, useMemo } from 'react';
import { Flashcard as FlashcardType, Rating, SRSState, Language } from './types';
import { INITIAL_QUESTIONS, STORAGE_KEY } from './constants';
import { calculateNextReview, getInitialSRSState } from './utils/srs';
import { Dashboard } from './components/Dashboard';
import { Flashcard } from './components/Flashcard';
import { QuestionList } from './components/QuestionList';
import { Moon, Sun, ArrowLeft, Languages } from 'lucide-react';

const App: React.FC = () => {
  const [cards, setCards] = useState<FlashcardType[]>([]);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [sessionQueue, setSessionQueue] = useState<number[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lang, setLang] = useState<Language>('zh');
  
  // Navigation State
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
        setCards(INITIAL_QUESTIONS.map(q => ({ ...q, srs: getInitialSRSState(), isNew: true })));
      }
    } else {
      setCards(INITIAL_QUESTIONS.map(q => ({ ...q, srs: getInitialSRSState(), isNew: true })));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    }
  }, [cards, isLoaded]);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const activeCardId = sessionQueue[currentCardIndex];
  const activeCard = useMemo(() => cards.find(c => c.id === activeCardId), [activeCardId, cards]);

  const startSession = () => {
    const now = Date.now();
    const due = cards.filter(c => c.srs.dueDate <= now && !c.isNew);
    const brandNew = cards.filter(c => c.isNew).slice(0, 5);
    const queue = [...due, ...brandNew].map(c => c.id);
    if (queue.length === 0) return;
    setSessionQueue(queue);
    setCurrentCardIndex(0);
    setIsStudyMode(true);
    setViewCategory(null);
  };

  const handleRate = (rating: Rating) => {
    if (!activeCard) return;
    const newSRS = calculateNextReview(activeCard.srs, rating);
    setCards(prev => prev.map(c => c.id === activeCard.id ? { ...c, srs: newSRS, isNew: false } : c));
    if (currentCardIndex < sessionQueue.length - 1) {
      setTimeout(() => setCurrentCardIndex(prev => prev + 1), 200);
    } else {
      setTimeout(() => { setIsStudyMode(false); setSessionQueue([]); }, 300);
    }
  };

  const handleResetCard = (id: number) => {
    setCards(prev => prev.map(c => 
      c.id === id ? { ...c, srs: getInitialSRSState(), isNew: true } : c
    ));
  };

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleLang = () => setLang(prev => prev === 'en' ? 'zh' : 'en');

  // Helper to filter cards for List View
  const getCategoryCards = () => {
    switch (viewCategory) {
      case 'new': return cards.filter(c => c.isNew);
      case 'learning': return cards.filter(c => !c.isNew && c.srs.interval <= 21);
      case 'mastered': return cards.filter(c => c.srs.interval > 21);
      default: return [];
    }
  };

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] dark:bg-[#202124]"></div>;

  return (
    <div className={`min-h-screen transition-colors duration-200 font-sans ${darkMode ? 'dark bg-[#202124]' : 'bg-[#f0f2f5]'}`}>
      
      {/* Top App Bar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-[#303134] shadow-sm px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {(isStudyMode || viewCategory) && (
            <button 
              onClick={() => { setIsStudyMode(false); setViewCategory(null); }} 
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-200" />
            </button>
          )}
          <span className="text-xl font-display font-medium text-slate-600 dark:text-slate-200">
            LeetCode <span className="text-google-blue font-bold">Flash</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={toggleLang} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-200 transition-colors" title="Language">
            <Languages className="w-5 h-5" />
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-200 transition-colors" title="Theme">
             {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <main className="container max-w-4xl mx-auto px-4 py-6">
        {isStudyMode && activeCard ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="w-full max-w-2xl mx-auto flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
               <div className="flex-1 h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-google-blue transition-all duration-300" style={{ width: `${((currentCardIndex + 1) / sessionQueue.length) * 100}%` }} />
               </div>
               <span>{currentCardIndex + 1} / {sessionQueue.length}</span>
             </div>
             <Flashcard card={activeCard} onRate={handleRate} lang={lang} toggleLang={toggleLang} />
          </div>
        ) : viewCategory ? (
          <QuestionList 
            category={viewCategory} 
            cards={getCategoryCards()} 
            onBack={() => setViewCategory(null)}
            onReset={handleResetCard}
          />
        ) : (
          <Dashboard 
            cards={cards} 
            onStartStudy={startSession} 
            lang={lang} 
            onViewCategory={setViewCategory}
          />
        )}
      </main>
    </div>
  );
};

export default App;
