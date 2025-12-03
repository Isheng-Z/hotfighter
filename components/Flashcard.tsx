import React, { useState } from 'react';
import { Flashcard as FlashcardType, Rating, Difficulty, Language } from '../types';
import { Brain, RefreshCw, CheckCircle, HelpCircle, Languages, ExternalLink, PlayCircle } from 'lucide-react';

interface Props {
  card: FlashcardType;
  onRate: (rating: Rating) => void;
  lang: Language;
  toggleLang: () => void;
}

const DifficultyBadge = ({ level }: { level: Difficulty }) => {
  const styles = {
    [Difficulty.Easy]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    [Difficulty.Medium]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    [Difficulty.Hard]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${styles[level]}`}>
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
      viewSolution: "View Official Solution (Video/PPT)",
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
      viewSolution: "查看官方图解/视频",
      problem: "题目描述",
      forgot: "忘记了",
      hazy: "有印象",
      mastered: "已掌握"
    }
  };

  const text = lang === 'zh' ? t.zh : t.en;
  const title = lang === 'zh' ? card.titleCn : card.title;
  const desc = lang === 'zh' ? card.descriptionCn : card.description;
  const idea = lang === 'zh' ? card.solutionIdeaCn : card.solutionIdea;

  // Construct URL based on language
  const solutionUrl = lang === 'zh' 
    ? `https://leetcode.cn/problems/${card.slug}/solutions/`
    : `https://leetcode.com/problems/${card.slug}/editorial/`;

  return (
    <div className="w-full max-w-2xl mx-auto h-[680px] relative select-none font-sans" style={{ perspective: '1200px' }}>
      <div 
        className="relative w-full h-full duration-500 transition-transform"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT */}
        <div 
          className="absolute w-full h-full flex flex-col bg-white dark:bg-[#303134] rounded-3xl shadow-lg border border-slate-100 dark:border-white/5 overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            zIndex: isFlipped ? 0 : 2,
            pointerEvents: isFlipped ? 'none' : 'auto',
          }}
        >
          {/* Header */}
          <div className="p-8 pb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                 <span className="text-sm font-mono text-slate-400">#{card.id}</span>
                 <DifficultyBadge level={card.difficulty} />
              </div>
              <button onClick={(e) => { e.stopPropagation(); toggleLang(); }} className="text-slate-400 hover:text-google-blue transition-colors">
                <Languages className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-3xl font-display font-medium text-slate-900 dark:text-slate-100 mb-3">{title}</h2>
            <div className="flex flex-wrap gap-2">
               {card.tags.map(tag => (
                 <span key={tag} className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md">
                   {tag}
                 </span>
               ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 pb-6 space-y-8 no-scrollbar">
             <div>
               <h3 className="text-xs font-bold text-google-blue uppercase tracking-wider mb-2">{text.problem}</h3>
               <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">{desc}</p>
             </div>

             <div className="bg-slate-50 dark:bg-black/20 rounded-2xl p-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{text.example}</h3>
                <div className="space-y-3 font-mono text-sm">
                  <div>
                    <span className="text-slate-400 mr-2 text-xs">{text.input}:</span>
                    <span className="text-slate-800 dark:text-slate-200">{card.exampleInput}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 mr-2 text-xs">{text.output}:</span>
                    <span className="text-slate-800 dark:text-slate-200">{card.exampleOutput}</span>
                  </div>
                </div>
             </div>
          </div>

          {/* Action */}
          <div className="p-8 pt-4 bg-white dark:bg-[#303134]">
            <button 
              onClick={handleFlip}
              className="w-full h-14 bg-google-blue hover:bg-blue-600 text-white rounded-full font-medium text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {text.showAnswer}
            </button>
          </div>
        </div>

        {/* BACK */}
        <div 
          className="absolute w-full h-full flex flex-col bg-white dark:bg-[#303134] rounded-3xl shadow-lg border border-slate-100 dark:border-white/5 overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            zIndex: isFlipped ? 2 : 0,
            pointerEvents: isFlipped ? 'auto' : 'none',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <h3 className="font-medium text-slate-500 truncate max-w-[80%]">{title}</h3>
            <button onClick={(e) => { e.stopPropagation(); toggleLang(); }} className="text-slate-400 hover:text-google-blue">
              <Languages className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 no-scrollbar">
            {/* Idea */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-google-blue uppercase tracking-wide mb-3">
                <Brain className="w-5 h-5" />
                {text.coreIdea}
              </h3>
              <p className="text-xl text-slate-800 dark:text-slate-200 leading-relaxed font-display">
                {idea}
              </p>
            </div>

            <div className="h-px bg-slate-100 dark:bg-white/5" />

            {/* Complexity */}
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-2xl">
                 <div className="text-xs font-bold text-slate-400 uppercase mb-1">{text.timeComp}</div>
                 <div className="text-lg font-mono font-medium text-slate-800 dark:text-slate-200">{card.timeComplexity}</div>
               </div>
               <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-2xl">
                 <div className="text-xs font-bold text-slate-400 uppercase mb-1">{text.spaceComp}</div>
                 <div className="text-lg font-mono font-medium text-slate-800 dark:text-slate-200">{card.spaceComplexity}</div>
               </div>
            </div>

            {/* External Resource (LeetCode) */}
            <div>
               <a 
                 href={solutionUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="group flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/10"
               >
                 <div className="p-2 bg-white dark:bg-black/20 rounded-full text-google-blue shadow-sm group-hover:scale-110 transition-transform">
                   <PlayCircle className="w-5 h-5" />
                 </div>
                 <div className="flex-1">
                   <div className="font-medium text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                     {text.viewSolution}
                     <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                   </div>
                   <div className="text-xs text-slate-500 mt-0.5">leetcode.cn / leetcode.com</div>
                 </div>
               </a>
            </div>
          </div>

          {/* Rating */}
          <div className="p-6 bg-slate-50 dark:bg-[#2b2c30] grid grid-cols-3 gap-4">
             <button onClick={() => handleRate(Rating.Forgot)} className="flex flex-col items-center py-3 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group">
               <RefreshCw className="w-6 h-6 text-slate-400 group-hover:text-google-red mb-1" />
               <span className="text-xs font-bold text-slate-500 group-hover:text-google-red">{text.forgot}</span>
             </button>
             <button onClick={() => handleRate(Rating.Hazy)} className="flex flex-col items-center py-3 rounded-2xl hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors group">
               <HelpCircle className="w-6 h-6 text-slate-400 group-hover:text-google-yellow mb-1" />
               <span className="text-xs font-bold text-slate-500 group-hover:text-google-yellow">{text.hazy}</span>
             </button>
             <button onClick={() => handleRate(Rating.Mastered)} className="flex flex-col items-center py-3 rounded-2xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group">
               <CheckCircle className="w-6 h-6 text-slate-400 group-hover:text-google-green mb-1" />
               <span className="text-xs font-bold text-slate-500 group-hover:text-google-green">{text.mastered}</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};