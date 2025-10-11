/**
 * @file Main.gs
 * @description The main entry point for the Google App Script Web App.
 * This file contains the doPost function that receives webhook calls from Discord and Telegram.
 */

/**
 * The main function that handles POST requests from webhooks.
 * It identifies the source (Discord or Telegram) and routes the data to the appropriate handler.
 * @param {Object} e The event parameter containing the POST request data.
 * @returns {GoogleAppsScript.Content.TextOutput} A JSON response for the calling platform.
 */
function doPost(e) {
  try {
    // 1. Parse the incoming JSON data from the webhook event.
    const postData = JSON.parse(e.postData.contents);

    // 2. Identify the source of the webhook and route accordingly.

    // Telegram webhooks typically contain an 'update_id' field.
    if (postData.update_id) {
      console.log('Received Telegram update:', JSON.stringify(postData, null, 2));
      // The handleTelegramUpdate function will be in Telegram_Handler.gs
      handleTelegramUpdate(postData);
      // For Telegram, a simple synchronous "OK" response is usually sufficient.
      // The actual bot response will be sent asynchronously via the Telegram API.
      return ContentService.createTextOutput(JSON.stringify({ "status": "ok" })).setMimeType(ContentService.MimeType.JSON);
    }

    // Discord webhooks have a 'type' field for interactions.
    else if (postData.type) {
      console.log('Received Discord interaction:', JSON.stringify(postData, null, 2));

      // Handle the initial PING check from Discord.
      if (postData.type === 1) { // Type 1 is a Ping
        return ContentService.createTextOutput(JSON.stringify({ type: 1 })).setMimeType(ContentService.MimeType.JSON);
      }

      // Pass the interaction data to the Discord command handler.
      const result = handleInteraction(postData);

      // Return the result from the handler to Discord.
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. If the source is unknown, log it.
    else {
      console.log('Received unknown webhook format:', JSON.stringify(postData, null, 2));
      throw new Error("Unknown webhook format received.");
    }

  } catch (error) {
    // 4. Robust error handling.
    logError_('doPost', 'An unexpected error occurred in the main webhook handler.', error);

    // This error response is formatted for Discord. A more advanced implementation
    // might try to determine the source to format the error correctly for Telegram.
    return ContentService.createTextOutput(
      JSON.stringify({
        type: 4, // Type 4 is a channel message response
        data: {
          content: 'An error occurred while processing the request. Please check the logs.',
          flags: 64 // Ephemeral message
        }
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
