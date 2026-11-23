import React, { useState } from 'react';
import { X, Copy, Check, FileCode, FileSpreadsheet, HelpCircle, Sparkles } from 'lucide-react';

interface GoogleAppsScriptModalProps {
  onClose: () => void;
}

export const GoogleAppsScriptModal: React.FC<GoogleAppsScriptModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'codegs' | 'indexhtml'>('guide');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const codeGsSnippet = `// SCN Shilok Cable Network - Google Apps Script Backend (Code.gs)
// স্লোগান: সবার জন্য ইন্টারনেট

const SHEETS = {
  CLIENTS: 'Clients',
  COLLECTIONS: 'Collections',
  EDIT_REQUESTS: 'EditRequests',
  SETTINGS: 'Settings'
};

function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('SCN - Shilok Cable Network')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function initDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let clientSheet = ss.getSheetByName(SHEETS.CLIENTS);
  if (!clientSheet) {
    clientSheet = ss.insertSheet(SHEETS.CLIENTS);
    const headers = [
      'Serial', 'ClientID', 'Status', 'ConnectionDate', 'ClientName', 'FatherName',
      'Mobile', 'Area', 'Address', 'BoxNo', 'IPAddress', 'PPPoE',
      'Package', 'MonthlyFee', 'PreviousDue', 'CurrentBill', 'PaidThisMonth', 'TotalDue',
      'RouterModel', 'RouterIP', 'RouterUser', 'RouterPassword', 'WifiSSID', 'WifiPassword',
      'NID', 'EmergencyContact', 'Notes'
    ];
    clientSheet.appendRow(headers);
    clientSheet.getRange(1, 1, 1, headers.length).setBackground('#092b6b').setFontColor('#ffffff').setFontWeight('bold');
  }

  let colSheet = ss.getSheetByName(SHEETS.COLLECTIONS);
  if (!colSheet) {
    colSheet = ss.insertSheet(SHEETS.COLLECTIONS);
    colSheet.appendRow(['ReceiptID', 'ClientID', 'ClientName', 'PPPoE', 'CollectorID', 'CollectorName', 'Amount', 'Month', 'Timestamp', 'Method', 'TransactionID', 'PreviousDue', 'RemainingDue', 'Status', 'Notes']);
  }

  let reqSheet = ss.getSheetByName(SHEETS.EDIT_REQUESTS);
  if (!reqSheet) {
    reqSheet = ss.insertSheet(SHEETS.EDIT_REQUESTS);
    reqSheet.appendRow(['RequestID', 'ReceiptID', 'ClientID', 'ClientName', 'CollectorID', 'CollectorName', 'OriginalAmount', 'RequestedAmount', 'Reason', 'Timestamp', 'Status', 'ReviewedAt']);
  }

  let setSheet = ss.getSheetByName(SHEETS.SETTINGS);
  if (!setSheet) {
    setSheet = ss.insertSheet(SHEETS.SETTINGS);
    setSheet.appendRow(['Key', 'Value']);
    setSheet.appendRow(['CurrentMonth', 'নভেম্বর ২০২৬']);
  }
  return 'Database Initialized Successfully!';
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-blue-200 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0b3b8c] to-[#1354b8] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500 text-white shadow">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Google Sheets & Apps Script ফাইল ও ডিপ্লয়মেন্ট</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-[#092b6b] text-[10px] font-black">
                  100% Free Hosting
                </span>
              </h2>
              <span className="text-xs text-sky-100">
                সম্পূর্ণ গুগল শিট ও Code.gs দিয়ে ওয়েবে ISP বিলিং চালানোর স্ক্রিপ্ট
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-white/15 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-blue-200 bg-[#f8fbff] px-6 gap-2">
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'guide'
                ? 'border-[#0b3b8c] text-[#092b6b]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>সেটআপ গাইড</span>
          </button>

          <button
            onClick={() => setActiveTab('codegs')}
            className={`py-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'codegs'
                ? 'border-[#0b3b8c] text-[#092b6b]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Code.gs</span>
          </button>

          <button
            onClick={() => setActiveTab('indexhtml')}
            className={`py-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'indexhtml'
                ? 'border-[#0b3b8c] text-[#092b6b]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Index.html</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto text-xs space-y-4">
          {activeTab === 'guide' && (
            <div className="space-y-4 text-slate-700">
              <div className="p-4 rounded-2xl bg-[#eff6ff] border border-blue-200 text-[#092b6b] flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  <strong>ফ্রি ক্লাউড হোস্টিং:</strong> আপনি কোনো ডোমেন বা সার্ভার খরচ ছাড়াই গুগল শিট ও Apps Script দিয়ে লাইভ ওয়েব অ্যাপ হিসেবে চালাতে পারবেন।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-200 space-y-1.5">
                  <span className="text-[#092b6b] font-extrabold block text-sm">১. গুগল স্প্রেডশিট খুলুন</span>
                  <p className="text-slate-600">
                    ব্রাউজারে{' '}
                    <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold">
                      sheets.new
                    </a>{' '}
                    ওপেন করুন এবং নাম দিন <strong>SCN Shilok Cable Network</strong>।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-200 space-y-1.5">
                  <span className="text-[#092b6b] font-extrabold block text-sm">২. Apps Script ওপেন করুন</span>
                  <p className="text-slate-600">
                    গুগল শিটের মেনুবার থেকে <strong>Extensions</strong> &rarr; <strong>Apps Script</strong>-এ ক্লিক করুন।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-200 space-y-1.5">
                  <span className="text-[#092b6b] font-extrabold block text-sm">৩. Code.gs ও Index.html পেস্ট করুন</span>
                  <p className="text-slate-600">
                    <code>/google_apps_script/Code.gs</code> ও <code>/google_apps_script/Index.html</code> ফাইল দুটি কপি করে বসান।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-200 space-y-1.5">
                  <span className="text-[#092b6b] font-extrabold block text-sm">৪. Deploy as Web App</span>
                  <p className="text-slate-600">
                    প্রথমে <strong>initDatabase</strong> Run করুন, তারপর <strong>Deploy &rarr; New deployment &rarr; Web app</strong> (Anyone) হিসেবে পাবলিশ করুন।
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'codegs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">গুগল অ্যাপস স্ক্রিপ্ট ব্যাকএন্ড (Code.gs):</span>
                <button
                  onClick={() => copyCode(codeGsSnippet, 'codegs')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b3b8c] hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                >
                  {copiedKey === 'codegs' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'codegs' ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-900 font-mono text-[11px] text-sky-300 max-h-96 overflow-y-auto whitespace-pre">
                {codeGsSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'indexhtml' && (
            <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-200 text-slate-700 space-y-2">
              <p className="font-bold text-[#092b6b]">
                সম্পূর্ণ HTML ফাইলটি প্রজেক্টের <code>/google_apps_script/Index.html</code> ফাইলে সংরক্ষিত আছে।
              </p>
              <p className="text-slate-600">
                এতে SCN ব্র্যান্ডিং, ড্যাশবোর্ড, ২ কালেক্টর বিল আদায়, QR রশিদ, প্রিন্ট শিট এবং রাউটার অ্যাক্সেস পোর্টাল সব বিল্ট-ইন রয়েছে।
              </p>
            </div>
          )}
        </div>

        <div className="p-4 bg-[#f8fbff] border-t border-blue-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            ফাইল: <code>/google_apps_script/Code.gs</code> ও <code>Index.html</code>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0b3b8c] hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
