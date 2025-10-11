#!/bin/bash

# A unified installation script for the Hotel OS Bot.
# This script automates dependency checks, installation, and configuration.

echo "🚀 Welcome to the Hotel OS Bot Installer!"
echo "This script will set up everything you need to run the bot."

# --- Helper function for dependency checks ---
check_command() {
    if ! command -v $1 &> /dev/null
    then
        echo "❌ Command not found: $1. Please install it first."
        echo "   - On Termux: pkg install $1"
        echo "   - On Debian/Ubuntu: sudo apt-get install $1"
        exit 1
    fi
}

# --- 1. System Dependency Checks ---
echo "\n--- Checking for required system tools ---"
check_command "git"
check_command "python"
check_command "tesseract"
echo "✅ All system tools are present."

# --- 2. Python Dependency Installation ---
echo "\n--- Installing Python packages from requirements.txt ---"
if python -m pip install -r requirements.txt; then
    echo "✅ Python packages installed successfully."
else
    echo "❌ Failed to install Python packages. Please check your pip installation."
    exit 1
fi

# --- 3. Interactive Configuration ---
echo "\n--- Starting Interactive Configuration ---"
echo "Please provide the following secrets. They will be stored in a local .env file."

# Read secrets from user
read -p "Enter your Telegram Bot Token: " BOT_TOKEN
read -p "Enter your Google Gemini API Key: " GEMINI_API_KEY
read -p "Enter your ngrok Authtoken: " NGROK_AUTHTOKEN
read -p "Enter your numeric Admin Chat ID for notifications: " ADMIN_CHAT_ID

# --- 4. Handle the service_account.json ---
echo "\n--- Google Service Account Setup ---"
echo "Please copy the entire content of your 'service_account.json' file."
echo "Paste it here and then press Ctrl+D (or Ctrl+Z on Windows) on a new line to finish."

SERVICE_ACCOUNT_JSON_CONTENT=$(cat)

if [ -z "$SERVICE_ACCOUNT_JSON_CONTENT" ]; then
    echo "❌ No content provided for service_account.json. Setup cannot continue."
    exit 1
fi

# --- 5. Create .env and service_account.json files ---
echo "\n--- Creating configuration files ---"

# Create .env file
cat > .env << EOL
BOT_TOKEN="${BOT_TOKEN}"
GEMINI_API_KEY="${GEMINI_API_KEY}"
NGROK_AUTHTOKEN="${NGROK_AUTHTOKEN}"
ADMIN_CHAT_ID="${ADMIN_CHAT_ID}"
SERVICE_ACCOUNT_JSON_PATH="service_account.json"
EOL
echo "✅ .env file created successfully."

# Create service_account.json file
echo "$SERVICE_ACCOUNT_JSON_CONTENT" > service_account.json
echo "✅ service_account.json file created successfully."


# --- Final Instructions ---
echo "\n🎉 Setup is complete!"
echo "You can now run the bot at any time using the command: python main.py"
