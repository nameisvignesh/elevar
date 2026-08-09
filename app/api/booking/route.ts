import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { createGoogleCalendarEvent } from '@/lib/googleCalendar';

function buildICSContent({
  bookingId,
  name,
  email,
  date,
  time,
  meetLink,
  phone,
  role,
}: {
  bookingId: string;
  name: string;
  email: string;
  date: string;
  time: string;
  meetLink: string;
  phone?: string;
  role?: string;
}) {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);

  // Time in IST (UTC+5:30), convert to UTC timestamp
  const startMs = Date.UTC(year, month - 1, day, hours, minutes) - (5.5 * 60 * 60 * 1000);
  const startDate = new Date(startMs);
  const endDate = new Date(startMs + (30 * 60 * 1000));

  const formatICSDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const startStr = formatICSDate(startDate);
  const endStr = formatICSDate(endDate);
  const nowStr = formatICSDate(new Date());

  const cleanName = name.replace(/[,\n\r]/g, ' ');
  const cleanRole = (role || 'Founder').replace(/[,\n\r]/g, ' ');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Elevar Studio//Google Booking Engine//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${bookingId}@elevardigitalstudio.com`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:Elevar Strategy Call - ${cleanName}`,
    `DESCRIPTION:30-minute Strategy Call with ${cleanName} (${cleanRole})\\nClient Email: ${email}\\nPhone: ${phone || 'N/A'}\\nGoogle Meet: ${meetLink}`,
    `LOCATION:${meetLink}`,
    `ORGANIZER;CN=Elevar Studio:mailto:elevardigitalstudio@gmail.com`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=Elevar Team:mailto:elevardigitalstudio@gmail.com`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=${cleanName};RSVP=TRUE:mailto:${email}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Strategy Call starting in 15 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, website, role, revenue, brandGoal, frustration, date, time } = body;

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { success: false, error: 'Name, email, date, and time are required fields.' },
        { status: 400 }
      );
    }

    const bookingId = `ELV-GB-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const timestamp = new Date().toISOString();
    const targetEmail = 'elevardigitalstudio@gmail.com';
    const fallbackMeetLink = `https://meet.google.com/elv-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
    let meetLink = fallbackMeetLink;
    let calendarBooked = false;
    let calendarHtmlLink: string | undefined;
    let calendarEventId: string | undefined;
    let emailResult: any = null;
    let icsContent = '';
    let calendarErrorMessage: string | null = null;

    const hasGoogleCredentials = Boolean(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
    );

    console.log('Booking route credentials:', {
      hasGoogleCredentials,
      accountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'set' : 'missing',
      subject: process.env.GOOGLE_SERVICE_ACCOUNT_SUBJECT || targetEmail
    });

    if (hasGoogleCredentials) {
      try {
        const googleEvent = await createGoogleCalendarEvent({
          bookingId,
          name,
          email,
          phone,
          role,
          date,
          time,
          calendarId: targetEmail,
          subject: process.env.GOOGLE_SERVICE_ACCOUNT_SUBJECT || targetEmail,
          timezone: 'Asia/Kolkata'
        });

        calendarBooked = true;
        calendarEventId = googleEvent.eventId;
        calendarHtmlLink = googleEvent.htmlLink;
        meetLink = googleEvent.meetLink ?? fallbackMeetLink;
      } catch (calendarError: any) {
        calendarErrorMessage = calendarError?.message || String(calendarError);
        console.warn('Google Calendar event creation failed, falling back to email/ICS dispatch:', calendarErrorMessage);
      }
    }

    const subject = `📅 Strategy Call Calendar Reminder [${bookingId}] - ${name}`;
    const textContent = `
New Strategy Call Booking Received!

Booking ID: ${bookingId}
Client Name: ${name}
Client Email: ${email}
Client Phone: ${phone || 'Not provided'}
Website/Social: ${website || 'Not provided'}
Role: ${role || 'Not specified'}
Revenue Stage: ${revenue || 'Not specified'}
Brand Goal: ${brandGoal || 'None provided'}
Frustration: ${frustration || 'None provided'}

Scheduled Date: ${date}
Scheduled Time: ${time} IST
Google Meet Link: ${meetLink}

An automatic iCalendar (.ics) invite has been attached and sent to ${targetEmail} so Google Calendar can ingest the booking.
    `.trim();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #333; padding: 24px; background: #0d0d0d; color: #fff; border-radius: 12px;">
        <h2 style="color: #00b4d8; margin-top: 0;">📅 New Strategy Call Booking & Calendar Invite</h2>
        <p style="color: #ccc;">A new call has been scheduled on <strong>Elevar Google Bookings Engine</strong>.</p>
        <hr style="border-color: #333;" />
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; color: #eee;">
          <tr><td style="padding: 8px 0; color: #888; width: 140px;">Booking ID:</td><td style="font-weight: bold; color: #00b4d8;">${bookingId}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Scheduled Date:</td><td><strong>${date} at ${time} IST</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Meet Link:</td><td><a href="${meetLink}" target="_blank" style="color: #10b981;">${meetLink}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Client Name:</td><td><strong>${name}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Client Email:</td><td><a href="mailto:${email}" style="color: #00b4d8;">${email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Client Phone:</td><td>${phone || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Website:</td><td>${website || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Role:</td><td>${role || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Revenue Stage:</td><td>${revenue || 'N/A'}</td></tr>
        </table>
        <hr style="border-color: #333; margin-top: 20px;" />
        <p style="font-size: 13px; color: #00b4d8; margin-bottom: 0;">An iCalendar (.ics) invite is attached. Accepting it in Gmail will automatically save it into your Google Calendar.</p>
      </div>
    `;

    if (!calendarBooked) {
      icsContent = buildICSContent({
        bookingId,
        name,
        email,
        date,
        time,
        meetLink,
        phone,
        role
      });

      emailResult = await sendEmail({
        to: targetEmail,
        cc: email,
        replyTo: email,
        subject,
        text: textContent,
        html: htmlContent,
        icalEvent: {
          filename: `elevar-booking-${bookingId}.ics`,
          method: 'REQUEST',
          content: icsContent
        },
        attachments: [
          {
            filename: `elevar-booking-${bookingId}.ics`,
            content: icsContent,
            contentType: 'text/calendar; method=REQUEST; charset=UTF-8'
          }
        ]
      });
    } else {
      emailResult = { sent: true, method: 'calendar', message: 'Google Calendar event created and invites sent by Google.' };
    }

    return NextResponse.json({
      success: true,
      bookingId,
      recipient: targetEmail,
      cc: email,
      scheduledDate: date,
      scheduledTime: `${time} IST`,
      meetLink,
      timestamp,
      calendarBooked,
      calendarEventId,
      calendarHtmlLink,
      calendarErrorMessage,
      emailResult,
      icsContent,
      message: calendarBooked
        ? `Google Booking created successfully. A calendar invite was sent to ${targetEmail} and ${email}.`
        : `Booking details dispatched to ${targetEmail} with a copy to ${email}. A Google Calendar invitation has been attached to the email.`
    });
  } catch (error: any) {
    console.error('Error processing Google Booking:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process booking request' },
      { status: 500 }
    );
  }
}
