## Reservation Management Automation with Google Apps Script

This project automates the process of managing reservations using Google Sheets and Gmail. The provided Google Apps Scripts help you extract reservation details from emails, automate confirmation and rejection actions via checkboxes, archive processed reservations, and sort the data by date.

### Features:
- **Automatically extracts reservation details** from Gmail and adds them to a Google Sheet.
- **Handles confirmation/rejection** through checkboxes in the sheet.
- **Archives processed reservations** to a separate archive sheet.
- **Sorts reservation and archive sheets** by date.

---

### Setup Instructions:

#### Step 1: Set Up Google Sheets
1. Create a Google Sheet for managing reservations.
   - Add columns such as `Name`, `Date`, `Time`, `People`, `Email`, `Status`, `Confirm Checkbox`, `Reject Checkbox`, etc.
   - Add a ProcessedIDs Sheet to avoid double entries. (Make sure to tell the User never to touch this!)
   - Optionally, create an archive sheet to store processed reservations.

#### Step 2: Set Up Google Apps Script
1. Open the Google Apps Script editor from `Extensions > Apps Script`.
2. Create separate `.gs` files for each script and copy-paste the content of:
   - `getEmailData.gs`
   - `handleReservationConfirmation.gs`
   - `handleDeleteAction.gs`
   - `handleManualConfirmationCheckbox.gs`
   - `archiveProcessedEntries.gs`
   - `sortSheetsByDate.gs`
3. **Replace placeholders** in each script:
   - **`sheet_name`**: Replace with the actual name of your reservations sheet.
   - **`Archive`**: Replace with the name of your archive sheet.
   - **Email Search Query**: Update the search query in `getEmailData.gs` to match the correct email sender and subject.

#### Step 3: Set Up Triggers
1. In the Apps Script editor, go to `Triggers`.
2. Set the following triggers:
   - **onEdit Trigger**: For `onEditCheckbox`, `onEditManualCheckbox`, and `onEditColumnL`.
   - **Time-driven Trigger**: For `getEmailData` to periodically check for new emails (e.g., every 15 minutes).

---

### Scripts Summary:

### Scripts Summary:

| Script Name                           | Functionality                                                       | Suggested Timing                              |
|---------------------------------------|---------------------------------------------------------------------|-----------------------------------------------|
| `getEmailData.gs`                     | Fetches reservation emails and adds them to the sheet.              | Every 30 minutes                              |
| `handleReservationConfirmation.gs`    | Handles confirmations/rejections via checkboxes and sends emails.   | Triggered when a checkbox is edited (onEdit)  |
| `handleDeleteAction.gs`               | Handles row deletion when the "Delete" checkbox is checked.         | Triggered when a checkbox is edited (onEdit)  |
| `handleManualConfirmationCheckbox.gs` | Manually confirms/rejects reservations and shows mailto link.       | Triggered when a checkbox is edited (onEdit)  |
| `archiveProcessedEntries.gs`          | Moves processed reservations to the archive sheet.                  | Every night at 01:00 AM                       |
| `sortSheetsByDate.gs`                 | Sorts both the main reservation and archive sheets by date.         | Every 30 minutes                              |

---

### Notes:
- **Trigger Configuration**: Remember to set up the correct triggers (onEdit and time-driven) to automate the process.
- **Email Customization**: You may want to customize the confirmation and rejection email text in `handleReservationConfirmation.gs` and `handleManualConfirmationCheckbox.gs` based on your needs.
- **This system was tested with over 1000 real form submissions by two Restaurants. Squarespace forms were used as the data source, with reservation data being emailed and processed automatically through the scripts.
