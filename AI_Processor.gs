/**
 * @file AI_Processor.gs
 * @description The core "brain" module for interpreting natural language user requests.
 * It communicates with an external AI service to parse text into structured commands.
 */

/**
 * Processes a natural language text string from the user.
 *
 * NOTE: This is a MOCK implementation. It simulates the behavior of an external
 * AI service by using simple keyword matching. In a real-world scenario, this
 * function would make an API call to a service like Google's Gemini or OpenAI's GPT.
 *
 * @param {string} text The user's raw text input (e.g., "ขอรายงานสรุปงานของสัปดาห์ที่แล้วหน่อย").
 * @returns {Object} A structured object representing the interpreted command, or null if not understood.
 *                   Example: { command: "report", parameters: { date_range: "last_week" } }
 */
function processNaturalLanguage(text) {
  const lowerCaseText = text.toLowerCase();

  try {
    // --- Mock AI Logic using Keyword Matching ---

    // 1. Handle "report" commands
    if (lowerCaseText.includes('report') || lowerCaseText.includes('รายงาน') || lowerCaseText.includes('สรุป')) {
      // In a real AI, we could extract date ranges, statuses, etc.
      // Here, we just recognize the intent to get a report.
      return {
        command: "report",
        parameters: {} // Placeholder for future extracted parameters
      };
    }

    // 2. Handle "detail" commands
    if (lowerCaseText.includes('detail') || lowerCaseText.includes('รายละเอียด')) {
      // Try to extract a Task ID (e.g., "detail T12345")
      const match = text.match(/T\d+/i);
      if (match) {
        return {
          command: "detail",
          parameters: {
            task_id: match[0].toUpperCase()
          }
        };
      }
    }

    // 3. Handle "search" commands
    if (lowerCaseText.includes('search') || lowerCaseText.includes('หา') || lowerCaseText.includes('ค้นหา')) {
        // Very basic search simulation: "search name John Doe"
        const parts = text.split(' ');
        if (parts.length > 2) {
            const field = parts[1]; // e.g., "name"
            const value = parts.slice(2).join(' '); // e.g., "John Doe"
            return {
                command: "search",
                parameters: {
                    field: field,
                    value: value
                }
            };
        }
    }

    // If no keywords match, the AI "didn't understand".
    return null;

  } catch (e) {
    logError_('processNaturalLanguage', 'Error occurred during language processing.', e);
    return null;
  }
}

/**
 * [Future Implementation] This function would contain the actual API call.
 *
 * function callExternalAiService(text) {
 *   const apiKey = getConfig_('AI_SERVICE_API_KEY');
 *   const apiUrl = 'https://api.someaiservice.com/v1/interpret';
 *
 *   const prompt = `You are a helpful assistant for a business management system.
 *   Your task is to convert the user's request into a structured JSON object.
 *   The user said: "${text}".
 *   The available commands are "report", "detail", "search".
 *   Extract the command and any relevant parameters (like task_id, field, value).
 *   Respond ONLY with the JSON object.`;
 *
 *   const payload = {
 *     // ... payload structure for the specific AI service ...
 *   };
 *
 *   const response = UrlFetchApp.fetch(apiUrl, payload);
 *   return JSON.parse(response.getContentText());
 * }
 */
