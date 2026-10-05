# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A personal portfolio styled as a sports video-game main menu (FIFA / NBA 2K feel). Next.js 16 App Router + TypeScript + Tailwind CSS v4 + Framer Motion, deployed on Vercel. Every page is statically prerendered. The only server code is `app/api/contact/route.ts`. Keep dependencies lean: no physics, confetti or audio libraries (all of that is hand-rolled in `lib/`), and no extra UI kits.

## Commands

```
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # ESLint (eslint-config-next incl. react-hooks v7 compiler rules)
npm run typecheck  # tsc --noEmit
```

No test suite. Verify interactive changes in a browser (Playwright is available globally in cloud sessions).

## Structure

- `data/`: **all editable content** (profile, menu/site copy, projects, fun items). Components read from here; never hard-code personal content in components. Bracketed markers like `[EMAIL]`, `[LINKEDIN_URL]` and `[DOMAIN_TO_BE_PROVIDED]`, plus "Placeholder" text, are intentional and filled in by the site owner.
- `app/`: one route folder per screen (`about`, `projects`, `fun`, `contact`), plus metadata files (`opengraph-image.tsx`, `icon.svg`, `apple-icon.tsx`, `manifest.ts`, `robots.ts`, `sitemap.ts`). `template.tsx` wraps every screen for the enter animation.
- `components/providers/`: `SoundProvider` (Web Audio synth, off by default, `useSyncExternalStore` over localStorage), `TransitionProvider` (stripe-wipe screen transitions, `navigate()`), `GamepadBridge` (maps the Gamepad API onto synthetic key events).
- `components/GameLink.tsx`: use instead of `next/link` for internal navigation so the wipe plays.
- `components/Hud.tsx`: sticky top chrome on every screen: status strip, sound toggle, FIFA-style tab bar; handles Esc→menu and Q/E tab switching.
- `components/PromptBar.tsx`: fixed bottom controller prompts ("Select", clickable "Back"), the Now Playing bar and the wordmark.
- `components/NowPlaying.tsx` + `lib/soundcloud.ts`: SoundCloud radio driven by `data/music.ts`. Uses the official embed + Widget API, lazy-loaded on first play, player kept visible for attribution. Never self-host or download songs.
- `components/GameBackground.tsx`: fixed purple arena backdrop with brush-stroke art (`art={false}` on sub-screens).
- `components/ScreenShell.tsx`: frame for sub-screens (accent, themed backdrop, title, focus on arrival).
- `lib/`: `sound.ts`, `confetti.ts`, `spatial.ts` (arrow-key spatial nav), `contact.ts` (shared validation), `usePersistentNumber.ts`, `site.ts` (site URL resolution).

## Conventions

- Visual direction: FIFA 21 menu. Flat indigo/purple surfaces, thin light borders, square corners (radius tokens are overridden to 1–4px), selection = solid purple fill + white rim, no glows or glassy shadows, Barlow Condensed uppercase display type with Barlow body text. Don't reintroduce neon glows, tiny widely-tracked micro-labels or emoji-as-icons.
- Design tokens are in `app/globals.css` (`@theme`). Section accents switch with `data-accent="soccer|basketball|swim|contact|github|linkedin"`; inside, use `text-accent`, `bg-accent/20`, etc. Reusable component classes (`panel`, `btn-game`, `keycap`, …) live in `@layer components` so utilities can override them. Don't name custom classes after theme colors (e.g. `bg-pool`), because they collide with Tailwind utilities.
- `body` is transparent on purpose so fixed `-z-10` backdrops render; the page colour comes from `html`.
- First paint must not depend on JS. Use CSS animations for entrances; avoid Framer Motion `initial` hidden states on server-rendered content. Use `m.*` components (LazyMotion `strict`), never `motion.*`.
- Respect `prefers-reduced-motion`: CSS handles ambient animation; games check `useReducedMotion()` and resolve instantly.
- Mini-games must never gate content. Anything they reveal must also be reachable without playing.
- Values rendered from `Math.sin`/random math into SVG must be rounded (`toFixed`) to avoid hydration mismatches.
- `react-hooks` lint rules forbid `setState` synchronously inside effects and impure calls (`performance.now`, `Math.random`) during render. Keep those in handlers and timers.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
