<h1 align="center">Elevar</h1>

<p align="center">
  <strong>Video that moves your business.</strong><br />
  Strategic content systems for founders and growing brands.
</p>

<p align="center">
  <a href="https://nameisvignesh.github.io/elevar/">Visit the live website</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-black?logo=next.js&logoColor=white" alt="Next.js 14.2" />
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white" alt="React 18.3" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5.6" />
  <img src="https://img.shields.io/badge/Deploy-GitHub%20Pages-222222?logo=githubpages&logoColor=white" alt="GitHub Pages" />
</p>

---

## About Elevar

Elevar is a creative studio focused on helping founders and brands turn strong ideas into a consistent content system. Its work spans planning, production, editing, publishing, and performance review. The website introduces the studio, explains its production process and services, showcases vertical video work, shares partner feedback, and provides paths to request a strategy call or apply to join the team.

The visual identity is deliberately restrained: a black-and-white palette, Poppins typography, a persistent light/dark theme control, soft background lighting, and a subtle cursor-following glow. The responsive layout is designed to keep the work and service information easy to scan on desktop and mobile.

## Website tour

### Home

The home page opens with **“Video that moves your business.”** It describes Elevar’s approach as a content system that carries an idea from the first script through the final cut and what comes next. Visitors can request a free strategy call or jump to the portfolio.

The page then introduces the studio’s workflow, services, selected work, production toolkit, founder story, partner feedback, and a final strategy-call invitation.

### The 8-step system

The process section explains how a project moves from discovery to performance review:

1. **Business Discovery** — clarify goals, offer, ideal customer, conversion gaps, and brand voice.
2. **Strategy** — set positioning, hooks, repeatable themes, and offer clarity.
3. **Script Writing** — shape scripts around retention, authority, and action.
4. **Pre-Production** — prepare shot lists, references, assets, and timelines.
5. **Production** — guide capture with practical lighting, clean frames, and energetic pacing.
6. **Post Production** — edit picture and sound, color, add motion graphics, and prepare platform-ready exports.
7. **Publishing** — coordinate optimization, thumbnails, captions, scheduling, and rollout.
8. **Growth Analysis** — review performance and use the findings to improve the next cycle.

### Services

The **Full-Stack Solutions** section presents six ways Elevar can work with a client:

- **Video Editing** — retention-focused editing that makes each idea easier to understand.
- **Content Strategy** — custom roadmaps for founders who want authority without content chaos.
- **AI Production** — AI-assisted scripts, ideation, research, and campaign systems guided by human judgment.
- **Social Management** — calendar planning, publishing, and platform care.
- **Brand Content** — conversion-minded content for products and services.
- **Custom Bundle** — a tailored mix for specific growth goals, beginning with a strategy call.

### Selected work

The home page previews three vertical videos. **More work** opens the full Selected Work page, which includes the additional Reel 6 Out and Final Out videos. Video cards use a portrait **9:16** presentation and show the footage without title overlays. The Elevar mark identifies the preview cards.

The local video files are stored in `public/` and tracked with Git LFS. The GitHub Pages workflow checks out LFS media so the published site receives the actual video files.

### Production toolkit

The **Software Used** row displays logos for After Effects, Premiere Pro, DaVinci Resolve, and CapCut. The **AI for Video Generation** row displays HeyGen, Higgsfield AI, and Google Flow. These brand marks identify tools used in the studio’s production workflow.

### Founder and partner feedback

The founder section introduces **Karthikeyan K, Founder & CEO**, and describes Elevar’s goal of combining creative craft with business outcomes. It highlights the figures shown on the site: **10+ brands scaled**, **100+ growth rate**, and **95% client retention rate**.

The static **What Our Partners Say** card grid shares feedback from JSR Paints, Asanaramana Yoga Center, and Mosa Unisex Saloon.

### Book a call

The booking page offers a free, one-to-one **30-minute strategy session**. A client can provide business details and a proposed date and time. A proposed slot is not confirmed until Elevar replies.

When Clerk and Supabase are configured, clients sign in and submit requests to a private Supabase table. The daily limit is three requests per signed-in account, measured in India Standard Time, so one client can register separate businesses. The optional Google Apps Script integration notifies Elevar, updates a private Google Sheet, attaches an Excel export, and creates a review task. Without the required integrations, the page provides an email-based booking flow instead.

### Careers

The Careers page invites applicants to submit their name, email, target role, optional LinkedIn profile and location, and a portfolio file. Accepted portfolio formats are PDF, DOC, DOCX, and HTML, up to 1.5 MB. With EmailJS configured, the form sends a formatted application email with the portfolio attached. Otherwise, it opens a prefilled email draft and asks the applicant to attach the file before sending.

## Screenshots

| Desktop | Mobile |
| --- | --- |
| ![Elevar desktop website](docs/screenshots/desktop.png) | ![Elevar mobile website](docs/screenshots/mobile1.png) |

![Additional Elevar mobile view](docs/screenshots/mobile2.png)

## Technology

| Area | Technology |
| --- | --- |
| Web framework | Next.js 14 App Router with static export |
| UI | React 18, TypeScript, responsive CSS |
| Typography | Poppins |
| Motion and interaction | Framer Motion, CSS transitions, Intersection Observer |
| Icons | Lucide React |
| Authentication | Clerk client SDK (optional deployment integration) |
| Call requests | Supabase Edge Function and private PostgreSQL table |
| Career applications | EmailJS with a prefilled-email fallback |
| Booking notifications | Google Apps Script, Gmail, Google Sheets, Excel export, and Google Tasks |
| Hosting | GitHub Pages |

## Run locally

Use Node.js and npm, then install the locked dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The development server uses the root path. The production build adds the `/elevar` base path for GitHub Pages.

Create a local `.env.local` from `.env.example` only when working on hosted integrations. See [SETUP_GUIDE.md](SETUP_GUIDE.md) for the configuration steps and service-side credentials.

To create the production static export:

```bash
npm run build
```

Next.js writes the export to `out/`. The Pages workflow builds and deploys this directory when changes are pushed to `main`.

## Repository layout

```text
app/
  page.tsx                    Home page and its sections
  book-call/                  Proposed strategy-call request flow
  career/                     Careers and portfolio application form
  selected-work/              Full vertical-video gallery
  components/                 Navigation, theme, footer, and visual components
  globals.css                 Shared responsive design system
public/
  brands/                     Production software and AI tool logos
  *.mp4                       Portfolio videos (Git LFS)
  founder.jpeg                Founder portrait
  logo.svg                    Elevar logo
supabase/
  functions/book-call/        Clerk token verification and booking handler
  migrations/                 Private request table and daily limit
google-apps-script/
  Code.gs                     Optional booking email, spreadsheet, and task workflow
docs/screenshots/             Desktop and mobile previews
```

## Production integrations

GitHub Pages serves static files and does not run Next.js API routes. The site therefore uses hosted browser and edge services for its optional integrations. The published UI can load without provider credentials, but account sign-in, database-backed booking, and automatic email workflows require setup.

- **Clerk** provides sign-in, sign-up, and the account profile when its publishable key is configured at build time.
- **Supabase** verifies signed-in call requests in an Edge Function and stores them in a private table. Its database migration enforces the three-per-day account limit atomically.
- **Google Apps Script** can send the agency notification, update a private spreadsheet, attach an `.xlsx` export, and create a task for review. The agency must deploy and authorize the script.
- **EmailJS** sends formatted career applications and can send a booking notification backup. It uses public template/service identifiers in the static client; private webhook credentials stay in Supabase secrets.

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for required environment variables, GitHub repository secrets, Supabase setup, EmailJS templates, and Apps Script authorization. Never commit secret keys or tokens to the repository.

## Deployment

The live site is hosted at [nameisvignesh.github.io/elevar](https://nameisvignesh.github.io/elevar/). The GitHub Actions workflow **Deploy Next.js site to Pages** builds the static export and publishes it from `main`. Production builds set the `/elevar` base path and asset prefix in `next.config.mjs`.

The Pages workflow must keep Git LFS enabled when checking out the repository so portfolio videos are included as media rather than LFS pointer files.

---

<p align="center">Built around clear ideas, thoughtful production, and content that moves business forward.</p>
