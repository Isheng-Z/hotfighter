import React, { useState } from 'react';
import { Flashcard as FlashcardType, Rating, Difficulty, Language } from '../types';
import { Brain, RefreshCw, CheckCircle, HelpCircle, Languages, ExternalLink } from 'lucide-react';

interface Props {
  card: FlashcardType;
  onRate: (rating: Rating) => void;
  lang: Language;
  toggleLang: () => void;
}

const DifficultyBadge = ({ level }: { level: Difficulty }) => {
  const styles = {
    [Difficulty.Easy]: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-800',
    [Difficulty.Medium]: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-orange-300 dark:bg-orange-900/30 dark:border-orange-800', // Orange for sunrise theme
    [Difficulty.Hard]: 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-900/30 dark:border-rose-800',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${styles[level]}`}>
      {level}
    </span>
  );
};

export const Flashcard: React.FC<Props> = ({ card, onRate, lang, toggleLang }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  React.useEffect(() => {
    setIsFlipped(false);
  }, [card.id]);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(true);
  };

  const handleRate = (rating: Rating) => {
    onRate(rating);
  };

  const t = {
    en: {
      showAnswer: "Show Answer",
      example: "Example",
      input: "Input",
      output: "Output",
      coreIdea: "Core Idea",
      timeComp: "Time Complexity",
      spaceComp: "Space Complexity",
      viewSolution: "Official Solution",
      problem: "Problem",
      forgot: "Forgot",
      hazy: "Hazy",
      mastered: "Mastered"
    },
    zh: {
      showAnswer: "查看答案",
      example: "示例",
      input: "输入",
      output: "输出",
      coreIdea: "核心思路",
      timeComp: "时间复杂度",
      spaceComp: "空间复杂度",
      viewSolution: "官方题解",
      problem: "题目",
      forgot: "忘记",
      hazy: "模糊",
      mastered: "熟记"
    }
  };

  const text = lang === 'zh' ? t.zh : t.en;
  const title = lang === 'zh' ? card.titleCn : card.title;
  const desc = lang === 'zh' ? card.descriptionCn : card.description;
  const idea = lang === 'zh' ? card.solutionIdeaCn : card.solutionIdea;

  const solutionUrl = lang === 'zh' 
    ? `https://leetcode.cn/problems/${card.slug}/solutions/`
    : `https://leetcode.com/problems/${card.slug}/editorial/`;

  return (
    <div className="w-full max-w-2xl mx-auto h-[calc(100vh-120px)] min-h-[500px] lg:h-[700px] relative select-none" style={{ perspective: '2500px' }}>
      <div 
        className="relative w-full h-full duration-700 ease-out-back"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Bouncy flip
        }}
      >
        {/* FRONT */}
        <div 
          className="absolute w-full h-full flex flex-col rounded-[2.5rem] overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white dark:border-slate-700 shadow-2xl shadow-slate-200/40 dark:shadow-black/60"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', zIndex: isFlipped ? 0 : 2 }}
        >
          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply dark:mix-blend-overlay"></div>

          <div className="px-6 py-6 lg:px-10 lg:pt-10 lg:pb-6 flex-1 flex flex-col relative z-10">
            <div className="flex justify-between items-start mb-6 lg:mb-8">
               <span className="text-6xl lg:text-8xl font-serif font-black text-slate-100 dark:text-slate-800/50 select-none absolute -top-4 -right-4 -z-10 pointer-events-none">
                 {card.id}
               </span>
               <div className="flex gap-2 relative z-10">
                 <DifficultyBadge level={card.difficulty} />
               </div>
               <button onClick={(e) => { e.stopPropagation(); toggleLang(); }} className="relative z-10 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                   <Languages className="w-5 h-5" />
               </button>
            </div>

            <h2 className="text-2xl lg:text-4xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-4 lg:mb-6 leading-tight relative z-10">
              {title}
            </h2>

            <div className="flex flex-wrap gap-2 mb-6 lg:mb-10 relative z-10">
               {card.tags.map(tag => (
                 <span key={tag} className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                   {tag}
                 </span>
               ))}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 relative z-10 no-scrollbar space-y-6 lg:space-y-8">
               {/* Increased font size and used font-normal for better readability */}
               <p className="text-xl lg:text-2xl text-slate-700 dark:text-slate-200 leading-relaxed font-sans font-normal">
                 {desc}
               </p>

               <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl p-4 lg:p-6 border border-slate-100 dark:border-slate-700/50">
                  <div className="space-y-4 font-mono text-base lg:text-lg text-slate-700 dark:text-slate-300">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{text.input}</span>
                      <span className="bg-white dark:bg-slate-900 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">{card.exampleInput}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{text.output}</span>
                      <span className="bg-white dark:bg-slate-900 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">{card.exampleOutput}</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="p-6 lg:p-8 bg-white/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 backdrop-blur-md">
            <button 
              onClick={handleFlip}
              className="w-full py-3 lg:py-4 bg-slate-800 dark:bg-sunrise-sun text-white rounded-xl font-serif font-bold text-lg hover:shadow-xl hover:shadow-slate-800/20 dark:hover:shadow-orange-900/30 transition-all hover:-translate-y-1"
            >
              {text.showAnswer}
            </button>
          </div>
        </div>

        {/* BACK */}
        <div 
          className="absolute w-full h-full flex flex-col rounded-[2.5rem] overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white dark:border-slate-700 shadow-2xl shadow-slate-200/40 dark:shadow-black/60"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            zIndex: isFlipped ? 2 : 0,
            transform: 'rotateY(180deg)',
          }}
        >
           {/* Paper Texture Overlay */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply dark:mix-blend-overlay"></div>

          <div className="px-5 py-4 lg:px-8 lg:py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
            <h3 className="font-serif font-bold text-slate-500 truncate max-w-[80%] opacity-60 text-sm lg:text-base">{title}</h3>
            <button onClick={(e) => { e.stopPropagation(); toggleLang(); }} className="text-slate-400 hover:text-slate-600">
              <Languages className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8 space-y-6 lg:space-y-8 no-scrollbar relative z-10">
            <div>
              <h3 className="text-xs font-bold text-indigo-600 dark:text-sunrise-sun uppercase tracking-widest mb-3 lg:mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                {text.coreIdea}
              </h3>
              <p className="text-2xl lg:text-3xl text-slate-800 dark:text-slate-100 leading-relaxed font-serif font-medium">
                {idea}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:gap-4">
               <div className="p-4 lg:p-5 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/40">
                 <div className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1 lg:mb-2">{text.timeComp}</div>
                 <div className="font-mono font-bold text-base lg:text-xl text-slate-700 dark:text-slate-200">{card.timeComplexity}</div>
               </div>
               <div className="p-4 lg:p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40">
                 <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1 lg:mb-2">{text.spaceComp}</div>
                 <div className="font-mono font-bold text-base lg:text-xl text-slate-700 dark:text-slate-200">{card.spaceComplexity}</div>
               </div>
            </div>

            <a 
              href={solutionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-sunrise-sun transition-colors group px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="font-medium text-sm border-b border-transparent group-hover:border-current transition-all">{text.viewSolution}</span>
            </a>
          </div>

          <div className="p-4 lg:p-6 bg-slate-50/80 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 backdrop-blur-md">
             <div className="grid grid-cols-3 gap-3 lg:gap-4">
               {[
                 { rating: Rating.Forgot, icon: RefreshCw, label: text.forgot, color: 'text-rose-600 bg-rose-50 hover:bg-rose-100 border-rose-200 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 dark:border-rose-800 dark:text-rose-400' },
                 { rating: Rating.Hazy, icon: HelpCircle, label: text.hazy, color: 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 dark:border-amber-800 dark:text-amber-400' },
                 { rating: Rating.Mastered, icon: CheckCircle, label: text.mastered, color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:border-emerald-800 dark:text-emerald-400' }
               ].map((btn) => (
                 <button 
                   key={btn.label}
                   onClick={() => handleRate(btn.rating)} 
                   className={`flex flex-col items-center gap-2 py-3 lg:py-4 rounded-xl border transition-all ${btn.color} active:scale-95 shadow-sm`}
                 >
                   <btn.icon className="w-5 h-6 lg:w-6 lg:h-6" />
                   <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest">{btn.label}</span>
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};