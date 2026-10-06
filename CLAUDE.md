# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website / blog for mi8.studio (Muhammad Irfanul Haque), built with Astro + Tailwind + daisyUI and deployed to GitHub Pages. Fully static: no server code, no tests, no linter configured.

## Commands

```sh
pnpm install        # package manager is pnpm (see "packageManager" in package.json)
pnpm dev            # dev server at http://localhost:4321
pnpm start          # dev server exposed on the network (--host)
pnpm build          # static build into dist/
pnpm preview        # serve the built dist/
```

`pnpm build` is the only correctness check available; it type-checks content frontmatter against the collection schemas and fails on invalid entries.

## Known state of dependencies (important)

The code was written for **Astro 4 / Tailwind 3 / daisyUI 4**, which is what `package-lock.json` still pins. A later commit bumped `package.json` to Astro 7, Tailwind 4, daisyUI 5, React 19 without migrating code, and `pnpm-lock.yaml` is gitignored. As a result `pnpm install && pnpm build` currently fails (`LegacyContentConfigError`). Things that depend on the old APIs:

- `src/content/config.ts` — legacy content collections (no loaders); Astro 5+ expects `src/content.config.ts` with `glob()` loaders.
- `entry.slug` and `entry.render()` in `src/pages/**` — removed in favor of `entry.id` / `render(entry)`.
- `ViewTransitions` from `astro:transitions` — renamed `ClientRouter`.
- `src/pages/rss.xml.js` exports `get` — must be `GET`.
- `tailwind.config.cjs` + `@astrojs/tailwind` — Tailwind 3 style config; Tailwind 4 uses CSS-based config and the Vite plugin.

When touching dependencies, either migrate the code or revert `package.json` to the versions in `package-lock.json`. Also note the CI and Docker paths below choose package managers differently.

## Deployment

- `.github/workflows/deploy.yml`: on push to `main`, `withastro/action@v2` builds (package manager auto-detected from the committed lockfile — currently `package-lock.json`, i.e. npm) and deploys to GitHub Pages.
- `Dockerfile` copies `pnpm-lock.yaml`, which is gitignored, so it only builds from a working tree that has run `pnpm install`. It serves `dist/` with `http-server` on 8080.
- `astro.config.mjs` sets `site: 'https://mi897.github.io'`, while `SITE_URL` in `src/config.ts` is `https://mi8.studio` (used for canonical/social metadata).

## Architecture

- **Global config**: `src/config.ts` holds site title, name, social links, email, and two feature flags:
  - `GENERATE_SLUG_FROM_TITLE` — if true, post/store URLs are derived from the frontmatter `title` via `src/lib/createSlug.ts`, not the filename. Any page linking to a post must go through `createSlug(entry.data.title, entry.slug)` to stay consistent (note `rss.xml.js` uses `post.slug` directly, so RSS links break when this flag is on).
  - `TRANSITION_API` — toggles view transitions in layouts.
- **Content collections** (`src/content/`, schemas in `src/content/config.ts`):
  - `writs` — blog posts (Markdown/MDX). Frontmatter: `title`, `description`, `pubDate` required; `heroImage`, `badge`, `tags` (must be unique), `updatedDate` optional.
  - `store` — shop items; `custom_link_label` and `updatedDate` required.
- **Routing** (`src/pages/`): each collection has `[...page].astro` (paginated list, 10 per page, newest first), `[slug].astro` (detail page), and writs also has `tag/[tag]/[...page].astro`. `cv-backend.astro` is the CV page built from `components/cv/TimeLine.astro`; `chillinW/curiosity.astro` is a standalone page.
- **Layouts**: `BaseLayout.astro` (head, header, sidebar drawer, footer; daisyUI theme set via `data-theme="sunset"` on `<html>`), `PostLayout.astro` for writs, `StoreItemLayout.astro` for store items. Pages pass `sideBarActiveItemID`, which `SideBarMenu.astro` matches against menu item `id`s to highlight the active link.
- **Path aliases** (`tsconfig.json`): `@components/*`, `@layouts/*`.
- Static assets (hero images, favicon, `curiosity-articles.json`) live in `public/` and are referenced by absolute path, e.g. `heroImage: "/post_img.png"`.
