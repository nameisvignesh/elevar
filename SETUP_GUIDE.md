# Production integrations

Elevar is exported as a static site to GitHub Pages. Browser integrations must
therefore use hosted providers; Next.js API routes are not available on the live
site.

## Clerk login and signup

1. Create a Clerk application and enable the sign-in methods you want to offer.
2. Add its **publishable key** to the local environment as
   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
3. Add the same value to the GitHub repository secret with that exact name.
4. Rebuild or rerun the **Deploy Next.js site to Pages** workflow.

The navigation uses Clerk's sign-up, sign-in, and user profile components. This
site uses the client integration only; do not add a Clerk secret key to the
browser build.

## Career applications with EmailJS

1. Create an EmailJS email service and a career-application template.
2. Set the template recipient to `elevardigitalstudio@gmail.com` and include
   template fields for `name`, `email`, `role`, `linkedin`, and `location`.
3. In the template's **Attachments** tab, add a **Form File Attachment** whose
   parameter name is `portfolio`.
4. Add the service ID, template ID, and public key locally using the variable
   names in `.env.example`.
5. Add each value as a GitHub repository secret with the same variable name,
   then rebuild or rerun the Pages workflow.

The portfolio upload is limited to 1.5 MB and checked in the browser. Until
EmailJS is configured, the career form opens a prefilled email draft and asks
the applicant to attach their portfolio before sending.

## Book a call

The booking page embeds the existing Google Form and offers a prefilled email
draft if the embedded form does not load. In the Google Form settings, allow
responses from anyone with the link.

## GitHub Pages build

The Pages workflow builds the static site at `/elevar/` and uploads `out/`.
Portfolio videos are tracked with Git LFS, and checkout must keep `lfs: true` so
the published videos contain their media data instead of pointer files.
