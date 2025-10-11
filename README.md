# Hotel OS Bot (Python / Gemini Version)

Allows users to interact with it through conversation instead of rigid commands.

## Quick Install (One-Command Setup)

This project provides a one-command installer that handles everything from cloning the repository to configuring your secrets.

**Open your terminal (or Termux on Android) and paste this single command:**

```bash
bash <(curl -s https://raw.githubusercontent.com/your-repo/your-project/main/install.sh)
```
*(**Note**: You will need to replace the URL with the actual raw URL to the `install.sh` script in your repository once it's public.)*

The script will:
1.  **Check for dependencies** like `git`, `python`, and `tesseract` and tell you how to install them if they're missing.
2.  **Install all required Python packages.**
3.  **Ask for your API keys and tokens** interactively.
4.  **Prompt you to paste the content of your `service_account.json` file** directly into the terminal, creating the file for you.
5.  Create the `.env` file to store all your settings.

After the installer finishes, you can start the bot at any time by running:
```bash
python main.py
```

---

## About the Project

This is a powerful, context-aware Telegram bot for hotel management, built with Python. It leverages the Google Gemini API for natural language understanding.

### Core Architecture
- **`main.py`**: The application's entry point.
- **`config.py`**: Manages configuration loaded from a `.env` file.
- **`bot/`**: Contains the core logic for database interactions, Google Sheets integration, data processing (OCR/AI), and Telegram command handlers.

### Key Features
- **Conversational Flows**: Manages multi-step user interactions for booking, check-in, etc.
- **SQLite & Google Sheets**: Uses a local database for core data and Google Sheets for collaborative tasks.
- **OCR & AI**: Processes payment slips with OCR and analyzes text with the Gemini API.

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
