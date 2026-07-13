/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Warm dark tones — not green */
        forest: {
          DEFAULT: '#2a2218',
          dark:    '#1c1510',
          deeper:  '#100e0b',
          light:   '#3d3025',
        },
        cream: {
          DEFAULT: '#f7f2e8',
          dark:    '#ede5d5',
          deeper:  '#dfd4c0',
        },
        gold: {
          DEFAULT: '#c5963a',
          light:   '#d4aa52',
          pale:    '#e8d097',
        },
        charcoal: '#1c1c1c',
        sage:     '#8b7a64',
        stone:    '#8b7355',
        warm:     '#3d3025',
      },
      fontFamily: {
        serif:   ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['"Inter"', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
