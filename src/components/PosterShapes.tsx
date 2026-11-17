import React from 'react';
import { PosterTheme } from '../types/poster';

/**
 * Modern corporate shape decorations — geometric dots, layered diagonal
 * panels, angular wedges and ring accents. Purely abstract flyer shapes.
 */

/** Dotted grid accent cluster (classic corporate flyer decoration) */
export const DotGrid: React.FC<{
  cols?: number;
  rows?: number;
  gap?: number;
  radius?: number;
  color?: string;
  opacity?: number;
  className?: string;
}> = ({ cols = 6, rows = 4, gap = 14, radius = 2.6, color = '#f59e0b', opacity = 1, className }) => {
  const w = cols * gap;
  const h = rows * gap;
  const dots: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <circle key={`${r}-${c}`} cx={c * gap + radius} cy={r * gap + radius} r={radius} fill={color} />
      );
    }
  }
  return (
    <svg
      className={className}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {dots}
    </svg>
  );
};

/**
 * Layered diagonal header shape stack.
 * Three stacked panels (primary → dark → accent) whose bottom edges are
 * cut on a diagonal, so thin slivers of the lower layers peek out.
 */
export const HeaderShapeStack: React.FC<{ theme: PosterTheme }> = ({ theme }) => (
  <svg
    className="absolute inset-0 w-full h-full block"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    {/* accent underlayer — peeks out along the diagonal bottom edge */}
    <polygon points="0,0 100,0 100,74 0,97" fill={theme.accent} />
    {/* dark middle layer */}
    <polygon points="0,0 100,0 100,70.5 0,92" fill={theme.primaryDark} />
    {/* main primary panel */}
    <polygon points="0,0 100,0 100,67 0,87" fill={theme.primary} />
    {/* subtle diagonal sheen lines on the primary panel */}
    <g stroke="#ffffff" strokeOpacity="0.05" strokeWidth="0.45">
      <line x1="58" y1="0" x2="86" y2="58" />
      <line x1="66" y1="0" x2="94" y2="58" />
      <line x1="74" y1="0" x2="100" y2="53" />
    </g>
  </svg>
);

/**
 * Angular wedge that sits directly above the footer bar, giving the
 * footer's top edge a diagonal cut with a thin accent sliver.
 */
export const FooterWedge: React.FC<{ theme: PosterTheme }> = ({ theme }) => (
  <svg
    className="absolute left-0 right-0 w-full block"
    style={{ top: -26, height: 27 }}
    viewBox="0 0 100 26"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    {/* accent sliver — rises a little higher so it lines the cut */}
    <polygon points="0,26 100,1 100,26" fill={theme.accent} />
    {/* main wedge — merges into the footer bar below */}
    <polygon points="0,26 100,7 100,26" fill={theme.primary} />
  </svg>
);

/** Decorative hollow ring set (modern circular accent) */
export const RingAccent: React.FC<{
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
}> = ({ size = 120, color = '#f59e0b', opacity = 0.5, className }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 120 120"
    style={{ opacity }}
    aria-hidden="true"
  >
    <circle cx="60" cy="60" r="52" fill="none" stroke={color} strokeWidth="7" />
    <circle cx="60" cy="60" r="34" fill="none" stroke={color} strokeWidth="2" strokeDasharray="5 6" />
  </svg>
);

/** QR code card — modern contact shortcut block */
export const QrCodeCard: React.FC<{ theme: PosterTheme; size?: number }> = ({ theme, size = 86 }) => (
  <div
    className="rounded-xl p-2.5 flex flex-col items-center gap-1.5 flex-shrink-0"
    style={{ background: '#ffffff', boxShadow: '0 10px 24px rgba(0,0,0,0.35)' }}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill={theme.primary}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="QR Code"
    >
      {/* Position markers */}
      <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke={theme.primary} strokeWidth="5" />
      <rect x="13" y="13" width="12" height="12" rx="2" />
      <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke={theme.primary} strokeWidth="5" />
      <rect x="75" y="13" width="12" height="12" rx="2" />
      <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke={theme.primary} strokeWidth="5" />
      <rect x="13" y="75" width="12" height="12" rx="2" />
      {/* Simulated data matrix cells */}
      <rect x="40" y="8" width="6" height="6" />
      <rect x="50" y="8" width="8" height="6" />
      <rect x="42" y="20" width="8" height="8" />
      <rect x="54" y="24" width="6" height="6" />
      <rect x="8" y="42" width="6" height="8" />
      <rect x="20" y="40" width="10" height="6" />
      <rect x="36" y="36" width="28" height="28" rx="3" fill="#ffffff" stroke={theme.accent} strokeWidth="2" />
      <text x="50" y="55" textAnchor="middle" fontSize="13" fontWeight="900" fill={theme.accent} fontFamily="sans-serif">
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
    <span className="font-sans-bn font-bold" style={{ fontSize: 9, color: theme.textSecondary }}>
      স্ক্যান করে তথ্য জানুন
    </span>
  </div>
);
