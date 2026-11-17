import { PosterData } from '../types/poster';
import { THEMES } from '../data/themes';

/** Escape user text for safe XML embedding */
const esc = (s: string): string =>
  String(posterSafe(s))
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
const posterSafe = (s: string): string => (s ?? '');

const BENGALI_NUMERALS = ['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '১০'];

/** Dotted grid cluster as raw SVG circles */
function dotGrid(
  x: number,
  y: number,
  cols: number,
  rows: number,
  gap: number,
  r: number,
  color: string,
  opacity: number
): string {
  let out = '';
  for (let rr = 0; rr < rows; rr++) {
    for (let cc = 0; cc < cols; cc++) {
      out += `<circle cx="${(x + cc * gap).toFixed(1)}" cy="${(y + rr * gap).toFixed(1)}" r="${r}" fill="${color}" opacity="${opacity}" />`;
    }
  }
  return out;
}

/**
 * Generates a pure standalone SVG string for the Darunnajat Madrasah poster —
 * modern corporate shape-based layout (layered diagonal header, accent ribbon,
 * feature cards, angular footer). Compatible with SVG.js, Fabric.js import,
 * Sharp 300 DPI rasterization, and direct SVG download.
 */
export function generatePosterSvg(poster: PosterData): string {
  const theme = THEMES[poster.themeId] || THEMES['royal-emerald'];

  // Canvas dimensions based on aspect ratio
  let width = 1240;
  let height = 1754; // A4 ratio default
  if (poster.aspectRatio === 'square-1-1') {
    width = 1400;
    height = 1400;
  } else if (poster.aspectRatio === 'portrait-4-5') {
    width = 1200;
    height = 1500;
  } else if (poster.aspectRatio === 'banner-16-9') {
    width = 1920;
    height = 1080;
  }

  const W = width;
  const H = height;
  const M = 90; // side margin
  const S = Math.min(W / 1240, H / 1754); // uniform scale for type & small elements
  const F = (n: number): number => +(n * S).toFixed(1);

  // ---- Vertical layout anchors ----
  const ry = H / 1754; // vertical layout scale
  const headerH = Math.round(330 * ry);
  const heroTop = headerH + Math.round(78 * ry);
  const ribbonY = heroTop + Math.round(352 * ry);
  const featHeadY = ribbonY + Math.round(128 * ry);
  const cardsTop = featHeadY + Math.round(104 * ry);
  const cardH = Math.max(64, Math.round(96 * S));
  const cardGap = Math.round(20 * S);
  const footerH = Math.round(300 * ry);
  const footTop = H - footerH;
  const wedgeH = Math.round(28 * ry);

  const headlineWords = poster.admissionTitle.trim().split(/\s+/).filter(Boolean);

  // ---- Header diagonal polygons ----
  const hh = headerH;
  const headerShapes = poster.ornaments.showHeaderShapes
    ? `
    <polygon points="0,0 ${W},0 ${W},${(hh * 0.74).toFixed(0)} 0,${(hh * 0.97).toFixed(0)}" fill="${theme.accent}" />
    <polygon points="0,0 ${W},0 ${W},${(hh * 0.705).toFixed(0)} 0,${(hh * 0.92).toFixed(0)}" fill="${theme.primaryDark}" />
    <polygon points="0,0 ${W},0 ${W},${(hh * 0.67).toFixed(0)} 0,${(hh * 0.87).toFixed(0)}" fill="${theme.primary}" />
    <g stroke="#ffffff" stroke-opacity="0.05" stroke-width="${Math.max(1.5, 2 * S)}">
      <line x1="${(W * 0.58).toFixed(0)}" y1="0" x2="${(W * 0.86).toFixed(0)}" y2="${(hh * 0.58).toFixed(0)}" />
      <line x1="${(W * 0.66).toFixed(0)}" y1="0" x2="${(W * 0.94).toFixed(0)}" y2="${(hh * 0.58).toFixed(0)}" />
      <line x1="${(W * 0.74).toFixed(0)}" y1="0" x2="${W}" y2="${(hh * 0.53).toFixed(0)}" />
    </g>`
    : `<rect x="0" y="0" width="${W}" height="${hh}" fill="${theme.primary}" />`;

  // ---- Hero headline lines ----
  const headlineSvg =
    headlineWords.length <= 1
      ? `<text x="${M}" y="${heroTop + F(104)}" font-family="'Noto Serif Bengali','Tiro Bangla',serif" font-size="${F(92)}" font-weight="900" fill="${theme.accent}">${esc(headlineWords[0] || poster.admissionTitle)}</text>`
      : `${headlineWords
          .map((word, i) => {
            const isLast = i === headlineWords.length - 1;
            const size = isLast ? F(104) : F(84);
            const y = heroTop + F(isLast ? 208 : 104);
            const fill = isLast ? theme.accent : theme.textPrimary;
            return `<text x="${M}" y="${y}" font-family="'Noto Serif Bengali','Tiro Bangla',serif" font-size="${size}" font-weight="900" fill="${fill}">${esc(word)}</text>`;
          })
          .join('\n')}`;

  // ---- Info chips (date + badge text) ----
  const chipY = heroTop + F(268);
  const chipH = F(58);
  const chipFont = F(23);
  const chip1Text = poster.admissionDate;
  const chip2Text = poster.customBadgeText;
  const chip1W = Math.round(chip1Text.length * 19 * S + 120 * S);
  const chip2W = Math.round(chip2Text.length * 19 * S + 120 * S);
  const chip2X = M + chip1W + Math.round(20 * S);

  const chipsSvg = `
    <!-- chip 1: admission date -->
    <rect x="${M}" y="${chipY}" width="${chip1W}" height="${chipH}" rx="${chipH / 2}" fill="${theme.primarySoft}" />
    <g transform="translate(${M + Math.round(34 * S)}, ${chipY + Math.round(chipH / 2)}) scale(${S.toFixed(3)})" stroke="${theme.primary}" stroke-width="3" fill="none" stroke-linecap="round">
      <rect x="-13" y="-11" width="26" height="24" rx="4" />
      <line x1="-13" y1="-3" x2="13" y2="-3" />
      <line x1="-6" y1="-16" x2="-6" y2="-7" />
      <line x1="6" y1="-16" x2="6" y2="-7" />
    </g>
    <text x="${M + Math.round(66 * S)}" y="${chipY + chipH / 2}" dominant-baseline="central" font-family="'Hind Siliguri','Noto Sans Bengali',sans-serif" font-size="${chipFont}" font-weight="700" fill="${theme.textPrimary}">${esc(chip1Text)}</text>
    <!-- chip 2: quality badge -->
    <rect x="${chip2X}" y="${chipY}" width="${chip2W}" height="${chipH}" rx="${chipH / 2}" fill="${theme.primarySoft}" />
    <g transform="translate(${chip2X + Math.round(34 * S)}, ${chipY + Math.round(chipH / 2)})" stroke="${theme.primary}" stroke-width="${Math.max(2, 3 * S)}" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="0" cy="0" r="13" />
      <path d="M -6 0 L -1.5 5 L 7 -5" />
    </g>
    <text x="${chip2X + Math.round(66 * S)}" y="${chipY + chipH / 2}" dominant-baseline="central" font-family="'Hind Siliguri','Noto Sans Bengali',sans-serif" font-size="${chipFont}" font-weight="700" fill="${theme.textPrimary}">${esc(chip2Text)}</text>`;

  // ---- Ring badge ----
  const badgeCx = W - M - Math.round(130 * S);
  const badgeCy = heroTop + F(140);
  const badgeR = Math.round(102 * S);
  const ringBadgeSvg = poster.ornaments.showRingBadge
    ? `
    <circle cx="${badgeCx}" cy="${badgeCy}" r="${badgeR}" fill="none" stroke="${theme.accent}" stroke-width="${Math.round(14 * S)}" />
    <circle cx="${badgeCx}" cy="${badgeCy}" r="${badgeR - Math.round(20 * S)}" fill="${theme.primary}" />
    <text x="${badgeCx}" y="${badgeCy - F(24)}" text-anchor="middle" font-family="'Hind Siliguri',sans-serif" font-size="${F(19)}" font-weight="700" letter-spacing="2" fill="${theme.accent}">আসন সংখ্যা</text>
    <text x="${badgeCx}" y="${badgeCy + F(18)}" text-anchor="middle" font-family="'Noto Serif Bengali',serif" font-size="${F(42)}" font-weight="900" fill="#ffffff">সীমিত!</text>
    <text x="${badgeCx}" y="${badgeCy + F(48)}" text-anchor="middle" font-size="${F(12)}" letter-spacing="4" fill="${theme.accent}">●●●</text>`
    : '';

  // ---- Accent ribbon band ----
  const ribbonH = F(64);
  const ribbonSvg = poster.ornaments.showRibbonBand
    ? `
    <polygon points="0,${ribbonY + Math.round(8 * S)} ${W},${ribbonY + Math.round(7 * S)} ${W - Math.round(46 * S)},${ribbonY + ribbonH + Math.round(8 * S)} 0,${ribbonY + ribbonH + Math.round(8 * S)}" fill="${theme.primaryDark}" />
    <polygon points="0,${ribbonY} ${W},${ribbonY} ${W - Math.round(46 * S)},${ribbonY + ribbonH} 0,${ribbonY + ribbonH}" fill="url(#accentGrad)" />
    <circle cx="${M + Math.round(30 * S)}" cy="${ribbonY + ribbonH / 2}" r="${Math.round(19 * S)}" fill="${theme.textOnAccent}" />
    <path d="M ${M + Math.round(21 * S)} ${ribbonY + ribbonH / 2} L ${M + Math.round(36 * S)} ${ribbonY + ribbonH / 2} M ${M + Math.round(31 * S)} ${ribbonY + ribbonH / 2 - Math.round(6 * S)} L ${M + Math.round(38 * S)} ${ribbonY + ribbonH / 2} L ${M + Math.round(31 * S)} ${ribbonY + ribbonH / 2 + Math.round(6 * S)}" stroke="${theme.accent}" stroke-width="${Math.max(2, 3.4 * S)}" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    <text x="${M + Math.round(64 * S)}" y="${ribbonY + ribbonH / 2}" dominant-baseline="central" font-family="'Hind Siliguri',sans-serif" font-size="${F(25)}" font-weight="700" fill="${theme.textOnAccent}">${esc(poster.urgentNote)}</text>
    <g stroke="${theme.textOnAccent}" stroke-opacity="0.28" stroke-width="${Math.round(6 * S)}">
      <line x1="${W - Math.round(150 * S)}" y1="${ribbonY + ribbonH}" x2="${W - Math.round(120 * S)}" y2="${ribbonY}" />
      <line x1="${W - Math.round(116 * S)}" y1="${ribbonY + ribbonH}" x2="${W - Math.round(86 * S)}" y2="${ribbonY}" />
      <line x1="${W - Math.round(82 * S)}" y1="${ribbonY + ribbonH}" x2="${W - Math.round(52 * S)}" y2="${ribbonY}" />
    </g>`
    : '';

  // ---- Feature cards ----
  const gap = cardGap;
  const cardW2 = Math.round((W - 2 * M - gap) / 2);
  const cardWFull = W - 2 * M;

  const featureCards = poster.features
    .map((feature, idx) => {
      const isSpecial = idx === 6;
      const row = Math.floor(idx / 2);
      const col = idx % 2;
      const w = isSpecial ? cardWFull : cardW2;
      const x = isSpecial ? M : M + col * (cardW2 + gap);
      const y = cardsTop + row * (cardH + gap);
      const cy = y + cardH / 2;
      const numeral = BENGALI_NUMERALS[idx] || String(idx + 1);

      return `
      <g>
        <rect x="${x}" y="${y}" width="${w}" height="${cardH}" rx="${Math.round(14 * S)}" fill="${isSpecial ? theme.primarySoft : '#ffffff'}" stroke="${isSpecial ? theme.primary : '#e4e9ef'}" stroke-width="2" />
        <rect x="${x}" y="${y}" width="${Math.max(5, Math.round(7 * S))}" height="${cardH}" fill="${isSpecial ? theme.accent : theme.primary}" />
        <rect x="${x + Math.round(22 * S)}" y="${cy - Math.round(21 * S)}" width="${Math.round(42 * S)}" height="${Math.round(42 * S)}" rx="${Math.round(10 * S)}" fill="${isSpecial ? theme.accent : theme.primary}" />
        <text x="${x + Math.round(43 * S)}" y="${cy}" dominant-baseline="central" text-anchor="middle" font-family="'Noto Serif Bengali',serif" font-size="${F(21)}" font-weight="900" fill="${isSpecial ? theme.textOnAccent : '#ffffff'}">${numeral}</text>
        <g transform="translate(${x + Math.round(90 * S)}, ${cy})" stroke="${isSpecial ? theme.accentDark : theme.accent}" stroke-width="${Math.max(2, 3 * S)}" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="0" cy="0" r="${Math.round(13 * S)}" />
          <path d="M ${-6 * S} 0 L ${-1.5 * S} ${5 * S} L ${7 * S} ${-5 * S}" />
        </g>
        <text x="${x + Math.round(122 * S)}" y="${cy}" dominant-baseline="central" font-family="'Hind Siliguri','Noto Sans Bengali',sans-serif" font-size="${F(24)}" font-weight="700" fill="${theme.textPrimary}">${esc(feature)}</text>
      </g>`;
    })
    .join('\n');

  // ---- Footer ----
  const labelY = footTop + Math.round(58 * S);
  const locY = labelY + Math.round(50 * S);
  const phoneY = labelY + Math.round(100 * S);
  const phoneChipH = Math.round(56 * S);
  const phoneChipW = Math.round(330 * S);

  const footerWedgeSvg = poster.ornaments.showFooterShapes
    ? `
    <polygon points="0,${footTop} ${W},${footTop - wedgeH} ${W},${footTop}" fill="${theme.accent}" />
    <polygon points="0,${footTop} ${W},${footTop - wedgeH + Math.round(9 * S)} ${W},${footTop}" fill="${theme.primary}" />`
    : '';

  const phonesSvg = poster.phones
    .map((phone, i) => {
      const x = M + i * (phoneChipW + Math.round(20 * S));
      return `
      <g>
        <rect x="${x}" y="${phoneY}" width="${phoneChipW}" height="${phoneChipH}" rx="${Math.round(12 * S)}" fill="url(#accentGrad)" />
        <g transform="translate(${x + Math.round(32 * S)}, ${phoneY + Math.round(phoneChipH / 2 - 12 * S)}) scale(${(0.9 * S).toFixed(3)})">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="${theme.textOnAccent}" />
        </g>
        <text x="${x + Math.round(64 * S)}" y="${phoneY + phoneChipH / 2}" dominant-baseline="central" font-family="'Hind Siliguri',sans-serif" font-size="${F(28)}" font-weight="900" letter-spacing="1" fill="${theme.textOnAccent}">${esc(phone)}</text>
      </g>`;
    })
    .join('\n');

  const qrSize = Math.round(120 * S);
  const qrX = W - M - qrSize - Math.round(24 * S);
  const qrCardH = qrSize + Math.round(46 * S);
  const qrY = footTop + Math.round(34 * S);
  const qrSvg = poster.ornaments.showQrCode
    ? `
    <rect x="${qrX}" y="${qrY}" width="${qrSize + Math.round(24 * S)}" height="${qrCardH}" rx="${Math.round(12 * S)}" fill="#ffffff" />
    <g transform="translate(${qrX + Math.round(12 * S)}, ${qrY + Math.round(10 * S)}) scale(${(qrSize / 100).toFixed(3)})" fill="${theme.primary}">
      <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke="${theme.primary}" stroke-width="5" />
      <rect x="13" y="13" width="12" height="12" rx="2" />
      <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke="${theme.primary}" stroke-width="5" />
      <rect x="75" y="13" width="12" height="12" rx="2" />
      <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke="${theme.primary}" stroke-width="5" />
      <rect x="13" y="75" width="12" height="12" rx="2" />
      <rect x="40" y="8" width="6" height="6" />
      <rect x="50" y="8" width="8" height="6" />
      <rect x="42" y="20" width="8" height="8" />
      <rect x="54" y="24" width="6" height="6" />
      <rect x="8" y="42" width="6" height="8" />
      <rect x="20" y="40" width="10" height="6" />
      <rect x="36" y="36" width="28" height="28" rx="3" fill="#ffffff" stroke="${theme.accent}" stroke-width="2" />
      <text x="50" y="55" text-anchor="middle" font-size="13" font-weight="900" fill="${theme.accent}" font-family="sans-serif">DNM</text>
      <rect x="70" y="42" width="8" height="6" />
      <rect x="84" y="45" width="8" height="8" />
      <rect x="42" y="70" width="8" height="8" />
      <rect x="56" y="76" width="6" height="14" />
      <rect x="70" y="70" width="10" height="6" />
      <rect x="85" y="72" width="6" height="18" />
      <rect x="42" y="86" width="8" height="6" />
      <rect x="70" y="84" width="10" height="8" />
    </g>
    <text x="${qrX + Math.round((qrSize + 24 * S) / 2)}" y="${qrY + qrCardH - Math.round(16 * S)}" text-anchor="middle" font-family="'Hind Siliguri',sans-serif" font-size="${F(13)}" font-weight="700" fill="${theme.textSecondary}">স্ক্যান করে তথ্য জানুন</text>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${theme.primary}" />
      <stop offset="100%" stop-color="${theme.primaryDark}" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${theme.accent}" />
      <stop offset="100%" stop-color="${theme.accentDark}" />
    </linearGradient>
  </defs>

  <!-- Page background -->
  <rect width="${W}" height="${H}" fill="${theme.pageBg}" />

  <!-- ===== Header: layered diagonal shape stack ===== -->
  ${headerShapes}
  <circle cx="${W - Math.round(60 * S)}" cy="${Math.round(10 * S)}" r="${Math.round(150 * S)}" fill="${theme.accent}" opacity="0.10" />
  ${poster.ornaments.showDotPatterns ? dotGrid(W - M - Math.round(120 * S), Math.round(52 * S), 6, 4, Math.round(24 * S), Math.max(2.5, 4 * S), theme.accent, 0.95) : ''}

  <!-- Brand row: ring logo + name -->
  <circle cx="${M + Math.round(66 * S)}" cy="${Math.round(headerH * 0.36)}" r="${Math.round(58 * S)}" fill="${theme.primaryDark}" stroke="${theme.accent}" stroke-width="${Math.max(5, Math.round(8 * S))}" />
  <text x="${M + Math.round(66 * S)}" y="${Math.round(headerH * 0.36 + 17 * S)}" text-anchor="middle" font-family="'Noto Serif Bengali',serif" font-size="${F(48)}" font-weight="900" fill="${theme.accent}">দা</text>
  <text x="${M + Math.round(150 * S)}" y="${Math.round(headerH * 0.30)}" font-family="'Noto Serif Bengali','Tiro Bangla',serif" font-size="${F(56)}" font-weight="900" fill="${theme.textOnPrimary}">${esc(poster.madrasahName)}</text>
  <text x="${M + Math.round(150 * S)}" y="${Math.round(headerH * 0.30 + 46 * S)}" font-family="'Hind Siliguri','Noto Sans Bengali',sans-serif" font-size="${F(20)}" font-weight="500" fill="#ffffff" opacity="0.85">${esc(poster.subTitle)}</text>

  <!-- ===== Hero: kicker + stacked headline ===== -->
  <rect x="${M}" y="${heroTop}" width="${Math.round(64 * S)}" height="${Math.max(7, Math.round(10 * S))}" fill="${theme.accent}" />
  <text x="${M + Math.round(80 * S)}" y="${heroTop + Math.round(5 * S)}" dominant-baseline="central" font-family="'Hind Siliguri',sans-serif" font-size="${F(21)}" font-weight="700" letter-spacing="1.5" fill="${theme.textSecondary}">${esc(poster.admissionSession)}</text>

  ${headlineSvg}

  <!-- angled accent underline -->
  <polygon points="${M},${heroTop + Math.round(252 * S)} ${M + Math.round(180 * S)},${heroTop + Math.round(252 * S)} ${M + Math.round(164 * S)},${heroTop + Math.round(252 * S + 15 * S)} ${M},${heroTop + Math.round(252 * S + 15 * S)}" fill="${theme.accent}" />

  ${chipsSvg}

  ${ringBadgeSvg}

  <!-- ===== Accent ribbon band ===== -->
  ${ribbonSvg}

  <!-- ===== Features section ===== -->
  <polygon points="${M},${featHeadY} ${M + Math.round(12 * S)},${featHeadY} ${M + Math.round(12 * S)},${featHeadY + Math.round(54 * S)} ${M},${featHeadY + Math.round(45 * S)}" fill="${theme.accent}" />
  <text x="${M + Math.round(30 * S)}" y="${featHeadY + Math.round(38 * S)}" dominant-baseline="central" font-family="'Noto Serif Bengali',serif" font-size="${F(40)}" font-weight="900" fill="${theme.textPrimary}">${esc(poster.featuresTitle)}</text>
  ${poster.ornaments.showDotPatterns ? dotGrid(W - M - Math.round(180 * S), featHeadY + Math.round(4 * S), 8, 3, Math.round(21 * S), Math.max(2, 3.4 * S), theme.primary, 0.3) : ''}

  ${featureCards}

  <!-- ===== Footer: angular wedge + dark contact bar ===== -->
  ${footerWedgeSvg}
  <rect x="0" y="${footTop}" width="${W}" height="${footerH}" fill="url(#primaryGrad)" />

  <rect x="${M}" y="${labelY - Math.round(13 * S)}" width="${Math.round(36 * S)}" height="${Math.max(4, Math.round(6 * S))}" fill="${theme.accent}" />
  <text x="${M + Math.round(48 * S)}" y="${labelY - Math.round(10 * S)}" dominant-baseline="central" font-family="'Hind Siliguri',sans-serif" font-size="${F(20)}" font-weight="700" letter-spacing="3" fill="${theme.accent}">যোগাযোগ করুন</text>

  <g transform="translate(${M + Math.round(16 * S)}, ${locY})" fill="${theme.accent}">
    <circle cx="0" cy="${-4 * S}" r="${Math.max(5, Math.round(8 * S))}" />
    <polygon points="${-8 * S},${1 * S} ${8 * S},${1 * S} 0,${16 * S}" />
  </g>
  <text x="${M + Math.round(44 * S)}" y="${locY}" dominant-baseline="central" font-family="'Hind Siliguri','Noto Sans Bengali',sans-serif" font-size="${F(23)}" font-weight="600" fill="${theme.textOnPrimary}">${esc(poster.location)}</text>

  ${phonesSvg}

  ${qrSvg}

  <text x="${W / 2}" y="${footTop + footerH - Math.round(30 * S)}" text-anchor="middle" font-family="'Hind Siliguri',sans-serif" font-size="${F(15)}" font-weight="500" fill="#ffffff" opacity="0.65">${esc(poster.madrasahName)} — মানসম্মত শিক্ষা ও আদর্শ পরিবেশের প্রতিশ্রুতি</text>

  <!-- bottom accent strip -->
  <rect x="0" y="${H - Math.max(8, Math.round(10 * S))}" width="${W}" height="${Math.max(8, Math.round(10 * S))}" fill="url(#accentGrad)" />
</svg>
`;
}
