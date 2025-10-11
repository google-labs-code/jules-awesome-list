# main.py

"""
Main entry point for the Smart BMS Bot (Python Version).
This file initializes the Telegram bot, sets up handlers, and starts the polling loop.
"""

import logging
from telegram.ext import Application, CommandHandler, MessageHandler, filters

from config import TELEGRAM_BOT_TOKEN
# Import the actual handler functions from our bot_logic module
from bot_logic import start, handle_message, handle_photo

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
# set higher logging level for httpx to avoid all GET and POST requests being logged
logging.getLogger("httpx").setLevel(logging.WARNING)
logger = logging.getLogger(__name__)


def main() -> None:
    """Start the bot."""
    # Create the Application and pass it your bot's token.
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    # --- Register command and message handlers ---
    # on different commands - answer in Telegram
    application.add_handler(CommandHandler("start", start))

    # on non-command i.e message - process the message from Telegram
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    # on photo message - process the image
    application.add_handler(MessageHandler(filters.PHOTO, handle_photo))

    logger.info("Bot is starting... Polling for updates.")

    # Run the bot until the user presses Ctrl-C
    application.run_polling()


if __name__ == "__main__":
    # Before running, perform a simple check of the config
    if TELEGRAM_BOT_TOKEN == "YOUR_TELEGRAM_BOT_TOKEN_HERE":
        logger.error("!!! TELEGRAM_BOT_TOKEN has not been set in config.py. Please update it.")
    else:
        main()
