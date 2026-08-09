# Google Meet Integration Setup Guide

## What Changed?

The backend API route (`/api/booking`) now:
1. **Creates a Google Calendar event** on `elevardigitalstudio@gmail.com`'s calendar
2. **Auto-generates a Google Meet link** via `conferenceData.createRequest`
3. **Sends calendar email invites** to both the client AND `elevardigitalstudio@gmail.com` via `sendUpdates: 'all'`
4. **Returns the Meet link** to the frontend for display

## Prerequisites

1. **Google Cloud Project** with Google Calendar API enabled
2. **Google Workspace account** (Business Standard or higher) for `elevardigitalstudio@gmail.com`
3. **Service Account** with Domain-Wide Delegation enabled
4. **Authorize the scope** in Google Admin Console:
   - Go to: Security > Access and data control > API controls > Domain-wide delegation
   - Add your service account client ID
   - Add scope: `https://www.googleapis.com/auth/calendar`

## Required NPM Packages

```bash
npm install googleapis uuid
npm install -D @types/uuid
```

## How It Works

| Step | Action | Result |
|------|--------|--------|
| 1 | Client fills form & submits | Frontend calls `/api/booking` |
| 2 | Backend creates Calendar event | Event appears on Elevar's calendar |
| 3 | Backend requests Meet conference | Google auto-generates `meet.google.com/xxx` link |
| 4 | Backend sets `sendUpdates: 'all'` | Gmail sends invites to BOTH emails automatically |
| 5 | Frontend displays Meet link | Client can copy/join immediately |

## Important Notes

- **Meet links are tied to Calendar events** — there is no standalone "create Meet" API. The only supported way to programmatically create a Meet link is by creating a Calendar event with `conferenceData`.
- **Service Account impersonation** is required via `clientOptions: { subject: ELEVAR_EMAIL }` so the event is created on Elevar's calendar, not the service account's calendar.
- **Free Gmail accounts** cannot use service accounts with domain-wide delegation. You need a Google Workspace account.
- If you don't have Workspace, an alternative is using **OAuth2** (user logs in as elevardigitalstudio@gmail.com once, store refresh token).
