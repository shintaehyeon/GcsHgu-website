/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gcs': {
          50: '#f5fbf0',
          100: '#e7f6db',
          200: '#ceebb8',
          300: '#aedc8a',
          400: '#8dc85d',
          500: '#7BBD1E',
          600: '#589518',
          700: '#437116',
          800: '#365a15',
          900: '#2d4b15',
          950: '#162908',
        }
      }
    },
  },
  plugins: [],
}
