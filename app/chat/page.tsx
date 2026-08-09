'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const faqQuestions = [
  { label: 'What services do you offer?', path: '/#services' },
  { label: 'How long does a project usually take?', path: '/book-call' },
  { label: 'Do you work with founders and personal brands?', path: '/#portfolio' },
  { label: 'Can I book a discovery call?', path: '/book-call' }
];

export default function ChatPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = message.trim();

    if (!trimmed) return;

    const normalized = trimmed.toLowerCase();

    if (normalized.includes('service') || normalized.includes('offer')) {
      router.push('/#services');
      return;
    }

    if (normalized.includes('time') || normalized.includes('project') || normalized.includes('timeline')) {
      router.push('/book-call');
      return;
    }

    if (normalized.includes('founder') || normalized.includes('brand') || normalized.includes('personal')) {
      router.push('/#portfolio');
      return;
    }

    if (normalized.includes('book') || normalized.includes('call') || normalized.includes('discovery')) {
      router.push('/book-call');
      return;
    }

    setResponseMessage('Sorry, I could not find a matching answer. Please try one of the quick questions or book a call.');
  };

  return (
    <main className="page">
      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <div
            style={{
              padding: 32,
              borderRadius: 22,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow)'
            }}
          >
            <p className="muted" style={{ marginBottom: 8, fontSize: '0.92rem' }}>Minala support</p>
            <h1 style={{ margin: '0 0 10px', fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>How can we help today?</h1>
            <p style={{ lineHeight: 1.7, color: 'var(--muted)', marginBottom: 22 }}>
              Pick a common question or type your own. We’ll guide you to the right next step.
            </p>

            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: 16,
                marginBottom: 18
              }}
            >
              <p style={{ margin: '0 0 10px', fontWeight: 600 }}>Quick questions</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {faqQuestions.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setMessage(item.label);
                      setResponseMessage('');
                      router.push(item.path);
                    }}
                    style={{
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--text)',
                      borderRadius: 999,
                      padding: '10px 14px',
                      cursor: 'pointer',
                      fontSize: '0.95rem'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <textarea
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  if (responseMessage) setResponseMessage('');
                }}
                placeholder="Type your question here..."
                rows={4}
                style={{
                  width: '100%',
                  resize: 'vertical',
                  borderRadius: 14,
                  border: '1px solid var(--border)',
                  padding: '14px 16px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  outline: 'none'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
                <span className="muted" style={{ fontSize: '0.9rem' }}>
                  {responseMessage || 'Ask anything and we’ll help you find the right next step.'}
                </span>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Link href="/book-call" className="btn btn-secondary">
                    Book a call
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Send
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
