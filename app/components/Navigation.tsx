'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { withBasePath } from '@/lib/paths';

type SessionUser = {
  name: string;
  email: string;
};

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
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

    const syncSession = () => {
      const raw = window.localStorage.getItem('elevar-book-call-session');
      if (!raw) {
        setSessionUser(null);
        return;
      }

      try {
        const parsed = JSON.parse(raw) as SessionUser;
        setSessionUser(parsed?.email ? parsed : null);
      } catch {
        setSessionUser(null);
      }
    };

    syncActiveHash();
    syncSession();
    window.addEventListener('hashchange', syncActiveHash);
    window.addEventListener('storage', syncSession);

    return () => {
      window.removeEventListener('hashchange', syncActiveHash);
      window.removeEventListener('storage', syncSession);
    };
  }, []);

  const initials = sessionUser
    ? sessionUser.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() ?? '')
        .join('') || 'G'
    : 'G';

  return (
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
          {!sessionUser ? (
            <>
              <Button asChild size="sm" variant="outline" className="book-call-nav" onClick={() => setOpen(false)}>
                <Link href="/book-call">Sign Up</Link>
              </Button>
              <Button asChild size="sm" className="book-call-nav" onClick={() => setOpen(false)}>
                <Link href="/book-call">Log In</Link>
              </Button>
            </>
          ) : (
            <button
              type="button"
              aria-label="Open booking dashboard"
              onClick={() => router.push('/book-call')}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.18)',
                background: 'conic-gradient(#4285F4 0 25%, #34A853 25% 50%, #FBBC05 50% 75%, #EA4335 75% 100%)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 10px 24px rgba(0,0,0,0.24)',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  background: 'rgba(10,17,26,0.9)',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                {initials}
              </span>
            </button>
          )}
          <ThemeToggle />
          <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setOpen((value) => !value)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
