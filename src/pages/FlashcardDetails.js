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
  FiChevronLeft, 
  FiChevronRight, 
  FiEdit2 
} from 'react-icons/fi';

const FlashcardDetails = () => {
  const { id } = useParams();
  
  // Extract flashcard groups from global Redux store
  const cards = useSelector((state) => state.flashcards.cards);
  const currentGroup = cards.find((group) => group.id === id);

  // Local state management for UI and active flashcard term indexing
  const [activeTermIndex, setActiveTermIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const printRef = useRef(null);

  // Fallback view when group ID does not exist in store
  if (!currentGroup) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center print:hidden">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Flashcard Group Not Found</h2>
        <Link to="/my-flashcards" className="text-red-500 hover:underline font-medium">
          ← Back to My Flashcards
        </Link>
      </div>
    );
  }

  // Safely grab the currently active term based on the index state
  const activeTerm = currentGroup.terms?.[activeTermIndex] || {};

  // Clipboard share handler for copying the current URL
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500); // Reset copy icon after 2.5 seconds
  };

  // System print trigger
  const handlePrint = () => {
    window.print();
  };

  // Generate a beautifully formatted, human-readable Text file (.txt) of the flashcards
  const handleDownload = () => {
    // 1. Create a structured, readable text layout
    let content = `📚 FLASHCARD DECK: ${currentGroup.groupName.toUpperCase()} 📚\n`;
    content += `📝 Description: ${currentGroup.description}\n`;
    content += `📊 Total Cards: ${currentGroup.terms?.length || 0}\n`;
    content += `📅 Exported on: ${new Date().toLocaleDateString()}\n`;
    content += `======================================================\n\n`;

    // 2. Loop through each term and format it clearly
    currentGroup.terms?.forEach((term, index) => {
      content += `CARD #${index + 1}\n`;
      content += `▶ TERM: ${term.termName}\n`;
      content += `▶ DEFINITION: ${term.definition}\n`;
      content += `------------------------------------------------------\n\n`;
    });

    // 3. Convert string to a Blob (Binary Large Object) for text download
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    
    // 4. Create a temporary anchor link to trigger the download
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = URL.createObjectURL(blob);
    
    // 5. Clean up the filename (removes special characters and spaces)
    const safeFileName = currentGroup.groupName.replace(/[^a-zA-Z0-9]/g, '_');
    downloadAnchor.download = `${safeFileName}_Flashcards.txt`;
    
    // 6. Append to body, trigger download click, and immediately clean up
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  // Pagination navigation controls (Next Card)
  const handleNext = () => {
    if (activeTermIndex < currentGroup.terms.length - 1) {
      setActiveTermIndex((prev) => prev + 1);
    }
  };

  // Pagination navigation controls (Previous Card)
  const handlePrev = () => {
    if (activeTermIndex > 0) {
      setActiveTermIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 print:py-2 print:px-0" ref={printRef}>
      
      {/* Top Header: Breadcrumb & Group Info */}
      <div className="mb-6 print:mb-4">
        <Link 
          to="/my-flashcards" 
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 mb-4 transition print:hidden"
        >
          <FiArrowLeft /> Back to My Flashcards
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-4 border-b border-gray-100 dark:border-gray-700 pb-4 print:border-gray-300">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white print:text-black flex items-center gap-3">
              {currentGroup.groupName}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 print:text-gray-700 mt-2 max-w-3xl leading-relaxed">
              {currentGroup.description}
            </p>
          </div>
          {currentGroup.groupImage && (
            <img 
              src={currentGroup.groupImage} 
              alt={currentGroup.groupName} 
              className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shadow-sm print:hidden"
            />
          )}
        </div>
      </div>

      {/* 1. SCREEN VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 print:hidden">
        
        {/* Left Column: Term Selection Sidebar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 h-fit">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            Flashcards ({currentGroup.terms?.length || 0})
          </h2>
          <div className="space-y-1">
            {currentGroup.terms?.map((term, index) => (
              <button
                key={index}
                onClick={() => setActiveTermIndex(index)}
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
              {/* Term Image (if uploaded) */}
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
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
                {activeTerm.definition}
              </p>
            </div>

            {/* Pagination Controls */}
            <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center gap-4">
              <button
                onClick={handlePrev}
                disabled={activeTermIndex === 0}
                className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {activeTermIndex + 1} / {currentGroup.terms?.length || 1}
              </span>
              
              <button
                onClick={handleNext}
                disabled={activeTermIndex === (currentGroup.terms?.length || 1) - 1}
                className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Actions Sidebar */}
        <div className="space-y-3">
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
            <FiDownload /> Download Text
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

      {/* 2. PRINT-ONLY VIEW */}
      <div className="hidden print:block space-y-4">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-2">All Terms & Definitions</h2>
        <div className="space-y-4">
          {currentGroup.terms?.map((term, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded-lg break-inside-avoid">
              <div className="flex items-start gap-4">
                <span className="font-bold text-gray-900 w-8">{index + 1}.</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-base mb-1">{term.termName}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{term.definition}</p>
                </div>
                {term.termImage && (
                  <img 
                    src={term.termImage} 
                    alt={term.termName} 
                    className="w-24 h-24 object-cover rounded border border-gray-200 shrink-0" 
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Modal Dialog */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden">
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
