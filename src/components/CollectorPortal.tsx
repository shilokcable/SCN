import React, { useState } from 'react';
import { Client, Collector, CollectionRecord, EditRequest } from '../types/isp';
import { recordCollection, getClientMonthlyCollection } from '../utils/storage';
import { SCNLogo } from './SCNLogo';
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Receipt,
  ShieldAlert,
  DollarSign,
  Wallet,
  History,
  Clock,
  FileEdit,
} from 'lucide-react';

interface CollectorPortalProps {
  currentCollector: Collector;
  otherCollector: Collector;
  clients: Client[];
  collections: CollectionRecord[];
  editRequests: EditRequest[];
  currentMonth: string;
  onCollectionSuccess: (receipt: CollectionRecord) => void;
  onRequestEdit: (record: CollectionRecord) => void;
  onSwitchCollector: (id: 'C1' | 'C2') => void;
}

export const CollectorPortal: React.FC<CollectorPortalProps> = ({
  currentCollector,
  otherCollector,
  clients,
  collections,
  editRequests,
  currentMonth,
  onCollectionSuccess,
  onRequestEdit,
  onSwitchCollector,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [amountInput, setAmountInput] = useState<string>('');
  const [method, setMethod] = useState<'Cash' | 'bKash' | 'Nagad'>('Cash');
  const [trxId, setTrxId] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'collect' | 'history'>('collect');

  const searchResults =
    searchQuery.trim() === ''
      ? []
      : clients.filter(
          (c) =>
            c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.pppoeUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.mobile.includes(searchQuery)
        );

  const myMonthlyCollections = collections.filter(
    (c) => c.collectorId === currentCollector.id && c.month === currentMonth
  );

  const todayStr = new Date().toISOString().slice(0, 10);
  const myTodayCollections = myMonthlyCollections.filter((c) => c.date.startsWith(todayStr));

  const totalTodayAmount = myTodayCollections.reduce((sum, c) => sum + c.amount, 0);
  const totalMonthAmount = myMonthlyCollections.reduce((sum, c) => sum + c.amount, 0);

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setErrorMsg('');
    setSuccessMsg('');

    const existingCollection = getClientMonthlyCollection(client.id, currentMonth);
    if (existingCollection) {
      setErrorMsg(
        `সতর্কবার্তা: ${client.clientName}-এর এই মাসের বিল ইতিমধ্যে ${existingCollection.collectorName} দ্বারা সংগ্রহ করা হয়েছে (রিসিপ্ট: ${existingCollection.id})। পুনরায় এন্ট্রি নেওয়া যাবে না।`
      );
      setAmountInput('');
    } else {
      const due =
        (client.previousDue || 0) +
        (client.status === 'active' ? client.monthlyFee : 0) -
        (client.paidThisMonth || 0);
      setAmountInput(due > 0 ? due.toString() : client.monthlyFee.toString());
    }
  };

  const handleCollectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) {
      setErrorMsg('অনুগ্রহ করে গ্রাহক নির্বাচন করুন');
      return;
    }

    const amount = Number(amountInput);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg('সঠিক টাকার পরিমাণ দিন (ন্যূনতম ১ টাকা)');
      return;
    }

    const existing = getClientMonthlyCollection(selectedClient.id, currentMonth);
    if (existing) {
      setErrorMsg(`এই গ্রাহকের চলতি মাসের বিল ইতিমধ্যে সংগৃহীত (কালেক্টর: ${existing.collectorName})!`);
      return;
    }

    const res = recordCollection({
      clientId: selectedClient.id,
      collectorId: currentCollector.id,
      collectorName: currentCollector.name,
      amount,
      month: currentMonth,
      method,
      transactionId: trxId.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    if (res.success && res.receipt) {
      setSuccessMsg(`বিল সফলভাবে জমা হয়েছে! মোট ৳${amount}`);
      onCollectionSuccess(res.receipt);
      setSelectedClient(null);
      setSearchQuery('');
      setAmountInput('');
      setTrxId('');
      setNotes('');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-5 space-y-5">
      {/* Collector Header Card */}
      <div className="bg-gradient-to-r from-[#0b3b8c] via-[#1354b8] to-[#082d6f] text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-blue-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentCollector.avatar}
                alt={currentCollector.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-300 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-400 text-[#092b6b] font-black text-[10px]">
                {currentCollector.id}
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{currentCollector.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-bold">
                  Collector Mode
                </span>
              </div>
              <p className="text-xs text-sky-100 mt-1">
                ফোন: {currentCollector.phone} • এলাকা: {currentCollector.areaAssigned}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSwitchCollector(otherCollector.id)}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold transition cursor-pointer"
            >
              Switch: {otherCollector.name.split(' ')[0]} ({otherCollector.id})
            </button>
            <div className="px-3.5 py-1.5 rounded-xl bg-white text-[#092b6b] text-xs font-extrabold">
              মাস: {currentMonth}
            </div>
          </div>
        </div>

        {/* Collector Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-white/15">
          <div className="bg-white/10 p-3.5 rounded-xl border border-white/15">
            <span className="text-xs text-sky-100 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              আজকের মোট জমা (Today)
            </span>
            <div className="text-2xl font-black text-white mt-1">৳ {totalTodayAmount.toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-sky-200">{myTodayCollections.length} টি রিসিট</span>
          </div>

          <div className="bg-white/10 p-3.5 rounded-xl border border-white/15">
            <span className="text-xs text-sky-100 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-300" />
              চলতি মাসের মোট সংগ্রহ
            </span>
            <div className="text-2xl font-black text-emerald-300 mt-1">৳ {totalMonthAmount.toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-sky-200">{myMonthlyCollections.length} টি পেমেন্ট</span>
          </div>

          <div className="bg-white/10 p-3.5 rounded-xl border border-white/15">
            <span className="text-xs text-sky-100 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
              এডিট রিকোয়েস্ট স্ট্যাটাস
            </span>
            <div className="text-base font-bold text-amber-300 mt-1">
              {editRequests.filter((r) => r.collectorId === currentCollector.id && r.status === 'pending').length} টি অপেক্ষমাণ
            </div>
            <span className="text-[10px] text-sky-200">অ্যাডমিন অনুমোদন দিলে এডিট হবে</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('collect')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-xs ${
            activeTab === 'collect'
              ? 'bg-[#0b3b8c] text-white'
              : 'bg-white text-slate-700 border border-blue-200 hover:bg-blue-50'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>বিল কালেকশন ফরম</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-xs ${
            activeTab === 'history'
              ? 'bg-[#0b3b8c] text-white'
              : 'bg-white text-slate-700 border border-blue-200 hover:bg-blue-50'
          }`}
        >
          <History className="w-4 h-4" />
          <span>আমার কালেকশন ইতিহাস ({myMonthlyCollections.length})</span>
        </button>
      </div>

      {activeTab === 'collect' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Client Search */}
          <div className="lg:col-span-5 bg-white border border-blue-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-[#0b3b8c] text-white px-4 py-3 font-bold text-xs uppercase tracking-wider">
              ১. গ্রাহক খুঁজুন (ID, নাম, PPPoE বা মোবাইল)
            </div>
            <div className="p-4 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="যেমন: জামাল, SCN-0001, sb-jamalNT..."
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {searchResults.length > 0 ? (
                  searchResults.map((client) => {
                    const isCollected = getClientMonthlyCollection(client.id, currentMonth);
                    const isSelected = selectedClient?.id === client.id;
                    const totalDue =
                      (client.previousDue || 0) +
                      (client.status === 'active' ? client.monthlyFee : 0) -
                      (client.paidThisMonth || 0);

                    return (
                      <div
                        key={client.id}
                        onClick={() => handleSelectClient(client)}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-200'
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{client.clientName}</span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded text-white ${
                                client.status === 'active' ? 'bg-emerald-600' : 'bg-rose-600'
                              }`}
                            >
                              {client.status === 'active' ? 'ON' : 'OFF'}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#0d47a1] font-mono font-bold mt-0.5">
                            {client.id} • {client.pppoeUsername}
                          </div>
                          <div className="text-[10px] text-slate-500">{client.address}</div>
                        </div>

                        <div className="text-right">
                          {isCollected ? (
                            <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                              পরিশোধিত
                            </span>
                          ) : (
                            <div>
                              <span className="text-[10px] text-slate-500 block">বকেয়া</span>
                              <span className="text-sm font-black text-rose-600">৳{totalDue}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : searchQuery.trim() !== '' ? (
                  <div className="text-center py-8 text-slate-500 text-xs">কোন গ্রাহক পাওয়া যায়নি।</div>
                ) : (
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-dashed border-blue-200 text-center space-y-2">
                    <p className="text-xs text-slate-600">দ্রুত সিলেক্ট করতে নিচের যেকোনো নামে ক্লিক করুন:</p>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {clients.slice(0, 5).map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleSelectClient(c)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 hover:bg-blue-600 hover:text-white text-xs font-bold text-[#092b6b] transition cursor-pointer"
                        >
                          {c.clientName.split(' ')[0]} ({c.id})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Collection Form */}
          <div className="lg:col-span-7 bg-white border border-blue-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-[#0b3b8c] text-white px-5 py-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold">২. বিল পেমেন্ট এন্ট্রি</h2>
                <p className="text-[11px] text-sky-200">গ্রাহক নির্বাচন করে টাকার অংক দিয়ে জমা করুন</p>
              </div>
              <SCNLogo variant="minimal" size="sm" showTagline={false} />
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
                  <div>
                    <strong className="block">জমা করা সম্ভব নয়:</strong>
                    <span>{errorMsg}</span>
                  </div>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2.5 font-bold">
                  <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {selectedClient ? (
                <form onSubmit={handleCollectSubmit} className="space-y-4">
                  <div className="bg-[#eff6ff] rounded-xl p-4 border border-blue-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-extrabold text-[#0d47a1]">Selected Client</span>
                        <h3 className="text-base font-black text-slate-900">{selectedClient.clientName}</h3>
                        <div className="text-xs text-slate-600 font-mono">
                          {selectedClient.id} • {selectedClient.pppoeUsername} • {selectedClient.mobile}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black text-white ${
                          selectedClient.status === 'active' ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}
                      >
                        {selectedClient.status === 'active' ? 'ON' : 'OFF'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-200 text-xs">
                      <div>
                        <span className="text-slate-500 block">মাসিক ফি</span>
                        <span className="font-bold text-slate-900">৳{selectedClient.monthlyFee}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">পূর্ব বকেয়া</span>
                        <span className="font-bold text-amber-600">৳{selectedClient.previousDue || 0}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">বর্তমান মোট বাকি</span>
                        <span className="font-black text-rose-600">
                          ৳
                          {(selectedClient.previousDue || 0) +
                            (selectedClient.status === 'active' ? selectedClient.monthlyFee : 0) -
                            (selectedClient.paidThisMonth || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">জমার পরিমাণ (Amount) *</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold">৳</span>
                        <input
                          type="number"
                          value={amountInput}
                          onChange={(e) => setAmountInput(e.target.value)}
                          className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl pl-8 pr-4 py-2 text-base font-black text-slate-900 focus:outline-none focus:border-blue-600"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">পেমেন্ট মাধ্যম</label>
                      <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value as 'Cash' | 'bKash' | 'Nagad')}
                        className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                      >
                        <option value="Cash">ক্যাশ নগদ (Cash)</option>
                        <option value="bKash">বিকাশ (bKash)</option>
                        <option value="Nagad">নগদ (Nagad)</option>
                      </select>
                    </div>
                  </div>

                  {method !== 'Cash' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ট্রানজেকশন আইডি (TrxID)</label>
                      <input
                        type="text"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder="যেমন: BK9X87214"
                        className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">মন্তব্য (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="যেমন: দোকান থেকে নগদ আদায়"
                      className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#16a34a] to-[#059669] hover:brightness-110 text-white font-black text-sm shadow-lg transition cursor-pointer"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>বিল জমা নিশ্চিত করুন ও QR রশিদ দেখুন</span>
                  </button>
                </form>
              ) : (
                <div className="py-14 text-center text-slate-500 space-y-2">
                  <Search className="w-8 h-8 mx-auto text-blue-400" />
                  <h4 className="font-bold text-slate-700 text-sm">কোন গ্রাহক নির্বাচিত নেই</h4>
                  <p className="text-xs text-slate-500">বাম পাশ থেকে গ্রাহক সিলেক্ট করুন।</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white border border-blue-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-[#0b3b8c] text-white px-5 py-3 flex items-center justify-between">
            <h2 className="text-sm font-bold">
              {currentCollector.name}-এর কালেকশন ইতিহাস ({myMonthlyCollections.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#e8f0fe] text-[#092b6b] font-bold border-b border-blue-200">
                <tr>
                  <th className="py-3 px-4">রশিদ নং</th>
                  <th className="py-3 px-4">গ্রাহক</th>
                  <th className="py-3 px-4">তারিখ</th>
                  <th className="py-3 px-4">মাধ্যম</th>
                  <th className="py-3 px-4 text-right">টাকা</th>
                  <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {myMonthlyCollections.map((rec) => {
                  const hasEditReq = editRequests.find((r) => r.receiptId === rec.id);
                  return (
                    <tr key={rec.id} className="hover:bg-blue-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-[#0d47a1]">{rec.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{rec.clientName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {rec.pppoeUsername} ({rec.clientId})
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{new Date(rec.date).toLocaleDateString('en-GB')}</td>
                      <td className="py-3 px-4 font-semibold">{rec.method}</td>
                      <td className="py-3 px-4 text-right font-black text-emerald-700">৳{rec.amount}</td>
                      <td className="py-3 px-4 text-center">
                        {hasEditReq ? (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
                            {hasEditReq.status === 'pending'
                              ? 'অপেক্ষমাণ'
                              : hasEditReq.status === 'approved'
                              ? 'অনুমোদিত'
                              : 'বাতিল'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            সম্পন্ন
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onCollectionSuccess(rec)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                          >
                            স্লিপ দেখুন
                          </button>
                          <button
                            onClick={() => onRequestEdit(rec)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold border border-amber-300 cursor-pointer"
                          >
                            <FileEdit className="w-3 h-3" />
                            <span>এডিট রিকোয়েস্ট</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {myMonthlyCollections.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-xs">চলতি মাসে কোন বিল জমার তথ্য নেই।</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
