# sheets_handler.py

"""
Module for all interactions with the Google Sheet database.
Uses the gspread library and authenticates via a Google Service Account.
"""

import gspread
from oauth2client.service_account import ServiceAccountCredentials
import logging

from config import GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_FILE

# --- Setup Logging ---
logger = logging.getLogger(__name__)

# --- Google Sheets API Setup ---
SCOPE = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/drive"
]

# --- Cached client and spreadsheet ---
_creds = None
_client = None
_spreadsheet = None

def _get_spreadsheet():
    """
    Authenticates with the Google Sheets API and returns the spreadsheet object.
    Caches the connection for efficiency.
    """
    global _creds, _client, _spreadsheet
    if _spreadsheet:
        return _spreadsheet

    try:
        if not _creds:
            _creds = ServiceAccountCredentials.from_json_keyfile_name(GOOGLE_SERVICE_ACCOUNT_FILE, SCOPE)
        if not _client:
            _client = gspread.authorize(_creds)

        logger.info("Successfully authenticated with Google Sheets API.")
        _spreadsheet = _client.open_by_key(GOOGLE_SHEET_ID)
        return _spreadsheet
    except Exception as e:
        logger.error(f"Failed to authenticate or open Google Sheet: {e}")
        # In a real application, you might want to handle this more gracefully
        # (e.g., by notifying the admin and shutting down the bot).
        raise

def _get_worksheet(sheet_name):
    """Helper function to get a specific worksheet by name."""
    try:
        spreadsheet = _get_spreadsheet()
        return spreadsheet.worksheet(sheet_name)
    except gspread.exceptions.WorksheetNotFound:
        logger.error(f"Worksheet '{sheet_name}' not found.")
        return None
    except Exception as e:
        logger.error(f"An error occurred while accessing worksheet '{sheet_name}': {e}")
        return None

# --- CRUD Functions ---

def get_all_data(sheet_name):
    """
    Retrieves all data from a specified sheet.
    Returns a list of dictionaries.
    """
    logger.info(f"Getting all data from sheet: {sheet_name}")
    worksheet = _get_worksheet(sheet_name)
    if worksheet:
        return worksheet.get_all_records()
    return []

def find_data(sheet_name, key, value):
    """
    Finds specific rows in a sheet based on a key-value pair.
    """
    logger.info(f"Finding data in sheet '{sheet_name}' where '{key}' = '{value}'")
    worksheet = _get_worksheet(sheet_name)
    if worksheet:
        return worksheet.findall(value, in_column=worksheet.find(key).col)
    return []

def append_data(sheet_name, data_row_list):
    """
    Appends a new row of data to the specified sheet.
    'data_row_list' should be a list of values in order.
    """
    logger.info(f"Appending data to sheet: {sheet_name}")
    worksheet = _get_worksheet(sheet_name)
    if worksheet:
        worksheet.append_row(data_row_list)
        return True
    return False

# NOTE: update_data and delete_data would be more complex to implement efficiently
# with gspread compared to the App Script API. They often require finding the cell
# and then updating it, which can be slow. For now, we'll focus on the primary functions.

if __name__ == '__main__':
    # Simple test to verify connection when the script is run directly
    print("Testing Google Sheets connection...")
    try:
        config_data = get_all_data('Config')
        if config_data:
            print("Successfully retrieved data from 'Config' sheet:")
            print(config_data)
        else:
            print("Could not retrieve data. Ensure the sheet exists and has data.")
    except Exception as e:
        print(f"An error occurred during testing: {e}")
        print("\nPlease ensure:")
        print(f"1. The Google Sheet with ID '{GOOGLE_SHEET_ID}' is shared with your service account email.")
        print(f"2. The '{GOOGLE_SERVICE_ACCOUNT_FILE}' file exists and is correctly configured.")
        print("3. The Google Sheets API and Google Drive API are enabled in your Google Cloud project.")
