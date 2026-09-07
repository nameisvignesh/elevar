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

// Copy these values from Google's pre-filled form link, for example entry.123456789.
const GOOGLE_FORM_ENTRY_IDS = {
  name: '',
  email: '',
};

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

type AuthUser = {
  name: string;
  email: string;
  avatarText: string;
};

const AUTH_KEY = 'elevar-auth-user';

function readStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AuthUser;
    return parsed?.email ? parsed : null;
  } catch {
    return null;
  }
}

function buildAvatarText(value: string) {
  if (!value) return 'E';

  const parts = value.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (!parts.length) return 'E';
  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('').slice(0, 2);
}

function buildGoogleFormUrl(user: AuthUser | null) {
  const formUrl = new URL(GOOGLE_FORM_EMBED_URL);

  if (user && GOOGLE_FORM_ENTRY_IDS.name) {
    formUrl.searchParams.set(GOOGLE_FORM_ENTRY_IDS.name, user.name);
  }

  if (user && GOOGLE_FORM_ENTRY_IDS.email) {
    formUrl.searchParams.set(GOOGLE_FORM_ENTRY_IDS.email, user.email);
  }

  return formUrl.toString();
}

export default function BookCall() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authMode, setAuthMode] = useState<'sign-up' | 'sign-in'>('sign-up');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [formFailed, setFormFailed] = useState(false);
  const [showInlineForm, setShowInlineForm] = useState(false);
  const loadTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const stored = readStoredUser();
    setUser(stored);
    if (stored) {
      setShowInlineForm(true);
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

  function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const email = authForm.email.trim();
    if (!email) return;

    const nextUser: AuthUser = {
      name: (authForm.name || email.split('@')[0] || 'Elevar Member').trim(),
      email,
      avatarText: buildAvatarText(authForm.name || email),
    };

    window.localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    setShowInlineForm(true);
    setAuthForm({ name: '', email: '', password: '' });
    window.dispatchEvent(new Event('storage'));
  }

  function signOut() {
    window.localStorage.removeItem(AUTH_KEY);
    setUser(null);
    setShowInlineForm(false);
    window.dispatchEvent(new Event('storage'));
  }

  const userName = user?.name || 'Team member';
  const canAccessForm = Boolean(user);

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

            {user && (
              <div
                style={{
                  marginTop: '22px',
                  display: 'inline-flex',
                  gap: '8px',
                  alignItems: 'center',
                  background: 'rgba(0,180,216,0.08)',
                  border: '1px solid var(--border)',
                  padding: '10px 12px',
                  borderRadius: '999px',
                }}
              >
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Signed in as
                </span>
                <strong style={{ color: 'var(--text)' }}>{userName}</strong>
                <button
                  type="button"
                  onClick={signOut}
                  style={{
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    background: 'transparent',
                    color: 'var(--muted)',
                    borderRadius: '999px',
                    padding: '6px 10px',
                    cursor: 'pointer',
                  }}
                >
                  Log out
                </button>
              </div>
            )}

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
              boxShadow: 'var(--shadow)',
            }}
          >
            {!canAccessForm ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', minHeight: '420px', justifyContent: 'center' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.75rem' }}>Secure your booking access</h2>
                  <p style={{ margin: '10px 0 0', color: 'var(--muted)' }}>
                    Sign in or create your account to unlock the strategy call form.
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} style={{ display: 'grid', gap: '12px' }}>
                  {authMode === 'sign-up' && (
                    <label style={{ display: 'grid', gap: '8px', color: 'var(--muted)' }}>
                      Full name
                      <input
                        value={authForm.name}
                        onChange={(event) => setAuthForm((current) => ({ ...current, name: event.target.value }))}
                        placeholder="Jamie Lee"
                        style={{ borderRadius: '12px', border: '1px solid var(--border)', background: '#111827', color: 'var(--text)', padding: '12px 14px' }}
                      />
                    </label>
                  )}

                  <label style={{ display: 'grid', gap: '8px', color: 'var(--muted)' }}>
                    Email
                    <input
                      type="email"
                      value={authForm.email}
                      onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))}
                      placeholder="hello@elevarstudio.com"
                      required
                      style={{ borderRadius: '12px', border: '1px solid var(--border)', background: '#111827', color: 'var(--text)', padding: '12px 14px' }}
                    />
                  </label>

                  <label style={{ display: 'grid', gap: '8px', color: 'var(--muted)' }}>
                    Password
                    <input
                      type="password"
                      value={authForm.password}
                      onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
                      placeholder="••••••••"
                      required
                      style={{ borderRadius: '12px', border: '1px solid var(--border)', background: '#111827', color: 'var(--text)', padding: '12px 14px' }}
                    />
                  </label>

                  <Button type="submit" className="btn-elevar">
                    {authMode === 'sign-up' ? 'Create account' : 'Log in'}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setAuthMode((current) => (current === 'sign-up' ? 'sign-in' : 'sign-up'))}
                    style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
                  >
                    {authMode === 'sign-up' ? 'Already have an account? Log in' : 'Need an account? Sign up'}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <p style={{ margin: 0, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontSize: '0.72rem' }}>
                      Booking dashboard
                    </p>
                    <h2 style={{ margin: '8px 0 0', fontSize: '1.9rem' }}>Welcome back, {userName}</h2>
                  </div>
                </div>

                {!FORM_CONFIGURED || formFailed ? (
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
                    <div style={{ width: 56, height: 56, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'rgba(0,180,216,0.12)', color: 'var(--primary)' }}>
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
                      {FORM_CONFIGURED && !formFailed && (
                        <Button size="lg" className="btn-elevar" variant="outline" onClick={() => setShowInlineForm(true)}>
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
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <iframe
                      src={buildGoogleFormUrl(user)}
                      title="Book a Call"
                      onLoad={handleFormLoad}
                      style={{ width: '100%', minHeight: '620px', border: 'none', borderRadius: '12px', background: '#0d1725' }}
                    />
                  </div>
                )}
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
