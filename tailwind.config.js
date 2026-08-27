/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Overrides the default "red" with a beautiful Minimal Pastel Lilac
        red: {
          50: '#f5f3ff',  // Softest lilac (used for active states/backgrounds)
          100: '#ede9fe', // Light lilac 
          400: '#b197fc', // Soft purple (used for borders)
          500: '#9775fa', // Focus rings around inputs
          600: '#845ef7', // Main Button Color (Pastel purple, readable with white text)
          700: '#7048e8', // Button hover state
          950: '#2b005e', // Dark mode accents
        },
        // Overrides the default "gray" with a Warm Minimalist Off-White/Sand (like Notion)
        gray: {
          50: '#fcfaf8',  // Main app background (Very warm, soft off-white)
          100: '#f4f2ee', // Secondary background
          200: '#e8e5e1', // Soft borders
          300: '#d1cdc7', // Muted dividers
          400: '#a39f99', // Placeholder text
          500: '#7a7671', // Secondary text
          600: '#5c5955', // Primary text
          700: '#403e3b', // Dark mode card backgrounds
          800: '#292725', // Dark mode main background
          900: '#1c1b1a', // Dark mode deepest background
        }
      }
    },
  },
  plugins: [],
}
