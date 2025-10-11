/**
 * @file Telegram_Interface.gs
 * @description Handles sending messages and formatted responses back to the Telegram API.
 */

// Define the base URL for the Telegram Bot API.
const TELEGRAM_API_BASE_URL = "https://api.telegram.org/bot";

/**
 * Sends a text message to a specified Telegram chat.
 * This is the actual implementation that communicates with the Telegram API.
 * @param {string|number} chatId The ID of the chat to send the message to.
 * @param {string} text The text of the message to send. Supports MarkdownV2 or HTML.
 * @param {string} [parseMode=''] Optional. The parsing mode for the text, e.g., 'MarkdownV2' or 'HTML'.
 */
function sendTelegramMessage(chatId, text, parseMode = '') {
  try {
    // 1. Get the bot token from the Config sheet.
    const botToken = getConfig_('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      // Log an error but don't throw, to prevent the entire script from halting.
      console.error("TELEGRAM_BOT_TOKEN is not set in the 'Config' sheet.");
      return;
    }

    // 2. Construct the full API URL for the sendMessage method.
    const apiUrl = `${TELEGRAM_API_BASE_URL}${botToken}/sendMessage`;

    // 3. Prepare the payload for the POST request.
    const payload = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify({
        'chat_id': String(chatId),
        'text': text,
        'parse_mode': parseMode // 'MarkdownV2' or 'HTML' can be used for formatting
      })
    };

    // 4. Use UrlFetchApp to send the request to the Telegram API.
    const response = UrlFetchApp.fetch(apiUrl, payload);

    // 5. Log the response from Telegram for debugging.
    console.log(`Telegram API response: ${response.getContentText()}`);

  } catch (error) {
    // Log any errors that occur during the API call.
    logError_('sendTelegramMessage', `Failed to send message to chat ID ${chatId}.`, error);
  }
}
