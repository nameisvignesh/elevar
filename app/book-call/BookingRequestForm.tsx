'use client';

import { FormEvent, useState } from 'react';
import { SignInButton, SignUpButton, SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-react';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { BOOKING_TIMES, getIstToday, getSuggestedIstDate } from './bookingSlots';

type SubmissionResult = {
  remaining: number;
  notificationSent: boolean;
  spreadsheetUpdated: boolean;
  excelAttached: boolean;
  agencyTaskCreated: boolean;
  agencyEmailImportant: boolean;
};
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const EMAILJS_BOOKING_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_BOOKING_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

export default function BookingRequestForm({ endpoint }: { endpoint: string }) {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<SubmissionResult | null>(null);
  const [formKey, setFormKey] = useState(0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const form = new FormData(event.currentTarget);

    try {
      const token = await getToken();
      if (!token) throw new Error('Please sign in again to send your request.');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          businessName: form.get('businessName'),
          website: form.get('website'),
          service: form.get('service'),
          projectDetails: form.get('projectDetails'),
          proposedDate: form.get('proposedDate'),
          proposedTime: form.get('proposedTime'),
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (response.status === 429) {
        throw new Error('You’ve reached three requests for today. You can send another after midnight IST.');
      }
      if (!response.ok) {
        throw new Error(result.error || 'Your request could not be sent. Please try again.');
      }

      let notificationSent = Boolean(result.agencyEmailSent);
      if (!notificationSent && EMAILJS_SERVICE_ID && EMAILJS_BOOKING_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        try {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_BOOKING_TEMPLATE_ID, {
            name: form.get('name'),
            email: form.get('email'),
            business_name: form.get('businessName'),
            website: form.get('website') || 'Not provided',
            service: form.get('service'),
            project_details: form.get('projectDetails'),
            proposed_date: form.get('proposedDate'),
            proposed_time: `${form.get('proposedTime')} IST`,
            request_id: result.requestId,
          }, EMAILJS_PUBLIC_KEY);
          notificationSent = true;
        } catch (notificationError) {
          console.error('The booking request was saved but its email notification failed.', notificationError);
        }
      }
      setSuccess({
        remaining: Number(result.remaining ?? 0),
        notificationSent,
        spreadsheetUpdated: Boolean(result.agencySpreadsheetUpdated),
        excelAttached: Boolean(result.agencyExcelAttached),
        agencyTaskCreated: Boolean(result.agencyTaskCreated),
        agencyEmailImportant: Boolean(result.agencyEmailImportant),
      });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Your request could not be sent. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SignedOut>
        <div className="booking-auth-prompt">
          <p>Sign in to send and manage requests for each of your businesses.</p>
          <div className="booking-auth-actions">
            <SignInButton mode="modal">
              <button type="button" className="btn btn-primary">Log in</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button type="button" className="btn btn-secondary">Create account</button>
            </SignUpButton>
          </div>
          <p className="booking-limit-note">Each account can submit up to three requests per day. Use a separate request for each business.</p>
        </div>
      </SignedOut>

      <SignedIn>
        {!isLoaded ? (
          <div className="booking-form-loading" role="status">Loading your account…</div>
        ) : success ? (
          <div className="booking-success" role="status">
            <span className="booking-success-mark" aria-hidden="true">✓</span>
            <h3>Request received</h3>
            <p>
              {success.spreadsheetUpdated
                ? 'Your request has been added to Elevar’s booking spreadsheet. '
                : 'Your request is saved, but the booking spreadsheet update could not be confirmed. Please contact the studio with your request details. '}
              {success.excelAttached ? 'An updated Excel copy is attached to the agency notification. ' : ''}
              {success.notificationSent && success.agencyTaskCreated ? 'Elevar’s follow-up task is ready. ' : ''}
              {success.notificationSent && success.agencyEmailImportant ? 'The request email is marked important. ' : ''}
              {success.notificationSent ? 'Your proposed time is not confirmed until Elevar replies.' : 'The email notification could not be confirmed; Elevar will review the saved request.'}
            </p>
            <p className="booking-limit-note">
              {success.remaining > 0
                ? `${success.remaining} ${success.remaining === 1 ? 'request' : 'requests'} left for your account today.`
              : 'You’ve used all three requests for today.'}
            </p>
            {success.remaining > 0 && (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => {
                  setSuccess(null);
                  setFormKey((key) => key + 1);
                }}
              >
                Add another business <ArrowRight size={16} />
              </button>
            )}
          </div>
        ) : (
          <form className="booking-request-form" onSubmit={submit} key={formKey}>
            <div className="booking-fields-grid">
              <label>
                Your name <span aria-hidden="true">*</span>
                <input name="name" type="text" autoComplete="name" maxLength={100} required />
              </label>
              <label>
                Email address <span aria-hidden="true">*</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  defaultValue={user?.primaryEmailAddress?.emailAddress || ''}
                  required
                />
              </label>
              <label className="booking-field-wide">
                Business name <span aria-hidden="true">*</span>
                <input name="businessName" type="text" maxLength={120} required />
              </label>
              <label className="booking-field-wide">
                Business website <span className="booking-optional">(optional)</span>
                <input name="website" type="url" maxLength={2048} placeholder="https://" />
              </label>
              <label>
                Proposed date <span>(IST)</span>
                <input name="proposedDate" type="date" min={getIstToday()} defaultValue={getSuggestedIstDate()} required />
              </label>
              <label>
                Proposed time <span>(IST)</span>
                <select name="proposedTime" defaultValue="10:00" required>
                  {BOOKING_TIMES.map((time) => <option key={time} value={time}>{time}</option>)}
                </select>
              </label>
              <label className="booking-field-wide">
                What do you need help with? <span aria-hidden="true">*</span>
                <select name="service" defaultValue="" required>
                  <option value="" disabled>Select a service</option>
                  <option>Video editing</option>
                  <option>Content strategy</option>
                  <option>AI video production</option>
                  <option>Social media management</option>
                  <option>Custom bundle</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="booking-field-wide">
                A little about the project <span aria-hidden="true">*</span>
                <textarea name="projectDetails" rows={4} maxLength={2000} required />
              </label>
            </div>

            <p className="booking-limit-note">Your selected slot is a proposal. Elevar will confirm it by email.</p>
            <p className="booking-limit-note">Up to three requests per account each day, resetting at midnight IST. Register each business separately.</p>
            {error && <p className="booking-error" role="alert">{error}</p>}
            <button className="btn btn-primary booking-submit" type="submit" disabled={submitting}>
              {submitting ? <><LoaderCircle className="booking-spinner" size={17} /> Sending…</> : <>Send request <ArrowRight size={16} /> </>}
            </button>
          </form>
        )}
      </SignedIn>
    </>
  );
}
