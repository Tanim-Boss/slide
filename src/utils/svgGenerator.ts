import { PosterData } from '../types/poster';
import { THEMES } from '../data/themes';

/**
 * Generates pure standalone SVG string for Darunnajat Madrasah Poster
 * Compatible with SVG.js, Fabric.js import, Sharp 300 DPI rasterization, and direct SVG download.
 */
export function generatePosterSvg(poster: PosterData): string {
  const theme = THEMES[poster.themeId] || THEMES['royal-emerald'];
  
  // Dimensions based on aspect ratio
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

  // Colors based on theme
  const isIvory = poster.themeId === 'ivory-cream';
  const bg1 = isIvory ? '#fdfbf7' : theme.id === 'sapphire-navy' ? '#1e3a8a' : theme.id === 'burgundy-ruby' ? '#831843' : theme.id === 'midnight-onyx' ? '#1c1917' : '#064e3b';
  const bg2 = isIvory ? '#eee5d3' : theme.id === 'sapphire-navy' ? '#030712' : theme.id === 'burgundy-ruby' ? '#270505' : theme.id === 'midnight-onyx' ? '#050505' : '#011812';
  const goldPrimary = theme.accentGold;
  const textColor = isIvory ? '#064e3b' : '#ffffff';
  const subtextColor = isIvory ? '#374151' : theme.textSecondary;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Gradients -->
    <radialGradient id="bgGrad" cx="50%" cy="30%" r="75%">
      <stop offset="0%" stop-color="${bg1}" />
      <stop offset="100%" stop-color="${bg2}" />
    </radialGradient>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="25%" stop-color="#FCD34D" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="75%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#92400E" />
      <stop offset="25%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#FEF08A" />
      <stop offset="75%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#92400E" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${isIvory ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.08)'}" />
      <stop offset="100%" stop-color="${isIvory ? 'rgba(240,230,210,0.85)' : 'rgba(0,0,0,0.45)'}" />
    </linearGradient>
    <radialGradient id="sealGrad" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="40%" stop-color="#F59E0B" />
      <stop offset="85%" stop-color="#B45309" />
      <stop offset="100%" stop-color="#78350F" />
    </radialGradient>

    <!-- Filters -->
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#F59E0B" flood-opacity="0.45" />
    </filter>
    <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.5" />
    </filter>

    <!-- Islamic Girih Star Pattern -->
    <pattern id="girihTile" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
      <g stroke="${goldPrimary}" stroke-width="1" fill="none" opacity="0.12">
        <polygon points="40,16 46,34 64,40 46,46 40,64 34,46 16,40 34,34" />
        <rect x="25" y="25" width="30" height="30" transform="rotate(45 40 40)" />
        <line x1="0" y1="0" x2="25" y2="25" />
        <line x1="80" y1="0" x2="55" y2="25" />
        <line x1="0" y1="80" x2="25" y2="55" />
        <line x1="80" y1="80" x2="55" y2="55" />
      </g>
    </pattern>
  </defs>

  <!-- Background Rect -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

  <!-- Background Islamic Pattern Overlay -->
  ${poster.ornaments.showGeometricBackground ? `<rect width="${width}" height="${height}" fill="url(#girihTile)" />` : ''}

  <!-- Grand Mehrab Border & Outer Foil Framing -->
  ${
    poster.ornaments.showFoilBorder
      ? `
    <!-- Outer Golden Borders -->
    <rect x="28" y="28" width="${width - 56}" height="${height - 56}" rx="12" fill="none" stroke="url(#goldGradient)" stroke-width="4" filter="url(#goldGlow)" />
    <rect x="42" y="42" width="${width - 84}" height="${height - 84}" rx="8" fill="none" stroke="url(#goldGradient)" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.8" />
    
    <!-- Corner Decorative Rosettes -->
    <circle cx="28" cy="28" r="8" fill="url(#goldGradient)" />
    <circle cx="${width - 28}" cy="28" r="8" fill="url(#goldGradient)" />
    <circle cx="28" cy="${height - 28}" r="8" fill="url(#goldGradient)" />
    <circle cx="${width - 28}" cy="${height - 28}" r="8" fill="url(#goldGradient)" />
  `
      : ''
  }

  <!-- Mosque Skyline Silhouette at top -->
  <g fill="${goldPrimary}" opacity="0.18">
    <path d="M ${width / 2 - 90} 140 C ${width / 2 - 90} 70, ${width / 2 - 45} 40, ${width / 2} 24 C ${width / 2 + 45} 40, ${width / 2 + 90} 70, ${width / 2 + 90} 140 Z" />
    <rect x="${width / 2 - 250}" y="60" width="14" height="80" />
    <polygon points="${width / 2 - 253},60 ${width / 2 - 243},35 ${width / 2 - 233},60" />
    <rect x="${width / 2 + 236}" y="60" width="14" height="80" />
    <polygon points="${width / 2 + 233},60 ${width / 2 + 243},35 ${width / 2 + 253},60" />
  </g>

  <!-- Top Arabic Calligraphy Bismillah -->
  ${
    poster.ornaments.showBismillah
      ? `
    <text x="${width / 2}" y="105" text-anchor="middle" font-family="'Amiri', 'Noto Naskh Arabic', serif" font-size="36" font-weight="bold" fill="url(#goldGradient)" filter="url(#goldGlow)">
      ${poster.arabicHeader}
    </text>
  `
      : ''
  }

  <!-- Rabbi Zidni Ilma Sub-header -->
  ${
    poster.ornaments.showRabbiZidni
      ? `
    <g transform="translate(${width / 2}, 145)">
      <line x1="-180" y1="0" x2="-70" y2="0" stroke="url(#goldGradient)" stroke-width="1.5" />
      <text x="0" y="4" text-anchor="middle" font-family="'Amiri', serif" font-size="20" fill="#FEF08A" font-weight="bold">
        ${poster.arabicSubHeader}
      </text>
      <line x1="70" y1="0" x2="180" y2="0" stroke="url(#goldGradient)" stroke-width="1.5" />
    </g>
  `
      : ''
  }

  <!-- Main Madrasah Name Header -->
  <g transform="translate(${width / 2}, 235)" filter="url(#goldGlow)">
    <text x="0" y="0" text-anchor="middle" font-family="'Noto Serif Bengali', 'Tiro Bangla', serif" font-size="68" font-weight="900" fill="url(#goldGradient)" letter-spacing="1.5">
      ${poster.madrasahName}
    </text>
    <!-- Subtitle -->
    <text x="0" y="45" text-anchor="middle" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="21" font-weight="600" fill="${subtextColor}" opacity="0.95">
      ${poster.subTitle}
    </text>
  </g>

  <!-- Golden Divider with Islamic Star Ornament -->
  <g transform="translate(${width / 2}, 310)">
    <line x1="-320" y1="0" x2="-35" y2="0" stroke="url(#goldGradient)" stroke-width="2" />
    <circle cx="0" cy="0" r="10" fill="url(#goldGradient)" />
    <polygon points="0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2" fill="${bg1}" />
    <line x1="35" y1="0" x2="320" y2="0" stroke="url(#goldGradient)" stroke-width="2" />
  </g>

  <!-- Admission Open Ribbon Badge & Highlight Banner -->
  <g transform="translate(${width / 2}, 395)">
    <!-- Main Admission Box -->
    <rect x="-380" y="-45" width="760" height="90" rx="45" fill="url(#bannerGrad)" stroke="#FFFFFF" stroke-width="2.5" filter="url(#shadowFilter)" />
    <rect x="-372" y="-37" width="744" height="74" rx="37" fill="none" stroke="#78350F" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.6" />

    <!-- Text inside Ribbon -->
    <text x="-40" y="12" text-anchor="middle" font-family="'Noto Serif Bengali', serif" font-size="44" font-weight="900" fill="#451A03" letter-spacing="2">
      ★ ${poster.admissionTitle} ★
    </text>

    <!-- Side Badge Rosette -->
    ${
      poster.ornaments.showGoldBadge
        ? `
      <g transform="translate(260, 0)">
        <circle cx="0" cy="0" r="50" fill="url(#sealGrad)" stroke="#FFFBEB" stroke-width="3" filter="url(#goldGlow)" />
        <circle cx="0" cy="0" r="42" fill="none" stroke="#78350F" stroke-width="1" stroke-dasharray="3 3" />
        <text x="0" y="-8" text-anchor="middle" font-family="'Hind Siliguri', sans-serif" font-size="13" font-weight="bold" fill="#451A03">
          ${poster.admissionSession}
        </text>
        <text x="0" y="14" text-anchor="middle" font-family="'Noto Serif Bengali', sans-serif" font-size="16" font-weight="900" fill="#451A03">
          ১০০% মানসম্মত
        </text>
        <text x="0" y="30" text-anchor="middle" font-size="12" fill="#78350F">
          ✦ ✦ ✦
        </text>
      </g>
    `
        : ''
    }
  </g>

  <!-- Admission Start Date Pill Highlight -->
  <g transform="translate(${width / 2}, 485)">
    <rect x="-260" y="-22" width="520" height="44" rx="22" fill="rgba(245, 158, 11, 0.2)" stroke="url(#goldGradient)" stroke-width="2" />
    <text x="0" y="7" text-anchor="middle" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="22" font-weight="700" fill="#FEF08A">
      📅 ${poster.admissionDate}
    </text>
  </g>

  <!-- Section Header: আমাদের বৈশিষ্ট্যসমূহ -->
  <g transform="translate(${width / 2}, 570)">
    <!-- Header background card -->
    <path d="M -220 0 L 220 0 L 200 42 L -200 42 Z" fill="url(#goldGradient)" filter="url(#shadowFilter)" />
    <text x="0" y="28" text-anchor="middle" font-family="'Noto Serif Bengali', serif" font-size="25" font-weight="800" fill="#451A03" letter-spacing="1">
      ⚜️ ${poster.featuresTitle} ⚜️
    </text>
  </g>

  <!-- Features Cards Grid (The 7 Exact User Requirements) -->
  <g transform="translate(100, 640)">
    ${poster.features
      .map((feature, idx) => {
        const isLeftCol = idx % 2 === 0;
        const row = Math.floor(idx / 2);
        const colX = isLeftCol ? 0 : 530;
        const cardWidth = 510;
        const cardHeight = 92;
        const rowY = row * 115;

        // Special styling for the 7th item (centered or span)
        if (idx === 6) {
          return `
          <g transform="translate(180, ${row * 115})">
            <rect width="680" height="${cardHeight}" rx="14" fill="url(#cardGrad)" stroke="url(#goldGradient)" stroke-width="2" filter="url(#shadowFilter)" />
            <circle cx="48" cy="46" r="26" fill="url(#goldGradient)" />
            <text x="48" y="53" text-anchor="middle" font-family="'Noto Serif Bengali', serif" font-size="20" font-weight="bold" fill="#451A03">৭</text>
            <text x="96" y="54" font-family="'Hind Siliguri', 'Noto Serif Bengali', sans-serif" font-size="26" font-weight="700" fill="#FEF08A">
              ${feature}
            </text>
            <circle cx="630" cy="46" r="14" fill="rgba(245, 158, 11, 0.2)" stroke="${goldPrimary}" stroke-width="1.5" />
            <text x="630" y="51" text-anchor="middle" font-size="14" fill="#FEF08A">★</text>
          </g>
        `;
        }

        const bengaliNums = ['১', '২', '৩', '৪', '৫', '৬', '৭'];

        return `
        <g transform="translate(${colX}, ${rowY})">
          <rect width="${cardWidth}" height="${cardHeight}" rx="12" fill="url(#cardGrad)" stroke="url(#goldGradient)" stroke-width="1.6" filter="url(#shadowFilter)" />
          <!-- Number Seal -->
          <circle cx="46" cy="46" r="24" fill="url(#goldGradient)" />
          <text x="46" y="53" text-anchor="middle" font-family="'Noto Serif Bengali', serif" font-size="19" font-weight="bold" fill="#451A03">
            ${bengaliNums[idx]}
          </text>
          <!-- Feature Text -->
          <text x="90" y="54" font-family="'Hind Siliguri', sans-serif" font-size="24" font-weight="700" fill="${textColor}">
            ${feature}
          </text>
          <!-- Checkmark Icon -->
          <circle cx="${cardWidth - 36}" cy="46" r="14" fill="rgba(245, 158, 11, 0.25)" stroke="${goldPrimary}" stroke-width="1.5" />
          <path d="M ${cardWidth - 42} 46 L ${cardWidth - 38} 51 L ${cardWidth - 30} 41" stroke="#FEF08A" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      `;
      })
      .join('\n')}
  </g>

  <!-- Urgent Note / Seats Limited Ribbon -->
  <g transform="translate(${width / 2}, 1130)">
    <rect x="-420" y="-18" width="840" height="38" rx="19" fill="rgba(245, 158, 11, 0.15)" stroke="url(#goldGradient)" stroke-width="1.5" />
    <text x="0" y="7" text-anchor="middle" font-family="'Hind Siliguri', sans-serif" font-size="19" font-weight="600" fill="#FDE68A">
      📢 ${poster.urgentNote}
    </text>
  </g>

  <!-- Grand Footer Container: Location & Contacts -->
  <g transform="translate(60, 1190)">
    <!-- Footer Backplate -->
    <rect width="${width - 120}" height="480" rx="20" fill="url(#bannerGrad)" opacity="0.12" />
    <rect width="${width - 120}" height="480" rx="20" fill="none" stroke="url(#goldGradient)" stroke-width="2" />

    <!-- Location Section with Pin -->
    <g transform="translate(50, 60)">
      <rect width="${width - 220}" height="76" rx="14" fill="url(#cardGrad)" stroke="url(#goldGradient)" stroke-width="1.5" />
      <text x="35" y="48" font-size="30">📍</text>
      <text x="80" y="48" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="25" font-weight="700" fill="#FEF08A">
        ${poster.location}
      </text>
    </g>

    <!-- Contact Numbers & QR Code Section -->
    <g transform="translate(50, 170)">
      <!-- Contact 1 -->
      <g transform="translate(0, 0)">
        <rect width="460" height="84" rx="14" fill="url(#sealGrad)" filter="url(#shadowFilter)" />
        <text x="45" y="52" font-size="30">📞</text>
        <text x="95" y="52" font-family="'Hind Siliguri', sans-serif" font-size="28" font-weight="900" fill="#451A03" letter-spacing="1">
          ${poster.phones[0]}
        </text>
      </g>

      <!-- Contact 2 -->
      <g transform="translate(500, 0)">
        <rect width="460" height="84" rx="14" fill="url(#sealGrad)" filter="url(#shadowFilter)" />
        <text x="45" y="52" font-size="30">📱</text>
        <text x="95" y="52" font-family="'Hind Siliguri', sans-serif" font-size="28" font-weight="900" fill="#451A03" letter-spacing="1">
          ${poster.phones[1]}
        </text>
      </g>
    </g>

    <!-- Bottom Institutional Stamp & Sign-off -->
    <g transform="translate(${width / 2 - 60}, 335)">
      <line x1="-340" y1="0" x2="340" y2="0" stroke="url(#goldGradient)" stroke-width="1.2" opacity="0.6" />
      <text x="0" y="40" text-anchor="middle" font-family="'Noto Serif Bengali', serif" font-size="22" font-weight="700" fill="url(#goldGradient)">
        দারুননাজাত মাদ্রাসা — একনিষ্ঠ দ্বীনি দীক্ষা ও চারিত্রিক উৎকর্ষতার নির্ভরযোগ্য ঠিকানা
      </text>
      <text x="0" y="75" text-anchor="middle" font-family="'Hind Siliguri', sans-serif" font-size="16" font-weight="500" fill="${subtextColor}">
        সারুলিয়া, ডেমরা, ঢাকা • সকল প্রকার তথ্যের জন্য উপরে প্রদত্ত নম্বরে অবিলম্বে যোগাযোগ করুন
      </text>
    </g>
  </g>
</svg>
`;
}
