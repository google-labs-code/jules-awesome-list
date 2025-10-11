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

## Setup & Installation (Automated)

This project includes an automated setup script to simplify the installation and configuration process.

### 1. Prerequisites
- Python 3.8 or higher.
- A Telegram Bot Token from BotFather.
- A Google Gemini API Key.
- An `ngrok` authentication token.
- Your Google `service_account.json` file.

### 2. Automated Setup
1.  **Place Service Account File**: Put your `service_account.json` file in the root directory of this project.
2.  **Run the Setup Script**: Open your terminal in the project's root directory and run the following command:
    ```bash
    python setup.py
    ```
3.  **Follow the Prompts**: The script will guide you through an interactive setup process:
    - It will first install all the required Python dependencies from `requirements.txt`.
    - It will then ask you to enter your API keys and tokens (`BOT_TOKEN`, `GEMINI_API_KEY`, `NGROK_AUTHTOKEN`, `ADMIN_CHAT_ID`).
    - After you provide the details, it will automatically create a `.env` file in the project root to securely store your configuration.

### 3. Running the Bot
Once the setup is complete, you can run the bot at any time with this command:
```bash
python main.py
```
The bot will use the configuration from your `.env` file to start, set up the database, and begin listening for messages.

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
