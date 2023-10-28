/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin')
const fs = require('fs')
const path = require('path')

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
        'search-icon': "url('/assets/images/search.svg')",
        'search-icon-dark': "url('/assets/images/search-dark.svg')"
      },
      boxShadow: {
        'card-shadow': '0px 0px 4px 0px rgb(219, 223, 227)',
        'card-shadow-hover': '0px 0px 6px 2px rgb(210, 209, 209)',
        'side-menu-shadow': '0px 0px 20px -4px rgb(210, 209, 209)',
        'article-shadow': '0 2px 8px 0px rgba(107, 121, 243, 0.35)',
        'article-hover-shadow': '0 1px 6px 0px rgba(107, 121, 243, 0.8)',
        'kanbancard-shadow': '0px 0px 6px 1px rgb(210, 209, 209)',
      },
      colors: {
        column: 'var(--color-column)',
        'main-light': '#fafafa',
        'main-dark': '#2a303c',
        'main-dark-github': '#2f3741',
        'navbar-dark': '#424b5e',
        'navbar-dark-github': '#404853',
        'menu-dark-github': '#323947',
        'post-layout': "#f5f5f5",
        'the-pink': '#FE888D',
        'the-green': '#0095AA',
        'primary-yellow': '#FFC600',
        teal: '#70D4E2',
        gray: {
          250: '#dbdfe3'
        }
      },
      fontFamily: {
        //'sans': ['Helvetica', 'Arial', 'sans-serif'],
        default: [...defaultTheme.fontFamily.sans],
        inter: ['var(--font-inter)'],
        nunito: ['var(--font-nunito)'],
      },
      invert: {
        25: '.25',
        50: '.5',
        75: '.75',
      },
      screens: {
        xs: '450px'
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100'
      }
    }
  },
  plugins: [
    // Embeds Hero Icons (https://heroicons.com) into your app.css bundle
    // See your `CoreComponents.icon/1` for more information.
    //
    plugin(function ({ matchComponents, theme }) {
      let iconsDir = path.join(__dirname, '/public/assets/vendor/heroicons/optimized')
      let values = {}
      let icons = [
        ['', '/24/outline'],
        ['-solid', '/24/solid'],
        ['-mini', '/20/solid'],
      ]
      icons.forEach(([suffix, dir]) => {
        fs.readdirSync(path.join(iconsDir, dir)).map((file) => {
          let name = path.basename(file, '.svg') + suffix
          values[name] = { name, fullPath: path.join(iconsDir, dir, file) }
        })
      })
      matchComponents(
        {
          hero: ({ name, fullPath }) => {
            let content = fs
              .readFileSync(fullPath)
              .toString()
              .replace(/\r?\n|\r/g, '')
            return {
              [`--hero-${name}`]: `url('data:image/svg+xml;utf8,${content}')`,
              '-webkit-mask': `var(--hero-${name})`,
              mask: `var(--hero-${name})`,
              'background-color': 'currentColor',
              'vertical-align': 'middle',
              display: 'inline-block',
              width: theme('spacing.5'),
              height: theme('spacing.5'),
            }
          },
        },
        { values }
      )
    }),
  ]
}
