import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateFlashcard from './pages/CreateFlashcard';
import MyFlashcards from './pages/MyFlashcards';
import FlashcardDetails from './pages/FlashcardDetails';
import { useDarkMode } from './utils/themeToggle';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

function App() {
  const [colorTheme, setTheme] = useDarkMode();

  return (
    <Router>
      {/* Dynamic Background Wrapper that scales to dark mode */}
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 transition-colors duration-300">
        {/* Modern Nav Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700 shadow-sm transition-all">
          <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 bg-gradient-to-tr from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md shadow-red-200 dark:shadow-none">
                <span className="text-white font-black text-lg">F</span>
              </div>
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent tracking-tight">
                Flashcard <span className="text-red-500">Generator</span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="flex items-center space-x-1 bg-gray-100/80 dark:bg-gray-700/50 p-1 rounded-xl">
                <Link to="/" className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-red-500 hover:bg-white dark:hover:bg-gray-800">
                  Create New
                </Link>
                <Link to="/my-flashcards" className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-red-500 hover:bg-white dark:hover:bg-gray-800">
                  My Flashcards
                </Link>
              </nav>

              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => setTheme(colorTheme)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-all"
              >
                {colorTheme === 'dark' ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Page Views */}
        <main className="max-w-6xl mx-auto px-4 pt-8">
          <Routes>
            <Route path="/" element={<CreateFlashcard />} />
            <Route path="/my-flashcards" element={<MyFlashcards />} />
            <Route path="/flashcard/:id" element={<FlashcardDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;