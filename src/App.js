import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CreateFlashcard from './pages/CreateFlashcard';
import MyFlashcards from './pages/MyFlashcards';
import FlashcardDetails from './pages/FlashcardDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <main className="container mx-auto px-4 py-6">
          <Routes>
            {/* Landing Route */}
            <Route path="/" element={<CreateFlashcard />} />
            <Route path="/create" element={<CreateFlashcard />} />
            
            {/* Listing & Details */}
            <Route path="/my-flashcards" element={<MyFlashcards />} />
            <Route path="/flashcard-details/:id" element={<FlashcardDetails />} />
            
            {/* Edit Route */}
            <Route path="/edit/:id" element={<CreateFlashcard />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
