/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4B8276',
          dark: '#2F564C',
        },
        ink: '#1A2A26',
        accent: {
          DEFAULT: '#C97B3D',
          dark: '#A8632E',
        },
        sand: '#F4EFE6',
        surface: '#FFFFFF',
        grey: {
          200: '#E3E0D7',
          600: '#5B5B5B',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        /* Modular scale 1.25 ratio from 16px base */
        'base': ['1rem', { lineHeight: '1.6' }],        /* 16px */
        'lg': ['1.25rem', { lineHeight: '1.5' }],       /* 20px */
        'xl': ['1.5625rem', { lineHeight: '1.4' }],     /* 25px */
        '2xl': ['1.9375rem', { lineHeight: '1.3' }],    /* 31px */
        '3xl': ['2.4375rem', { lineHeight: '1.2' }],    /* 39px */
        '4xl': ['3.0625rem', { lineHeight: '1.15' }],   /* 49px */
      },
      maxWidth: {
        'content': '75rem',     /* 1200px */
        'prose': '42rem',       /* ~65-75 chars at 16px */
      },
      spacing: {
        'section': '6rem',      /* 96px — generous section padding */
        'section-lg': '7.5rem', /* 120px */
      },
    },
  },
  plugins: [],
};
