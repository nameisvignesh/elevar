'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Video,
  Globe,
  ShieldCheck,
  Sparkles,
  Send,
  CheckCircle2,
  Mail,
  User,
  Phone,
  Building,
  Target,
  ArrowRight,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

const timeSlots = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
];

export default function BookCall() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    role: 'Founder',
    revenue: '1L-5L',
    brandGoal: '',
    frustration: '',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Default tomorrow
    time: '18:00'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (data.success) {
        setBookingResult(data);
        setSubmitted(true);
      } else {
        alert(data.error || 'Failed to submit Google Booking. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while dispatching the booking. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const copyMeetLink = () => {
    if (bookingResult?.meetLink) {
      navigator.clipboard.writeText(bookingResult.meetLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getGoogleCalendarUrl = () => {
    if (!form.date || !form.time) return '#';
    try {
      const [year, month, day] = form.date.split('-').map(Number);
      const [hours, minutes] = form.time.split(':').map(Number);

      const startDate = new Date(year, month - 1, day, hours, minutes);
      const endDate = new Date(startDate.getTime() + 30 * 60000);

      const formatGCalDate = (d: Date) => {
        return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
      };

      const title = encodeURIComponent(`Elevar Strategy Call - ${form.name}`);
      const details = encodeURIComponent(`30-min Positioning & Strategy Session with Elevar Studio.\n\nClient Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nRole: ${form.role}\nGoogle Meet Link: ${bookingResult?.meetLink || 'Will be shared before session'}\n\nTeam Contact: elevardigitalstudio@gmail.com`);
      const location = encodeURIComponent(bookingResult?.meetLink || 'Google Meet');

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatGCalDate(startDate)}/${formatGCalDate(endDate)}&details=${details}&location=${location}&add=elevardigitalstudio@gmail.com,${encodeURIComponent(form.email)}`;
    } catch {
      return '#';
    }
  };

  return (
    <main className="booking-hero">
      <section className="container">
        {!submitted ? (
          <div className="grid-2">
            {/* Left Column: Google Bookings Header & System Guarantee */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="booking-panel"
            >
              <div className="badge-pill">
                <Sparkles size={14} style={{ color: '#00b4d8' }} />
                <span>Google Bookings Engine</span>
              </div>

              <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', margin: '12px 0' }}>
                Schedule Your Strategy Call.
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                Complete your booking below. Once confirmed, your session details and calendar invite are automatically dispatched to <strong style={{ color: 'var(--text)' }}>elevardigitalstudio@gmail.com</strong> and your email inbox.
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
                    <Video size={18} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>Auto Google Meet Integration</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Instant Video link generated for the session</span>
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
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>Instant Queue Confirmation</strong>
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

            {/* Right Column: Google Booking Form */}
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
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Google Booking Details</h3>
                <span style={{ fontSize: '0.8rem', color: '#00b4d8', background: 'rgba(0,180,216,0.12)', padding: '4px 10px', borderRadius: '12px', fontWeight: 500 }}>
                  Active Scheduler
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
                    min={new Date().toISOString().split('T')[0]}
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

              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
                style={{ width: '100%', marginTop: '8px', padding: '14px', fontSize: '1rem', fontWeight: 600 }}
              >
                {loading ? (
                  <span>Processing Google Booking...</span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    Confirm Google Booking <Send size={16} />
                  </span>
                )}
              </button>

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
              Google Booking Confirmed & Dispatched
            </span>

            <h2 style={{ fontSize: '2.2rem', margin: '12px 0 8px' }}>
              You&apos;re Booked!
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', marginBottom: '28px' }}>
              Booking reference <strong style={{ color: 'var(--text)' }}>{bookingResult?.bookingId}</strong> has been created.
              {bookingResult?.calendarBooked ? (
                <span> A Google Calendar invite was sent to <strong style={{ color: 'var(--turquoise-surf)' }}>elevardigitalstudio@gmail.com</strong> and your email.</span>
              ) : (
                <span> Booking details were emailed to <strong style={{ color: 'var(--turquoise-surf)' }}>elevardigitalstudio@gmail.com</strong> and copied to your email.</span>
              )}
            </p>

            {bookingResult?.calendarBooked === false && bookingResult?.calendarErrorMessage ? (
              <div style={{ marginBottom: '24px', padding: '18px', borderRadius: '16px', background: 'rgba(255, 69, 96, 0.08)', border: '1px solid rgba(255, 69, 96, 0.2)' }}>
                <p style={{ margin: 0, fontWeight: 600, color: '#ef476f' }}>Google Calendar creation failed</p>
                <p style={{ margin: '8px 0 0', color: 'var(--muted)', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{bookingResult.calendarErrorMessage}</p>
              </div>
            ) : null}

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
                <strong style={{ fontSize: '0.95rem' }}>{bookingResult?.scheduledDate} at {bookingResult?.scheduledTime}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Recipient Email</span>
                <strong style={{ fontSize: '0.95rem', color: '#00b4d8' }}>elevardigitalstudio@gmail.com</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Google Meet Link</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <a
                    href={bookingResult?.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--primary)', fontSize: '0.88rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    Join Meet <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={copyMeetLink}
                    type="button"
                    style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '2px' }}
                    title="Copy Link"
                  >
                    {copied ? <Check size={16} style={{ color: '#00b4d8' }} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(0,180,216,0.08)',
              border: '1px solid rgba(0,180,216,0.25)',
              marginBottom: '28px',
              textAlign: 'left',
              display: 'grid',
              gap: '12px'
            }}>
              <div>
                <p style={{ margin: '0 0 6px', fontSize: '0.9rem', color: '#00b4d8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CalendarDays size={16} /> Save Session to Your Google Calendar
                </p>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--muted)', lineHeight: '1.4' }}>
                  Click below to automatically add this session and Google Meet link into your personal Google Calendar.
                </p>
              </div>

              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <CalendarDays size={16} /> Add to Google Calendar
              </a>

              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=elevardigitalstudio@gmail.com&su=${encodeURIComponent(`New Strategy Call Booking - ${form.name}`)}&body=${encodeURIComponent(`Hi Elevar Studio Team,\n\nI have booked a strategy call session:\n- Name: ${form.name}\n- Email: ${form.email}\n- Phone: ${form.phone || 'N/A'}\n- Date & Time: ${form.date} at ${form.time} IST\n- Role/Revenue: ${form.role} / ${form.revenue}\n- Brand Goal: ${form.brandGoal || 'N/A'}\n- Meet Link: ${bookingResult?.meetLink || 'N/A'}\n\nBest regards,\n${form.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Mail size={16} /> Send Direct Copy via Gmail to elevardigitalstudio@gmail.com
              </a>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSubmitted(false);
                  setBookingResult(null);
                }}
              >
                Make Another Booking
              </button>
              <a href="/" className="btn btn-primary">
                Return to Home
              </a>
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
