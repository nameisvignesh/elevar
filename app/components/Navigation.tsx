'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react';
import { ThemeToggle } from './ThemeToggle';
import { withBasePath } from '@/lib/paths';

const CLERK_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
const ACCOUNT_EMAIL = 'elevardigitalstudio@gmail.com';

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const links = [
    { href: '/', label: 'Home' },
    { href: '/#portfolio', label: 'Portfolio' },
    { href: '/#services', label: 'Services' },
    { href: '/#process', label: 'Process' },
    { href: '/#about', label: 'About' },
    { href: '/career', label: 'Careers' },
  ];

  useEffect(() => {
    const syncActiveHash = () => setActiveHash(window.location.hash || '');
    syncActiveHash();
    window.addEventListener('hashchange', syncActiveHash);
    return () => window.removeEventListener('hashchange', syncActiveHash);
  }, []);

  return (
    <header className="nav-wrap">
      <nav className="container nav" aria-label="Main navigation">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <Image
            src={withBasePath('/logo.svg')}
            alt=""
            width={36}
            height={36}
            className="brand-mark"
            priority
          />
          <strong>Elevar</strong>
        </Link>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((link) => {
            const hash = link.href.split('#')[1];
            const isActive = hash
              ? pathname === '/' && activeHash === `#${hash}`
              : link.href === '/' && pathname === '/' && !activeHash;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? 'active' : ''}
                onClick={() => {
                  setActiveHash(hash ? `#${hash}` : '');
                  setOpen(false);
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/book-call" className="btn btn-secondary nav-book-call" onClick={() => setOpen(false)}>
            Book a call
          </Link>
        </div>

        <div className="nav-actions">
          {CLERK_CONFIGURED ? (
            <>
              <SignedOut>
                <SignUpButton mode="modal">
                  <button type="button" className="btn btn-secondary nav-auth-button">Sign up</button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button type="button" className="btn btn-primary nav-auth-button">Log in</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </>
          ) : (
            <a
              className="nav-account-link"
              href={`mailto:${ACCOUNT_EMAIL}?subject=${encodeURIComponent('Account access')}`}
            >
              Account access
            </a>
          )}
          <ThemeToggle />
          <button
            className="mobile-menu"
            type="button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
