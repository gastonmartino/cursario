import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// El mismo código se publica en dos instancias independientes. Cada una
// define su dirección con variables de entorno al construir:
//  - Dominio propio (y desarrollo local): sin variables, en la raíz de
//    https://gastonmartino.xyz/
//  - GitHub Pages: SITE_URL=https://gastonmartino.github.io y
//    BASE_PATH=/cursario, definidas en .github/workflows/deploy.yml
const site = process.env.SITE_URL || 'https://gastonmartino.xyz';
const base = process.env.BASE_PATH || '/';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  integrations: [tailwind()],
  devToolbar: {
    enabled: false
  },
  server: {
    port: 3000,
    host: true
  }
});
