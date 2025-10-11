/**
 * @file Telegram_Handler.gs
 * @description Handles Telegram updates by routing them through the AI Processor.
 */

/**
 * The main handler for updates received from the Telegram webhook.
 * It now uses the AI Processor to understand natural language.
 * @param {Object} update The entire update object from Telegram.
 */
function handleTelegramUpdate(update) {
  if (!update.message || !update.message.text) {
    return; // Not a text message we can process.
  }

  const message = update.message;
  const text = message.text;
  const chatId = message.chat.id;

  // --- Natural Language Processing Step ---
  // Send the user's entire message to the AI Processor.
  const interpretedResult = processNaturalLanguage(text);

  if (!interpretedResult) {
    // If the AI processor returns null, it means it didn't understand the user's intent.
    sendTelegramMessage(chatId, "Sorry, I didn't understand that. Could you please rephrase your request?");
    return;
  }

  // --- Command Execution Step ---
  // The AI processor returns a structured command object. We execute based on that.
  const command = interpretedResult.command;
  const parameters = interpretedResult.parameters;

  console.log(`AI interpreted command: "${command}", Parameters: ${JSON.stringify(parameters)}`);

  let responseText = `Unknown command interpreted: ${command}`;
  let parseMode = 'MarkdownV2';

  try {
    switch (command) {
      case 'report':
        const allTasksData = getAllData('Tasks_Data');
        responseText = _formatTasksForTelegram(allTasksData);
        break;

      case 'detail':
        if (parameters.task_id) {
          const taskDetails = findData('Tasks_Data', 'Task_ID', parameters.task_id);
          responseText = _formatTaskDetailForTelegram(taskDetails);
        } else {
          responseText = "The AI understood you want details, but couldn't find a Task ID in your message.";
        }
        break;

      case 'search':
        if (parameters.field && parameters.value) {
          const searchResult = findData('Personnel_Data', parameters.field, parameters.value);
          responseText = _formatPersonnelForTelegram(searchResult, parameters.field, parameters.value);
        } else {
          responseText = "The AI understood you want to search, but needs a field and a value (e.g., 'search name John Doe').";
        }
        break;

      default:
        responseText = `Sorry, I'm not equipped to handle the command: ${command}`;
        parseMode = '';
        break;
    }
  } catch (e) {
    logError_('handleTelegramUpdate', `Error executing AI command "${command}"`, e);
    responseText = "An error occurred while executing your request.";
    parseMode = '';
  }

  sendTelegramMessage(chatId, responseText, parseMode);
}


// --- Telegram Specific Formatting Helpers (Copied from previous version for completeness) ---

function _formatTasksForTelegram(sheetData) {
  if (sheetData.length <= 1) return "No tasks found.";
  const headers = sheetData[0];
  const tasks = sheetData.slice(1).slice(-5);
  let message = "*📊 Task Report (Last 5)*\n\n";
  tasks.forEach(taskRow => {
    const task = headers.reduce((obj, h, i) => { obj[h] = taskRow[i]; return obj; }, {});
    message += `*ID:* \`${task.Task_ID}\`\n*Status:* ${task.Status}\n*Description:* ${task.Description || 'N/A'}\n--------------------\n`;
  });
  return message;
}

function _formatTaskDetailForTelegram(taskDetails) {
  if (taskDetails.length === 0) return "Task ID not found.";
  const task = taskDetails[0];
  let message = `*🔍 Details for Task ID:* \`${task.Task_ID}\`\n\n`;
  message += `*Description:* ${task.Description}\n*Status:* \`${task.Status}\`\n*Type:* ${task.Work_Type}\n`;
  message += `*Priority:* ${task.Priority}\n*Created:* ${task.Date_Created}\n*Due:* ${task.Date_Due}\n*Assignee:* ${task.Assigned_User_ID || 'None'}\n`;
  return message;
}

function _formatPersonnelForTelegram(searchResult, key, value) {
  if (searchResult.length === 0) return `No personnel found where \`${key}\` is \`${value}\`\\.`;
  let message = `*👤 Search Results for ${key}: "${value}"*\n\n`;
  searchResult.forEach(person => {
    message += `*Name:* ${person.Name}\n*ID:* \`${person.User_ID}\`\n*Type:* ${person.Type}\n*Role:* ${person.Role || 'N/A'}\n--------------------\n`;
  });
  return message;
}
