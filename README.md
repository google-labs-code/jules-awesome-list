# Smart BMS Bot v2.0 (Python Version)

This project is a complete rewrite of the Smart Business Management System (BMS) Bot in Python, leveraging powerful open-source libraries to create a more robust, scalable, and intelligent assistant.

## Features

- **Natural Language Understanding:** Powered by `spaCy`, the bot can understand natural user requests in Thai instead of relying on rigid commands.
- **Telegram Integration:** Real-time communication and notifications through a Telegram bot interface, using `python-telegram-bot`.
- **Google Sheets as a Database:** Uses `gspread` to interact with a Google Sheet, allowing for easy data management and viewing.
- **Open Source OCR:** Extracts text from images (e.g., receipts, documents) using `Pytesseract`.
- **Modular Architecture:** The code is organized into logical modules for easy maintenance and future expansion.

## Setup and Installation

### Prerequisites

- Python 3.8+
- Tesseract OCR Engine installed on your system.
- A Google Cloud Platform project with a Service Account.
- A Telegram Bot created via BotFather.

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Download the spaCy language model:**
    ```bash
    python -m spacy download th_core_web_sm
    ```

4.  **Configure the bot:**
    - Create a `service_account.json` file in the root directory from the credentials you downloaded from the Google Cloud Console.
    - Open the `config.py` file and fill in the following values:
        - `TELEGRAM_BOT_TOKEN`: Your token from BotFather.
        - `GOOGLE_SHEET_ID`: The ID of your Google Sheet.

5.  **Run the bot:**
    ```bash
    python main.py
    ```

## Project Structure

- `main.py`: The main entry point to start the bot.
- `requirements.txt`: A list of all Python dependencies.
- `config.py`: Configuration file for secrets and settings.
- `sheets_handler.py`: Module for all interactions with Google Sheets.
- `ocr_processor.py`: Module for handling OCR tasks.
- `nlp_processor.py`: Module for processing natural language.
- `bot_logic.py`: Core module containing the bot's command and message handling logic.
- `README.md`: This file.
