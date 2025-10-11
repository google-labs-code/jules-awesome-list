# config.py
"""
Configuration file for the Hotel OS Bot.

This module is responsible for loading all configuration variables for the application.
It prioritizes secrets from Google Colab's `userdata` module, falling back to
environment variables. This approach keeps sensitive information like API keys
and tokens secure and out of the source code.

Attributes:
    BOT_TOKEN (str): The Telegram bot token.
    GEMINI_API_KEY (str): The API key for the Google Gemini service.
    SERVICE_ACCOUNT_JSON_PATH (str): The file path to the Google service account JSON file.
    GSHEET_SPREADSHEET_NAME (str): The name of the Google Sheet used as a database.
    ADMIN_CHAT_ID (int): The numeric chat ID for sending admin notifications.
    PORT (int): The port number for the webhook server.
    NGROK_AUTHTOKEN (str): The authentication token for ngrok.
    DATABASE_FILE (str): The file name for the SQLite database.
    TEMP_SLIP_DIR (str): The directory for storing temporary slip images.
"""

import os
from google.colab import userdata
import logging

logger = logging.getLogger(__name__)


def get_secret(secret_name: str, default: str = None) -> str | None:
    """Safely retrieves a secret from Colab userdata or environment variables.

    This function first attempts to load a secret from Google Colab's `userdata`
    store. If it's not found or an error occurs, it falls back to loading
    from the environment variables. This makes the bot adaptable to different
    deployment environments.

    Args:
        secret_name (str): The name of the secret to retrieve (e.g., "BOT_TOKEN").
        default (str, optional): The default value to return if the secret is not
                                 found in any source. Defaults to None.

    Returns:
        str | None: The retrieved secret value, or the default value if not found.
    """
    try:
        # Prioritize Colab userdata
        value = userdata.get(secret_name)
        if value and value != default:
            logger.info(f"Successfully loaded '{secret_name}' from Colab Secrets.")
            return value
    except userdata.SecretNotFoundError:
        pass # Fallback to environment variable
    except Exception as e:
        logger.warning(f"Error loading '{secret_name}' from Colab Secrets: {e}")

    # Fallback to environment variable
    value = os.environ.get(secret_name)
    if value and value != default:
        logger.info(f"Successfully loaded '{secret_name}' from environment variables.")
        return value

    logger.warning(f"'{secret_name}' not found in Colab Secrets or environment variables. Using default/placeholder value.")
    return default

# --- Telegram Configuration ---
BOT_TOKEN = get_secret("BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")

# --- Google Gemini AI Configuration ---
GEMINI_API_KEY = get_secret("GEMINI_API_KEY", "YOUR_API_KEY")

# --- Google Sheets & Drive Configuration ---
SERVICE_ACCOUNT_JSON_PATH = get_secret("SERVICE_ACCOUNT_JSON_PATH", "hotel-service-account.json")
GSHEET_SPREADSHEET_NAME = "ระบบจัดการโรงแรม_DB"

# --- Bot Admin/Notification Configuration ---
try:
    ADMIN_CHAT_ID = int(get_secret("ADMIN_CHAT_ID", "123456789"))
except (ValueError, TypeError):
    logger.warning("ADMIN_CHAT_ID is not a valid integer. Admin notifications will be disabled.")
    ADMIN_CHAT_ID = None

# --- Webhook Configuration (for Colab/ngrok) ---
PORT = 8000
NGROK_AUTHTOKEN = get_secret("NGROK_AUTHTOKEN", "YOUR_AUTHTOKEN")

# --- Database Configuration ---
DATABASE_FILE = "hotel_os.db"

# --- Temporary File Directory ---
TEMP_SLIP_DIR = 'temp_slips'
