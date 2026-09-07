'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Upload, CheckCircle2, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

function getExtension(filename: string): string {
  const idx = filename.lastIndexOf('.');
  if (idx === -1) return '';
  return filename.slice(idx + 1).toLowerCase();
}

export default function CareerPage() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', linkedin: '', location: '', role: '' });
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [portfolioName, setPortfolioName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // Send application via API route with file attachment
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('linkedin', form.linkedin || '');
      formData.append('location', form.location || '');
      formData.append('role', form.role);
      formData.append('portfolio', portfolioFile);

      const response = await fetch('/api/career', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send application');
      }

      // Success - show message
      setForm({ name: '', email: '', linkedin: '', location: '', role: '' });
      setPortfolioFile(null);
      setPortfolioName(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setError(null);
      setSuccessMessage('Application sent successfully with portfolio attached!');
      
      // Clear success message after 6 seconds
      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Failed to send application: ${err.message}`
          : 'Failed to send application. Please try again or email directly to elevardigitalstudio@gmail.com'
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
              <div style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: 4 }}>
                {error}
              </div>
            )}

            {successMessage && (
              <div style={{ color: '#22c55e', fontSize: '0.85rem', marginTop: 4 }}>
                ✓ {successMessage}
              </div>
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
                  'Send Application'
                ) : (
                  <>
                    <CheckCircle2 size={16} /> Fill all details to enable
                  </>
                )}
              </Button>
            </div>

            <p style={{ margin: '12px 0 0', fontSize: '0.82rem', color: 'var(--muted)', textAlign: 'center' }}>
              Your application will be sent directly to{' '}
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