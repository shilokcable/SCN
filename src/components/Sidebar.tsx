import React from 'react';
import { UserRole, Collector } from '../types/isp';
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  BarChart3,
  Printer,
  Wifi,
  FileSpreadsheet,
  DatabaseBackup,
  ShieldCheck,
  UserCircle2,
  X,
} from 'lucide-react';

export type AppTab = 'dashboard' | 'excel' | 'collector' | 'print' | 'client_portal';

interface SidebarProps {
  currentRole: UserRole;
  currentTab: AppTab;
  pendingRequestsCount: number;
  currentCollectorId: 'C1' | 'C2';
  collectors: Collector[];
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onSelectTab: (tab: AppTab) => void;
  onSelectRole: (role: UserRole) => void;
  onSwitchCollector: (id: 'C1' | 'C2') => void;
  onOpenGasModal: () => void;
  onAdvanceMonth: () => void;
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  currentTab,
  pendingRequestsCount,
  currentCollectorId,
  isOpenMobile,
  onCloseMobile,
  onSelectTab,
  onSelectRole,
  onSwitchCollector,
  onOpenGasModal,
  onAdvanceMonth,
  onResetData,
}) => {
  const navItems: {
    id: string;
    label: string;
    sub: string;
    icon: React.ReactNode;
    active: boolean;
    badge?: number;
    onClick: () => void;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      sub: 'ড্যাশবোর্ড',
      icon: <LayoutDashboard className="w-4 h-4" />,
      active: currentTab === 'dashboard',
      onClick: () => {
        onSelectTab('dashboard');
        onCloseMobile();
      },
    },
    {
      id: 'excel',
      label: 'Client Management',
      sub: 'এক্সেল ও KYC শিট',
      icon: <Users className="w-4 h-4" />,
      active: currentTab === 'excel',
      onClick: () => {
        onSelectTab('excel');
        onCloseMobile();
      },
    },
    {
      id: 'monthly_bill',
      label: 'Monthly Bill Rollover',
      sub: 'পরবর্তী মাস অটো বিল',
      icon: <FileText className="w-4 h-4" />,
      active: false,
      onClick: () => {
        onAdvanceMonth();
        onCloseMobile();
      },
    },
    {
      id: 'collector',
      label: 'Bill Collection',
      sub: '২ কালেক্টর বিল আদায়',
      icon: <DollarSign className="w-4 h-4" />,
      active: currentTab === 'collector',
      onClick: () => {
        onSelectTab('collector');
        onCloseMobile();
      },
    },
    {
      id: 'reports',
      label: 'Edit Approvals',
      sub: 'অনুমোদন ও রিপোর্ট',
      icon: <BarChart3 className="w-4 h-4" />,
      active: false,
      badge: pendingRequestsCount,
      onClick: () => {
        onSelectRole('admin');
        onSelectTab('dashboard');
        onCloseMobile();
      },
    },
    {
      id: 'print',
      label: 'Generate PDF',
      sub: 'মাসিক কালেকশন প্রিন্ট',
      icon: <Printer className="w-4 h-4" />,
      active: currentTab === 'print',
      onClick: () => {
        onSelectTab('print');
        onCloseMobile();
      },
    },
    {
      id: 'client_portal',
      label: 'Client Portal & Router',
      sub: 'গ্রাহক লগইন ও রাউটার',
      icon: <Wifi className="w-4 h-4" />,
      active: currentTab === 'client_portal',
      onClick: () => {
        onSelectTab('client_portal');
        onCloseMobile();
      },
    },
    {
      id: 'gas',
      label: 'Google Sheet / Script',
      sub: 'Code.gs & Index.html',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      active: false,
      onClick: () => {
        onOpenGasModal();
        onCloseMobile();
      },
    },
    {
      id: 'reset',
      label: 'Backup & Restore',
      sub: 'ডেমো ডেটা রিসেট',
      icon: <DatabaseBackup className="w-4 h-4" />,
      active: false,
      onClick: () => {
        onResetData();
        onCloseMobile();
      },
    },
  ];

  const sidebarContent = (
    <aside className="w-64 h-full flex flex-col justify-between bg-gradient-to-b from-[#0b3b8c] via-[#082c6c] to-[#041a47] text-white border-r border-blue-900/60 shadow-2xl select-none">
      <div>
        {/* Mobile close header */}
        <div className="flex lg:hidden items-center justify-between px-4 py-3 border-b border-white/10">
          <span className="font-extrabold text-sm tracking-wide">SCN Navigation</span>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Admin / Active Role Card */}
        <div className="p-4 border-b border-white/15 bg-black/15">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white text-[#0b3b8c] flex items-center justify-center shadow-md shrink-0">
              <UserCircle2 className="w-8 h-8" />
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-sm text-white truncate">
                {currentRole === 'admin' && 'Admin'}
                {currentRole === 'collector_1' && 'Collector-1'}
                {currentRole === 'collector_2' && 'Collector-2'}
                {currentRole === 'client' && 'Client User'}
              </div>
              <div className="text-[11px] text-sky-200 truncate">
                {currentRole === 'admin' && 'Administrator'}
                {currentRole === 'collector_1' && 'জামাল আহমেদ'}
                {currentRole === 'collector_2' && 'কামাল হোসেন'}
                {currentRole === 'client' && 'Self-Service View'}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-300 font-semibold mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Online</span>
              </div>
            </div>
          </div>

          {/* Role Switcher Pills */}
          <div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px] font-bold">
            <button
              onClick={() => onSelectRole('admin')}
              className={`py-1 px-2 rounded-lg transition cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-amber-400 text-[#062052] shadow'
                  : 'bg-white/10 text-sky-100 hover:bg-white/20'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => {
                onSelectRole('collector_1');
                onSwitchCollector('C1');
              }}
              className={`py-1 px-2 rounded-lg transition cursor-pointer ${
                currentRole === 'collector_1' || (currentTab === 'collector' && currentCollectorId === 'C1')
                  ? 'bg-sky-400 text-[#062052] shadow'
                  : 'bg-white/10 text-sky-100 hover:bg-white/20'
              }`}
            >
              Collector-1
            </button>
            <button
              onClick={() => {
                onSelectRole('collector_2');
                onSwitchCollector('C2');
              }}
              className={`py-1 px-2 rounded-lg transition cursor-pointer ${
                currentRole === 'collector_2' || (currentTab === 'collector' && currentCollectorId === 'C2')
                  ? 'bg-emerald-400 text-[#062052] shadow'
                  : 'bg-white/10 text-sky-100 hover:bg-white/20'
              }`}
            >
              Collector-2
            </button>
            <button
              onClick={() => onSelectRole('client')}
              className={`py-1 px-2 rounded-lg transition cursor-pointer ${
                currentRole === 'client'
                  ? 'bg-white text-[#062052] shadow'
                  : 'bg-white/10 text-sky-100 hover:bg-white/20'
              }`}
            >
              Client View
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-2.5 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition cursor-pointer ${
                item.active
                  ? 'bg-gradient-to-r from-[#1d70f5] to-[#0284c7] text-white shadow-lg shadow-blue-950/50 border border-sky-400/40'
                  : 'text-sky-100/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={item.active ? 'text-amber-300' : 'text-sky-300'}>{item.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-tight truncate">{item.label}</div>
                  <div className="text-[10px] opacity-75 truncate">{item.sub}</div>
                </div>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-[#062052] font-black text-[10px]">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Stay Connected Telecom Tower Graphic */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-t from-[#0284c7]/40 via-[#0a3d91]/60 to-transparent border border-sky-400/20 relative overflow-hidden">
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SCN Fiber Net</span>
            </div>
            <div className="font-signature text-xl text-white leading-none">Stay Connected</div>
            <div className="font-signature text-lg text-amber-300 leading-none">Always...</div>
          </div>

          <svg viewBox="0 0 60 80" className="w-12 h-16 text-sky-200 shrink-0" fill="none">
            <path d="M30 16 L16 76 M30 16 L44 76 M21 54 L39 54 M24 38 L36 38 M18 67 L42 67" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="30" cy="14" r="3.5" fill="#fbbf24" />
            <path d="M20 9 A14 14 0 0 1 40 9" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <path d="M14 4 A22 22 0 0 1 46 4" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <div className="no-print hidden lg:block shrink-0">{sidebarContent}</div>

      {/* Mobile Slide-Over Sidebar */}
      {isOpenMobile && (
        <div className="no-print fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={onCloseMobile}></div>
          <div className="relative z-10 h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
