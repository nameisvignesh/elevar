import { createRemoteJWKSet, jwtVerify } from 'npm:jose@5.9.6';

const productionOrigin = 'https://nameisvignesh.github.io';
const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || `${productionOrigin},http://localhost:3000`)
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const corsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  Vary: 'Origin',
});

function json(data: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function validText(value: unknown, maximum: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maximum;
}

function validEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validProposedSlot(date: string, time: string) {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const timeMatch = /^(\d{2}):(00|30)$/.exec(time);
  if (!dateMatch || !timeMatch) return false;

  const [, year, month, day] = dateMatch;
  const normalizedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (normalizedDate.toISOString().slice(0, 10) !== date) return false;

  const hour = Number(timeMatch[1]);
  if (hour < 9 || hour > 17) return false;

  const proposedInstant = new Date(`${date}T${time}:00+05:30`);
  return Number.isFinite(proposedInstant.getTime()) && proposedInstant.getTime() > Date.now();
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin');
  if (origin && !allowedOrigins.includes(origin)) return json({ error: 'This site is not allowed to submit booking requests.' }, 403, null);
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(origin) });
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, origin);

  const issuer = Deno.env.get('CLERK_ISSUER_URL')?.replace(/\/$/, '');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!issuer || !supabaseUrl || !serviceKey) {
    console.error('Book call integration is missing server configuration.');
    return json({ error: 'Booking is temporarily unavailable. Please email the studio.' }, 503, origin);
  }

  const bearer = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!bearer) return json({ error: 'Please sign in to send a request.' }, 401, origin);

  let clerkUserId: string;
  try {
    const jwks = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`));
    const verified = await jwtVerify(bearer, jwks, { issuer, algorithms: ['RS256'] });
    clerkUserId = typeof verified.payload.sub === 'string' ? verified.payload.sub : '';
    if (!clerkUserId) throw new Error('The account token is missing a user identity.');
  } catch (error) {
    console.warn('Rejected invalid Clerk token:', error instanceof Error ? error.message : 'token verification failed');
    return json({ error: 'Your sign-in has expired. Please sign in and try again.' }, 401, origin);
  }

  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return json({ error: 'Please check your request details and try again.' }, 400, origin);
  }

  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const businessName = typeof input.businessName === 'string' ? input.businessName.trim() : '';
  const website = typeof input.website === 'string' ? input.website.trim() : '';
  const service = typeof input.service === 'string' ? input.service.trim() : '';
  const projectDetails = typeof input.projectDetails === 'string' ? input.projectDetails.trim() : '';
  const proposedDate = typeof input.proposedDate === 'string' ? input.proposedDate.trim() : '';
  const proposedTime = typeof input.proposedTime === 'string' ? input.proposedTime.trim() : '';
  const allowedServices = new Set(['Video editing', 'Content strategy', 'AI video production', 'Social media management', 'Custom bundle', 'Other']);

  if (!validText(name, 100) || !validEmail(email) || !validText(businessName, 120) ||
      !validText(service, 80) || !allowedServices.has(service) || !validText(projectDetails, 2000) ||
      website.length > 2048 || (website && !/^https?:\/\//i.test(website)) ||
      !validProposedSlot(proposedDate, proposedTime)) {
    return json({ error: 'Please complete the required fields with valid details.' }, 400, origin);
  }

  const rpcResponse = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/submit_book_call_request`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      p_clerk_user_id: clerkUserId,
      p_name: name,
      p_email: email,
      p_business_name: businessName,
      p_website: website,
      p_service: service,
      p_project_details: projectDetails,
      p_proposed_date: proposedDate,
      p_proposed_time: proposedTime,
    }),
  });

  if (!rpcResponse.ok) {
    console.error('Booking request storage failed:', rpcResponse.status, await rpcResponse.text());
    return json({ error: 'We couldn’t save your request. Please try again shortly.' }, 503, origin);
  }

  const result = await rpcResponse.json();
  if (!result?.accepted) return json({ error: 'You’ve reached three requests for today. You can send another after midnight IST.' }, 429, origin);

  const requestId = String(result.requestId || '');
  let agencyAutomation = { emailSent: false, emailImportant: false, taskCreated: false, spreadsheetUpdated: false, excelAttached: false };
  const automationUrl = Deno.env.get('GOOGLE_APPS_SCRIPT_URL');
  const automationToken = Deno.env.get('GOOGLE_APPS_SCRIPT_TOKEN');

  if (automationUrl && automationToken) {
    try {
      const automationResponse = await fetch(automationUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: automationToken,
          requestId,
          name,
          email,
          businessName,
          website,
          service,
          projectDetails,
          proposedDate,
          proposedTime,
          timeZone: 'Asia/Kolkata',
        }),
      });
      const automationResult = await automationResponse.json().catch(() => ({}));
      if (automationResponse.ok && automationResult?.ok) {
        agencyAutomation = {
          emailSent: Boolean(automationResult.emailSent),
          emailImportant: Boolean(automationResult.emailImportant),
          taskCreated: Boolean(automationResult.taskCreated),
          spreadsheetUpdated: Boolean(automationResult.spreadsheetUpdated),
          excelAttached: Boolean(automationResult.excelAttached),
        };
      } else {
        console.error('Agency booking automation did not complete:', automationResponse.status);
      }
    } catch (error) {
      console.error('Agency booking automation request failed:', error instanceof Error ? error.message : 'unknown error');
    }
  }

  return json({
    accepted: true,
    remaining: Number(result.remaining) || 0,
    requestId,
    agencyEmailSent: agencyAutomation.emailSent,
    agencyEmailImportant: agencyAutomation.emailImportant,
    agencyTaskCreated: agencyAutomation.taskCreated,
    agencySpreadsheetUpdated: agencyAutomation.spreadsheetUpdated,
    agencyExcelAttached: agencyAutomation.excelAttached,
  }, 200, origin);
});
