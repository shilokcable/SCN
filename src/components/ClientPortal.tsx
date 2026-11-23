import React, { useState } from 'react';
import { Client, CollectionRecord } from '../types/isp';
import { SCNLogo } from './SCNLogo';
import {
  Wifi,
  LogIn,
  ExternalLink,
  Eye,
  EyeOff,
  Copy,
  Check,
  MapPin,
  Shield,
  Receipt,
  Edit3,
  X,
  AlertCircle,
  Router,
  Sparkles,
} from 'lucide-react';

interface ClientPortalProps {
  clients: Client[];
  collections: CollectionRecord[];
  currentMonth: string;
  onUpdateClient: (updated: Client) => void;
  onViewReceipt: (receipt: CollectionRecord) => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  clients,
  collections,
  currentMonth,
  onUpdateClient,
  onViewReceipt,
}) => {
  const [loginInput, setLoginInput] = useState('');
  const [loggedInClient, setLoggedInClient] = useState<Client | null>(() => clients[0] || null);
  const [loginError, setLoginError] = useState('');
  const [showRouterPass, setShowRouterPass] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isEditingKyc, setIsEditingKyc] = useState(false);
  const [editFormData, setEditFormData] = useState({
    clientName: '',
    fatherName: '',
    mobile: '',
    address: '',
    nidNumber: '',
    emergencyContact: '',
    photoUrl: '',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const query = loginInput.trim().toLowerCase();
    if (!query) {
      setLoginError('অনুগ্রহ করে আপনার PPPoE ইউজারনেম, ক্লায়েন্ট আইডি বা মোবাইল নম্বর লিখুন');
      return;
    }

    const matched = clients.find(
      (c) =>
        c.pppoeUsername.toLowerCase() === query ||
        c.id.toLowerCase() === query ||
        c.mobile.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, '')) ||
        c.ipAddress === query
    );

    if (matched) {
      setLoggedInClient(matched);
      setLoginInput('');
    } else {
      setLoginError('কোন তথ্য মেলেনি! আপনার PPPoE (যেমন: sb-jamalNT) অথবা আইডি (যেমন: SCN-0001) দিয়ে চেষ্টা করুন।');
    }
  };

  const handleStartEditKyc = () => {
    if (!loggedInClient) return;
    setEditFormData({
      clientName: loggedInClient.clientName,
      fatherName: loggedInClient.fatherName,
      mobile: loggedInClient.mobile,
      address: loggedInClient.address,
      nidNumber: loggedInClient.kyc.nidNumber || '',
      emergencyContact: loggedInClient.kyc.emergencyContact || '',
      photoUrl: loggedInClient.kyc.photoUrl || '',
    });
    setIsEditingKyc(true);
  };

  const handleSaveKyc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedInClient) return;

    const updated: Client = {
      ...loggedInClient,
      clientName: editFormData.clientName,
      fatherName: editFormData.fatherName,
      mobile: editFormData.mobile,
      address: editFormData.address,
      kyc: {
        ...loggedInClient.kyc,
        nidNumber: editFormData.nidNumber,
        emergencyContact: editFormData.emergencyContact,
        photoUrl: editFormData.photoUrl,
      },
    };

    onUpdateClient(updated);
    setLoggedInClient(updated);
    setIsEditingKyc(false);
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!loggedInClient) {
    return (
      <div className="max-w-md mx-auto my-10 px-4">
        <div className="bg-white border border-blue-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col items-center text-center mb-6">
            <SCNLogo variant="receipt" size="md" />
            <h2 className="text-xl font-black text-[#092b6b] mt-4">গ্রাহক সেলফ-সার্ভিস পোর্টাল</h2>
            <p className="text-xs text-slate-600 mt-1">
              পাসওয়ার্ড ছাড়াই আপনার বিল, সংযোগ স্ট্যাটাস ও রাউটার অ্যাক্সেস দেখুন।
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#092b6b] mb-1.5">
                PPPoE ইউজার / আইডি / মোবাইল নম্বর
              </label>
              <input
                type="text"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="যেমন: sb-jamalNT বা SCN-0001"
                className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#0b3b8c] to-[#1d6ef2] text-white font-bold text-sm shadow-lg transition cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>লগইন করুন (পাসওয়ার্ড ছাড়া)</span>
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 block mb-2">দ্রুত প্রিভিউ করতে ক্লিক করুন:</span>
            <div className="flex flex-wrap gap-2 justify-center">
              {clients.slice(0, 3).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setLoggedInClient(c)}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0d47a1] text-xs font-mono font-bold border border-blue-200 cursor-pointer"
                >
                  {c.pppoeUsername}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const clientReceipts = collections.filter((c) => c.clientId === loggedInClient.id);
  const totalDue =
    (loggedInClient.previousDue || 0) +
    (loggedInClient.status === 'active' ? loggedInClient.monthlyFee : 0) -
    (loggedInClient.paidThisMonth || 0);

  const routerUrl = loggedInClient.router.ip.startsWith('http')
    ? loggedInClient.router.ip
    : `http://${loggedInClient.router.ip}`;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-5 space-y-5">
      {/* Client Top Profile Card */}
      <div className="bg-white border border-blue-200 rounded-2xl p-5 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <img
              src={loggedInClient.kyc.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={loggedInClient.clientName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black text-[#092b6b]">{loggedInClient.clientName}</h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-black text-white ${
                    loggedInClient.status === 'active' ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}
                >
                  {loggedInClient.status === 'active' ? '● ON (Active)' : '● OFF (Inactive)'}
                </span>
              </div>
              <div className="text-xs text-slate-600 font-mono mt-1">
                ID: <strong className="text-[#0d47a1]">{loggedInClient.id}</strong> • PPPoE:{' '}
                <strong className="text-slate-900">{loggedInClient.pppoeUsername}</strong> • IP:{' '}
                <span>{loggedInClient.ipAddress}</span>
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>
                  {loggedInClient.address} ({loggedInClient.boxNo})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartEditKyc}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#092b6b] text-xs font-bold border border-blue-200 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>প্রোফাইল / KYC আপডেট</span>
            </button>
            <button
              onClick={() => setLoggedInClient(null)}
              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 cursor-pointer"
            >
              লগআউট
            </button>
          </div>
        </div>

        {/* Client KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-5">
          <div className="p-3.5 rounded-xl bg-[#eff6ff] border border-blue-200">
            <span className="text-xs text-[#0d47a1] font-semibold block">ইন্টারনেট প্যাকেজ</span>
            <div className="text-base font-black text-[#092b6b] mt-1 flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-blue-600" />
              <span>{loggedInClient.packageSpeed}</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#eff6ff] border border-blue-200">
            <span className="text-xs text-[#0d47a1] font-semibold block">মাসিক বিল</span>
            <div className="text-lg font-black text-slate-900 mt-1">৳ {loggedInClient.monthlyFee}</div>
            <span className="text-[10px] text-slate-500">{currentMonth}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#eff6ff] border border-blue-200">
            <span className="text-xs text-[#0d47a1] font-semibold block">বর্তমান বকেয়া</span>
            <div className={`text-lg font-black mt-1 ${totalDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              ৳ {totalDue}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#eff6ff] border border-blue-200">
            <span className="text-xs text-[#0d47a1] font-semibold block">সংযোগের তারিখ</span>
            <div className="text-sm font-bold text-slate-900 mt-1 font-mono">{loggedInClient.connectionDate}</div>
          </div>
        </div>
      </div>

      {/* Router Remote Management Card */}
      <div className="bg-white border-2 border-blue-300 rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#0b3b8c] to-[#0284c7] text-white px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Router className="w-6 h-6 text-amber-300" />
            <div>
              <h2 className="text-sm sm:text-base font-extrabold">রাউটার রিমোট ম্যানেজমেন্ট (Router Access)</h2>
              <p className="text-[11px] text-sky-100">আপনার ওয়াইফাই রাউটার সেটিংস ও পাসওয়ার্ড দেখুন</p>
            </div>
          </div>
          <a
            href={routerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#092b6b] font-black text-xs shadow transition"
          >
            <span>Router Manage করুন</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-3.5 rounded-xl bg-[#f8fbff] border border-blue-200">
              <span className="text-[11px] text-slate-500 font-semibold block">রাউটার মডেল ও আইপি</span>
              <div className="text-xs font-bold text-slate-900 mt-1">{loggedInClient.router.model}</div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                <span className="text-xs font-mono font-bold text-[#0d47a1]">{loggedInClient.router.ip}</span>
                <button
                  onClick={() => copyToClipboard(loggedInClient.router.ip, 'ip')}
                  className="text-slate-500 hover:text-blue-600 cursor-pointer"
                >
                  {copiedKey === 'ip' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f8fbff] border border-blue-200">
              <span className="text-[11px] text-slate-500 font-semibold block">লগইন ইউজারনেম</span>
              <div className="text-xs font-bold text-slate-900 mt-1">Admin User</div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                <span className="text-xs font-mono font-bold text-slate-900">{loggedInClient.router.username}</span>
                <button
                  onClick={() => copyToClipboard(loggedInClient.router.username, 'user')}
                  className="text-slate-500 hover:text-blue-600 cursor-pointer"
                >
                  {copiedKey === 'user' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f8fbff] border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-semibold">রাউটার পাসওয়ার্ড</span>
                <button
                  onClick={() => setShowRouterPass(!showRouterPass)}
                  className="text-[#0d47a1] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  {showRouterPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showRouterPass ? 'লুকান' : 'দেখুন'}</span>
                </button>
              </div>
              <div className="text-sm font-bold mt-1 font-mono text-[#092b6b]">
                {showRouterPass ? loggedInClient.router.password : '••••••••••'}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                <span className="text-[10px] text-slate-500">কপি করুন</span>
                <button
                  onClick={() => copyToClipboard(loggedInClient.router.password, 'pass')}
                  className="text-slate-500 hover:text-blue-600 cursor-pointer"
                >
                  {copiedKey === 'pass' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f8fbff] border border-blue-200">
              <span className="text-[11px] text-slate-500 font-semibold block">ওয়াইফাই SSID ও পাসওয়ার্ড</span>
              <div className="text-xs font-bold text-slate-900 mt-1 truncate">{loggedInClient.router.wifiSsid}</div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                <span className="text-xs font-mono font-bold text-emerald-700">
                  {loggedInClient.router.wifiPassword || 'Default'}
                </span>
                {loggedInClient.router.wifiPassword && (
                  <button
                    onClick={() => copyToClipboard(loggedInClient.router.wifiPassword || '', 'wifi')}
                    className="text-slate-500 hover:text-blue-600 cursor-pointer"
                  >
                    {copiedKey === 'wifi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#092b6b] flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              <strong>পরামর্শ:</strong> "Router Manage করুন" বাটনে ক্লিক করে উপরের ইউজারনেম ও পাসওয়ার্ড দিয়ে ওয়াইফাই পাসওয়ার্ড পরিবর্তন করতে পারবেন। অনুগ্রহ করে PPPoE / WAN সেটিংস পরিবর্তন করবেন না।
            </p>
          </div>
        </div>
      </div>

      {/* KYC & Payment History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 bg-white border border-blue-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-[#0b3b8c] text-white px-5 py-3 flex items-center justify-between">
            <span className="font-bold text-xs flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-300" />
              গ্রাহক পরিচিতি (KYC)
            </span>
            <button onClick={handleStartEditKyc} className="text-xs text-amber-300 font-bold cursor-pointer">
              এডিট
            </button>
          </div>
          <div className="p-5 space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">পিতার নাম:</span>
              <span className="font-bold text-slate-900">{loggedInClient.fatherName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">মোবাইল:</span>
              <span className="font-mono font-bold text-slate-900">{loggedInClient.mobile}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">জরুরি যোগাযোগ:</span>
              <span className="font-mono text-slate-700">{loggedInClient.kyc.emergencyContact || 'নেই'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">NID নম্বর:</span>
              <span className="font-mono font-bold text-[#0d47a1]">{loggedInClient.kyc.nidNumber || 'নেই'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">ঠিকানা:</span>
              <span className="text-right text-slate-800">{loggedInClient.address}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-blue-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-[#0b3b8c] text-white px-5 py-3 flex items-center justify-between">
            <span className="font-bold text-xs flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-emerald-300" />
              পেমেন্ট ইতিহাস ও রশিদ ({clientReceipts.length})
            </span>
          </div>
          <div className="p-5 space-y-3">
            {clientReceipts.length > 0 ? (
              clientReceipts.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl bg-[#f8fbff] border border-blue-200 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#0d47a1] text-xs">{rec.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {rec.month}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      তারিখ: {new Date(rec.date).toLocaleDateString('en-GB')} • {rec.collectorName}
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="text-base font-black text-emerald-700">৳{rec.amount}</span>
                    <button
                      onClick={() => onViewReceipt(rec)}
                      className="px-3 py-1.5 rounded-lg bg-[#0b3b8c] hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                    >
                      স্লিপ / প্রিন্ট
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">কোন পেমেন্ট স্লিপ পাওয়া যায়নি।</div>
            )}
          </div>
        </div>
      </div>

      {/* KYC Edit Modal */}
      {isEditingKyc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white border border-blue-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-[#0b3b8c] text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">গ্রাহক তথ্য ও KYC হালনাগাদ</h3>
              <button onClick={() => setIsEditingKyc(false)} className="text-sky-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveKyc} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">গ্রাহকের নাম</label>
                <input
                  type="text"
                  value={editFormData.clientName}
                  onChange={(e) => setEditFormData({ ...editFormData, clientName: e.target.value })}
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">পিতার নাম</label>
                  <input
                    type="text"
                    value={editFormData.fatherName}
                    onChange={(e) => setEditFormData({ ...editFormData, fatherName: e.target.value })}
                    className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">মোবাইল</label>
                  <input
                    type="text"
                    value={editFormData.mobile}
                    onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                    className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 mb-1 font-bold">ঠিকানা</label>
                <input
                  type="text"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">NID নম্বর</label>
                  <input
                    type="text"
                    value={editFormData.nidNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, nidNumber: e.target.value })}
                    className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">জরুরি মোবাইল</label>
                  <input
                    type="text"
                    value={editFormData.emergencyContact}
                    onChange={(e) => setEditFormData({ ...editFormData, emergencyContact: e.target.value })}
                    className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 mb-1 font-bold">ছবির URL</label>
                <input
                  type="text"
                  value={editFormData.photoUrl}
                  onChange={(e) => setEditFormData({ ...editFormData, photoUrl: e.target.value })}
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditingKyc(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0b3b8c] text-white font-bold cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
