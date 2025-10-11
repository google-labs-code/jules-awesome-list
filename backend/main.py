# main.py

"""
Main entry point for the Smart BMS Bot (Python Version).
This file now runs a Flask web server to serve the Mini App and starts the
Telegram bot in a separate background thread.
"""

import logging
import threading
from flask import Flask, send_from_directory, jsonify
from telegram.ext import Application, CommandHandler, MessageHandler, filters

from config import TELEGRAM_BOT_TOKEN
from bot_logic import start, handle_message, handle_photo, dashboard
import sheets_handler as sheets

# --- Setup Logging ---
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logging.getLogger("httpx").setLevel(logging.WARNING)
logger = logging.getLogger(__name__)

# --- Flask App Setup ---
app = Flask(__name__, static_folder='../frontend')

@app.route('/')
def serve_mini_app():
    """Serves the main index.html for the Mini App."""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    """Serves other static files like CSS and JS."""
    return send_from_directory(app.static_folder, path)

# --- API Endpoints ---
@app.route('/api/get_tasks')
def get_tasks():
    """API endpoint to get all tasks from the Google Sheet."""
    try:
        tasks = sheets.get_all_data("Tasks_Data")
        return jsonify(tasks)
    except Exception as e:
        logger.error(f"Error in /api/get_tasks: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/get_personnel')
def get_personnel():
    """API endpoint to get all personnel from the Google Sheet."""
    try:
        personnel = sheets.get_all_data("Personnel_Data")
        return jsonify(personnel)
    except Exception as e:
        logger.error(f"Error in /api/get_personnel: {e}")
        return jsonify({"error": str(e)}), 500

# --- Telegram Bot Setup ---
def run_bot():
    """Initializes and runs the Telegram bot's polling loop."""
    logger.info("Starting Telegram bot polling in a background thread...")
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("dashboard", dashboard))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    application.add_handler(MessageHandler(filters.PHOTO, handle_photo))

    application.run_polling()

if __name__ == "__main__":
    # --- Pre-run Config Check ---
    if TELEGRAM_BOT_TOKEN == "YOUR_TELEGRAM_BOT_TOKEN_HERE":
        logger.error("!!! TELEGRAM_BOT_TOKEN has not been set in config.py. Please update it.")
    else:
        # --- Start the Bot in a Background Thread ---
        bot_thread = threading.Thread(target=run_bot)
        bot_thread.daemon = True # Allows main thread to exit even if bot thread is running
        bot_thread.start()

        # --- Start the Flask Web Server in the Main Thread ---
        logger.info("Starting Flask web server for Mini App...")
        # Note: In a production environment, you would use a proper WSGI server like Gunicorn or Waitress
        # instead of Flask's built-in development server.
        app.run(host='0.0.0.0', port=8080)
