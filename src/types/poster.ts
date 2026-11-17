export type ThemeId =
  | 'royal-emerald'
  | 'sapphire-navy'
  | 'burgundy-ruby'
  | 'midnight-onyx'
  | 'ivory-cream';

export type LayoutId = 'classic-mehrab' | 'grand-palace' | 'royal-modern';

export type AspectRatioId = 'a4' | 'portrait-4-5' | 'square-1-1' | 'banner-16-9';

export interface PosterTheme {
  id: ThemeId;
  name: string;
  nameEn: string;
  bgGradient: string;
  cardBg: string;
  accentGold: string;
  goldText: string;
  badgeBg: string;
  borderGold: string;
  textPrimary: string;
  textSecondary: string;
  featureCardBg: string;
  footerBg: string;
  ornamentColor: string;
  starPatternOpacity: number;
}

export interface PosterData {
  madrasahName: string;
  arabicHeader: string;
  arabicSubHeader: string;
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
    showBismillah: boolean;
    showRabbiZidni: boolean;
    showIslamicArch: boolean;
    showCornerFiligrees: boolean;
    showGeometricBackground: boolean;
    showGoldBadge: boolean;
    showQrCode: boolean;
    showFoilBorder: boolean;
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
