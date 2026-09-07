'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Clock,
  Mail,
  ShieldCheck,
  Sparkles,
  MessageCircle,
} from 'lucide-react';

/**
 * Booking is handled by a Google Form that emails responses to
 * elevardigitalstudio@gmail.com.
 *
 * IMPORTANT: use the full canonical form URL (docs.google.com/forms/d/e/<ID>/viewform)
 * with ?embedded=true — NOT a forms.gle short link. Short links redirect at
 * runtime and Google rejects embedding redirected URLs, which surfaces the
 * "you don't have permission to access this form" error (.claude/errors/e1.png).
 * The form must also be set to "Anyone with the link can respond".
 */
const GOOGLE_FORM_EMBED_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfbhMurG1LcPQBiAXaukjG8wT1l8s3En7ltOHVspj8s-8z_Aw/viewform?embedded=true';

/**
 * The booking form is configured once a real Google Form URL is pasted above.
 * Until then we render a graceful email CTA instead of a broken iframe, so the
 * page never shows the "could not load form" error depicted in .claude/errors.
 */
const FORM_CONFIGURED = !GOOGLE_FORM_EMBED_URL.includes('PASTE_YOUR_FORM_ID_HERE');

/**
 * If the iframe fails to load within this window (permission-restricted,
 * network-blocked, or redirects), we swap it for the email CTA so the page is
 * never a dead end. Google Form embed failures don't always fire onError, so we
 * also watch for the absence of onLoad.
 */
const FORM_LOAD_TIMEOUT_MS = 6000;

const APPLICATION_INBOX = 'elevardigitalstudio@gmail.com';

const MAILTO_HREF = `mailto:${APPLICATION_INBOX}?subject=${encodeURIComponent(
  'Request a Strategy Call'
)}&body=${encodeURIComponent(
  'Hi Elevar Team,\n\nI’d like to book a free 30-minute strategy call.\n\nName:\nEmail:\nPreferred time:'
)}`;

export default function BookCall() {
  const [formFailed, setFormFailed] = useState(false);
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'login'>('signin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const loadTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const savedSession = localStorage.getItem('elevar-book-call-session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession) as { name: string; email: string };
        if (parsed?.email) {
          setUserName(parsed.name || 'Team member');
          setIsAuthenticated(true);
          setShowInlineForm(true);
        }
      } catch {
        localStorage.removeItem('elevar-book-call-session');
      }
    }
  }, []);

  useEffect(() => {
    if (!showInlineForm || !FORM_CONFIGURED) return;
    loadTimerRef.current = setTimeout(() => {
      setFormFailed(true);
    }, FORM_LOAD_TIMEOUT_MS);
    return () => clearTimeout(loadTimerRef.current);
  }, [showInlineForm]);

  function handleFormLoad() {
    clearTimeout(loadTimerRef.current);
  }

  function handleAuthChange(field: 'name' | 'email' | 'password', value: string) {
    setAuthForm(prev => ({ ...prev, [field]: value }));
  }

  function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = authForm.name.trim();
    const trimmedEmail = authForm.email.trim().toLowerCase();
    const trimmedPassword = authForm.password.trim();

    if (!trimmedEmail || !trimmedPassword || (authMode === 'signin' && !trimmedName)) {
      setAuthError('Please complete the required fields to continue.');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('elevar-book-call-users') || '[]') as Array<{
      name: string;
      email: string;
      password: string;
    }>;

    if (authMode === 'signin') {
      const duplicate = existingUsers.some(user => user.email.toLowerCase() === trimmedEmail);
      if (duplicate) {
        setAuthError('An account for this email already exists. Please log in instead.');
        return;
      }

      const newUser = { name: trimmedName, email: trimmedEmail, password: trimmedPassword };
      localStorage.setItem('elevar-book-call-users', JSON.stringify([...existingUsers, newUser]));
      localStorage.setItem('elevar-book-call-session', JSON.stringify({ name: trimmedName, email: trimmedEmail }));
      setUserName(trimmedName);
      setIsAuthenticated(true);
      setShowInlineForm(true);
      setAuthError(null);
      return;
    }

    const user = existingUsers.find(
      item => item.email.toLowerCase() === trimmedEmail && item.password === trimmedPassword
    );

    if (!user) {
      setAuthError('We could not find an account with those details. Please try again.');
      return;
    }

    localStorage.setItem('elevar-book-call-session', JSON.stringify({ name: user.name, email: user.email }));
    setUserName(user.name);
    setIsAuthenticated(true);
    setShowInlineForm(true);
    setAuthError(null);
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setShowInlineForm(false);
    setAuthForm({ name: '', email: '', password: '' });
    setAuthError(null);
    localStorage.removeItem('elevar-book-call-session');
  }

  return (
    <main className="booking-hero">
      <section className="container">
        <div className="grid-2">
          {/* Left Column: Booking Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="booking-panel"
          >
            <div className="badge-pill">
              <Sparkles size={14} style={{ color: '#00b4d8' }} />
              <span>Free Strategy Call</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', margin: '12px 0' }}>
              Schedule Your Strategy Call.
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Fill in the form below to request your free strategy call. Once you submit it, your details are
              automatically sent to{' '}
              <strong style={{ color: 'var(--text)' }}>elevardigitalstudio@gmail.com</strong> and we&apos;ll reach out
              to confirm your session.
            </p>

            <div className="booking-meta" style={{ marginTop: '28px', display: 'grid', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'rgba(0,180,216,0.12)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                  <Clock size={18} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>30 Minutes Strategy Session</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Direct 1-on-1 positioning & content roadmap</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'rgba(0,180,216,0.12)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                  <MessageCircle size={18} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Call Confirmed by Email</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>We reply with a link and prep questions</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'rgba(0,180,216,0.12)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                  <Mail size={18} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Auto Email Dispatch</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Sent to <strong style={{ color: '#00b4d8' }}>elevardigitalstudio@gmail.com</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'rgba(0,180,216,0.12)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Instant Confirmation</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Guaranteed rapid review by Elevar Studio</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '32px', padding: '16px', borderRadius: '12px', background: 'rgba(0,180,216,0.06)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Destination Inbox</span>
              <p style={{ margin: '4px 0 0', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} style={{ color: 'var(--primary)' }} />
                elevardigitalstudio@gmail.com
              </p>
            </div>
          </motion.div>

          {/* Right Column: Google Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="call-form"
            style={{
              background: 'var(--surface)',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              overflow: 'hidden',
            }}
          >
            {!isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', minHeight: '420px', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '999px', padding: '6px', width: 'fit-content' }}>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    style={{
                      border: 'none',
                      borderRadius: '999px',
                      padding: '9px 16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: authMode === 'signin' ? 'var(--primary)' : 'transparent',
                      color: authMode === 'signin' ? '#03141d' : 'var(--text)',
                    }}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    style={{
                      border: 'none',
                      borderRadius: '999px',
                      padding: '9px 16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: authMode === 'login' ? 'var(--primary)' : 'transparent',
                      color: authMode === 'login' ? '#03141d' : 'var(--text)',
                    }}
                  >
                    Log in
                  </button>
                </div>

                <form onSubmit={handleAuthSubmit} style={{ display: 'grid', gap: '14px' }}>
                  {authMode === 'signin' && (
                    <div className="field">
                      <label htmlFor="auth-name">Full name</label>
                      <input
                        id="auth-name"
                        name="auth-name"
                        type="text"
                        value={authForm.name}
                        onChange={event => handleAuthChange('name', event.target.value)}
                        placeholder="Jane Doe"
                      />
                    </div>
                  )}

                  <div className="field">
                    <label htmlFor="auth-email">Email</label>
                    <input
                      id="auth-email"
                      name="auth-email"
                      type="email"
                      value={authForm.email}
                      onChange={event => handleAuthChange('email', event.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="auth-password">Password</label>
                    <input
                      id="auth-password"
                      name="auth-password"
                      type="password"
                      value={authForm.password}
                      onChange={event => handleAuthChange('password', event.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>

                  {authError && (
                    <p style={{ margin: 0, color: '#ff6a6a', fontSize: '0.85rem' }}>{authError}</p>
                  )}

                  <Button type="submit" size="lg" className="btn-elevar">
                    {authMode === 'signin' ? 'Create account' : 'Log in'}
                  </Button>
                </form>
              </div>
            ) : showInlineForm && FORM_CONFIGURED && !formFailed ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Signed in as {userName}</span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      border: '1px solid var(--border)',
                      background: 'transparent',
                      color: 'var(--text)',
                      borderRadius: '999px',
                      padding: '7px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    Log out
                  </button>
                </div>
                <iframe
                  title="Book a Strategy Call"
                  src={GOOGLE_FORM_EMBED_URL}
                  width="100%"
                  height="720"
                  onLoad={handleFormLoad}
                  onError={() => setFormFailed(true)}
                  style={{ border: 'none', borderRadius: '10px', background: '#fff' }}
                >
                  Loading the booking form…
                </iframe>
              </div>
            ) : showInlineForm && formFailed ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  gap: '16px',
                  minHeight: '420px',
                  padding: '32px 20px',
                  borderRadius: '10px',
                  background: 'rgba(0,180,216,0.06)',
                  border: '1px dashed var(--border)',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    background: 'rgba(0,180,216,0.12)',
                    color: 'var(--primary)',
                  }}
                >
                  <Mail size={26} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text)' }}>
                  We couldn&apos;t load the booking form
                </h3>
                <p style={{ margin: 0, maxWidth: '420px', color: 'var(--muted)', lineHeight: 1.6 }}>
                  The form may be restricted or blocked by your network. Open it in a new tab or email us at{' '}
                  <strong style={{ color: 'var(--text)' }}>{APPLICATION_INBOX}</strong> and we&apos;ll confirm
                  your free 30-minute strategy call right away.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
                  <Button asChild size="lg" className="btn-elevar" variant="outline">
                    <a href={GOOGLE_FORM_EMBED_URL.replace('?embedded=true', '')} target="_blank" rel="noopener noreferrer">
                      Open form in new tab
                    </a>
                  </Button>
                  <Button asChild size="lg" className="btn-elevar">
                    <a href={MAILTO_HREF}>
                      <Mail size={16} />
                      Email us to book
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  gap: '16px',
                  minHeight: '420px',
                  padding: '32px 20px',
                  borderRadius: '10px',
                  background: 'rgba(0,180,216,0.06)',
                  border: '1px dashed var(--border)',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    background: 'rgba(0,180,216,0.12)',
                    color: 'var(--primary)',
                  }}
                >
                  <Mail size={26} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text)' }}>
                  Book your free strategy call
                </h3>
                <p style={{ margin: 0, maxWidth: '440px', color: 'var(--muted)', lineHeight: 1.6 }}>
                  Fill in the quick form online, or skip straight to email and we&apos;ll confirm your 30-minute
                  session at{' '}
                  <strong style={{ color: 'var(--text)' }}>{APPLICATION_INBOX}</strong>.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
                  {FORM_CONFIGURED && (
                    <Button
                      size="lg"
                      className="btn-elevar"
                      variant="outline"
                      onClick={() => setShowInlineForm(true)}
                    >
                      Fill in the form
                    </Button>
                  )}
                  <Button asChild size="lg" className="btn-elevar">
                    <a href={MAILTO_HREF}>
                      <Mail size={16} />
                      Email us to book
                    </a>
                  </Button>
                </div>
              </div>
            )}

            <p style={{ margin: '12px 0 0', fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'center' }}>
              🔒 Your request is sent directly to elevardigitalstudio@gmail.com
            </p>
          </motion.div>
        </div>
      </section>

      <style jsx global>{`
        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 20px;
          background: rgba(0, 180, 216, 0.12);
          border: 1px solid rgba(0, 180, 216, 0.25);
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--turquoise-surf);
          margin-bottom: 12px;
        }
      `}</style>
    </main>
  );
}
