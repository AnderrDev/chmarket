/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    { pattern: /(bg|text|border)-ch-(primary|gray|dark-gray|medium-gray|light-gray)\/(10|20|30|40|50|60|70|80|90)/ },
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { 
        sm: '640px', 
        md: '768px', 
        lg: '1024px', 
        xl: '1280px', 
        '2xl': '1440px' 
      },
      maxWidth: {
        DEFAULT: '1200px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1200px',
      },
    },
    extend: {
      colors: {
        'ch-primary': 'rgb(var(--ch-primary) / <alpha-value>)',
        'ch-black': 'rgb(var(--ch-black) / <alpha-value>)',
        'ch-gray': 'rgb(var(--ch-gray) / <alpha-value>)',
        'ch-dark-gray': 'rgb(var(--ch-dark-gray) / <alpha-value>)',
        'ch-medium-gray': 'rgb(var(--ch-medium-gray) / <alpha-value>)',
        'ch-light-gray': 'rgb(var(--ch-light-gray) / <alpha-value>)',
      },
      fontFamily: {
        primary: ['Inter', 'sans-serif'],        // Abnes Regular alternativa
        secondary: ['Oswald', 'sans-serif'],     // Knockout Bold alternativa
        complementary: ['Work Sans', 'sans-serif'], // Garet Book alternativa
      },
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0,0,0,.25)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
};
