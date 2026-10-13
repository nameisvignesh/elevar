const BOOKING_PREFIX = 'elevar_booking_';

function doGet() {
  return jsonOutput_({ ok: true, service: 'Elevar booking automation' });
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(25000)) return jsonOutput_({ ok: false, error: 'Please retry shortly.' });

  try {
    const properties = PropertiesService.getScriptProperties();
    const configuredToken = properties.getProperty('BOOKING_WEBHOOK_TOKEN') || '';
    const payload = JSON.parse(event && event.postData && event.postData.contents || '{}');
    if (!configuredToken || !constantTimeEqual_(String(payload.token || ''), configuredToken)) {
      return jsonOutput_({ ok: false, error: 'Unauthorized.' });
    }

    const requestId = String(payload.requestId || '');
    const name = cleanText_(payload.name, 100);
    const email = cleanText_(payload.email, 254);
    const businessName = cleanText_(payload.businessName, 120);
    const website = cleanText_(payload.website, 2048);
    const service = cleanText_(payload.service, 80);
    const projectDetails = cleanText_(payload.projectDetails, 2000);
    const proposedDate = String(payload.proposedDate || '');
    const proposedTime = String(payload.proposedTime || '');
    const agencyEmail = String(properties.getProperty('AGENCY_EMAIL') || '').trim();

    if (!/^[0-9a-f-]{36}$/i.test(requestId) || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !businessName || !agencyEmail || !validSlot_(proposedDate, proposedTime)) {
      return jsonOutput_({ ok: false, error: 'The booking request is incomplete.' });
    }

    cleanupOldBookings_(properties);
    const stateKey = BOOKING_PREFIX + requestId;
    const state = JSON.parse(properties.getProperty(stateKey) || '{"emailSent":false,"emailImportant":false,"taskCreated":false}');
    const subject = '[Elevar call request] ' + requestId;
    const body = [
      'A client proposed a strategy call. The time is pending Elevar confirmation.',
      '',
      'Proposed date: ' + proposedDate,
      'Proposed time: ' + proposedTime + ' IST (Asia/Kolkata)',
      '',
      'Name: ' + name,
      'Email: ' + email,
      'Business: ' + businessName,
      'Website: ' + (website || 'Not provided'),
      'Service: ' + (service || 'Not provided'),
      '',
      'Project details:',
      projectDetails || 'Not provided',
      '',
      'Request ID: ' + requestId,
    ].join('\n');

    if (!state.emailSent) {
      try {
        GmailApp.sendEmail(agencyEmail, subject, body, { replyTo: email, name: 'Elevar booking requests' });
        state.emailSent = true;
        state.createdAt = Date.now();
        saveState_(properties, stateKey, state);
      } catch (emailError) {
        console.error('Unable to send the agency booking email:', emailError && emailError.message || emailError);
      }
    }

    if (state.emailSent && !state.emailImportant) {
      try {
        state.emailImportant = markRequestImportant_(requestId);
        saveState_(properties, stateKey, state);
      } catch (importanceError) {
        console.error('Unable to mark the booking email important:', importanceError && importanceError.message || importanceError);
      }
    }

    if (!state.taskCreated) {
      try {
        const existingTask = findTaskByRequestId_(requestId);
        if (existingTask) {
          state.taskCreated = true;
        } else {
          const dueDate = new Date(proposedDate + 'T00:00:00.000Z').toISOString();
          Tasks.Tasks.insert({
            title: 'Review call proposal · ' + businessName + ' · ' + proposedDate + ' ' + proposedTime + ' IST',
            notes: body,
            due: dueDate,
          }, '@default');
          state.taskCreated = true;
        }
        saveState_(properties, stateKey, state);
      } catch (taskError) {
        console.error('Unable to create the booking follow-up task:', taskError && taskError.message || taskError);
      }
    }

    return jsonOutput_({
      ok: Boolean(state.emailSent || state.taskCreated),
      emailSent: Boolean(state.emailSent),
      emailImportant: Boolean(state.emailImportant),
      taskCreated: Boolean(state.taskCreated),
    });
  } catch (error) {
    console.error('Booking automation failed:', error && error.message || error);
    return jsonOutput_({ ok: false, error: 'Booking automation could not finish.' });
  } finally {
    lock.releaseLock();
  }
}

function markRequestImportant_(requestId) {
  const query = 'in:anywhere subject:"[Elevar call request] ' + requestId + '"';
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (attempt > 0) Utilities.sleep(750);
    const threads = GmailApp.search(query, 0, 5);
    if (!threads.length) continue;
    GmailApp.markThreadsImportant(threads);
    return true;
  }
  return false;
}

function findTaskByRequestId_(requestId) {
  let pageToken;
  do {
    const page = Tasks.Tasks.list('@default', { maxResults: 100, showCompleted: true, pageToken: pageToken });
    const existing = (page.items || []).find(function (task) {
      return String(task.notes || '').includes('Request ID: ' + requestId);
    });
    if (existing) return existing;
    pageToken = page.nextPageToken;
  } while (pageToken);
  return null;
}

function validSlot_(date, time) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^(0[9]|1[0-7]):(00|30)$/.test(time)) return false;
  const slot = new Date(date + 'T' + time + ':00+05:30');
  return Number.isFinite(slot.getTime()) && slot.getTime() > Date.now();
}

function cleanText_(value, maximum) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maximum);
}

function saveState_(properties, key, state) {
  properties.setProperty(key, JSON.stringify(state));
}

function cleanupOldBookings_(properties) {
  const cutoff = Date.now() - 45 * 24 * 60 * 60 * 1000;
  const all = properties.getProperties();
  Object.keys(all).forEach(function (key) {
    if (!key.startsWith(BOOKING_PREFIX)) return;
    try {
      const state = JSON.parse(all[key]);
      if (Number(state.createdAt) < cutoff) properties.deleteProperty(key);
    } catch (_) {
      properties.deleteProperty(key);
    }
  });
}

function constantTimeEqual_(candidate, expected) {
  const left = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, candidate, Utilities.Charset.UTF_8);
  const right = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, expected, Utilities.Charset.UTF_8);
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
}

function jsonOutput_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
