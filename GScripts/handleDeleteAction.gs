function onEditColumnL(e) {
  var sheet = e.source.getSheetByName("sheet_name"); // Replace with your sheet name
  if (!sheet) {
    return;
  }

  var range = e.range;
  var row = range.getRow();
  var col = range.getColumn();

  // Check if the edit was made in the "Delete" column (L, which is column 12)
  if (col == 12 && sheet.getRange(row, col).getValue() === true) {
    // Clear the entire row
    sheet.getRange(row, 1, 1, sheet.getLastColumn()).clearContent();

    // Reset the row color to white
    sheet.getRange(row, 1, 1, sheet.getLastColumn()).setBackground("white");

    // Remove checkboxes in columns G, H, J, K, and L
    sheet.getRange(row, 7).removeCheckboxes(); // Remove checkbox in column G (Confirm)
    sheet.getRange(row, 8).removeCheckboxes(); // Remove checkbox in column H (Decline)
    sheet.getRange(row, 10).removeCheckboxes(); // Remove checkbox in column J
    sheet.getRange(row, 11).removeCheckboxes(); // Remove checkbox in column K
    sheet.getRange(row, 12).removeCheckboxes(); // Remove checkbox in column L (Delete)
  }
}

function setupColumnLTrigger() {
  // Set up an onEdit trigger to run the onEditColumnL function when the spreadsheet is edited
  ScriptApp.newTrigger('onEditColumnL')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();
}
