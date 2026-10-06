# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website / blog for mi8.studio (Muhammad Irfanul Haque), built with Astro 7 + Tailwind 4 + daisyUI 5 and deployed to GitHub Pages. Fully static: no server code, no tests, no linter configured.

## Commands

```sh
pnpm install        # package manager is pnpm (see "packageManager" in package.json)
pnpm dev            # dev server at http://localhost:4321
pnpm start          # dev server exposed on the network (--host)
pnpm build          # static build into dist/
pnpm preview        # serve the built dist/
```

`pnpm build` is the only correctness check available; it type-checks content frontmatter against the collection schemas and fails on invalid entries.

## Known state of dependencies

Migrated to **Astro 7 / Tailwind CSS 4 / daisyUI 5 / React 19** (mi897/mi897.github.io#8).

- Content collections live in `src/content.config.ts` with `glob()` loaders; import `z` from `astro/zod`. Use `entry.id` and `render(entry)` from `astro:content` (no `entry.slug` / `entry.render()`).
- View transitions use `ClientRouter` from `astro:transitions`; `src/pages/rss.xml.js` exports `GET`.
- Tailwind runs through `@tailwindcss/vite` (in `astro.config.mjs`); there is no `tailwind.config.*` and no `@astrojs/tailwind`. Tailwind, daisyUI and typography are configured in `src/styles/global.css` (`@import "tailwindcss"`, `@plugin ...`), imported by `BaseHead.astro`. daisyUI themes: `sunset` (default) and `dark` (prefers-dark).
- Node >= 22.12 is required (Astro 7 engines).
- Package manager is pnpm only. `pnpm-lock.yaml` is committed and is the single lockfile; don't add `package-lock.json` (CI picks the package manager from the lockfile).

## Deployment

- `.github/workflows/deploy.yml`: on push to `main`, `withastro/action@v2` builds with Node 22 and `pnpm@10.15.0` and deploys to GitHub Pages. That pnpm version must match `packageManager` in `package.json`, or `pnpm/action-setup` errors.
- `Dockerfile` (Node 22) runs `pnpm install --frozen-lockfile` and `pnpm build`, then serves `dist/` with `http-server` on 8080.
- `astro.config.mjs` sets `site: 'https://mi897.github.io'`, while `SITE_URL` in `src/config.ts` is `https://mi8.studio` (used for canonical/social metadata).

## Architecture

- **Global config**: `src/config.ts` holds site title, name, social links, email, and two feature flags:
  - `GENERATE_SLUG_FROM_TITLE` — if true, post/store URLs are derived from the frontmatter `title` via `src/lib/createSlug.ts`, not the filename. Any page linking to a writ (list, tag pages, `rss.xml.js`) must go through `createSlug(entry.data.title, entry.id)` to stay consistent. Store item URLs use `entry.id` (the filename).
  - `TRANSITION_API` — toggles view transitions in layouts.
- **Content collections** (`src/content/`, schemas and loaders in `src/content.config.ts`):
  - `writs` — blog posts (Markdown/MDX). Frontmatter: `title`, `description`, `pubDate` required; `heroImage`, `badge`, `tags` (must be unique), `updatedDate` optional.
  - `store` — shop items; `custom_link_label` and `updatedDate` required.
- **Routing** (`src/pages/`): each collection has `[...page].astro` (paginated list, 10 per page, newest first), `[slug].astro` (detail page), and writs also has `tag/[tag]/[...page].astro`. `cv-backend.astro` is the CV page built from `components/cv/TimeLine.astro`; `chillinW/curiosity.astro` is a standalone page.
- **Layouts**: `BaseLayout.astro` (head, header, sidebar drawer, footer; daisyUI theme set via `data-theme="sunset"` on `<html>`), `PostLayout.astro` for writs, `StoreItemLayout.astro` for store items. Pages pass `sideBarActiveItemID`, which `SideBarMenu.astro` matches against menu item `id`s to highlight the active link.
- **Path aliases** (`tsconfig.json`): `@components/*`, `@layouts/*`.
- Static assets (hero images, favicon, `curiosity-articles.json`) live in `public/` and are referenced by absolute path, e.g. `heroImage: "/post_img.png"`.
