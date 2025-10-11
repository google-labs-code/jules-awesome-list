/**
 * @file Main.gs
 * @description The main entry point for the Google App Script Web App.
 * This file contains the doPost function that receives webhook calls from Discord.
 */

/**
 * The main function that handles POST requests from Discord's webhook.
 * This is the primary entry point for all bot commands.
 * @param {Object} e The event parameter containing the POST request data.
 * @returns {GoogleAppsScript.Content.TextOutput} A JSON response for Discord.
 */
function doPost(e) {
  try {
    // 1. Parse the incoming JSON data from the webhook event.
    const postData = JSON.parse(e.postData.contents);

    // 2. Discord Webhook Validation: Handle the initial PING check from Discord.
    // When you set up the webhook, Discord sends a "ping" to verify the endpoint.
    if (postData.type === 1) { // Type 1 is a Ping
      return ContentService.createTextOutput(
        JSON.stringify({ type: 1 }) // Respond with a Pong
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Log the interaction for debugging purposes.
    // Using LockService to prevent concurrent modifications to the log if needed,
    // though for simple logging it's not strictly necessary.
    const lock = LockService.getScriptLock();
    lock.waitLock(15000); // Wait up to 15 seconds for the lock.
    console.log('Received interaction:', JSON.stringify(postData, null, 2));
    lock.releaseLock();

    // 4. Pass the interaction data to the central command handler.
    // The handleInteraction function is expected to be in Discord_Handler.gs
    const result = handleInteraction(postData);

    // 5. Return the result from the handler to Discord.
    // The handler must return a JSON object formatted for Discord's API.
    return ContentService.createTextOutput(
      JSON.stringify(result)
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // 6. Robust error handling.
    // If anything goes wrong, log the error and inform the user.
    logError_('doPost', 'An unexpected error occurred.', error);

    // Return a user-friendly error message via Discord.
    return ContentService.createTextOutput(
      JSON.stringify({
        type: 4, // Type 4 is a channel message response
        data: {
          content: 'An error occurred while processing your command. Please check the logs.',
          flags: 64 // Ephemeral message, only visible to the user who sent the command
        }
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
