import React from 'react';

interface SCNLogoProps {
  variant?: 'full' | 'compact' | 'receipt' | 'minimal' | 'banner';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const SCNLogo: React.FC<SCNLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  const isLightBg = variant === 'receipt' || variant === 'compact';

  const scaleMap = {
    sm: 'scale-75 origin-left',
    md: 'scale-95 origin-left',
    lg: 'scale-100 origin-left',
    xl: 'scale-110 origin-left',
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <div className="relative flex items-center justify-center w-11 h-9 rounded-xl bg-white/95 shadow-md px-1.5 border border-blue-200">
          <svg viewBox="0 0 120 75" className="w-full h-full" fill="none">
            <path d="M12 42 C25 14, 70 10, 90 16 C65 6, 18 12, 8 44 Z" fill="#ef4444" />
            <path d="M10 58 C35 72, 85 70, 108 52 C80 65, 35 66, 12 52 Z" fill="#0d47a1" />
            <text x="18" y="50" fill="#092b6b" fontWeight="900" fontStyle="italic" fontSize="32" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="-1">
              SCN
            </text>
            <path d="M96 22 A14 14 0 0 1 110 36" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
            <path d="M99 13 A24 24 0 0 1 118 33" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div className="font-extrabold tracking-tight text-sm leading-tight text-white">
            Shilok Cable Network
          </div>
          {showTagline && (
            <div className="text-[10px] text-amber-300 font-semibold">সবার জন্য ইন্টারনেট</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${scaleMap[size]} ${className}`}>
      {/* Iconic SCN Swoosh + Red WiFi Arcs Logo */}
      <div className="relative shrink-0 flex flex-col items-center">
        <svg
          viewBox="0 0 190 98"
          className={size === 'sm' ? 'w-24 h-12' : size === 'lg' || size === 'xl' ? 'w-36 h-18' : 'w-32 h-16'}
          fill="none"
        >
          {/* Upper Red Arc */}
          <path
            d="M22 44 C42 15, 105 10, 134 20 C98 4, 34 10, 14 48 Z"
            fill="#ef4444"
          />
          {/* Main SCN Italic Typography */}
          <text
            x="24"
            y="64"
            fill={isLightBg ? '#0a3380' : '#ffffff'}
            fontWeight="900"
            fontStyle="italic"
            fontSize="46"
            fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
            letterSpacing="-2"
          >
            SCN
          </text>
          {/* Lower Swoosh Arc */}
          <path
            d="M10 62 C36 88, 128 86, 152 62 C120 79, 44 80, 18 54 Z"
            fill={isLightBg ? '#0d47a1' : '#38bdf8'}
          />
          {/* Red Wi-Fi Signal Arcs (Top Right of N) */}
          <circle cx="145" cy="40" r="4" fill="#ef4444" />
          <path d="M148 27 A16 16 0 0 1 163 42" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M151 16 A27 27 0 0 1 174 39" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" />
          {/* Connecting People... Subtitle */}
          <text
            x="64"
            y="92"
            fill={isLightBg ? '#092b6b' : '#e0f2fe'}
            fontStyle="italic"
            fontWeight="600"
            fontSize="12.5"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            Connecting People...
          </text>
        </svg>
      </div>

      {/* Vertical Divider */}
      <div className={`w-[2px] h-12 sm:h-14 rounded-full ${isLightBg ? 'bg-slate-400/70' : 'bg-white/40'}`}></div>

      {/* Brand Name & Taglines */}
      <div className="flex flex-col justify-center">
        <div className="font-black tracking-tight leading-none text-lg sm:text-2xl md:text-[26px]">
          <span className={isLightBg ? 'text-[#092b6b]' : 'text-white'}>Shilok </span>
          <span className={isLightBg ? 'text-[#0a43a8]' : 'text-amber-300'}>Cable Network</span>
        </div>
        {showTagline && (
          <div className={`mt-1 flex flex-wrap items-center gap-x-2 text-[11px] sm:text-xs font-semibold italic ${isLightBg ? 'text-[#0d3b8c]' : 'text-sky-100'}`}>
            <span>Fast • Reliable • For a Better Tomorrow</span>
            <span className={`not-italic font-bold px-2 py-0.5 rounded-full text-[10px] ${isLightBg ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-white/15 text-amber-300 border border-white/20'}`}>
              সবার জন্য ইন্টারনেট
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
