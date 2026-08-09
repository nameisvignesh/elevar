import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    let name: string | undefined;
    let email: string | undefined;
    let linkedin: string | undefined;
    let portfolioName: string | undefined;
    let location: string | undefined;
    let role: string | undefined;
    let attachment: { filename: string; buffer: Buffer; contentType?: string } | null = null;

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      name = (formData.get('name') as string) || undefined;
      email = (formData.get('email') as string) || undefined;
      linkedin = (formData.get('linkedin') as string) || undefined;
      location = (formData.get('location') as string) || undefined;
      role = (formData.get('role') as string) || undefined;
      const fileField = formData.get('portfolio') || formData.get('resume');
      if (fileField && typeof (fileField as any).arrayBuffer === 'function') {
        const f: any = fileField;
        const arrayBuffer = await f.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filename: string = f.name || f.filename || 'portfolio-file';
        portfolioName = filename;
        attachment = {
          filename,
          buffer,
          ...(f.type ? { contentType: f.type } : {}),
        };
      }
    } else {
      const body = await req.json();
      name = body.name;
      email = body.email;
      linkedin = body.linkedin;
      portfolioName = body.resumeName || body.portfolioName;
      location = body.location;
      role = body.role;
    }

    if (!name || !email || !linkedin || !location || !role) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    // Generate unique application reference ID
    const applicationId = `ELV-CAREER-${Date.now().toString(36).toUpperCase()}`;
    const timestamp = new Date().toISOString();
    const destinationEmail = 'elevardigitalstudio@gmail.com';

    const subject = `💼 New Career Registration [${applicationId}] - ${name} (${role})`;
    const textContent = `
  New Candidate Registration Received!

  Application ID: ${applicationId}
  Date & Time: ${timestamp}

  Candidate Name: ${name}
  Candidate Email: ${email}
  Role Applied For: ${role}
  LinkedIn Profile: ${linkedin}
  Location Address: ${location}
  Portfolio File Name: ${portfolioName || 'Uploaded'}

  Target Recipient: ${destinationEmail}
    `.trim();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #333; padding: 24px; background: #0d0d0d; color: #fff; border-radius: 12px;">
        <h2 style="color: #00b4d8; margin-top: 0;">💼 New Career Registration</h2>
        <p style="color: #ccc;">A new candidate has registered to work at <strong>Elevar Studio</strong>.</p>
        <hr style="border-color: #333;" />
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; color: #eee;">
          <tr><td style="padding: 8px 0; color: #888; width: 140px;">Application ID:</td><td style="font-weight: bold; color: #00b4d8;">${applicationId}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Candidate Name:</td><td><strong>${name}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Candidate Email:</td><td><a href="mailto:${email}" style="color: #00b4d8;">${email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Role Chosen:</td><td><strong>${role}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #888;">LinkedIn Profile:</td><td><a href="${linkedin}" target="_blank" style="color: #38bdf8;">${linkedin}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Location Address:</td><td>${location}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Portfolio File:</td><td>${portfolioName || 'Attached'}</td></tr>
        </table>
        <hr style="border-color: #333; margin-top: 20px;" />
        <p style="font-size: 12px; color: #666; margin-bottom: 0;">Sent via Elevar Studio Candidate Portal to ${destinationEmail}</p>
      </div>
    `;

    const attachments = attachment
      ? [{ filename: attachment.filename, content: attachment.buffer, contentType: attachment.contentType }]
      : undefined;

    const emailResult = await sendEmail({
      to: destinationEmail,
      replyTo: email,
      subject,
      text: textContent,
      html: htmlContent,
      attachments,
    });

    return NextResponse.json({
      success: true,
      message: 'Application registered successfully.',
      applicationId,
      timestamp,
      destinationEmail,
      emailResult,
      details: {
        name,
        email,
        linkedin,
        resumeName: portfolioName || 'Portfolio provided',
        attachment: attachment ? { filename: attachment.filename, size: attachment.buffer.length } : undefined,
        location,
        role
      }
    });
  } catch (error: any) {
    console.error('Error processing career submission:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process career application. Please try again.' },
      { status: 500 }
    );
  }
}
