'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Clock3, Mail } from 'lucide-react';

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfbhMurG1LcPQBiAXaukjG8wT1l8s3En7ltOHVspj8s-8z_Aw/viewform?embedded=true';
const CONTACT_EMAIL = 'elevardigitalstudio@gmail.com';
const MAILTO_URL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'Request a strategy call'
)}&body=${encodeURIComponent(
  'Hi Elevar team,\n\nI would like to book a strategy call.\n\nName:\nEmail:\nPreferred time:'
)}`;

export default function BookCall() {
  const [formLoaded, setFormLoaded] = useState(false);
  const [formFailed, setFormFailed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (formLoaded) return;
    timeoutRef.current = setTimeout(() => {
      setFormFailed(true);
    }, 8000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [formLoaded]);

  function handleFormLoad() {
    setFormLoaded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }

  return (
    <main className="booking-page">
      <section className="container booking-layout">
        <div className="booking-intro">
          <span className="eyebrow">Start a conversation</span>
          <h1>Make your next video work harder.</h1>
          <p>
            Tell us where you want to go. We’ll follow up to arrange a free, 30-minute strategy call.
          </p>
          <div className="booking-detail">
            <Clock3 size={18} aria-hidden="true" />
            <span>30 minutes · One-to-one strategy session</span>
          </div>
          <div className="booking-detail">
            <Mail size={18} aria-hidden="true" />
            <span>We’ll reply from {CONTACT_EMAIL}</span>
          </div>
        </div>

        <section className="booking-form-panel" aria-labelledby="booking-form-title">
          <div className="booking-form-heading">
            <h2 id="booking-form-title">Request a call</h2>
            <p>Share a few details and we’ll get back to you.</p>
          </div>

          {formFailed ? (
            <div className="booking-fallback" role="status">
              <p>The booking form is taking longer than expected to load.</p>
              <a className="btn btn-primary" href={MAILTO_URL}>
                Email us to book <ArrowUpRight size={16} />
              </a>
            </div>
          ) : (
            <iframe
              className="booking-frame"
              src={GOOGLE_FORM_URL}
              title="Request a free Elevar strategy call"
              onLoad={handleFormLoad}
              onError={() => setFormFailed(true)}
              loading="lazy"
            />
          )}

          <p className="booking-form-note">
            Prefer email? <a href={MAILTO_URL}>{CONTACT_EMAIL}</a>
          </p>
        </section>
      </section>
    </main>
  );
}
