# main.py
"""Main entry point for the Hotel OS Bot.

This script is responsible for the main execution flow of the bot. It performs
the following key operations:
- Applies `nest_asyncio` for compatibility with environments like Google Colab.
- Configures application-wide logging.
- Performs pre-run checks for essential configuration variables.
- Initializes the SQLite database.
- Builds the `telegram.ext.Application`.
- Registers all command and conversation handlers.
- Sets up and manages an `ngrok` tunnel to create a public webhook URL.
- Starts the bot's webhook listener to begin receiving updates from Telegram.
"""

import asyncio
import logging
import nest_asyncio
from pyngrok import ngrok
from telegram.ext import Application

import config
from bot.database import setup_database
from bot.handlers import register_handlers

# --- Apply nest_asyncio for Colab compatibility ---
try:
    nest_asyncio.apply()
    logging.info("nest_asyncio applied.")
except RuntimeError:
    logging.info("nest_asyncio already applied or not needed.")
except Exception as e:
    logging.error(f"Error applying nest_asyncio: {e}")

# --- Configure Logging ---
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logging.getLogger('httpx').setLevel(logging.WARNING)
logger = logging.getLogger(__name__)


async def main():
    """Initializes and runs the Hotel OS Bot.

    This asynchronous function performs the following steps:
    1.  Checks for critical configurations (BOT_TOKEN, NGROK_AUTHTOKEN).
    2.  Sets up the SQLite database by calling `setup_database`.
    3.  Builds the `telegram.ext.Application` instance.
    4.  Registers all command and conversation handlers.
    5.  Sets up an ngrok tunnel to expose a public URL for the webhook.
    6.  Sets the Telegram bot's webhook to the public ngrok URL.
    7.  Starts the bot's webhook listener.
    8.  Includes a `finally` block to ensure the ngrok tunnel is killed
        on exit.
    """

    # --- Pre-run checks for critical configurations ---
    if not config.BOT_TOKEN or config.BOT_TOKEN == "YOUR_BOT_TOKEN_HERE":
        logger.critical("BOT_TOKEN is not configured. Please set it in Colab Secrets or .env file.")
        return

    if not config.NGROK_AUTHTOKEN or config.NGROK_AUTHTOKEN == "YOUR_AUTHTOKEN":
        logger.critical("NGROK_AUTHTOKEN is not configured. Webhook mode will fail.")
        return

    # --- Initial Setup ---
    logger.info("Setting up database...")
    await setup_database()

    # --- Build Telegram Bot Application ---
    logger.info("Building Telegram application...")
    application = Application.builder().token(config.BOT_TOKEN).build()

    # --- Register Handlers ---
    register_handlers(application)

    # --- Webhook Setup (using ngrok for Colab) ---
    try:
        logger.info(f"Setting ngrok auth token...")
        ngrok.set_auth_token(config.NGROK_AUTHTOKEN)

        logger.info(f"Connecting ngrok to port {config.PORT}...")
        public_url = ngrok.connect(config.PORT).public_url
        logger.info(f"Ngrok tunnel established at: {public_url}")

        logger.info("Setting webhook...")
        await application.bot.set_webhook(url=public_url)

        # --- Run the Bot ---
        logger.info(f"Starting webhook listener on 0.0.0.0:{config.PORT}")
        print(f"✅ Bot is running! Public URL: {public_url}")

        await application.run_webhook(
            listen="0.0.0.0",
            port=config.PORT,
            webhook_url=public_url
        )

    except Exception as e:
        logger.critical(f"Failed to start bot or ngrok tunnel: {e}", exc_info=True)
        print(f"❌ Failed to start bot: {e}")
    finally:
        logger.info("Shutting down ngrok tunnel.")
        ngrok.kill()


if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Bot stopped manually.")
        print("\nBot stopped.")
    except Exception as e:
        logger.critical(f"Critical error in main execution block: {e}", exc_info=True)
