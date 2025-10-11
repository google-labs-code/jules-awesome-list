/**
 * @file Sheet_Interface.gs
 * @description Central module for all interactions with the Google Sheet database.
 * This file contains functions for reading, writing, updating, and deleting data
 * from the various sheets in the spreadsheet.
 */

// Global variable to hold the spreadsheet instance for efficiency.
let SPREADSHEET;

/**
 * Initializes and returns the active Spreadsheet object.
 * Caches the spreadsheet object to avoid repeated calls.
 * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet} The active spreadsheet object.
 */
function getSpreadsheet() {
  if (SPREADSHEET) {
    return SPREADSHEET;
  }
  const sheetId = getConfig_('SHEET_ID');
  if (!sheetId) {
    throw new Error('SHEET_ID is not defined in the Config sheet.');
  }
  SPREADSHEET = SpreadsheetApp.openById(sheetId);
  return SPREADSHEET;
}

/**
 * A private helper function to get a specific configuration value from the 'Config' sheet.
 * @param {string} key The key (setting name) to look up.
 * @returns {string|null} The value of the setting or null if not found.
 */
function getConfig_(key) {
  try {
    const configSheet = getSpreadsheet().getSheetByName('Config');
    const data = configSheet.getDataRange().getValues();
    // Start from 1 to skip header row
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === key) {
        return data[i][1];
      }
    }
    return null;
  } catch (e) {
    // This will likely be called by the error logger, so log to console.
    console.error(`Error getting config for key ${key}: ${e.toString()}`);
    return null;
  }
}

/**
 * Retrieves all data from a specified sheet.
 * @param {string} sheetName The name of the sheet to read data from.
 * @returns {Array<Array<string>>} A 2D array of data. Returns headers only if sheet is empty.
 */
function getAllData(sheetName) {
  try {
    const sheet = getSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found.`);
    }
    return sheet.getDataRange().getValues();
  } catch (e) {
    logError_('getAllData', `Failed to get data from ${sheetName}.`, e);
    return [];
  }
}

/**
 * Finds specific rows in a sheet based on a key-value pair.
 * @param {string} sheetName The name of the sheet to search in.
 * @param {string} key The column header to search under.
 * @param {*} value The value to match.
 * @returns {Array<Object>} An array of objects, where each object represents a matching row.
 */
function findData(sheetName, key, value) {
  try {
    const sheet = getSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found.`);
    }
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const keyIndex = headers.indexOf(key);

    if (keyIndex === -1) {
      throw new Error(`Column "${key}" not found in sheet "${sheetName}".`);
    }

    const results = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i][keyIndex] == value) {
        let rowObject = {};
        headers.forEach((header, index) => {
          rowObject[header] = data[i][index];
        });
        results.push(rowObject);
      }
    }
    return results;
  } catch (e) {
    logError_('findData', `Failed to find data in ${sheetName}.`, e);
    return [];
  }
}

/**
 * Appends a new row of data to the specified sheet.
 * @param {string} sheetName The name of the sheet to append to.
 * @param {Array<any>} rowData An array of values representing the row to be added.
 * @returns {boolean} True if the operation was successful, false otherwise.
 */
function appendData(sheetName, rowData) {
  try {
    const sheet = getSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found.`);
    }
    sheet.appendRow(rowData);
    return true;
  } catch (e) {
    logError_('appendData', `Failed to append data to ${sheetName}.`, e);
    return false;
  }
}

/**
 * Updates a specific row in a sheet.
 * @param {string} sheetName The name of the sheet.
 * @param {string} key The column header to use for identifying the row.
 * @param {*} value The value to match in the key column.
 * @param {Object} newData An object where keys are column headers and values are the new data.
 * @returns {boolean} True if a row was updated, false otherwise.
 */
function updateData(sheetName, key, value, newData) {
  try {
    const sheet = getSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found.`);
    }
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const keyIndex = headers.indexOf(key);

    if (keyIndex === -1) {
      throw new Error(`Column "${key}" not found in sheet "${sheetName}".`);
    }

    for (let i = 1; i < data.length; i++) {
      if (data[i][keyIndex] == value) {
        // Row found, now update it
        headers.forEach((header, index) => {
          if (newData.hasOwnProperty(header)) {
            sheet.getRange(i + 1, index + 1).setValue(newData[header]);
          }
        });
        return true; // Assume only one row is updated
      }
    }
    return false; // No matching row found
  } catch (e) {
    logError_('updateData', `Failed to update data in ${sheetName}.`, e);
    return false;
  }
}

/**
 * Deletes rows from a sheet based on a key-value pair.
 * @param {string} sheetName The name of the sheet.
 * @param {string} key The column header to search under.
 * @param {*} value The value to match for deletion.
 * @returns {boolean} True if at least one row was deleted, false otherwise.
 */
function deleteData(sheetName, key, value) {
  try {
    const sheet = getSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found.`);
    }
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const keyIndex = headers.indexOf(key);

    if (keyIndex === -1) {
      throw new Error(`Column "${key}" not found in sheet "${sheetName}".`);
    }

    let rowsDeleted = 0;
    // Iterate backwards to avoid issues with row index changes after deletion
    for (let i = data.length - 1; i > 0; i--) {
      if (data[i][keyIndex] == value) {
        sheet.deleteRow(i + 1);
        rowsDeleted++;
      }
    }
    return rowsDeleted > 0;
  } catch (e) {
    logError_('deleteData', `Failed to delete data from ${sheetName}.`, e);
    return false;
  }
}

/**
 * A private centralized error logging function.
 * For now, it logs to the Apps Script console. Could be expanded to log to a sheet.
 * @param {string} functionName The name of the function where the error occurred.
 * @param {string} message A custom error message.
 * @param {Error} error The error object.
 */
function logError_(functionName, message, error) {
  console.error(`[${functionName}] ${message} | Error: ${error.toString()}`);
}
