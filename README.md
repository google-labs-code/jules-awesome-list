# Hotel OS Bot (Python / Gemini Version)

This is a powerful, context-aware Telegram bot for hotel management, built with Python. It leverages the Google Gemini API for natural language understanding, allowing users to interact with it through normal conversation instead of rigid commands.

## Core Architecture (The System Blueprint)

The bot operates on an intelligent loop:
1.  **Input Reception:** Receives any user input (text, images).
2.  **Contextual Memory:** Manages conversation history for each user.
3.  **Dynamic Prompt Engineering:** Combines new input with past conversation to create a rich prompt for the AI.
4.  **Gemini API Call:** Sends the engineered prompt to the Gemini API for intent detection and entity extraction.
5.  **Response Parsing:** Interprets Gemini's response to decide whether it's an actionable command (JSON) or a conversational reply.
6.  **Logic & Action:** Executes internal functions (e.g., database queries, sheet updates) based on the AI's structured output.
7.  **Memory Update:** Saves the latest interaction to the user's conversation history.

## Features

- **Natural Language Interaction:** Talk to the bot like you would a human assistant.
- **SQLite Database:** Uses a local SQLite database (`hotel_os.db`) for robust data persistence.
- **Google Sheets Integration:** Connects to Google Sheets for specific tasks like repair ticket management.
- **OCR Slip Processing:** Can read text from uploaded payment slips.
- **Modular & Scalable:** Code is organized into logical modules (`database`, `sheets`, `processors`, `handlers`) for easy maintenance.

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
- **Upload Service Account File:** Upload your `service_account.json` file to your Colab instance. Make sure the path matches what you put in the `SERVICE_ACCOUNT_JSON_PATH` secret.

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
The script will:
1.  Set up the `hotel_os.db` SQLite database file.
2.  Register all Telegram handlers.
3.  Start an `ngrok` tunnel to create a public URL.
4.  Set the Telegram webhook to that public URL.
5.  Start listening for incoming messages. You will see a `Bot is running!` message with the public URL.
