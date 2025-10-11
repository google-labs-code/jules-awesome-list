# bot_logic.py

"""
Core logic module for the Smart BMS Bot.
This module orchestrates the flow of information between the user,
the NLP/OCR processors, and the data handlers (Google Sheets).
"""

import logging
from telegram import Update, WebAppInfo, KeyboardButton, ReplyKeyboardMarkup
from telegram.ext import ContextTypes

# Import processors
from nlp_processor import process_natural_language
from ocr_processor import process_image_for_ocr

# Import data handler
import sheets_handler as sheets

# --- Setup Logging ---
logger = logging.getLogger(__name__)


# --- Core Handler Functions ---

async def dashboard(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Sends a message with a button that opens the Mini App."""
    # The URL here should be the public URL where your Flask app is hosted.
    # For local testing, you might use a service like ngrok to expose your localhost.
    # The user's client will open this URL.
    # IMPORTANT: Telegram requires this URL to be HTTPS.
    keyboard = [
        [KeyboardButton(
            "🚀 Open Dashboard",
            web_app=WebAppInfo(url="<YOUR_PUBLIC_HTTPS_URL_HERE>")
        )]
    ]
    await update.message.reply_text(
        "Click the button below to open your Smart BMS Dashboard:",
        reply_markup=ReplyKeyboardMarkup(keyboard)
    )

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Sends a welcome message when the /start command is issued."""
    welcome_message = (
        "สวัสดีครับ! ผมคือ Smart BMS Bot v2.0 (Python)\n\n"
        "คุณสามารถสั่งงานผมได้โดยใช้ภาษาพูดคุยปกติ เช่น:\n"
        "- 'ขอรายงานสรุปงานล่าสุดหน่อย'\n"
        "- 'ค้นหาข้อมูลพนักงานชื่อ สมชาย'\n"
        "- 'ขอดูรายละเอียดงาน T12345'\n\n"
        "หรือส่งรูปภาพที่มีข้อความ (เช่น ใบเสร็จ) เพื่อให้ผมอ่านข้อมูลให้ได้เลยครับ"
    )
    await update.message.reply_text(welcome_message)


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handles regular text messages by passing them to the NLP processor."""
    user_text = update.message.text
    logger.info(f"Received text from user: '{user_text}'")

    # Process the text with the NLP module
    nlp_result = process_natural_language(user_text)

    if not nlp_result:
        await update.message.reply_text("ขออภัยครับ ผมไม่เข้าใจคำสั่ง ลองใช้ประโยคอื่นดูนะครับ")
        return

    if "error" in nlp_result:
        await update.message.reply_text(f"เกิดข้อผิดพลาดภายใน: {nlp_result['error']}")
        return

    # --- Route the command based on NLP intent ---
    intent = nlp_result.get("intent")
    entities = nlp_result.get("entities", {})

    response_text = "กำลังดำเนินการ..."

    if intent == "INTENT_REPORT":
        tasks = sheets.get_all_data("Tasks_Data")
        response_text = _format_tasks_for_telegram(tasks)

    elif intent == "INTENT_SEARCH":
        # A more robust implementation would intelligently map entities to sheet columns
        # For now, we assume the user says something like "search name John Doe"
        # and the NLP extracts a PERSON entity.
        if "PERSON" in entities:
            person_name = entities["PERSON"]
            results = sheets.find_data("Personnel_Data", "Name", person_name)
            response_text = f"ผลการค้นหาสำหรับ '{person_name}':\n\n{results}" # Simplified output
        else:
            response_text = "ผมเข้าใจว่าคุณต้องการค้นหา แต่หาชื่อบุคคลในประโยคไม่เจอครับ"

    elif intent == "INTENT_DETAIL":
        if "TASK_ID" in entities:
            task_id = entities["TASK_ID"]
            results = sheets.find_data("Tasks_Data", "Task_ID", task_id)
            response_text = f"รายละเอียดสำหรับงาน '{task_id}':\n\n{results}" # Simplified output
        else:
            response_text = "ผมเข้าใจว่าคุณต้องการดูรายละเอียด แต่หา Task ID ในประโยคไม่เจอครับ (เช่น T12345)"

    else:
        response_text = f"ผมเข้าใจว่าคุณต้องการจะ '{intent}' แต่ยังไม่รองรับคำสั่งนี้ครับ"

    await update.message.reply_text(response_text)


async def handle_photo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handles photo messages by passing them to the OCR processor."""
    logger.info("Received a photo from the user.")
    await update.message.reply_text("กำลังอ่านข้อความจากรูปภาพ...")

    try:
        # Get the largest photo sent
        photo_file = await context.bot.get_file(update.message.photo[-1].file_id)

        # Download the photo as a byte array
        photo_bytes = await photo_file.download_as_bytearray()

        # Process with OCR
        ocr_result = process_image_for_ocr(bytes(photo_bytes))

        response_text = f"ข้อความที่อ่านได้จากรูปภาพ:\n\n---\n{ocr_result}\n---"

    except Exception as e:
        logger.error(f"Failed to process photo for OCR: {e}")
        response_text = f"เกิดข้อผิดพลาดขณะอ่านรูปภาพ: {e}"

    await update.message.reply_text(response_text)


# --- Formatting Helper Functions (similar to App Script version) ---

def _format_tasks_for_telegram(tasks: list) -> str:
    """Formats a list of task records for a Telegram message."""
    if not tasks:
        return "ไม่พบข้อมูลงานในระบบ"

    # Take the last 5 tasks
    recent_tasks = tasks[-5:]

    message = "รายงาน 5 งานล่าสุด:\n\n"
    for task in recent_tasks:
        message += f"ID: {task.get('Task_ID', 'N/A')}\n"
        message += f"Status: {task.get('Status', 'N/A')}\n"
        message += f"Description: {task.get('Description', 'N/A')}\n"
        message += "--------------------\n"

    return message
