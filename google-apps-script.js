/**
 * Google Apps Script — VR Adventures Booking Form Handler
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet (this is where submissions land)
 * 2. Add headers in row 1: Timestamp | Date | Guests | Event Type | Email
 * 3. Go to Extensions > Apps Script
 * 4. Paste this entire file into the script editor (replace any existing code)
 * 5. Update the SHEET_ID below with your Google Sheet's ID
 *    (the long string in the sheet URL between /d/ and /edit)
 * 6. Click Deploy > New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Copy the Web app URL and paste it into main.js where it says YOUR_APPS_SCRIPT_URL
 * 8. Done! Form submissions will now appear in your Google Sheet.
 */

var SHEET_ID = '1fJlo_9otEdt8CRGKYdH0a5po4ru_bsi012YiCvxxXoc';

function doPost(e) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),          // Timestamp
    data.date,           // Preferred date
    data.guests,         // Group size
    data.event_type,     // Type of event
    data.email           // Email address
  ]);

  // Send email notification
  MailApp.sendEmail({
    to: 'hello@prismatic-immersive.com',
    subject: 'Nieuwe VR Adventures boeking: ' + data.email,
    body: 'Datum: ' + data.date + '\n'
        + 'Aantal: ' + data.guests + '\n'
        + 'Type: ' + data.event_type + '\n'
        + 'Email: ' + data.email
  });

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
