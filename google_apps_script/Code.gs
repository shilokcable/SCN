/**
 * =========================================================================
 * SCN [Shilok Cable Network] - ISP Management & Billing System
 * Google Apps Script Backend (Code.gs)
 * স্লোগান: "সবার জন্য ইন্টারনেট"
 * =========================================================================
 */

// Global Sheet Tab Names
const SHEETS = {
  CLIENTS: 'Clients',
  COLLECTIONS: 'Collections',
  EDIT_REQUESTS: 'EditRequests',
  SETTINGS: 'Settings'
};

/**
 * Serves the HTML Web App UI
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('SCN - Shilok Cable Network | সবার জন্য ইন্টারনেট')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * 1-Click Database Setup:
 * Run this function once from Apps Script editor to auto-create all tabs & sample data.
 */
function initDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Clients Sheet
  let clientSheet = ss.getSheetByName(SHEETS.CLIENTS);
  if (!clientSheet) {
    clientSheet = ss.insertSheet(SHEETS.CLIENTS);
    const headers = [
      'Serial', 'ClientID', 'Status', 'ConnectionDate', 'ClientName', 'FatherName',
      'Mobile', 'Area', 'Address', 'BoxNo', 'IPAddress', 'PPPoE',
      'Package', 'MonthlyFee', 'PreviousDue', 'CurrentBill', 'PaidThisMonth', 'TotalDue',
      'RouterModel', 'RouterIP', 'RouterUser', 'RouterPassword', 'WifiSSID', 'WifiPassword',
      'NID', 'EmergencyContact', 'Notes'
    ];
    clientSheet.appendRow(headers);
    clientSheet.getRange(1, 1, 1, headers.length)
      .setBackground('#0f172a')
      .setFontColor('#38bdf8')
      .setFontWeight('bold');

    // Add sample client
    clientSheet.appendRow([
      1, 'SCN-0001', 'active', '2023-01-10', 'জামাল উদ্দিন চৌধুরী', 'মরহুম নুরুল ইসলাম',
      '01811-223344', 'শিলক বাজার', 'শিলক বাজার মেইন রোড, দোকান নং ০৪', 'BOX-01 (TJ-02)',
      '192.168.88.11', 'sb-jamalNT', '15 Mbps Unlimited', 800, 0, 800, 800, 0,
      'TP-Link Archer C6 Dual-Band', '192.168.0.1', 'admin', 'scn@jamal2024',
      'SCN_Jamal_5G', 'shilokcable789', '19871518293000412', '01822-998877', 'ফাইবার অপটিক্যাল নোড ০১'
    ]);

    clientSheet.appendRow([
      2, 'SCN-0002', 'active', '2023-03-15', 'মো. মনিরুল ইসলাম', 'আব্দুল মোতালেব',
      '01712-334455', 'দক্ষিণ শিলক', 'দক্ষিণ শিলক, মাস্টার পাড়া, বাড়ি-১২', 'BOX-03 (TJ-01)',
      '192.168.88.14', 'sb-monir02', '10 Mbps Standard', 500, 500, 500, 0, 1000,
      'Tenda F3 300Mbps', '192.168.1.1', 'admin', 'user@monir2023',
      'SCN_Monir_Home', 'monirfiberpass', '19921518293000889', '01711-002233', '১ মাসের বকেয়া আছে'
    ]);
  }

  // 2. Collections Sheet
  let colSheet = ss.getSheetByName(SHEETS.COLLECTIONS);
  if (!colSheet) {
    colSheet = ss.insertSheet(SHEETS.COLLECTIONS);
    const colHeaders = [
      'ReceiptID', 'ClientID', 'ClientName', 'PPPoE', 'CollectorID', 'CollectorName',
      'Amount', 'Month', 'Timestamp', 'Method', 'TransactionID', 'PreviousDue', 'RemainingDue', 'Status', 'Notes'
    ];
    colSheet.appendRow(colHeaders);
    colSheet.getRange(1, 1, 1, colHeaders.length)
      .setBackground('#064e3b')
      .setFontColor('#a7f3d0')
      .setFontWeight('bold');

    colSheet.appendRow([
      'RCP-202611-0001', 'SCN-0001', 'জামাল উদ্দিন চৌধুরী', 'sb-jamalNT',
      'C1', 'জামাল আহমেদ (কালেক্টর ১)', 800, 'নভেম্বর ২০২৬', new Date().toISOString(),
      'Cash', '', 800, 0, 'completed', 'নভেম্বর ফুল পেমেন্ট'
    ]);
  }

  // 3. Edit Requests Sheet
  let reqSheet = ss.getSheetByName(SHEETS.EDIT_REQUESTS);
  if (!reqSheet) {
    reqSheet = ss.insertSheet(SHEETS.EDIT_REQUESTS);
    const reqHeaders = [
      'RequestID', 'ReceiptID', 'ClientID', 'ClientName', 'CollectorID', 'CollectorName',
      'OriginalAmount', 'RequestedAmount', 'Reason', 'Timestamp', 'Status', 'ReviewedAt'
    ];
    reqSheet.appendRow(reqHeaders);
    reqSheet.getRange(1, 1, 1, reqHeaders.length)
      .setBackground('#78350f')
      .setFontColor('#fde68a')
      .setFontWeight('bold');
  }

  // 4. Settings Sheet
  let setSheet = ss.getSheetByName(SHEETS.SETTINGS);
  if (!setSheet) {
    setSheet = ss.insertSheet(SHEETS.SETTINGS);
    setSheet.appendRow(['Key', 'Value']);
    setSheet.appendRow(['CurrentMonth', 'নভেম্বর ২০২৬']);
    setSheet.appendRow(['CompanyName', 'SCN - Shilok Cable Network']);
    setSheet.appendRow(['Tagline', 'সবার জন্য ইন্টারনেট']);
    setSheet.appendRow(['Helpline', '01819-876543, 01817-234567']);
  }

  return 'Database Initialization Completed Successfully!';
}

/**
 * Fetch all data for client application
 */
function getAllData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Ensure tables exist
  let clientSheet = ss.getSheetByName(SHEETS.CLIENTS);
  if (!clientSheet) {
    initDatabase();
    clientSheet = ss.getSheetByName(SHEETS.CLIENTS);
  }

  // Read Clients
  const clientData = clientSheet.getDataRange().getValues();
  const clientHeaders = clientData[0];
  const clients = [];

  for (let i = 1; i < clientData.length; i++) {
    const row = clientData[i];
    if (!row[1]) continue; // skip if no ClientID

    const fee = Number(row[13]) || 0;
    const prevDue = Number(row[14]) || 0;
    const currentBill = Number(row[15]) || 0;
    const paid = Number(row[16]) || 0;
    const totalDue = Math.max(0, prevDue + currentBill - paid);

    clients.push({
      serial: Number(row[0]) || i,
      id: String(row[1]),
      status: String(row[2] || 'active'),
      connectionDate: row[3] ? String(row[3]).slice(0, 10) : '',
      clientName: String(row[4] || ''),
      fatherName: String(row[5] || ''),
      mobile: String(row[6] || ''),
      area: String(row[7] || ''),
      address: String(row[8] || ''),
      boxNo: String(row[9] || ''),
      ipAddress: String(row[10] || ''),
      pppoeUsername: String(row[11] || ''),
      packageSpeed: String(row[12] || ''),
      monthlyFee: fee,
      previousDue: prevDue,
      currentMonthBill: currentBill,
      paidThisMonth: paid,
      totalDue: totalDue,
      router: {
        model: String(row[18] || 'TP-Link Router'),
        ip: String(row[19] || '192.168.0.1'),
        username: String(row[20] || 'admin'),
        password: String(row[21] || 'admin'),
        wifiSsid: String(row[22] || 'SCN_WiFi'),
        wifiPassword: String(row[23] || '')
      },
      kyc: {
        nidNumber: String(row[24] || ''),
        emergencyContact: String(row[25] || ''),
        notes: String(row[26] || '')
      }
    });
  }

  // Read Collections
  const colSheet = ss.getSheetByName(SHEETS.COLLECTIONS);
  const colData = colSheet ? colSheet.getDataRange().getValues() : [];
  const collections = [];
  for (let i = 1; i < colData.length; i++) {
    const row = colData[i];
    if (!row[0]) continue;
    collections.push({
      id: String(row[0]),
      clientId: String(row[1]),
      clientName: String(row[2]),
      pppoeUsername: String(row[3]),
      collectorId: String(row[4]),
      collectorName: String(row[5]),
      amount: Number(row[6]) || 0,
      month: String(row[7]),
      date: String(row[8]),
      method: String(row[9]),
      transactionId: String(row[10] || ''),
      previousDueAtPayment: Number(row[11]) || 0,
      newDueRemaining: Number(row[12]) || 0,
      status: String(row[13] || 'completed'),
      notes: String(row[14] || '')
    });
  }

  // Read Edit Requests
  const reqSheet = ss.getSheetByName(SHEETS.EDIT_REQUESTS);
  const reqData = reqSheet ? reqSheet.getDataRange().getValues() : [];
  const editRequests = [];
  for (let i = 1; i < reqData.length; i++) {
    const row = reqData[i];
    if (!row[0]) continue;
    editRequests.push({
      id: String(row[0]),
      receiptId: String(row[1]),
      clientId: String(row[2]),
      clientName: String(row[3]),
      collectorId: String(row[4]),
      collectorName: String(row[5]),
      originalAmount: Number(row[6]) || 0,
      requestedAmount: Number(row[7]) || 0,
      reason: String(row[8] || ''),
      requestedAt: String(row[9]),
      status: String(row[10] || 'pending'),
      reviewedAt: String(row[11] || '')
    });
  }

  // Read Settings
  const setSheet = ss.getSheetByName(SHEETS.SETTINGS);
  let currentMonth = 'নভেম্বর ২০২৬';
  if (setSheet) {
    const sData = setSheet.getDataRange().getValues();
    for (let i = 1; i < sData.length; i++) {
      if (sData[i][0] === 'CurrentMonth') {
        currentMonth = String(sData[i][1]);
      }
    }
  }

  return {
    clients: clients,
    collections: collections.reverse(),
    editRequests: editRequests.reverse(),
    currentMonth: currentMonth
  };
}

/**
 * Record a Bill Collection with Double-Collection Lock
 */
function recordCollection(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const colSheet = ss.getSheetByName(SHEETS.COLLECTIONS);
  const clientSheet = ss.getSheetByName(SHEETS.CLIENTS);

  // 1. Check double collection for current month
  const colData = colSheet.getDataRange().getValues();
  for (let i = 1; i < colData.length; i++) {
    const cId = String(colData[i][1]);
    const month = String(colData[i][7]);
    const status = String(colData[i][13]);
    if (cId === data.clientId && month === data.month && status !== 'cancelled') {
      return {
        success: false,
        message: 'সাবধান! এই গ্রাহকের এই মাসের বিল ইতিমধ্যে ' + colData[i][5] + ' সংগ্রহ করেছেন (রশিদ: ' + colData[i][0] + ')।'
      };
    }
  }

  // 2. Locate client in sheet
  const clientData = clientSheet.getDataRange().getValues();
  let clientRowIdx = -1;
  let clientRow = null;

  for (let i = 1; i < clientData.length; i++) {
    if (String(clientData[i][1]) === data.clientId) {
      clientRowIdx = i + 1; // 1-indexed in sheet
      clientRow = clientData[i];
      break;
    }
  }

  if (clientRowIdx === -1) {
    return { success: false, message: 'ক্লায়েন্ট খুঁজে পাওয়া যায়নি!' };
  }

  const prevDue = Number(clientRow[14]) || 0;
  const currentBill = Number(clientRow[15]) || 0;
  const alreadyPaid = Number(clientRow[16]) || 0;
  const totalDueBefore = Math.max(0, prevDue + currentBill - alreadyPaid);
  const newDueRemaining = Math.max(0, totalDueBefore - Number(data.amount));

  // Generate unique Receipt ID
  const dateStr = Utilities.formatDate(new Date(), 'GMT+6', 'yyyyMMdd-HHmmss');
  const receiptId = 'RCP-' + dateStr;

  // Append collection record
  colSheet.appendRow([
    receiptId,
    data.clientId,
    data.clientName,
    data.pppoeUsername,
    data.collectorId,
    data.collectorName,
    Number(data.amount),
    data.month,
    new Date().toISOString(),
    data.method || 'Cash',
    data.transactionId || '',
    totalDueBefore,
    newDueRemaining,
    'completed',
    data.notes || ''
  ]);

  // Update client's paid amount & total due in Clients sheet
  const newPaidTotal = alreadyPaid + Number(data.amount);
  clientSheet.getRange(clientRowIdx, 17).setValue(newPaidTotal); // Col 17 = PaidThisMonth
  clientSheet.getRange(clientRowIdx, 18).setValue(newDueRemaining); // Col 18 = TotalDue

  return {
    success: true,
    message: 'বিল সফলভাবে জমা হয়েছে!',
    receipt: {
      id: receiptId,
      clientId: data.clientId,
      clientName: data.clientName,
      pppoeUsername: data.pppoeUsername,
      collectorId: data.collectorId,
      collectorName: data.collectorName,
      amount: Number(data.amount),
      month: data.month,
      date: new Date().toISOString(),
      method: data.method || 'Cash',
      transactionId: data.transactionId || '',
      previousDueAtPayment: totalDueBefore,
      newDueRemaining: newDueRemaining,
      status: 'completed',
      notes: data.notes || ''
    }
  };
}

/**
 * Submit an Edit Request (Collector -> Admin)
 */
function submitEditRequest(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const reqSheet = ss.getSheetByName(SHEETS.EDIT_REQUESTS);

  const reqId = 'REQ-' + Utilities.formatDate(new Date(), 'GMT+6', 'yyyyMMdd-HHmm');
  reqSheet.appendRow([
    reqId,
    data.receiptId,
    data.clientId,
    data.clientName,
    data.collectorId,
    data.collectorName,
    Number(data.originalAmount),
    Number(data.requestedAmount),
    data.reason,
    new Date().toISOString(),
    'pending',
    ''
  ]);

  return { success: true, message: 'অ্যাডমিনের নিকট সফলভাবে এডিট রিকোয়েস্ট পাঠানো হয়েছে।' };
}

/**
 * Approve or Reject Edit Request (Admin action)
 */
function reviewEditRequest(requestId, status, newAmount) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const reqSheet = ss.getSheetByName(SHEETS.EDIT_REQUESTS);
  const colSheet = ss.getSheetByName(SHEETS.COLLECTIONS);
  const clientSheet = ss.getSheetByName(SHEETS.CLIENTS);

  const reqData = reqSheet.getDataRange().getValues();
  let foundRow = -1;
  let targetReceiptId = '';
  let targetClientId = '';
  let originalAmount = 0;

  for (let i = 1; i < reqData.length; i++) {
    if (String(reqData[i][0]) === requestId) {
      foundRow = i + 1;
      targetReceiptId = String(reqData[i][1]);
      targetClientId = String(reqData[i][2]);
      originalAmount = Number(reqData[i][6]);
      break;
    }
  }

  if (foundRow === -1) return { success: false, message: 'রিকোয়েস্ট খুঁজে পাওয়া যায়নি!' };

  reqSheet.getRange(foundRow, 11).setValue(status);
  reqSheet.getRange(foundRow, 12).setValue(new Date().toISOString());

  if (status === 'approved' && newAmount !== undefined) {
    const diff = Number(newAmount) - originalAmount;

    // Update Collections sheet
    const colData = colSheet.getDataRange().getValues();
    for (let j = 1; j < colData.length; j++) {
      if (String(colData[j][0]) === targetReceiptId) {
        colSheet.getRange(j + 1, 7).setValue(Number(newAmount)); // Col 7 = Amount
        colSheet.getRange(j + 1, 14).setValue('edited');
        break;
      }
    }

    // Update Clients sheet
    const clientData = clientSheet.getDataRange().getValues();
    for (let k = 1; k < clientData.length; k++) {
      if (String(clientData[k][1]) === targetClientId) {
        const curPaid = Number(clientData[k][16]) || 0;
        clientSheet.getRange(k + 1, 17).setValue(curPaid + diff);
        break;
      }
    }

    return { success: true, message: 'সংশোধন অনুমোদিত ও শীটে হালনাগাদ সম্পন্ন!' };
  }

  return { success: true, message: 'অনুরোধ প্রত্যাখ্যান করা হয়েছে।' };
}

/**
 * Auto-Due Next Month Rollover:
 * If Status is "active", unpaid amount rolls into Previous Due.
 */
function advanceNextMonth(newMonthName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const clientSheet = ss.getSheetByName(SHEETS.CLIENTS);
  const setSheet = ss.getSheetByName(SHEETS.SETTINGS);

  const clientData = clientSheet.getDataRange().getValues();
  for (let i = 1; i < clientData.length; i++) {
    const status = String(clientData[i][2]);
    const fee = Number(clientData[i][13]) || 0;
    const prevDue = Number(clientData[i][14]) || 0;
    const currentBill = Number(clientData[i][15]) || 0;
    const paid = Number(clientData[i][16]) || 0;

    const unpaidFromThisMonth = Math.max(0, currentBill - paid);
    const updatedPrevDue = prevDue + unpaidFromThisMonth;
    const updatedCurrentBill = status === 'active' ? fee : 0;

    clientSheet.getRange(i + 1, 15).setValue(updatedPrevDue);
    clientSheet.getRange(i + 1, 16).setValue(updatedCurrentBill);
    clientSheet.getRange(i + 1, 17).setValue(0); // Reset PaidThisMonth
    clientSheet.getRange(i + 1, 18).setValue(updatedPrevDue + updatedCurrentBill);
  }

  // Update Current Month in Settings
  if (setSheet) {
    const sData = setSheet.getDataRange().getValues();
    for (let j = 1; j < sData.length; j++) {
      if (sData[j][0] === 'CurrentMonth') {
        setSheet.getRange(j + 1, 2).setValue(newMonthName);
        break;
      }
    }
  }

  return { success: true, message: 'সফলভাবে ' + newMonthName + ' মাসে রোলওভার সম্পন্ন!' };
}

/**
 * Create or Edit Client in Google Sheet
 */
function saveOrUpdateClient(c) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const clientSheet = ss.getSheetByName(SHEETS.CLIENTS);
  const clientData = clientSheet.getDataRange().getValues();

  let targetRow = -1;
  for (let i = 1; i < clientData.length; i++) {
    if (String(clientData[i][1]) === c.id) {
      targetRow = i + 1;
      break;
    }
  }

  const rowValues = [
    c.serial, c.id, c.status, c.connectionDate, c.clientName, c.fatherName,
    c.mobile, c.area, c.address, c.boxNo, c.ipAddress, c.pppoeUsername,
    c.packageSpeed, Number(c.monthlyFee), Number(c.previousDue || 0),
    c.status === 'active' ? Number(c.monthlyFee) : 0, Number(c.paidThisMonth || 0),
    (Number(c.previousDue || 0) + (c.status === 'active' ? Number(c.monthlyFee) : 0) - Number(c.paidThisMonth || 0)),
    c.router ? c.router.model : '', c.router ? c.router.ip : '',
    c.router ? c.router.username : '', c.router ? c.router.password : '',
    c.router ? c.router.wifiSsid : '', c.router ? c.router.wifiPassword : '',
    c.kyc ? c.kyc.nidNumber : '', c.kyc ? c.kyc.emergencyContact : '',
    c.kyc ? c.kyc.notes : ''
  ];

  if (targetRow !== -1) {
    clientSheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
    return { success: true, message: c.clientName + '-এর তথ্য হালনাগাদ হয়েছে!' };
  } else {
    clientSheet.appendRow(rowValues);
    return { success: true, message: 'নতুন ক্লায়েন্ট ' + c.clientName + ' যুক্ত হয়েছে!' };
  }
}
