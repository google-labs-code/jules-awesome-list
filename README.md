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
- (Optional for local testing) [ngrok](https://ngrok.com/) to expose your local server to the internet.

### Installation Steps

1.  **Clone the repository and navigate into it:**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Navigate into the backend directory and install dependencies:**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

3.  **Download the spaCy language model:**
    ```bash
    python -m spacy download th_core_web_sm
    ```

4.  **Configure the bot:**
    - Place your `service_account.json` file inside the `backend` directory.
    - Open `backend/config.py` and fill in the values for `TELEGRAM_BOT_TOKEN` and `GOOGLE_SHEET_ID`.

5.  **Run the Backend Server:**
    ```bash
    python main.py
    ```
    The backend server will start, typically on `http://127.0.0.1:8080`. The Telegram bot will start polling in the background.

6.  **Expose your local server (for Mini App testing):**
    - If you are running this locally, Telegram cannot access `localhost`. You need a public URL.
    - Open a **new terminal window** and run `ngrok http 8080`.
    - ngrok will give you a public `https://` forwarding URL. **Copy this HTTPS URL.**

7.  **Set the Mini App URL:**
    - Open `backend/bot_logic.py`.
    - Find the `dashboard` function and replace `<YOUR_PUBLIC_HTTPS_URL_HERE>` with the actual ngrok URL you copied.
    - **Note:** You will need to restart the Python server after changing the code.

## Project Structure

- `backend/`: Contains all the Python source code for the bot and API server.
  - `main.py`: The main entry point to start the Flask server and the bot.
  - `requirements.txt`: A list of all Python dependencies.
  - `config.py`: Configuration file for secrets and settings.
  - `sheets_handler.py`: Module for all interactions with Google Sheets.
  - `ocr_processor.py`: Module for handling OCR tasks.
  - `nlp_processor.py`: Module for processing natural language.
  - `bot_logic.py`: Core module containing the bot's command and message handling logic.
- `frontend/`: Contains all the files for the Telegram Mini App.
  - `index.html`: The main HTML file.
  - `style.css`: The stylesheet.
  - `script.js`: The JavaScript logic.
- `README.md`: This file.
