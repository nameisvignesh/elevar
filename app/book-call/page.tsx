import { Clock3, Mail } from 'lucide-react';
import BookingRequestForm from './BookingRequestForm';
import EmailBookingDialog from './EmailBookingDialog';

const CONTACT_EMAIL = 'elevardigitalstudio@gmail.com';
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

export default function BookCall() {
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

          {clerkConfigured && supabaseUrl ? (
            <BookingRequestForm endpoint={`${supabaseUrl.replace(/\/$/, '')}/functions/v1/book-call`} />
          ) : (
            <div className="booking-setup-note" role="status">
              <p>Choose a proposed date and time. Your call is booked once Elevar confirms by email.</p>
              <EmailBookingDialog />
            </div>
          )}

          <p className="booking-form-note">
            Prefer email? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </section>
      </section>
    </main>
  );
}
