import { createSlice } from '@reduxjs/toolkit';

// Retrieve saved flashcard decks from localStorage on initial load
const loadCardsFromStorage = () => {
  try {
    const saved = localStorage.getItem('flashcards');
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    return [];
  }
};

const flashcardsSlice = createSlice({
  name: 'flashcards',
  initialState: {
    cards: loadCardsFromStorage(),
  },
  reducers: {
    // Append a newly created deck and sync to localStorage
    addFlashcard: (state, action) => {
      state.cards.push(action.payload);
      localStorage.setItem('flashcards', JSON.stringify(state.cards));
    },

    // Locate deck by unique ID and overwrite with modified data
    updateFlashcard: (state, action) => {
      const index = state.cards.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.cards[index] = action.payload;
        localStorage.setItem('flashcards', JSON.stringify(state.cards));
      }
    },

    // Remove a deck by ID and update storage
    deleteFlashcard: (state, action) => {
      state.cards = state.cards.filter((c) => c.id !== action.payload);
      localStorage.setItem('flashcards', JSON.stringify(state.cards));
    },
  },
});

export const { addFlashcard, updateFlashcard, deleteFlashcard } = flashcardsSlice.actions;
export default flashcardsSlice.reducer;
