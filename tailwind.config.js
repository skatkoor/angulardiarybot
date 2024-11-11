// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',  // Light blue background
          500: '#0ea5e9', // Primary blue
          600: '#0284c7', // Hover state
          700: '#0369a1', // Active state
        },
        gray: {
          50: '#f9fafb',  // Background
          100: '#f3f4f6', // Card hover
          200: '#e5e7eb', // Borders
          600: '#4b5563', // Secondary text
          800: '#1f2937', // Primary text
        },
      },
    },
  },
  plugins: [],
}
