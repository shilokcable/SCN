import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { CollectionRecord, Client } from '../types/isp';
import { SCNLogo } from './SCNLogo';
import {
  Printer,
  X,
  Phone,
  MapPin,
  Calendar,
  Wifi,
  Check,
  Copy,
  User,
  Headphones,
  Globe,
  FileText,
  Calculator,
  BadgeDollarSign,
  CheckCircle2,
} from 'lucide-react';

interface PaymentReceiptModalProps {
  receipt: CollectionRecord;
  client?: Client;
  onClose: () => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  receipt,
  client,
  onClose,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const payload = JSON.stringify({
      org: 'SCN - Shilok Cable Network',
      slogan: 'Fast • Reliable • সবার জন্য ইন্টারনেট',
      receiptNo: receipt.id,
      client: receipt.clientName,
      clientId: receipt.clientId,
      pppoe: receipt.pppoeUsername,
      amount: `${receipt.amount} BDT`,
      month: receipt.month,
      collector: receipt.collectorName,
      date: new Date(receipt.date).toLocaleDateString('en-GB'),
      verified: true,
      authorizedBy: 'MD. JABED Hossain (01815528967)',
    });

    QRCode.toDataURL(payload, {
      width: 180,
      margin: 1,
      color: {
        dark: '#092b6b',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [receipt]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(receipt.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(receipt.date).toLocaleDateString('en-GB');
  const monthlyBill = client ? (client.status === 'active' ? client.monthlyFee : 0) : receipt.amount;
  const previousDue = Math.max(0, receipt.previousDueAtPayment - monthlyBill);
  const totalDue = receipt.previousDueAtPayment || monthlyBill;
  const isActive = !client || client.status === 'active';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-[780px] bg-white text-slate-900 rounded-3xl shadow-2xl border-2 border-blue-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print flex items-center justify-between px-5 py-3 bg-[#092b6b] text-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-xs sm:text-sm text-sky-100">
              SCN অফিশিয়াল পেমেন্ট রিসিট (Payment Slip)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white text-xs font-bold shadow transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট / PDF সেভ</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-sky-200 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="relative bg-gradient-to-b from-[#e0f2fe] via-white to-[#eff6ff] overflow-hidden">
          {/* Top Sky-Blue Banner Header */}
          <div className="relative px-5 sm:px-7 pt-5 pb-4 bg-gradient-to-r from-white via-[#e6f3ff] to-[#60a5fa]/40 overflow-hidden">
            <div className="relative z-10 flex items-center justify-between gap-2">
              <SCNLogo variant="receipt" size="md" />

              {/* Globe & Telecom Tower Illustration Accent */}
              <div className="hidden sm:flex items-center gap-2 opacity-90">
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 p-1 shadow-lg flex items-center justify-center border-2 border-white">
                  <Globe className="w-10 h-10 text-white/90 animate-pulse" />
                </div>
                <svg viewBox="0 0 60 80" className="w-12 h-16 text-[#092b6b]" fill="none">
                  <path d="M30 14 L18 75 M30 14 L42 75 M22 50 L38 50 M25 34 L35 34 M20 64 L40 64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="30" cy="12" r="3.5" fill="#0284c7" />
                  <path d="M21 8 A12 12 0 0 1 39 8" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16 4 A18 18 0 0 1 44 4" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Signature Red & Blue Double Ribbon Wave */}
            <div className="mt-3 -mx-7 h-3 relative">
              <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,15 Q300,40 600,18 T1200,12 L1200,40 L0,40 Z" fill="#0d47a1" />
                <path d="M0,25 Q350,0 700,22 T1200,18 L1200,32 Q700,35 350,15 T0,32 Z" fill="#ef4444" />
              </svg>
            </div>
          </div>

          <div className="px-5 sm:px-7 py-4 space-y-4">
            {/* Dark Navy Receipt Meta Bar */}
            <div className="flex flex-wrap items-center justify-between bg-[#092b6b] text-white rounded-xl overflow-hidden shadow-md border border-blue-900">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 px-4 py-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-300 shrink-0" />
                  <div>
                    <div className="text-[10px] text-sky-200 leading-none">Receipt No. :</div>
                    <div className="font-mono font-extrabold text-amber-300 text-sm flex items-center gap-1 mt-0.5">
                      <span>{receipt.id}</span>
                      <button
                        onClick={handleCopyId}
                        className="no-print text-sky-300 hover:text-white cursor-pointer"
                        title="Copy Receipt ID"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block h-7 w-[1px] bg-white/20"></div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sky-300 shrink-0" />
                  <div>
                    <div className="text-[10px] text-sky-200 leading-none">Date :</div>
                    <div className="font-bold text-white text-sm mt-0.5">{formattedDate}</div>
                  </div>
                </div>
              </div>

              {/* PAYMENT RECEIPT Gold-bordered Badge */}
              <div className="w-full sm:w-auto bg-gradient-to-r from-[#1d4ed8] to-[#0284c7] px-5 py-2.5 border-t-2 sm:border-t-0 sm:border-l-4 border-amber-400 flex items-center justify-center">
                <span className="font-black italic tracking-wider text-sm sm:text-base text-white drop-shadow">
                  PAYMENT RECEIPT
                </span>
              </div>
            </div>

            {/* Client Details & Package Split Card */}
            <div className="bg-white/90 border border-blue-200 rounded-2xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Left 8 cols: Client Metadata */}
              <div className="md:col-span-8 space-y-1.5 text-xs sm:text-[13px] md:border-r md:border-blue-200 md:pr-4">
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-bold text-[#092b6b]">Client ID</span>
                  <span className="col-span-8 font-bold text-slate-900 font-mono">: {receipt.clientId}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-bold text-[#092b6b]">Client Name</span>
                  <span className="col-span-8 font-bold text-slate-900">: {receipt.clientName}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-bold text-[#092b6b]">Father's Name</span>
                  <span className="col-span-8 font-medium text-slate-800">: {client?.fatherName || '—'}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-bold text-[#092b6b]">Address</span>
                  <span className="col-span-8 font-medium text-slate-800">: {client?.address || 'শিলক, রাঙ্গুনিয়া'}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-bold text-[#092b6b]">Mobile</span>
                  <span className="col-span-8 font-bold font-mono text-slate-900">: {client?.mobile || '—'}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-bold text-[#092b6b]">IP / PPPoE</span>
                  <span className="col-span-8 font-bold font-mono text-[#0d47a1]">
                    : {receipt.pppoeUsername} {client?.ipAddress ? `(${client.ipAddress})` : ''}
                  </span>
                </div>
              </div>

              {/* Right 4 cols: Package Pill & Status */}
              <div className="md:col-span-4 flex flex-col items-center justify-center space-y-2.5 text-center">
                <div className="flex items-center gap-2 text-[#092b6b] font-extrabold text-sm">
                  <Wifi className="w-6 h-6 text-[#0284c7]" />
                  <span>Package</span>
                </div>

                <div className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-[#0d47a1] to-[#0284c7] text-white shadow-md">
                  <span className="text-xl font-black">৳ {client?.monthlyFee || receipt.amount}</span>
                  <span className="text-xs font-semibold opacity-90"> / Month</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-[#092b6b]">
                  <span>Status :</span>
                  <span
                    className={`inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-white font-black text-xs shadow ${
                      isActive ? 'bg-gradient-to-r from-emerald-500 to-green-600' : 'bg-rose-600'
                    }`}
                  >
                    <span>{isActive ? 'ON' : 'OFF'}</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Split: Ledger Table + Payment Successful Seal & QR */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Left 8 cols: Ledger Table */}
              <div className="md:col-span-8 bg-white border border-blue-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#092b6b] text-white font-bold">
                      <th className="py-2.5 px-4 text-left border-r border-blue-800">Description</th>
                      <th className="py-2.5 px-4 text-right w-36">Amount (৳)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
                    <tr>
                      <td className="py-2.5 px-4 flex items-center gap-2 border-r border-slate-200">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>Previous Due</span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono">৳ {previousDue}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 flex items-center gap-2 border-r border-slate-200">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>{receipt.month} Bill</span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono">৳ {monthlyBill}</td>
                    </tr>
                    <tr className="bg-[#dbeafe]/70 text-[#092b6b] font-extrabold">
                      <td className="py-2.5 px-4 flex items-center gap-2 border-r border-blue-200">
                        <Calculator className="w-4 h-4 text-[#092b6b]" />
                        <span>Total Due</span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono">৳ {totalDue}</td>
                    </tr>
                    <tr className="bg-[#dcfce7] text-emerald-900 font-black">
                      <td className="py-2.5 px-4 flex items-center gap-2 border-r border-emerald-200">
                        <BadgeDollarSign className="w-4 h-4 text-emerald-700" />
                        <span>Paid ({receipt.method})</span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-base text-emerald-700">
                        ৳ {receipt.amount}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 flex items-center gap-2 border-r border-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>Remaining Due</span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-600">
                        ৳ {receipt.newDueRemaining}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Right 4 cols: Payment Successful Seal + QR Code */}
              <div className="md:col-span-4 flex flex-col items-center justify-center space-y-3 py-1">
                {/* Green Starburst Badge + Gold Ribbon */}
                <div className="relative flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500 to-green-700 border-4 border-dashed border-emerald-200 shadow-lg flex flex-col items-center justify-center text-white text-center p-2">
                    <span className="text-[11px] font-bold leading-tight">Payment</span>
                    <span className="text-xs font-extrabold leading-tight">Successful</span>
                    <Check className="w-7 h-7 stroke-[3.5] mt-0.5 text-white drop-shadow" />
                  </div>
                  <div className="-mt-3 px-5 py-1 rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 text-[#092b6b] font-black text-xs shadow border border-amber-500">
                    Thank You!
                  </div>
                </div>

                {/* QR Code + Scan Box */}
                {qrDataUrl && (
                  <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-blue-200 shadow-sm">
                    <img src={qrDataUrl} alt="Verify Receipt QR" className="w-16 h-16" />
                    <div className="bg-[#092b6b] text-white text-[10px] font-bold px-2.5 py-2 rounded-lg text-center leading-tight">
                      Scan for
                      <br />
                      Online Verify
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Collected By & Authorized By Strip */}
            <div className="bg-[#e6f0fa] border border-blue-200 rounded-2xl p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
              <div className="sm:col-span-3 flex items-center gap-2.5 sm:border-r sm:border-blue-300 sm:pr-2">
                <div className="w-9 h-9 rounded-full bg-[#092b6b] text-white flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#0d47a1] font-semibold">Collected By :</div>
                  <div className="font-extrabold text-[#092b6b] text-xs leading-tight">
                    {receipt.collectorId === 'C1' ? 'Collector-1' : 'Collector-2'}
                  </div>
                  <div className="text-[10px] text-slate-600 truncate max-w-[110px]">
                    {receipt.collectorName.split(' ')[0]}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-5 space-y-0.5">
                <div className="text-[10px] text-[#0d47a1] font-semibold">Authorized By :</div>
                <div className="font-black text-[#092b6b] text-sm">MD. JABED Hossain</div>
                <div className="flex items-center gap-1.5 text-slate-800 font-bold font-mono text-[11px]">
                  <Phone className="w-3 h-3 text-[#092b6b]" />
                  <span>01815528967</span>
                </div>
                <div className="flex items-start gap-1 text-[10px] text-slate-700 leading-tight">
                  <MapPin className="w-3 h-3 text-[#092b6b] shrink-0 mt-0.5" />
                  <span>Jabed Telecom, School Market, Shilok Bazer, Ranguniya, Chattagram.</span>
                </div>
              </div>

              <div className="sm:col-span-4 text-center flex flex-col items-center justify-end">
                <div className="font-signature text-2xl sm:text-3xl text-[#092b6b] leading-none">
                  Jabed Hossain
                </div>
                <div className="w-40 border-t border-[#092b6b] mt-1 pt-0.5">
                  <div className="font-bold text-[#092b6b] text-[11px]">Proprietor</div>
                  <div className="text-[10px] font-semibold text-slate-700">SCN – Shilok Cable Network</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navy Bottom Footer Wave */}
          <div className="bg-[#06245c] text-white px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-bold">
              <Headphones className="w-4 h-4 text-sky-300" />
              <span>24/7 Support</span>
            </div>

            <div className="text-center">
              <div className="font-signature text-xl sm:text-2xl text-white tracking-wide leading-none">
                Thank you for being with SCN
              </div>
              <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-1"></div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-200">
              <Globe className="w-3.5 h-3.5 text-sky-300" />
              <span>সবার জন্য ইন্টারনেট</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
