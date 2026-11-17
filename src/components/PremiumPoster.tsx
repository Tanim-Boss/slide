import React, { forwardRef } from 'react';
import { PosterData } from '../types/poster';
import { THEMES } from '../data/themes';
import { DotGrid, HeaderShapeStack, FooterWedge, QrCodeCard } from './PosterShapes';
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
  BadgeCheck,
  MoveRight,
} from 'lucide-react';

interface PremiumPosterProps {
  poster: PosterData;
  scale?: number;
}

// Icons matching the 7 characteristics
const FEATURE_ICONS = [
  ShieldCheck,
  HeartHandshake,
  HeartOff,
  Utensils,
  Globe2,
  GraduationCap,
  Sparkles,
];

const BENGALI_NUMERALS = ['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '১০'];

export const PremiumPoster = forwardRef<HTMLDivElement, PremiumPosterProps>(
  ({ poster, scale = 1 }, ref) => {
    const theme = THEMES[poster.themeId] || THEMES['royal-emerald'];

    // Aspect ratio styling (+ proportional header height)
    const aspectStyles: Record<string, { width: string; minHeight: string; headerH: number }> = {
      a4: { width: '794px', minHeight: '1123px', headerH: 300 },
      'portrait-4-5': { width: '800px', minHeight: '1000px', headerH: 272 },
      'square-1-1': { width: '850px', minHeight: '850px', headerH: 236 },
      'banner-16-9': { width: '1100px', minHeight: '700px', headerH: 208 },
    };

    const currentAspect = aspectStyles[poster.aspectRatio] || aspectStyles.a4;
    const headlineWords = poster.admissionTitle.trim().split(/\s+/).filter(Boolean);

    return (
      <div
        ref={ref}
        id="poster-dom-element"
        className="relative overflow-hidden shadow-2xl transition-all duration-300 select-none print:shadow-none print:m-0 flex flex-col"
        style={{
          width: currentAspect.width,
          minHeight: currentAspect.minHeight,
          background: theme.pageBg,
          color: theme.textPrimary,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
        }}
      >
        {/* ============ HEADER: layered diagonal shape stack ============ */}
        <div className="relative flex-shrink-0" style={{ height: currentAspect.headerH }}>
          {poster.ornaments.showHeaderShapes ? (
            <HeaderShapeStack theme={theme} />
          ) : (
            <div className="absolute inset-0" style={{ background: theme.primary }} />
          )}

          {/* soft accent glow orb, top-right */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              top: -70,
              right: -50,
              width: 270,
              height: 270,
              background: `radial-gradient(circle, ${theme.accent}40 0%, transparent 68%)`,
            }}
          />

          {/* dotted accent cluster, top-right */}
          {poster.ornaments.showDotPatterns && (
            <DotGrid className="absolute top-7 right-8" cols={6} rows={4} color={theme.accent} opacity={0.95} />
          )}

          {/* brand row: ring logo + institution name */}
          <div
            className="relative z-10 flex items-center gap-5 px-10"
            style={{ paddingTop: Math.round(currentAspect.headerH * 0.15) }}
          >
            <div
              className="flex-shrink-0 rounded-full flex items-center justify-center"
              style={{
                width: 84,
                height: 84,
                border: `5px solid ${theme.accent}`,
                background: theme.primaryDark,
                boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
              }}
            >
              <span className="font-serif-bn font-black" style={{ fontSize: 34, color: theme.accent }}>
                দা
              </span>
            </div>
            <div className="min-w-0">
              <h1
                className="font-serif-bn font-black leading-tight"
                style={{
                  fontSize: 40,
                  color: theme.textOnPrimary,
                  textShadow: '0 3px 12px rgba(0,0,0,0.4)',
                }}
              >
                {poster.madrasahName}
              </h1>
              <p
                className="font-sans-bn font-medium"
                style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', maxWidth: 470, marginTop: 6 }}
              >
                {poster.subTitle}
              </p>
            </div>
          </div>
        </div>

        {/* ============ HERO: stacked bold headline + ring badge ============ */}
        <div className="relative px-10 pt-9 flex items-start justify-between gap-6">
          <div className="min-w-0">
            {/* kicker: accent dash + session */}
            <div className="flex items-center gap-3">
              <span className="block flex-shrink-0" style={{ width: 46, height: 8, background: theme.accent }} />
              <span
                className="font-sans-bn font-bold tracking-wide"
                style={{ fontSize: 15, color: theme.textSecondary }}
              >
                {poster.admissionSession}
              </span>
            </div>

            {/* stacked display headline — last word in accent color */}
            <h2 className="font-serif-bn font-black" style={{ lineHeight: 1.06, marginTop: 12 }}>
              {headlineWords.map((word, i) => (
                <span
                  key={i}
                  className="block"
                  style={{
                    fontSize: i === headlineWords.length - 1 && headlineWords.length > 1 ? 82 : 66,
                    color: i === headlineWords.length - 1 ? theme.accent : theme.textPrimary,
                  }}
                >
                  {word}
                </span>
              ))}
            </h2>

            {/* angled accent underline bar */}
            <div
              style={{
                width: 132,
                height: 11,
                marginTop: 14,
                background: theme.accent,
                clipPath: 'polygon(0 0, 100% 0, calc(100% - 11px) 100%, 0 100%)',
              }}
            />

            {/* info chips */}
            <div className="flex flex-wrap items-center gap-3" style={{ marginTop: 22 }}>
              <div
                className="flex items-center gap-2.5 rounded-full px-4 py-2"
                style={{ background: theme.primarySoft }}
              >
                <CalendarDays style={{ width: 17, height: 17, color: theme.primary }} />
                <span className="font-sans-bn font-bold" style={{ fontSize: 14, color: theme.textPrimary }}>
                  {poster.admissionDate}
                </span>
              </div>
              <div
                className="flex items-center gap-2.5 rounded-full px-4 py-2"
                style={{ background: theme.primarySoft }}
              >
                <BadgeCheck style={{ width: 17, height: 17, color: theme.primary }} />
                <span className="font-sans-bn font-bold" style={{ fontSize: 14, color: theme.textPrimary }}>
                  {poster.customBadgeText}
                </span>
              </div>
            </div>
          </div>

          {/* circular ring badge */}
          {poster.ornaments.showRingBadge && (
            <div className="relative flex-shrink-0 hidden sm:block" style={{ width: 148, height: 148, marginTop: 8 }}>
              <div
                className="absolute inset-0 rounded-full"
                style={{ border: `10px solid ${theme.accent}` }}
              />
              <div
                className="absolute rounded-full flex flex-col items-center justify-center text-center"
                style={{
                  inset: 13,
                  background: theme.primary,
                  boxShadow: '0 14px 28px rgba(0,0,0,0.3)',
                }}
              >
                <span
                  className="font-sans-bn font-bold"
                  style={{ fontSize: 12, letterSpacing: 1.5, color: theme.accent }}
                >
                  আসন সংখ্যা
                </span>
                <span
                  className="font-serif-bn font-black"
                  style={{ fontSize: 27, lineHeight: 1.15, color: '#ffffff' }}
                >
                  সীমিত!
                </span>
                <span style={{ color: theme.accent, fontSize: 9, letterSpacing: 4, marginTop: 2 }}>●●●</span>
              </div>
            </div>
          )}
        </div>

        {/* ============ ACCENT RIBBON BAND (angled right edge) ============ */}
        {poster.ornaments.showRibbonBand && (
          <div className="relative flex-shrink-0" style={{ height: 58, marginTop: 26 }}>
            <svg
              className="absolute inset-0 w-full h-full block"
              viewBox="0 0 100 58"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* offset dark underlayer */}
              <polygon points="0,7 100,6 97.6,58 0,58" fill={theme.primaryDark} />
              {/* main accent band with angled right edge */}
              <polygon points="0,0 100,0 97.6,52 0,52" fill={theme.accent} />
            </svg>
            <div className="relative z-10 flex items-center gap-3 pl-10 pr-24" style={{ height: 52 }}>
              <span
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: 30, height: 30, background: theme.textOnAccent }}
              >
                <MoveRight style={{ width: 17, height: 17, color: theme.accent }} />
              </span>
              <span
                className="font-sans-bn font-bold truncate"
                style={{ fontSize: 16, color: theme.textOnAccent }}
              >
                {poster.urgentNote}
              </span>
            </div>
          </div>
        )}

        {/* ============ FEATURES: modern card grid ============ */}
        <div className="px-10" style={{ marginTop: 30 }}>
          {/* section header with accent bar + dot cluster */}
          <div className="flex items-end justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span
                className="block flex-shrink-0"
                style={{
                  width: 10,
                  height: 44,
                  background: theme.accent,
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 9px))',
                }}
              />
              <h3
                className="font-serif-bn font-black"
                style={{ fontSize: 28, lineHeight: 1.1, color: theme.textPrimary }}
              >
                {poster.featuresTitle}
              </h3>
            </div>
            {poster.ornaments.showDotPatterns && (
              <DotGrid cols={8} rows={3} gap={13} radius={2.4} color={theme.primary} opacity={0.3} />
            )}
          </div>

          {/* feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginTop: 18 }}>
            {poster.features.map((feature, idx) => {
              const Icon = FEATURE_ICONS[idx % FEATURE_ICONS.length];
              const isSpecial = idx === 6;

              return (
                <div
                  key={idx}
                  className={`relative flex items-center gap-3 overflow-hidden rounded-xl ${
                    isSpecial ? 'sm:col-span-2' : ''
                  }`}
                  style={{
                    background: isSpecial ? theme.primarySoft : '#ffffff',
                    border: `1.5px solid ${isSpecial ? theme.primary : '#e4e9ef'}`,
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06)',
                    padding: '11px 14px 11px 16px',
                  }}
                >
                  {/* left accent notch */}
                  <span
                    className="absolute left-0 top-0 bottom-0"
                    style={{ width: 5, background: isSpecial ? theme.accent : theme.primary }}
                  />
                  {/* number chip */}
                  <span
                    className="flex items-center justify-center font-serif-bn font-black flex-shrink-0"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      fontSize: 15,
                      background: isSpecial ? theme.accent : theme.primary,
                      color: isSpecial ? theme.textOnAccent : '#ffffff',
                    }}
                  >
                    {BENGALI_NUMERALS[idx] || idx + 1}
                  </span>
                  {/* feature icon */}
                  <Icon
                    className="flex-shrink-0"
                    style={{ width: 20, height: 20, color: isSpecial ? theme.accentDark : theme.accent }}
                  />
                  {/* feature text */}
                  <span
                    className="font-sans-bn font-bold"
                    style={{ fontSize: 15, lineHeight: 1.35, color: theme.textPrimary }}
                  >
                    {feature}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============ FOOTER: dark bar with angular wedge top ============ */}
        <div className="relative mt-auto" style={{ paddingTop: 44 }}>
          {poster.ornaments.showFooterShapes && <FooterWedge theme={theme} />}
          <div style={{ background: theme.primary }}>
            <div className="px-10 py-6 flex items-center justify-between gap-6">
              {/* left: label + location + phones */}
              <div className="min-w-0 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="block" style={{ width: 26, height: 4, background: theme.accent }} />
                  <span
                    className="font-sans-bn font-bold"
                    style={{ fontSize: 13, letterSpacing: 2.5, color: theme.accent }}
                  >
                    যোগাযোগ করুন
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin style={{ width: 18, height: 18, color: theme.accent, flexShrink: 0, marginTop: 2 }} />
                  <span
                    className="font-sans-bn font-semibold"
                    style={{ fontSize: 14, lineHeight: 1.45, color: theme.textOnPrimary }}
                  >
                    {poster.location}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {poster.phones.map((phone, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-2 rounded-lg px-3.5 py-2"
                      style={{ background: theme.accent, boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
                    >
                      <PhoneCall style={{ width: 15, height: 15, color: theme.textOnAccent }} />
                      <span
                        className="font-sans-bn font-black tracking-wide"
                        style={{ fontSize: 15, color: theme.textOnAccent }}
                      >
                        {phone}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* right: QR card */}
              {poster.ornaments.showQrCode && <QrCodeCard theme={theme} />}
            </div>

            {/* bottom accent strip */}
            <div
              style={{
                height: 7,
                background: `linear-gradient(90deg, ${theme.accent} 0%, ${theme.accentDark} 100%)`,
              }}
            />
          </div>
        </div>
      </div>
    );
  }
);

PremiumPoster.displayName = 'PremiumPoster';
