import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FiArrowLeft, 
  FiShare2, 
  FiDownload, 
  FiPrinter, 
  FiCopy, 
  FiCheck, 
  FiCpu,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2
} from 'react-icons/fi';

const FlashcardDetails = () => {
  const { id } = useParams();
  
  // Extract flashcard groups from the global Redux store
  const cards = useSelector((state) => state.flashcards.cards);
  const currentGroup = cards.find((group) => group.id === id);

  // Local component states for UI interaction & active card indexing
  const [activeTermIndex, setActiveTermIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAiSummarized, setIsAiSummarized] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const printRef = useRef(null);

  // Fallback view when group ID does not match any stored records
  if (!currentGroup) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Flashcard Group Not Found</h2>
        <Link to="/my-flashcards" className="text-red-500 hover:underline font-medium">
          ← Back to My Flashcards
        </Link>
      </div>
    );
  }

  const activeTerm = currentGroup.terms?.[activeTermIndex] || {};

  // AI Study Assistant: splits definition text to isolate core definitions and takeaways
  const handleAiSummarize = () => {
    if (!activeTerm.definition) return;
    setIsAiSummarized(true);

    const sentences = activeTerm.definition.split(/(?<=[.?!])\s+/);
    const coreConcept = sentences[0] || activeTerm.definition;
    const keyTakeaway = sentences.slice(1).join(' ') || 'Focus on understanding the application and key constraints.';

    setAiSummary({
      coreConcept,
      keyTakeaway,
    });
  };

  // Clipboard share handler
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Print triggering handler
  const handlePrint = () => {
    window.print();
  };

  // Export current flashcard group to a downloadable JSON file
  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentGroup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${currentGroup.groupName.replace(/\s+/g, '_')}_flashcards.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Pagination navigation controls
  const handleNext = () => {
    if (activeTermIndex < currentGroup.terms.length - 1) {
      setActiveTermIndex(prev => prev + 1);
      setIsAiSummarized(false);
    }
  };

  const handlePrev = () => {
    if (activeTermIndex > 0) {
      setActiveTermIndex(prev => prev - 1);
      setIsAiSummarized(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" ref={printRef}>
      {/* Top Breadcrumb & Group Header */}
      <div className="mb-6">
        <Link to="/my-flashcards" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 mb-4 transition">
          <FiArrowLeft /> Back to My Flashcards
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              {currentGroup.groupName}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-3xl leading-relaxed">
              {currentGroup.description}
            </p>
          </div>
          {currentGroup.groupImage && (
            <img 
              src={currentGroup.groupImage} 
              alt={currentGroup.groupName} 
              className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shadow-sm"
            />
          )}
        </div>
      </div>

      {/* Main Grid: Sidebar (Left) | Viewer (Center) | Toolbar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Term Selection Sidebar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 h-fit">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            Flashcards ({currentGroup.terms?.length || 0})
          </h2>
          <div className="space-y-1">
            {currentGroup.terms?.map((term, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveTermIndex(index);
                  setIsAiSummarized(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition flex items-center justify-between ${
                  activeTermIndex === index
                    ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold border-l-4 border-red-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="truncate">{term.termName || `Term ${index + 1}`}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center Column: Selected Card Viewer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 min-h-[380px] flex flex-col justify-between">
            <div>
              {/* Optional Term Image Rendering */}
              {activeTerm.termImage && (
                <div className="mb-4 w-full h-56 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <img
                    src={activeTerm.termImage}
                    alt={activeTerm.termName}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {activeTerm.termName}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {activeTerm.definition}
              </p>

              {/* AI Study Assistant Output Card */}
              {isAiSummarized && aiSummary && (
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-700 dark:to-gray-700 border border-red-200 dark:border-gray-600 animate-fadeIn">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm mb-2">
                    <FiCpu /> AI Summary & Key Takeaway
                  </div>
                  <div className="text-xs text-gray-800 dark:text-gray-200 space-y-1">
                    <p><strong className="text-gray-900 dark:text-white">Core:</strong> {aiSummary.coreConcept}</p>
                    <p><strong className="text-gray-900 dark:text-white">Takeaway:</strong> {aiSummary.keyTakeaway}</p>
                  </div>
                </div>
              )}
            </div>

            {/* AI Action Trigger & Next/Prev Controls */}
            <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleAiSummarize}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-gray-700 rounded-lg hover:bg-red-100 dark:hover:bg-gray-600 transition"
              >
                <FiCpu /> Simplify with AI
              </button>

              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <button
                  onClick={handlePrev}
                  disabled={activeTermIndex === 0}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FiChevronLeft />
                </button>
                <span>
                  {activeTermIndex + 1} / {currentGroup.terms?.length || 1}
                </span>
                <button
                  onClick={handleNext}
                  disabled={activeTermIndex === (currentGroup.terms?.length || 1) - 1}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Actions Sidebar */}
        <div className="space-y-3">
          {/* Edit Group link to load data into CreateFlashcard */}
          <Link
            to={`/edit/${currentGroup.id}`}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-center"
          >
            <FiEdit2 /> Edit Group
          </Link>

          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
          >
            <FiShare2 /> Share Group
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
          >
            <FiDownload /> Download Data
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
          >
            <FiPrinter /> Print Cards
          </button>
        </div>
      </div>

      {/* Share Modal Dialog */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Share Flashcard Link</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Anyone with this link can view this flashcard group in their browser.
            </p>
            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="bg-transparent text-xs w-full text-gray-700 dark:text-gray-200 outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-xs font-semibold shrink-0"
              >
                {copied ? <FiCheck /> : <FiCopy />}
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardDetails;
