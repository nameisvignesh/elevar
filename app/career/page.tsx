'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Upload, CheckCircle2, Loader2 } from 'lucide-react';

type FormState = {
  name: string;
  email: string;
  linkedin: string;
  location: string;
  role: string;
};

export default function CareerPage() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', linkedin: '', location: '', role: '' });
  const [portfolioName, setPortfolioName] = useState<string | null>(null);
  const [portfolioBase64, setPortfolioBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{ applicationId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    setPortfolioName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] ?? result;
      setPortfolioBase64(base64);
    };
    reader.onerror = () => {
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
      setError('Please upload your portfolio file (PDF, ZIP, or video sample).');
      return;
    }

    setLoading(true);

    const applicationId = `ELV-CAREER-${Date.now().toString(36).toUpperCase().slice(-8)}`;

    try {
      const res = await fetch('/api/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          linkedin: form.linkedin,
          location: form.location,
          role: form.role,
          portfolioName,
          portfolioBase64,
          applicationId
        })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || 'Server error while sending application.');
      }

      const data = await res.json();
      setSubmittedResult({ applicationId: data.applicationId || applicationId });
      setForm({ name: '', email: '', linkedin: '', location: '', role: '' });
      setPortfolioName(null);
      setPortfolioBase64(null);
    } catch (err: any) {
      setError(err?.message || 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  }

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
                We're a small, fast team building content systems for founders. If you ship great work, care about
                storytelling, and love measurable impact — we'd love to see your portfolio.
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
                <label>Portfolio File *</label>
                <div className="queue-note" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 10 }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text)' }}>
                      {portfolioName ? `Selected: ${portfolioName}` : 'Upload PDF, ZIP, or video sample'}
                    </span>
                    <label className="btn btn-secondary compact" style={{ cursor: 'pointer', margin: 0 }}>
                      <Upload size={14} />
                      <span>Browse File</span>
                      <input
                        type="file"
                        accept=".pdf,.zip,application/pdf,video/*,image/*"
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
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending Application...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
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