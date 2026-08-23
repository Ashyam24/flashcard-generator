import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteFlashcard } from '../redux/flashcardSlice';
import { FiTrash2, FiArrowRight, FiSearch, FiLayers } from 'react-icons/fi';

const MyFlashcards = () => {
  const dispatch = useDispatch();
  const cards = useSelector((state) => state.flashcards.cards || []);
  const [searchTerm, setSearchTerm] = useState('');

  // Real-time case-insensitive filter
  const filteredCards = cards.filter((group) =>
    group.groupName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id, groupName, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${groupName}"?`)) {
      dispatch(deleteFlashcard(id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header & Real-time Search Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Flashcards
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage, review, and organize your saved flashcard decks.
          </p>
        </div>

        {cards.length > 0 && (
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search flashcards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-red-500 transition shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Empty State when no flashcards exist */}
      {cards.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-red-50 dark:bg-gray-700 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            <FiLayers />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No Flashcards Created Yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
            Get started by creating your first study group with terms, definitions, and images.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow transition"
          >
            Create Flashcard
          </Link>
        </div>
      ) : filteredCards.length === 0 ? (
        /* Empty search results fallback */
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-10 text-center shadow-sm">
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            No flashcard groups match "{searchTerm}"
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-3 text-sm text-red-600 dark:text-red-400 font-semibold hover:underline"
          >
            Clear Search
          </button>
        </div>
      ) : (
        /* Flashcards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((group) => (
            <div
              key={group.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Header Row: Thumbnail + Info + Delete */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {group.groupImage ? (
                      <img
                        src={group.groupImage}
                        alt={group.groupName}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-gray-700 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-lg">
                        {group.groupName?.charAt(0)?.toUpperCase() || 'F'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">
                        {group.groupName}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {group.terms?.length || 0} {group.terms?.length === 1 ? 'card' : 'cards'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(group.id, group.groupName, e)}
                    className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    title="Delete group"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                {/* Group Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-6 leading-relaxed">
                  {group.description || 'No description provided.'}
                </p>
              </div>

              {/* View Cards Link - EXACT route match */}
              <Link
                to={`/flashcard-details/${group.id}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 dark:bg-gray-700 hover:bg-red-600 dark:hover:bg-red-600 text-red-600 dark:text-red-400 hover:text-white dark:hover:text-white rounded-xl font-semibold text-sm transition"
              >
                View Cards <FiArrowRight />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFlashcards;
