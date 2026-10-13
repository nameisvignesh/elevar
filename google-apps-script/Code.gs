const BOOKING_PREFIX = 'elevar_booking_';
const BOOKING_SHEET_PROPERTY = 'BOOKING_SPREADSHEET_ID';
const BOOKING_HEADERS = [
  'Request ID',
  'Submitted at (IST)',
  'Status',
  'Proposed date (IST)',
  'Proposed time (IST)',
  'Duration',
  'Client name',
  'Client email',
  'Business',
  'Website',
  'Service',
  'Project details',
];

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
    const state = JSON.parse(properties.getProperty(stateKey) || '{"emailSent":false,"emailImportant":false,"taskCreated":false,"spreadsheetUpdated":false,"excelAttached":false}');
    const subject = '[Elevar call request] ' + requestId + ' · ' + businessName + ' · ' + proposedDate + ' at ' + proposedTime + ' IST';
    const proposedDateLabel = Utilities.formatDate(
      new Date(proposedDate + 'T12:00:00+05:30'),
      'Asia/Kolkata',
      'EEEE, d MMMM yyyy'
    );

    if (!state.spreadsheetUpdated) {
      try {
        const bookingSheet = appendBookingToSheet_({
          requestId: requestId,
          name: name,
          email: email,
          businessName: businessName,
          website: website,
          service: service,
          projectDetails: projectDetails,
          proposedDate: proposedDate,
          proposedTime: proposedTime,
        });
        state.spreadsheetUpdated = true;
        state.spreadsheetUrl = bookingSheet.url;
        state.createdAt = state.createdAt || Date.now();
        saveState_(properties, stateKey, state);
      } catch (sheetError) {
        console.error('Unable to update the Elevar booking spreadsheet:', sheetError && sheetError.message || sheetError);
      }
    }

    const body = buildBookingEmailText_({
      requestId: requestId,
      proposedDateLabel: proposedDateLabel,
      proposedDate: proposedDate,
      proposedTime: proposedTime,
      name: name,
      email: email,
      businessName: businessName,
      website: website,
      service: service,
      projectDetails: projectDetails,
      spreadsheetUrl: state.spreadsheetUrl || '',
    });

    if (!state.emailSent) {
      try {
        const emailOptions = {
          replyTo: email,
          name: 'Elevar booking requests',
          htmlBody: buildBookingEmailHtml_({
            requestId: requestId,
            proposedDateLabel: proposedDateLabel,
            proposedDate: proposedDate,
            proposedTime: proposedTime,
            name: name,
            email: email,
            businessName: businessName,
            website: website,
            service: service,
            projectDetails: projectDetails,
            spreadsheetUrl: state.spreadsheetUrl || '',
          }),
        };
        if (state.spreadsheetUpdated) {
          emailOptions.attachments = [exportBookingWorkbook_()];
        }
        GmailApp.sendEmail(agencyEmail, subject, body, emailOptions);
        state.emailSent = true;
        state.excelAttached = Boolean(state.spreadsheetUpdated);
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
      ok: Boolean(state.emailSent || state.taskCreated || state.spreadsheetUpdated),
      emailSent: Boolean(state.emailSent),
      emailImportant: Boolean(state.emailImportant),
      taskCreated: Boolean(state.taskCreated),
      spreadsheetUpdated: Boolean(state.spreadsheetUpdated),
      excelAttached: Boolean(state.excelAttached),
    });
  } catch (error) {
    console.error('Booking automation failed:', error && error.message || error);
    return jsonOutput_({ ok: false, error: 'Booking automation could not finish.' });
  } finally {
    lock.releaseLock();
  }
}

function appendBookingToSheet_(booking) {
  const spreadsheet = getBookingSpreadsheet_();
  const sheet = spreadsheet.getSheetByName('Call requests');
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const requestIds = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues();
    const existingIndex = requestIds.findIndex(function (row) { return row[0] === booking.requestId; });
    if (existingIndex >= 0) return { url: spreadsheet.getUrl(), row: existingIndex + 2 };
  }

  const row = sheet.getLastRow() + 1;
  const values = [
    booking.requestId,
    Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss'),
    'Proposed — awaiting Elevar confirmation',
    booking.proposedDate,
    booking.proposedTime,
    '30 minutes',
    booking.name,
    booking.email,
    booking.businessName,
    booking.website || 'Not provided',
    booking.service,
    booking.projectDetails || 'Not provided',
  ].map(safeSpreadsheetValue_);

  sheet.getRange(row, 1, 1, values.length).setValues([values]);
  sheet.getRange(row, 4, 1, 3).setBackground('#edf4f7').setFontWeight('bold');
  sheet.getRange(row, 12).setWrap(true);
  sheet.setRowHeight(row, 56);
  return { url: spreadsheet.getUrl(), row: row };
}

function getBookingSpreadsheet_() {
  const properties = PropertiesService.getScriptProperties();
  const savedId = properties.getProperty(BOOKING_SHEET_PROPERTY);
  const spreadsheet = savedId
    ? SpreadsheetApp.openById(savedId)
    : SpreadsheetApp.create('Elevar call requests');
  const sheet = spreadsheet.getSheetByName('Call requests') || spreadsheet.getSheets()[0];
  if (sheet.getName() !== 'Call requests') sheet.setName('Call requests');
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, BOOKING_HEADERS.length).setValues([BOOKING_HEADERS]);
    sheet.getRange(1, 1, 1, BOOKING_HEADERS.length)
      .setBackground('#141414')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setWrap(true);
    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 36);
    [160, 155, 250, 140, 140, 100, 180, 220, 200, 240, 180, 360].forEach(function (width, index) {
      sheet.setColumnWidth(index + 1, width);
    });
    sheet.getRange(1, 1, sheet.getMaxRows(), BOOKING_HEADERS.length).createFilter();
  }
  if (!savedId) properties.setProperty(BOOKING_SHEET_PROPERTY, spreadsheet.getId());
  return spreadsheet;
}

function exportBookingWorkbook_() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty(BOOKING_SHEET_PROPERTY);
  if (!spreadsheetId) throw new Error('Booking spreadsheet has not been created.');
  return DriveApp.getFileById(spreadsheetId)
    .getAs(MimeType.MICROSOFT_EXCEL)
    .setName('Elevar-call-requests.xlsx');
}

function safeSpreadsheetValue_(value) {
  const text = String(value == null ? '' : value);
  return /^[=+@\-]/.test(text) ? "'" + text : text;
}

function buildBookingEmailText_(booking) {
  return [
    'ELEVAR  |  STRATEGY CALL REQUEST',
    'A client has proposed a 30-minute call. Elevar confirmation is still required.',
    '',
    'PROPOSED BOOKING',
    booking.proposedDateLabel,
    booking.proposedTime + ' IST (Asia/Kolkata) · 30 minutes',
    'Status: Awaiting Elevar confirmation',
    '',
    'CLIENT DETAILS',
    'Name: ' + booking.name,
    'Email: ' + booking.email,
    'Business: ' + booking.businessName,
    'Website: ' + (booking.website || 'Not provided'),
    'Service: ' + (booking.service || 'Not provided'),
    '',
    'PROJECT DETAILS',
    booking.projectDetails || 'Not provided',
    '',
    'Request ID: ' + booking.requestId,
    booking.spreadsheetUrl ? 'Booking tracker: ' + booking.spreadsheetUrl : 'Booking tracker: spreadsheet update pending',
    '',
    'This is a proposed time, not a confirmed meeting. Please reply to the client to accept or suggest another time.',
  ].join('\n');
}

function buildBookingEmailHtml_(booking) {
  const e = escapeHtml_;
  const projectDetails = e(booking.projectDetails || 'Not provided').replace(/\r?\n/g, '<br>');
  const tracker = booking.spreadsheetUrl
    ? '<a href="' + e(booking.spreadsheetUrl) + '" style="color:#2f647d;text-decoration:underline">Open the live booking spreadsheet</a>'
    : '<span style="color:#737b80">Spreadsheet update is pending</span>';
  return '<!doctype html><html><body style="margin:0;padding:28px 12px;background:#f2f4f5;font-family:Arial,Helvetica,sans-serif;color:#202326">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fff;border:1px solid #e2e6e8;border-radius:16px;overflow:hidden">' +
    '<tr><td style="padding:24px 30px;border-bottom:1px solid #e8ebed"><div style="font-size:15px;font-weight:700;letter-spacing:.08em">ELEVAR</div><div style="margin-top:7px;color:#70777c;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">Strategy call request</div></td></tr>' +
    '<tr><td style="padding:26px 30px 12px"><h1 style="margin:0;font-size:22px;line-height:1.3">A client proposed a call</h1><p style="margin:9px 0 0;color:#626a70;font-size:14px;line-height:1.6">Review the proposed slot and reply to confirm or suggest a different time.</p></td></tr>' +
    '<tr><td style="padding:12px 30px 22px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#edf4f7;border-left:4px solid #7593a1;border-radius:8px"><tr><td style="padding:17px 19px"><div style="color:#5a6870;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">Proposed booking · awaiting confirmation</div><div style="margin-top:8px;color:#171a1c;font-size:20px;font-weight:700;line-height:1.35">' + e(booking.proposedDateLabel) + '</div><div style="margin-top:3px;color:#31393e;font-size:16px;font-weight:600">' + e(booking.proposedTime) + ' IST <span style="font-size:13px;font-weight:400">· 30 minutes</span></div><div style="margin-top:5px;color:#626a70;font-size:12px">Asia/Kolkata</div></td></tr></table></td></tr>' +
    '<tr><td style="padding:0 30px 20px"><div style="color:#747c81;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">Client details</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:9px;border-top:1px solid #e8ebed">' +
    bookingDetailRow_('Name', booking.name) + bookingDetailRow_('Email', booking.email) + bookingDetailRow_('Business', booking.businessName) +
    bookingDetailRow_('Website', booking.website || 'Not provided') + bookingDetailRow_('Service', booking.service || 'Not provided') +
    '</table></td></tr>' +
    '<tr><td style="padding:0 30px 22px"><div style="color:#747c81;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">Project details</div><div style="margin-top:9px;padding:14px 15px;background:#f7f8f8;border-radius:8px;color:#363d41;font-size:13px;line-height:1.65">' + projectDetails + '</div></td></tr>' +
    '<tr><td style="padding:0 30px 24px"><div style="font-size:13px;line-height:1.8">' + tracker + '</div><div style="margin-top:8px;color:#7b8287;font-size:11px">Request ID: ' + e(booking.requestId) + '</div></td></tr>' +
    '<tr><td style="padding:16px 30px;background:#f7f8f8;color:#737b80;font-size:11px;line-height:1.6">This is only a proposal. The call is not booked until Elevar confirms the time with the client.</td></tr>' +
    '</table></td></tr></table></body></html>';
}

function bookingDetailRow_(label, value) {
  return '<tr><td style="width:130px;padding:10px 4px;border-bottom:1px solid #e8ebed;color:#737b80;font-size:12px">' + escapeHtml_(label) + '</td><td style="padding:10px 4px;border-bottom:1px solid #e8ebed;color:#262b2e;font-size:13px;word-break:break-word">' + escapeHtml_(value || 'Not provided') + '</td></tr>';
}

function escapeHtml_(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
  });
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
