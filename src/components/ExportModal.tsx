import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { PosterData, SharpExportOptions } from '../types/poster';
import { generatePosterSvg } from '../utils/svgGenerator';
import {
  Download,
  FileImage,
  FileType,
  Printer,
  Sparkles,
  Sliders,
  CheckCircle2,
  X,
  Loader2,
  Cpu,
  Layers,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  poster: PosterData;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, poster }) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportStatus, setExportStatus] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'quick' | 'sharp-settings'>('quick');

  const [sharpOptions, setSharpOptions] = useState<SharpExportOptions>({
    density: 300, // 300 DPI print standard
    format: 'png',
    quality: 95,
    sharpen: true,
    brightness: 1.0,
    contrast: 1.0,
  });

  if (!isOpen) return null;

  const triggerSuccessConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#10b981', '#ffffff'],
    });
  };

  // 1. Export via Sharp (300 DPI / High-Res)
  const handleSharpExport = async (formatOverride?: 'png' | 'jpeg' | 'webp') => {
    setIsExporting(true);
    const format = formatOverride || sharpOptions.format;
    setExportStatus(`Sharp ইঞ্জিন দ্বারা ${sharpOptions.density} DPI ${format.toUpperCase()} প্রসেস হচ্ছে...`);

    try {
      const svgString = generatePosterSvg(poster);

      const response = await fetch('/api/export-sharp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          svg: svgString,
          format: format,
          density: sharpOptions.density,
          sharpen: sharpOptions.sharpen,
          quality: sharpOptions.quality,
          brightness: sharpOptions.brightness,
        }),
      });

      if (!response.ok) {
        throw new Error(`Sharp API error: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `darunnajat-madrasah-poster-${sharpOptions.density}dpi.${format === 'jpeg' ? 'jpg' : format}`;
      link.click();
      URL.revokeObjectURL(downloadUrl);

      setExportStatus('ডাউনলোড সফল হয়েছে!');
      triggerSuccessConfetti();
    } catch (err: any) {
      console.warn('Sharp API fallback to client rasterizer:', err);
      // Client-side fallback using html2canvas
      await handleClientCanvasExport(format);
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  // Fallback / Client-side rasterizer
  const handleClientCanvasExport = async (format: 'png' | 'jpeg' | 'webp') => {
    const posterEl = document.getElementById('poster-dom-element');
    if (!posterEl) return;

    setExportStatus('ব্রাউজার ক্যানভাস দ্বারা রেন্ডার হচ্ছে...');
    try {
      const canvas = await html2canvas(posterEl, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      const ext = format === 'jpeg' ? 'jpg' : format;
      const dataUrl = canvas.toDataURL(mimeType, 0.95);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `darunnajat-madrasah-poster.${ext}`;
      link.click();

      setExportStatus('ডাউনলোড সম্পন্ন!');
      triggerSuccessConfetti();
    } catch (e: any) {
      console.error('Canvas export error:', e);
      setExportStatus('এক্সপোর্টে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    }
  };

  // 2. Export Pure Vector SVG
  const handleSvgExport = () => {
    setIsExporting(true);
    setExportStatus('ভেক্টর SVG তৈরি হচ্ছে...');
    try {
      const svgData = generatePosterSvg(poster);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'darunnajat-madrasah-poster-vector.svg';
      link.click();
      URL.revokeObjectURL(url);

      setExportStatus('ভেক্টর SVG ডাউনলোড সম্পন্ন!');
      triggerSuccessConfetti();
    } catch (e) {
      console.error(e);
      setExportStatus('SVG এক্সপোর্টে সমস্যা হয়েছে');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  // 3. Export PDF (Print-ready A4)
  const handlePdfExport = async () => {
    setIsExporting(true);
    setExportStatus('প্রিন্ট-রেডি A4 PDF তৈরি হচ্ছে...');

    try {
      // First try to get 300 DPI high-res image from Sharp
      let imgData: string = '';
      try {
        const svgString = generatePosterSvg(poster);
        const response = await fetch('/api/export-sharp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            svg: svgString,
            format: 'jpeg',
            density: 200,
            quality: 95,
          }),
        });

        if (response.ok) {
          const blob = await response.blob();
          imgData = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        }
      } catch (err) {
        console.warn('PDF Sharp fetch fallback:', err);
      }

      // Fallback if needed
      if (!imgData) {
        const posterEl = document.getElementById('poster-dom-element');
        if (posterEl) {
          const canvas = await html2canvas(posterEl, { scale: 2, useCORS: true });
          imgData = canvas.toDataURL('image/jpeg', 0.95);
        }
      }

      if (imgData) {
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        pdf.save('darunnajat-madrasah-poster-a4.pdf');

        setExportStatus('A4 PDF ডাউনলোড সম্পন্ন!');
        triggerSuccessConfetti();
      }
    } catch (e) {
      console.error('PDF error:', e);
      setExportStatus('PDF তৈরিতে সমস্যা হয়েছে');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  // 4. Direct Browser Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950/80 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif-bn text-amber-200">
                পোস্টার এক্সপোর্ট ও ডাউনলোড স্টুডিও
              </h3>
              <p className="text-xs text-slate-400">
                Sharp ইমেজ প্রসেসিং • হাই রেজোলিউশন ৩০০০+ পিক্সেল • SVG / PNG / PDF
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 pt-2">
          <button
            onClick={() => setActiveTab('quick')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'quick'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            দ্রুত ডাউনলোড (Quick Formats)
          </button>
          <button
            onClick={() => setActiveTab('sharp-settings')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'sharp-settings'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Sharp 300 DPI সেটিংস</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {activeTab === 'quick' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option 1: Ultra PNG (Sharp 300 DPI) */}
              <button
                onClick={() => handleSharpExport('png')}
                disabled={isExporting}
                className="group p-4 rounded-xl bg-slate-800/80 hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-500/50 text-left transition-all duration-200 flex flex-col justify-between shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 group-hover:scale-110 transition-transform">
                    <FileImage className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Sharp 300 DPI
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">আল্ট্রা এইচডি PNG</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ক্রিস্টাল ক্লিয়ার প্রিন্ট কোয়ালিটি (2480 x 3508 px)
                  </p>
                </div>
              </button>

              {/* Option 2: Pure Scalable SVG */}
              <button
                onClick={handleSvgExport}
                disabled={isExporting}
                className="group p-4 rounded-xl bg-slate-800/80 hover:bg-amber-950/40 border border-slate-700 hover:border-amber-500/50 text-left transition-all duration-200 flex flex-col justify-between shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-lg bg-amber-500/20 text-amber-300 group-hover:scale-110 transition-transform">
                    <FileType className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ভেক্টর ফাইল
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">স্কেলেবল ভেক্টর (SVG)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    অসীম রেজোলিউশন, বিলবোর্ড বা প্রেস প্রিন্টের জন্য
                  </p>
                </div>
              </button>

              {/* Option 3: Print Ready PDF */}
              <button
                onClick={handlePdfExport}
                disabled={isExporting}
                className="group p-4 rounded-xl bg-slate-800/80 hover:bg-blue-950/40 border border-slate-700 hover:border-blue-500/50 text-left transition-all duration-200 flex flex-col justify-between shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-lg bg-blue-500/20 text-blue-300 group-hover:scale-110 transition-transform">
                    <FileImage className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    A4 সাইজ
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">প্রিন্ট-রেডি PDF</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    সরাসরি যেকোনো প্রিন্টারে প্রিন্ট করার উপযোগী
                  </p>
                </div>
              </button>

              {/* Option 4: Direct Print */}
              <button
                onClick={handlePrint}
                disabled={isExporting}
                className="group p-4 rounded-xl bg-slate-800/80 hover:bg-purple-950/40 border border-slate-700 hover:border-purple-500/50 text-left transition-all duration-200 flex flex-col justify-between shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-lg bg-purple-500/20 text-purple-300 group-hover:scale-110 transition-transform">
                    <Printer className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    ব্রাউজার প্রিন্ট
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">সরাসরি প্রিন্ট</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    প্রিন্টার ডায়লগ ওপেন করে সাথে সাথে প্রিন্ট করুন
                  </p>
                </div>
              </button>
            </div>
          ) : (
            /* Sharp Advanced Settings Tab */
            <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Sliders className="w-4 h-4" />
                <span>Sharp ইঞ্জিন ইমেজ প্রসেসিং অপশন</span>
              </div>

              {/* DPI Density selection */}
              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                  রেজোলিউশন ঘনত্ব (DPI / PPI)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '১৫০ DPI (ওয়েব)', val: 150 },
                    { label: '৩০০ DPI (প্রিন্ট)', val: 300 },
                    { label: '৬০০ DPI (প্রেস)', val: 600 },
                  ].map((d) => (
                    <button
                      key={d.val}
                      onClick={() => setSharpOptions({ ...sharpOptions, density: d.val })}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                        sharpOptions.density === d.val
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format selection */}
              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                  ফাইল ফরম্যাট
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setSharpOptions({ ...sharpOptions, format: fmt })}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold uppercase border transition-all ${
                        sharpOptions.format === fmt
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sharpen filter toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div>
                  <span className="text-xs text-slate-200 font-medium">শার্পনেস ফিল্টার (Sharpening)</span>
                  <p className="text-[11px] text-slate-400">ফন্ট ও বর্ডারের ধারালো ভাব বৃদ্ধি করে</p>
                </div>
                <input
                  type="checkbox"
                  checked={sharpOptions.sharpen}
                  onChange={(e) => setSharpOptions({ ...sharpOptions, sharpen: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>

              <button
                onClick={() => handleSharpExport()}
                disabled={isExporting}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Cpu className="w-4 h-4" />
                <span>Sharp দিয়ে {sharpOptions.density} DPI তে এক্সপোর্ট করুন</span>
              </button>
            </div>
          )}

          {/* Export status indicator */}
          {exportStatus && (
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs animate-in fade-in">
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              <span>{exportStatus}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>দারুননাজাত মাদ্রাসা ভর্তি পোস্টার ২০২৬-২৭</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
