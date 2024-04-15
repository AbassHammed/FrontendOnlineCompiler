import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';

const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-layer-1': 'rgb(40,40,40)',
        'dark-label-2': 'rgba(239, 241, 246, 0.75)',
        'dark-divider-border-2': 'rgb(61, 61, 61)',
        'dark-fill-2': 'hsla(0,0%,100%,.14)',
        'dark-fill-3': 'hsla(0,0%,100%,.1)',
        'dark-gray-6': 'rgb(138, 138, 138)',
        'dark-gray-7': 'rgb(179, 179, 179)',
        'gray-8': 'rgb(38, 38, 38)',
        'brand-purple': 'rgb(97, 12, 159)',
        'brand-purple-s': 'rgb(77, 7, 125)',
        'dark-green-s': 'rgb(44 187 93)',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
} satisfies Config;

export default config;
