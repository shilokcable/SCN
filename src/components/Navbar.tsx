import React from 'react';
import { UserRole, Collector } from '../types/isp';
import { SCNLogo } from './SCNLogo';
import { Calendar, Menu, Globe, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { AppTab } from './Sidebar';

interface NavbarProps {
  currentRole: UserRole;
  currentTab: AppTab;
  currentMonth: string;
  pendingRequestsCount: number;
  currentCollectorId: 'C1' | 'C2';
  collectors: Collector[];
  onSelectTab: (tab: AppTab) => void;
  onSelectRole: (role: UserRole) => void;
  onSwitchCollector: (id: 'C1' | 'C2') => void;
  onOpenGasModal: () => void;
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMonth,
  onSelectTab,
  onOpenGasModal,
  onOpenMobileMenu,
}) => {
  return (
    <header className="no-print relative bg-gradient-to-r from-[#082d6f] via-[#1353bc] to-[#06245c] text-white border-b-2 border-[#0284c7]/40 shadow-lg overflow-hidden">
      {/* Subtle Glowing Fiber Network Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-44 -top-12 w-72 h-72 rounded-full bg-sky-400/15 blur-3xl"></div>
        <div className="hidden md:flex absolute right-64 top-1/2 -translate-y-1/2 opacity-25">
          <Globe className="w-32 h-32 text-sky-300" />
        </div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Hamburger + SCN Swoosh Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 cursor-pointer"
            title="মেনু খুলুন"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <SCNLogo variant="banner" size="md" showTagline={true} />
          </div>
        </div>

        {/* Right: High Speed Broadband Slogan + Month Badge + Google Sheet */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="hidden xl:block text-right pr-3 border-r border-white/20">
            <div className="text-sm font-extrabold text-white tracking-tight">
              High Speed Broadband Internet
            </div>
            <div className="text-[11px] text-amber-300 font-semibold flex items-center justify-end gap-1.5">
              <span>🌐 Connect • Stream • Work • Grow</span>
            </div>
          </div>

          <button
            onClick={onOpenGasModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow transition cursor-pointer"
            title="Google Sheet & Apps Script ফাইল"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Google Sheet/Script</span>
          </button>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white text-[#092b6b] font-extrabold text-xs shadow-md border border-blue-200">
            <Calendar className="w-3.5 h-3.5 text-[#0d47a1]" />
            <span>{currentMonth}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};
