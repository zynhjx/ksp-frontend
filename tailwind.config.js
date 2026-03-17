/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-white': '#f5f7fa',
        'theme-white': '#f8fafc',
        'theme-blue': '#0057a3',
        'blue-hover': '#0a6cc4',
        'muted-text': '#5C6470',
        'border': '#DDE2E8',
        'hovered': '#f0f0f0',
      },
    },
  },
  plugins: [],
}
