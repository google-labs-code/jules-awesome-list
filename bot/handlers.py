# bot/handlers.py
"""
This module contains all the Telegram handler functions and conversation handlers.
It orchestrates the bot's logic by calling processors and data modules.
"""

import logging
import re
from datetime import datetime
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    ContextTypes,
    ConversationHandler,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    filters,
)

import config
from . import database as db
from . import sheets
from . import processors

logger = logging.getLogger(__name__)

# --- Conversation Handler States ---
(
    # Booking States
    WAITING_FOR_CUSTOMER_NAME,
    WAITING_FOR_PHONE,
    WAITING_FOR_EMAIL,
    WAITING_FOR_CHECKIN_DATE,
    WAITING_FOR_CHECKOUT_DATE,
    WAITING_FOR_GUESTS,
    CONFIRM_BOOKING,
    # Check-in States
    REQUEST_BOOKING_ID_CHECKIN,
    UPLOAD_SLIP_STATE,
    # Checkout States
    REQUEST_BOOKING_ID_CHECKOUT,
    CONFIRM_CHECKOUT,
    # Repair States
    REPAIR_ROOM,
    REPAIR_DETAIL,
) = range(13)


# --- Main Menu and Basic Command Handlers ---

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handles the /start command and sends the main menu."""
    keyboard = [
        [InlineKeyboardButton("🔑 เช็คอิน", callback_data='menu_checkin')],
        [InlineKeyboardButton("🚪 เช็คเอาท์", callback_data='menu_checkout')],
        [InlineKeyboardButton("📝 จองห้องพัก", callback_data='menu_reserve')],
        [InlineKeyboardButton("🛠️ แจ้งซ่อม", callback_data='menu_repair')],
        [InlineKeyboardButton("📄 รายงาน", callback_data='menu_report')],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    # If the command is triggered via a message, reply to it.
    # If it's from a callback (like after /cancel), edit the original message.
    if update.callback_query:
        await update.callback_query.answer()
        await update.callback_query.edit_message_text(
            "👋 ยินดีต้อนรับสู่ Hotel OS Bot! โปรดเลือกเมนู:",
            reply_markup=reply_markup
        )
    else:
        await update.message.reply_text(
            "👋 ยินดีต้อนรับสู่ Hotel OS Bot! โปรดเลือกเมนู:",
            reply_markup=reply_markup
        )


# --- Booking Reservation Conversation (Now Complete) ---

async def reserve_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Entry point for the booking reservation conversation."""
    query = update.callback_query
    await query.answer()
    await query.edit_message_text("📝 **กระบวนการจองห้องพัก**\nกรุณาพิมพ์ชื่อ-นามสกุลลูกค้าครับ:")
    return WAITING_FOR_CUSTOMER_NAME

async def get_customer_name(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data['customer_name'] = update.message.text
    await update.message.reply_text("📞 กรุณาพิมพ์เบอร์โทรศัพท์ติดต่อ:")
    return WAITING_FOR_PHONE

async def get_phone(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data['phone'] = update.message.text
    await update.message.reply_text("📧 กรุณาพิมพ์อีเมล:")
    return WAITING_FOR_EMAIL

async def get_email(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data['email'] = update.message.text
    await update.message.reply_text("🗓️ กรุณาพิมพ์วันที่เช็คอิน (YYYY-MM-DD):")
    return WAITING_FOR_CHECKIN_DATE

async def get_checkin_date(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    # Basic validation could be added here
    context.user_data['checkin_date'] = update.message.text
    await update.message.reply_text("🗓️ กรุณาพิมพ์วันที่เช็คเอาท์ (YYYY-MM-DD):")
    return WAITING_FOR_CHECKOUT_DATE

async def get_checkout_date(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data['checkout_date'] = update.message.text
    await update.message.reply_text("👥 กรุณาพิมพ์จำนวนผู้เข้าพัก:")
    return WAITING_FOR_GUESTS

async def get_guests_and_confirm(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Gets the final piece of info and shows confirmation."""
    context.user_data['num_guests'] = update.message.text

    details = context.user_data
    summary = (
        f"**กรุณายืนยันข้อมูลการจอง:**\n"
        f"------------------------------\n"
        f"👤 **ชื่อ:** {details['customer_name']}\n"
        f"📞 **โทรศัพท์:** {details['phone']}\n"
        f"📧 **อีเมล:** {details['email']}\n"
        f"➡️ **เช็คอิน:** {details['checkin_date']}\n"
        f"⬅️ **เช็คเอาท์:** {details['checkout_date']}\n"
        f"👥 **จำนวนผู้เข้าพัก:** {details['num_guests']}\n"
        f"------------------------------\n"
        f"ข้อมูลถูกต้องหรือไม่?"
    )
    keyboard = [
        [InlineKeyboardButton("✅ ยืนยันและบันทึก", callback_data="book_confirm_yes")],
        [InlineKeyboardButton("❌ ยกเลิก", callback_data="book_confirm_no")],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(summary, reply_markup=reply_markup)
    return CONFIRM_BOOKING

async def save_booking(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Saves the booking to the database and ends the conversation."""
    query = update.callback_query
    await query.answer()

    if query.data == 'book_confirm_yes':
        await query.edit_message_text("⏳ กำลังบันทึกการจอง...")
        try:
            booking_id_num = await db.get_next_id('booking_counter')
            booking_id = f"BOOKING_{booking_id_num}"

            details = context.user_data
            # Prepare data for database insertion
            reservation_data = {
                'booking_id': booking_id,
                'customer_name': details['customer_name'],
                'check_in_date': details['checkin_date'],
                'check_out_date': details['checkout_date'],
                'num_guests': int(details['num_guests']),
                'contact_info': f"Phone: {details['phone']}, Email: {details['email']}",
                'payment_status': 'Pending',
                'payment_details': {},
                'total_price': 0.0 # Placeholder
            }

            await db.add_reservation(reservation_data)
            await query.edit_message_text(f"✅ บันทึกการจองสำเร็จ! ID การจองคือ `{booking_id}`")
        except Exception as e:
            logger.error(f"Error saving booking: {e}", exc_info=True)
            await query.edit_message_text(f"เกิดข้อผิดพลาด: {e}")
    else:
        await query.edit_message_text("การจองถูกยกเลิก")

    context.user_data.clear()
    return ConversationHandler.END


# --- Repair Conversation ---

async def repair_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Entry point for the repair conversation."""
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(text="🛠️ **กระบวนการแจ้งซ่อม**\nกรุณาพิมพ์หมายเลขห้องครับ")
    return REPAIR_ROOM

async def repair_get_room(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Gets the room number and asks for issue details."""
    context.user_data['room_number'] = update.message.text.strip().upper()
    await update.message.reply_text("กรุณาอธิบายรายละเอียดปัญหาที่พบครับ")
    return REPAIR_DETAIL

async def repair_process(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Processes the repair details, calls Gemini, saves data, and confirms."""
    issue_detail = update.message.text
    room_number = context.user_data.get('room_number')

    await update.message.reply_text("กำลังวิเคราะห์และบันทึกข้อมูลแจ้งซ่อม...")

    try:
        analysis = await processors.analyze_repair_issue_with_gemini(issue_detail)
        category = analysis.get('category', 'Other')
        summary = analysis.get('summary', issue_detail)

        ticket_id_num = await db.get_next_id('repair_ticket_counter')
        ticket_id = f"REPAIR_{ticket_id_num}"

        gsheet = await sheets.get_sheet(config.GSHEET_SPREADSHEET_NAME, "งานซ่อม")
        ticket_data = {
            "ticket_id": ticket_id, "room_number": room_number,
            "issue_detail": issue_detail, "status": "เปิดงาน",
            "reported_timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "category": category,
        }
        await sheets.add_repair_ticket(gsheet, ticket_data)

        confirmation_text = (
            f"✅ บันทึกการแจ้งซ่อมสำเร็จ\n"
            f"- ID: `{ticket_id}`\n"
            f"- ห้อง: {room_number}\n"
            f"- สรุป: {summary}\n"
            f"- หมวดหมู่: {category}"
        )
        await update.message.reply_text(confirmation_text)

    except Exception as e:
        logger.error(f"Error in repair_process for room {room_number}: {e}", exc_info=True)
        await update.message.reply_text(f"เกิดข้อผิดพลาดร้ายแรงขณะบันทึกการแจ้งซ่อม: {e}")

    context.user_data.clear()
    return ConversationHandler.END


# --- Checkout Conversation ---

async def checkout_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(text="🚪 **กระบวนการเช็คเอาท์**\nกรุณาพิมพ์รหัสการจอง (Booking ID) ที่ต้องการเช็คเอาท์ครับ")
    return REQUEST_BOOKING_ID_CHECKOUT

async def checkout_get_booking_id(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    booking_id = update.message.text.strip().upper()
    try:
        reservation = await db.get_reservation(booking_id)
        if reservation:
            context.user_data['booking_id'] = booking_id
            summary = f"**ยืนยันการเช็คเอาท์?**\n- ID: `{reservation['booking_id']}`\n- ชื่อ: {reservation['customer_name']}"
            keyboard = [
                [InlineKeyboardButton("✅ ยืนยัน", callback_data="checkout_confirm_yes")],
                [InlineKeyboardButton("❌ ยกเลิก", callback_data="checkout_confirm_no")],
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            await update.message.reply_text(summary, reply_markup=reply_markup)
            return CONFIRM_CHECKOUT
        else:
            await update.message.reply_text(f"❌ ไม่พบรหัสการจอง `{booking_id}` ครับ")
            return ConversationHandler.END
    except Exception as e:
        await update.message.reply_text(f"เกิดข้อผิดพลาด: {e}")
        return ConversationHandler.END

async def checkout_confirm(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    booking_id = context.user_data.get('booking_id')
    if query.data == 'checkout_confirm_yes':
        await query.edit_message_text(f"กำลังดำเนินการเช็คเอาท์สำหรับ `{booking_id}`...")
        try:
            await db.update_reservation_payment(booking_id, "Checked-Out", {})
            await query.edit_message_text(f"✅ เช็คเอาท์ `{booking_id}` สำเร็จ!")
        except Exception as e:
            await query.edit_message_text(f"เกิดข้อผิดพลาดขณะอัปเดตข้อมูล: {e}")
    else:
        await query.edit_message_text("การเช็คเอาท์ถูกยกเลิก")
    context.user_data.clear()
    return ConversationHandler.END


# --- Check-in Conversation ---

async def checkin_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(text="🔑 **กระบวนการเช็คอิน**\nกรุณาพิมพ์รหัสการจอง (Booking ID) ที่ต้องการเช็คอินครับ")
    return REQUEST_BOOKING_ID_CHECKIN

async def checkin_get_booking_id(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    booking_id = update.message.text.strip().upper()
    try:
        reservation = await db.get_reservation(booking_id)
        if reservation and reservation['payment_status'] == 'Pending':
            context.user_data['booking_id'] = booking_id
            await update.message.reply_text(f"✅ พบการจอง `{booking_id}`\nกรุณาอัปโหลดรูปภาพสลิปการโอนเงินมัดจำครับ")
            return UPLOAD_SLIP_STATE
        elif reservation:
            await update.message.reply_text(f"⚠️ สถานะการจอง `{booking_id}` คือ '{reservation['payment_status']}' ไม่สามารถเช็คอินได้ครับ")
            return ConversationHandler.END
        else:
            await update.message.reply_text(f"❌ ไม่พบรหัสการจอง `{booking_id}`")
            return ConversationHandler.END
    except Exception as e:
        await update.message.reply_text(f"เกิดข้อผิดพลาดในการตรวจสอบข้อมูล: {e}")
        return ConversationHandler.END

async def upload_slip_process(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    booking_id = context.user_data.get('booking_id')
    if not update.message.photo:
        await update.message.reply_text("กรุณาอัปโหลดเป็นรูปภาพครับ")
        return UPLOAD_SLIP_STATE

    await update.message.reply_text("ได้รับสลิปแล้ว กำลังประมวลผลด้วย OCR...")
    try:
        photo_file = await context.bot.get_file(update.message.photo[-1].file_id)
        photo_bytes = await photo_file.download_as_bytearray()
        ocr_text = processors.process_image_for_ocr(bytes(photo_bytes))

        amount_match = re.search(r'(\d{1,3}(?:,\d{3})*\.\d{2})', ocr_text)
        extracted_amount = float(amount_match.group(1).replace(',', '')) if amount_match else None

        payment_details = {
            'amount': extracted_amount, 'bank': 'OCR Scan',
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        success = await db.update_reservation_payment(booking_id, 'Paid', payment_details)
        if success:
            await update.message.reply_text(f"✅ เช็คอินสำหรับ `{booking_id}` สำเร็จ!\nยอดเงินที่ตรวจพบ: {extracted_amount or 'N/A'} บาท")
        else:
            await update.message.reply_text("เกิดข้อผิดพลาดในการอัปเดตสถานะการชำระเงิน")
    except Exception as e:
        logger.error(f"Error during slip processing for {booking_id}: {e}", exc_info=True)
        await update.message.reply_text(f"เกิดข้อผิดพลาดร้ายแรงระหว่างประมวลผลสลิป: {e}")

    context.user_data.clear()
    return ConversationHandler.END

async def report_menu(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Placeholder for the report feature."""
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(text="ฟังก์ชันรายงานยังไม่เปิดใช้งานครับ")
    # Bring back the main menu after the message
    await start(update, context)

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Cancels and ends the conversation, bringing back the main menu."""
    await update.message.reply_text("การดำเนินการถูกยกเลิก")
    context.user_data.clear()
    await start(update, context) # Show main menu again
    return ConversationHandler.END

# --- Registration Function ---

def register_handlers(application: Application):
    """Registers all command, message, and conversation handlers."""

    conv_handler_booking = ConversationHandler(
        entry_points=[CallbackQueryHandler(reserve_start, pattern='^menu_reserve$')],
        states={
            WAITING_FOR_CUSTOMER_NAME: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_customer_name)],
            WAITING_FOR_PHONE: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_phone)],
            WAITING_FOR_EMAIL: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_email)],
            WAITING_FOR_CHECKIN_DATE: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_checkin_date)],
            WAITING_FOR_CHECKOUT_DATE: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_checkout_date)],
            WAITING_FOR_GUESTS: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_guests_and_confirm)],
            CONFIRM_BOOKING: [CallbackQueryHandler(save_booking, pattern='^book_confirm_')]
        },
        fallbacks=[CommandHandler('cancel', cancel)],
        per_user=True, allow_reentry=True
    )

    conv_handler_checkin = ConversationHandler(
        entry_points=[CallbackQueryHandler(checkin_start, pattern='^menu_checkin$')],
        states={
            REQUEST_BOOKING_ID_CHECKIN: [MessageHandler(filters.TEXT & ~filters.COMMAND, checkin_get_booking_id)],
            UPLOAD_SLIP_STATE: [MessageHandler(filters.PHOTO, upload_slip_process)],
        },
        fallbacks=[CommandHandler('cancel', cancel)],
        per_user=True, allow_reentry=True
    )

    conv_handler_checkout = ConversationHandler(
        entry_points=[CallbackQueryHandler(checkout_start, pattern='^menu_checkout$')],
        states={
            REQUEST_BOOKING_ID_CHECKOUT: [MessageHandler(filters.TEXT & ~filters.COMMAND, checkout_get_booking_id)],
            CONFIRM_CHECKOUT: [CallbackQueryHandler(checkout_confirm, pattern='^checkout_confirm_')],
        },
        fallbacks=[CommandHandler('cancel', cancel)],
        per_user=True, allow_reentry=True
    )

    conv_handler_repair = ConversationHandler(
        entry_points=[CallbackQueryHandler(repair_start, pattern='^menu_repair$')],
        states={
            REPAIR_ROOM: [MessageHandler(filters.TEXT & ~filters.COMMAND, repair_get_room)],
            REPAIR_DETAIL: [MessageHandler(filters.TEXT & ~filters.COMMAND, repair_process)],
        },
        fallbacks=[CommandHandler('cancel', cancel)],
        per_user=True, allow_reentry=True
    )

    # Add conversation handlers
    application.add_handler(conv_handler_booking)
    application.add_handler(conv_handler_checkin)
    application.add_handler(conv_handler_checkout)
    application.add_handler(conv_handler_repair)

    # Add other handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CallbackQueryHandler(report_menu, pattern='^menu_report$'))

    logger.info("All handlers have been registered.")
