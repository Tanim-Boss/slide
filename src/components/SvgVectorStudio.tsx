import React, { useEffect, useRef, useState } from 'react';
import { SVG } from '@svgdotjs/svg.js';
import { PosterData } from '../types/poster';
import { generatePosterSvg } from '../utils/svgGenerator';
import {
  Code,
  Copy,
  Download,
  Sliders,
  Sparkles,
  Check,
  Layers,
  Shapes,
} from 'lucide-react';

interface SvgVectorStudioProps {
  poster: PosterData;
}

export const SvgVectorStudio: React.FC<SvgVectorStudioProps> = ({ poster }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Parametric Generator States
  const [archApexY, setArchApexY] = useState<number>(60);
  const [archStrokeWidth, setArchStrokeWidth] = useState<number>(3);
  const [starPoints, setStarPoints] = useState<number>(8);
  const [starSize, setStarSize] = useState<number>(60);
  const [goldTone, setGoldTone] = useState<string>('#F59E0B');
  const [showFullPosterSvg, setShowFullPosterSvg] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [svgOutputCode, setSvgOutputCode] = useState<string>('');

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
      // Parametric Vector Generator using SVG.js library
      const draw = SVG().addTo(containerRef.current).size(600, 600).viewbox(0, 0, 600, 600);

      // Background rect
      draw.rect(600, 600).fill('#03261d').radius(12);

      // Outer border
      draw
        .rect(560, 560)
        .move(20, 20)
        .fill('none')
        .stroke({ color: goldTone, width: archStrokeWidth, linecap: 'round' })
        .radius(10);

      // Parametric Mehrab Arch Top
      const archPath = `M 60 400 C 60 200, 180 ${archApexY + 40}, 300 ${archApexY} C 420 ${archApexY + 40}, 540 200, 540 400`;
      draw.path(archPath).fill('none').stroke({ color: goldTone, width: archStrokeWidth + 1 });

      // Secondary Cusped Arch
      const cuspPath = `M 90 410 C 90 230, 190 ${archApexY + 70}, 300 ${archApexY + 25} C 410 ${archApexY + 70}, 510 230, 510 410`;
      draw
        .path(cuspPath)
        .fill('none')
        .stroke({ color: '#FEF08A', width: 1.5, dasharray: '6,4' });

      // Finial at apex
      draw
        .polygon(`300,${archApexY - 30} 305,${archApexY - 12} 320,${archApexY - 12} 308,${archApexY - 2} 313,${archApexY + 14} 300,${archApexY + 4} 287,${archApexY + 14} 292,${archApexY - 2} 280,${archApexY - 12} 295,${archApexY - 12}`)
        .fill(goldTone);

      // Islamic Star in center (Parametric points)
      const cx = 300;
      const cy = 280;
      const rOuter = starSize;
      const rInner = starSize * 0.45;
      let starPointsStr = '';
      const totalPts = starPoints * 2;
      for (let i = 0; i < totalPts; i++) {
        const r = i % 2 === 0 ? rOuter : rInner;
        const angle = (i * Math.PI) / starPoints - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        starPointsStr += `${x.toFixed(1)},${y.toFixed(1)} `;
      }
      draw.polygon(starPointsStr.trim()).fill('none').stroke({ color: goldTone, width: 2.5 });
      draw.circle(starSize * 0.8).center(cx, cy).fill('none').stroke({ color: '#FEF08A', width: 1, dasharray: '3,3' });

      // Title & Text inside Vector
      const textGroup = draw.group();
      textGroup
        .text('দারুননাজাত মাদ্রাসা')
        .font({ family: 'Noto Serif Bengali, serif', size: 32, weight: 'bold', anchor: 'middle' })
        .fill(goldTone)
        .center(300, 420);

      textGroup
        .text('ভর্তি চলছে — ২০২৬')
        .font({ family: 'Hind Siliguri, sans-serif', size: 20, weight: 'bold', anchor: 'middle' })
        .fill('#FEF08A')
        .center(300, 465);

      textGroup
        .text('স্থানঃ সারুলিয়া, ডেমরা ঢাকা • ০১৭৭৬২৮৯৮০১')
        .font({ family: 'Hind Siliguri, sans-serif', size: 14, anchor: 'middle' })
        .fill('#A7F3D0')
        .center(300, 510);

      const generatedMarkup = draw.svg();
      setSvgOutputCode(generatedMarkup);
    }
  }, [archApexY, archStrokeWidth, starPoints, starSize, goldTone, showFullPosterSvg, poster]);

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
      : 'darunnajat-islamic-vector-motif.svg';
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
            গাণিতিক ভেক্টর জেনারেটর — মেহরাব খিলান, জ্যামিতিক নকশা ও পোস্টার ভেক্টর তৈরি।
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
            প্যারামেট্রিক মেহরাব
          </button>
        </div>

        {/* Parametric Sliders (Enabled in Parametric Mode) */}
        {!showFullPosterSvg && (
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Sliders className="w-3.5 h-3.5" />
              <span>মেহরাব ও স্টার প্যারামিটার</span>
            </div>

            {/* Arch Apex Height */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>খিলান চূড়ার উচ্চতা</span>
                <span className="font-mono">{archApexY}px</span>
              </div>
              <input
                type="range"
                min="30"
                max="140"
                value={archApexY}
                onChange={(e) => setArchApexY(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Arch Stroke Width */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>গোল্ডেন ফ্রেমের পুরুত্ব</span>
                <span className="font-mono">{archStrokeWidth}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={archStrokeWidth}
                onChange={(e) => setArchStrokeWidth(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Star Points */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>ইসলামিক স্টারের কোণ সংখ্যা</span>
                <span className="font-mono">{starPoints}-পয়েন্ট</span>
              </div>
              <input
                type="range"
                min="5"
                max="16"
                step="1"
                value={starPoints}
                onChange={(e) => setStarPoints(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Star Size */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>স্টার আকার</span>
                <span className="font-mono">{starSize}px</span>
              </div>
              <input
                type="range"
                min="30"
                max="110"
                value={starSize}
                onChange={(e) => setStarSize(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Gold Tone Picker */}
            <div>
              <label className="block text-xs text-slate-300 mb-1.5">স্বর্ণালী আভা (Gold Tone)</label>
              <div className="flex gap-2">
                {[
                  { name: '24K Gold', hex: '#F59E0B' },
                  { name: 'Radiant Yellow', hex: '#FDE047' },
                  { name: 'Amber Bronze', hex: '#D97706' },
                  { name: 'Rose Gold', hex: '#F472B6' },
                ].map((item) => (
                  <button
                    key={item.hex}
                    onClick={() => setGoldTone(item.hex)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                      goldTone === item.hex ? 'border-white scale-110' : 'border-transparent'
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
            <span>{copied ? 'কোড কপি হয়েছে!' : 'SVG কোড কপি করুন'}</span>
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
