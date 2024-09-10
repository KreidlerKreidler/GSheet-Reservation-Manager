function onEditManualCheckbox(e) {
  var sheet = e.source.getSheetByName("sheet_name"); // Replace with your sheet name
  if (!sheet) {
    return;
  }

  var range = e.range;
  var row = range.getRow();
  var col = range.getColumn();

  // Check if the edit was made in the "Manual Confirmation" column (J, which is column 10)
  if (col == 10 && sheet.getRange(row, col).getValue() === true) {
    var name = sheet.getRange(row, 1).getValue();
    var date = sheet.getRange(row, 2).getValue();
    var time = sheet.getRange(row, 3).getValue();
    var people = sheet.getRange(row, 4).getValue();
    var email = sheet.getRange(row, 5).getValue();

    var formattedDate = Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), "MM/dd/yyyy");
    var formattedTime = Utilities.formatDate(new Date(time), Session.getScriptTimeZone(), "HH:mm");

    var mailtoLink = `mailto:${email}`;
    var userInfo = `Name: ${name}<br>Date: ${formattedDate}<br>Time: ${formattedTime}<br>People: ${people}<br>Email: ${email}`;
    showMailtoLink(mailtoLink, userInfo);

    sheet.getRange(row, 1, 1, sheet.getLastColumn()).setBackground("green");

    sheet.getRange(row, 7).removeCheckboxes().setValue("");
    sheet.getRange(row, 8).removeCheckboxes().setValue("");
    sheet.getRange(row, 10).removeCheckboxes().setValue("");
    sheet.getRange(row, 11).removeCheckboxes().setValue("");
    sheet.getRange(row, 6).setValue("Confirmed");
  }

  // Check if the edit was made in the "Manual Rejection" column (K, which is column 11)
  if (col == 11 && sheet.getRange(row, col).getValue() === true) {
    var name = sheet.getRange(row, 1).getValue();
    var date = sheet.getRange(row, 2).getValue();
    var time = sheet.getRange(row, 3).getValue();
    var people = sheet.getRange(row, 4).getValue();
    var email = sheet.getRange(row, 5).getValue();

    var formattedDate = Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), "MM/dd/yyyy");
    var formattedTime = Utilities.formatDate(new Date(time), Session.getScriptTimeZone(), "HH:mm");

    var mailtoLink = `mailto:${email}`;
    var userInfo = `Name: ${name}<br>Date: ${formattedDate}<br>Time: ${formattedTime}<br>People: ${people}<br>Email: ${email}`;
    showMailtoLink(mailtoLink, userInfo);

    sheet.getRange(row, 1, 1, sheet.getLastColumn()).setBackground("red");

    sheet.getRange(row, 7).removeCheckboxes().setValue("");
    sheet.getRange(row, 8).removeCheckboxes().setValue("");
    sheet.getRange(row, 10).removeCheckboxes().setValue("");
    sheet.getRange(row, 11).removeCheckboxes().setValue("");
    sheet.getRange(row, 6).setValue("Rejected");
  }
}

function showMailtoLink(mailtoLink, userInfo) {
  var html = `
    <p>Click the following link to send the email:</p>
    <p><a href="${mailtoLink}" target="_blank">Send Email</a></p>
    <p>After sending the email, you can close this window.</p>
    <p><strong>User Information:</strong></p>
    <p>${userInfo.replace(/\n/g, "<br>")}</p>
    <button onclick="google.script.host.close()">Close</button>
  `;
  var userInterface = HtmlService.createHtmlOutput(html);
  SpreadsheetApp.getUi().showModalDialog(userInterface, 'Email Preparation');
}

function setupManualCheckboxTrigger() {
  ScriptApp.newTrigger('onEditManualCheckbox')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();
}
