import React, { useState } from 'react';
import { Client, Collector, CollectionRecord, EditRequest } from '../types/isp';
import { SCNLogo } from './SCNLogo';
import {
  Users,
  Wifi,
  Ban,
  BadgeDollarSign,
  CheckCircle2,
  Clock,
  List,
  Plus,
  FileDown,
  Printer,
  Edit,
  Eye,
  BarChart3,
  Receipt,
  Zap,
  Star,
  User,
  Settings,
  FileSpreadsheet,
  ShieldCheck,
  FileEdit,
  Search,
  QrCode,
} from 'lucide-react';

interface AdminDashboardProps {
  clients: Client[];
  collectors: Collector[];
  collections: CollectionRecord[];
  editRequests: EditRequest[];
  currentMonth: string;
  onNavigateToExcel: () => void;
  onNavigateToPrint: () => void;
  onNavigateToCollector: (collectorId: 'C1' | 'C2') => void;
  onOpenEditModal: (receipt: CollectionRecord, request: EditRequest) => void;
  onAdvanceMonth: () => void;
  onResetData: () => void;
  onAddClient: () => void;
  onEditClient: (client: Client) => void;
  onViewClientKYC: (client: Client) => void;
  onToggleClientStatus: (client: Client) => void;
  onViewReceipt: (receipt: CollectionRecord) => void;
  onOpenGasModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  clients,
  collections,
  editRequests,
  currentMonth,
  onNavigateToExcel,
  onNavigateToPrint,
  onNavigateToCollector,
  onOpenEditModal,
  onAddClient,
  onEditClient,
  onViewClientKYC,
  onToggleClientStatus,
  onViewReceipt,
  onOpenGasModal,
}) => {
  const [tableSearch, setTableSearch] = useState('');

  const activeClients = clients.filter((c) => c.status === 'active');
  const inactiveClients = clients.filter((c) => c.status === 'inactive');

  const totalMonthlyBilled = activeClients.reduce((sum, c) => sum + c.monthlyFee, 0);
  const totalArrears = clients.reduce((sum, c) => sum + (c.previousDue || 0), 0);
  const totalExpectedRevenue = totalMonthlyBilled + totalArrears;

  const currentMonthCollections = collections.filter((c) => c.month === currentMonth);
  const totalCollectedSoFar = currentMonthCollections.reduce((sum, c) => sum + c.amount, 0);
  const totalPendingDue = Math.max(0, totalExpectedRevenue - totalCollectedSoFar);

  const c1Collections = currentMonthCollections.filter((c) => c.collectorId === 'C1');
  const c2Collections = currentMonthCollections.filter((c) => c.collectorId === 'C2');
  const c1Total = c1Collections.reduce((sum, c) => sum + c.amount, 0);
  const c2Total = c2Collections.reduce((sum, c) => sum + c.amount, 0);

  const pendingRequests = editRequests.filter((r) => r.status === 'pending');

  const filteredClients = clients.filter((c) => {
    if (!tableSearch.trim()) return true;
    const q = tableSearch.toLowerCase();
    return (
      c.clientName.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.pppoeUsername.toLowerCase().includes(q) ||
      c.mobile.includes(q) ||
      c.area.toLowerCase().includes(q)
    );
  });

  // Bar heights (percentage relative to totalExpectedRevenue)
  const maxVal = Math.max(totalExpectedRevenue, 1);
  const billBarPct = Math.max(12, Math.round((totalExpectedRevenue / maxVal) * 100));
  const colBarPct = Math.max(8, Math.round((totalCollectedSoFar / maxVal) * 100));
  const dueBarPct = Math.max(8, Math.round((totalPendingDue / maxVal) * 100));

  // Sample receipt to display in middle bottom card
  const sampleReceipt: CollectionRecord = collections[0] || {
    id: 'SCN-202611-000125',
    clientId: clients[0]?.id || 'SCN-0001',
    clientName: clients[0]?.clientName || 'শহিদুল হাসান',
    pppoeUsername: clients[0]?.pppoeUsername || 'sb-sahid',
    collectorId: 'C1',
    collectorName: 'Collector-1',
    amount: clients[0]?.monthlyFee || 900,
    month: currentMonth,
    date: new Date().toISOString(),
    method: 'Cash',
    previousDueAtPayment: clients[0]?.monthlyFee || 900,
    newDueRemaining: 0,
    status: 'completed',
  };

  return (
    <div className="p-4 sm:p-5 space-y-5 max-w-[1600px] mx-auto">
      {/* Pending Edit Request Alert Banner (Only when collectors request edits) */}
      {pendingRequests.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-amber-950 text-sm">
                {pendingRequests.length} টি বিল সংশোধন (Edit Request) অ্যাডমিন অনুমোদনের অপেক্ষায় রয়েছে
              </h3>
              <p className="text-xs text-amber-800">
                আবেদনকারী: {pendingRequests[0].collectorName} • গ্রাহক: {pendingRequests[0].clientName} (৳{pendingRequests[0].originalAmount} &rarr; ৳{pendingRequests[0].requestedAmount})
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const rec = collections.find((c) => c.id === pendingRequests[0].receiptId);
              if (rec) onOpenEditModal(rec, pendingRequests[0]);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow transition cursor-pointer shrink-0"
          >
            পর্যালোচনা ও অনুমোদন করুন
          </button>
        </div>
      )}

      {/* TOP 6 COLORFUL SOLID-GRADIENT KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* 1. Total Clients */}
        <div className="rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white p-4 shadow-lg shadow-blue-600/20 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-blue-100">Total Clients</div>
            <div className="text-2xl font-black leading-tight">{clients.length}</div>
            <div className="text-[10px] text-blue-100/90">মোট গ্রাহক</div>
          </div>
        </div>

        {/* 2. Online / Active Clients */}
        <div className="rounded-2xl bg-gradient-to-br from-[#16a34a] to-[#15803d] text-white p-4 shadow-lg shadow-green-600/20 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Wifi className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-green-100">Online Clients</div>
            <div className="text-2xl font-black leading-tight">{activeClients.length}</div>
            <div className="text-[10px] text-green-100/90">সচল লাইন (ON)</div>
          </div>
        </div>

        {/* 3. Offline / Inactive Clients */}
        <div className="rounded-2xl bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-white p-4 shadow-lg shadow-red-600/20 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Ban className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-red-100">Offline Clients</div>
            <div className="text-2xl font-black leading-tight">{inactiveClients.length}</div>
            <div className="text-[10px] text-red-100/90">বন্ধ লাইন (OFF)</div>
          </div>
        </div>

        {/* 4. This Month Bill */}
        <div className="rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] text-white p-4 shadow-lg shadow-purple-600/20 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <BadgeDollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-purple-100">This Month Bill</div>
            <div className="text-xl font-black leading-tight">৳{totalExpectedRevenue.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-purple-100/90">মাসিক + বকেয়া দাবি</div>
          </div>
        </div>

        {/* 5. Collected */}
        <div className="rounded-2xl bg-gradient-to-br from-[#10b981] to-[#047857] text-white p-4 shadow-lg shadow-emerald-600/20 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-emerald-100">Collected</div>
            <div className="text-xl font-black leading-tight">৳{totalCollectedSoFar.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-emerald-100/90">মোট আদায়</div>
          </div>
        </div>

        {/* 6. Due Amount */}
        <div className="rounded-2xl bg-gradient-to-br from-[#f97316] to-[#ea580c] text-white p-4 shadow-lg shadow-orange-600/20 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-orange-100">Due Amount</div>
            <div className="text-xl font-black leading-tight">৳{totalPendingDue.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-orange-100/90">বকেয়া বাকি</div>
          </div>
        </div>
      </div>

      {/* CLIENT LIST TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden">
        {/* Deep Blue Card Header */}
        <div className="bg-gradient-to-r from-[#0b3b8c] to-[#1354b8] text-white px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <List className="w-5 h-5 text-amber-300" />
            <h2 className="font-extrabold text-sm sm:text-base">Client List – {currentMonth}</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Inline quick search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="দ্রুত খুঁজুন..."
                className="bg-white text-slate-900 placeholder-slate-400 text-xs rounded-lg pl-8 pr-3 py-1.5 w-40 sm:w-52 focus:outline-none font-medium"
              />
            </div>

            <button
              onClick={onAddClient}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Client</span>
            </button>

            <button
              onClick={onNavigateToPrint}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow cursor-pointer transition"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Collection PDF</span>
            </button>

            <button
              onClick={onNavigateToPrint}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-bold border border-white/25 shadow cursor-pointer transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print List</span>
            </button>
          </div>
        </div>

        {/* Clean Crisp Spreadsheet Table */}
        <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
          <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
            <thead className="sticky top-0 z-10 bg-[#e8f0fe] text-[#092b6b] font-extrabold border-b border-blue-200">
              <tr className="divide-x divide-blue-100">
                <th className="py-2.5 px-3 text-center">SL</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3">Connection</th>
                <th className="py-2.5 px-3">IP / PPPoE</th>
                <th className="py-2.5 px-3">Client Name</th>
                <th className="py-2.5 px-3">Father's Name</th>
                <th className="py-2.5 px-3">Area / Village</th>
                <th className="py-2.5 px-3">Box / Para</th>
                <th className="py-2.5 px-3">Mobile</th>
                <th className="py-2.5 px-3 text-right">Package</th>
                <th className="py-2.5 px-3 text-right">Previous Due</th>
                <th className="py-2.5 px-3 text-right">Bill</th>
                <th className="py-2.5 px-3 text-right">Paid</th>
                <th className="py-2.5 px-3 text-right">Due</th>
                <th className="py-2.5 px-3 text-center">Collector</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {filteredClients.map((c, idx) => {
                const currentBill = c.status === 'active' ? c.monthlyFee : 0;
                const due = Math.max(0, (c.previousDue || 0) + currentBill - (c.paidThisMonth || 0));

                return (
                  <tr
                    key={c.id}
                    className={`divide-x divide-slate-100 transition ${
                      idx % 2 === 0 ? 'bg-white hover:bg-blue-50/60' : 'bg-[#f8fbff] hover:bg-blue-50/80'
                    }`}
                  >
                    <td className="py-2 px-3 text-center font-bold text-slate-600">{c.serial}</td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => onToggleClientStatus(c)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black text-white shadow-xs cursor-pointer transition ${
                          c.status === 'active' ? 'bg-[#16a34a] hover:bg-green-700' : 'bg-[#ef4444] hover:bg-red-700'
                        }`}
                        title="ক্লিক করে ON/OFF পরিবর্তন করুন"
                      >
                        {c.status === 'active' ? 'ON' : 'OFF'}
                      </button>
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-600">{c.connectionDate}</td>
                    <td className="py-2 px-3 font-mono font-bold text-[#0d47a1]">{c.pppoeUsername}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{c.clientName}</td>
                    <td className="py-2 px-3 text-slate-600">{c.fatherName}</td>
                    <td className="py-2 px-3">{c.area}</td>
                    <td className="py-2 px-3 text-slate-600">{c.boxNo}</td>
                    <td className="py-2 px-3 font-mono">{c.mobile}</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">৳{c.monthlyFee}</td>
                    <td className="py-2 px-3 text-right font-semibold text-amber-600">{c.previousDue || 0}</td>
                    <td className="py-2 px-3 text-right font-semibold">{currentBill}</td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-600">
                      {c.paidThisMonth > 0 ? c.paidThisMonth : '-'}
                    </td>
                    <td className="py-2 px-3 text-right font-black text-rose-600">{due}</td>
                    <td className="py-2 px-3 text-center font-bold text-slate-700">
                      {c.assignedCollectorId === 'C2' ? 'C-2' : 'C-1'}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onEditClient(c)}
                          className="p-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition"
                          title="এডিট করুন"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onViewClientKYC(c)}
                          className="p-1.5 rounded-md bg-rose-500 hover:bg-rose-600 text-white cursor-pointer transition"
                          title="KYC ও রাউটার দেখুন"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTTOM 3-COLUMN BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* COLUMN 1: Monthly Collection Summary + Collector Wise Cards (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-[#0b3b8c] to-[#1354b8] text-white px-4 py-2.5 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-300" />
            <h3 className="font-extrabold text-sm">Monthly Collection Summary</h3>
          </div>

          <div className="p-4 flex-1 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Bar Chart Area (7 cols) */}
            <div className="sm:col-span-7 flex flex-col justify-between h-full space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold text-slate-700">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Bill Amount
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Collected
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Due
                </span>
              </div>

              <div className="h-44 border-b-2 border-l-2 border-slate-300 px-3 pt-6 flex items-end justify-around gap-3 bg-slate-50/60 rounded-tr-xl">
                {/* Bill Bar */}
                <div className="flex flex-col items-center w-14 h-full justify-end">
                  <span className="text-[10px] font-extrabold text-slate-700 mb-1">৳{totalExpectedRevenue}</span>
                  <div
                    style={{ height: `${billBarPct}%` }}
                    className="w-full rounded-t-md bg-gradient-to-t from-blue-700 to-blue-500 shadow"
                  ></div>
                </div>

                {/* Collected Bar */}
                <div className="flex flex-col items-center w-14 h-full justify-end">
                  <span className="text-[10px] font-extrabold text-emerald-700 mb-1">৳{totalCollectedSoFar}</span>
                  <div
                    style={{ height: `${colBarPct}%` }}
                    className="w-full rounded-t-md bg-gradient-to-t from-emerald-700 to-emerald-500 shadow"
                  ></div>
                </div>

                {/* Due Bar */}
                <div className="flex flex-col items-center w-14 h-full justify-end">
                  <span className="text-[10px] font-extrabold text-rose-700 mb-1">৳{totalPendingDue}</span>
                  <div
                    style={{ height: `${dueBarPct}%` }}
                    className="w-full rounded-t-md bg-gradient-to-t from-rose-700 to-rose-500 shadow"
                  ></div>
                </div>
              </div>

              <div className="text-center text-xs font-bold text-slate-600">This Month ({currentMonth})</div>
            </div>

            {/* Collector Wise Collection Cards (5 cols) */}
            <div className="sm:col-span-5 space-y-3">
              <div className="text-xs font-extrabold text-[#092b6b] text-center">Collector Wise Collection</div>

              <div
                onClick={() => onNavigateToCollector('C1')}
                className="p-3 rounded-xl bg-[#eff6ff] border border-blue-200 hover:border-blue-400 transition cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0d47a1] text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#092b6b]">Collector-1</div>
                    <div className="text-base font-black text-[#1d4ed8]">৳ {c1Total.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => onNavigateToCollector('C2')}
                className="p-3 rounded-xl bg-[#ecfdf5] border border-emerald-200 hover:border-emerald-400 transition cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#15803d] text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-emerald-900">Collector-2</div>
                    <div className="text-base font-black text-[#15803d]">৳ {c2Total.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Payment Receipt Sample Live Preview (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-[#0b3b8c] to-[#1354b8] text-white px-4 py-2.5 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-300" />
            <h3 className="font-extrabold text-sm">Payment Receipt (Sample)</h3>
          </div>

          <div
            onClick={() => onViewReceipt(sampleReceipt)}
            className="p-3.5 flex-1 flex flex-col justify-between bg-gradient-to-b from-sky-50 to-white cursor-pointer group hover:bg-blue-50/40 transition"
            title="ক্লিক করে সম্পূর্ণ রশিদ প্রিন্ট বা QR দেখুন"
          >
            <div className="space-y-2.5">
              <div className="flex justify-center">
                <SCNLogo variant="receipt" size="sm" showTagline={false} />
              </div>

              <div className="bg-[#092b6b] text-white text-center font-black italic text-[11px] py-1 rounded-full shadow-xs tracking-wider">
                PAYMENT RECEIPT
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-600 font-semibold border-b border-slate-200 pb-1.5">
                <span>No: {sampleReceipt.id}</span>
                <span>{new Date(sampleReceipt.date).toLocaleDateString('en-GB')}</span>
              </div>

              <div className="flex items-center justify-between gap-2 text-[11px]">
                <div className="space-y-0.5 text-slate-700 min-w-0">
                  <div className="truncate">
                    <span className="font-bold text-[#092b6b]">ID:</span> {sampleReceipt.clientId}
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-[#092b6b]">Name:</span> {sampleReceipt.clientName}
                  </div>
                  <div className="truncate font-mono text-[#0d47a1]">
                    <span className="font-bold text-[#092b6b]">PPPoE:</span> {sampleReceipt.pppoeUsername}
                  </div>
                </div>
                <div className="p-1.5 bg-white border border-slate-300 rounded-lg shrink-0 text-[#092b6b]">
                  <QrCode className="w-10 h-10" />
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden text-[11px]">
                <div className="bg-[#e8f0fe] px-2.5 py-1 font-bold text-[#092b6b] flex justify-between">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="px-2.5 py-1 flex justify-between border-t border-slate-100">
                  <span>Monthly Bill</span>
                  <span className="font-bold">৳ {sampleReceipt.amount}</span>
                </div>
                <div className="bg-emerald-50 px-2.5 py-1 flex justify-between border-t border-emerald-200 font-black text-emerald-700">
                  <span>Paid</span>
                  <span>৳ {sampleReceipt.amount}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 text-center text-[11px] font-bold text-[#0d47a1] group-hover:underline">
              সম্পূর্ণ QR রশিদ ও প্রিন্ট দেখুন &rarr;
            </div>
          </div>
        </div>

        {/* COLUMN 3: Quick Actions + System Highlights (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0b3b8c] to-[#1354b8] text-white px-4 py-2.5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-300" />
              <h3 className="font-extrabold text-sm">Quick Actions</h3>
            </div>

            <div className="p-3.5 grid grid-cols-4 gap-2.5 text-center">
              <button
                onClick={onNavigateToPrint}
                className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 hover:brightness-110 text-white shadow flex flex-col items-center justify-center gap-1.5 cursor-pointer transition"
              >
                <Printer className="w-5 h-5" />
                <span className="text-[10px] font-bold leading-tight">Generate PDF</span>
              </button>

              <button
                onClick={() => onNavigateToCollector('C1')}
                className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 hover:brightness-110 text-white shadow flex flex-col items-center justify-center gap-1.5 cursor-pointer transition"
              >
                <Receipt className="w-5 h-5" />
                <span className="text-[10px] font-bold leading-tight">Payment Entry</span>
              </button>

              <button
                onClick={onNavigateToExcel}
                className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 hover:brightness-110 text-white shadow flex flex-col items-center justify-center gap-1.5 cursor-pointer transition"
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span className="text-[10px] font-bold leading-tight">Excel & KYC</span>
              </button>

              <button
                onClick={onOpenGasModal}
                className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 hover:brightness-110 text-white shadow flex flex-col items-center justify-center gap-1.5 cursor-pointer transition"
              >
                <Settings className="w-5 h-5" />
                <span className="text-[10px] font-bold leading-tight">Sheet Script</span>
              </button>
            </div>
          </div>

          {/* System Highlights Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0b3b8c] to-[#1354b8] text-white px-4 py-2.5 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-300" />
              <h3 className="font-extrabold text-sm">System Highlights</h3>
            </div>

            <div className="p-4 flex items-center justify-between gap-2 relative">
              <ul className="space-y-1.5 text-[11px] font-semibold text-slate-700">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Automatic Bill Generation for ON Clients</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Same Client – Only One Collection / Month</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Collector Wise Report & Total Collection</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Router Remote Access & Passwordless Login</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Google Sheet & Apps Script Ready</span>
                </li>
              </ul>

              <div className="hidden sm:flex flex-col items-center justify-center text-center px-3 py-2 rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#0b3b8c] text-white shadow-md shrink-0 border-2 border-emerald-400">
                <span className="font-black italic text-sm leading-none">SCN</span>
                <span className="text-[8px] font-bold text-amber-300 mt-0.5 leading-tight">
                  Connecting Shilok
                  <br />
                  with the World
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
