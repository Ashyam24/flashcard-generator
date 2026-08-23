import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { FiSun, FiMoon, FiLayers } from 'react-icons/fi';
import CreateFlashcard from './pages/CreateFlashcard';
import MyFlashcards from './pages/MyFlashcards';
import FlashcardDetails from './pages/FlashcardDetails';

// Clean Navigation Header with your Flashcard Generator Branding
const Header = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Brand Row & Dark Mode Toggle */}
        <div className="flex items-center justify-between py-4">
          <NavLink to="/create" className="flex items-center gap-2.5 group">
            <div className="bg-red-600 text-white p-2 rounded-xl shadow-sm group-hover:bg-red-700 transition">
              <FiLayers className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">
              Flashcard <span className="text-red-600">Generator</span>
            </span>
          </NavLink>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            title="Toggle theme"
          >
            {darkMode ? <FiSun className="w-5 h-5 text-yellow-400" /> : <FiMoon className="w-5 h-5 text-gray-600" />}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-8 border-t border-gray-100 dark:border-gray-700 pt-3">
          <NavLink
            to="/create"
            className={({ isActive }) =>
              `pb-3 font-semibold text-sm transition relative ${
                isActive
                  ? 'text-red-600 dark:text-red-500 border-b-2 border-red-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`
            }
          >
            Create New
          </NavLink>

          <NavLink
            to="/my-flashcards"
            className={({ isActive }) =>
              `pb-3 font-semibold text-sm transition relative ${
                isActive
                  ? 'text-red-600 dark:text-red-500 border-b-2 border-red-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`
            }
          >
            My Flashcards
          </NavLink>
        </div>

      </div>
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 flex flex-col">
        {/* Navigation */}
        <Header />

        {/* Main Routes Content */}
        <main className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1">
          <Routes>
            {/* Primary Navigation */}
            <Route path="/" element={<Navigate to="/create" replace />} />
            <Route path="/create" element={<CreateFlashcard />} />
            <Route path="/my-flashcards" element={<MyFlashcards />} />

            {/* Flashcard Details Support (both plural & singular URL variations) */}
            <Route path="/flashcard-details/:id" element={<FlashcardDetails />} />
            <Route path="/flashcard-detail/:id" element={<FlashcardDetails />} />

            {/* Edit Support */}
            <Route path="/edit/:id" element={<CreateFlashcard />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/create" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
