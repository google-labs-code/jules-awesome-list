# bot/sheets.py
"""
Module for all Google Sheets interactions using gspread.
"""

import gspread
from oauth2client.service_account import ServiceAccountCredentials
import logging
import re

import config

logger = logging.getLogger(__name__)

_client = None

def _get_client():
    """Authenticates with Google Sheets API and returns a client. Caches the client."""
    global _client
    if _client:
        return _client

    try:
        scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name(config.SERVICE_ACCOUNT_JSON_PATH, scope)
        _client = gspread.authorize(creds)
        logger.info("Successfully authorized Google Sheets client.")
        return _client
    except FileNotFoundError:
        logger.error(f"Service account file not found at: {config.SERVICE_ACCOUNT_JSON_PATH}")
        raise
    except Exception as e:
        logger.critical(f"Failed to authorize Google Sheets client: {e}", exc_info=True)
        raise

async def get_sheet(spreadsheet_name: str, worksheet_name: str):
    """Gets a specific worksheet from a spreadsheet."""
    try:
        client = _get_client()
        spreadsheet = client.open(spreadsheet_name)
        worksheet = spreadsheet.worksheet(worksheet_name)
        logger.info(f"Successfully accessed worksheet '{worksheet_name}'.")
        return worksheet
    except gspread.exceptions.SpreadsheetNotFound:
        logger.error(f"Spreadsheet '{spreadsheet_name}' not found.")
        raise
    except gspread.exceptions.WorksheetNotFound:
        logger.error(f"Worksheet '{worksheet_name}' not found in '{spreadsheet_name}'.")
        raise
    except Exception as e:
        logger.error(f"Error getting worksheet '{worksheet_name}': {e}", exc_info=True)
        raise

async def add_repair_ticket(sheet, ticket_data: dict) -> bool:
    """Appends a new repair ticket to the specified sheet."""
    try:
        # The order must match the columns in the Google Sheet
        row_data = [
            ticket_data.get('ticket_id'),
            ticket_data.get('room_number'),
            ticket_data.get('issue_detail'),
            ticket_data.get('status'),
            ticket_data.get('reported_timestamp'),
            "",  # Placeholder for closed_timestamp
            ticket_data.get('category', 'N/A')
        ]
        sheet.append_row(row_data)
        logger.info(f"Appended repair ticket {ticket_data.get('ticket_id')} to Google Sheet.")
        return True
    except Exception as e:
        logger.error(f"Failed to append repair ticket to Google Sheet: {e}", exc_info=True)
        return False

async def update_repair_status(sheet, ticket_id: str, new_status: str, closed_timestamp: str | None) -> bool:
    """Finds a repair ticket by ID and updates its status."""
    try:
        cell = sheet.find(ticket_id)
        if not cell:
            logger.warning(f"Ticket ID '{ticket_id}' not found in sheet for status update.")
            return False

        # Assuming column order: Ticket ID, Room, Issue, Status, Reported, Closed
        sheet.update_cell(cell.row, 4, new_status) # Update Status (Column D)
        if new_status == 'ปิดงาน' and closed_timestamp:
            sheet.update_cell(cell.row, 6, closed_timestamp) # Update Closed Timestamp (Column F)

        logger.info(f"Updated status for ticket '{ticket_id}' to '{new_status}'.")
        return True
    except Exception as e:
        logger.error(f"Failed to update status for ticket '{ticket_id}': {e}", exc_info=True)
        return False

async def get_next_repair_ticket_id(sheet) -> str:
    """Generates the next repair ticket ID based on the last entry in the sheet."""
    try:
        ticket_ids_column = sheet.col_values(1)  # Assuming Ticket ID is in the first column (A)
        last_id_number = 0
        if ticket_ids_column:
            for cell_value in reversed(ticket_ids_column):
                if cell_value and cell_value.strip():
                    match = re.search(r'^REPAIR_(\d+)$', cell_value.strip(), re.IGNORECASE)
                    if match:
                        last_id_number = int(match.group(1))
                        break # Found the last valid ID

        new_id_number = last_id_number + 1
        ticket_id = f'REPAIR_{new_id_number}'
        logger.info(f"Generated new repair ticket ID: {ticket_id}")
        return ticket_id
    except Exception as e:
        logger.error(f"Error generating next repair ticket ID: {e}", exc_info=True)
        # Fallback ID in case of error
        return f"REPAIR_ERR_{datetime.now().strftime('%H%M%S')}"
