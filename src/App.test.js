import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store';
import App from './App';

// Wrapper helper to provide necessary Redux and Router context
const renderWithProviders = (ui) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </Provider>
  );
};

describe('Flashcard Generator Application Tests', () => {
  test('renders the application brand heading', () => {
    renderWithProviders(<App />);
    const brandElement = screen.getByText(/Flashcard/i);
    expect(brandElement).toBeInTheDocument();
  });

  test('renders primary navigation links', () => {
    renderWithProviders(<App />);
    const createNav = screen.getByText(/Create New/i);
    const myCardsNav = screen.getByText(/My Flashcards/i);
    
    expect(createNav).toBeInTheDocument();
    expect(myCardsNav).toBeInTheDocument();
  });
});
