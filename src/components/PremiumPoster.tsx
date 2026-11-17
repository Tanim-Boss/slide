import React, { forwardRef } from 'react';
import { PosterData } from '../types/poster';
import { THEMES } from '../data/themes';
import {
  BismillahCalligraphy,
  RabbiZidniCrest,
  CornerFiligree,
  AdmissionBadgeRibbon,
  MosqueSkyline,
  IslamicGeometricPattern,
  MadrasahSealStamp,
  ContactQrCode,
} from './IslamicOrnaments';
import {
  ShieldCheck,
  HeartHandshake,
  HeartOff,
  Utensils,
  Globe2,
  GraduationCap,
  Sparkles,
  MapPin,
  PhoneCall,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface PremiumPosterProps {
  poster: PosterData;
  scale?: number;
}

// Icons matching the 7 characteristics
const FEATURE_ICONS = [
  <ShieldCheck className="w-6 h-6 text-amber-300" />,
  <HeartHandshake className="w-6 h-6 text-amber-300" />,
  <HeartOff className="w-6 h-6 text-emerald-300" />,
  <Utensils className="w-6 h-6 text-amber-300" />,
  <Globe2 className="w-6 h-6 text-sky-300" />,
  <GraduationCap className="w-6 h-6 text-amber-300" />,
  <Sparkles className="w-6 h-6 text-amber-400" />,
];

const BENGALI_NUMERALS = ['১', '২', '৩', '৪', '৫', '৬', '৭'];

export const PremiumPoster = forwardRef<HTMLDivElement, PremiumPosterProps>(
  ({ poster, scale = 1 }, ref) => {
    const theme = THEMES[poster.themeId] || THEMES['royal-emerald'];
    const isIvory = poster.themeId === 'ivory-cream';

    // Aspect ratio styling
    const aspectStyles: Record<string, { width: string; minHeight: string; aspect: string }> = {
      a4: { width: '794px', minHeight: '1123px', aspect: '1 / 1.414' },
      'portrait-4-5': { width: '800px', minHeight: '1000px', aspect: '4 / 5' },
      'square-1-1': { width: '850px', minHeight: '850px', aspect: '1 / 1' },
      'banner-16-9': { width: '1100px', minHeight: '618px', aspect: '16 / 9' },
    };

    const currentAspect = aspectStyles[poster.aspectRatio] || aspectStyles.a4;

    return (
      <div
        ref={ref}
        id="poster-dom-element"
        className="relative overflow-hidden shadow-2xl transition-all duration-300 select-none print:shadow-none print:m-0"
        style={{
          width: currentAspect.width,
          minHeight: currentAspect.minHeight,
          background: theme.bgGradient,
          color: theme.textPrimary,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
        }}
      >
        {/* Background Islamic Pattern */}
        {poster.ornaments.showGeometricBackground && (
          <IslamicGeometricPattern color={theme.accentGold} opacity={theme.starPatternOpacity} />
        )}

        {/* Outer Golden Foil Border & Corner Filigrees */}
        {poster.ornaments.showFoilBorder && (
          <>
            <div className="absolute inset-4 pointer-events-none rounded-xl border-2 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.25)]" />
            <div className="absolute inset-6 pointer-events-none rounded-lg border border-dashed border-amber-300/40" />

            {/* Corner Filigrees */}
            {poster.ornaments.showCornerFiligrees && (
              <>
                <div className="absolute top-4 left-4 z-20">
                  <CornerFiligree position="top-left" color={theme.accentGold} size={70} />
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <CornerFiligree position="top-right" color={theme.accentGold} size={70} />
                </div>
                <div className="absolute bottom-4 left-4 z-20">
                  <CornerFiligree position="bottom-left" color={theme.accentGold} size={70} />
                </div>
                <div className="absolute bottom-4 right-4 z-20">
                  <CornerFiligree position="bottom-right" color={theme.accentGold} size={70} />
                </div>
              </>
            )}
          </>
        )}

        {/* Poster Inner Content Container */}
        <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-between h-full">
          {/* TOP SECTION: Bismillah + Mosque Skyline + Header */}
          <div className="flex flex-col items-center text-center">
            {/* Mosque Skyline Silhouette */}
            <div className="w-full flex justify-center mb-1">
              <MosqueSkyline color={theme.accentGold} opacity={0.25} />
            </div>

            {/* Bismillah Calligraphy */}
            {poster.ornaments.showBismillah && (
              <div className="mb-1 flex justify-center">
                <BismillahCalligraphy color={theme.accentGold} className="w-72 h-14" />
              </div>
            )}

            {/* Rabbi Zidni Ilma Crest */}
            {poster.ornaments.showRabbiZidni && (
              <div className="mb-3">
                <RabbiZidniCrest color={theme.accentGold} />
              </div>
            )}

            {/* Main Institution Title */}
            <div className="relative inline-block mt-1">
              <h1 className="text-5xl sm:text-6xl font-serif-bn font-black tracking-wide gold-gradient-text drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                {poster.madrasahName}
              </h1>
              {/* Subtitle */}
              <p className="mt-2 text-sm sm:text-base font-sans-bn font-medium tracking-wide text-amber-200/90 max-w-xl mx-auto">
                {poster.subTitle}
              </p>
            </div>

            {/* Golden Ornamental Divider */}
            <div className="flex items-center justify-center gap-3 my-4 w-full max-w-md">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-amber-400 to-amber-500" />
              <div className="w-3 h-3 rotate-45 bg-amber-400 border border-amber-200 shadow-sm" />
              <span className="text-amber-300 font-serif-bn text-sm font-semibold tracking-wider">
                {poster.admissionSession}
              </span>
              <div className="w-3 h-3 rotate-45 bg-amber-400 border border-amber-200 shadow-sm" />
              <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-amber-400 to-amber-500" />
            </div>

            {/* ADMISSION PROMINENT BANNER + 3D ROSETTE BADGE */}
            <div className="w-full my-2 flex items-center justify-center gap-4 relative">
              {/* Left Wing Ribbon Graphic */}
              <div className="hidden sm:block flex-1 h-[3px] bg-gradient-to-r from-transparent to-amber-500/70" />

              {/* Central Admission Box */}
              <div className="relative px-8 py-3 rounded-2xl gold-metallic-bg shadow-[0_8px_25px_rgba(245,158,11,0.35)] border-2 border-amber-100 flex items-center gap-3 transform hover:scale-[1.02] transition-transform">
                <span className="text-amber-950 font-serif-bn text-3xl sm:text-4xl font-black tracking-wider drop-shadow-sm flex items-center gap-2">
                  <span className="text-2xl">★</span>
                  {poster.admissionTitle}
                  <span className="text-2xl">★</span>
                </span>
              </div>

              {/* 3D Rosette Ribbon Badge */}
              {poster.ornaments.showGoldBadge && (
                <div className="absolute right-2 sm:right-6 -top-4 sm:-top-5 z-20">
                  <AdmissionBadgeRibbon
                    title="ভর্তি চলছে"
                    subText="২০২৬-২৭"
                    size="normal"
                  />
                </div>
              )}

              {/* Right Wing Ribbon Graphic */}
              <div className="hidden sm:block flex-1 h-[3px] bg-gradient-to-l from-transparent to-amber-500/70" />
            </div>

            {/* Admission Start Date Highlight Pill */}
            <div className="mt-3 inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-amber-500/15 border border-amber-400/60 shadow-inner backdrop-blur-sm">
              <CalendarDays className="w-5 h-5 text-amber-300 animate-pulse" />
              <span className="text-base sm:text-lg font-sans-bn font-bold text-amber-200 tracking-wide">
                {poster.admissionDate}
              </span>
            </div>
          </div>

          {/* MIDDLE SECTION: OUR FEATURES (আমাদের বৈশিষ্ট্যসমূহঃ) */}
          <div className="my-6">
            {/* Section Header */}
            <div className="flex items-center justify-center mb-4">
              <div className="relative inline-flex items-center gap-3 px-6 py-1.5 rounded-lg bg-gradient-to-r from-amber-600/30 via-amber-500/50 to-amber-600/30 border-y border-amber-400/60 shadow-md">
                <span className="text-amber-400">⚜️</span>
                <h2 className="text-xl sm:text-2xl font-serif-bn font-extrabold text-amber-100 tracking-wide">
                  {poster.featuresTitle}
                </h2>
                <span className="text-amber-400">⚜️</span>
              </div>
            </div>

            {/* Features Cards Grid: 7 Exact Requirements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl mx-auto">
              {poster.features.map((feature, idx) => {
                const isSpecial = idx === 6; // মাথায় নষ্ট মামা কাজ করবার
                const isThird = idx === 2; // বেত্রাঘাত করা হয় না।

                return (
                  <div
                    key={idx}
                    className={`relative rounded-xl p-3.5 flex items-center gap-3.5 border transition-all duration-200 backdrop-blur-md shadow-lg ${
                      isSpecial
                        ? 'sm:col-span-2 bg-gradient-to-r from-amber-500/20 via-amber-600/30 to-amber-500/20 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : isIvory
                        ? 'bg-white/90 border-amber-700/30 hover:border-amber-600'
                        : 'bg-black/30 border-amber-400/30 hover:border-amber-400/60'
                    }`}
                  >
                    {/* Number Seal */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full gold-metallic-bg flex items-center justify-center text-amber-950 font-serif-bn font-black text-sm shadow-md">
                      {BENGALI_NUMERALS[idx]}
                    </div>

                    {/* Feature Icon */}
                    <div className="flex-shrink-0 p-1.5 rounded-lg bg-amber-500/15 border border-amber-400/30">
                      {FEATURE_ICONS[idx] || <CheckCircle2 className="w-5 h-5 text-amber-300" />}
                    </div>

                    {/* Feature Text */}
                    <div className="flex-1">
                      <span
                        className={`text-base sm:text-lg font-sans-bn font-bold tracking-tight ${
                          isSpecial
                            ? 'text-amber-200 font-extrabold'
                            : isThird
                            ? 'text-emerald-300 font-bold'
                            : isIvory
                            ? 'text-emerald-950'
                            : 'text-slate-50'
                        }`}
                      >
                        {feature}
                      </span>
                    </div>

                    {/* Checkmark or Star Badge */}
                    <div className="flex-shrink-0">
                      {isSpecial ? (
                        <span className="text-amber-400 text-lg">⚡</span>
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-amber-400/80" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Urgent Warning / Seats Limited notice */}
            <div className="mt-4 flex items-center justify-center gap-2 text-center">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 animate-bounce" />
              <span className="text-xs sm:text-sm font-sans-bn font-semibold text-amber-300/95 tracking-wide">
                {poster.urgentNote}
              </span>
            </div>
          </div>

          {/* BOTTOM SECTION: Location, Contacts, QR Code, Seal */}
          <div className="mt-4 pt-4 border-t border-amber-400/40">
            {/* Grand Footer Card */}
            <div
              className={`rounded-2xl p-4 sm:p-5 border border-amber-400/50 shadow-xl backdrop-blur-md relative overflow-hidden ${
                isIvory ? 'bg-amber-900/10' : 'bg-black/40'
              }`}
            >
              {/* Inner subtle glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-amber-300 to-transparent" />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left: Location & Contacts */}
                <div className="flex-1 text-center sm:text-left space-y-3">
                  {/* Location with Pin */}
                  <div className="flex items-start gap-2.5 justify-center sm:justify-start">
                    <MapPin className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm sm:text-base font-sans-bn font-bold text-amber-100">
                        {poster.location}
                      </span>
                    </div>
                  </div>

                  {/* Phone Contacts */}
                  <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-start">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl gold-metallic-bg text-amber-950 font-bold shadow-md">
                      <PhoneCall className="w-4 h-4" />
                      <span className="text-sm sm:text-base font-sans-bn font-black tracking-wider">
                        {poster.phones[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl gold-metallic-bg text-amber-950 font-bold shadow-md">
                      <PhoneCall className="w-4 h-4" />
                      <span className="text-sm sm:text-base font-sans-bn font-black tracking-wider">
                        {poster.phones[1]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Madrasah Seal Stamp & QR Code */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {poster.ornaments.showQrCode && (
                    <ContactQrCode size={70} color={theme.accentGold} />
                  )}
                  <MadrasahSealStamp size={78} color={theme.accentGold} text="দারুননাজাত" />
                </div>
              </div>

              {/* Footer Institutional Sign-off */}
              <div className="mt-3 pt-2.5 border-t border-amber-400/20 text-center">
                <p className="text-[11px] sm:text-xs font-serif-bn text-amber-300/80 font-medium">
                  দারুননাজাত মাদ্রাসা — যুগোপযোগী দ্বীনি শিক্ষা ও সুন্নতি চরিত্রের একনিষ্ঠ অনন্য কেন্দ্র
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PremiumPoster.displayName = 'PremiumPoster';
