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

The booking page requires a signed-in Clerk account and saves each request to a
private Supabase table. An account can submit three requests per India Standard
Time day, so one client can register requests for multiple businesses. The
limit is enforced in a database transaction, including when submissions arrive
at the same time.

1. Create a Supabase project and set the GitHub repository variable
   `NEXT_PUBLIC_SUPABASE_URL` to its project URL. Set the same value locally in
   `.env.local` when testing.
2. In Clerk, copy the issuer URL from the instance's session token (`iss` claim)
   and configure `CLERK_ISSUER_URL` as a Supabase Function secret. The function
   verifies Clerk session tokens against that issuer's JWKS endpoint.
3. Apply `supabase/migrations/20261013000000_book_call_requests.sql` to the
   project. The `private.book_call_requests` table has no client access; only
   the function's service role can create entries.
4. Link this repository to the Supabase project and deploy the function:
   `supabase link --project-ref <project-ref>`, `supabase db push`, then
   `supabase functions deploy book-call`.
5. Set Supabase Function secrets `CLERK_ISSUER_URL` to the Clerk session token
   issuer and `ALLOWED_ORIGINS` to include `https://nameisvignesh.github.io` and
   any development origins. Deploy the function again after setting them.
6. Create a second EmailJS template for booking requests with template values
   `name`, `email`, `business_name`, `website`, `service`, `project_details`,
   and `request_id`; set its recipient to `elevardigitalstudio@gmail.com` and
   use `email` as Reply-To. Add its ID as the GitHub Actions secret
   `NEXT_PUBLIC_EMAILJS_BOOKING_TEMPLATE_ID`.
7. Add `NEXT_PUBLIC_SUPABASE_URL` as a GitHub Actions repository variable and
   rerun the Pages deployment after the Clerk publishable key and EmailJS
   service, public key, and booking template ID are configured.

Until Clerk and Supabase are configured in the build and the function is
deployed, the page shows the email contact fallback. Requests accepted by the
function remain stored in Supabase even if the EmailJS notification fails.

## GitHub Pages build

The Pages workflow builds the static site at `/elevar/` and uploads `out/`.
Portfolio videos are tracked with Git LFS, and checkout must keep `lfs: true` so
the published videos contain their media data instead of pointer files.
