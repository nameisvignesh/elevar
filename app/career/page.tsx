'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import {
  isCareerEmailConfigured,
  sendCareerApplication,
  type EmailJSAttachment,
} from '@/lib/emailjs';
import { Button } from '@/components/ui/button';

type FormState = {
  name: string;
  email: string;
  linkedin: string;
  location: string;
  role: string;
};

/** Portfolio files are restricted to PDF, Word docs, or HTML (see WORK.md). */
const ACCEPTED_EXTENSIONS = ['pdf', 'doc', 'docx', 'html', 'htm'];
/**
 * EmailJS free tier has a ~2MB attachment limit, and base64 inflates the file
 * by ~33%, so cap the raw file at 1.5MB to keep the payload under the limit.
 */
const MAX_PORTFOLIO_BYTES = 1.5 * 1024 * 1024;

function getExtension(filename: string): string {
  const idx = filename.lastIndexOf('.');
  if (idx === -1) return '';
  return filename.slice(idx + 1).toLowerCase();
}

export default function CareerPage() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', linkedin: '', location: '', role: '' });
  const [portfolioName, setPortfolioName] = useState<string | null>(null);
  const [portfolioBase64, setPortfolioBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{ applicationId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* Guards against stale FileReader callbacks and duplicate submits. */
  const fileReadId = useRef(0);
  const submittingRef = useRef(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPortfolioName(null);
      setPortfolioBase64(null);
      return;
    }

    const ext = getExtension(file.name);
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setPortfolioName(null);
      setPortfolioBase64(null);
      setError('Only PDF, Word (.doc/.docx), or HTML files are accepted for your portfolio.');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_PORTFOLIO_BYTES) {
      setPortfolioName(null);
      setPortfolioBase64(null);
      setError('Portfolio file must be under 1.5MB. Compress it, or email it directly to elevardigitalstudio@gmail.com.');
      e.target.value = '';
      return;
    }

    setError(null);
    setPortfolioName(file.name);
    const reader = new FileReader();
    const readId = ++fileReadId.current;
    reader.onload = () => {
      if (fileReadId.current !== readId) return; // a newer file was selected since
      const result = reader.result as string;
      const base64 = result.split(',')[1] ?? result;
      setPortfolioBase64(base64);
    };
    reader.onerror = () => {
      if (fileReadId.current !== readId) return;
      setError('Failed to read the file. Try again.');
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.role) {
      setError('Please fill in your name, email, and target role.');
      return;
    }

    if (!portfolioBase64 || !portfolioName) {
      setError('Please upload your portfolio file (PDF, DOC/DOCX, or HTML).');
      return;
    }

    if (!isCareerEmailConfigured()) {
      setError('Email is not configured yet. Please email your application to elevardigitalstudio@gmail.com.');
      return;
    }

    if (submittingRef.current) return; // ignore duplicate rapid clicks
    submittingRef.current = true;
    setLoading(true);

    const applicationId = `ELV-CAREER-${Date.now().toString(36).toUpperCase().slice(-8)}`;

    try {
      const attachment: EmailJSAttachment = {
        name: portfolioName,
        data: portfolioBase64,
      };

      await sendCareerApplication(
        {
          from_name: form.name,
          from_email: form.email,
          reply_to: form.email,
          role: form.role,
          linkedin: form.linkedin,
          location: form.location,
          application_id: applicationId,
          portfolio_name: portfolioName,
          portfolio_note: `Portfolio attached (${portfolioName})`,
        },
        attachment
      );

      setSubmittedResult({ applicationId });
      setForm({ name: '', email: '', linkedin: '', location: '', role: '' });
      setPortfolioName(null);
      setPortfolioBase64(null);
    } catch (err: any) {
      const message =
        err?.text || err?.message || 'Unexpected error while sending the application.';
      setError(
        `Application failed to send (${message}). Please email it directly to elevardigitalstudio@gmail.com.`
      );
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  }

  const mailtoFallback = () =>
    `mailto:elevardigitalstudio@gmail.com?subject=${encodeURIComponent(
      `Application for ${form.role || 'role'} - ${form.name || 'Applicant'}`
    )}&body=${encodeURIComponent(
      `Hi Elevar Team,\n\nI'd like to apply for the ${form.role || ''} role.\n\nName: ${form.name}\nEmail: ${form.email}\nLinkedIn: ${form.linkedin || 'N/A'}\nLocation: ${form.location || 'N/A'}\nPortfolio: attached separately (PDF/DOC/HTML)\n\nThanks!`
    )}`;

  return (
    <main className="selected-hero">
      <section className="container" style={{ maxWidth: 860 }}>
        {!submittedResult ? (
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

            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-row">
                <div className="field">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
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
                />
              </div>

              <div className="field">
                <label>Portfolio File * (PDF, DOC/DOCX, or HTML)</label>
                <div className="queue-note" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 10 }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text)' }}>
                      {portfolioName ? `Selected: ${portfolioName}` : 'Upload PDF, Word, or HTML (max 1.5MB)'}
                    </span>
                    <label className="btn btn-secondary compact" style={{ cursor: 'pointer', margin: 0 }}>
                      <Upload size={14} />
                      <span>Browse File</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.html,.htm,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/html"
                        onChange={handleFile}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {error && (
                <div style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: 4 }}>
                  {error}
                </div>
              )}

              <div style={{ marginTop: 12 }}>
                <Button type="submit" size="lg" className="btn-elevar" disabled={loading} style={{ width: '100%' }}>
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending Application...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </div>

              <p style={{ margin: '12px 0 0', fontSize: '0.82rem', color: 'var(--muted)', textAlign: 'center' }}>
                Your application is automatically emailed to{' '}
                <a
                  href={mailtoFallback()}
                  style={{ color: 'var(--primary)', textDecoration: 'underline' }}
                >
                  elevardigitalstudio@gmail.com
                </a>
              </p>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="call-form"
            style={{ textAlign: 'center', padding: '48px 28px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: 'var(--primary)' }}>
              <CheckCircle2 size={48} />
            </div>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '1.8rem' }}>Application Submitted!</h2>
            <p style={{ color: 'var(--muted)', maxWidth: 560, margin: '0 auto 24px', lineHeight: 1.6 }}>
              Your application and portfolio have been automatically delivered to our inbox. Reference ID: <strong style={{ color: 'var(--text)' }}>{submittedResult.applicationId}</strong>.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <a href="mailto:elevardigitalstudio@gmail.com" className="btn btn-primary">
                <Mail size={14} /> Contact Hiring Team
              </a>
            </div>
          </motion.div>
        )}
      </section>
    </main>
  );
}
