'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { withBasePath } from '@/lib/paths';

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
    if (!parsed?.email) return null;
    return parsed;
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

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authMode, setAuthMode] = useState<'sign-up' | 'sign-in' | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const links = [
    { href: '/', label: 'Home' },
    { href: '/#portfolio', label: 'Portfolio' },
    { href: '/#services', label: 'Services' },
    { href: '/#process', label: 'Process' },
    { href: '/#about', label: 'About' },
    { href: '/career', label: 'Careers' }
  ];

  useEffect(() => {
    const syncActiveHash = () => setActiveHash(window.location.hash || '');
    syncActiveHash();
    window.addEventListener('hashchange', syncActiveHash);

    const syncAuth = () => setUser(readStoredUser());
    syncAuth();
    window.addEventListener('storage', syncAuth);

    return () => {
      window.removeEventListener('hashchange', syncActiveHash);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  const submitAuth = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = form.email.trim();
    if (!email) return;

    const normalizedName = (form.name || email.split('@')[0] || 'Elevar Member').trim();
    const nextUser: AuthUser = {
      name: normalizedName,
      email,
      avatarText: buildAvatarText(normalizedName),
    };

    window.localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    setForm({ name: '', email: '', password: '' });
    setAuthMode(null);
    window.dispatchEvent(new Event('storage'));
  };

  const signOut = () => {
    window.localStorage.removeItem(AUTH_KEY);
    setUser(null);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <>
      {authMode && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 23, 0.72)',
            zIndex: 999,
            display: 'grid',
            placeItems: 'center',
            padding: '24px',
          }}
          onClick={() => setAuthMode(null)}
        >
          <div
            style={{
              width: 'min(100%, 440px)',
              background: '#0f172a',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '18px',
              boxShadow: '0 30px 80px rgba(15, 23, 42, 0.55)',
              padding: '26px',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '18px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7dd3fc' }}>
                  Elevar access
                </p>
                <h3 style={{ margin: '8px 0 0', fontSize: '1.5rem', color: '#f8fafc' }}>
                  {authMode === 'sign-up' ? 'Create account' : 'Welcome back'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAuthMode(null)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '999px',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  background: 'transparent',
                  color: '#e2e8f0',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                }}
                aria-label="Close authentication dialog"
              >
                ×
              </button>
            </div>

            <form onSubmit={submitAuth} style={{ display: 'grid', gap: '14px' }}>
              {authMode === 'sign-up' && (
                <label style={{ display: 'grid', gap: '8px', color: '#cbd5e1' }}>
                  Full name
                  <input
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Jamie Lee"
                    style={{ borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.25)', background: '#0b1220', color: '#f8fafc', padding: '12px 14px' }}
                  />
                </label>
              )}

              <label style={{ display: 'grid', gap: '8px', color: '#cbd5e1' }}>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="hello@elevarstudio.com"
                  required
                  style={{ borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.25)', background: '#0b1220', color: '#f8fafc', padding: '12px 14px' }}
                />
              </label>

              <label style={{ display: 'grid', gap: '8px', color: '#cbd5e1' }}>
                Password
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="••••••••"
                  required
                  style={{ borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.25)', background: '#0b1220', color: '#f8fafc', padding: '12px 14px' }}
                />
              </label>

              <Button type="submit" size="lg" className="book-call-nav">
                {authMode === 'sign-up' ? 'Create account' : 'Log in'}
              </Button>
            </form>
          </div>
        </div>
      )}

      <header className="nav-wrap">
      <nav className="container nav">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <Image src={withBasePath("/logo.svg")} alt="Elevar logo" width={40} height={40} className="brand-mark" priority />
          <div>
            <strong style={{
              background: "linear-gradient(90deg, #00b4d8, #90e0ef)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Elevar
            </strong>
          </div>
        </Link>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((link) => {
            const hash = link.href.split('#')[1];
            const isActive = pathname === '/' && activeHash === `#${hash}`;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? 'active' : ''}
                onClick={() => {
                  setActiveHash(`#${hash}`);
                  setOpen(false);
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <Button asChild size="sm" className="book-call-nav" onClick={() => setOpen(false)}>
            <Link href="/book-call">Book Call</Link>
          </Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  onClick={signOut}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.18)',
                    background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                  aria-label={`Signed in as ${user.name}`}
                  title={user.name}
                >
                  {user.avatarText}
                </button>
              </div>
            ) : (
              <>
                <Button size="sm" variant="outline" className="book-call-nav auth-sign-up" onClick={() => { setOpen(false); setAuthMode('sign-up'); }}>
                  Sign Up
                </Button>
                <Button size="sm" className="book-call-nav" onClick={() => { setOpen(false); setAuthMode('sign-in'); }}>
                  Log In
                </Button>
              </>
            )}
          </div>
          <ThemeToggle />
          <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setOpen((value) => !value)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      </header>
    </>
  );
}
