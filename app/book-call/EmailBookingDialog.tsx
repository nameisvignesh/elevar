'use client';

import { FormEvent, useRef } from 'react';
import { ArrowUpRight, CalendarClock, X } from 'lucide-react';
import { BOOKING_TIMES, getIstToday, getSuggestedIstDate } from './bookingSlots';

const CONTACT_EMAIL = 'elevardigitalstudio@gmail.com';

export default function EmailBookingDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openDialog() {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const name = String(fields.get('name') || '').trim();
    const email = String(fields.get('email') || '').trim();
    const businessName = String(fields.get('businessName') || '').trim();
    const website = String(fields.get('website') || '').trim();
    const proposedDate = String(fields.get('proposedDate') || '');
    const proposedTime = String(fields.get('proposedTime') || '');
    const projectDetails = String(fields.get('projectDetails') || '').trim();
    const subject = `Strategy call request · ${businessName}`;
    const body = [
      'Hello Elevar,',
      '',
      'I would like to request a 30-minute strategy call for this business.',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Business: ${businessName}`,
      `Website: ${website || 'Not provided'}`,
      `Proposed time: ${proposedDate} at ${proposedTime} IST`,
      '',
      'This is a proposed time and is not confirmed until Elevar replies.',
      '',
      'Project details:',
      projectDetails || 'Not provided',
    ].join('\n');
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;

    if (submitter?.value === 'gmail') {
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}&su=${encodedSubject}&body=${encodedBody}`,
        '_blank',
        'noopener,noreferrer'
      );
      dialogRef.current?.close();
      return;
    }

    dialogRef.current?.close();
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`;
  }

  return (
    <>
      <button className="btn btn-primary booking-proposal-trigger" type="button" onClick={openDialog}>
        Email us to book <CalendarClock size={16} aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        className="booking-dialog"
        aria-labelledby="booking-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className="booking-dialog-heading">
          <div>
            <h3 id="booking-dialog-title">Propose a call time</h3>
            <p>Choose a time that works for you. Elevar will confirm by email.</p>
          </div>
          <button className="booking-dialog-close" type="button" onClick={() => dialogRef.current?.close()} aria-label="Close booking form">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form className="booking-dialog-form" onSubmit={prepareEmail}>
          <div className="booking-dialog-fields">
            <label>
              Your name
              <input name="name" autoComplete="name" maxLength={100} required />
            </label>
            <label>
              Email address
              <input name="email" type="email" autoComplete="email" maxLength={254} required />
            </label>
            <label className="booking-dialog-wide">
              Business name
              <input name="businessName" maxLength={120} required />
            </label>
            <label className="booking-dialog-wide">
              Business website <span className="booking-optional">(optional)</span>
              <input name="website" type="url" placeholder="https://" maxLength={2048} />
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
            <label className="booking-dialog-wide">
              What would you like to discuss? <span className="booking-optional">(optional)</span>
              <textarea name="projectDetails" rows={3} maxLength={1200} />
            </label>
          </div>

          <p className="booking-dialog-note">This only prepares an email. Your time is confirmed after Elevar replies.</p>
          <div className="booking-dialog-actions">
            <button className="btn btn-primary" type="submit" value="mail" name="mailTarget">
              Continue with email app <ArrowUpRight size={15} aria-hidden="true" />
            </button>
            <button className="btn btn-secondary" type="submit" value="gmail" name="mailTarget">
              Open Gmail <ArrowUpRight size={15} aria-hidden="true" />
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
