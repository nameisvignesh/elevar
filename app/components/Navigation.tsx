'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { withBasePath } from '@/lib/paths';

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
    { href: '/career', label: 'Careers' }
  ];

  useEffect(() => {
    const syncActiveHash = () => setActiveHash(window.location.hash || '');

    syncActiveHash();
    window.addEventListener('hashchange', syncActiveHash);

    return () => window.removeEventListener('hashchange', syncActiveHash);
  }, []);

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
          <ThemeToggle />
          <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setOpen((value) => !value)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
