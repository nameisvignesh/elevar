'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Upload, CheckCircle2, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import emailjs from '@emailjs/browser';

type FormState = {
  name: string;
  email: string;
  linkedin: string;
  location: string;
  role: string;
};

const ACCEPTED_EXTENSIONS = ['pdf', 'doc', 'docx', 'html', 'htm'];
const MAX_PORTFOLIO_BYTES = 1.5 * 1024 * 1024;
const APPLICATION_INBOX = 'elevardigitalstudio@gmail.com';
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
const EMAILJS_CONFIGURED = Boolean(
  EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY
);

function getExtension(filename: string): string {
  const idx = filename.lastIndexOf('.');
  if (idx === -1) return '';
  return filename.slice(idx + 1).toLowerCase();
}

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return value.replace(/[&<>"']/g, (character) => entities[character] || character);
}

function careerApplicationEmail(form: FormState, portfolioFilename: string) {
  const subject = `Career application · ${form.role} · ${form.name}`;
  const text = [
    'ELEVAR  |  CAREER APPLICATION',
    '',
    'APPLICANT',
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `Target role: ${form.role}`,
    `LinkedIn: ${form.linkedin || 'Not provided'}`,
    `Location: ${form.location || 'Not provided'}`,
    '',
    'PORTFOLIO',
    `${portfolioFilename} (attached)`,
    '',
    'Reply directly to this email to contact the applicant.',
  ].join('\n');
  const row = (label: string, value: string) =>
    `<tr><td style="width:130px;padding:11px 4px;border-bottom:1px solid #e8ebed;color:#737b80;font-size:12px">${label}</td><td style="padding:11px 4px;border-bottom:1px solid #e8ebed;color:#262b2e;font-size:13px;word-break:break-word">${escapeHtml(value || 'Not provided')}</td></tr>`;
  const html = '<!doctype html><html><body style="margin:0;padding:28px 12px;background:#f2f4f5;font-family:Arial,Helvetica,sans-serif;color:#202326">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fff;border:1px solid #e2e6e8;border-radius:16px;overflow:hidden">' +
    '<tr><td style="padding:24px 30px;border-bottom:1px solid #e8ebed"><div style="font-size:15px;font-weight:700;letter-spacing:.08em">ELEVAR</div><div style="margin-top:7px;color:#70777c;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">Career application</div></td></tr>' +
    '<tr><td style="padding:26px 30px 10px"><h1 style="margin:0;font-size:22px;line-height:1.3">New candidate for ' + escapeHtml(form.role) + '</h1><p style="margin:9px 0 0;color:#626a70;font-size:14px;line-height:1.6">The candidate’s portfolio is attached. Reply to this email to follow up.</p></td></tr>' +
    '<tr><td style="padding:12px 30px 24px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e8ebed">' +
    row('Name', form.name) + row('Email', form.email) + row('Target role', form.role) + row('LinkedIn', form.linkedin) + row('Location', form.location) + row('Portfolio', portfolioFilename) +
    '</table></td></tr><tr><td style="padding:16px 30px;background:#f7f8f8;color:#737b80;font-size:11px;line-height:1.6">This message was submitted through the Elevar careers page.</td></tr>' +
    '</table></td></tr></table></body></html>';
  return { subject, text, html };
}

export default function CareerPage() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', linkedin: '', location: '', role: '' });
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [portfolioName, setPortfolioName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPortfolioFile(null);
      setPortfolioName(null);
      return;
    }

    const ext = getExtension(file.name);
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setPortfolioFile(null);
      setPortfolioName(null);
      setError('Only PDF, Word (.doc/.docx), or HTML files are accepted for your portfolio.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > MAX_PORTFOLIO_BYTES) {
      setPortfolioFile(null);
      setPortfolioName(null);
      setError('Portfolio file must be under 1.5MB. Compress it, or email it directly to elevardigitalstudio@gmail.com.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setError(null);
    setPortfolioFile(file);
    setPortfolioName(file.name);
  }

  const detailsComplete = Boolean(form.name && form.email && form.role && portfolioFile);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!detailsComplete) {
      setError('Please fill in your name, email, and target role, and select your portfolio file.');
      return;
    }

    if (!portfolioFile) {
      setError('Portfolio file is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const emailContent = careerApplicationEmail(form, portfolioFile.name);
      if (EMAILJS_CONFIGURED && formRef.current) {
        const fields = formRef.current.elements;
        (fields.namedItem('application_subject') as HTMLInputElement).value = emailContent.subject;
        (fields.namedItem('reply_to') as HTMLInputElement).value = form.email;
        (fields.namedItem('application_text') as HTMLInputElement).value = emailContent.text;
        (fields.namedItem('application_html') as HTMLInputElement).value = emailContent.html;
        await emailjs.sendForm(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          formRef.current,
          EMAILJS_PUBLIC_KEY
        );
      } else {
        window.location.href = `mailto:${APPLICATION_INBOX}?subject=${encodeURIComponent(
          emailContent.subject
        )}&body=${encodeURIComponent(`${emailContent.text}\n\nPlease attach the selected portfolio file before sending.`)}`;
        setSuccessMessage('Your email draft is ready. Attach your portfolio file before sending.');
        return;
      }

      setForm({ name: '', email: '', linkedin: '', location: '', role: '' });
      setPortfolioFile(null);
      setPortfolioName(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setError(null);
      setSuccessMessage('Application sent successfully with your portfolio attached.');
      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err) {
      setError(
        err instanceof Error
          ? `We couldn’t send your application: ${err.message}`
          : `We couldn’t send your application. Please email ${APPLICATION_INBOX} directly.`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="selected-hero">
      <section className="container" style={{ maxWidth: 860 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36 }}
          className="call-form"
        >
          <div className="section-heading" style={{ marginBottom: 28 }}>
            <span className="eyebrow">Join The Team</span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: 12 }}>
              Build content that <span>converts</span>
            </h1>
            <p style={{ marginTop: 8 }}>
              We&apos;re a small, fast team building content systems for founders. If you ship great work, care about
              storytelling, and love measurable impact — we&apos;d love to see your portfolio.
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="form-grid">
            <input type="hidden" name="application_subject" defaultValue="" />
            <input type="hidden" name="reply_to" defaultValue="" />
            <input type="hidden" name="application_text" defaultValue="" />
            <input type="hidden" name="application_html" defaultValue="" />
            <div className="form-row">
              <div className="field">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="role">Target Role *</label>
                <input
                  id="role"
                  name="role"
                  placeholder="e.g. Video Editor / Motion Designer"
                  value={form.role}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="linkedin">LinkedIn Profile</label>
                <input
                  id="linkedin"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  value={form.linkedin}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                placeholder="City, Country (e.g. Chennai, IST)"
                value={form.location}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="field">
              <label>Portfolio File * (PDF, DOC/DOCX, or HTML)</label>
              <div className="queue-note" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 10 }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text)' }}>
                    {portfolioName ? `Selected: ${portfolioName}` : 'Upload PDF, Word, or HTML (max 1.5MB)'}
                  </span>
                  <label className="btn btn-secondary compact" style={{ cursor: 'pointer', margin: 0, opacity: isSubmitting ? 0.6 : 1, pointerEvents: isSubmitting ? 'none' : 'auto' }}>
                    <Upload size={14} />
                    <span>Browse File</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="portfolio"
                      accept=".pdf,.doc,.docx,.html,.htm,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/html"
                      onChange={handleFile}
                      disabled={isSubmitting}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="form-success" role="status">
                ✓ {successMessage}
              </div>
            )}

            {!EMAILJS_CONFIGURED && (
              <p className="form-note">
                Your email app will open with the application details. Attach the portfolio file before sending.
              </p>
            )}

            <div style={{ marginTop: 12 }}>
              <Button
                type="submit"
                size="lg"
                className="btn-elevar"
                disabled={!detailsComplete || isSubmitting}
                style={{ width: '100%' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={16} className="animate-spin" /> Sending...
                  </>
                ) : detailsComplete ? (
                  EMAILJS_CONFIGURED ? 'Send Application' : 'Open Email Draft'
                ) : (
                  <>
                    <CheckCircle2 size={16} /> Complete the required fields
                  </>
                )}
              </Button>
            </div>

            <p style={{ margin: '12px 0 0', fontSize: '0.82rem', color: 'var(--muted)', textAlign: 'center' }}>
              {EMAILJS_CONFIGURED ? 'Applications are sent to ' : 'You can email your application to '}{' '}
              <a
                href={`mailto:${APPLICATION_INBOX}`}
                style={{ color: 'var(--primary)', textDecoration: 'underline' }}
              >
                {APPLICATION_INBOX}
              </a>
              .
            </p>
          </form>
        </motion.div>
      </section>
    </main>
  );
}
