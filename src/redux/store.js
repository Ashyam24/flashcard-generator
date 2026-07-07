import { configureStore } from '@reduxjs/toolkit';
import flashcardReducer from './flashcardSlice';

export const store = configureStore({
  reducer: {
    flashcards: flashcardReducer,
  },
});