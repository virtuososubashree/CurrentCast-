import React from 'react';

interface BackdropVectorSceneProps {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  isOutage?: boolean;
}

export const BackdropVectorScene: React.FC<BackdropVectorSceneProps> = ({ timeOfDay, isOutage }) => {
  if (timeOfDay === 'morning') {
    return (
      <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#FFF3D6] via-[#E2F0FD] to-[#CBE5FF] select-none">
        {/* Morning Dawn: High-voltage transmission pylon, morning sunrise glow, substation transformer with warning badges, wind turbines on the horizon, and on-site electrical engineers */}
        <svg className="w-full h-full" viewBox="0 0 1000 380" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="m-sky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFE6B3" />
              <stop offset="30%" stopColor="#FFF2D6" />
              <stop offset="70%" stopColor="#DCEDFE" />
              <stop offset="100%" stopColor="#BFE0FF" />
            </linearGradient>
            <radialGradient id="m-sunglow" cx="72%" cy="28%" r="45%">
              <stop offset="0%" stopColor="#FFC837" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#FFA034" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FFE8A3" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="m-hill1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#52C41A" />
              <stop offset="100%" stopColor="#237804" />
            </linearGradient>
            <linearGradient id="m-hill2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#73D13D" />
              <stop offset="100%" stopColor="#389E0D" />
            </linearGradient>
            <linearGradient id="pylon-metal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>

          {/* Sky background */}
          <rect width="1000" height="380" fill="url(#m-sky)" />

          {/* Morning Sunrise Glow & Sun Orb */}
          <circle cx="720" cy="100" r="150" fill="url(#m-sunglow)" />
          <circle cx="720" cy="100" r="44" fill="#FFB800" />
          <circle cx="720" cy="100" r="36" fill="#FFE169" />

          {/* Sunrise Light Beams */}
          <line x1="720" y1="100" x2="600" y2="0" stroke="#FFE79A" strokeWidth="2" opacity="0.4" />
          <line x1="720" y1="100" x2="840" y2="0" stroke="#FFE79A" strokeWidth="2" opacity="0.4" />
          <line x1="720" y1="100" x2="520" y2="120" stroke="#FFE79A" strokeWidth="2" opacity="0.3" />
          <line x1="720" y1="100" x2="920" y2="130" stroke="#FFE79A" strokeWidth="2" opacity="0.3" />

          {/* Gentle morning clouds */}
          <path d="M 60 90 Q 90 65 130 80 Q 170 65 200 80 Q 220 100 200 120 L 70 120 Q 45 110 60 90 Z" fill="#FFFFFF" opacity="0.85" />
          <path d="M 360 70 Q 390 50 430 65 Q 470 50 495 65 Q 515 80 495 100 L 370 100 Q 345 90 360 70 Z" fill="#FFFFFF" opacity="0.75" />

          {/* Distant Hills */}
          <path d="M 0 250 Q 200 220 400 240 Q 650 210 1000 245 L 1000 380 L 0 380 Z" fill="#91D5FF" opacity="0.4" />
          <path d="M 0 270 Q 300 240 600 265 Q 850 240 1000 270 L 1000 380 L 0 380 Z" fill="#69C0FF" opacity="0.35" />

          {/* Wind Turbines on the Horizon */}
          <g transform="translate(130, 160) scale(0.85)">
            <line x1="0" y1="90" x2="0" y2="0" stroke="#64748B" strokeWidth="3" />
            <circle cx="0" cy="0" r="4" fill="#334155" />
            <line x1="0" y1="0" x2="-35" y2="-20" stroke="#64748B" strokeWidth="2.5" />
            <line x1="0" y1="0" x2="35" y2="-15" stroke="#64748B" strokeWidth="2.5" />
            <line x1="0" y1="0" x2="0" y2="38" stroke="#64748B" strokeWidth="2.5" />
          </g>
          <g transform="translate(230, 180) scale(0.65)">
            <line x1="0" y1="90" x2="0" y2="0" stroke="#94A3B8" strokeWidth="3" />
            <circle cx="0" cy="0" r="4" fill="#64748B" />
            <line x1="0" y1="0" x2="-30" y2="-20" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="0" y1="0" x2="30" y2="-15" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="0" y1="0" x2="0" y2="35" stroke="#94A3B8" strokeWidth="2.5" />
          </g>
          <g transform="translate(860, 175) scale(0.7)">
            <line x1="0" y1="90" x2="0" y2="0" stroke="#64748B" strokeWidth="3" />
            <circle cx="0" cy="0" r="4" fill="#334155" />
            <line x1="0" y1="0" x2="-35" y2="-20" stroke="#64748B" strokeWidth="2.5" />
            <line x1="0" y1="0" x2="35" y2="-15" stroke="#64748B" strokeWidth="2.5" />
            <line x1="0" y1="0" x2="0" y2="38" stroke="#64748B" strokeWidth="2.5" />
          </g>

          {/* Secondary Pylon (Left background) */}
          <g transform="translate(60, 90) scale(0.7)">
            <line x1="45" y1="15" x2="10" y2="240" stroke="#334155" strokeWidth="3.5" />
            <line x1="45" y1="15" x2="80" y2="240" stroke="#334155" strokeWidth="3.5" />
            <line x1="-5" y1="65" x2="95" y2="65" stroke="#334155" strokeWidth="3" />
            <line x1="-15" y1="115" x2="105" y2="115" stroke="#334155" strokeWidth="3" />
            <line x1="30" y1="65" x2="60" y2="115" stroke="#475569" strokeWidth="2" />
            <line x1="60" y1="65" x2="30" y2="115" stroke="#475569" strokeWidth="2" />
          </g>

          {/* Secondary Pylon (Right background) */}
          <g transform="translate(760, 95) scale(0.7)">
            <line x1="45" y1="15" x2="10" y2="240" stroke="#334155" strokeWidth="3.5" />
            <line x1="45" y1="15" x2="80" y2="240" stroke="#334155" strokeWidth="3.5" />
            <line x1="-5" y1="65" x2="95" y2="65" stroke="#334155" strokeWidth="3" />
            <line x1="-15" y1="115" x2="105" y2="115" stroke="#334155" strokeWidth="3" />
            <line x1="30" y1="65" x2="60" y2="115" stroke="#475569" strokeWidth="2" />
            <line x1="60" y1="65" x2="30" y2="115" stroke="#475569" strokeWidth="2" />
          </g>

          {/* Central High-Voltage Steel Lattice Pylon */}
          <g transform="translate(420, 45)">
            {/* Main Pylon Legs */}
            <line x1="70" y1="15" x2="20" y2="270" stroke="url(#pylon-metal)" strokeWidth="4.5" />
            <line x1="70" y1="15" x2="120" y2="270" stroke="url(#pylon-metal)" strokeWidth="4.5" />
            
            {/* Pylon Crossarms with extended cable hang points */}
            <line x1="10" y1="70" x2="130" y2="70" stroke="url(#pylon-metal)" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="-5" y1="125" x2="145" y2="125" stroke="url(#pylon-metal)" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="15" y1="180" x2="125" y2="180" stroke="url(#pylon-metal)" strokeWidth="4.5" strokeLinecap="round" />

            {/* Lattice Cross Braces */}
            <line x1="50" y1="70" x2="90" y2="125" stroke="#2563EB" strokeWidth="2.5" />
            <line x1="90" y1="70" x2="50" y2="125" stroke="#2563EB" strokeWidth="2.5" />
            <line x1="45" y1="125" x2="95" y2="180" stroke="#2563EB" strokeWidth="2.5" />
            <line x1="95" y1="125" x2="45" y2="180" stroke="#2563EB" strokeWidth="2.5" />
            <line x1="38" y1="180" x2="102" y2="235" stroke="#2563EB" strokeWidth="2.5" />
            <line x1="102" y1="180" x2="38" y2="235" stroke="#2563EB" strokeWidth="2.5" />

            {/* Red Ceramic Insulators */}
            <rect x="8" y="70" width="5" height="15" fill="#DC2626" rx="1.5" />
            <rect x="127" y="70" width="5" height="15" fill="#DC2626" rx="1.5" />
            <rect x="-7" y="125" width="5" height="15" fill="#DC2626" rx="1.5" />
            <rect x="142" y="125" width="5" height="15" fill="#DC2626" rx="1.5" />
          </g>

          {/* Transmission Power Lines Swagging Across Towers */}
          <path d="M 60 140 Q 250 190 430 115" fill="none" stroke="#1D4ED8" strokeWidth="2.5" strokeDasharray={isOutage ? "5 5" : "none"} />
          <path d="M 50 175 Q 240 225 415 170" fill="none" stroke="#1D4ED8" strokeWidth="2.5" strokeDasharray={isOutage ? "5 5" : "none"} />
          <path d="M 565 115 Q 700 185 810 140" fill="none" stroke="#1D4ED8" strokeWidth="2.5" strokeDasharray={isOutage ? "5 5" : "none"} />
          <path d="M 560 170 Q 690 220 805 175" fill="none" stroke="#1D4ED8" strokeWidth="2.5" strokeDasharray={isOutage ? "5 5" : "none"} />

          {/* Foreground Green Rolling Hills */}
          <path d="M 0 295 Q 260 260 520 290 Q 770 315 1000 280 L 1000 380 L 0 380 Z" fill="url(#m-hill2)" />
          <path d="M 0 325 Q 360 295 720 330 Q 860 345 1000 320 L 1000 380 L 0 380 Z" fill="url(#m-hill1)" />

          {/* Substation Transformer with Warning Badges */}
          <g transform="translate(620, 225)">
            <rect x="0" y="30" width="135" height="80" fill="#1E40AF" rx="8" stroke="#0F172A" strokeWidth="3" />
            {/* Cooling Fin Lines */}
            <line x1="18" y1="42" x2="18" y2="100" stroke="#0F172A" strokeWidth="3" />
            <line x1="32" y1="42" x2="32" y2="100" stroke="#0F172A" strokeWidth="3" />
            <line x1="46" y1="42" x2="46" y2="100" stroke="#0F172A" strokeWidth="3" />
            <line x1="60" y1="42" x2="60" y2="100" stroke="#0F172A" strokeWidth="3" />
            <line x1="74" y1="42" x2="74" y2="100" stroke="#0F172A" strokeWidth="3" />
            {/* Top High Voltage Bushings */}
            <rect x="25" y="8" width="14" height="22" fill="#E2E8F0" stroke="#475569" strokeWidth="2" rx="2" />
            <rect x="62" y="8" width="14" height="22" fill="#E2E8F0" stroke="#475569" strokeWidth="2" rx="2" />
            <rect x="98" y="8" width="14" height="22" fill="#E2E8F0" stroke="#475569" strokeWidth="2" rx="2" />
            {/* Yellow High-Voltage Triangle Warning Badge */}
            <polygon points="110,48 126,75 94,75" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
            <path d="M 110 56 L 107 65 L 111 65 L 108 72" stroke="#000000" strokeWidth="2" fill="none" />
            <text x="96" y="88" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">DANGER</text>
          </g>

          {/* On-Site Electrical Engineers in Safety Uniforms */}
          {/* Engineer 1 (Holding tablet/diagnostics) */}
          <g transform="translate(280, 230)">
            <rect x="20" y="70" width="8" height="38" fill="#1E3A8A" rx="3" />
            <rect x="32" y="70" width="8" height="38" fill="#1E3A8A" rx="3" />
            <rect x="16" y="102" width="14" height="8" fill="#78350F" rx="2" />
            <rect x="32" y="102" width="14" height="8" fill="#78350F" rx="2" />
            <rect x="16" y="24" width="28" height="50" fill="#EA580C" rx="6" />
            {/* Hi-Vis Reflective Strips */}
            <line x1="16" y1="40" x2="44" y2="40" stroke="#FEF08A" strokeWidth="3.5" />
            <line x1="16" y1="55" x2="44" y2="55" stroke="#FEF08A" strokeWidth="3.5" />
            {/* Hardhat and Head */}
            <circle cx="30" cy="14" r="10" fill="#FDE68A" />
            <path d="M 17 10 Q 30 -2 43 10 L 46 13 L 14 13 Z" fill="#EAB308" />
            {/* Diagnostics Tablet */}
            <rect x="42" y="30" width="16" height="22" fill="#E2E8F0" stroke="#334155" strokeWidth="1.5" rx="2" />
            <line x1="45" y1="35" x2="55" y2="35" stroke="#2563EB" strokeWidth="1.5" />
            <line x1="45" y1="40" x2="55" y2="40" stroke="#64748B" strokeWidth="1.5" />
          </g>

          {/* Engineer 2 (Inspecting / pointing) */}
          <g transform="translate(360, 238) scale(0.95)">
            <rect x="20" y="70" width="8" height="38" fill="#1E3A8A" rx="3" />
            <rect x="32" y="70" width="8" height="38" fill="#1E3A8A" rx="3" />
            <rect x="16" y="102" width="14" height="8" fill="#78350F" rx="2" />
            <rect x="32" y="102" width="14" height="8" fill="#78350F" rx="2" />
            <rect x="16" y="24" width="28" height="50" fill="#2563EB" rx="6" />
            <line x1="16" y1="40" x2="44" y2="40" stroke="#FEF08A" strokeWidth="3.5" />
            <circle cx="30" cy="14" r="10" fill="#FDE68A" />
            <path d="M 17 10 Q 30 -2 43 10 L 46 13 L 14 13 Z" fill="#EAB308" />
            <line x1="44" y1="32" x2="62" y2="18" stroke="#FDE68A" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    );
  }

  if (timeOfDay === 'afternoon') {
    return (
      <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#2563EB] via-[#38BDF8] to-[#E0F2FE] select-none">
        {/* Midday / Afternoon: Crisp azure sky, bright midday sun, multi-bank solar panel array with battery storage indicators, and utility technicians servicing the grid */}
        <svg className="w-full h-full" viewBox="0 0 1000 380" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="a-sky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="35%" stopColor="#38BDF8" />
              <stop offset="80%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#F0F9FF" />
            </linearGradient>
            <linearGradient id="a-sunbeam" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="35%" stopColor="#FBBF24" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="solar-cell" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>

          {/* Sky background */}
          <rect width="1000" height="380" fill="url(#a-sky)" />

          {/* Radiant Midday Sun */}
          <circle cx="500" cy="50" r="160" fill="url(#a-sunbeam)" />
          <circle cx="500" cy="50" r="48" fill="#FFFBEB" />
          <circle cx="500" cy="50" r="40" fill="#FEF08A" />

          {/* Crisp White Cumulus Clouds */}
          <path d="M 80 65 Q 115 35 155 55 Q 195 35 235 55 Q 255 75 235 95 L 90 95 Q 65 85 80 65 Z" fill="#FFFFFF" opacity="0.9" />
          <path d="M 740 75 Q 775 45 815 65 Q 855 45 895 65 Q 915 85 895 105 L 750 105 Q 725 95 740 75 Z" fill="#FFFFFF" opacity="0.9" />

          {/* High Voltage Grid Pylons in background */}
          <g transform="translate(180, 85) scale(0.65)">
            <line x1="50" y1="20" x2="15" y2="240" stroke="#0F172A" strokeWidth="4" />
            <line x1="50" y1="20" x2="85" y2="240" stroke="#0F172A" strokeWidth="4" />
            <line x1="0" y1="70" x2="100" y2="70" stroke="#0F172A" strokeWidth="3.5" />
            <line x1="-10" y1="120" x2="110" y2="120" stroke="#0F172A" strokeWidth="3.5" />
          </g>
          <g transform="translate(760, 85) scale(0.65)">
            <line x1="50" y1="20" x2="15" y2="240" stroke="#0F172A" strokeWidth="4" />
            <line x1="50" y1="20" x2="85" y2="240" stroke="#0F172A" strokeWidth="4" />
            <line x1="0" y1="70" x2="100" y2="70" stroke="#0F172A" strokeWidth="3.5" />
            <line x1="-10" y1="120" x2="110" y2="120" stroke="#0F172A" strokeWidth="3.5" />
          </g>

          {/* High Voltage Interconnect Lines */}
          <path d="M 0 150 Q 200 200 500 130 Q 750 200 1000 150" fill="none" stroke="#1D4ED8" strokeWidth="2.5" />
          <path d="M 0 180 Q 200 230 500 160 Q 750 230 1000 180" fill="none" stroke="#1D4ED8" strokeWidth="2.5" />

          {/* Clean Landscape Ground */}
          <path d="M 0 240 Q 300 220 600 245 Q 850 260 1000 235 L 1000 380 L 0 380 Z" fill="#16A34A" />
          <path d="M 0 270 Q 400 250 800 280 L 1000 260 L 1000 380 L 0 380 Z" fill="#15803D" />

          {/* Multi-Bank Solar Panel Array 1 (Left) */}
          <g transform="translate(50, 230)">
            <line x1="30" y1="65" x2="30" y2="95" stroke="#334155" strokeWidth="5" />
            <line x1="130" y1="65" x2="130" y2="95" stroke="#334155" strokeWidth="5" />
            <polygon points="0,65 160,65 148,15 12,15" fill="url(#solar-cell)" stroke="#E2E8F0" strokeWidth="2.5" />
            <line x1="40" y1="15" x2="40" y2="65" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="80" y1="15" x2="80" y2="65" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="120" y1="15" x2="120" y2="65" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="6" y1="40" x2="154" y2="40" stroke="#E2E8F0" strokeWidth="1" />
          </g>

          {/* Multi-Bank Solar Panel Array 2 (Center-Left) */}
          <g transform="translate(235, 240)">
            <line x1="35" y1="70" x2="35" y2="100" stroke="#334155" strokeWidth="5" />
            <line x1="145" y1="70" x2="145" y2="100" stroke="#334155" strokeWidth="5" />
            <polygon points="0,70 180,70 166,15 14,15" fill="url(#solar-cell)" stroke="#E2E8F0" strokeWidth="2.5" />
            <line x1="45" y1="15" x2="45" y2="70" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="90" y1="15" x2="90" y2="70" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="135" y1="15" x2="135" y2="70" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="7" y1="42" x2="173" y2="42" stroke="#E2E8F0" strokeWidth="1" />
          </g>

          {/* Multi-Bank Solar Panel Array 3 (Right) */}
          <g transform="translate(730, 235)">
            <line x1="35" y1="70" x2="35" y2="100" stroke="#334155" strokeWidth="5" />
            <line x1="145" y1="70" x2="145" y2="100" stroke="#334155" strokeWidth="5" />
            <polygon points="0,70 180,70 166,15 14,15" fill="url(#solar-cell)" stroke="#E2E8F0" strokeWidth="2.5" />
            <line x1="45" y1="15" x2="45" y2="70" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="90" y1="15" x2="90" y2="70" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="135" y1="15" x2="135" y2="70" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="7" y1="42" x2="173" y2="42" stroke="#E2E8F0" strokeWidth="1" />
          </g>

          {/* Grid Battery Storage Unit with Active Battery Indicators */}
          <g transform="translate(485, 230)">
            <rect x="0" y="20" width="165" height="95" fill="#1E293B" rx="10" stroke="#0F172A" strokeWidth="3.5" />
            <rect x="15" y="32" width="135" height="24" fill="#334155" rx="6" />
            {/* Battery Level Indicators (5 Green Bars) */}
            <rect x="25" y="38" width="18" height="12" fill="#22C55E" rx="3" />
            <rect x="48" y="38" width="18" height="12" fill="#22C55E" rx="3" />
            <rect x="71" y="38" width="18" height="12" fill="#22C55E" rx="3" />
            <rect x="94" y="38" width="18" height="12" fill="#22C55E" rx="3" />
            <rect x="117" y="38" width="18" height="12" fill="#22C55E" rx="3" />
            {/* Storage Metric Label */}
            <circle cx="82" cy="85" r="18" fill="#2563EB" />
            <polygon points="82,73 75,86 83,86 80,97 90,83 83,83" fill="#FACC15" />
            <text x="108" y="90" fill="#94A3B8" fontSize="9" fontWeight="bold">98% BESS</text>
          </g>

          {/* Utility Technicians Servicing the Grid */}
          <g transform="translate(435, 255)">
            <rect x="10" y="48" width="7" height="32" fill="#1E3A8A" rx="2.5" />
            <rect x="20" y="48" width="7" height="32" fill="#1E3A8A" rx="2.5" />
            <rect x="8" y="16" width="22" height="34" fill="#0284C7" rx="5" />
            <line x1="8" y1="28" x2="30" y2="28" stroke="#FEF08A" strokeWidth="3" />
            <circle cx="19" cy="8" r="8" fill="#FDE68A" />
            <path d="M 10 5 Q 19 -3 28 5 Z" fill="#FACC15" />
            <line x1="30" y1="24" x2="48" y2="14" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" />
          </g>

          <g transform="translate(685, 250)">
            <rect x="10" y="48" width="7" height="32" fill="#1E3A8A" rx="2.5" />
            <rect x="20" y="48" width="7" height="32" fill="#1E3A8A" rx="2.5" />
            <rect x="8" y="16" width="22" height="34" fill="#EA580C" rx="5" />
            <line x1="8" y1="28" x2="30" y2="28" stroke="#FEF08A" strokeWidth="3" />
            <circle cx="19" cy="8" r="8" fill="#FDE68A" />
            <path d="M 10 5 Q 19 -3 28 5 Z" fill="#FACC15" />
          </g>
        </svg>
      </div>
    );
  }

  if (timeOfDay === 'evening') {
    return (
      <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#4A154B] via-[#C2410C] to-[#FDE047] select-none">
        {/* Twilight / Evening Sunset: Golden-orange and violet sunset sky, high-voltage steel lattice transmission structures, insulators, and substation transformer bays */}
        <svg className="w-full h-full" viewBox="0 0 1000 380" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="e-sky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B0764" />
              <stop offset="25%" stopColor="#7E22CE" />
              <stop offset="55%" stopColor="#C2410C" />
              <stop offset="80%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>
            <linearGradient id="e-sunglow" cx="50%" cy="85%" r="65%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="35%" stopColor="#F97316" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#9A3412" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Twilight Sunset Gradient Sky */}
          <rect width="1000" height="380" fill="url(#e-sky)" />

          {/* Sunset Horizon Sun Glow */}
          <circle cx="500" cy="260" r="230" fill="url(#e-sunglow)" />
          <circle cx="500" cy="260" r="65" fill="#FEF08A" />

          {/* Sunset Clouds Silhouette */}
          <path d="M 0 150 Q 200 110 400 140 Q 600 120 800 150 L 1000 130 L 1000 190 L 0 190 Z" fill="#581C87" opacity="0.45" />
          <path d="M 50 170 Q 250 140 450 160 Q 700 130 950 170 L 1000 220 L 0 220 Z" fill="#9A3412" opacity="0.35" />

          {/* High-Voltage Steel Lattice Transmission Structures */}
          {/* Structure 1 (Left) */}
          <g transform="translate(130, 45)">
            <line x1="80" y1="15" x2="30" y2="280" stroke="#0F172A" strokeWidth="4.5" />
            <line x1="80" y1="15" x2="130" y2="280" stroke="#0F172A" strokeWidth="4.5" />
            <line x1="10" y1="75" x2="150" y2="75" stroke="#0F172A" strokeWidth="4.5" />
            <line x1="0" y1="135" x2="160" y2="135" stroke="#0F172A" strokeWidth="4.5" />
            <line x1="20" y1="195" x2="140" y2="195" stroke="#0F172A" strokeWidth="4.5" />
            <line x1="55" y1="75" x2="105" y2="135" stroke="#1E293B" strokeWidth="2.5" />
            <line x1="105" y1="75" x2="55" y2="135" stroke="#1E293B" strokeWidth="2.5" />
            <line x1="50" y1="135" x2="110" y2="195" stroke="#1E293B" strokeWidth="2.5" />
            <line x1="110" y1="135" x2="50" y2="195" stroke="#1E293B" strokeWidth="2.5" />
            {/* Hanging Ceramic Insulators */}
            <rect x="8" y="75" width="6" height="16" fill="#FDE047" rx="1.5" />
            <rect x="146" y="75" width="6" height="16" fill="#FDE047" rx="1.5" />
            <rect x="-2" y="135" width="6" height="16" fill="#FDE047" rx="1.5" />
            <rect x="156" y="135" width="6" height="16" fill="#FDE047" rx="1.5" />
          </g>

          {/* Structure 2 (Center Heavy Lattice Tower) */}
          <g transform="translate(420, 25)">
            <line x1="90" y1="10" x2="35" y2="300" stroke="#0F172A" strokeWidth="5" />
            <line x1="90" y1="10" x2="145" y2="300" stroke="#0F172A" strokeWidth="5" />
            <line x1="10" y1="65" x2="170" y2="65" stroke="#0F172A" strokeWidth="5" />
            <line x1="0" y1="125" x2="180" y2="125" stroke="#0F172A" strokeWidth="5" />
            <line x1="15" y1="185" x2="165" y2="185" stroke="#0F172A" strokeWidth="5" />
            <line x1="60" y1="65" x2="120" y2="125" stroke="#1E293B" strokeWidth="3" />
            <line x1="120" y1="65" x2="60" y2="125" stroke="#1E293B" strokeWidth="3" />
            <line x1="55" y1="125" x2="125" y2="185" stroke="#1E293B" strokeWidth="3" />
            <line x1="125" y1="125" x2="55" y2="185" stroke="#1E293B" strokeWidth="3" />
            {/* Hanging Ceramic Insulators */}
            <rect x="8" y="65" width="6" height="18" fill="#FDE047" rx="1.5" />
            <rect x="166" y="65" width="6" height="18" fill="#FDE047" rx="1.5" />
            <rect x="-2" y="125" width="6" height="18" fill="#FDE047" rx="1.5" />
            <rect x="176" y="125" width="6" height="18" fill="#FDE047" rx="1.5" />
          </g>

          {/* Structure 3 (Right) */}
          <g transform="translate(730, 55)">
            <line x1="70" y1="15" x2="25" y2="270" stroke="#0F172A" strokeWidth="4.5" />
            <line x1="70" y1="15" x2="115" y2="270" stroke="#0F172A" strokeWidth="4.5" />
            <line x1="10" y1="70" x2="130" y2="70" stroke="#0F172A" strokeWidth="4.5" />
            <line x1="0" y1="130" x2="140" y2="130" stroke="#0F172A" strokeWidth="4.5" />
            <line x1="50" y1="70" x2="90" y2="130" stroke="#1E293B" strokeWidth="2.5" />
            <line x1="90" y1="70" x2="50" y2="130" stroke="#1E293B" strokeWidth="2.5" />
            <rect x="8" y="70" width="6" height="16" fill="#FDE047" rx="1.5" />
            <rect x="126" y="70" width="6" height="16" fill="#FDE047" rx="1.5" />
          </g>

          {/* Transmission Power Lines Across Sunset */}
          <path d="M 0 140 Q 220 220 430 90 Q 650 220 1000 140" fill="none" stroke="#0F172A" strokeWidth="3" />
          <path d="M 0 200 Q 220 270 420 150 Q 650 270 1000 200" fill="none" stroke="#0F172A" strokeWidth="3" />

          {/* Substation Ground & Concrete Pad */}
          <path d="M 0 300 Q 300 280 600 300 L 1000 280 L 1000 380 L 0 380 Z" fill="#15803D" />
          <path d="M 0 320 L 1000 320 L 1000 380 L 0 380 Z" fill="#166534" />

          {/* Substation Transformer Bays & Circuit Breakers */}
          <g transform="translate(30, 260)">
            <rect x="0" y="20" width="85" height="55" fill="#1E293B" rx="4" stroke="#0F172A" strokeWidth="2.5" />
            <line x1="15" y1="0" x2="15" y2="20" stroke="#F1F5F9" strokeWidth="5" />
            <line x1="42" y1="0" x2="42" y2="20" stroke="#F1F5F9" strokeWidth="5" />
            <line x1="70" y1="0" x2="70" y2="20" stroke="#F1F5F9" strokeWidth="5" />
          </g>

          <g transform="translate(600, 250)">
            <rect x="0" y="25" width="145" height="65" fill="#0F172A" rx="6" stroke="#020617" strokeWidth="3" />
            <line x1="25" y1="0" x2="25" y2="25" stroke="#F8FAFC" strokeWidth="6" />
            <line x1="60" y1="0" x2="60" y2="25" stroke="#F8FAFC" strokeWidth="6" />
            <line x1="95" y1="0" x2="95" y2="25" stroke="#F8FAFC" strokeWidth="6" />
            <line x1="125" y1="0" x2="125" y2="25" stroke="#F8FAFC" strokeWidth="6" />
          </g>

          <g transform="translate(800, 265)">
            <rect x="0" y="15" width="130" height="55" fill="#1E293B" rx="4" stroke="#0F172A" strokeWidth="2.5" />
            <line x1="28" y1="0" x2="28" y2="15" stroke="#F1F5F9" strokeWidth="5" />
            <line x1="65" y1="0" x2="65" y2="15" stroke="#F1F5F9" strokeWidth="5" />
            <line x1="102" y1="0" x2="102" y2="15" stroke="#F1F5F9" strokeWidth="5" />
          </g>
        </svg>
      </div>
    );
  }

  // Nightlife / City Skyline: Sapphire blue night sky with thousands of illuminated skyscraper office and residential windows connected to glowing distribution lines
  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#030712] via-[#0F172A] to-[#1E3A8A] select-none">
      <svg className="w-full h-full" viewBox="0 0 1000 380" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="n-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#020617" />
            <stop offset="35%" stopColor="#0A192F" />
            <stop offset="70%" stopColor="#172554" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <radialGradient id="n-moonglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#93C5FD" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sapphire Blue Night Sky */}
        <rect width="1000" height="380" fill="url(#n-sky)" />

        {/* Crescent Moon & Ambient Moonlight Halo */}
        <circle cx="850" cy="75" r="95" fill="url(#n-moonglow)" />
        <circle cx="850" cy="75" r="32" fill="#F8FAFC" />
        <circle cx="862" cy="70" r="28" fill="#0A192F" />

        {/* Twinkling Night Stars */}
        <circle cx="80" cy="40" r="1.5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="160" cy="80" r="1.5" fill="#FFFFFF" opacity="0.8" />
        <circle cx="260" cy="30" r="2" fill="#FFFFFF" opacity="0.95" />
        <circle cx="380" cy="65" r="1" fill="#FFFFFF" opacity="0.7" />
        <circle cx="490" cy="35" r="2" fill="#FFFFFF" opacity="0.85" />
        <circle cx="620" cy="60" r="1.5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="720" cy="25" r="2" fill="#FFFFFF" opacity="0.85" />
        <circle cx="950" cy="45" r="1.5" fill="#FFFFFF" opacity="0.8" />

        {/* Background Skyline Skyscrapers */}
        <g fill="#0B1C38" opacity="0.75">
          <rect x="35" y="130" width="55" height="250" />
          <rect x="105" y="100" width="70" height="280" />
          <rect x="195" y="140" width="60" height="240" />
          <rect x="275" y="80" width="80" height="300" />
          <rect x="375" y="120" width="65" height="260" />
          <rect x="460" y="70" width="90" height="310" />
          <rect x="575" y="110" width="70" height="270" />
          <rect x="665" y="85" width="85" height="295" />
          <rect x="775" y="130" width="60" height="250" />
          <rect x="855" y="100" width="75" height="280" />
        </g>

        {/* Foreground High-Rise Towers */}
        <g fill="#061124">
          <rect x="20" y="170" width="80" height="210" stroke="#1D4ED8" strokeWidth="1" />
          <rect x="120" y="150" width="90" height="230" stroke="#1D4ED8" strokeWidth="1" />
          <rect x="230" y="120" width="100" height="260" stroke="#1D4ED8" strokeWidth="1" />
          <rect x="350" y="160" width="95" height="220" stroke="#1D4ED8" strokeWidth="1" />
          <rect x="470" y="110" width="110" height="270" stroke="#1D4ED8" strokeWidth="1" />
          <rect x="600" y="140" width="100" height="240" stroke="#1D4ED8" strokeWidth="1" />
          <rect x="720" y="170" width="85" height="210" stroke="#1D4ED8" strokeWidth="1" />
          <rect x="830" y="130" width="110" height="250" stroke="#1D4ED8" strokeWidth="1" />
        </g>

        {/* Illuminated Office & Residential Windows (Vibrant Electric Cyan & Warm Glow) */}
        {/* Tower 1 Windows */}
        <g fill={isOutage ? "#1E293B" : "#60A5FA"} opacity={isOutage ? 0.2 : 0.9}>
          <rect x="30" y="185" width="8" height="6" />
          <rect x="45" y="185" width="8" height="6" fill="#FDE047" />
          <rect x="60" y="185" width="8" height="6" />
          <rect x="75" y="185" width="8" height="6" />
          <rect x="30" y="205" width="8" height="6" fill="#FDE047" />
          <rect x="45" y="205" width="8" height="6" />
          <rect x="60" y="205" width="8" height="6" fill="#FDE047" />
          <rect x="75" y="205" width="8" height="6" />
          <rect x="30" y="225" width="8" height="6" />
          <rect x="60" y="225" width="8" height="6" />
          <rect x="30" y="245" width="8" height="6" fill="#FDE047" />
          <rect x="45" y="245" width="8" height="6" />
          <rect x="75" y="245" width="8" height="6" />
        </g>

        {/* Tower 2 Windows */}
        <g fill={isOutage ? "#1E293B" : "#93C5FD"} opacity={isOutage ? 0.2 : 0.95}>
          <rect x="135" y="165" width="10" height="7" fill="#FEF08A" />
          <rect x="155" y="165" width="10" height="7" />
          <rect x="175" y="165" width="10" height="7" fill="#FEF08A" />
          <rect x="135" y="185" width="10" height="7" />
          <rect x="155" y="185" width="10" height="7" fill="#FEF08A" />
          <rect x="175" y="185" width="10" height="7" />
          <rect x="135" y="205" width="10" height="7" fill="#FEF08A" />
          <rect x="175" y="205" width="10" height="7" />
          <rect x="135" y="225" width="10" height="7" />
          <rect x="155" y="225" width="10" height="7" fill="#FEF08A" />
        </g>

        {/* Center Landmark Skyscraper Windows */}
        <g fill={isOutage ? "#1E293B" : "#38BDF8"} opacity={isOutage ? 0.2 : 0.95}>
          <rect x="485" y="125" width="12" height="8" fill="#FEF08A" />
          <rect x="510" y="125" width="12" height="8" />
          <rect x="535" y="125" width="12" height="8" fill="#FEF08A" />
          <rect x="560" y="125" width="12" height="8" />
          <rect x="485" y="145" width="12" height="8" />
          <rect x="510" y="145" width="12" height="8" fill="#FEF08A" />
          <rect x="535" y="145" width="12" height="8" />
          <rect x="560" y="145" width="12" height="8" fill="#FEF08A" />
          <rect x="485" y="165" width="12" height="8" fill="#FEF08A" />
          <rect x="535" y="165" width="12" height="8" />
          <rect x="485" y="185" width="12" height="8" />
          <rect x="510" y="185" width="12" height="8" fill="#FEF08A" />
          <rect x="560" y="185" width="12" height="8" />
        </g>

        {/* Tower 6 Windows */}
        <g fill={isOutage ? "#1E293B" : "#60A5FA"} opacity={isOutage ? 0.2 : 0.9}>
          <rect x="845" y="145" width="12" height="7" fill="#FEF08A" />
          <rect x="870" y="145" width="12" height="7" />
          <rect x="895" y="145" width="12" height="7" fill="#FEF08A" />
          <rect x="845" y="165" width="12" height="7" />
          <rect x="870" y="165" width="12" height="7" fill="#FEF08A" />
          <rect x="895" y="165" width="12" height="7" />
          <rect x="845" y="185" width="12" height="7" fill="#FEF08A" />
          <rect x="870" y="185" width="12" height="7" />
        </g>

        {/* Central High-Voltage Steel Transmission Line Pylon Traversing Skyline */}
        <g transform="translate(320, 100) scale(0.85)">
          <line x1="60" y1="20" x2="20" y2="280" stroke="#38BDF8" strokeWidth="3" opacity="0.9" />
          <line x1="60" y1="20" x2="100" y2="280" stroke="#38BDF8" strokeWidth="3" opacity="0.9" />
          <line x1="0" y1="80" x2="120" y2="80" stroke="#38BDF8" strokeWidth="3.5" opacity="0.9" />
          <line x1="-10" y1="140" x2="130" y2="140" stroke="#38BDF8" strokeWidth="3.5" opacity="0.9" />
          <line x1="35" y1="80" x2="85" y2="140" stroke="#60A5FA" strokeWidth="2" opacity="0.7" />
          <line x1="85" y1="80" x2="35" y2="140" stroke="#60A5FA" strokeWidth="2" opacity="0.7" />
        </g>

        {/* Glowing Electric Grid Lines Across Metropolis */}
        <path d="M 0 160 Q 300 220 580 170 Q 780 220 1000 160" fill="none" stroke={isOutage ? "#EF4444" : "#38BDF8"} strokeWidth={isOutage ? 1.5 : 3} opacity={0.95} />
        <path d="M 0 200 Q 300 260 580 210 Q 780 260 1000 200" fill="none" stroke={isOutage ? "#EF4444" : "#60A5FA"} strokeWidth={isOutage ? 1.5 : 2.5} opacity={0.8} />
      </svg>
    </div>
  );
};
