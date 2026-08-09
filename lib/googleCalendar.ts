import { google } from 'googleapis';

interface CreateCalendarEventParams {
    bookingId: string;
    name: string;
    email: string;
    phone?: string;
    role?: string;
    date: string;
    time: string;
    calendarId?: string;
    subject?: string;
    timezone?: string;
}

export interface GoogleCalendarEventResult {
    eventId: string;
    htmlLink?: string;
    meetLink?: string;
}

function formatDateTime(date: string, time: string) {
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const pad = (value: number) => String(value).padStart(2, '0');

    const start = `${date}T${pad(hours)}:${pad(minutes)}:00`;
    const totalMinutes = hours * 60 + minutes + 30;
    const dayOffset = Math.floor(totalMinutes / 1440);
    const endMinutesOfDay = totalMinutes % 1440;
    const endHour = Math.floor(endMinutesOfDay / 60);
    const endMinute = endMinutesOfDay % 60;

    const endDateObj = new Date(Date.UTC(year, month - 1, day));
    endDateObj.setUTCDate(endDateObj.getUTCDate() + dayOffset);

    const endDate = `${pad(endDateObj.getUTCFullYear())}-${pad(endDateObj.getUTCMonth() + 1)}-${pad(endDateObj.getUTCDate())}`;
    const end = `${endDate}T${pad(endHour)}:${pad(endMinute)}:00`;

    return { start, end };
}

export async function createGoogleCalendarEvent({
    bookingId,
    name,
    email,
    phone,
    role,
    date,
    time,
    calendarId,
    subject,
    timezone = 'Asia/Kolkata'
}: CreateCalendarEventParams): Promise<GoogleCalendarEventResult> {
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
        throw new Error('Google Calendar service account credentials are not configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.');
    }

    const key = privateKey.replace(/\\n/g, '\n');
    const jwtOptions: any = {
        email: clientEmail,
        key,
        scopes: ['https://www.googleapis.com/auth/calendar']
    };

    // Only set `subject` (impersonation) when explicitly provided. Domain-wide delegation
    // must be enabled for the service account to impersonate users; otherwise this will fail.
    if (subject) jwtOptions.subject = subject;

    const auth = new google.auth.JWT(jwtOptions);

    const calendar = google.calendar({ version: 'v3', auth });
    const { start, end } = formatDateTime(date, time);
    const description = [
        `30-minute Strategy Call with ${name}`,
        `Role: ${role || 'Founder'}`,
        `Client Email: ${email}`,
        `Client Phone: ${phone || 'N/A'}`,
        `Booking ID: ${bookingId}`
    ].join('\n');

    const eventBody = {
        summary: `Elevar Strategy Call - ${name}`,
        description,
        location: 'Google Meet',
        start: {
            dateTime: start,
            timeZone: timezone
        },
        end: {
            dateTime: end,
            timeZone: timezone
        },
        attendees: [
            { email: calendarId, responseStatus: 'accepted' },
            { email, responseStatus: 'needsAction' }
        ],
        conferenceData: {
            createRequest: {
                requestId: bookingId,
                conferenceSolutionKey: { type: 'hangoutsMeet' }
            }
        },
        reminders: {
            useDefault: false,
            overrides: [{ method: 'popup', minutes: 15 }]
        }
    };

    // Determine which calendar the event should be inserted into. Preference order:
    // 1) explicit `calendarId` param
    // 2) env `GOOGLE_CALENDAR_ID`
    // 3) service account email (service account's own calendar)
    const effectiveCalendarId = calendarId || process.env.GOOGLE_CALENDAR_ID || clientEmail;

    const response = await calendar.events.insert({
        calendarId: effectiveCalendarId,
        requestBody: eventBody,
        conferenceDataVersion: 1,
        sendUpdates: 'all'
    });

    const eventData = response.data;
    const hangoutLink = eventData.hangoutLink;
    const meetLink = hangoutLink ||
        eventData.conferenceData?.entryPoints?.find((entry: any) => entry.entryPointType === 'video')?.uri;

    return {
        eventId: eventData.id || bookingId,
        htmlLink: eventData.htmlLink ?? undefined,
        meetLink: meetLink ?? undefined
    };
}
