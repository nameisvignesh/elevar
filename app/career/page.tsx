'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

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
      // strip data:<mime>;base64, prefix if present
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
      setError('Please fill name, email and the role you are applying for.');
      return;
    }

    if (!portfolioBase64 || !portfolioName) {
      setError('Please upload your portfolio file (PDF, ZIP, or sample).');
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
      // clear form but keep result
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
    <main className="selected-hero" style={{ padding: '48px 0' }}>
      <section className="container" style={{ maxWidth: 980, margin: '0 auto' }}>
        {!submittedResult ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36 }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: 28,
              boxShadow: 'var(--shadow)'
            }}
          >
            <header style={{ marginBottom: 18 }}>
              <h1 style={{ margin: 0, fontSize: 28 }}>Join Elevar — Build content that converts</h1>
              <p style={{ marginTop: 8, color: 'var(--muted)' }}>
                We're a small, fast team building content systems for founders. If you ship great work, care about
                storytelling, and love measurable impact — we'd love to see your portfolio.
              </p>
            </header>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input
                  name="name"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input
                  name="role"
                  placeholder="Role you're applying for (e.g., Video Editor)"
                  value={form.role}
                  onChange={handleChange}
                  required
                  className="input"
                />
                <input
                  name="linkedin"
                  placeholder="LinkedIn profile (optional)"
                  value={form.linkedin}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <input
                name="location"
                placeholder="Location (city, timezone)"
                value={form.location}
                onChange={handleChange}
                className="input"
              />

              <label style={{ display: 'block', marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <strong>Portfolio file</strong>
                  <span style={{ color: 'var(--muted)', fontSize: 13 }}>{portfolioName || 'No file chosen'}</span>
                </div>
                <input type="file" accept=".pdf,.zip,application/pdf,video/*,image/*" onChange={handleFile} />
                <small style={{ color: 'var(--muted)' }}>
                  Upload a PDF, ZIP, or a sample video file (max ~50MB). The file will be attached to your application
                  and emailed to our hiring team.
                </small>
              </label>

              {error && <div style={{ color: 'var(--danger)', marginTop: 4 }}>{error}</div>}

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {loading ? 'Sending...' : 'Submit application'}
                </button>

                <a
                  className="btn"
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=elevardigitalstudio@gmail.com&su=${encodeURIComponent(
                    `Career Application - ${form.name || 'Applicant'} (${form.role || 'Role'})`
                  )}&body=${encodeURIComponent(
                    `Hi Elevar Team,\n\nI am applying for ${form.role || 'a role'}.\n\nName: ${form.name}\nEmail: ${form.email}\nLinkedIn: ${form.linkedin}\nLocation: ${form.location}\n\nPortfolio: (attached or use this link)\n\nBest,\n${form.name}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                >
                  <Mail size={14} /> Open & Send via Gmail
                </a>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              maxWidth: 760,
              margin: '0 auto',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: 28,
              textAlign: 'center',
              boxShadow: 'var(--shadow)'
            }}
          >
            <h2 style={{ marginTop: 0 }}>Thanks — your application was sent</h2>
            <p style={{ color: 'var(--muted)' }}>
              We've received your application. Your application ID is <strong>{submittedResult.applicationId}</strong>.
              Our hiring team will review your submission and reach out if there's a match.
            </p>

            <div style={{ marginTop: 16 }}>
              <a
                href="mailto:elevardigitalstudio@gmail.com"
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <Mail size={14} /> Contact the hiring team
              </a>
            </div>
          </motion.div>
        )}
      </section>
    </main>
  );
}
