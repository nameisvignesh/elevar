<p align="center">
  <img src="docs/screenshots/desktop.png" alt="Elevar Studio — Desktop Preview" width="100%" />
</p>

<h1 align="center">Elevar 🚀</h1>

<p align="center">
  <strong>Strategic content engines for personal brand growth &amp; elevation.</strong><br />
  We don't just edit videos — we build content that grows your business.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-black?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Three.js-0.185-000000?logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Deployed-GitHub_Pages-222222?logo=githubpages&logoColor=white" alt="GitHub Pages" />
</p>

---

## ✨ What it is

**Elevar** is a content studio for founders and growing brands. The site presents its services, founder story, client feedback, and vertical video work in a quiet, monochrome interface.

> Content ROI Agency · Full-funnel content systems for founders &amp; personal brands.

## 🖼️ UI Preview

<table>
  <tr>
    <td align="center"><strong>Desktop</strong></td>
    <td align="center"><strong>Mobile</strong></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/desktop.png" alt="Desktop view" width="100%" /></td>
    <td><img src="docs/screenshots/mobile1.png" alt="Mobile view 1" width="100%" /></td>
  </tr>
  <tr>
    <td colspan="2" align="center"><img src="docs/screenshots/mobile2.png" alt="Mobile view 2" width="48%" /></td>
  </tr>
</table>

## 🧩 Key Sections

- **Hero** — a direct introduction to Elevar and its content services.
- **Process** — an 8-step engine: Discovery → Strategy → Script → Pre-Prod → Production → Post → Publishing → Growth Analysis.
- **Services** — Video Editing, Content Strategy, AI Production, Social Management, Brand Content, and a Custom Bundle.
- **Selected work** — portrait 9:16 reels, with additional projects on the full portfolio page.
- **Production tools** — software and AI video generation tools used by the team.
- **Testimonials** — a static grid of client feedback.
- **About / Founder** — brand story with founder imagery.
- **Book a Call** — signed-in booking requests, with up to three businesses per account each IST day.
- **Careers** — application form with portfolio attachment and a formatted application email.

## 🎨 Design Highlights

- 🌗 **Light / Dark mode** with a persistent theme toggle.
- 🌊 A subtle animated wave and light texture in both themes.
- 🎞️ **Framer Motion** interactions and scroll reveals.
- 🧱 A monochrome design system built with CSS variables.
- 📱 Fully **responsive** — looks sharp from phone to widescreen.
- 💬 Floating **chatbot button** for instant guidance.

## 🛠️ Tech Stack

| Layer | Tools |
|-------|-------|
| Framework | Next.js 14 (App Router, static export) |
| UI | React 18, Tailwind CSS, Radix UI primitives |
| Motion | Framer Motion |
| Icons | lucide-react |
| Login / signup | Clerk browser SDK |
| Career applications | EmailJS browser SDK with formatted email-draft fallback |
| Booking | Clerk identity, Supabase Edge Function and private request table |
| Booking notifications | Google Apps Script, Gmail, Tasks API and a Google Sheet with an Excel attachment |
| Deploy | GitHub Pages (`/elevar` base path) |

## 🚀 Getting Started

```bash
# install the locked dependencies
npm ci

# run the dev server
npm run dev        # http://localhost:3000

# build the static site (exported to /out)
npm run build
```

> Production integrations, deployment settings, and required GitHub repository secrets are documented in [SETUP_GUIDE.md](SETUP_GUIDE.md) and `.env.example`.

## 📁 Project Structure

```
app/
  page.tsx              # home (hero, process, services, portfolio, about)
  chat/                 # conversational support page
  book-call/            # discovery call capture
  career/               # open roles
  selected-work/        # portfolio detail
  components/           # Navigation, Footer, auth, testimonials, ...
components/ui/          # shared UI primitives
public/                 # logo, founder image, portfolio videos
supabase/
  functions/book-call/  # verifies Clerk identity and stores booking requests
  migrations/           # private booking table and daily request limit
google-apps-script/     # agency email, spreadsheet export and follow-up task
docs/screenshots/       # UI previews
```

## 🌍 Deployment

The site is exported statically and served from [GitHub Pages](https://nameisvignesh.github.io/elevar/) under the `/elevar` path. The `Deploy Next.js site to Pages` workflow builds and publishes `out/` on pushes to `main`. Production builds set `basePath` and `assetPrefix` automatically in `next.config.mjs`.

GitHub Pages does not run Next.js API routes. The booking flow therefore calls a Supabase Edge Function, which verifies Clerk sessions and saves requests in Supabase. The optional Google Apps Script sends Elevar a formatted email, marks it important, updates the agency booking spreadsheet, attaches an Excel export, and creates a review task. See [SETUP_GUIDE.md](SETUP_GUIDE.md) before enabling production integrations.

---

<p align="center">
  Made with ☕ &amp; a lot of <strong>content strategy</strong> by the Elevar team.
</p>
