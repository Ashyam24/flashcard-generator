import { createSlice } from '@reduxjs/toolkit';

// Safely retrieve persisted flashcards from browser localStorage on app initialization
const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('flashcards');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error reading localStorage', error);
    return [];
  }
};

const initialState = {
  cards: loadFromLocalStorage(),
};

const flashcardSlice = createSlice({
  name: 'flashcards',
  initialState,
  reducers: {
    // Action to create and persist a brand new flashcard group
    addFlashcard: (state, action) => {
      state.cards.push(action.payload);
      localStorage.setItem('flashcards', JSON.stringify(state.cards));
    },

    // Action to find an existing flashcard group by ID and update its contents
    updateFlashcard: (state, action) => {
      const index = state.cards.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.cards[index] = action.payload;
        localStorage.setItem('flashcards', JSON.stringify(state.cards));
      }
    },

    // Action to remove a flashcard group by ID from both global state and localStorage
    deleteFlashcard: (state, action) => {
      state.cards = state.cards.filter((card) => card.id !== action.payload);
      localStorage.setItem('flashcards', JSON.stringify(state.cards));
    },
  },
});

export const { addFlashcard, updateFlashcard, deleteFlashcard } = flashcardSlice.actions;
export default flashcardSlice.reducer;
