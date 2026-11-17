export type ThemeId =
  | 'royal-emerald'
  | 'sapphire-navy'
  | 'burgundy-ruby'
  | 'midnight-onyx'
  | 'ivory-cream';

export type LayoutId = 'diagonal-split' | 'stacked-bands' | 'minimal-clean';

export type AspectRatioId = 'a4' | 'portrait-4-5' | 'square-1-1' | 'banner-16-9';

/**
 * Modern corporate shape-based flyer theme.
 * Light page background + deep brand color for the big geometric shapes
 * (layered diagonal header, angular footer) + one vivid accent color
 * (ribbon band, underlines, chips, dot grids).
 */
export interface PosterTheme {
  id: ThemeId;
  name: string;
  nameEn: string;
  bgGradient: string; // theme preview orb (customizer swatch)
  pageBg: string; // poster canvas background (light)
  primary: string; // deep brand color — big shapes, footer bar
  primaryDark: string; // darker layer shade for stacked depth
  primarySoft: string; // soft tint for chips & highlighted cards
  accent: string; // vivid accent — ribbon, underline bars, rings
  accentDark: string; // darker accent shade (gradients, small text)
  accentGold: string; // kept for quick-swatch dots (= accent)
  textPrimary: string; // headline text on light background
  textSecondary: string; // body / muted text on light background
  textOnPrimary: string; // text over the deep brand shapes
  textOnAccent: string; // text over the vivid accent band
}

export interface PosterData {
  madrasahName: string;
  subTitle: string;
  admissionTitle: string;
  admissionSession: string;
  admissionDate: string;
  featuresTitle: string;
  features: string[];
  location: string;
  phones: string[];
  urgentNote: string;
  customBadgeText: string;
  themeId: ThemeId;
  layoutId: LayoutId;
  aspectRatio: AspectRatioId;
  ornaments: {
    showHeaderShapes: boolean; // layered diagonal header shape stack
    showDotPatterns: boolean; // dotted grid accent clusters
    showRibbonBand: boolean; // angled accent ribbon strip
    showRingBadge: boolean; // circular ring badge beside the headline
    showQrCode: boolean; // QR code card in the footer
    showFooterShapes: boolean; // angular wedge cut above the footer
  };
}

export interface SharpExportOptions {
  density: number; // e.g. 150, 300, 600 DPI
  format: 'png' | 'jpeg' | 'webp';
  quality: number;
  sharpen: boolean;
  brightness: number;
  contrast: number;
}
