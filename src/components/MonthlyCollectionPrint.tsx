import React, { useState } from 'react';
import { Client, Collector } from '../types/isp';
import { SCNLogo } from './SCNLogo';
import { Printer, ArrowLeft } from 'lucide-react';

interface MonthlyCollectionPrintProps {
  clients: Client[];
  collectors: Collector[];
  currentMonth: string;
  onBack: () => void;
}

export const MonthlyCollectionPrint: React.FC<MonthlyCollectionPrintProps> = ({
  clients,
  collectors,
  currentMonth,
  onBack,
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedCollector, setSelectedCollector] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const areas = Array.from(new Set(clients.map((c) => c.area))).filter(Boolean);

  const filteredClients = clients.filter((c) => {
    if (selectedArea !== 'all' && c.area !== selectedArea) return false;
    if (selectedCollector !== 'all' && c.assignedCollectorId !== selectedCollector) return false;
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    return true;
  });

  const totalClients = filteredClients.length;
  const activeCount = filteredClients.filter((c) => c.status === 'active').length;
  const totalExpected = filteredClients.reduce(
    (acc, c) => acc + (c.status === 'active' ? c.monthlyFee : 0) + (c.previousDue || 0),
    0
  );
  const totalCollected = filteredClients.reduce((acc, c) => acc + (c.paidThisMonth || 0), 0);
  const remainingBalance = Math.max(0, totalExpected - totalCollected);

  return (
    <div className="p-4 sm:p-6 pb-20 max-w-7xl mx-auto space-y-5">
      {/* Top Controls Toolbar (Hidden in print) */}
      <div className="no-print bg-white border border-blue-200 rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-[#0b3b8c] to-[#1354b8] text-white px-5 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
              title="ফিরে যান"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
                <span>মাসিক কালেকশন শিট (Print & Field Collection)</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-[#092b6b] font-black">
                  {currentMonth}
                </span>
              </h2>
              <p className="text-xs text-sky-100">
                ফিল্ডে বিল সংগ্রহ ও অফিসে রেকর্ডের জন্য A4 পেপারে প্রিন্ট বা PDF সেভ করুন।
              </p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs shadow transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট / PDF সেভ করুন</span>
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f8fbff]">
          <div>
            <label className="block text-[11px] font-bold text-[#092b6b] mb-1">এলাকা ফিল্টার</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-semibold"
            >
              <option value="all">সব এলাকা ({areas.length} টি)</option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#092b6b] mb-1">কালেক্টর ফিল্টার</label>
            <select
              value={selectedCollector}
              onChange={(e) => setSelectedCollector(e.target.value)}
              className="w-full bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-semibold"
            >
              <option value="all">উভয় কালেক্টর (All)</option>
              {collectors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#092b6b] mb-1">সংযোগ স্ট্যাটাস</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-semibold"
            >
              <option value="all">সকল গ্রাহক</option>
              <option value="active">শুধুমাত্র সক্রিয় (ON)</option>
              <option value="inactive">বন্ধ লাইন (OFF)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Printable A4 Sheet */}
      <div className="print-container bg-white text-slate-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-blue-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b-2 border-[#092b6b] gap-4">
          <div>
            <SCNLogo variant="receipt" size="md" />
            <div className="text-[11px] text-slate-600 mt-1">
              Jabed Telecom, School Market, Shilok Bazer, Ranguniya, Chattagram • Hotline: 01815528967, 01819-876543
            </div>
          </div>

          <div className="text-left sm:text-right">
            <h1 className="text-xl font-black text-[#092b6b]">মাসিক ফিল্ড বিল কালেকশন শিট</h1>
            <div className="text-sm font-bold text-[#0d47a1] mt-0.5">বিলের মাস: {currentMonth}</div>
            <div className="text-xs text-slate-500 mt-0.5">প্রিন্ট তারিখ: {new Date().toLocaleDateString('en-GB')}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-3 bg-[#eff6ff] border border-blue-200 rounded-xl text-xs">
          <div>
            <span className="text-slate-600 block">মোট গ্রাহক সংখ্যা:</span>
            <span className="text-base font-black text-[#092b6b]">
              {totalClients} জন (সক্রিয় {activeCount})
            </span>
          </div>
          <div>
            <span className="text-slate-600 block">মোট দাবি (বকেয়াসহ):</span>
            <span className="text-base font-black text-slate-900">৳ {totalExpected.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-slate-600 block">সংগৃহীত জমা:</span>
            <span className="text-base font-black text-emerald-700">৳ {totalCollected.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-slate-600 block">অবশিষ্ট কালেকশন বাকি:</span>
            <span className="text-base font-black text-rose-700">৳ {remainingBalance.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-[#092b6b] text-white font-bold text-[11px]">
                <th className="p-2 border-r border-blue-800 text-center w-8">ক্র.</th>
                <th className="p-2 border-r border-blue-800 w-24">আইডি / PPPoE</th>
                <th className="p-2 border-r border-blue-800">গ্রাহক ও পিতার নাম</th>
                <th className="p-2 border-r border-blue-800">মোবাইল</th>
                <th className="p-2 border-r border-blue-800">এলাকা ও বক্স</th>
                <th className="p-2 border-r border-blue-800 text-right w-16">মাসিক ফি</th>
                <th className="p-2 border-r border-blue-800 text-right w-16">বকেয়া</th>
                <th className="p-2 border-r border-blue-800 text-right w-20">মোট প্রদেয়</th>
                <th className="p-2 border-r border-blue-800 text-center w-20">আদায় জমা</th>
                <th className="p-2 border-r border-blue-800 text-center w-16">স্ট্যাটাস</th>
                <th className="p-2 text-center w-24">স্বাক্ষর</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {filteredClients.map((c, index) => {
                const totalDue = (c.previousDue || 0) + (c.status === 'active' ? c.monthlyFee : 0);
                const isPaid = (c.paidThisMonth || 0) >= totalDue && totalDue > 0;
                const isPartial = (c.paidThisMonth || 0) > 0 && (c.paidThisMonth || 0) < totalDue;

                return (
                  <tr key={c.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#f8fbff]'}>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">{c.serial}</td>
                    <td className="p-2 border-r border-slate-300 font-mono font-bold text-[#092b6b]">
                      <div>{c.id}</div>
                      <div className="text-[9px] text-slate-500">{c.pppoeUsername}</div>
                    </td>
                    <td className="p-2 border-r border-slate-300">
                      <div className="font-bold text-slate-900">{c.clientName}</div>
                      <div className="text-[10px] text-slate-500">পিতা: {c.fatherName}</div>
                    </td>
                    <td className="p-2 border-r border-slate-300 font-mono text-[11px]">{c.mobile}</td>
                    <td className="p-2 border-r border-slate-300">
                      <div>{c.address}</div>
                      <span className="inline-block mt-0.5 px-1.5 bg-blue-100 text-[#092b6b] rounded text-[10px] font-bold">
                        {c.boxNo}
                      </span>
                    </td>
                    <td className="p-2 border-r border-slate-300 text-right font-medium">৳{c.monthlyFee}</td>
                    <td className="p-2 border-r border-slate-300 text-right font-medium text-rose-700">
                      {c.previousDue > 0 ? `৳${c.previousDue}` : '-'}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-right font-bold bg-blue-50/70">৳{totalDue}</td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold bg-emerald-50/50">
                      {c.paidThisMonth > 0 ? (
                        <span className="text-emerald-700">৳{c.paidThisMonth}</span>
                      ) : (
                        <div className="h-5 border border-dashed border-slate-400 rounded bg-white mx-auto w-14"></div>
                      )}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-center">
                      {c.status === 'inactive' ? (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-rose-100 text-rose-700">OFF</span>
                      ) : isPaid ? (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-100 text-emerald-800">PAID</span>
                      ) : isPartial ? (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-100 text-amber-800">PARTIAL</span>
                      ) : (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-red-100 text-red-700">DUE</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      <div className="h-5 border-b border-dotted border-slate-400 w-full mt-2"></div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-300 grid grid-cols-3 gap-6 text-xs text-center">
          <div>
            <div className="border-t border-slate-400 pt-1 w-3/4 mx-auto font-bold text-slate-700">Collector-1 স্বাক্ষর</div>
            <div className="text-[10px] text-slate-500">জামাল আহমেদ</div>
          </div>
          <div>
            <div className="border-t border-slate-400 pt-1 w-3/4 mx-auto font-bold text-slate-700">Collector-2 স্বাক্ষর</div>
            <div className="text-[10px] text-slate-500">কামাল হোসেন</div>
          </div>
          <div>
            <div className="border-t border-slate-400 pt-1 w-3/4 mx-auto font-bold text-[#092b6b]">Proprietor / Authorized</div>
            <div className="text-[10px] text-slate-600">MD. JABED Hossain • SCN</div>
          </div>
        </div>
      </div>
    </div>
  );
};
