/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        paper: {
          light: '#FAFBFD',
          base: '#F5F7FA',
          sheet: '#EDF1F5',
          warm: '#F2EFEB',
          dark: '#E0E5EC',
        },
        ink: {
          primary: '#1A1C20',
          muted: '#4A505C',
          faint: '#8E95A5',
          border: '#D0D6E2',
        },
        cobalt: {
          light: '#2D6BFF',
          DEFAULT: '#0038A8',
          vibrant: '#002FA7',
          dark: '#002270',
        },
        cyanotype: {
          light: '#365377',
          DEFAULT: '#16253D',
          deep: '#0D1726',
        },
        river: {
          mist: '#D8E5F3',
          sky: '#7EA8CE',
          deep: '#3A688C',
        },
        accent: {
          vermilion: '#E03E2D',
          ochre: '#E5C887',
          copper: '#D97736',
        }
      },
      fontFamily: {
        sans: ['Geist', 'PP Neue Montreal', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Geist Mono', 'Commit Mono', 'JetBrains Mono', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}
