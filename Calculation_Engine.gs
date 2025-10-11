/**
 * @file Calculation_Engine.gs
 * @description Handles complex financial calculations like rent and payroll (Feature 3).
 */

// Re-using this helper function for convenience. In a larger project, this might go in a 'Utils.gs' file.
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
 * Handles the '/calculate_rent' command.
 * @param {Array<Object>} options Command options (e.g., user_id, extra_charges).
 * @returns {Object} A Discord response object.
 */
function handleCalculateRentCommand(options) {
  try {
    const args = parseOptions_(options);
    if (!args.user_id) {
      return createSimpleResponse('Error: Please provide the `user_id` of the tenant.', true);
    }

    // --- Fetch rates and user data ---
    const baseRateStr = getConfig_('RENTAL_BASE_RATE') || '0';
    const taxRateStr = getConfig_('TAX_RATE') || '0';
    const baseRate = parseFloat(baseRateStr);
    const taxRate = parseFloat(taxRateStr);
    const extraCharges = parseFloat(args.extra_charges || '0');

    const tenantData = findData('Personnel_Data', 'User_ID', args.user_id);
    if (tenantData.length === 0 || tenantData[0].Type !== 'ผู้เช่า') {
      return createSimpleResponse(`Error: User ID \`${args.user_id}\` is not a valid tenant.`, true);
    }
    const tenantName = tenantData[0].Name;

    // --- Perform calculation ---
    const subTotal = baseRate + extraCharges;
    const taxAmount = subTotal * taxRate;
    const totalAmount = subTotal + taxAmount;

    // --- Record transaction ---
    const transId = `T${new Date().getTime()}`;
    const calculationDetail = {
      baseRate: baseRate,
      extraCharges: extraCharges,
      subTotal: subTotal,
      taxRate: taxRate,
      taxAmount: taxAmount,
    };

    const newTransaction = [
      transId,
      'Rent', // Type
      new Date().toISOString(), // Date
      totalAmount,
      args.user_id,
      'Pending', // Status
      JSON.stringify(calculationDetail), // Calculation_Detail_JSON
    ];
    appendData('Financial_Data', newTransaction);

    // --- Create summary embed ---
    const embed = {
      color: 0x2ECC71, // Green
      title: `🧾 ใบแจ้งหนี้ค่าเช่า (Rent Invoice) - ${tenantName}`,
      description: `สร้างธุรกรรมค่าเช่าสำหรับ User ID: \`${args.user_id}\``,
      fields: [
        { name: 'ค่าเช่าพื้นฐาน', value: `฿${baseRate.toFixed(2)}`, inline: true },
        { name: 'ค่าบริการเพิ่มเติม', value: `฿${extraCharges.toFixed(2)}`, inline: true },
        { name: 'ภาษี (VAT)', value: `฿${taxAmount.toFixed(2)} (${taxRate * 100}%)`, inline: true },
        { name: 'ยอดรวมที่ต้องชำระ', value: `**฿${totalAmount.toFixed(2)}**`, inline: false },
      ],
      footer: { text: `Transaction ID: ${transId}` }
    };

    return createEmbedResponse([embed]);

  } catch (error) {
    logError_('handleCalculateRentCommand', 'Failed to calculate rent.', error);
    return createSimpleResponse('An error occurred during rent calculation.', true);
  }
}

/**
 * Handles the '/calculate_payroll' command.
 * @param {Array<Object>} options Command options (user_id, days_worked).
 * @returns {Object} A Discord response object.
 */
function handleCalculatePayrollCommand(options) {
  try {
    const args = parseOptions_(options);
    if (!args.user_id || !args.days_worked) {
      return createSimpleResponse('Error: Please provide `user_id` and `days_worked`.', true);
    }

    // --- Fetch rates and user data ---
    const dailyRateStr = getConfig_('PAY_RATE_DAILY') || '0';
    const taxRateStr = getConfig_('TAX_RATE') || '0';
    const dailyRate = parseFloat(dailyRateStr);
    const taxRate = parseFloat(taxRateStr);
    const daysWorked = parseInt(args.days_worked);

    const empData = findData('Personnel_Data', 'User_ID', args.user_id);
    if (empData.length === 0 || empData[0].Type !== 'พนักงาน') {
      return createSimpleResponse(`Error: User ID \`${args.user_id}\` is not a valid employee.`, true);
    }
    const empName = empData[0].Name;

    // --- Perform calculation ---
    const grossSalary = dailyRate * daysWorked;
    const taxDeduction = grossSalary * taxRate;
    const netSalary = grossSalary - taxDeduction;

    // --- Record transaction ---
    const transId = `T${new Date().getTime()}`;
    const calculationDetail = {
      dailyRate: dailyRate,
      daysWorked: daysWorked,
      grossSalary: grossSalary,
      taxRate: taxRate,
      taxDeduction: taxDeduction,
    };

    const newTransaction = [
      transId,
      'Payroll', // Type
      new Date().toISOString(), // Date
      netSalary,
      args.user_id,
      'Paid', // Status
      JSON.stringify(calculationDetail), // Calculation_Detail_JSON
    ];
    appendData('Financial_Data', newTransaction);

    // --- Create payslip embed ---
    const embed = {
      color: 0xE67E22, // Orange
      title: `💼 สลิปเงินเดือน (Payslip) - ${empName}`,
      fields: [
        { name: 'อัตราจ้างรายวัน', value: `฿${dailyRate.toFixed(2)}`, inline: true },
        { name: 'จำนวนวันที่ทำงาน', value: `${daysWorked} วัน`, inline: true },
        { name: 'เงินเดือนรวม (Gross)', value: `฿${grossSalary.toFixed(2)}`, inline: false },
        { name: 'หักภาษี (Tax)', value: `฿${taxDeduction.toFixed(2)}`, inline: false },
        { name: 'เงินเดือนสุทธิ (Net)', value: `**฿${netSalary.toFixed(2)}**`, inline: false },
      ],
      footer: { text: `Transaction ID: ${transId}` }
    };

    return createEmbedResponse([embed]);

  } catch (error) {
    logError_('handleCalculatePayrollCommand', 'Failed to calculate payroll.', error);
    return createSimpleResponse('An error occurred during payroll calculation.', true);
  }
}
