/**
 * @file CRM_Module.gs
 * @description Manages all Customer/Personnel Relationship Management functions (Feature 2).
 * Handles CRUD operations for the 'Personnel_Data' sheet.
 */

/**
 * Helper function to convert slash command options array to a simple key-value object.
 * @param {Array<Object>} options The array of options from the interaction.
 * @returns {Object} An object with option names as keys and their values.
 */
function parseOptions_(options) {
  if (!options) {
    return {};
  }
  const parsed = {};
  for (const option of options) {
    parsed[option.name] = option.value;
  }
  return parsed;
}

/**
 * Handles the '/add' command for personnel.
 * @param {Array<Object>} options Command options (type, name, role, contact_info).
 * @returns {Object} A Discord response object.
 */
function handleAddCommand(options) {
  try {
    const args = parseOptions_(options);

    // Basic Validation
    if (!args.type || !args.name) {
      return createSimpleResponse('Error: `type` (พนักงาน/ลูกค้า/ผู้เช่า) and `name` are required fields.', true);
    }

    // Generate a unique User_ID
    const userId = `U${new Date().getTime()}`;

    const newRow = [
      userId,
      args.name,
      args.type,
      args.role || '', // Optional
      args.contact_info || '', // Optional
      '', // Historical_Notes starts empty
      args.rental_unit_id || '' // Optional
    ];

    const success = appendData('Personnel_Data', newRow);

    if (success) {
      return createSimpleResponse(`✅ Successfully added **${args.name}** with User ID: \`${userId}\``);
    } else {
      return createSimpleResponse('❌ Failed to add new person to the database.', true);
    }
  } catch (error) {
    logError_('handleAddCommand', 'Failed to add personnel.', error);
    return createSimpleResponse('An error occurred during the add operation.', true);
  }
}

/**
 * Handles the '/search' command for personnel.
 * @param {Array<Object>} options Command options (e.g., name, user_id).
 * @returns {Object} A Discord response object.
 */
function handleSearchCommand(options) {
  try {
    const args = parseOptions_(options);
    const searchKey = args.search_by; // e.g., 'Name' or 'User_ID'
    const searchValue = args.value;

    if (!searchKey || !searchValue) {
      return createSimpleResponse('Error: Please provide both a search key (`search_by`) and a value.', true);
    }

    const results = findData('Personnel_Data', searchKey, searchValue);

    if (results.length === 0) {
      return createSimpleResponse(`No personnel found where \`${searchKey}\` is \`${searchValue}\`.`);
    }

    // --- Create an Embed for the results ---
    const embed = {
      color: 0x3498DB,
      title: `👤 ผลการค้นหาสำหรับ "${searchValue}"`,
      fields: [],
    };

    results.forEach(person => {
      embed.fields.push({
        name: `${person.Name} (ID: ${person.User_ID})`,
        value: `**ประเภท:** ${person.Type}\n**ตำแหน่ง:** ${person.Role || 'N/A'}\n**ติดต่อ:** ${person.Contact_Info || 'N/A'}`,
        inline: false,
      });
    });

    return createEmbedResponse([embed]);

  } catch (error) {
    logError_('handleSearchCommand', 'Failed to search personnel.', error);
    return createSimpleResponse('An error occurred during the search operation.', true);
  }
}

/**
 * Handles the '/update' command for personnel.
 * @param {Array<Object>} options Command options (user_id, field, new_value).
 * @returns {Object} A Discord response object.
 */
function handleUpdateCommand(options) {
  try {
    const args = parseOptions_(options);

    if (!args.user_id || !args.field || !args.new_value) {
      return createSimpleResponse('Error: `user_id`, `field` to update, and a `new_value` are required.', true);
    }

    const newData = { [args.field]: args.new_value };

    const success = updateData('Personnel_Data', 'User_ID', args.user_id, newData);

    if (success) {
      return createSimpleResponse(`✅ Successfully updated field \`${args.field}\` for User ID \`${args.user_id}\`.`);
    } else {
      return createSimpleResponse(`❌ Could not find or update User ID \`${args.user_id}\`. Please check the ID.`, true);
    }
  } catch (error) {
    logError_('handleUpdateCommand', 'Failed to update personnel.', error);
    return createSimpleResponse('An error occurred during the update operation.', true);
  }
}

/**
 * Handles the '/delete' command for personnel.
 * @param {Array<Object>} options Command options (user_id).
 * @returns {Object} A Discord response object.
 */
function handleDeleteCommand(options) {
  try {
    const args = parseOptions_(options);

    if (!args.user_id) {
      return createSimpleResponse('Error: `user_id` is required to delete an entry.', true);
    }

    const success = deleteData('Personnel_Data', 'User_ID', args.user_id);

    if (success) {
      return createSimpleResponse(`🗑️ Successfully deleted entry for User ID \`${args.user_id}\`.`);
    } else {
      return createSimpleResponse(`❌ Could not find or delete User ID \`${args.user_id}\`.`, true);
    }
  } catch (error) {
    logError_('handleDeleteCommand', 'Failed to delete personnel.', error);
    return createSimpleResponse('An error occurred during the delete operation.', true);
  }
}
