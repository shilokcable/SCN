import React, { useState } from 'react';
import { Client, ClientStatus } from '../types/isp';
import { X, Save, UserPlus, Router } from 'lucide-react';

interface ClientFormModalProps {
  client?: Client | null;
  totalClientsCount: number;
  onSave: (client: Client) => void;
  onClose: () => void;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  client,
  totalClientsCount,
  onSave,
  onClose,
}) => {
  const isEdit = !!client;

  const [serial, setSerial] = useState<number>(client ? client.serial : totalClientsCount + 1);
  const [id, setId] = useState<string>(client ? client.id : `SCN-${String(totalClientsCount + 1).padStart(4, '0')}`);
  const [status, setStatus] = useState<ClientStatus>(client ? client.status : 'active');
  const [connectionDate, setConnectionDate] = useState<string>(
    client ? client.connectionDate : new Date().toISOString().slice(0, 10)
  );
  const [clientName, setClientName] = useState<string>(client ? client.clientName : '');
  const [fatherName, setFatherName] = useState<string>(client ? client.fatherName : '');
  const [mobile, setMobile] = useState<string>(client ? client.mobile : '');
  const [address, setAddress] = useState<string>(client ? client.address : '');
  const [area, setArea] = useState<string>(client ? client.area : 'শিলক বাজার');
  const [boxNo, setBoxNo] = useState<string>(client ? client.boxNo : 'BOX-01');
  const [ipAddress, setIpAddress] = useState<string>(
    client ? client.ipAddress : `192.168.88.${50 + totalClientsCount}`
  );
  const [pppoeUsername, setPppoeUsername] = useState<string>(
    client ? client.pppoeUsername : `sb-client${totalClientsCount + 1}`
  );
  const [packageSpeed, setPackageSpeed] = useState<string>(client ? client.packageSpeed : '15 Mbps Unlimited');
  const [monthlyFee, setMonthlyFee] = useState<number>(client ? client.monthlyFee : 800);
  const [previousDue, setPreviousDue] = useState<number>(client ? client.previousDue || 0 : 0);

  const [routerModel, setRouterModel] = useState<string>(client?.router?.model || 'TP-Link Archer C6');
  const [routerIp, setRouterIp] = useState<string>(client?.router?.ip || '192.168.0.1');
  const [routerUser, setRouterUser] = useState<string>(client?.router?.username || 'admin');
  const [routerPassword, setRouterPassword] = useState<string>(client?.router?.password || 'admin@scn2026');
  const [wifiSsid, setWifiSsid] = useState<string>(client?.router?.wifiSsid || 'SCN_WiFi_Fast');
  const [wifiPassword, setWifiPassword] = useState<string>(client?.router?.wifiPassword || 'shilok1234');

  const [nidNumber, setNidNumber] = useState<string>(client?.kyc?.nidNumber || '');
  const [emergencyContact, setEmergencyContact] = useState<string>(client?.kyc?.emergencyContact || '');
  const [photoUrl, setPhotoUrl] = useState<string>(
    client?.kyc?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  );
  const [notes, setNotes] = useState<string>(client?.kyc?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newClient: Client = {
      id: id.trim(),
      serial: Number(serial),
      status,
      connectionDate,
      clientName: clientName.trim(),
      fatherName: fatherName.trim(),
      mobile: mobile.trim(),
      address: address.trim(),
      area: area.trim(),
      boxNo: boxNo.trim(),
      ipAddress: ipAddress.trim(),
      pppoeUsername: pppoeUsername.trim(),
      packageSpeed: packageSpeed.trim(),
      monthlyFee: Number(monthlyFee),
      previousDue: Number(previousDue),
      currentMonthBill: status === 'active' ? Number(monthlyFee) : 0,
      paidThisMonth: client ? client.paidThisMonth : 0,
      assignedCollectorId: client ? client.assignedCollectorId : 'C1',
      router: {
        model: routerModel.trim(),
        ip: routerIp.trim(),
        username: routerUser.trim(),
        password: routerPassword.trim(),
        wifiSsid: wifiSsid.trim(),
        wifiPassword: wifiPassword.trim(),
      },
      kyc: {
        nidNumber: nidNumber.trim(),
        photoUrl: photoUrl.trim(),
        emergencyContact: emergencyContact.trim(),
        notes: notes.trim(),
      },
    };

    onSave(newClient);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-blue-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0b3b8c] to-[#1354b8] text-white">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/15 text-amber-300">
              <UserPlus className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold">
                {isEdit ? 'গ্রাহকের তথ্য ও প্যাকেজ সম্পাদনা' : 'নতুন গ্রাহক নিবন্ধন (Add New ISP Client)'}
              </h2>
              <span className="text-xs text-sky-100">Shilok Cable Network - সবার জন্য ইন্টারনেট</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-white/15 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          {/* Section 1 */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-[#092b6b] uppercase tracking-wider text-[11px]">
              ১. প্রাথমিক পরিচয় ও সংযোগের তথ্য
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">সিরিয়াল নং</label>
                <input
                  type="number"
                  value={serial}
                  onChange={(e) => setSerial(Number(e.target.value))}
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-bold">গ্রাহক আইডি (SCN-ID)</label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-[#0d47a1] font-mono font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-bold">সংযোগ অবস্থা</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ClientStatus)}
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                >
                  <option value="active">Active (চালু / ON)</option>
                  <option value="inactive">Inactive (বন্ধ / OFF)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-bold">সংযোগ তারিখ</label>
                <input
                  type="date"
                  value={connectionDate}
                  onChange={(e) => setConnectionDate(e.target.value)}
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">গ্রাহকের নাম *</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="যেমন: জামাল উদ্দিন চৌধুরী"
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-bold">পিতার নাম *</label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="যেমন: মরহুম নুরুল ইসলাম"
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">মোবাইল নম্বর *</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="01811-223344"
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-bold">এলাকা (Area)</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-bold">বক্স / পাড়া</label>
                <input
                  type="text"
                  value={boxNo}
                  onChange={(e) => setBoxNo(e.target.value)}
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">পূর্ণ ঠিকানা</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900"
                required
              />
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h3 className="font-extrabold text-[#092b6b] uppercase tracking-wider text-[11px]">
              ২. নেটওয়ার্ক ও মাসিক প্যাকেজ মূল্য
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">PPPoE ইউজার *</label>
                <input
                  type="text"
                  value={pppoeUsername}
                  onChange={(e) => setPppoeUsername(e.target.value)}
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-[#0d47a1] font-mono font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-bold">IP Address</label>
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-bold">প্যাকেজ স্পিড</label>
                <input
                  type="text"
                  value={packageSpeed}
                  onChange={(e) => setPackageSpeed(e.target.value)}
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-bold">মাসিক ফি (৳) *</label>
                <input
                  type="number"
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(Number(e.target.value))}
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900 font-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">পূর্বের বকেয়া (Previous Due)</label>
              <input
                type="number"
                value={previousDue}
                onChange={(e) => setPreviousDue(Number(e.target.value))}
                className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-rose-600 font-bold"
              />
            </div>
          </div>

          {/* Section 3: Router */}
          <div className="space-y-3 bg-[#eff6ff] p-4 rounded-2xl border border-blue-200">
            <div className="flex items-center gap-2">
              <Router className="w-4 h-4 text-[#0d47a1]" />
              <h3 className="font-extrabold text-[#092b6b] uppercase tracking-wider text-[11px]">
                ৩. রাউটার রিমোট অ্যাক্সেস ও পাসওয়ার্ড
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">রাউটার মডেল</label>
                <input
                  type="text"
                  value={routerModel}
                  onChange={(e) => setRouterModel(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-bold">রাউটার আইপি</label>
                <input
                  type="text"
                  value={routerIp}
                  onChange={(e) => setRouterIp(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-[#0d47a1] font-mono font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-bold">লগইন ইউজার</label>
                <input
                  type="text"
                  value={routerUser}
                  onChange={(e) => setRouterUser(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">অ্যাডমিন পাসওয়ার্ড</label>
                <input
                  type="text"
                  value={routerPassword}
                  onChange={(e) => setRouterPassword(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-bold">ওয়াইফাই SSID</label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-bold">ওয়াইফাই পাসওয়ার্ড</label>
                <input
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: KYC */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h3 className="font-extrabold text-[#092b6b] uppercase tracking-wider text-[11px]">
              ৪. KYC পরিচিতি
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">NID নম্বর</label>
                <input
                  type="text"
                  value={nidNumber}
                  onChange={(e) => setNidNumber(e.target.value)}
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-bold">জরুরি মোবাইল</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-bold">ছবির লিংক (Photo URL)</label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-bold">অফিস নোট</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full bg-[#f8fbff] border border-blue-200 rounded-xl px-3 py-2 text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0b3b8c] to-[#1d6ef2] text-white font-bold shadow-lg cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'আপডেট সম্পন্ন করুন' : 'গ্রাহক সংরক্ষণ করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
