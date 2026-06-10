# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A single-page static personal portfolio site deployed on Cloudflare Pages. Plain HTML, CSS, and vanilla JS — **no frameworks, no build step, no npm**. Deploying means uploading the files as-is; keep it that way (the only external dependency allowed is Google Fonts).

## Development

No build or test commands. Preview locally with any static server, e.g.:

```
python3 -m http.server 8000
```

Deployment is Cloudflare Pages with no build command and output directory `/` (Git integration or Direct Upload).

## Structure

- `index.html` — the entire page: sticky nav, hero, About, Projects, Resume, footer. Project cards are `<article class="project-card">` blocks meant to be duplicated by hand to add projects.
- `styles.css` — all styling. Design tokens (colors, fonts, radii, nav height) live in `:root` CSS variables at the top; change the palette there, not inline. Warm light theme: cream background, terracotta accent, Fraunces serif headings + Inter body.
- `script.js` — hamburger menu toggle, nav scroll shadow, IntersectionObserver-driven `.fade-in` animations, footer year.
- `assets/` — user-supplied files referenced by the page: `profile.jpg` (hero photo) and `resume.pdf`.

Placeholder values (`YOUR_USERNAME` in GitHub/LinkedIn URLs, "Your Name", bio text) are intentional and filled in by the site owner.
