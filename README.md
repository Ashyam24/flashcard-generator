# Flashcard Generator

A lightweight study web application built with React, Redux Toolkit, and Tailwind CSS. It allows students and learners to create custom flashcard decks with terms, detailed definitions, and images, review them interactively, and export or print them for offline study.

Live Application: https://flashcard-generator-gamma-two.vercel.app/

---

### Core Features

- Deck Creation and Formik Validation: Create multi-card decks with group titles, descriptions, and dynamic terms. Inputs are validated in real time using Yup.
- Image Uploads: Add cover images and term references converted directly to base64 for persistent storage.
- Full CRUD Support: Create, view, edit existing decks with automatic form rehydration, and delete decks.
- Local Persistence: State is managed globally via Redux Toolkit and automatically synced with browser localStorage so data stays saved across reloads.
- Search and Filtering: Real-time case-insensitive search to quickly find decks by title or description.
- Interactive Study View: Term sidebar selection combined with next and previous carousel controls.
- Export and Print Tools: Download clean plain-text study summaries or use the print button, which automatically strips web buttons to format a clean study sheet for standard A4 paper.
- Dark and Light Themes: Built-in theme switch with full support for mobile, tablet, and desktop screens.

---

### Tech Stack

- React 18
- Redux Toolkit & React-Redux
- React Router DOM v6
- Formik & Yup
- Tailwind CSS
- React Icons
- Deployed on Vercel

---

### Project Structure

src/
├── pages/
│   ├── CreateFlashcard.js
│   ├── FlashcardDetails.js
│   └── MyFlashcards.js
├── redux/
│   ├── flashcardsSlice.js
│   └── store.js
├── App.js
├── App.css
├── index.css
└── index.js

---

### Local Setup Instructions

1. Clone the repository:
   git clone https://github.com/your-username/flashcard-generator.git
   cd flashcard-generator

2. Install dependencies:
   npm install

3. Run the application:
   npm start

The local development server will start at http://localhost:3000.
