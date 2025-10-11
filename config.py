# config.py
"""
Configuration file for the Hotel OS Bot.
Loads sensitive data from Colab Secrets or environment variables.
"""

import os
from google.colab import userdata
import logging

logger = logging.getLogger(__name__)

def get_secret(secret_name: str, default: str = None) -> str | None:
    """Safely retrieves a secret from Colab userdata or environment variables."""
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
