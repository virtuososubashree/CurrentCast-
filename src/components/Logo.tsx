import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeMap = {
    sm: { icon: 36, title: 'text-base', sub: 'text-[9px]' },
    md: { icon: 44, title: 'text-xl', sub: 'text-[11px]' },
    lg: { icon: 56, title: 'text-2xl', sub: 'text-xs' },
    hero: { icon: 84, title: 'text-3xl', sub: 'text-sm' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Circular Emblem matching Logo Image */}
      <div 
        className="relative shrink-0 flex items-center justify-center rounded-full bg-[#1A222D] shadow-md border border-[#2E3A4B]"
        style={{ width: current.icon, height: current.icon }}
      >
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circular Dark Border Ring */}
          <circle cx="80" cy="80" r="72" stroke="#4285F4" strokeWidth="8" fill="#121820" />

          {/* Cloud with Rain/Lightning on Top Left */}
          <path
            d="M48 62 C43 62 38 58 38 52 C38 46 43 42 49 42 C51 36 57 32 64 32 C72 32 78 37 80 43 C83 43 87 46 87 50 C87 56 82 62 76 62 Z"
            fill="#64748B"
          />

          {/* Yellow Lightning Bolt */}
          <path
            d="M58 58 L46 76 L55 76 L48 94 L68 72 L58 72 Z"
            fill="#FBBC05"
            stroke="#D97706"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Blackout ZZZ Letters */}
          <text x="88" y="58" fontFamily="sans-serif" fontWeight="900" fontSize="13" fill="#94A3B8">z</text>
          <text x="96" y="48" fontFamily="sans-serif" fontWeight="900" fontSize="16" fill="#CBD5E1">z</text>
          <text x="107" y="38" fontFamily="sans-serif" fontWeight="900" fontSize="22" fill="#FBBC05">Z</text>

          {/* Transmission Tower / Electrical Pylon */}
          {/* Main Top Spike */}
          <path d="M80 44 L80 56" stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" />
          
          {/* Top Crossarm */}
          <path d="M62 68 L98 68" stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" />
          {/* Middle Crossarm */}
          <path d="M54 84 L106 84" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
          {/* Lower Crossarm */}
          <path d="M48 100 L112 100" stroke="#94A3B8" strokeWidth="5.5" strokeLinecap="round" />

          {/* Main Legs (Tapered) */}
          <path d="M78 56 L52 136" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round" />
          <path d="M82 56 L108 136" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round" />

          {/* Internal Cross Lattice */}
          <path d="M68 68 L92 84" stroke="#64748B" strokeWidth="3" />
          <path d="M92 68 L68 84" stroke="#64748B" strokeWidth="3" />
          <path d="M61 84 L99 100" stroke="#64748B" strokeWidth="3" />
          <path d="M99 84 L61 100" stroke="#64748B" strokeWidth="3" />
          <path d="M55 100 L105 120" stroke="#64748B" strokeWidth="3.5" />
          <path d="M105 100 L55 120" stroke="#64748B" strokeWidth="3.5" />
          <path d="M52 120 L108 120" stroke="#E2E8F0" strokeWidth="4" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className={`font-black tracking-tight text-white ${current.title}`}>
              CurrentCa
            </span>
            <span className={`font-black text-[#FBBC05] inline-flex items-center ${current.title}`}>
              ⚡
            </span>
            <span className={`font-black tracking-tight text-white ${current.title}`}>
              t
            </span>
          </div>
          <span className={`font-extrabold tracking-wider text-slate-400 uppercase ${current.sub}`}>
            Weather Report For Blackouts
          </span>
        </div>
      )}
    </div>
  );
};
