# config.py

"""
Configuration file for the Smart BMS Bot.
- TELEGRAM_BOT_TOKEN: Your bot token from Telegram's BotFather.
- GOOGLE_SHEET_ID: The ID of the Google Sheet to be used as a database.
- GOOGLE_SERVICE_ACCOUNT_FILE: The path to your Google Cloud service account JSON file.
"""

# --- Telegram Configuration ---
# Replace with your actual Telegram Bot Token.
TELEGRAM_BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN_HERE"

# --- Google Sheets Configuration ---
# Replace with your Google Sheet ID.
# Example: "1ohcDtzv1WIkv5EFWfyuCJf7V59c40uhJJK5WGSzVcjM"
GOOGLE_SHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE"

# The JSON file you get from Google Cloud for service account authentication.
# You will need to place this file in the same directory as the bot.
# IMPORTANT: Add this filename to your .gitignore file to keep it private.
GOOGLE_SERVICE_ACCOUNT_FILE = "service_account.json"
