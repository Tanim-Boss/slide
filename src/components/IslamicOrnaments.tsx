import React from 'react';

// Bismillah Arabic Calligraphy SVG
export const BismillahCalligraphy: React.FC<{ color?: string; className?: string }> = ({
  color = '#F59E0B',
  className = 'w-64 h-16',
}) => {
  return (
    <svg
      viewBox="0 0 600 120"
      className={className}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Bismillahir Rahmanir Rahim"
    >
      <defs>
        <linearGradient id="goldCalligraphyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="65%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>
        <filter id="calligraphyGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.5" />
        </filter>
      </defs>
      <g filter="url(#calligraphyGlow)" fill="url(#goldCalligraphyGrad)">
        {/* Decorative Top Flourish */}
        <path d="M 300 10 C 270 10, 250 25, 230 20 C 210 15, 200 25, 180 22 C 160 19, 150 30, 130 25 C 200 35, 400 35, 470 25 C 450 30, 440 19, 420 22 C 400 25, 390 15, 370 20 C 350 25, 330 10, 300 10 Z" opacity="0.8" />
        
        {/* Stylized Arabic Calligraphy Text Paths for Bismillah */}
        <text
          x="300"
          y="75"
          textAnchor="middle"
          fontFamily="'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', serif"
          fontSize="52"
          fontWeight="bold"
          letterSpacing="2"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </text>

        {/* Bottom decorative underline bar */}
        <path d="M 120 95 Q 300 115 480 95 Q 300 105 120 95 Z" fill="url(#goldCalligraphyGrad)" />
        <circle cx="300" cy="105" r="4" fill="#FEF08A" />
        <circle cx="270" cy="103" r="2.5" fill="#F59E0B" />
        <circle cx="330" cy="103" r="2.5" fill="#F59E0B" />
        <circle cx="240" cy="101" r="2" fill="#D97706" />
        <circle cx="360" cy="101" r="2" fill="#D97706" />
      </g>
    </svg>
  );
};

// Rabbi Zidni Ilma Calligraphy Crest
export const RabbiZidniCrest: React.FC<{ color?: string; className?: string }> = ({
  color = '#F59E0B',
  className = 'w-48 h-10',
}) => {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-amber-400" />
      <span className="text-amber-300 font-arabic text-lg tracking-wider drop-shadow-md">
        رَبِّ زِدْنِي عِلْمًا
      </span>
      <span className="text-xs text-amber-200/80 font-serif-bn">
        (হে প্রভু! আমার জ্ঞান বৃদ্ধি করে দিন)
      </span>
      <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-amber-400" />
    </div>
  );
};

// Royal Mehrab (Arch) SVG Frame
export const IslamicArchFrame: React.FC<{
  width?: number;
  height?: number;
  strokeColor?: string;
  className?: string;
}> = ({ strokeColor = '#F59E0B', className = 'w-full h-full' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 1000 1414"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="archGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="30%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>
        <filter id="archGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Outer Border with decorative corner squares */}
      <rect
        x="24"
        y="24"
        width="952"
        height="1366"
        rx="8"
        stroke="url(#archGoldGrad)"
        strokeWidth="3"
        filter="url(#archGlow)"
      />
      <rect
        x="36"
        y="36"
        width="928"
        height="1342"
        rx="6"
        stroke="url(#archGoldGrad)"
        strokeWidth="1"
        strokeDasharray="6 4"
        opacity="0.75"
      />

      {/* Classic Mehrab Pointed Arch Top */}
      <path
        d="M 80 420 
           C 80 260, 240 120, 500 70 
           C 760 120, 920 260, 920 420"
        stroke="url(#archGoldGrad)"
        strokeWidth="3.5"
        fill="none"
      />

      {/* Cusped inner arch scallops */}
      <path
        d="M 120 430
           C 120 320, 220 200, 340 150
           C 380 135, 420 115, 500 95
           C 580 115, 620 135, 660 150
           C 780 200, 880 320, 880 430"
        stroke="url(#archGoldGrad)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.6"
        fill="none"
      />

      {/* Apex Finial (কলকা / গম্বুজ চূড়া) */}
      <path
        d="M 500 50 L 506 68 L 522 68 L 509 78 L 514 94 L 500 84 L 486 94 L 491 78 L 478 68 L 494 68 Z"
        fill="url(#archGoldGrad)"
      />
      <circle cx="500" cy="40" r="4" fill="#FEF08A" />
    </svg>
  );
};

// Royal Arabesque Corner Filigree
export const CornerFiligree: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: string;
  size?: number;
}> = ({ position, color = '#F59E0B', size = 80 }) => {
  const transform = {
    'top-left': '',
    'top-right': 'scale(-1, 1) translate(-100, 0)',
    'bottom-left': 'scale(1, -1) translate(0, -100)',
    'bottom-right': 'scale(-1, -1) translate(-100, -100)',
  }[position];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="pointer-events-none select-none"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={`filigreeGold-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
      <g transform={transform}>
        {/* Main corner curves */}
        <path
          d="M 4 4 L 4 70 C 4 55, 15 45, 25 45 C 38 45, 45 38, 45 25 C 45 15, 55 4, 70 4 L 4 4 Z"
          fill={`url(#filigreeGold-${position})`}
          opacity="0.85"
        />
        {/* Filigree scrollwork */}
        <path
          d="M 12 12 Q 50 15 65 35 Q 45 35 35 45 Q 35 65 15 70"
          stroke="#FEF08A"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 22 22 Q 40 25 50 40 Q 38 40 30 50 Q 28 60 18 64"
          stroke={`url(#filigreeGold-${position})`}
          strokeWidth="1.5"
          fill="none"
        />
        {/* 8-point corner star */}
        <circle cx="24" cy="24" r="5" fill="#FEF08A" />
        <circle cx="24" cy="24" r="2.5" fill="#B45309" />
        <circle cx="75" cy="8" r="3" fill="#F59E0B" />
        <circle cx="8" cy="75" r="3" fill="#F59E0B" />
      </g>
    </svg>
  );
};

// 3D Rosette Ribbon Badge: "ভর্তি চলছে"
export const AdmissionBadgeRibbon: React.FC<{
  title?: string;
  subText?: string;
  size?: 'normal' | 'large';
}> = ({ title = 'ভর্তি চলছে!', subText = 'শিক্ষাবর্ষ ২০২৭', size = 'normal' }) => {
  const isLarge = size === 'large';
  return (
    <div className="relative inline-flex items-center justify-center group">
      {/* Outer glowing halo */}
      <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-xl animate-pulse" />

      {/* Decorative Ribbon Tails */}
      <div className="absolute -bottom-3 -left-3 w-10 h-14 bg-gradient-to-b from-amber-600 to-amber-900 -rotate-25 rounded-bl-sm shadow-md clip-ribbon-tail" />
      <div className="absolute -bottom-3 -right-3 w-10 h-14 bg-gradient-to-b from-amber-600 to-amber-900 rotate-25 rounded-br-sm shadow-md clip-ribbon-tail" />

      {/* 24-Point Gold Rosette Seal */}
      <div
        className={`relative z-10 rounded-full flex flex-col items-center justify-center text-center shadow-2xl border-4 border-amber-200/90 gold-badge-bg gold-shimmer ${
          isLarge ? 'w-36 h-36 p-2' : 'w-28 h-28 p-1.5'
        }`}
      >
        {/* Inner dotted ring */}
        <div className="absolute inset-1.5 rounded-full border border-dashed border-amber-100/70 pointer-events-none" />

        {/* Star icon */}
        <div className="text-amber-100 text-xs flex gap-0.5 mb-0.5">
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>

        {/* Title */}
        <span
          className={`font-serif-bn font-extrabold text-amber-950 tracking-tight leading-none drop-shadow-sm ${
            isLarge ? 'text-2xl' : 'text-xl'
          }`}
        >
          {title}
        </span>

        {/* Subtitle */}
        <span
          className={`font-sans-bn font-bold text-amber-900 uppercase tracking-wider mt-1 ${
            isLarge ? 'text-[11px]' : 'text-[9px]'
          }`}
        >
          {subText}
        </span>

        <span className="text-amber-950 text-[10px] mt-0.5">✦ ✦ ✦</span>
      </div>
    </div>
  );
};

// Grand Mosque Dome & Minaret Silhouette
export const MosqueSkyline: React.FC<{ color?: string; opacity?: number }> = ({
  color = '#F59E0B',
  opacity = 0.2,
}) => {
  return (
    <svg
      viewBox="0 0 1200 120"
      className="w-full h-12 pointer-events-none"
      fill={color}
      style={{ opacity }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Minaret Left 1 */}
      <rect x="150" y="20" width="12" height="100" />
      <path d="M 146 20 L 156 5 L 166 20 Z" />
      <rect x="144" y="50" width="24" height="4" />
      <circle cx="156" cy="3" r="2.5" />

      {/* Minaret Left 2 */}
      <rect x="320" y="35" width="10" height="85" />
      <path d="M 317 35 L 325 22 L 333 35 Z" />

      {/* Center Grand Dome */}
      <path d="M 520 120 C 520 60, 560 30, 600 15 C 640 30, 680 60, 680 120 Z" />
      {/* Dome Crescent Finial */}
      <path d="M 600 15 L 600 2" stroke={color} strokeWidth="2" />
      <circle cx="600" cy="1" r="2" />

      {/* Secondary Dome Left */}
      <path d="M 430 120 C 430 75, 460 55, 490 45 C 520 55, 530 75, 530 120 Z" />
      {/* Secondary Dome Right */}
      <path d="M 670 120 C 670 75, 680 55, 710 45 C 740 55, 770 75, 770 120 Z" />

      {/* Minaret Right 1 */}
      <rect x="880" y="35" width="10" height="85" />
      <path d="M 877 35 L 885 22 L 893 35 Z" />

      {/* Minaret Right 2 */}
      <rect x="1038" y="20" width="12" height="100" />
      <path d="M 1034 20 L 1044 5 L 1054 20 Z" />
      <rect x="1032" y="50" width="24" height="4" />
      <circle cx="1044" cy="3" r="2.5" />
    </svg>
  );
};

// Islamic Geometric Background Tile Pattern (8-point Girih Star)
export const IslamicGeometricPattern: React.FC<{
  color?: string;
  opacity?: number;
}> = ({ color = '#F59E0B', opacity = 0.08 }) => {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <defs>
        <pattern
          id="islamicGirihPattern"
          x="0"
          y="0"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          {/* 8-Point Star in Center */}
          <g stroke={color} strokeWidth="1.2" fill="none">
            <polygon points="40,20 45,35 60,40 45,45 40,60 35,45 20,40 35,35" />
            <rect x="26" y="26" width="28" height="28" transform="rotate(45 40 40)" />
            {/* Corner connecting lines */}
            <line x1="0" y1="0" x2="26" y2="26" />
            <line x1="80" y1="0" x2="54" y2="26" />
            <line x1="0" y1="80" x2="26" y2="54" />
            <line x1="80" y1="80" x2="54" y2="54" />
            {/* Hexagon borders */}
            <circle cx="40" cy="40" r="18" strokeDasharray="3 3" opacity="0.6" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamicGirihPattern)" />
    </svg>
  );
};

// Royal Stamp: "দারুননাজাত মাদ্রাসা" মানসম্মত সিল
export const MadrasahSealStamp: React.FC<{
  size?: number;
  color?: string;
  text?: string;
}> = ({ size = 80, color = '#F59E0B', text = 'দারুননাজাত' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="drop-shadow-md select-none"
    >
      <defs>
        <path
          id="sealCirclePath"
          d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
        />
      </defs>
      {/* Outer scalloped ring */}
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeDasharray="4 2"
      />
      <circle cx="50" cy="50" r="41" stroke={color} strokeWidth="1.2" fill="none" />
      <circle cx="50" cy="50" r="28" stroke={color} strokeWidth="1.5" fill="rgba(245, 158, 11, 0.08)" />

      {/* Curved text */}
      <text fill={color} fontSize="8.5" fontWeight="bold" fontFamily="var(--font-serif)">
        <textPath href="#sealCirclePath" startOffset="50%" textAnchor="middle">
          ★ {text} মাদ্রাসা • শিক্ষাবর্ষ ২০২৭ ★
        </textPath>
      </text>

      {/* Center Star and Crescent */}
      <g transform="translate(42, 40) scale(0.8)" fill={color}>
        {/* Crescent */}
        <path d="M 10,0 A 10,10 0 1 0 10,20 A 8,8 0 1 1 10,0 Z" />
        {/* Star */}
        <polygon
          points="13,4 14,7 17,7 14.5,9 15.5,12 13,10 10.5,12 11.5,9 9,7 12,7"
          transform="scale(0.8) translate(3, 4)"
        />
      </g>
    </svg>
  );
};

// QR Code SVG Simulation
export const ContactQrCode: React.FC<{ size?: number; color?: string }> = ({
  size = 76,
  color = '#F59E0B',
}) => {
  return (
    <div
      className="p-1.5 rounded-lg border border-amber-500/40 bg-slate-950/70 shadow-inner flex flex-col items-center justify-center text-center"
      style={{ width: size + 16, height: size + 24 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Corner 1 */}
        <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke={color} strokeWidth="5" />
        <rect x="13" y="13" width="12" height="12" rx="2" />
        {/* Corner 2 */}
        <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke={color} strokeWidth="5" />
        <rect x="75" y="13" width="12" height="12" rx="2" />
        {/* Corner 3 */}
        <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke={color} strokeWidth="5" />
        <rect x="13" y="75" width="12" height="12" rx="2" />
        {/* Simulated data matrix cells */}
        <rect x="40" y="8" width="6" height="6" />
        <rect x="50" y="8" width="8" height="6" />
        <rect x="42" y="20" width="8" height="8" />
        <rect x="54" y="24" width="6" height="6" />
        <rect x="8" y="42" width="6" height="8" />
        <rect x="20" y="40" width="10" height="6" />
        <rect x="36" y="36" width="28" height="28" rx="3" fill="#1e293b" stroke={color} strokeWidth="2" />
        <text
          x="50"
          y="54"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill={color}
          fontFamily="sans-serif"
        >
          DNM
        </text>
        <rect x="70" y="42" width="8" height="6" />
        <rect x="84" y="45" width="8" height="8" />
        <rect x="42" y="70" width="8" height="8" />
        <rect x="56" y="76" width="6" height="14" />
        <rect x="70" y="70" width="10" height="6" />
        <rect x="85" y="72" width="6" height="18" />
        <rect x="42" y="86" width="8" height="6" />
        <rect x="70" y="84" width="10" height="8" />
      </svg>
      <span className="text-[8px] font-sans-bn text-amber-300 font-semibold mt-0.5">
        স্ক্যান করে তথ্য জানুন
      </span>
    </div>
  );
};
