import React, { useState } from 'react';
import { Client, ClientStatus } from '../types/isp';
import {
  Search,
  Download,
  Plus,
  ExternalLink,
  Edit,
  Eye,
  ArrowUpDown,
  Shield,
  CheckCircle,
  FileSpreadsheet,
  Router,
  RefreshCw,
} from 'lucide-react';

interface ExcelSheetViewProps {
  clients: Client[];
  currentMonth: string;
  onUpdateClient: (updated: Client) => void;
  onAddClient: () => void;
  onEditClient: (client: Client) => void;
  onViewClientKYC: (client: Client) => void;
  onAdvanceMonth: () => void;
}

export const ExcelSheetView: React.FC<ExcelSheetViewProps> = ({
  clients,
  currentMonth,
  onUpdateClient,
  onAddClient,
  onEditClient,
  onViewClientKYC,
  onAdvanceMonth,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterArea, setFilterArea] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Client>('serial');
  const [sortAsc, setSortAsc] = useState(true);

  const areas = Array.from(new Set(clients.map((c) => c.area))).filter(Boolean);

  const filtered = clients.filter((c) => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (filterArea !== 'all' && c.area !== filterArea) return false;

    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return (
        c.clientName.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.pppoeUsername.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.ipAddress.includes(q) ||
        c.fatherName.toLowerCase().includes(q) ||
        c.boxNo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'string') {
      return sortAsc
        ? (aVal as string).localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal as string);
    }
    if (typeof aVal === 'number') {
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    }
    return 0;
  });

  const toggleSort = (field: keyof Client) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleToggleStatus = (client: Client) => {
    const newStatus: ClientStatus = client.status === 'active' ? 'inactive' : 'active';
    const updated: Client = {
      ...client,
      status: newStatus,
      currentMonthBill: newStatus === 'active' ? client.monthlyFee : 0,
    };
    onUpdateClient(updated);
  };

  const handleExportCSV = () => {
    const headers = [
      'Serial', 'Client ID', 'Status', 'Client Name', "Father's Name", 'Mobile',
      'Area', 'Address', 'Box No', 'IP Address', 'PPPoE Username',
      'Connection Date', 'Package', 'Monthly Fee', 'Previous Due', 'Paid This Month',
      'Total Due', 'Router Model', 'Router IP', 'Router Pass', 'NID Number', 'Emergency Contact',
    ];

    const rows = sorted.map((c) => [
      c.serial,
      `"${c.id}"`,
      c.status === 'active' ? 'ACTIVE (ON)' : 'INACTIVE (OFF)',
      `"${c.clientName}"`,
      `"${c.fatherName}"`,
      `"${c.mobile}"`,
      `"${c.area}"`,
      `"${c.address.replace(/"/g, '""')}"`,
      `"${c.boxNo}"`,
      `"${c.ipAddress}"`,
      `"${c.pppoeUsername}"`,
      c.connectionDate,
      `"${c.packageSpeed}"`,
      c.monthlyFee,
      c.previousDue || 0,
      c.paidThisMonth || 0,
      (c.previousDue || 0) + (c.status === 'active' ? c.monthlyFee : 0) - (c.paidThisMonth || 0),
      `"${c.router?.model || ''}"`,
      `"${c.router?.ip || ''}"`,
      `"${c.router?.password || ''}"`,
      `"${c.kyc?.nidNumber || ''}"`,
      `"${c.kyc?.emergencyContact || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SCN_Shilok_Clients_KYC_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalMonthlyBilling = clients.reduce((sum, c) => sum + (c.status === 'active' ? c.monthlyFee : 0), 0);
  const totalArrears = clients.reduce((sum, c) => sum + (c.previousDue || 0), 0);
  const totalCollectedSoFar = clients.reduce((sum, c) => sum + (c.paidThisMonth || 0), 0);
  const totalPendingBalance = Math.max(0, totalMonthlyBilling + totalArrears - totalCollectedSoFar);

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-5 space-y-5">
      {/* Header Control Card */}
      <div className="bg-white border border-blue-200 rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#0b3b8c] to-[#1354b8] text-white px-5 py-3.5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-amber-300" />
            <div>
              <h1 className="text-base sm:text-lg font-extrabold">মডার্ন এক্সেল ক্লায়েন্ট ডেটাবেজ ও ফুল KYC শিট</h1>
              <p className="text-[11px] text-sky-100">সকল গ্রাহকের তথ্য, ON/OFF স্ট্যাটাস, প্যাকেজ মূল্য, বকেয়া ও রাউটার ক্রেডেনশিয়াল</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onAdvanceMonth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#092b6b] font-extrabold text-xs shadow cursor-pointer transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>পরবর্তী মাস রোলওভার ({currentMonth})</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow cursor-pointer transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Excel / CSV এক্সপোর্ট</span>
            </button>

            <button
              onClick={onAddClient}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-sky-50 text-[#092b6b] font-extrabold text-xs shadow cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন ক্লায়েন্ট</span>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Colorful Metric Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[11px] font-bold text-blue-700 block">মোট ক্লায়েন্ট</span>
              <span className="text-lg font-black text-[#092b6b]">{clients.length} জন</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-700 block">সক্রিয় (ON)</span>
              <span className="text-lg font-black text-emerald-700">{clients.filter((c) => c.status === 'active').length} জন</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-[11px] font-bold text-rose-700 block">বন্ধ (OFF)</span>
              <span className="text-lg font-black text-rose-700">{clients.filter((c) => c.status === 'inactive').length} জন</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <span className="text-[11px] font-bold text-purple-700 block">মাসিক বিল দাবি</span>
              <span className="text-lg font-black text-purple-800">৳{totalMonthlyBilling.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
              <span className="text-[11px] font-bold text-teal-700 block">মোট আদায়</span>
              <span className="text-lg font-black text-teal-700">৳{totalCollectedSoFar.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
              <span className="text-[11px] font-bold text-orange-700 block">মোট বকেয়া বাকি</span>
              <span className="text-lg font-black text-orange-700">৳{totalPendingBalance.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="নাম, মোবাইল, PPPoE, আইপি, বক্স নং বা ঠিকানা দিয়ে খুঁজুন..."
                className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="all">সব স্ট্যাটাস (All Status)</option>
              <option value="active">শুধুমাত্র সক্রিয় (ON)</option>
              <option value="inactive">শুধুমাত্র বন্ধ (OFF)</option>
            </select>

            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="all">সব এলাকা ({areas.length} টি)</option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="bg-white border border-blue-200 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto max-h-[650px] overflow-y-auto">
          <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
            <thead className="sticky top-0 z-20 bg-[#0b3b8c] text-white font-bold shadow">
              <tr className="divide-x divide-blue-800">
                <th className="py-3 px-3 text-center cursor-pointer hover:bg-blue-900 w-12" onClick={() => toggleSort('serial')}>
                  <div className="flex items-center justify-center gap-1">
                    <span>SL</span>
                    <ArrowUpDown className="w-3 h-3 text-sky-300" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:bg-blue-900" onClick={() => toggleSort('id')}>
                  <div className="flex items-center gap-1">
                    <span>Client ID</span>
                    <ArrowUpDown className="w-3 h-3 text-sky-300" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 cursor-pointer hover:bg-blue-900" onClick={() => toggleSort('clientName')}>
                  <div className="flex items-center gap-1">
                    <span>Client & Father Name</span>
                    <ArrowUpDown className="w-3 h-3 text-sky-300" />
                  </div>
                </th>
                <th className="py-3 px-3">Mobile</th>
                <th className="py-3 px-3">Area & Box</th>
                <th className="py-3 px-3">PPPoE</th>
                <th className="py-3 px-3">IP Address</th>
                <th className="py-3 px-3">Package</th>
                <th className="py-3 px-3 text-right cursor-pointer hover:bg-blue-900" onClick={() => toggleSort('monthlyFee')}>
                  Fee
                </th>
                <th className="py-3 px-3 text-right">Prev Due</th>
                <th className="py-3 px-3 text-right">Paid</th>
                <th className="py-3 px-3 text-right bg-[#092b6b]">Total Due</th>
                <th className="py-3 px-3">Router Remote Access</th>
                <th className="py-3 px-3 text-center">KYC</th>
                <th className="py-3 px-3 text-center sticky right-0 bg-[#0b3b8c] z-10">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {sorted.map((client, idx) => {
                const totalDue =
                  (client.previousDue || 0) +
                  (client.status === 'active' ? client.monthlyFee : 0) -
                  (client.paidThisMonth || 0);

                return (
                  <tr
                    key={client.id}
                    className={`divide-x divide-slate-100 transition ${
                      client.status === 'inactive'
                        ? 'bg-rose-50/70'
                        : idx % 2 === 0
                        ? 'bg-white hover:bg-blue-50/60'
                        : 'bg-[#f8fbff] hover:bg-blue-50/80'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center font-bold text-slate-500">{client.serial}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0d47a1]">{client.id}</td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => handleToggleStatus(client)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black text-white shadow-xs transition cursor-pointer ${
                          client.status === 'active' ? 'bg-[#16a34a] hover:bg-green-700' : 'bg-[#ef4444] hover:bg-red-700'
                        }`}
                      >
                        <span>{client.status === 'active' ? 'ON' : 'OFF'}</span>
                      </button>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={client.kyc.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                          alt={client.clientName}
                          className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{client.clientName}</div>
                          <div className="text-[10px] text-slate-500">পিতা: {client.fatherName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{client.mobile}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{client.area}</div>
                      <span className="px-1.5 py-0.2 bg-blue-100 text-[#092b6b] rounded text-[10px] font-mono font-bold">
                        {client.boxNo}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0d47a1]">{client.pppoeUsername}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{client.ipAddress}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-semibold">
                        {client.packageSpeed}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">৳{client.monthlyFee}</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-amber-600">
                      {client.previousDue > 0 ? `৳${client.previousDue}` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                      {client.paidThisMonth > 0 ? `৳${client.paidThisMonth}` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right bg-slate-50">
                      {totalDue > 0 ? (
                        <span className="font-black text-rose-600 text-sm">৳{totalDue}</span>
                      ) : (
                        <span className="text-emerald-600 font-bold text-xs inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Paid
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={client.router.ip.startsWith('http') ? client.router.ip : `http://${client.router.ip}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-[#0d47a1] font-mono text-[11px] border border-blue-200 transition"
                        >
                          <Router className="w-3 h-3" />
                          <span>{client.router.ip}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                        <span className="text-[10px] text-slate-500 font-mono truncate max-w-[70px]">
                          {client.router.password}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onViewClientKYC(client)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-[#092b6b] text-[11px] font-bold border border-blue-200 cursor-pointer"
                      >
                        <Shield className="w-3 h-3 text-blue-600" />
                        <span>{client.kyc.nidNumber ? 'NID ✓' : 'View'}</span>
                      </button>
                    </td>
                    <td className="py-2.5 px-3 text-center sticky right-0 bg-white z-10 shadow-sm">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onEditClient(client)}
                          className="p-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                          title="সম্পাদনা"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onViewClientKYC(client)}
                          className="p-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                          title="বিস্তারিত"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {sorted.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-xs">কোন গ্রাহক মেলেনি।</div>
        )}
      </div>
    </div>
  );
};
