import React, { useState } from 'react';
import { CollectionRecord, EditRequest } from '../types/isp';
import { X, Send, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

interface EditRequestModalProps {
  receipt: CollectionRecord;
  collectorName: string;
  collectorId: 'C1' | 'C2';
  existingRequest?: EditRequest;
  isAdmin?: boolean;
  onClose: () => void;
  onSubmitRequest: (request: Omit<EditRequest, 'id' | 'requestedAt' | 'status'>) => void;
  onApproveReject?: (requestId: string, status: 'approved' | 'rejected', newAmount?: number) => void;
}

export const EditRequestModal: React.FC<EditRequestModalProps> = ({
  receipt,
  collectorName,
  collectorId,
  existingRequest,
  isAdmin = false,
  onClose,
  onSubmitRequest,
  onApproveReject,
}) => {
  const [requestedAmount, setRequestedAmount] = useState<number>(
    existingRequest ? existingRequest.requestedAmount : receipt.amount
  );
  const [reason, setReason] = useState<string>(existingRequest ? existingRequest.reason : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      return;
    }
    onSubmitRequest({
      receiptId: receipt.id,
      clientId: receipt.clientId,
      clientName: receipt.clientName,
      collectorId,
      collectorName,
      originalAmount: receipt.amount,
      requestedAmount: Number(requestedAmount),
      reason: reason.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
      <div className="bg-white border border-blue-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0b3b8c] to-[#1354b8] text-white">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-400 text-[#092b6b]">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold">বিল এন্ট্রি সংশোধনের অনুরোধ (Edit Request)</h2>
              <span className="text-xs text-sky-200 font-mono">রশিদ নং: {receipt.id}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-sky-200 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-3.5 bg-[#eff6ff] rounded-2xl border border-blue-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">গ্রাহকের নাম:</span>
              <span className="font-bold text-[#092b6b]">
                {receipt.clientName} ({receipt.clientId})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">পূর্বে জমাকৃত টাকার পরিমাণ:</span>
              <span className="font-black text-emerald-700">৳ {receipt.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">কালেক্টর:</span>
              <span className="font-bold text-[#0d47a1]">{receipt.collectorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">বিলের মাস:</span>
              <span className="font-semibold text-slate-900">{receipt.month}</span>
            </div>
          </div>

          {existingRequest && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>
                  অনুরোধ স্ট্যাটাস:{' '}
                  {existingRequest.status === 'pending'
                    ? 'অপেক্ষা করছে'
                    : existingRequest.status === 'approved'
                    ? 'অনুমোদিত'
                    : 'বাতিল'}
                </span>
              </div>
              <p className="font-semibold">প্রস্তাবিত পরিমাণ: ৳{existingRequest.requestedAmount}</p>
              <p className="text-slate-700 italic">কারণ: "{existingRequest.reason}"</p>
            </div>
          )}

          {isAdmin && existingRequest && onApproveReject && (
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <h4 className="font-extrabold text-[#092b6b] text-sm">অ্যাডমিন অ্যাকশন</h4>
              <div>
                <label className="block text-slate-600 mb-1 font-bold">সংশোধিত নতুন টাকার পরিমাণ (BDT)</label>
                <input
                  type="number"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(Number(e.target.value))}
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900 font-black text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => onApproveReject(existingRequest.id, 'rejected')}
                  className="px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold cursor-pointer"
                >
                  প্রত্যাখ্যান করুন
                </button>
                <button
                  type="button"
                  onClick={() => onApproveReject(existingRequest.id, 'approved', requestedAmount)}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>অনুমোদন ও আপডেট করুন</span>
                </button>
              </div>
            </div>
          )}

          {(!existingRequest || existingRequest.status === 'rejected') && !isAdmin && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">প্রকৃত সঠিক টাকার পরিমাণ *</label>
                <input
                  type="number"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(Number(e.target.value))}
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900 font-black text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">ভুল হওয়ার সুনির্দিষ্ট কারণ *</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="যেমন: ভুলবশত ৫০০ টাকার স্থানে ৮০০ টাকা এন্ট্রি হয়েছিল..."
                  rows={3}
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900"
                  required
                />
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[#092b6b] text-[11px]">
                অ্যাডমিন অনুমোদন দিলে স্বয়ংক্রিয়ভাবে ক্লায়েন্টের ব্যালেন্স ও রশিদ আপডেট হবে।
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>অ্যাডমিনকে অনুরোধ পাঠান</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
