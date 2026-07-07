import flashcardReducer, { addFlashcard, deleteFlashcard } from './redux/flashcardSlice';

describe('Flashcard Redux System Unit Tests', () => {
  const initialState = {
    cards: []
  };

  test('should return the initial empty state slice on boot', () => {
    expect(flashcardReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  test('should handle adding a new group payload into state storage', () => {
    const newGroup = {
      id: '123',
      groupName: 'React Basics',
      description: 'Core rules',
      terms: [{ termName: 'Prop', definition: 'Read-only data' }]
    };

    const actualState = flashcardReducer(initialState, addFlashcard(newGroup));
    
    expect(actualState.cards.length).toBe(1);
    expect(actualState.cards[0].groupName).toBe('React Basics');
  });

  test('should handle removing a flashcard cluster dynamically by id token', () => {
    const populatedState = {
      cards: [
        { id: '111', groupName: 'State Management' },
        { id: '222', groupName: 'Hooks Pool' }
      ]
    };

    const actualState = flashcardReducer(populatedState, deleteFlashcard('111'));
    
    expect(actualState.cards.length).toBe(1);
    expect(actualState.cards[0].id).toBe('222');
  });
});