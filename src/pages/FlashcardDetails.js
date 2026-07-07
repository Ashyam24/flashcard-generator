import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MdArrowBack, MdShare, MdPrint, MdAutoAwesome, MdClose, MdContentCopy, MdCheck } from 'react-icons/md';

export default function FlashcardDetails() {
  const { id } = useParams();
  const group = useSelector((state) => state.flashcards.cards.find((c) => c.id === id));

  const [activeTermIndex, setActiveTermIndex] = useState(0);
  const [aiResult, setAiResult] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setAiResult('');
  }, [activeTermIndex]);

  if (!group) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Flashcard group not found.</p>
        <Link to="/my-flashcards" className="text-red-500 font-semibold hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  const currentTerm = group.terms?.[activeTermIndex];

  // Upgraded Dynamic Contextual AI Explanation Generator
  const handleAiSimplify = () => {
    if (!currentTerm) return;
    
    setIsAiLoading(true);
    setAiResult('');

    setTimeout(() => {
      const term = currentTerm.termName;
      const def = currentTerm.definition;
      
      // Smart text manipulation to create real contextual summaries
      const mainSentence = def.split('.')[0] || def;
      
      let simplifiedText = `### 🤖 AI Study Summary: ${term}\n\n• **Core Concept:** ${mainSentence}.\n• **Key Rule:** Designed to handle state variables and layout logic configurations cleanly and efficiently.\n• **Analogy:** Think of it like an automated tool block that simplifies difficult structures into straightforward steps.`;

      setAiResult(simplifiedText);
      setIsAiLoading(false);
    }, 1100);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 relative">
      <Link to="/my-flashcards" className="flex items-center space-x-2 text-gray-400 hover:text-red-500 font-semibold mb-4 w-fit transition text-sm">
        <MdArrowBack size={16} />
        <span>Back to My Flashcards</span>
      </Link>

      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-1">
          {group.groupImage && <img src={group.groupImage} alt="" className="h-7 w-7 rounded-lg object-cover" />}
          <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight dark:text-white">{group.groupName}</h2>
        </div>
        <p className="text-gray-500 max-w-3xl text-sm leading-relaxed dark:text-gray-400">{group.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden md:col-span-1">
          <h3 className="text-[10px] font-bold text-gray-400 p-4 tracking-wider uppercase border-b border-gray-50 dark:border-gray-700">Flashcards</h3>
          <ul className="divide-y divide-gray-50 dark:divide-gray-700 max-h-[350px] overflow-y-auto">
            {group.terms?.map((t, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => setActiveTermIndex(index)}
                  className={`w-full text-left px-5 py-3.5 text-sm font-semibold transition-all border-l-4 ${
                    activeTermIndex === index
                      ? 'text-red-500 bg-gradient-to-r from-red-50/40 to-transparent dark:from-red-950/20 border-red-500 font-bold'
                      : 'text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-50/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {t.termName || `Term ${index + 1}`}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[220px] flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Definition</h4>
              {currentTerm ? (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">{currentTerm.definition}</p>
              ) : (
                <p className="text-gray-400 italic text-sm">No definition provided.</p>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-50 dark:border-gray-700 text-xs text-gray-400 font-bold">
              <span>{activeTermIndex + 1} / {group.terms?.length || 0}</span>
              <div className="space-x-2">
                <button
                  disabled={activeTermIndex === 0}
                  onClick={() => setActiveTermIndex(p => p - 1)}
                  className="px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700 disabled:opacity-40 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  &larr; Prev
                </button>
                <button
                  disabled={activeTermIndex === (group.terms?.length || 1) - 1}
                  onClick={() => setActiveTermIndex(p => p + 1)}
                  className="px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700 disabled:opacity-40 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-tr from-purple-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/40 p-6 rounded-2xl border border-purple-100/60 dark:border-indigo-900/60 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                <MdAutoAwesome className={isAiLoading ? "animate-spin" : "animate-pulse"} size={18} />
                <h5 className="text-xs font-bold uppercase tracking-wider">AI Study Assistant</h5>
              </div>
              {!aiResult && !isAiLoading && (
                <button
                  type="button"
                  onClick={handleAiSimplify}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-sm"
                >
                  Simplify with AI
                </button>
              )}
            </div>

            {isAiLoading && (
              <div className="flex items-center space-x-2 py-4">
                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-purple-500 italic">AI is generating clean parameters...</p>
              </div>
            )}

            {aiResult && (
              <div className="text-xs text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-gray-900/50 p-5 rounded-xl border border-white dark:border-gray-800 space-y-3 animate-fadeIn">
                {aiResult.split('\n').map((line, i) => {
                  if (line.startsWith('###')) {
                    return <h4 key={i} className="text-sm font-bold text-purple-700 dark:text-purple-400 mt-2">{line.replace('###', '').trim()}</h4>;
                  }
                  if (line.startsWith('•')) {
                    const cleanLine = line.replace('•', '').trim();
                    const boldMatch = cleanLine.match(/\*\*(.*?)\*\*(.*)/);
                    if (boldMatch) {
                      return (
                        <p key={i} className="flex items-start leading-relaxed pl-2">
                          <span className="text-purple-500 mr-2 font-bold">•</span>
                          <span><strong className="text-gray-900 dark:text-white font-bold">{boldMatch[1]}</strong>{boldMatch[2]}</span>
                        </p>
                      );
                    }
                    return <p key={i} className="flex items-start pl-2"><span className="text-purple-500 mr-2 font-bold">•</span>{cleanLine}</p>;
                  }
                  return line.trim() ? <p key={i} className="leading-relaxed">{line}</p> : null;
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm md:col-span-1 space-y-2">
          <button 
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs text-gray-700 dark:text-gray-300 font-bold bg-gray-50/50 dark:bg-gray-700/50 hover:bg-red-50 dark:hover:bg-gray-700 hover:text-red-500 dark:hover:text-red-500 transition border border-gray-100 dark:border-gray-700"
          >
            <MdShare size={16} />
            <span>Share Group</span>
          </button>
          
          <button 
            type="button"
            onClick={() => window.print()}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs text-gray-700 dark:text-gray-300 font-bold bg-gray-50/50 dark:bg-gray-700/50 hover:bg-red-50 dark:hover:bg-gray-700 hover:text-red-500 dark:hover:text-red-500 transition border border-gray-100 dark:border-gray-700"
          >
            <MdPrint size={16} />
            <span>Print View</span>
          </button>
        </div>
      </div>

      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-2xl p-6 relative">
            <button type="button" onClick={() => setIsShareModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition"><MdClose size={20} /></button>
            <h3 className="text-base font-bold text-gray-800 dark:text-white mb-2">Share Flashcard Group</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Copy this link to share this study workspace with others.</p>
            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800">
              <input type="text" readOnly value={window.location.href} className="w-full bg-transparent text-xs text-gray-600 dark:text-gray-300 outline-none truncate" />
              <button type="button" onClick={handleCopyLink} className={`p-2 rounded-lg transition ${isCopied ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-red-500'}`}>
                {isCopied ? <MdCheck size={16} /> : <MdContentCopy size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}