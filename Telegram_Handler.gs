/**
 * @file Telegram_Handler.gs
 * @description Handles the logic for parsing Telegram updates and routing commands to the correct functions.
 */

/**
 * The main handler for updates received from the Telegram webhook.
 * @param {Object} update The entire update object from Telegram.
 */
function handleTelegramUpdate(update) {
  if (!update.message || !update.message.text) {
    return; // Not a text message we can process.
  }

  const message = update.message;
  const text = message.text;
  const chatId = message.chat.id;

  if (text.startsWith('/')) {
    const parts = text.substring(1).split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    console.log(`Telegram command: /${command}, Args: ${args.join(' ')}`);

    let responseText = `Unknown command: /${command}`;
    let parseMode = 'MarkdownV2'; // Default to Markdown for formatted responses

    try {
      switch (command) {
        case 'report':
          const allTasksData = getAllData('Tasks_Data');
          responseText = _formatTasksForTelegram(allTasksData);
          break;

        case 'detail':
          if (args.length > 0) {
            const taskDetails = findData('Tasks_Data', 'Task_ID', args[0]);
            responseText = _formatTaskDetailForTelegram(taskDetails);
          } else {
            responseText = "Please provide a Task ID. Usage: `/detail [Task_ID]`";
          }
          break;

        case 'search':
          if (args.length > 1) {
            const searchResult = findData('Personnel_Data', args[0], args.slice(1).join(' '));
            responseText = _formatPersonnelForTelegram(searchResult, args[0], args.slice(1).join(' '));
          } else {
            responseText = "Usage: `/search [field] [value]` (e.g., `/search Name John Doe`)";
          }
          break;

        default:
          responseText = `Sorry, I don't recognize the command /${command}`;
          parseMode = ''; // No special formatting
          break;
      }
    } catch (e) {
      logError_('handleTelegramUpdate', `Error processing command /${command}`, e);
      responseText = "An error occurred while processing your command.";
      parseMode = '';
    }

    sendTelegramMessage(chatId, responseText, parseMode);

  } else {
    // Handle non-command messages
    if (message.chat.type === 'private') {
      sendTelegramMessage(chatId, "Hello! I am the Smart BMS Bot. Use commands like `/report` or `/search Name John` to interact with me.");
    }
  }
}

// --- Telegram Specific Formatting Helpers ---

/**
 * Formats a list of tasks for a Telegram message (Markdown).
 * @param {Array<Array<string>>} sheetData The raw data from Google Sheets.
 * @returns {string} A formatted string for Telegram.
 */
function _formatTasksForTelegram(sheetData) {
  if (sheetData.length <= 1) {
    return "No tasks found in the database.";
  }
  const headers = sheetData[0];
  const tasks = sheetData.slice(1).slice(-5); // Get last 5 tasks

  let message = "*📊 Task Report (Last 5)*\n\n";
  tasks.forEach(taskRow => {
    const task = headers.reduce((obj, header, index) => {
      obj[header] = taskRow[index];
      return obj;
    }, {});
    message += `*ID:* \`${task.Task_ID}\`\n`;
    message += `*Status:* ${task.Status}\n`;
    message += `*Description:* ${task.Description || 'N/A'}\n`;
    message += `--------------------\n`;
  });
  return message;
}

/**
 * Formats the details of a single task for Telegram.
 * @param {Array<Object>} taskDetails An array containing the single task object from findData.
 * @returns {string} A formatted string.
 */
function _formatTaskDetailForTelegram(taskDetails) {
  if (taskDetails.length === 0) {
    return "Task ID not found.";
  }
  const task = taskDetails[0];
  let message = `*🔍 Details for Task ID:* \`${task.Task_ID}\`\n\n`;
  message += `*Description:* ${task.Description}\n`;
  message += `*Status:* \`${task.Status}\`\n`;
  message += `*Type:* ${task.Work_Type}\n`;
  message += `*Priority:* ${task.Priority}\n`;
  message += `*Created:* ${task.Date_Created}\n`;
  message += `*Due:* ${task.Date_Due}\n`;
  message += `*Assignee:* ${task.Assigned_User_ID || 'None'}\n`;
  return message;
}

/**
 * Formats personnel search results for Telegram.
 * @param {Array<Object>} searchResult The array of results from findData.
 * @param {string} key The search key used.
 * @param {string} value The search value used.
 * @returns {string} A formatted string.
 */
function _formatPersonnelForTelegram(searchResult, key, value) {
  if (searchResult.length === 0) {
    return `No personnel found where \`${key}\` is \`${value}\`\.`;
  }
  let message = `*👤 Search Results for ${key}: "${value}"*\n\n`;
  searchResult.forEach(person => {
    message += `*Name:* ${person.Name}\n`;
    message += `*ID:* \`${person.User_ID}\`\n`;
    message += `*Type:* ${person.Type}\n`;
    message += `*Role:* ${person.Role || 'N/A'}\n`;
    message += `--------------------\n`;
  });
  return message;
}
