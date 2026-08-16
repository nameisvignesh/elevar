import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Sender identity. `onboarding@resend.dev` is Resend's SHARED sandbox domain and
// only works in Resend *test mode* (test API keys) and only when the recipient is
// the email on your Resend account. For real sending you MUST verify your own
// domain in Resend and set RESEND_FROM to something like `careers@yourdomain.com`.
const DEFAULT_FROM = 'Elevar Career <onboarding@resend.dev>';

const ACCEPTED_EXTENSIONS = ['pdf', 'doc', 'docx', 'html', 'htm'];
const MAX_PORTFOLIO_BYTES = 1.5 * 1024 * 1024;

function getExtension(filename: string): string {
  const idx = filename.lastIndexOf('.');
  if (idx === -1) return '';
  return filename.slice(idx + 1).toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY');
      return NextResponse.json(
        { error: 'Email service not configured (RESEND_API_KEY missing)' },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const name = (formData.get('name') as string) || '';
    const email = (formData.get('email') as string) || '';
    const linkedin = (formData.get('linkedin') as string) || '';
    const location = (formData.get('location') as string) || '';
    const role = (formData.get('role') as string) || '';
    const portfolioFile = formData.get('portfolio') as File | null;

    if (!name || !email || !role || !portfolioFile) {
      return NextResponse.json(
        { error: 'Missing required fields (name, email, role, portfolio).' },
        { status: 400 }
      );
    }

    // Validate file server-side too (client validation can be bypassed).
    const ext = getExtension(portfolioFile.name);
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `Unsupported portfolio file type: .${ext || 'unknown'}.` },
        { status: 400 }
      );
    }
    if (portfolioFile.size > MAX_PORTFOLIO_BYTES) {
      return NextResponse.json(
        { error: 'Portfolio file exceeds the 1.5MB limit.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await portfolioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64File = buffer.toString('base64');

    const from = process.env.RESEND_FROM || DEFAULT_FROM;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from,
      // `replyTo` lets you reply straight to the applicant, regardless of the From domain.
      replyTo: email,
      to: ['elevardigitalstudio@gmail.com'],
      subject: `Career Application: ${role} - ${name}`,
      html: `
        <h2>New Career Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Target Role:</strong> ${role}</p>
        <p><strong>LinkedIn:</strong> ${linkedin || 'N/A'}</p>
        <p><strong>Location:</strong> ${location || 'N/A'}</p>
        <p><strong>Portfolio File:</strong> ${portfolioFile.name}</p>
      `,
      attachments: [
        {
          filename: portfolioFile.name,
          content: base64File,
        },
      ],
    });

    if (error) {
      // Surface the REAL Resend error so the failure is never a mystery again.
      console.error('Resend error:', error);
      const message =
        typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : String(error);
      return NextResponse.json(
        { error: `Email provider rejected the send: ${message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
