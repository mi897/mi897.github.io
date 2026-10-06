# CLAUDE.md

Personal site for mi8.studio, built with Astro (based on the Astrofy template) and deployed to GitHub Pages.

## Commands

- `pnpm install`: install dependencies (pnpm is the only supported package manager)
- `pnpm dev`: dev server
- `pnpm build`: static build into `dist/`
- `pnpm preview`: serve the built `dist/`

## Layout

- `src/content.config.ts`: content collections `writs` and `store`, loaded with `glob()` from `src/content/<collection>/`
- `src/pages/writs/[slug].astro`: writ URLs come from `createSlug(title, id)` (`src/lib/createSlug.ts`). While `GENERATE_SLUG_FROM_TITLE` in `src/config.ts` is true, the slug is generated from the title, not the filename. Links (cards, tag pages, `rss.xml.js`) must use the same `createSlug` call.
- `src/pages/store/[slug].astro`: store URLs use the entry `id` (the filename)
- `src/styles/global.css`: Tailwind entry point (`@import "tailwindcss"` plus the daisyUI and typography `@plugin`s). Imported by `src/components/BaseHead.astro`.

## Known state of dependencies

- Astro 7, Tailwind CSS 4 (via `@tailwindcss/vite` in `astro.config.mjs`; there is no `tailwind.config.*` and no `@astrojs/tailwind`), daisyUI 5, React 19.
- The daisyUI theme is set in `global.css` (`sunset` default, `dark` for prefers-dark). `<html data-theme="sunset">` in the layouts forces sunset.
- Astro 7 APIs in use: `glob()` loaders, `entry.id`, `render(entry)` from `astro:content`, `ClientRouter` from `astro:transitions`, and an uppercase `GET` endpoint in `rss.xml.js`. Import `z` from `astro/zod`.
- Node >= 22.12 is required (Astro 7 engines). CI (`withastro/action`) and the `Dockerfile` both use Node 22.
- Package manager: pnpm, pinned by `packageManager` in `package.json`. `pnpm-lock.yaml` is committed and is the only lockfile; do not add `package-lock.json`, because `withastro/action` picks the package manager from the lockfile. The `package-manager: pnpm@x.y.z` input in `.github/workflows/deploy.yml` must match `packageManager`.
