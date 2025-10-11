/**
 * @file Discord_Handler.gs
 * @description Handles the logic for parsing Discord interactions and routing them to the correct functions.
 */

/**
 * The main interaction handler called by doPost.
 * It acts as a router for all incoming slash commands.
 * @param {Object} interaction The entire interaction object from Discord.
 * @returns {Object} A JSON object formatted as a response for Discord's API.
 */
function handleInteraction(interaction) {
  try {
    // Extract the command name from the interaction data.
    const commandName = interaction.data.name;
    const options = interaction.data.options; // Array of options/arguments
    const user = interaction.member.user; // User who invoked the command

    // Log the command for debugging.
    console.log(`Command received: "${commandName}" from user: ${user.username}#${user.discriminator}`);

    // Route the command to the appropriate handler function.
    switch (commandName) {
      // Feature 1: Reporting
      case 'report':
        // This will eventually be in Reporting_Module.gs
        return handleReportCommand(options);
      case 'detail':
        // This will eventually be in Reporting_Module.gs
        return handleDetailCommand(options);

      // Feature 2: CRM
      case 'add':
        // This will eventually be in CRM_Module.gs
        return handleAddCommand(options);
      case 'update':
        // This will eventually be in CRM_Module.gs
        return handleUpdateCommand(options);
      case 'search':
         // This will eventually be in CRM_Module.gs
        return handleSearchCommand(options);
      case 'delete':
         // This will eventually be in CRM_Module.gs
        return handleDeleteCommand(options);

      // Feature 3: Financial
      case 'calculate_rent':
        // This will eventually be in Calculation_Engine.gs
        return handleCalculateRentCommand(options);
      case 'calculate_payroll':
        // This will eventually be in Calculation_Engine.gs
        return handleCalculatePayrollCommand(options);

      // Feature 4: Document Generation
      case 'generate_invoice':
        // This will eventually be in Document_Generator.gs
        return handleGenerateInvoiceCommand(options);

      default:
        // If the command is not recognized.
        return createSimpleResponse(`Unknown command: ${commandName}`, true);
    }
  } catch (error) {
    logError_('handleInteraction', 'Error processing command.', error);
    return createSimpleResponse('An error occurred while handling the command.', true);
  }
}



/**
 * Helper function to create a simple text response object for Discord.
 * @param {string} message The content of the message to send.
 * @param {boolean} [isEphemeral=false] If true, the message is only visible to the user.
 * @returns {Object} A Discord API-compatible response object.
 */
function createSimpleResponse(message, isEphemeral = false) {
  const response = {
    type: 4, // Type 4: Channel Message with Source
    data: {
      content: message,
    },
  };
  if (isEphemeral) {
    response.data.flags = 64; // Ephemeral flag
  }
  return response;
}
