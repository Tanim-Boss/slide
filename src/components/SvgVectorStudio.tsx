import React, { useEffect, useRef, useState } from 'react';
import { SVG } from '@svgdotjs/svg.js';
import { PosterData } from '../types/poster';
import { THEMES } from '../data/themes';
import { generatePosterSvg } from '../utils/svgGenerator';
import {
  Code,
  Copy,
  Download,
  Sliders,
  Check,
  Shapes,
} from 'lucide-react';

interface SvgVectorStudioProps {
  poster: PosterData;
}

export const SvgVectorStudio: React.FC<SvgVectorStudioProps> = ({ poster }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Parametric modern-shape generator states
  const [diagSlope, setDiagSlope] = useState<number>(70); // diagonal cut slope (px drop)
  const [layerGap, setLayerGap] = useState<number>(18); // gap between stacked layers
  const [ringSize, setRingSize] = useState<number>(62); // ring badge radius
  const [dotCols, setDotCols] = useState<number>(7); // dot grid density
  const [accentTone, setAccentTone] = useState<string>('#F59E0B');
  const [showFullPosterSvg, setShowFullPosterSvg] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [svgOutputCode, setSvgOutputCode] = useState<string>('');

  const theme = THEMES[poster.themeId] || THEMES['royal-emerald'];

  // Re-generate SVG using SVG.js when parameters change
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    if (showFullPosterSvg) {
      // Full master poster SVG
      const rawSvg = generatePosterSvg(poster);
      containerRef.current.innerHTML = rawSvg;
      setSvgOutputCode(rawSvg);
    } else {
      // Parametric corporate shape generator using SVG.js
      const draw = SVG().addTo(containerRef.current).size(600, 600).viewbox(0, 0, 600, 600);

      // Light page background
      draw.rect(600, 600).fill(theme.pageBg).radius(12);

      // Layered diagonal shape stack (accent → dark → primary)
      const yR = 210 + diagSlope; // right-side height of the diagonal cut
      draw
        .polygon(`0,0 600,0 600,${yR + layerGap * 2} 0,${yR + 90 + layerGap * 2}`)
        .fill(accentTone);
      draw
        .polygon(`0,0 600,0 600,${yR + layerGap} 0,${yR + 90 + layerGap}`)
        .fill(theme.primaryDark);
      draw.polygon(`0,0 600,0 600,${yR} 0,${yR + 90}`).fill(theme.primary);

      // Diagonal sheen lines on the primary panel
      for (let i = 0; i < 3; i++) {
        const x = 340 + i * 60;
        draw
          .line(x, 0, x + 130, yR - 60)
          .stroke({ color: '#ffffff', width: 2, opacity: 0.06 });
      }

      // Dot grid cluster, top-right
      const dotGap = 20;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < dotCols; c++) {
          draw
            .circle(5)
            .fill(accentTone)
            .move(600 - 36 - dotCols * dotGap + c * dotGap, 34 + r * dotGap);
        }
      }

      // Ring badge, bottom-right
      const rcx = 600 - 60 - ringSize;
      const rcy = 600 - 60 - ringSize;
      draw.circle(ringSize * 2).center(rcx, rcy).fill('none').stroke({ color: accentTone, width: 10 });
      draw
        .circle((ringSize - 16) * 2)
        .center(rcx, rcy)
        .fill(theme.primary);
      draw
        .text('সীমিত!')
        .font({ family: 'Noto Serif Bengali, serif', size: 22, weight: 'bold', anchor: 'middle' })
        .fill('#ffffff')
        .center(rcx, rcy - 2);

      // Angled accent ribbon band
      draw.polygon(`0,470 600,470 566,516 0,516`).fill(accentTone);
      draw.polygon(`0,478 600,477 566,524 0,524`).fill(theme.primaryDark).opacity(0.9);

      // Headline texts
      const textGroup = draw.group();
      textGroup
        .text(poster.madrasahName)
        .font({ family: 'Noto Serif Bengali, serif', size: 30, weight: 'bold', anchor: 'middle' })
        .fill(theme.textPrimary)
        .center(270, 395);

      textGroup
        .text(`${poster.admissionTitle} — ${poster.admissionSession}`)
        .font({ family: 'Hind Siliguri, sans-serif', size: 18, weight: 'bold', anchor: 'middle' })
        .fill(accentTone)
        .center(270, 435);

      // Accent underline bar with angled edge
      draw.polygon(`200,448 340,448 330,458 200,458`).fill(accentTone);

      const generatedMarkup = draw.svg();
      setSvgOutputCode(generatedMarkup);
    }
  }, [diagSlope, layerGap, ringSize, dotCols, accentTone, showFullPosterSvg, poster, theme]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(svgOutputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([svgOutputCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = showFullPosterSvg
      ? 'darunnajat-madrasah-full-poster.svg'
      : 'darunnajat-modern-shape-motif.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl">
      {/* Left Panel: Parametric Controls & Mode */}
      <div className="lg:w-80 flex flex-col gap-5 bg-slate-900/90 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-lg mb-1">
            <Shapes className="w-5 h-5" />
            <span>SVG.js ভেক্টর স্টুডিও</span>
          </div>
          <p className="text-xs text-slate-400">
            গাণিতিক ভেক্টর জেনারেটর — ডায়াগোনাল শেপ স্ট্যাক, ডট গ্রিড, রিং ব্যাজ ও সম্পূর্ণ পোস্টার ভেক্টর।
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex p-1 bg-slate-800 rounded-lg">
          <button
            onClick={() => setShowFullPosterSvg(true)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              showFullPosterSvg
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            সম্পূর্ণ পোস্টার SVG
          </button>
          <button
            onClick={() => setShowFullPosterSvg(false)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              !showFullPosterSvg
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            প্যারামেট্রিক শেপ
          </button>
        </div>

        {/* Parametric Sliders (Enabled in Parametric Mode) */}
        {!showFullPosterSvg && (
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Sliders className="w-3.5 h-3.5" />
              <span>শেপ প্যারামিটার</span>
            </div>

            {/* Diagonal slope */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>তির্যক কাটের ঢাল</span>
                <span className="font-mono">{diagSlope}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="180"
                value={diagSlope}
                onChange={(e) => setDiagSlope(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Layer gap */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>লেয়ারের ফাঁক</span>
                <span className="font-mono">{layerGap}px</span>
              </div>
              <input
                type="range"
                min="4"
                max="44"
                value={layerGap}
                onChange={(e) => setLayerGap(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Ring badge size */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>রিং ব্যাজের আকার</span>
                <span className="font-mono">{ringSize}px</span>
              </div>
              <input
                type="range"
                min="34"
                max="100"
                value={ringSize}
                onChange={(e) => setRingSize(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Dot grid density */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>ডট গ্রিডের ঘনত্ব</span>
                <span className="font-mono">{dotCols} কলাম</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="1"
                value={dotCols}
                onChange={(e) => setDotCols(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Accent Tone Picker */}
            <div>
              <label className="block text-xs text-slate-300 mb-1.5">অ্যাকসেন্ট রং (Accent Tone)</label>
              <div className="flex gap-2">
                {[
                  { name: 'Amber', hex: '#F59E0B' },
                  { name: 'Orange', hex: '#F97316' },
                  { name: 'Gold', hex: '#EAB308' },
                  { name: 'Teal', hex: '#14B8A6' },
                ].map((item) => (
                  <button
                    key={item.hex}
                    onClick={() => setAccentTone(item.hex)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                      accentTone === item.hex ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: item.hex }}
                    title={item.name}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-800 space-y-2 mt-auto">
          <button
            onClick={handleCopyCode}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'কোড কপি হয়েছে!' : 'SVG কোড কপি করুন'}</span>
          </button>

          <button
            onClick={handleDownloadSvg}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>ভেক্টর SVG ডাউনলোড করুন</span>
          </button>
        </div>
      </div>

      {/* Right Area: Vector Preview & Source Code Tabs */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Visual Preview Container */}
        <div className="flex-1 bg-slate-900 rounded-xl p-4 border border-slate-800 flex items-center justify-center overflow-auto min-h-[500px]">
          <div
            ref={containerRef}
            className="w-full max-w-xl max-h-[600px] flex items-center justify-center shadow-xl rounded-lg overflow-hidden"
          />
        </div>

        {/* Raw SVG Code Snippet Preview */}
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <div className="flex items-center gap-1.5 font-mono text-amber-300">
              <Code className="w-3.5 h-3.5" />
              <span>SVG সোর্স কোড (Vector Output Markup)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {svgOutputCode.length} bytes • Pure Scalable Vector
            </span>
          </div>
          <pre className="bg-slate-950 p-3 rounded-lg text-[11px] font-mono text-slate-300 max-h-36 overflow-auto scrollbar-thin">
            {svgOutputCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
