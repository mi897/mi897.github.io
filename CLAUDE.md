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

## Branch naming

Every new branch gets a descriptive name: `<type>/<short-kebab-case-summary>`, where `<type>` is one of `feat`, `fix`, `docs`, `content`, `chore`, `refactor` (e.g. `fix/rss-slug-links`, `content/new-writ-on-love`, `chore/upgrade-astro-7`). The owner has standing approval for this: when a session is assigned an auto-generated branch name such as `claude/<adjective>-<name>-<suffix>`, create a descriptive branch from the latest `main` instead, and do all commits, pushes and PRs there. Mention the branch name you used in your final reply.

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
  - `GENERATE_SLUG_FROM_TITLE` — if true, post URLs are derived from the frontmatter `title` via `src/lib/createSlug.ts`, not the filename. Any page linking to a writ (list, tag pages, `rss.xml.js`) must go through `createSlug(entry.data.title, entry.id)` to stay consistent.
  - `TRANSITION_API` — toggles view transitions in layouts.
- **Content collections** (`src/content/`, schemas and loaders in `src/content.config.ts`):
  - `writs` — blog posts (Markdown/MDX). Frontmatter: `title`, `description`, `pubDate` required; `heroImage`, `badge`, `tags` (must be unique), `updatedDate` optional.
- **Routing** (`src/pages/`): `writs/` has `[...page].astro` (paginated list, 10 per page, newest first), `[slug].astro` (detail page) and `tag/[tag]/[...page].astro`. `cv-backend.astro` is the CV page built from `components/cv/TimeLine.astro`; `chillinW/curiosity.astro` is a standalone page.
- **Research** (`src/pages/research/`, `src/data/research/`, `src/components/research/`, `src/lib/`): an unlisted area (`noindex`, excluded from the sitemap in `astro.config.mjs`). `topics.json` lists the topics shown on `/research/`. Each topic has a folder under `src/data/research/<topic>/` (`papers.json`, `log.json`) and pages under `src/pages/research/<topic>/` (hub, `reading-list`, `log`, `deep-dives`).
  - **Deep dives** live inside a topic: `src/data/research/<topic>/deep-dives/deep-dives.json` holds the section `description` and a `dives` list; each dive's content is in `deep-dives/<dive>/` as `meta.json` (sections, hours, `storageKey`, `basePath`) plus one HTML fragment per section, rendered with `set:html` and styled by `StudyProse.astro`. Tick boxes (`input[data-key]`) save to the browser's localStorage under the dive's `storageKey` (`src/lib/studyProgress.ts`); `DiveCard.astro` counts the ticks.
  - **One dive vs several**: while `dives` has a single entry, the topic hub shows that dive's card and links straight to it, and the "Deep dives" crumb is hidden. With more than one, the hub shows a single "Deep dives" card linking to `deep-dives/` (the list page, which shows the description). To add a dive: add its entry to `deep-dives.json`, create `deep-dives/<dive>/` (meta + fragments) and its page files under `src/pages/research/<topic>/deep-dives/<dive>/` (copy `latenttom/index.astro` and `[section].astro`; they currently read `latenttom`'s folder), and set `deep_dive: "<dive>"` on the source paper in `papers.json` to show a button on its reading-list card.
  - Paper `status` is `unread`, `reading` or `read`, and it feeds the Progress panel.
- **Layouts**: `BaseLayout.astro` (head, header, sidebar drawer, footer; daisyUI theme set via `data-theme="sunset"` on `<html>`), `PostLayout.astro` for writs. Pages pass `sideBarActiveItemID`, which `SideBarMenu.astro` matches against menu item `id`s to highlight the active link.
- **Path aliases** (`tsconfig.json`): `@components/*`, `@layouts/*`.
- Static assets (hero images, favicon, `curiosity-articles.json`) live in `public/` and are referenced by absolute path, e.g. `heroImage: "/post_img.png"`.
