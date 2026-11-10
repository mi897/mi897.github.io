import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://mi897.github.io',
  integrations: [mdx(), // /research is unlisted: reachable by link only, so keep it out of the sitemap
    sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/research') }), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});