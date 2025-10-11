#!/bin/bash

# This script automates the setup and execution of the Hotel OS Bot on Termux.

echo "🚀 Starting Hotel OS Bot for Termux..."

# --- Check for and install system dependencies ---
echo "\n--- Checking system dependencies ---"

# Check for tesseract
if ! command -v tesseract &> /dev/null
then
    echo "Tesseract (for OCR) not found. Installing..."
    pkg install tesseract -y
else
    echo "✅ Tesseract is already installed."
fi

# --- Check for Python virtual environment and dependencies ---
# (Assuming setup.py handles python dependencies)

# --- Check for configuration file (.env) ---
if [ ! -f .env ]; then
    echo "\n--- Configuration file (.env) not found. ---"
    echo "Running interactive setup..."
    python setup.py
else
    echo "\n--- Configuration file (.env) found. Skipping setup. ---"
fi

# --- Start the bot ---
echo "\n--- Starting the Hotel OS Bot ---"
python main.py
