import plugin from 'tailwindcss/plugin';

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
        },
        ink: {
          primary: '#1A1C20',
          muted: '#4A505C',
          faint: '#8E95A5',
          border: '#D0D6E2',
        },
        cobalt: {
          DEFAULT: '#0038A8',
          vibrant: '#002FA7',
          dark: '#002270',
        },
        cyanotype: {
          DEFAULT: '#16253D',
        },
        river: {
          mist: '#D8E5F3',
          sky: '#7EA8CE',
        },
        accent: {
          vermilion: '#E03E2D',
        }
      },
      fontFamily: {
        sans: ['Geist', 'PP Neue Montreal', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Geist Mono', 'Commit Mono', 'JetBrains Mono', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [
    // Variante "pagina-ancha:": se aplica cuando el lugar de la página de
    // contenido (.vista-pagina, ver LayoutCarta) mide 768 px o más. Sin vista
    // compartida (menos de 1024 px), ese lugar es la ventana; con vista
    // compartida, es la ventana entera con el Derrotero cerrado, y la mitad con
    // el Derrotero a la mitad o completo (ancho desde 1536 px de ventana).
    // Reemplaza a "md:" en las cartas, que mide la ventana.
    plugin(({ addVariant }) => {
      addVariant('pagina-ancha', [
        '@media (min-width: 768px) and (max-width: 1023.98px) { & }',
        '@media (min-width: 1536px) { & }',
        "@media (min-width: 1024px) { html[data-derrotero='cerrado'] & }",
      ]);
    }),
  ],
}
