function getEmailData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet_name"); // Replace with your sheet name (SHEET_NAME)
  if (!sheet) {
    Logger.log('Error: Sheet "Sheet_name" not found.');
    return;
  }

  var processedSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ProcessedIDs"); // Replace with your processed sheet name (PROCESSED_SHEET_NAME)
  if (!processedSheet) {
    Logger.log('Error: Sheet "ProcessedIDs" not found.');
    return;
  }

  var processedIDs = getProcessedIDs(processedSheet);

  // Search for unread emails from the specified sender with the specified subject
  var threads = GmailApp.search('from:your-email@domain.com subject:"Your Email Subject"'); // Replace with your email search query (EMAIL_SEARCH_QUERY)
  Logger.log('Found ' + threads.length + ' threads.');

  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];
      var messageId = message.getId();

      if (processedIDs.includes(messageId)) {
        Logger.log('Message already processed: ' + messageId);
        continue;
      }

      var content = message.getPlainBody();
      Logger.log('Email content: ' + content);

      try {
        // Parse the email content - Adjust regex according to your email format
        var name = content.match(/\*Name:\*\s*(.*)/i)[1]; // Adjust regex as needed for email parsing
        var email = content.match(/\*Email:\*\s*(.*)/i)[1]; // Adjust regex as needed for email parsing
        var time = content.match(/\*Time:\*\s*(.*)/i)[1]; // Adjust regex as needed for email parsing
        var rawDate = content.match(/\*Date:\*\s*(.*)/i)[1]; // Adjust regex as needed for email parsing
        var peopleCount = content.match(/\*People Count:\*\s*(.*)/i)[1]; // Adjust regex as needed for email parsing

        Logger.log('Raw Date: ' + rawDate);

        // Format the date
        var date = formatDate(rawDate);
        Logger.log('Parsed Data: ' + [name, date, time, peopleCount, email].join(', '));

        // Insert a new row at the top and add the data
        sheet.insertRowBefore(2);
        sheet.getRange(2, 1, 1, 8).setValues([[name, date, time, peopleCount, email, "", "", ""]]);

        // Set the background color of the new row to white
        sheet.getRange(2, 1, 1, 12).setBackground('white');

        // Add checkboxes for the specified columns
        sheet.getRange(2, 7).insertCheckboxes(); // "Confirm" column
        sheet.getRange(2, 8).insertCheckboxes(); // "Decline" column
        sheet.getRange(2, 10).insertCheckboxes(); // Column J
        sheet.getRange(2, 11).insertCheckboxes(); // Column K
        sheet.getRange(2, 12).insertCheckboxes(); // "Delete" column

        // Add the message ID and other details to the "ProcessedIDs" sheet
        processedSheet.appendRow([messageId, name, date, time, peopleCount, email]);

        // Move the email to the "processedreservations" label and mark it as read
        message.getThread().addLabel(GmailApp.getUserLabelByName("processedreservations")); // Replace with your label name (PROCESSED_LABEL_NAME)
        message.markRead();
      } catch (e) {
        Logger.log('Error parsing email: ' + e.message);
      }
    }
  }
}

function getProcessedIDs(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return [];
  }
  var data = sheet.getRange(2, 1, lastRow - 1, 1).getValues(); // Get message IDs
  var ids = [];
  for (var i = 0; i < data.length; i++) {
    ids.push(data[i][0]);
  }
  Logger.log('Processed IDs: ' + ids.join(', '));
  return ids;
}

function formatDate(rawDate) {
  var dateParts = rawDate.split(' ');
  var day = dateParts[0].replace('.', '');
  var month = getMonthFromEnglish(dateParts[1]);
  var year = dateParts[2];

  return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
}

function getMonthFromEnglish(month) {
  var months = {
    'January': 1,
    'February': 2,
    'March': 3,
    'April': 4,
    'May': 5,
    'June': 6,
    'July': 7,
    'August': 8,
    'September': 9,
    'October': 10,
    'November': 11,
    'December': 12
  };
  return months[month];
}
