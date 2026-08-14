'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Mail,
  ShieldCheck,
  Sparkles,
  Send,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import {
  isBookingEmailConfigured,
  sendBookingRequest,
} from '@/lib/emailjs';
import { Button } from '@/components/ui/button';

/** Formats a Date as a local (not UTC) yyyy-mm-dd string for <input type="date">. */
function toLocalDateInput(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Tomorrow in local time. */
function tomorrowLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toLocalDateInput(d);
}

const timeSlots = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
];

export default function BookCall() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<{ bookingId: string } | null>(null);

  /* Prevents duplicate rapid clicks from sending the same booking twice. */
  const submittingRef = useRef(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    role: 'Founder',
    revenue: '1L-5L',
    brandGoal: '',
    frustration: '',
    date: tomorrowLocal(),
    time: '18:00'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.phone || !form.date || !form.time) {
      setError('Please fill in your name, email, phone, date, and time.');
      return;
    }

    if (!isBookingEmailConfigured()) {
      setError('Email is not configured yet. Please email us directly at elevardigitalstudio@gmail.com.');
      return;
    }

    if (submittingRef.current) return; // ignore duplicate rapid clicks
    submittingRef.current = true;
    setLoading(true);

    try {
      const bookingId = `ELV-CALL-${Date.now().toString(36).toUpperCase().slice(-8)}`;

      await sendBookingRequest({
        from_name: form.name,
        from_email: form.email,
        reply_to: form.email,
        phone: form.phone,
        website: form.website,
        role: form.role,
        revenue: form.revenue,
        brand_goal: form.brandGoal,
        frustration: form.frustration,
        preferred_date: form.date,
        preferred_time: form.time,
        booking_id: bookingId,
      });

      setBookingResult({ bookingId });
      setSubmitted(true);
    } catch (err: any) {
      const message =
        err?.text || err?.message || 'Unexpected error while dispatching the booking.';
      setError(
        `Booking failed to send (${message}). Please email us directly at elevardigitalstudio@gmail.com.`
      );
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  return (
    <main className="booking-hero">
      <section className="container">
        {!submitted ? (
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
                Fill in your details below. Once confirmed, your booking is automatically dispatched to <strong style={{ color: 'var(--text)' }}>elevardigitalstudio@gmail.com</strong> and we&apos;ll reach out to confirm your session.
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

            {/* Right Column: Booking Form */}
            <motion.form
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="call-form form-grid"
              onSubmit={handleSubmit}
              style={{
                background: 'var(--surface)',
                padding: '32px',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Booking Details</h3>
                <span style={{ fontSize: '0.8rem', color: '#00b4d8', background: 'rgba(0,180,216,0.12)', padding: '4px 10px', borderRadius: '12px', fontWeight: 500 }}>
                  Strategy Call
                </span>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Alex Rivera"
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 97908 97877"
                  />
                </div>
                <div className="field">
                  <label htmlFor="website">Website / LinkedIn</label>
                  <input
                    id="website"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="date">Select Date *</label>
                  <input
                    id="date"
                    type="date"
                    required
                    value={form.date}
                    min={toLocalDateInput(new Date())}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="time">Select Time Slot (IST) *</label>
                  <select
                    id="time"
                    required
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot} IST
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="role">Your Primary Role</label>
                  <select
                    id="role"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="Founder">Founder / CEO</option>
                    <option value="Creator">Creator / Influencer</option>
                    <option value="Consultant">Consultant / Coach</option>
                    <option value="Agency Owner">Agency Owner</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="revenue">Monthly Revenue</label>
                  <select
                    id="revenue"
                    value={form.revenue}
                    onChange={(e) => setForm({ ...form, revenue: e.target.value })}
                  >
                    <option value="Pre-revenue">Pre-revenue</option>
                    <option value="Under 1L">Under ₹1L / month</option>
                    <option value="1L-5L">₹1L - ₹5L / month</option>
                    <option value="5L+">₹5L+ / month</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="brandGoal">What is your main goal for this call?</label>
                <textarea
                  id="brandGoal"
                  rows={2}
                  value={form.brandGoal}
                  onChange={(e) => setForm({ ...form, brandGoal: e.target.value })}
                  placeholder="e.g. Build a high-converting content funnel and scale brand reach."
                />
              </div>

              <div className="field">
                <label htmlFor="frustration">What&apos;s the biggest challenge right now?</label>
                <textarea
                  id="frustration"
                  rows={2}
                  value={form.frustration}
                  onChange={(e) => setForm({ ...form, frustration: e.target.value })}
                  placeholder="e.g. Content is inconsistent and doesn't bring in clients."
                />
              </div>

              {error && (
                <div style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: 4 }}>
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="btn-elevar"
                style={{ width: '100%', marginTop: '8px' }}
              >
                {loading ? (
                  <span>Dispatching Booking...</span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    Confirm Booking <Send size={16} />
                  </span>
                )}
              </Button>

              <p style={{ margin: '12px 0 0', fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'center' }}>
                🔒 Automatic notification sent directly to elevardigitalstudio@gmail.com
              </p>
            </motion.form>
          </div>
        ) : (
          /* Confirmation Success View */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              maxWidth: '680px',
              margin: '40px auto',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '40px 32px',
              textAlign: 'center',
              boxShadow: 'var(--shadow)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(0, 180, 216, 0.15)',
                color: '#00b4d8',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 20px'
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <span className="badge-pill" style={{ background: 'rgba(0, 180, 216, 0.12)', color: '#00b4d8', border: '1px solid rgba(0, 180, 216, 0.25)' }}>
              Booking Confirmed & Dispatched
            </span>

            <h2 style={{ fontSize: '2.2rem', margin: '12px 0 8px' }}>
              You&apos;re Booked!
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', marginBottom: '28px' }}>
              Booking reference <strong style={{ color: 'var(--text)' }}>{bookingResult?.bookingId}</strong> has been created.
              {' '}Booking details were emailed to <strong style={{ color: 'var(--turquoise-surf)' }}>elevardigitalstudio@gmail.com</strong> and a copy to your inbox. We&apos;ll confirm your session shortly.
            </p>

            <div
              style={{
                background: 'rgba(0, 180, 216, 0.04)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'left',
                display: 'grid',
                gap: '14px',
                marginBottom: '28px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Client Name</span>
                <strong style={{ fontSize: '0.95rem' }}>{form.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Scheduled Date & Time</span>
                <strong style={{ fontSize: '0.95rem' }}>{form.date} at {form.time} IST</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Recipient Email</span>
                <strong style={{ fontSize: '0.95rem', color: '#00b4d8' }}>elevardigitalstudio@gmail.com</strong>
              </div>
            </div>

            <a
              href={`mailto:elevardigitalstudio@gmail.com?subject=${encodeURIComponent(`New Strategy Call Booking - ${form.name}`)}&body=${encodeURIComponent(`Hi Elevar Studio Team,\n\nI have booked a strategy call session:\n- Name: ${form.name}\n- Email: ${form.email}\n- Phone: ${form.phone || 'N/A'}\n- Date & Time: ${form.date} at ${form.time} IST\n- Role/Revenue: ${form.role} / ${form.revenue}\n- Brand Goal: ${form.brandGoal || 'N/A'}\n\nBest regards,\n${form.name}`)}`}
              className="btn btn-secondary"
              style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Mail size={16} /> Send Direct Copy via Email
            </a>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSubmitted(false);
                  setBookingResult(null);
                  setForm({ ...form, date: tomorrowLocal(), time: '18:00' });
                }}
              >
                Make Another Booking
              </button>
              <Link href="/" className="btn btn-primary">
                Return to Home <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}
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
