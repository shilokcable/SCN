import { Client, Collector, CollectionRecord, EditRequest } from '../types/isp';

const STORAGE_KEYS = {
  CLIENTS: 'scn_isp_clients_v2',
  COLLECTIONS: 'scn_isp_collections_v2',
  EDIT_REQUESTS: 'scn_isp_edit_requests_v2',
  CURRENT_MONTH: 'scn_isp_current_month',
};

export const INITIAL_COLLECTORS: Collector[] = [
  {
    id: 'C1',
    name: 'জামাল আহমেদ (কালেক্টর ১)',
    phone: '01819-876543',
    pin: '1234',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    areaAssigned: 'শিলক বাজার ও কলেজ রোড',
  },
  {
    id: 'C2',
    name: 'কামাল হোসেন (কালেক্টর ২)',
    phone: '01817-234567',
    pin: '5678',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    areaAssigned: 'দক্ষিণ শিলক ও পাহাড়তলী',
  },
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'SCN-0001',
    serial: 1,
    status: 'active',
    connectionDate: '2023-01-10',
    ipAddress: '192.168.88.11',
    pppoeUsername: 'sb-jamalNT',
    clientName: 'জামাল উদ্দিন চৌধুরী',
    fatherName: 'মরহুম নুরুল ইসলাম',
    address: 'শিলক বাজার মেইন রোড, দোকান নং ০৪',
    area: 'শিলক বাজার',
    boxNo: 'BOX-01 (TJ-02)',
    mobile: '01811-223344',
    packageSpeed: '15 Mbps Unlimited',
    monthlyFee: 800,
    previousDue: 0,
    currentMonthBill: 800,
    paidThisMonth: 800,
    lastPaymentDate: '2026-11-01',
    lastPaymentCollector: 'জামাল আহমেদ (কালেক্টর ১)',
    assignedCollectorId: 'C1',
    router: {
      ip: '192.168.0.1',
      username: 'admin',
      password: 'scn@jamal2024',
      wifiSsid: 'SCN_Jamal_5G',
      wifiPassword: 'shilokcable789',
      model: 'TP-Link Archer C6 Dual-Band',
    },
    kyc: {
      nidNumber: '19871518293000412',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      emergencyContact: '01822-998877',
      occupation: 'ব্যবসায়ী (শিলক বাজার সমিতি)',
      notes: 'ফাইবার কানেকশন অপটিক্যাল নোড ০১',
    },
  },
  {
    id: 'SCN-0002',
    serial: 2,
    status: 'active',
    connectionDate: '2023-03-15',
    ipAddress: '192.168.88.14',
    pppoeUsername: 'sb-monir02',
    clientName: 'মো. মনিরুল ইসলাম',
    fatherName: 'আব্দুল মোতালেব',
    address: 'দক্ষিণ শিলক, মাস্টার পাড়া, বাড়ি-১২',
    area: 'দক্ষিণ শিলক',
    boxNo: 'BOX-03 (TJ-01)',
    mobile: '01712-334455',
    packageSpeed: '10 Mbps Standard',
    monthlyFee: 500,
    previousDue: 500,
    currentMonthBill: 500,
    paidThisMonth: 0,
    assignedCollectorId: 'C2',
    router: {
      ip: '192.168.1.1',
      username: 'admin',
      password: 'user@monir2023',
      wifiSsid: 'SCN_Monir_Home',
      wifiPassword: 'monirfiberpass',
      model: 'Tenda F3 300Mbps',
    },
    kyc: {
      nidNumber: '19921518293000889',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      emergencyContact: '01711-002233',
      occupation: 'শিক্ষক',
      notes: 'বকেয়া ১ মাসের আছে, দ্রুত তাগাদা দিতে হবে',
    },
  },
  {
    id: 'SCN-0003',
    serial: 3,
    status: 'active',
    connectionDate: '2023-05-20',
    ipAddress: '192.168.88.19',
    pppoeUsername: 'sb-kamrul_doc',
    clientName: 'ডা. কামরুল হাসান',
    fatherName: 'ডা. সাইদুর রহমান',
    address: 'কলেজ রোড, সেবা ক্লিনিক সংলগ্ন',
    area: 'কলেজ রোড',
    boxNo: 'BOX-02 (TJ-04)',
    mobile: '01913-445566',
    packageSpeed: '25 Mbps Corporate',
    monthlyFee: 1200,
    previousDue: 0,
    currentMonthBill: 1200,
    paidThisMonth: 1200,
    lastPaymentDate: '2026-11-02',
    lastPaymentCollector: 'কামাল হোসেন (কালেক্টর ২)',
    assignedCollectorId: 'C1',
    router: {
      ip: '192.168.31.1',
      username: 'admin',
      password: 'clinic@router99',
      wifiSsid: 'Sheba_Clinic_SCN',
      wifiPassword: 'shebaclinicfast',
      model: 'Mi Router 4A Gigabit Edition',
    },
    kyc: {
      nidNumber: '19851518293000551',
      photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
      emergencyContact: '01912-887766',
      occupation: 'চিকিৎসক',
      notes: 'ভিআইপি ক্লায়েন্ট, নির্বিঘ্ন সেবা আবশ্যক',
    },
  },
  {
    id: 'SCN-0004',
    serial: 4,
    status: 'active',
    connectionDate: '2023-08-01',
    ipAddress: '192.168.88.22',
    pppoeUsername: 'sb-delowar44',
    clientName: 'দেলোয়ার হোসেন',
    fatherName: 'হাজী সামসুল হক',
    address: 'পাহাড়তলী জামে মসজিদ সংলগ্ন',
    area: 'পাহাড়তলী',
    boxNo: 'BOX-05 (TJ-03)',
    mobile: '01820-556677',
    packageSpeed: '10 Mbps Standard',
    monthlyFee: 500,
    previousDue: 1000,
    currentMonthBill: 500,
    paidThisMonth: 0,
    assignedCollectorId: 'C2',
    router: {
      ip: '192.168.1.1',
      username: 'admin',
      password: 'adminpassword123',
      wifiSsid: 'Delowar_WiFi_SCN',
      wifiPassword: 'delowarpass99',
      model: 'Totolink A720R AC1200',
    },
    kyc: {
      nidNumber: '19901518293000774',
      photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      emergencyContact: '01819-112233',
      occupation: 'প্রবাসী পরিবার',
      notes: '২ মাসের বকেয়া জমে আছে',
    },
  },
  {
    id: 'SCN-0005',
    serial: 5,
    status: 'active',
    connectionDate: '2023-11-12',
    ipAddress: '192.168.88.29',
    pppoeUsername: 'sb-fatema_home',
    clientName: 'ফাতেমা বেগম',
    fatherName: 'মওলানা এনামুল হক',
    address: 'মধ্যপাড়া, কাজী বাড়ি রোড',
    area: 'মধ্যপাড়া',
    boxNo: 'BOX-04 (TJ-02)',
    mobile: '01614-667788',
    packageSpeed: '20 Mbps Ultra',
    monthlyFee: 1000,
    previousDue: 0,
    currentMonthBill: 1000,
    paidThisMonth: 0,
    assignedCollectorId: 'C1',
    router: {
      ip: '192.168.0.1',
      username: 'admin',
      password: 'fatema@router55',
      wifiSsid: 'SCN_Fatema_Fiber',
      wifiPassword: 'fatema7890wifi',
      model: 'Mercusys AC12G Gigabit',
    },
    kyc: {
      nidNumber: '19951518293000998',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      emergencyContact: '01611-334455',
      occupation: 'গৃহিণী',
      notes: 'নিয়মিত চলতি মাসের ৫ তারিখের মধ্যে পেমেন্ট করে',
    },
  },
  {
    id: 'SCN-0006',
    serial: 6,
    status: 'inactive',
    connectionDate: '2024-02-18',
    ipAddress: '192.168.88.35',
    pppoeUsername: 'sb-shakil_off',
    clientName: 'শাকিল আহমেদ',
    fatherName: 'আনোয়ার হোসেন',
    address: 'বাবুনগর রোড, গ্রামীণ ব্যাংক সংলগ্ন',
    area: 'বাবুনগর',
    boxNo: 'BOX-06 (TJ-01)',
    mobile: '01833-778899',
    packageSpeed: '10 Mbps Standard',
    monthlyFee: 500,
    previousDue: 1500,
    currentMonthBill: 0, // Inactive lines do not accumulate bill when status is off
    paidThisMonth: 0,
    assignedCollectorId: 'C2',
    router: {
      ip: '192.168.1.1',
      username: 'admin',
      password: 'shakiladmin88',
      wifiSsid: 'Shakil_Net_SCN',
      wifiPassword: 'shakilpass00',
      model: 'TP-Link TL-WR841N',
    },
    kyc: {
      nidNumber: '19981518293000332',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      emergencyContact: '01815-556677',
      occupation: 'ছাত্র',
      notes: 'সংযোগ সাময়িক বন্ধ (লাইন কাট হয়েছে বকেয়া পরিশোধ না করায়)',
    },
  },
  {
    id: 'SCN-0007',
    serial: 7,
    status: 'active',
    connectionDate: '2024-04-05',
    ipAddress: '192.168.88.40',
    pppoeUsername: 'sb-salma99',
    clientName: 'সালমা আক্তার',
    fatherName: 'রফিকুল ইসলাম',
    address: 'শিলক বাজার, স্টেশন রোড পূর্ব',
    area: 'শিলক বাজার',
    boxNo: 'BOX-01 (TJ-05)',
    mobile: '01515-889900',
    packageSpeed: '15 Mbps Unlimited',
    monthlyFee: 800,
    previousDue: 0,
    currentMonthBill: 800,
    paidThisMonth: 0,
    assignedCollectorId: 'C1',
    router: {
      ip: '192.168.0.1',
      username: 'admin',
      password: 'salmarouter@123',
      wifiSsid: 'SCN_Salma_Home',
      wifiPassword: 'salmafiberwifi',
      model: 'D-Link DIR-825 Dual Band',
    },
    kyc: {
      nidNumber: '19941518293000665',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      emergencyContact: '01511-223344',
      occupation: 'এনজিও কর্মকর্তা',
      notes: 'অনলাইন মিটিং ও ব্রডব্যান্ড কাজ করেন',
    },
  },
  {
    id: 'SCN-0008',
    serial: 8,
    status: 'active',
    connectionDate: '2024-07-22',
    ipAddress: '192.168.88.48',
    pppoeUsername: 'sb-rashid_shop',
    clientName: 'হাজী হারুনুর রশিদ',
    fatherName: 'মরহুম আফসার উদ্দিন',
    address: 'দক্ষিণ শিলক, নতুন ব্রিজ সংলগ্ন শপ',
    area: 'দক্ষিণ শিলক',
    boxNo: 'BOX-03 (TJ-03)',
    mobile: '01818-990011',
    packageSpeed: '30 Mbps SuperFast',
    monthlyFee: 1500,
    previousDue: 0,
    currentMonthBill: 1500,
    paidThisMonth: 1500,
    lastPaymentDate: '2026-11-01',
    lastPaymentCollector: 'জামাল আহমেদ (কালেক্টর ১)',
    assignedCollectorId: 'C2',
    router: {
      ip: '192.168.1.1',
      username: 'admin',
      password: 'harun@adminpass',
      wifiSsid: 'Rashid_Hardware_SCN',
      wifiPassword: 'harunsuperpass',
      model: 'Netgear Nighthawk R6700',
    },
    kyc: {
      nidNumber: '19791518293000219',
      photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
      emergencyContact: '01812-445566',
      occupation: 'হার্ডওয়্যার ব্যবসায়ী',
      notes: 'সিসিটিভি ক্যামেরার সাথে কানেক্টেড',
    },
  },
];

export const INITIAL_COLLECTIONS: CollectionRecord[] = [
  {
    id: 'RCP-202611-0001',
    clientId: 'SCN-0001',
    clientName: 'জামাল উদ্দিন চৌধুরী',
    pppoeUsername: 'sb-jamalNT',
    collectorId: 'C1',
    collectorName: 'জামাল আহমেদ (কালেক্টর ১)',
    amount: 800,
    month: 'নভেম্বর ২০২৬',
    date: '2026-11-01T10:30:00.000Z',
    method: 'Cash',
    previousDueAtPayment: 800,
    newDueRemaining: 0,
    status: 'completed',
    notes: 'নভেম্বর মাসের ফুল পেমেন্ট পরিশোধিত',
  },
  {
    id: 'RCP-202611-0002',
    clientId: 'SCN-0003',
    clientName: 'ডা. কামরুল হাসান',
    pppoeUsername: 'sb-kamrul_doc',
    collectorId: 'C2',
    collectorName: 'কামাল হোসেন (কালেক্টর ২)',
    amount: 1200,
    month: 'নভেম্বর ২০২৬',
    date: '2026-11-02T11:15:00.000Z',
    method: 'bKash',
    transactionId: 'BK9X87214',
    previousDueAtPayment: 1200,
    newDueRemaining: 0,
    status: 'completed',
    notes: 'বিকাশ পেমেন্ট রিসিভ করা হয়েছে',
  },
  {
    id: 'RCP-202611-0003',
    clientId: 'SCN-0008',
    clientName: 'হাজী হারুনুর রশিদ',
    pppoeUsername: 'sb-rashid_shop',
    collectorId: 'C1',
    collectorName: 'জামাল আহমেদ (কালেক্টর ১)',
    amount: 1500,
    month: 'নভেম্বর ২০২৬',
    date: '2026-11-01T16:45:00.000Z',
    method: 'Cash',
    previousDueAtPayment: 1500,
    newDueRemaining: 0,
    status: 'completed',
    notes: 'দোকান থেকে ক্যাশ কালেকশন',
  },
];

export const INITIAL_EDIT_REQUESTS: EditRequest[] = [
  {
    id: 'REQ-001',
    receiptId: 'RCP-202611-0001',
    clientId: 'SCN-0001',
    clientName: 'জামাল উদ্দিন চৌধুরী',
    collectorId: 'C1',
    collectorName: 'জামাল আহমেদ (কালেক্টর ১)',
    originalAmount: 800,
    requestedAmount: 700,
    reason: 'গ্রাহক ১০০ টাকার ডিসকাউন্ট কুপন দিয়েছিলেন যা বিলের সময় যোগ করা হয়নি।',
    requestedAt: '2026-11-01T14:20:00.000Z',
    status: 'pending',
  },
];

// LocalStorage Helpers
export function getClients(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
      return INITIAL_CLIENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse clients from storage', e);
    return INITIAL_CLIENTS;
  }
}

export function saveClients(clients: Client[]): void {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
}

export function getCollections(): CollectionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(INITIAL_COLLECTIONS));
      return INITIAL_COLLECTIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse collections from storage', e);
    return INITIAL_COLLECTIONS;
  }
}

export function saveCollections(collections: CollectionRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
}

export function getEditRequests(): EditRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EDIT_REQUESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EDIT_REQUESTS, JSON.stringify(INITIAL_EDIT_REQUESTS));
      return INITIAL_EDIT_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse edit requests from storage', e);
    return INITIAL_EDIT_REQUESTS;
  }
}

export function saveEditRequests(requests: EditRequest[]): void {
  localStorage.setItem(STORAGE_KEYS.EDIT_REQUESTS, JSON.stringify(requests));
}

export function getCurrentMonth(): string {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_MONTH) || 'নভেম্বর ২০২৬';
}

export function setCurrentMonth(month: string): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_MONTH, month);
}

// Check if a client has already been collected this month by anyone
export function getClientMonthlyCollection(clientId: string, month: string): CollectionRecord | undefined {
  const collections = getCollections();
  return collections.find(c => c.clientId === clientId && c.month === month && c.status !== 'edit_requested');
}

// Record a new collection
export function recordCollection(data: {
  clientId: string;
  collectorId: 'C1' | 'C2';
  collectorName: string;
  amount: number;
  month: string;
  method: 'Cash' | 'bKash' | 'Nagad' | 'Bank';
  transactionId?: string;
  notes?: string;
}): { success: boolean; message: string; receipt?: CollectionRecord } {
  const clients = getClients();
  const clientIndex = clients.findIndex(c => c.id === data.clientId);
  if (clientIndex === -1) {
    return { success: false, message: 'গ্রাহক খুঁজে পাওয়া যায়নি!' };
  }

  const client = clients[clientIndex];

  // Check double collection
  const existing = getClientMonthlyCollection(client.id, data.month);
  if (existing) {
    return {
      success: false,
      message: `সাবধান! ${client.clientName}-এর এই মাসের (${data.month}) বিল ইতিমধ্যে ${existing.collectorName} সংগ্রহ করেছেন (রিসিপ্ট: ${existing.id})। এক মাসে দুইবার কালেকশন করা যাবে না।`,
    };
  }

  const totalCurrentDue = (client.previousDue || 0) + (client.currentMonthBill || 0) - (client.paidThisMonth || 0);
  const remainingDue = Math.max(0, totalCurrentDue - data.amount);

  // Generate unique Receipt ID
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const receiptId = `RCP-${dateStr}-${randomSuffix}`;

  const newRecord: CollectionRecord = {
    id: receiptId,
    clientId: client.id,
    clientName: client.clientName,
    pppoeUsername: client.pppoeUsername,
    collectorId: data.collectorId,
    collectorName: data.collectorName,
    amount: data.amount,
    month: data.month,
    date: new Date().toISOString(),
    method: data.method,
    transactionId: data.transactionId,
    previousDueAtPayment: totalCurrentDue,
    newDueRemaining: remainingDue,
    status: 'completed',
    notes: data.notes,
  };

  // Update client record
  client.paidThisMonth = (client.paidThisMonth || 0) + data.amount;
  client.lastPaymentDate = new Date().toISOString().slice(0, 10);
  client.lastPaymentCollector = data.collectorName;

  clients[clientIndex] = client;
  saveClients(clients);

  const collections = getCollections();
  collections.unshift(newRecord);
  saveCollections(collections);

  return { success: true, message: 'বিল সফলভাবে জমা হয়েছে!', receipt: newRecord };
}

// Next Month Auto-Due Rollover Logic
// If status is "active" (On) and client didn't pay in full, previousDue += unpaid amount
export function advanceToNextMonth(newMonthName: string): { updatedCount: number } {
  const clients = getClients();
  let updatedCount = 0;

  const updatedClients = clients.map(client => {
    // calculate unpaid balance from current month
    const unpaidThisMonth = Math.max(0, (client.currentMonthBill || 0) - (client.paidThisMonth || 0));
    const newPreviousDue = (client.previousDue || 0) + unpaidThisMonth;

    // If client status is active (On), add new month bill
    // If client status is inactive (Off), currentMonthBill is 0
    const newCurrentBill = client.status === 'active' ? client.monthlyFee : 0;

    updatedCount++;
    return {
      ...client,
      previousDue: newPreviousDue,
      currentMonthBill: newCurrentBill,
      paidThisMonth: 0,
      lastPaymentDate: undefined,
      lastPaymentCollector: undefined,
    };
  });

  saveClients(updatedClients);
  setCurrentMonth(newMonthName);
  return { updatedCount };
}

// Reset all demo data to default
export function resetToDemoData(): void {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
  localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(INITIAL_COLLECTIONS));
  localStorage.setItem(STORAGE_KEYS.EDIT_REQUESTS, JSON.stringify(INITIAL_EDIT_REQUESTS));
  localStorage.setItem(STORAGE_KEYS.CURRENT_MONTH, 'নভেম্বর ২০২৬');
}
