export type ClientStatus = 'active' | 'inactive' | 'suspended';

export interface RouterConfig {
  ip: string;
  webPort?: string;
  username: string;
  password: string;
  wifiSsid: string;
  wifiPassword?: string;
  model: string;
}

export interface ClientKYC {
  nidNumber: string;
  photoUrl: string;
  nidFrontUrl?: string;
  emergencyContact: string;
  occupation?: string;
  notes?: string;
}

export interface Client {
  id: string; // e.g. SCN-0001
  serial: number;
  status: ClientStatus;
  connectionDate: string;
  ipAddress: string;
  pppoeUsername: string;
  clientName: string;
  fatherName: string;
  address: string;
  area: string;
  boxNo: string;
  mobile: string;
  packageSpeed: string;
  monthlyFee: number;
  previousDue: number;
  currentMonthBill: number;
  paidThisMonth: number;
  lastPaymentDate?: string;
  lastPaymentCollector?: string;
  assignedCollectorId?: 'C1' | 'C2' | 'all';
  router: RouterConfig;
  kyc: ClientKYC;
}

export interface Collector {
  id: 'C1' | 'C2';
  name: string;
  phone: string;
  pin: string;
  avatar: string;
  areaAssigned: string;
}

export interface EditRequest {
  id: string;
  receiptId: string;
  clientId: string;
  clientName: string;
  collectorId: 'C1' | 'C2';
  collectorName: string;
  originalAmount: number;
  requestedAmount: number;
  reason: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminFeedback?: string;
  reviewedAt?: string;
}

export interface CollectionRecord {
  id: string; // Receipt No e.g. RCP-202611-001
  clientId: string;
  clientName: string;
  pppoeUsername: string;
  collectorId: 'C1' | 'C2';
  collectorName: string;
  amount: number;
  month: string; // e.g. "November 2026"
  date: string; // ISO string
  method: 'Cash' | 'bKash' | 'Nagad' | 'Bank';
  transactionId?: string;
  previousDueAtPayment: number;
  newDueRemaining: number;
  status: 'completed' | 'edit_requested' | 'edited';
  notes?: string;
}

export type UserRole = 'admin' | 'collector_1' | 'collector_2' | 'client';
