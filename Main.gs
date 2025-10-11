/**
 * @file Main.gs
 * @description The main entry point for the Google App Script Web App.
 * This file contains the doPost function that receives webhook calls from Telegram.
 */

/**
 * The main function that handles POST requests from the Telegram webhook.
 * @param {Object} e The event parameter containing the POST request data.
 * @returns {GoogleAppsScript.Content.TextOutput} A JSON response for the Telegram API.
 */
function doPost(e) {
  try {
    // 1. Parse the incoming JSON data from the webhook event.
    const postData = JSON.parse(e.postData.contents);

    // 2. Process the Telegram update.
    // Telegram webhooks are identified by the 'update_id' field.
    if (postData.update_id) {
      // The handleTelegramUpdate function is in Telegram_Handler.gs
      handleTelegramUpdate(postData);
    } else {
      // If the format is unknown, log it.
      console.log('Received unknown webhook format:', JSON.stringify(postData, null, 2));
    }

  } catch (error) {
    // 3. Robust error handling.
    logError_('doPost', 'An unexpected error occurred in the main webhook handler.', error);
  }

  // 4. For Telegram, always return a simple "OK" response synchronously.
  // The bot's actual reply is sent asynchronously via the Telegram API.
  return ContentService.createTextOutput(JSON.stringify({ "status": "ok" })).setMimeType(ContentService.MimeType.JSON);
}
