import React, { useState } from 'react';
import { Client } from '../types/isp';
import { SCNLogo } from './SCNLogo';
import { X, ExternalLink, Router, Phone, MapPin, Shield, Eye, EyeOff } from 'lucide-react';

interface ClientKycModalProps {
  client: Client;
  onClose: () => void;
  onEdit: () => void;
}

export const ClientKycModal: React.FC<ClientKycModalProps> = ({
  client,
  onClose,
  onEdit,
}) => {
  const [showRouterPass, setShowRouterPass] = useState(false);

  const routerUrl = client.router?.ip?.startsWith('http')
    ? client.router.ip
    : `http://${client.router?.ip}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-blue-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0b3b8c] to-[#1354b8] text-white">
          <div className="flex items-center gap-3">
            <SCNLogo variant="minimal" size="sm" showTagline={false} />
            <div>
              <h2 className="text-sm font-bold">গ্রাহক পরিচিতি ও সম্পূর্ণ KYC রেকর্ড</h2>
              <span className="text-[11px] font-mono text-amber-300">
                {client.id} • {client.pppoeUsername}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#092b6b] text-xs font-extrabold cursor-pointer"
            >
              তথ্য এডিট
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-sky-200 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-[#eff6ff] border border-blue-200">
            <img
              src={client.kyc.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={client.clientName}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-500/40"
            />
            <div className="space-y-1 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-lg font-black text-[#092b6b]">{client.clientName}</h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                    client.status === 'active' ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}
                >
                  {client.status === 'active' ? '● সংযোগ চালু (ON)' : '● সংযোগ বন্ধ (OFF)'}
                </span>
              </div>
              <p className="text-slate-600">
                পিতার নাম: <strong className="text-slate-900">{client.fatherName}</strong>
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-slate-700">
                <span className="flex items-center gap-1 font-mono font-bold text-[#0d47a1]">
                  <Phone className="w-3 h-3" />
                  {client.mobile}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  {client.address}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#f8fbff] rounded-xl border border-blue-200">
              <span className="text-[10px] text-slate-500 block">প্যাকেজ</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{client.packageSpeed}</span>
            </div>
            <div className="p-3 bg-[#f8fbff] rounded-xl border border-blue-200">
              <span className="text-[10px] text-slate-500 block">মাসিক বিল</span>
              <span className="font-black text-emerald-700 text-sm mt-0.5 block">৳{client.monthlyFee}</span>
            </div>
            <div className="p-3 bg-[#f8fbff] rounded-xl border border-blue-200">
              <span className="text-[10px] text-slate-500 block">আইপি অ্যাড্রেস</span>
              <span className="font-mono font-bold text-[#0d47a1] text-xs mt-0.5 block">{client.ipAddress}</span>
            </div>
            <div className="p-3 bg-[#f8fbff] rounded-xl border border-blue-200">
              <span className="text-[10px] text-slate-500 block">বক্স নং ও এলাকা</span>
              <span className="font-bold text-slate-800 text-xs mt-0.5 block">{client.boxNo}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#eff6ff] border border-blue-300 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Router className="w-4 h-4 text-[#0d47a1]" />
                <h4 className="font-extrabold text-[#092b6b] text-xs">রাউটার রিমোট অ্যাক্সেস</h4>
              </div>
              <a
                href={routerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#0b3b8c] hover:bg-blue-700 text-white text-xs font-bold transition"
              >
                <span>Router Manage</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">মডেল</span>
                <span className="text-slate-900 font-bold">{client.router?.model || 'General Router'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">গেটওয়ে আইপি</span>
                <span className="font-mono text-[#0d47a1] font-bold">{client.router?.ip || '192.168.0.1'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">ইউজারনেম</span>
                <span className="font-mono text-slate-900 font-bold">{client.router?.username || 'admin'}</span>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">পাসওয়ার্ড</span>
                  <button
                    onClick={() => setShowRouterPass(!showRouterPass)}
                    className="text-[#0d47a1] p-0.5 cursor-pointer"
                  >
                    {showRouterPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
                <span className="font-mono text-amber-700 font-black">
                  {showRouterPass ? client.router?.password : '••••••••'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-blue-200 text-[11px]">
              <span className="text-slate-600">
                ওয়াইফাই SSID: <strong className="text-slate-900">{client.router?.wifiSsid}</strong>
              </span>
              <span className="text-slate-600">
                ওয়াইফাই কী: <strong className="text-emerald-700 font-mono">{client.router?.wifiPassword}</strong>
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-200 space-y-2">
            <h4 className="font-bold text-[#092b6b] text-xs flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>জাতীয় পরিচয়পত্র ও জরুরি তথ্য</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500">এনআইডি নম্বর: </span>
                <span className="font-mono font-bold text-[#0d47a1]">
                  {client.kyc.nidNumber || 'সংগৃহীত হয়নি'}
                </span>
              </div>
              <div>
                <span className="text-slate-500">জরুরি যোগাযোগ: </span>
                <span className="font-mono font-bold text-slate-900">
                  {client.kyc.emergencyContact || 'উল্লেখ নেই'}
                </span>
              </div>
              <div>
                <span className="text-slate-500">পেশা: </span>
                <span className="text-slate-900">{client.kyc.occupation || 'সেবাগ্রহীতা'}</span>
              </div>
              <div>
                <span className="text-slate-500">কালেক্টর: </span>
                <span className="text-slate-900 font-bold">
                  {client.assignedCollectorId === 'C2' ? 'Collector-2 (কামাল)' : 'Collector-1 (জামাল)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
