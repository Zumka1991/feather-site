import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://featheros.ru',
  integrations: [sitemap()],
  server: { port: 4321 },
  devToolbar: { enabled: false },
});
