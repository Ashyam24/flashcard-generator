import { createSlice } from '@reduxjs/toolkit';

// Helper function to safely fetch initial data from local storage
const loadCardsFromLocalStorage = () => {
  try {
    const savedCards = localStorage.getItem('flashcards');
    return savedCards ? JSON.parse(savedCards) : [];
  } catch (error) {
    console.error("Failed to load cards from localStorage:", error);
    return [];
  }
};

const initialState = {
  cards: loadCardsFromLocalStorage(),
};

const flashcardSlice = createSlice({
  name: 'flashcards',
  initialState,
  reducers: {
    addFlashcard: (state, action) => {
      state.cards.push(action.payload);
      // Urgently sync with local storage right as a card is added
      localStorage.setItem('flashcards', JSON.stringify(state.cards));
    },
    deleteFlashcard: (state, action) => {
      state.cards = state.cards.filter(card => card.id !== action.payload);
      localStorage.setItem('flashcards', JSON.stringify(state.cards));
    }
  },
});

export const { addFlashcard, deleteFlashcard } = flashcardSlice.actions;
export default flashcardSlice.reducer;