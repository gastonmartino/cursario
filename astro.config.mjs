import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // Publicado en GitHub Pages como sitio de proyecto:
  // https://gastonmartino.github.io/cursario/
  site: 'https://gastonmartino.github.io',
  base: '/cursario',
  integrations: [tailwind()],
  devToolbar: {
    enabled: false
  },
  server: {
    port: 3000,
    host: true
  }
});
