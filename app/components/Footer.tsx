'use client';

import Link from 'next/link';
import {
  Mail,
  Phone,
  FolderOpen,
  Zap,
  GitBranch,
  Users,
  Layers,
  Calendar
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* BRAND COLUMN */}
          <div>
            <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '12px' }}>
              Elevar
            </strong>
            <p style={{ margin: '0 0 16px', lineHeight: '1.6', fontSize: '0.88rem' }}>
              Building content systems for founders who want strategy, speed, and premium execution.
            </p>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)' }}>
              © 2026 Elevar. All rights reserved.
            </p>
          </div>

          {/* COMPANY */}
          <div>
            <h4>Company</h4>
            <Link href="/selected-work" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FolderOpen size={14} />
              Selected Work
            </Link>
            <Link href="/#services" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} />
              Services
            </Link>
            <Link href="/#process" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GitBranch size={14} />
              Process
            </Link>
            <Link href="/career" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={14} />
              Career
            </Link>
          </div>

          {/* RESOURCES */}
          <div>
            <h4>Resources</h4>
            <Link href="/selected-work" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} />
              Portfolio
            </Link>
            <Link href="/book-call" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} />
              Book a Call
            </Link>
            <Link href="/#services" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} />
              Services
            </Link>
          </div>

          {/* CONTACT */}
          <div>
            <h4>Contact</h4>
            <a
              href="mailto:elevardigitalstudio@gmail.com"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '10px',
              }}
            >
              <Mail size={14} />
              elevardigitalstudio@gmail.com
            </a>
            <a
              href="tel:+919790897877"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Phone size={14} />
              +91 9790897877
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}