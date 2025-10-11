/**
 * @file Document_Generator.gs
 * @description Handles the automatic generation of documents like invoices (Feature 4).
 */

// Re-using this helper function.
function parseOptions_(options) {
  if (!options) return {};
  const parsed = {};
  for (const option of options) {
    parsed[option.name] = option.value;
  }
  return parsed;
}

/**
 * Handles the '/generate_invoice' command.
 * Creates a Google Doc invoice from a template and transaction data.
 * @param {Array<Object>} options Command options, expecting 'transaction_id'.
 * @returns {Object} A Discord response object.
 */
function handleGenerateInvoiceCommand(options) {
  try {
    const args = parseOptions_(options);
    if (!args.transaction_id) {
      return createSimpleResponse('Error: Please provide a `transaction_id` to generate an invoice.', true);
    }
    const transId = args.transaction_id;

    // --- Fetch data ---
    const transactionData = findData('Financial_Data', 'Trans_ID', transId);
    if (transactionData.length === 0) {
      return createSimpleResponse(`Error: Transaction ID \`${transId}\` not found.`, true);
    }
    const transaction = transactionData[0];

    const userData = findData('Personnel_Data', 'User_ID', transaction.Associated_User_ID);
    if (userData.length === 0) {
      return createSimpleResponse(`Error: Associated user \`${transaction.Associated_User_ID}\` not found.`, true);
    }
    const user = userData[0];

    // --- Fetch template ---
    // For this to work, a template named 'Invoice' must exist in the 'Templates' sheet.
    const templateData = findData('Templates', 'Template_Name', 'Invoice');
    if (templateData.length === 0) {
      return createSimpleResponse('Error: Invoice template not found in the `Templates` sheet.', true);
    }
    let templateContent = templateData[0].Template_Content;

    // --- Merge data with template ---
    // This uses simple placeholder replacement.
    templateContent = templateContent.replace(/{{NAME}}/g, user.Name)
                                     .replace(/{{USER_ID}}/g, user.User_ID)
                                     .replace(/{{CONTACT}}/g, user.Contact_Info)
                                     .replace(/{{DATE}}/g, new Date(transaction.Date).toLocaleDateString('th-TH'))
                                     .replace(/{{TRANS_ID}}/g, transaction.Trans_ID)
                                     .replace(/{{AMOUNT}}/g, parseFloat(transaction.Amount).toFixed(2));

    // --- Create Google Doc ---
    const docName = `Invoice-${transaction.Trans_ID}-${user.Name}`;
    const doc = DocumentApp.create(docName);
    const body = doc.getBody();

    // Simple parsing: assume template uses newlines for paragraphs
    const paragraphs = templateContent.split('\\n');
    paragraphs.forEach(p => body.appendParagraph(p));

    doc.saveAndClose();
    const docUrl = doc.getUrl();

    // --- Send link to user ---
    const embed = {
      color: 0x9B59B6, // Purple
      title: '📄 เอกสารถูกสร้างเรียบร้อยแล้ว (Document Generated)',
      description: `ใบแจ้งหนี้สำหรับ **${user.Name}** ได้ถูกสร้างขึ้นแล้ว`,
      fields: [
        {
          name: 'คลิกเพื่อดูเอกสาร',
          value: `[${docName}](${docUrl})`,
        },
      ],
      footer: { text: `Transaction ID: ${transaction.Trans_ID}` }
    };

    return createEmbedResponse([embed]);

  } catch (error) {
    logError_('handleGenerateInvoiceCommand', 'Failed to generate document.', error);
    return createSimpleResponse('An error occurred during document generation.', true);
  }
}
