import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreateFlashcard from './pages/CreateFlashcard';
import MyFlashcards from './pages/MyFlashcards';
import FlashcardDetails from './pages/FlashcardDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            {/* Default Route redirects to Create page */}
            <Route path="/" element={<Navigate to="/create" replace />} />
            
            {/* Core Routes */}
            <Route path="/create" element={<CreateFlashcard />} />
            <Route path="/my-flashcards" element={<MyFlashcards />} />
            <Route path="/flashcard-details/:id" element={<FlashcardDetails />} />
            
            {/* Edit Route: mounts CreateFlashcard with the group ID */}
            <Route path="/edit/:id" element={<CreateFlashcard />} />

            {/* Fallback 404 handler */}
            <Route path="*" element={<Navigate to="/create" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
