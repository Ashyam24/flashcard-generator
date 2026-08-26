import { configureStore } from '@reduxjs/toolkit';
import flashcardsReducer from './flashcardsSlice';

export const store = configureStore({
  reducer: {
    flashcards: flashcardsReducer,
  },
});

export default store;
