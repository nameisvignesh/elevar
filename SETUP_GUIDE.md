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
limit is enforced in a database transaction, including concurrent requests.
Each request includes a proposed date and time; Elevar must confirm the slot by
email before it is booked.

1. Create a Supabase project and set the GitHub repository variable
   `NEXT_PUBLIC_SUPABASE_URL` to its project URL. Set the same value locally in
   `.env.local` when testing.
2. In Clerk, copy the issuer URL from the instance's session token (`iss` claim)
   and configure `CLERK_ISSUER_URL` as a Supabase Function secret. The function
   verifies Clerk session tokens against that issuer's JWKS endpoint.
3. Link this repository to the Supabase project and apply **all** migrations:
   `supabase link --project-ref <project-ref>`, then `supabase db push`. This
   creates the private request table, the atomic daily limit, and proposed-slot
   fields. Only the function's service role can write request records.
4. Configure `ALLOWED_ORIGINS` to include
   `https://nameisvignesh.github.io` and any development origins. Set
   `CLERK_ISSUER_URL` as a Supabase Function secret, then deploy with
   `supabase functions deploy book-call`.
5. To send an important email and create a Google Task automatically, create an
   Apps Script project, copy `google-apps-script/Code.gs` into its editor, and
   add the **Tasks API** under Services. In Project Settings, add script
   properties `AGENCY_EMAIL` (`elevardigitalstudio@gmail.com`) and
   `BOOKING_WEBHOOK_TOKEN` (a long random secret). Deploy it as a web app that
   runs as the agency account and accepts requests from anyone; the script
   checks the secret on every request. The owner must authorize Gmail and Tasks
   access. Copy the deployed `/exec` URL.
6. Set Supabase Function secrets `GOOGLE_APPS_SCRIPT_URL` to that `/exec` URL
   and `GOOGLE_APPS_SCRIPT_TOKEN` to the exact same value as
   `BOOKING_WEBHOOK_TOKEN`, then deploy the function again. Keep both values on
   the server; never place them in GitHub Pages/browser variables.
7. As a backup email notification, create an EmailJS booking template with
   fields `name`, `email`, `business_name`, `website`, `service`,
   `project_details`, `proposed_date`, `proposed_time`, and `request_id`. Set
   its recipient to `elevardigitalstudio@gmail.com` and use `email` as
   Reply-To. Add its ID as the GitHub Actions secret
   `NEXT_PUBLIC_EMAILJS_BOOKING_TEMPLATE_ID`.
8. Add `NEXT_PUBLIC_SUPABASE_URL` as a GitHub Actions repository variable and
   rerun the Pages deployment after Clerk, Supabase, and EmailJS are configured.

Until Clerk and Supabase are configured in the build and the function is
deployed, the page shows the email fallback with a date/time picker. Requests
accepted by the function remain stored even if a notification fails. With Apps
Script configured, Elevar receives an email marked important and a Google Task
for each request. Google Tasks stores a due date, not a due time, so the exact
IST time is included in the task title and notes. The task is for review; this
flow does not create a calendar event or confirm the call to the client.

## GitHub Pages build

The Pages workflow builds the static site at `/elevar/` and uploads `out/`.
Portfolio videos are tracked with Git LFS, and checkout must keep `lfs: true` so
the published videos contain their media data instead of pointer files.
