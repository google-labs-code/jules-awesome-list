/**
 * @file Reporting_Module.gs
 * @description Handles the functionality for dynamic reporting and summaries (Feature 1).
 * Generates Discord Embeds to display task data.
 */

/**
 * Handles the '/report' command.
 * Fetches tasks from 'Tasks_Data' and displays them in a summary embed.
 * @param {Array<Object>} options The options provided with the slash command.
 * @returns {Object} A Discord API-compatible response object with an embed.
 */
function handleReportCommand(options) {
  try {
    // Note: Parsing specific options like date range would be implemented here.
    // For this example, we will fetch and display the last 5 tasks.
    const allTasksData = getAllData('Tasks_Data');
    if (allTasksData.length <= 1) {
      return createSimpleResponse('No tasks found to report.', true);
    }

    const headers = allTasksData[0];
    const tasks = allTasksData.slice(1); // Exclude header row

    // --- Create the Discord Embed ---
    const embed = {
      color: 0x0099ff, // A nice blue color
      title: '📊 รายงานสรุปงาน (Tasks Summary)',
      description: 'แสดงรายการงานล่าสุดที่อยู่ในระบบ',
      fields: [],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Smart BMS Report',
      },
    };

    // Take the last 5 tasks for a concise report
    const recentTasks = tasks.slice(-5);

    if (recentTasks.length === 0) {
      embed.description = 'ไม่พบข้อมูลงานในขณะนี้';
    } else {
      recentTasks.forEach(taskRow => {
        // Create an object from the row for easier access
        const task = headers.reduce((obj, header, index) => {
          obj[header] = taskRow[index];
          return obj;
        }, {});

        embed.fields.push({
          name: `📌 ID: ${task.Task_ID} - [${task.Status}]`,
          value: `**ประเภท:** ${task.Work_Type}\n**รายละเอียด:** ${task.Description || 'N/A'}\n**กำหนดส่ง:** ${task.Date_Due || 'N/A'}`,
          inline: false, // Display each task as a full-width block
        });
      });
    }

    // Return the formatted response for Discord
    return createEmbedResponse([embed]);

  } catch (error) {
    logError_('handleReportCommand', 'Failed to generate report.', error);
    return createSimpleResponse('An error occurred while creating the report.', true);
  }
}

/**
 * Handles the '/detail' command.
 * Fetches detailed information for a specific Task ID.
 * @param {Array<Object>} options The options provided with the slash command, expecting a 'task_id'.
 * @returns {Object} A Discord API-compatible response object.
 */
function handleDetailCommand(options) {
  try {
    // Find the 'task_id' option from the command
    const taskIdOption = options.find(opt => opt.name === 'task_id');
    if (!taskIdOption) {
      return createSimpleResponse('Error: Please provide a Task ID.', true);
    }
    const taskId = taskIdOption.value;

    // Use the findData function from Sheet_Interface.gs
    const results = findData('Tasks_Data', 'Task_ID', taskId);

    if (results.length === 0) {
      return createSimpleResponse(`ไม่พบข้อมูลสำหรับ Task ID: \`${taskId}\``, true);
    }

    const task = results[0]; // Assume Task_ID is unique

    // --- Create the "Expanded" Discord Embed ---
    const embed = {
      color: 0x5865F2, // Discord blurple
      title: `🔍 รายละเอียดงาน: ${task.Task_ID}`,
      description: `**${task.Description}**`,
      fields: [
        { name: 'สถานะ (Status)', value: `\`${task.Status}\``, inline: true },
        { name: 'ประเภทงาน (Work Type)', value: `\`${task.Work_Type}\``, inline: true },
        { name: 'ลำดับความสำคัญ (Priority)', value: `\`${task.Priority}\``, inline: true },
        { name: 'วันที่สร้าง (Date Created)', value: task.Date_Created, inline: false },
        { name: 'กำหนดส่ง (Date Due)', value: task.Date_Due, inline: false },
        { name: 'ผู้รับผิดชอบ (Assigned User)', value: task.Assigned_User_ID || 'ยังไม่ได้กำหนด', inline: false },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: `Smart BMS | Task Details`,
      },
    };

    return createEmbedResponse([embed]);

  } catch (error) {
    logError_('handleDetailCommand', 'Failed to get task details.', error);
    return createSimpleResponse('An error occurred while fetching task details.', true);
  }
}

/**
 * Helper function to create a response object with embeds for Discord.
 * @param {Array<Object>} embeds An array of embed objects.
 * @param {boolean} [isEphemeral=false] If true, the message is only visible to the user.
 * @returns {Object} A Discord API-compatible response object.
 */
function createEmbedResponse(embeds, isEphemeral = false) {
  const response = {
    type: 4, // Type 4: Channel Message with Source
    data: {
      embeds: embeds,
    },
  };
  if (isEphemeral) {
    response.data.flags = 64; // Ephemeral flag
  }
  return response;
}
