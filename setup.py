# setup.py
"""
This script automates the setup process for the Hotel OS Bot.
It handles dependency installation and interactive configuration.
"""

import subprocess
import sys
import os

def install_dependencies():
    """Installs all required packages from requirements.txt."""
    print("--- Installing dependencies from requirements.txt ---")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        sys.exit(1)

def create_env_file():
    """Interactively prompts the user for secrets and creates a .env file."""
    print("\n--- Configuring the bot (please provide your secrets) ---")
    env_vars = {}
    env_vars['BOT_TOKEN'] = input("Enter your Telegram Bot Token: ")
    env_vars['GEMINI_API_KEY'] = input("Enter your Google Gemini API Key: ")
    env_vars['NGROK_AUTHTOKEN'] = input("Enter your ngrok Authtoken: ")
    env_vars['ADMIN_CHAT_ID'] = input("Enter your numeric Admin Chat ID for notifications: ")

    print("\n--- Google Service Account ---")
    print("Please ensure your 'service_account.json' file is in the same directory as this script.")
    env_vars['SERVICE_ACCOUNT_JSON_PATH'] = 'service_account.json'

    try:
        with open('.env', 'w') as f:
            for key, value in env_vars.items():
                f.write(f'{key}="{value}"\n')
        print("\n✅ Successfully created the .env configuration file.")
    except IOError as e:
        print(f"❌ Error creating .env file: {e}")
        sys.exit(1)

def main():
    """Main function to run the setup process."""
    print("🚀 Starting Hotel OS Bot setup...")
    install_dependencies()
    create_env_file()
    print("\n🎉 Setup complete!")
    print("You can now run the bot using: python main.py")

if __name__ == "__main__":
    main()
