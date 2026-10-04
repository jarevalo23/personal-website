# Personal website — FIFA-style main menu

My personal site, built to feel like the main menu of a sports video game. Pick a mode from the menu:

| Mode | Sport | What's inside | Mini-game |
| --- | --- | --- | --- |
| **About Me** | ⚽ Soccer | FUT-style player card, attribute bars, scouting-report bio | Penalty shootout. Each goal unlocks a fun fact. |
| **Projects** | 🏀 Basketball | Projects as hotspots on a shot chart, plus a roster and a detail drawer | Free-throw challenge against a 24-second shot clock |
| **Fun Stuff** | 🏊 Swimming | Hobbies and favorite things laid out in pool lanes | 50m reaction start against 3 AI lanes, with a false-start penalty |
| **Contact** | 🎙️ Post-match | Press-room contact form, copy-to-clipboard email | — |
| **GitHub / LinkedIn** | — | External links | — |

Built with **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion**. Every page is statically prerendered. The only server code is the `/api/contact` route.

---

## Run it locally

Requires **Node.js 20.9+**.

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build (what Vercel runs)
npm run start        # serve the production build
npm run lint         # ESLint (Next.js + React Hooks rules)
npm run typecheck    # TypeScript, no emit
```

---

## Edit your content (no component changes needed)

All personal content lives in **`/data`**:

| File | What it controls |
| --- | --- |
| `data/profile.ts` | Name, jersey number, tagline, **email**, **GitHub/LinkedIn links**, **photo**, card rating/position/nation/club, attribute stats, scouting-report bio, fun facts, contact-page availability |
| `data/site.ts` | **Domain**, SEO title/description, the text on every main-menu tile and screen header |
| `data/projects.ts` | Projects: title, description, tech stack, links, screenshots, and position on the court |
| `data/fun.ts` | Pool-lane items: hobbies, playlists, favorite teams, random facts… |

### Placeholders to fill in

Search for the bracketed markers:

```bash
grep -rn "\[EMAIL\]\|\[LINKEDIN_URL\]\|\[DOMAIN_TO_BE_PROVIDED\]\|\[PHOTO\]\|\[BIO\]\|\[NATION\]\|PLACEHOLDER" data
```

- **`[EMAIL]`**: `profile.email` in `data/profile.ts`
- **`[LINKEDIN_URL]`**: `profile.links.linkedin`
- **`[PHOTO]`**: drop your photo into `public/images/` (for example `profile.jpg`) and set `profile.photo = "/images/profile.jpg"`. A roughly square cut-out PNG looks most like a real FUT card.
- **`[NATION]`**: `profile.card.nation`, with a flag image in `public/images/`
- **`[BIO]`**: `profile.scouting` (headline, summary paragraphs, strengths, attributes, verdict)
- **`[DOMAIN_TO_BE_PROVIDED]`**: `site.domain` in `data/site.ts`. See [Custom domain](#custom-domain).
- **Projects**: the three seed projects in `data/projects.ts` are placeholders, as are their screenshots in `public/images/projects/`.
- **Fun items**: every lane in `data/fun.ts` is a placeholder.

### Adding a project

Copy one object in `data/projects.ts` and edit it. `court: { x, y }` places its hotspot on the half court in percent. `x` runs from the left to the right sideline. `y` runs from the baseline (under the hoop) to half court. The comment at the top of the file lists good spots (paint, elbows, corners, wings, top of the key).

---

## How it plays

- **Main menu:** move with the mouse, arrow keys, or a **game controller** (D-pad or left stick moves, A selects, B goes back). Enter selects. On a phone the tiles stack vertically, and you tap one to play.
- **Back:** every screen has a Back button in the top bar, and **Esc** returns to the menu. Esc inside a form field first leaves the field, so a half-written message is never lost.
- **Sound:** synthesized with the Web Audio API, so there are no audio files. It is **off by default**. The Sound toggle in the top bar turns it on, and the choice is remembered.
- **Intro splash:** the "player loading" card plays once per browser session on the home page. Click, tap, or press any key to skip.
- **Mini-games are optional.** Everything they reveal is also reachable without playing. For example, "Skip the shootout — show all fun facts" lists every fact.
- **Reduced motion:** with `prefers-reduced-motion`, the intro and screen wipes are skipped, ambient animation stops, and the games resolve instantly.

---

## Contact form setup

The form posts to `app/api/contact/route.ts`, which validates the input and blocks bots with a honeypot field. It then delivers the message through whichever provider is configured:

**Option A: Resend (recommended)**

1. Create a free account at [resend.com](https://resend.com) and an API key.
2. Set these environment variables:
   ```
   RESEND_API_KEY=re_...
   CONTACT_TO_EMAIL=you@yourdomain.com          # where messages arrive
   CONTACT_FROM_EMAIL=Press Room <hello@yourdomain.com>   # optional
   ```
   Without `CONTACT_FROM_EMAIL`, mail is sent from `onboarding@resend.dev`. That sender can only deliver to the address you signed up to Resend with. After you connect your domain, verify it in Resend and use an address on it.

**Option B: Formspree (fallback)**

1. Create a form at [formspree.io](https://formspree.io).
2. Set `FORMSPREE_FORM_ID` to the ID from its endpoint (`https://formspree.io/f/<this-part>`).

With **neither** configured, the API answers `503` and the form shows a friendly "email me directly" `mailto:` link instead.

Locally, put the variables in `.env.local` (see `.env.example`). On Vercel, add them under **Project → Settings → Environment Variables**, then redeploy.

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, click **Add New… → Project**, import the repository, and keep the defaults. The framework is detected as Next.js, and no build settings need changing.
3. (Optional) Add the contact-form environment variables above.
4. Click **Deploy**. Every push to the default branch redeploys production, and pull requests get preview URLs.

Until a custom domain is set, metadata (Open Graph URLs, sitemap) uses Vercel's production URL automatically.

---

## Custom domain

Use these steps once you have the domain (`example.com` below stands in for it).

### 1. Add both hostnames in Vercel

In **Project → Settings → Domains**, add `example.com`. When Vercel offers to add `www.example.com` with a redirect, accept it, or add `www.example.com` yourself.

### 2. Create the DNS records at your registrar

Vercel shows the exact values next to each domain. **Copy them from that panel**, because Vercel now issues project-specific values. They will look like this:

| Type | Name / Host | Value |
| --- | --- | --- |
| `A` | `@` (apex) | the IP Vercel shows, usually `76.76.21.21` |
| `CNAME` | `www` | the value Vercel shows, e.g. `xxxxxxxx.vercel-dns-0xx.com` (the older `cname.vercel-dns.com` also works) |

- Delete any other `A`, `AAAA`, or `CNAME` records on `@` and `www` that point elsewhere, such as a registrar parking page.
- If the domain has `CAA` records, add one that allows Let's Encrypt: `0 issue "letsencrypt.org"`.
- **Alternative:** point the domain's nameservers to `ns1.vercel-dns.com` and `ns2.vercel-dns.com`. Vercel then manages all DNS records, and no A or CNAME records are needed.

DNS usually propagates within minutes but can take up to 48 hours. The Domains panel shows **Valid Configuration** when it's done.

### 3. SSL

You don't need to do anything. Once DNS resolves, Vercel issues and auto-renews a Let's Encrypt certificate for both hostnames and redirects HTTP to HTTPS.

### 4. Pick a canonical hostname (www → apex, or the reverse)

In **Settings → Domains**, click **Edit** on the hostname that should *not* be canonical. Set **Redirect to** the other one with **308 Permanent Redirect**. For example, redirect `www.example.com` to `example.com`. Choose one direction only. Never redirect both ways.

### 5. Tell the site its domain

Set `site.domain = "example.com"` in `data/site.ts` (no protocol, no trailing slash), commit, and push. Alternatively, set the `NEXT_PUBLIC_SITE_URL=https://example.com` environment variable. This updates canonical URLs, Open Graph tags, `robots.txt`, and `sitemap.xml`.

---

## Project structure

```
app/
  layout.tsx            fonts, global metadata, providers, top HUD
  template.tsx          screen-enter animation on every navigation
  page.tsx              main menu
  about/ projects/ fun/ contact/   one folder per screen
  api/contact/route.ts  contact form endpoint (Resend / Formspree)
  opengraph-image.tsx   generated social preview card
  icon.svg, apple-icon.tsx, manifest.ts, robots.ts, sitemap.ts, not-found.tsx
components/
  menu/                 MainMenu (spatial keyboard nav), MenuTile, IntroSplash, StadiumBackground
  about/                PlayerCard, StatBars, PenaltyGame, ScoutingReport
  projects/             ProjectsBoard (court + roster), ProjectDialog, FreeThrowGame
  fun/                  PoolLanes, SwimRace
  contact/              ContactForm, CopyEmail
  providers/            Sound, screen transitions, gamepad bridge
  Hud.tsx, ScreenShell.tsx, GameLink.tsx, icons.tsx
data/                   ← all editable content
lib/                    sound synth, confetti, spatial navigation, validation, helpers
public/images/          photo, flag and project screenshots
assets/fonts/           Bebas Neue (OFL), used to render the OG image
```

Design tokens (palette, fonts, easing) are CSS variables in `app/globals.css`. Each section gets its own accent color through `data-accent="soccer|basketball|swim|contact"`.
