function onEditCheckbox(e) {
  var sheet = e.source.getSheetByName("sheet_name"); // Replace with your sheet name
  if (!sheet) {
    return;
  }

  var range = e.range;
  var row = range.getRow();
  var col = range.getColumn();

  // Get the status from column 6
  var status = sheet.getRange(row, 6).getValue();

  // Check if the edit was made in the "Confirm" column (G, which is column 7) and email hasn't been sent yet
  if (col == 7 && sheet.getRange(row, col).getValue() === true && status !== "Confirmed") {
    var name = sheet.getRange(row, 1).getValue();
    var date = sheet.getRange(row, 2).getValue();
    var time = sheet.getRange(row, 3).getValue();
    var people = sheet.getRange(row, 4).getValue();
    var email = sheet.getRange(row, 5).getValue();

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

    // Update the status and row color
    sheet.getRange(row, 1, 1, sheet.getLastColumn()).setBackground("green");
    sheet.getRange(row, 7).removeCheckboxes().setValue("");
    sheet.getRange(row, 8).removeCheckboxes().setValue("");
    sheet.getRange(row, 6).setValue("Confirmed");
  }

  // Check if the edit was made in the "Reject" column (H, which is column 8) and email hasn't been sent yet
  if (col == 8 && sheet.getRange(row, col).getValue() === true && status !== "Rejected") {
    var name = sheet.getRange(row, 1).getValue();
    var date = sheet.getRange(row, 2).getValue();
    var time = sheet.getRange(row, 3).getValue();
    var people = sheet.getRange(row, 4).getValue();
    var email = sheet.getRange(row, 5).getValue();

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
  }
}
