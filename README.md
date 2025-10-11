# Hotel OS Bot (Python / Gemini Version)

Allows users to interact with it through conversation instead of rigid commands.

## Core Architecture

The bot is built on the `python-telegram-bot` library and uses a modular architecture to separate concerns.

- **`main.py`**: The main entry point. It initializes the database, sets up the Telegram bot application, registers all handlers, and starts the bot in webhook mode using `ngrok` for local development.

- **`config.py`**: A centralized configuration module that securely loads sensitive data (like API keys and tokens) from Google Colab Secrets or environment variables.

- **`bot/`**: This directory contains the core application logic:
    - **`database.py`**: Manages all interactions with the local SQLite database (`hotel_os.db`). It handles table creation and all CRUD operations for reservations and repair tickets.
    - **`sheets.py`**: Handles all interactions with the Google Sheets API using the `gspread` library. It's responsible for tasks like adding and updating repair tickets in a shared spreadsheet.
    - **`processors.py`**: Contains data processing functions. This includes the Tesseract OCR processor for reading text from images (like payment slips) and the Google Gemini AI processor for analyzing unstructured text.
    - **`handlers.py`**: The heart of the bot's user interaction logic. It defines the multi-step conversation flows (`ConversationHandler`) for all key features, such as booking, check-in, check-out, and repair requests.

## Key Features

- **Conversational Flows**: Manages multi-step user interactions for complex tasks like booking a room or filing a repair ticket.
- **SQLite Database**: Uses a local SQLite database (`hotel_os.db`) for robust data persistence for core operations like reservations.
- **Google Sheets Integration**: Connects to Google Sheets for real-time, collaborative tasks like managing repair tickets.
- **OCR Slip Processing**: Automatically extracts text and payment details from uploaded payment slips using `pytesseract`.
- **AI-Powered Analysis**: Leverages the Google Gemini API to analyze unstructured text, such as categorizing a user's repair request.

## Project Structure

```
/
├── .gitignore
├── config.py
├── requirements.txt
├── main.py
└── bot/
    ├── __init__.py
    ├── database.py       # Handles all SQLite database operations
    ├── sheets.py         # Handles all Google Sheets API operations
    ├── processors.py     # Handles OCR and Gemini API calls
    └── handlers.py       # Contains all Telegram command and conversation logic
```

## Setup & Installation

This project is designed to be run in an environment like Google Colab where `ngrok` can expose the webhook.

### 1. Prerequisites
- A Telegram Bot Token from BotFather.
- A Google Cloud Project with a **Service Account JSON file** (for Google Sheets).
- A **Google Gemini API Key**.
- An `ngrok` authentication token.

### 2. Configuration
- **Colab Secrets:** The most secure way to run this is by using Google Colab's "Secrets" (🔑 icon on the left). Add the following secrets:
    - `BOT_TOKEN`: Your Telegram Bot Token.
    - `GEMINI_API_KEY`: Your Google Gemini API Key.
    - `SERVICE_ACCOUNT_JSON_PATH`: The *full path* to your uploaded `service_account.json` file in your Colab environment (e.g., `/content/service_account.json`).
    - `NGROK_AUTHTOKEN`: Your authentication token from the ngrok dashboard.
    - `ADMIN_CHAT_ID`: The numeric chat ID for receiving admin notifications.
- **Upload Service Account File**: Upload your `service_account.json` file to your Colab instance. Make sure the path matches what you put in the `SERVICE_ACCOUNT_JSON_PATH` secret.

### 3. Installation
Run this command in a cell to install all necessary Python libraries:
```bash
!pip install -r requirements.txt
```

### 4. Running the Bot
Execute the main script in a Colab cell:
```bash
!python main.py
```
The script will perform the following actions:
1.  **Database Setup**: It ensures the `hotel_os.db` SQLite database file and all necessary tables are created.
2.  **Handler Registration**: It registers all the conversation and command handlers defined in `bot/handlers.py`.
3.  **Ngrok Tunnel**: It starts an `ngrok` tunnel to create a public URL that Telegram's servers can send updates to.
4.  **Webhook Configuration**: It sets the Telegram bot's webhook to the newly created public `ngrok` URL.
5.  **Start Listening**: It starts the bot, which will now listen for incoming messages and updates from Telegram. You will see a `Bot is running!` message with the public URL.

## Bot Commands and User Flows

The bot is designed to be used through an interactive menu system.

- **/start**: The primary command that initializes the bot and displays the main menu.

### Main Menu Options

1.  **🔑 Check-in**:
    - Prompts for a `Booking ID`.
    - If the ID is valid and pending payment, it asks for a payment slip image.
    - The bot processes the slip using OCR, updates the booking status to "Paid" in the database, and confirms the check-in.

2.  **🚪 Check-out**:
    - Prompts for a `Booking ID`.
    - Asks for confirmation.
    - Updates the booking status to "Checked-Out" in the database.

3.  **📝 Book Room**:
    - A multi-step conversation that collects the following details:
        - Customer Name
        - Phone Number
        - Email
        - Check-in Date
        - Check-out Date
        - Number of Guests
    - Shows a summary for confirmation before saving the new booking to the database.

4.  **🛠️ Report an Issue**:
    - Asks for the room number.
    - Asks for a detailed description of the issue.
    - The issue description is sent to the **Google Gemini API** for categorization and summarization.
    - A new repair ticket is created and added as a new row in the configured **Google Sheet**.

5.  **/cancel**:
    - This command can be used at any point during a conversation to exit the current process and return to the main menu.
