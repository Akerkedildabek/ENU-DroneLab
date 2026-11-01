/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'Manrope', 'Arial', 'sans-serif'] },
      colors: {
        ink: '#182B45', muted: '#64748B', cyan: '#28B8D9',
        ice: '#EAF5FF', cloud: '#F7FAFC', stroke: '#E5EDF5',
      },
      boxShadow: {
        soft: '0 18px 52px -25px rgba(29,69,111,.21)',
        card: '0 12px 34px -23px rgba(29,69,111,.26)',
      },
    },
  },
  plugins: [],
}
