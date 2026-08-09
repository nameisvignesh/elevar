import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      linkedin,
      location,
      role,
      portfolioName,
      portfolioBase64,
      applicationId,
    } = body;

    // Validate required fields
    if (!name || !email || !role || !portfolioBase64) {
      return NextResponse.json(
        { message: 'Missing required application fields.' },
        { status: 400 }
      );
    }

    // Configure Nodemailer transporter with Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'elevardigitalstudio@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Convert base64 string back into a Buffer for the file attachment
    const fileBuffer = Buffer.from(portfolioBase64, 'base64');

    // Mail configuration
    const mailOptions = {
      from: `"Elevar Career Portal" <${process.env.GMAIL_USER || 'elevardigitalstudio@gmail.com'}>`,
      to: 'elevardigitalstudio@gmail.com',
      replyTo: email,
      subject: `[Application ${applicationId}] ${role} - ${name}`,
      text: `
New Job Application Received!

Application ID: ${applicationId}
Role: ${role}

Applicant Details:
------------------
Name: ${name}
Email: ${email}
Location: ${location || 'Not provided'}
LinkedIn: ${linkedin || 'Not provided'}

Portfolio file attached: ${portfolioName}
      `,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
          <h2 style="color: #0077b6; margin-bottom: 4px;">New Job Application</h2>
          <p style="color: #64748b; margin-top: 0;">Application ID: <strong>${applicationId}</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; width: 120px;"><strong>Role:</strong></td>
              <td style="padding: 8px 0;">${role}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;"><strong>Name:</strong></td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;"><strong>Location:</strong></td>
              <td style="padding: 8px 0;">${location || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;"><strong>LinkedIn:</strong></td>
              <td style="padding: 8px 0;">${linkedin ? `<a href="${linkedin}">${linkedin}</a>` : 'Not provided'}</td>
            </tr>
          </table>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 13px; color: #64748b;">
            📎 Portfolio file <strong>${portfolioName}</strong> is attached to this email.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: portfolioName,
          content: fileBuffer,
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Application submitted successfully.', applicationId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Failed to send career application email:', error);
    return NextResponse.json(
      { message: error?.message || 'Failed to send email. Please try again.' },
      { status: 500 }
    );
  }
}