import { createSlice } from '@reduxjs/toolkit';

// Read existing flashcards from localStorage on initial boot
const loadCardsFromStorage = () => {
  try {
    const saved = localStorage.getItem('flashcards');
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Failed to load flashcards from storage:', err);
    return [];
  }
};

const flashcardsSlice = createSlice({
  name: 'flashcards',
  initialState: {
    cards: loadCardsFromStorage(),
  },
  reducers: {
    // Add a newly created flashcard deck to state and sync with storage
    addFlashcard: (state, action) => {
      state.cards.push(action.payload);
      localStorage.setItem('flashcards', JSON.stringify(state.cards));
    },

    // Locate deck by id and replace it with updated values from edit mode
    updateFlashcard: (state, action) => {
      const index = state.cards.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.cards[index] = action.payload;
        localStorage.setItem('flashcards', JSON.stringify(state.cards));
      }
    },

    // Remove a deck by its unique id
    deleteFlashcard: (state, action) => {
      state.cards = state.cards.filter((c) => c.id !== action.payload);
      localStorage.setItem('flashcards', JSON.stringify(state.cards));
    },
  },
});

export const { addFlashcard, updateFlashcard, deleteFlashcard } = flashcardsSlice.actions;
export default flashcardsSlice.reducer;
