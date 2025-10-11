# ocr_processor.py

"""
Module for handling Optical Character Recognition (OCR) using Pytesseract.
"""

import pytesseract
from PIL import Image
import logging
import io

# --- Setup Logging ---
logger = logging.getLogger(__name__)

# --- Configuration ---
# If tesseract is not in your PATH, you may need to set this.
# Example for Windows: pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# Example for Linux (if installed in a non-standard location): pytesseract.pytesseract.tesseract_cmd = r'/usr/local/bin/tesseract'


def process_image_for_ocr(image_bytes: bytes) -> str:
    """
    Processes an image from a byte stream for OCR.

    :param image_bytes: The raw byte content of the image file.
    :return: The extracted text as a string, or an error message.
    """
    try:
        logger.info("Processing image for OCR...")
        # Open the image from the byte stream
        image = Image.open(io.BytesIO(image_bytes))

        # Use Pytesseract to extract text. 'tha' is for the Thai language model.
        # You may need to install the Thai language pack for Tesseract.
        # For multilingual documents, you can use 'tha+eng'.
        extracted_text = pytesseract.image_to_string(image, lang='tha+eng')

        if not extracted_text.strip():
            logger.warning("OCR process ran successfully, but no text was detected.")
            return "OCR Result: No text could be detected in the image."

        logger.info("Successfully extracted text from image.")
        return extracted_text

    except pytesseract.TesseractNotFoundError:
        logger.error("Tesseract executable not found. Please ensure Tesseract is installed and in your system's PATH.")
        return "OCR Error: Tesseract is not installed or not found. Please contact the administrator."
    except Exception as e:
        logger.error(f"An error occurred during OCR processing: {e}")
        return f"An error occurred during OCR processing: {e}"

if __name__ == '__main__':
    # A simple test to run if the script is executed directly.
    # It requires a test image named 'test_image.png' in the same directory.
    print("Testing OCR processing...")
    try:
        with open('test_image.png', 'rb') as f:
            test_image_bytes = f.read()

        text = process_image_for_ocr(test_image_bytes)

        print("\n--- Extracted Text ---")
        print(text)
        print("----------------------")

    except FileNotFoundError:
        print("\nCould not find 'test_image.png'. Please place a test image in the root directory to run this test.")
    except Exception as e:
        print(f"\nAn error occurred during testing: {e}")
