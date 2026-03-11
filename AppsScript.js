/**
 * Google Apps Script — Academic To-Do Database
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Create two sheets (tabs) named exactly: "Tasks" and "Subjects"
 * 3. In the "Tasks" sheet, add these headers in Row 1:
 *    id | title | type | subject | date | desc | completed
 * 4. In the "Subjects" sheet, add these headers in Row 1:
 *    id | name | color
 * 5. Go to Extensions > Apps Script
 * 6. Paste this entire script and Save
 * 7. Click Deploy > New Deployment > Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 8. Copy the Web App URL and paste it into your site's script.js
 */

const SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();

// --- Handle GET requests (fetch data) ---
function doGet(e) {
  try {
    const action = e.parameter.action || 'getAll';
    let result = {};

    if (action === 'getAll') {
      result.tasks = getSheetData('Tasks');
      result.subjects = getSheetData('Subjects');
    } else if (action === 'getTasks') {
      result.tasks = getSheetData('Tasks');
    } else if (action === 'getSubjects') {
      result.subjects = getSheetData('Subjects');
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, data: result }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// --- Handle POST requests (write data) ---
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    let result = {};

    switch (action) {
      case 'syncAll':
        // Full sync — replaces all data
        clearAndWrite('Tasks', payload.tasks || []);
        clearAndWrite('Subjects', payload.subjects || []);
        result.message = 'Full sync complete';
        break;

      case 'addTask':
        appendRow('Tasks', payload.task);
        result.message = 'Task added';
        break;

      case 'updateTask':
        updateRow('Tasks', 'id', payload.task.id, payload.task);
        result.message = 'Task updated';
        break;

      case 'deleteTask':
        deleteRow('Tasks', 'id', payload.taskId);
        result.message = 'Task deleted';
        break;

      case 'addSubject':
        appendRow('Subjects', payload.subject);
        result.message = 'Subject added';
        break;

      case 'updateSubject':
        updateRow('Subjects', 'id', payload.subject.id, payload.subject);
        result.message = 'Subject updated';
        break;

      case 'deleteSubject':
        deleteRow('Subjects', 'id', payload.subjectId);
        result.message = 'Subject deleted';
        break;

      default:
        result.message = 'Unknown action: ' + action;
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, data: result }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// --- Helper: Read sheet data as array of objects ---
function getSheetData(sheetName) {
  const sheet = SPREADSHEET.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      let val = row[i];
      // Convert boolean strings
      if (val === true || val === 'TRUE' || val === 'true') val = true;
      else if (val === false || val === 'FALSE' || val === 'false') val = false;
      // Convert date objects to string
      if (val instanceof Date) {
        val = Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      }
      obj[h] = val;
    });
    return obj;
  });
}

// --- Helper: Clear sheet and write fresh data ---
function clearAndWrite(sheetName, dataArray) {
  const sheet = SPREADSHEET.getSheetByName(sheetName);
  if (!sheet) return;
  
  // Keep headers (row 1), clear everything else
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
  
  if (!dataArray || dataArray.length === 0) return;
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const rows = dataArray.map(item => {
    return headers.map(h => {
      const val = item[h];
      return val !== undefined && val !== null ? val : '';
    });
  });
  
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}

// --- Helper: Append a single row ---
function appendRow(sheetName, item) {
  const sheet = SPREADSHEET.getSheetByName(sheetName);
  if (!sheet) return;
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(h => {
    const val = item[h];
    return val !== undefined && val !== null ? val : '';
  });
  
  sheet.appendRow(row);
}

// --- Helper: Update a row by matching a key column ---
function updateRow(sheetName, keyCol, keyVal, item) {
  const sheet = SPREADSHEET.getSheetByName(sheetName);
  if (!sheet) return;
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const keyIndex = headers.indexOf(keyCol);
  if (keyIndex === -1) return;
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][keyIndex]) === String(keyVal)) {
      const row = headers.map(h => {
        const val = item[h];
        return val !== undefined && val !== null ? val : '';
      });
      sheet.getRange(i + 1, 1, 1, headers.length).setValues([row]);
      return;
    }
  }
}

// --- Helper: Delete a row by matching a key column ---
function deleteRow(sheetName, keyCol, keyVal) {
  const sheet = SPREADSHEET.getSheetByName(sheetName);
  if (!sheet) return;
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const keyIndex = headers.indexOf(keyCol);
  if (keyIndex === -1) return;
  
  for (let i = data.length - 1; i >= 1; i--) {
    if (String(data[i][keyIndex]) === String(keyVal)) {
      sheet.deleteRow(i + 1);
      return;
    }
  }
}
