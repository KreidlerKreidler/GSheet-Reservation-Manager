function archiveProcessedEntries() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("sheet_name"); // Replace with your sheet name
  var archiveSheet = ss.getSheetByName("Archive"); // Replace with your archive sheet name

  // Create archive sheet if it doesn't exist
  if (!archiveSheet) {
    Logger.log("Archive sheet does not exist, creating new sheet.");
    archiveSheet = ss.insertSheet("Archive");
    archiveSheet.appendRow(["Name", "Date", "Time", "People", "Email", "Status"]);
  }

  var lastRow = sheet.getLastRow();
  Logger.log("Last row in " + sheet.getName() + ": " + lastRow);

  // If no data to process, stop
  if (lastRow <= 1) {
    Logger.log("No data to process.");
    return;
  }

  // Get the data range from the original sheet
  var dataRange = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn());
  var data = dataRange.getValues();
  var colors = dataRange.getBackgrounds();

  // Loop through the rows and process confirmed or rejected reservations
  for (var i = 0; i < data.length; i++) {
    var status = data[i][5]; // Assuming column F (index 5) contains the status

    Logger.log("Processing row " + (i + 2) + ": Status = " + status);

    // Archive rows with "Confirmed" or "Rejected" status
    if (status === "Confirmed" || status === "Rejected") {
      var name = data[i][0];
      var date = data[i][1]; // Original date value
      var time = data[i][2]; // Original time value
      var people = data[i][3];
      var email = data[i][4];
      var color = colors[i][0]; // Assuming the color is set in the first column

      Logger.log("Archiving entry: Name = " + name + ", Date = " + date + ", Time = " + time + ", People = " + people + ", Email = " + email + ", Status = " + status);

      // Append the row to the archive sheet
      archiveSheet.appendRow([name, date, time, people, email, status]);
      var newRow = archiveSheet.getLastRow();
      archiveSheet.getRange(newRow, 1, 1, 6).setBackground(color);

      // Clear the processed entry in the original sheet (columns A to L)
      var range = sheet.getRange(i + 2, 1, 1, 12);
      range.clearContent();
      range.setBackground("white");

      // Remove checkboxes in columns J, K, and L
      sheet.getRange(i + 2, 10).removeCheckboxes();
      sheet.getRange(i + 2, 11).removeCheckboxes();
      sheet.getRange(i + 2, 12).removeCheckboxes();
    }
  }
}
