import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteFlashcard } from '../redux/flashcardSlice';
import { MdDelete, MdSearch } from 'react-icons/md';

export default function MyFlashcards() {
  const cards = useSelector((state) => state.flashcards.cards);
  const dispatch = useDispatch();
  
  // State to hold the active search text input
  const [searchTerm, setSearchTerm] = useState('');

  // Filter cards dynamically based on group name matching the query
  const filteredCards = cards.filter((group) =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Top Heading Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">My Flashcards</h2>
        
        {/* Modern Live Search Bar Input Wrapper */}
        {cards.length > 0 && (
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <MdSearch size={20} />
            </span>
            <input
              type="text"
              placeholder="Search flashcard groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:border-red-500 dark:focus:border-red-500 transition-all"
            />
          </div>
        )}
      </div>

      {/* Conditional Dashboard Views */}
      {cards.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No flashcards created yet.</p>
          <Link to="/" className="text-red-500 font-semibold hover:underline">
            Create your first flashcard group
          </Link>
        </div>
      ) : filteredCards.length === 0 ? (
        /* View displayed if a query returns zero matches */
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400">No flashcard groups match your search query.</p>
        </div>
      ) : (
        /* Responsive Render Grid Layout mapping the filtered results array */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((group) => (
            <div 
              key={group.id} 
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group"
            >
              {/* Delete Action Button */}
              <button
                onClick={() => dispatch(deleteFlashcard(group.id))}
                className="absolute top-4 right-4 text-gray-300 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-500 md:opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg"
                title="Delete Group"
              >
                <MdDelete size={18} />
              </button>

              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 pr-6 group-hover:text-red-500 transition-colors">
                  {group.groupName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                  {group.description}
                </p>
                <span className="text-xs bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 px-2.5 py-1 rounded-full font-bold tracking-wide uppercase">
                  {group.terms ? group.terms.length : 0} {group.terms?.length === 1 ? 'Card' : 'Cards'}
                </span>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-700 flex justify-end">
                <Link
                  to={`/flashcard/${group.id}`}
                  className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold px-5 py-2 rounded-xl text-xs hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all duration-200 shadow-sm"
                >
                  View Cards
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}