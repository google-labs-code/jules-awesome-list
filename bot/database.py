# bot/database.py
"""
Module for all SQLite database interactions for the Hotel OS Bot.
"""

import sqlite3
import logging
from datetime import datetime

import config

logger = logging.getLogger(__name__)

def _get_db_connection():
    """Establishes a connection to the SQLite database."""
    try:
        conn = sqlite3.connect(config.DATABASE_FILE)
        conn.row_factory = sqlite3.Row  # Allows accessing columns by name
        return conn
    except sqlite3.Error as e:
        logger.critical(f"Database connection failed: {e}", exc_info=True)
        raise

async def setup_database():
    """
    Connects to the SQLite database and sets up all necessary tables if they don't exist.
    This is one of the most critical functions to ensure the bot can operate.
    """
    logger.info(f"Running database setup for {config.DATABASE_FILE}...")
    conn = _get_db_connection()
    cursor = conn.cursor()
    try:
        # Create booking_counter table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS booking_counter (last_id INTEGER PRIMARY KEY DEFAULT 0)
        """)
        cursor.execute("SELECT COUNT(*) FROM booking_counter")
        if cursor.fetchone()[0] == 0:
            cursor.execute("INSERT INTO booking_counter (last_id) VALUES (0)")
            logger.info("Initialized booking_counter table.")

        # Create repair_ticket_counter table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS repair_ticket_counter (last_id INTEGER PRIMARY KEY DEFAULT 0)
        """)
        cursor.execute("SELECT COUNT(*) FROM repair_ticket_counter")
        if cursor.fetchone()[0] == 0:
            cursor.execute("INSERT INTO repair_ticket_counter (last_id) VALUES (0)")
            logger.info("Initialized repair_ticket_counter table.")

        # Create reservations table with all required columns
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS reservations (
                booking_id TEXT PRIMARY KEY,
                customer_name TEXT,
                checkin_date TEXT,
                checkout_date TEXT,
                num_nights INTEGER,
                full_price REAL,
                deposit_amount REAL,
                bank_account TEXT,
                storage_timestamp TEXT,
                payment_status TEXT DEFAULT 'Pending',
                extracted_amount REAL,
                extracted_bank TEXT,
                extracted_timestamp TEXT,
                slip_file_path TEXT
            )
        """)
        logger.info("Reservations table checked/created.")

        # Create repair_tasks table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS repair_tasks (
                ticket_id TEXT PRIMARY KEY,
                room_number TEXT,
                issue_detail TEXT,
                status TEXT,
                reported_timestamp TEXT,
                closed_timestamp TEXT
            )
        """)
        logger.info("Repair tasks table checked/created.")

        conn.commit()
        logger.info("Database setup completed and committed successfully.")

    except sqlite3.Error as e:
        logger.error(f"Database error during setup: {e}", exc_info=True)
        conn.rollback()
        raise
    finally:
        conn.close()

# --- Generic and Reusable Database Functions ---

async def get_next_id(counter_table_name: str) -> int:
    """Generic function to get the next ID from a counter table."""
    conn = _get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(f"SELECT last_id FROM {counter_table_name} LIMIT 1")
        row = cursor.fetchone()
        last_id = row[0] if row else 0
        new_id = last_id + 1
        cursor.execute(f"UPDATE {counter_table_name} SET last_id = ?", (new_id,))
        conn.commit()
        logger.info(f"Incremented {counter_table_name} to {new_id}.")
        return new_id
    except sqlite3.Error as e:
        logger.error(f"Error getting next ID from {counter_table_name}: {e}", exc_info=True)
        conn.rollback()
        raise
    finally:
        conn.close()

# --- Reservation Specific Functions ---

async def add_reservation(details: dict):
    """Adds a new reservation record to the database."""
    conn = _get_db_connection()
    cursor = conn.cursor()
    try:
        sql = """
            INSERT INTO reservations (
                booking_id, customer_name, checkin_date, checkout_date, num_nights,
                full_price, deposit_amount, bank_account, storage_timestamp, payment_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute(sql, (
            details['booking_id'], details['customer_name'], details['checkin_date'],
            details['checkout_date'], details['num_nights'], details['full_price'],
            details['deposit_amount'], details['bank_account'], timestamp, 'Pending'
        ))
        conn.commit()
        logger.info(f"Successfully added reservation {details['booking_id']}.")
    except sqlite3.Error as e:
        logger.error(f"Error adding reservation {details.get('booking_id')}: {e}", exc_info=True)
        conn.rollback()
        raise
    finally:
        conn.close()

async def get_reservation(booking_id: str) -> dict | None:
    """Fetches a single reservation by its booking ID."""
    conn = _get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM reservations WHERE booking_id = ?", (booking_id,))
        row = cursor.fetchone()
        return dict(row) if row else None
    except sqlite3.Error as e:
        logger.error(f"Error fetching reservation {booking_id}: {e}", exc_info=True)
        raise
    finally:
        conn.close()

async def update_reservation_payment(booking_id: str, status: str, details: dict):
    """Updates payment-related info for a reservation."""
    conn = _get_db_connection()
    cursor = conn.cursor()
    try:
        sql = """
            UPDATE reservations
            SET payment_status = ?, extracted_amount = ?, extracted_bank = ?,
                extracted_timestamp = ?, slip_file_path = ?, storage_timestamp = ?
            WHERE booking_id = ?
        """
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute(sql, (
            status, details.get('amount'), details.get('bank'),
            details.get('timestamp'), details.get('slip_path'),
            timestamp, booking_id
        ))
        conn.commit()
        logger.info(f"Updated payment status for {booking_id} to '{status}'.")
        return cursor.rowcount > 0
    except sqlite3.Error as e:
        logger.error(f"Error updating payment for {booking_id}: {e}", exc_info=True)
        conn.rollback()
        raise
    finally:
        conn.close()

# ... Other functions like delete_reservation, get_all_reservations, add_repair_ticket, etc. would go here ...
