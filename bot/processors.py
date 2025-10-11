# bot/processors.py
"""Module for processing raw data, such as OCR from images and AI analysis.

This module contains functions that perform heavy-lifting data transformations.
It includes an OCR processor for extracting text from payment slips and a
Gemini AI processor for analyzing unstructured text like repair requests.
"""

import logging
import re
import io
from PIL import Image
import pytesseract
import google.generativeai as genai

import config

logger = logging.getLogger(__name__)

# --- OCR Processor ---

def process_image_for_ocr(image_bytes: bytes) -> str:
    """Extracts text from an image using Tesseract OCR.

    This function takes an image as a byte stream, opens it using Pillow,
    and then uses Pytesseract to perform Optical Character Recognition (OCR).
    It's configured to recognize both Thai and English languages.

    Args:
        image_bytes (bytes): The raw image data as a byte string.

    Returns:
        str: The extracted text. Returns a specific message if no text is found.

    Raises:
        pytesseract.TesseractNotFoundError: If the Tesseract executable is not found.
        Exception: For any other errors during image processing or OCR.
    """
    try:
        logger.info("Processing image for OCR with Pytesseract...")
        image = Image.open(io.BytesIO(image_bytes))

        # 'tha+eng' allows it to recognize both Thai and English characters
        extracted_text = pytesseract.image_to_string(image, lang='tha+eng')

        if not extracted_text.strip():
            logger.warning("Pytesseract ran successfully, but no text was detected.")
            return "OCR Result: No text could be detected in the image."

        logger.info("Successfully extracted text from image via OCR.")
        return extracted_text

    except pytesseract.TesseractNotFoundError:
        logger.critical("Tesseract executable not found. Please ensure Tesseract is installed and in your system's PATH.")
        # This is a critical setup error.
        raise
    except Exception as e:
        logger.error(f"An error occurred during OCR processing: {e}", exc_info=True)
        raise

# --- Gemini AI Processor ---

async def analyze_repair_issue_with_gemini(issue_detail: str) -> dict:
    """Analyzes a repair issue using the Google Gemini API.

    This function sends a formatted prompt to the Gemini API, asking it to
    categorize a repair issue and provide a concise summary in Thai. It then
    parses the response to extract this structured data.

    Args:
        issue_detail (str): The raw, user-provided text describing the repair
                            issue.

    Returns:
        dict: A dictionary containing the `category` and `summary` of the
              issue. If an error occurs, it returns a dict with an `error` key.
    """
    logger.info(f"Analyzing repair issue with Gemini: '{issue_detail[:100]}...'")

    if not config.GEMINI_API_KEY or config.GEMINI_API_KEY == "YOUR_API_KEY":
        logger.error("Gemini API key is not configured.")
        return {"error": "Gemini API is not configured."}

    try:
        genai.configure(api_key=config.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')

        prompt = f"""
        Analyze the following repair issue description from a hotel room.
        Categorize the issue into one of these types: Plumbing, Electrical, HVAC, Furniture, Appliance, Other.
        Provide a concise summary in Thai.

        Issue Description: "{issue_detail}"

        Output format:
        Category: [Your Category]
        Summary: [Your Summary in Thai]
        """

        response = await model.generate_content_async(prompt)
        response_text = response.text.strip()
        logger.info(f"Gemini raw response: '{response_text}'")

        category_match = re.search(r'Category: (.+)', response_text)
        summary_match = re.search(r'Summary: (.+)', response_text)

        category = category_match.group(1).strip() if category_match else "Other"
        summary = summary_match.group(1).strip() if summary_match else issue_detail

        return {"category": category, "summary": summary}

    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}", exc_info=True)
        return {"error": str(e)}
