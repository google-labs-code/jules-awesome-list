# bot/processors.py
"""
Module for processing raw data, such as OCR and AI analysis.
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
    """
    Processes an image from a byte stream for OCR using Pytesseract.
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
    """
    Analyzes repair issue details using Gemini API to categorize and summarize.
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
