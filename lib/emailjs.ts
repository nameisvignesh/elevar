/**
 * EmailJS client-side email helper.
 *
 * The site is a static export on GitHub Pages, so email is sent directly from
 * the browser via EmailJS (https://www.emailjs.com). The sender destination
 * (elevardigitalstudio@gmail.com) is configured inside the EmailJS templates,
 * not in code.
 *
 * Required env vars (see .env.example):
 *   NEXT_PUBLIC_EMAILJS_SERVICE_ID          – the Email Service id
 *   NEXT_PUBLIC_EMAILJS_TEMPLATE_CAREER_ID  – career application template id
 *   NEXT_PUBLIC_EMAILJS_TEMPLATE_BOOKING_ID – strategy-call booking template id
 *   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY          – account public key (safe to expose)
 */
import emailjs from '@emailjs/browser';

export const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '',
  careerTemplateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CAREER_ID ?? '',
  bookingTemplateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BOOKING_ID ?? '',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '',
};

/** True when the shared service id + public key are set. */
export function isEmailJSConfigured(): boolean {
  return Boolean(EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.publicKey);
}

/** True when the career template id is also set. */
export function isCareerEmailConfigured(): boolean {
  return isEmailJSConfigured() && Boolean(EMAILJS_CONFIG.careerTemplateId);
}

/** True when the booking template id is also set. */
export function isBookingEmailConfigured(): boolean {
  return isEmailJSConfigured() && Boolean(EMAILJS_CONFIG.bookingTemplateId);
}

export interface EmailJSAttachment {
  name: string;
  /** base64 content WITHOUT the `data:` URI prefix */
  data: string;
}

/**
 * Sends a career application email to the hiring inbox.
 * Template params (define these in the EmailJS template editor):
 *   from_name, from_email, reply_to, role, linkedin, location,
 *   application_id, portfolio_name, portfolio_note
 */
export async function sendCareerApplication(
  params: Record<string, string>,
  attachment?: EmailJSAttachment
): Promise<void> {
  const { serviceId, careerTemplateId, publicKey } = EMAILJS_CONFIG;
  const opts: { publicKey: string; attachments?: EmailJSAttachment[] } = {
    publicKey,
  };
  if (attachment) {
    opts.attachments = [attachment];
  }
  await emailjs.send(serviceId, careerTemplateId, params, opts);
}

/**
 * Sends a strategy-call booking request to the team inbox.
 * Template params (define these in the EmailJS template editor):
 *   from_name, from_email, reply_to, phone, website, role, revenue,
 *   brand_goal, frustration, preferred_date, preferred_time, booking_id
 */
export async function sendBookingRequest(
  params: Record<string, string>
): Promise<void> {
  const { serviceId, bookingTemplateId, publicKey } = EMAILJS_CONFIG;
  await emailjs.send(serviceId, bookingTemplateId, params, { publicKey });
}
