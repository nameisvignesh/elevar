import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const linkedin = formData.get('linkedin') as string;
    const location = formData.get('location') as string;
    const role = formData.get('role') as string;
    const portfolioFile = formData.get('portfolio') as File | null;

    if (!name || !email || !role || !portfolioFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert file to base64 for attachment
    const arrayBuffer = await portfolioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64File = buffer.toString('base64');

    // Send email with attachment
    const { data, error } = await resend.emails.send({
      from: 'Elevar Career <onboarding@resend.dev>',
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
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}