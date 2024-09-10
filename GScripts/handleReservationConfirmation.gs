function onEditCheckbox(e) {
  var sheet = e.source.getSheetByName("sheet_name"); // Replace with your main sheet name
  if (!sheet) {
    return;
  }

  var processedSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("processed_sheet_name"); // Replace with your processed sheet name
  if (!processedSheet) {
    Logger.log('Error: Sheet "processed_sheet_name" not found.');
    return;
  }

  var calendarId = 'your_calendar_id@group.calendar.google.com'; // Replace with your calendar ID
  var calendar = CalendarApp.getCalendarById(calendarId);

  var range = e.range;
  var row = range.getRow();
  var col = range.getColumn();

  // Get the status from column 6
  var status = sheet.getRange(row, 6).getValue();

  // Check if the edit was made in the "Confirm" column (G, which is column 7) and the email hasn't been sent yet
  if (col == 7 && sheet.getRange(row, col).getValue() === true && status !== "Confirmed") {
    var name = sheet.getRange(row, 1).getValue();
    var date = sheet.getRange(row, 2).getValue();
    var time = sheet.getRange(row, 3).getValue();
    var people = sheet.getRange(row, 4).getValue();
    var email = sheet.getRange(row, 5).getValue();
    var messageId = findMessageIdByEmail(email, date, time, people);

    var formattedDate = Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), "MM/dd/yyyy");

    var subject = "Confirmation of Your Reservation";
    var body = `
      <p>Hello ${name},</p>
      <p>We are pleased to confirm your reservation on <strong>${formattedDate}</strong> at <strong>${time}</strong> for <strong>${people}</strong> people. Looking forward to welcoming you.</p>
      <p>Best regards,<br>Restaurant Name</p> <!-- Replace with your restaurant name -->
    `;

    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: body
    });

    // Add to Google Calendar
    var eventTitle = `Reservation for ${name}`;
    var startTime = new Date(`${date} ${time}`);
    var endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // Assuming 2 hours reservation
    var event = calendar.createEvent(eventTitle, startTime, endTime, {
      description: `Reservation for ${people} persons.\nEmail: ${email}`,
      guests: email
    });

    // Update the status and row color
    sheet.getRange(row, 1, 1, sheet.getLastColumn()).setBackground("green");
    sheet.getRange(row, 7).removeCheckboxes().setValue("");
    sheet.getRange(row, 8).removeCheckboxes().setValue("");
    sheet.getRange(row, 6).setValue("Confirmed");

    if (messageId) {
      updateProcessedRowColor(processedSheet, messageId, "green");
    }
  }

  // Check if the edit was made in the "Reject" column (H, which is column 8) and email hasn't been sent yet
  if (col == 8 && sheet.getRange(row, col).getValue() === true && status !== "Rejected") {
    var name = sheet.getRange(row, 1).getValue();
    var date = sheet.getRange(row, 2).getValue();
    var time = sheet.getRange(row, 3).getValue();
    var people = sheet.getRange(row, 4).getValue();
    var email = sheet.getRange(row, 5).getValue();
    var messageId = findMessageIdByEmail(email, date, time, people);

    var formattedDate = Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), "MM/dd/yyyy");

    var subject = "Reservation Cancellation";
    var body = `
      <p>Hello ${name},</p>
      <p>We regret to inform you that your reservation for <strong>${people}</strong> people on <strong>${formattedDate}</strong> at <strong>${time}</strong> has been canceled.</p>
      <p>Best regards,<br>Restaurant Name</p> <!-- Replace with your restaurant name -->
    `;

    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: body
    });

    // Update the status and row color
    sheet.getRange(row, 1, 1, sheet.getLastColumn()).setBackground("red");
    sheet.getRange(row, 7).removeCheckboxes().setValue("");
    sheet.getRange(row, 8).removeCheckboxes().setValue("");
    sheet.getRange(row, 6).setValue("Rejected");

    if (messageId) {
      updateProcessedRowColor(processedSheet, messageId, "red");
    }
  }
}

function findMessageIdByEmail(email, date, time, people) {
  var processedSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("processed_sheet_name"); // Replace with your processed sheet name
  var data = processedSheet.getRange(2, 1, processedSheet.getLastRow() - 1, 6).getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][5] === email && data[i][2] === date && data[i][3] === time && data[i][4] === people) {
      return data[i][0];
    }
  }
  return null;
}

function updateProcessedRowColor(sheet, messageId, color) {
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === messageId) {
      sheet.getRange(i + 2, 1, 1, sheet.getLastColumn()).setBackground(color);
      break;
    }
  }
}

function setupCheckboxTrigger() {
  ScriptApp.newTrigger('onEditCheckbox')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();
}
