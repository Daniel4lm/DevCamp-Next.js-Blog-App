/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'show-tab-line': 'show-tab-line 0.4s ease-in-out forwards',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'search-icon': "url('/images/search.svg')",
        'search-icon-dark': "url('/images/search-dark.svg')"
      },
      boxShadow: {
        'card-shadow': '0px 0px 4px 0px rgb(219, 223, 227)',
        'card-shadow-hover': '0px 0px 6px 2px rgb(210, 209, 209)',
        'side-menu-shadow': '0px 0px 20px -4px rgb(210, 209, 209)',
        'article-shadow': '0 2px 8px 0px rgba(107, 121, 243, 0.35)',
        'article-hover-shadow': '0 1px 6px 0px rgba(107, 121, 243, 0.8)'
      },
      colors: {
        'main-light': '#fafafa',
        'main-dark': '#2a303c',
        'main-dark-github': '#2f3741',
        'navbar-dark': '#424b5e',
        'navbar-dark-github': '#404853',
        'menu-dark-github': '#323947',
        'post-bg-layout': "#f5f5f5",
        gray: {
          250: '#dbdfe3'
        }
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        caveat: ['var(--font-caveat)', 'cursive'],
      },
      screens: {
        xs: '450px'
      },
      zIndex: {
        60: '100',
        70: '100',
        80: '100',
        90: '100',
        100: '100'
      }
    }
  },
  plugins: []
}
