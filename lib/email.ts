import nodemailer from 'nodemailer';

interface SendEmailParams {
  to: string;
  cc?: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  attachments?: Array<{ filename: string; content: Buffer | string; contentType?: string }>;
  icalEvent?: {
    filename?: string;
    method?: string;
    content: string;
  };
}

export async function sendEmail({ to, cc, subject, text, html, replyTo, attachments, icalEvent }: SendEmailParams) {
  const smtpUser = process.env.SMTP_USER || 'elevardigitalstudio@gmail.com';
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpSecure = process.env.SMTP_SECURE !== 'false';

  // Check if SMTP credentials are fully provided
  if (smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions: any = {
        from: `"Elevar Studio Calendar & Bookings" <${smtpUser}>`,
        to,
        cc: cc || undefined,
        replyTo: replyTo || undefined,
        subject,
        text,
        html,
        attachments,
      };

      if (icalEvent) {
        mailOptions.icalEvent = {
          filename: icalEvent.filename || 'invite.ics',
          method: icalEvent.method || 'REQUEST',
          content: icalEvent.content,
        };
      }

      const info = await transporter.sendMail(mailOptions);

      console.log('Email successfully sent via Nodemailer:', info.messageId);
      return { sent: true, method: 'smtp', messageId: info.messageId };
    } catch (err: any) {
      console.error('Nodemailer error sending email:', err);
      return { sent: false, error: err.message || 'SMTP dispatch failed' };
    }
  }

  // If no SMTP_PASS is set, log dispatch log for developer/server inspect
  console.log('================================================================');
  console.log(`[AUTOMATED CALENDAR & EMAIL DISPATCH LOG] Recipient: ${to}`);
  console.log(`[SUBJECT]: ${subject}`);
  if (icalEvent) {
    console.log(`[ICALENDAR EVENT ATTACHED]:\n${icalEvent.content}`);
  }
  console.log(`[CONTENT]:\n${text}`);
  console.log('================================================================');

  return {
    sent: false,
    method: 'logged',
    reason: 'SMTP_PASS environment variable not configured in server environment. Configure SMTP_PASS in .env.example or platform settings for automated background delivery.'
  };
}
