# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Elevar** is a single, dark-first marketing site for a content-ROI agency, built as a **statically exported Next.js 14 App Router** site and deployed to **GitHub Pages under the `/elevar` base path**. There is no backend server in production — the only runtime server code is the `/api/career` route (which runs on Vercel-style serverless at build/preview time, but is **not** available on the static GitHub Pages export; the career form therefore only works against a Node/Next server, not the `out/` static deploy).

## Common Commands

```bash
bun install            # install deps (bun.lock is present; CI uses npm)
bun run dev            # next dev -H 0.0.0.0 -p 3000  (http://localhost:3000)
bun run build          # next build -> static export into ./out
bun run start          # next start (preview the prod build, basePath active)
bun run lint           # next lint
```

There is **no test framework** in this repo. The `package.json` `transcode:example` script points to `./scripts/transcode.js`, but that file does not exist (the `scripts/` directory is empty) — do not assume a transcode tool exists.

## Architecture & Non-Obvious Details

### Base path (`/elevar`) is the #1 gotcha
`next.config.mjs` sets `basePath`/`assetPrefix` to `/elevar` **only in production** (`NODE_ENV === 'production'`). In dev they are empty, so links work at root. The consequence:
- `next/link` and `next/image` auto-prefix correctly.
- **Raw URLs do NOT** — inline `<video src>`, poster images, `<a href>`, manifest icons, and the logo referenced in `metadata` all 404 in prod unless wrapped with `withBasePath()` from `lib/paths.ts` (which returns `/elevar<path>` in prod, `''` in dev). Always route static asset URLs (especially those in `app/globals.css` and `app/layout.tsx`) through `withBasePath`. Note `metadata.manifest` is not basePath-aware in Next 14, so the manifest `<link>` is added manually in the layout `<head>`.

### Theme system
Dark-first. The `<html>` element carries a `dark` or `light` class (default `dark`). On load, an inline script in `app/layout.tsx` reads `localStorage['elevar-theme']` and sets the class **before paint** to avoid a flash. `ThemeToggle.tsx` swaps the class and persists the choice. The smooth cross-fade is driven by the `.theme-transition` class, which `ThemeToggle` adds for ~450ms only during a flip so it doesn't fight other transitions. All colors are CSS variables in `app/globals.css` (`:root, html.dark` and `html.light` blocks) — edit the theme there, not per-component.

### Forms & email (intentionally divergent — read before "fixing")
- **Career** (`app/career/page.tsx`): client-side validates file type (`.pdf/.doc/.docx/.html/.htm`) and max 1.5MB, then `POST`s multipart `FormData` to `/api/career`. That route converts the file to base64 and emails it via **Resend** (`RESEND_API_KEY` env) to `elevardigitalstudio@gmail.com`.
- **Book a Call** (`app/book-call/page.tsx`): uses an **embedded Google Form** (`GOOGLE_FORM_EMBED_URL`). The `FORM_CONFIGURED` boolean falls back to a `mailto:` CTA if the URL still contains the placeholder. **There is no Google Calendar / Meet / service-account backend** — `SETUP_GUIDE.md` documents a `/api/booking` Google Meet integration that was removed (see `.claude/WORK.md`). Do not reintroduce it unless asked.
- The `NEXT_PUBLIC_EMAILJS_*` keys in `.env.local` are configured but the EmailJS path is **not currently wired** to a route — the live flow uses Resend (career) + Google Form (booking).

### Chatbot is a keyword router, not an LLM
`app/chat/page.tsx` and `ChatbotButton.tsx` (which just routes to `/chat`) do **no** network/AI calls. The chat page maps a few hardcoded keyword sets (services, timeline, founders, book) to `router.push(...)` destinations and otherwise shows a canned message. It is purely client-side string matching.

### 3D hero
`app/components/HeroScene.tsx` renders a three.js blob via `@react-three/fiber` + `drei`. The `<Canvas>` has `pointer-events: none`, so mouse parallax is tracked manually via a `window` `pointermove` listener. Rendering is gated: `frameloop` is `"never"` (static single frame) when the user prefers reduced motion or when an `IntersectionObserver` reports the hero is off-screen — important for performance, keep that gating if you touch the hero.

### Design system
- shadcn/ui-style primitives live in `components/ui/` (button, card, input, etc.), generated via the config in `components.json`. `cn()` in `lib/utils.ts` merges classes (`clsx` + `tailwind-merge`).
- Styling is a hybrid: Tailwind utilities **plus** a large set of hand-written component classes in `app/globals.css` (e.g. `.hero-*`, `.process-*`, `.testimonial-marquee`, `.video-card`). When adding sections, follow the existing class-naming convention there rather than only Tailwind utilities.
- Font is **Poppins** loaded via `next/font/google` in the layout. A grain overlay (inline SVG turbulence, `body::before`/`body::after`) is applied site-wide for a film finish.

### Media & Git LFS
Portfolio/hero videos (`*.mp4`, `*.mov`, `*.avi`, `*.mkv`, `assets/selected-work/*.mp4`, `.*mp4`) are tracked via **Git LFS** (`.gitattributes`). The GitHub Actions workflow (`nextjs.yml`) checks out with `lfs: true`; without LFS the export would ship 132-byte pointer files instead of real video. If you add/replace videos, ensure they are committed through LFS or they will break in the static export.

### Static export constraints
Because `output: 'export'`, there are no dynamic server routes beyond what's prerendered, no `getServerSideProps`, and `images.unoptimized: true`. Any new interactive server logic must follow the career-route pattern (client fetch → API route) and remember it will only run where a Next server is active, not on the GitHub Pages `out/` deploy.
