function sortSheetByDate() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("sheet_name"); // Replace with your main sheet name
  var lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    Logger.log("No data to sort.");
    return;
  }

  // Sort the range starting from row 2 to avoid sorting the header
  sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).sort({ column: 2, ascending: true });
}

function sortArchiveByDate() {
  var sheetName = 'Archive'; // Replace with your archive sheet name
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  
  if (sheet) {
    var range = sheet.getDataRange();
    range.sort({ column: 2, ascending: true });
  } else {
    Logger.log('Sheet with the name "' + sheetName + '" was not found.');
  }
}
