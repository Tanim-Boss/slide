import React from 'react';
import {
  Sparkles,
  Download,
  Eye,
  PenTool,
  Shapes,
  Printer,
  Sliders,
  Share2,
} from 'lucide-react';

export type AppMode = 'showcase' | 'fabric' | 'vector';

interface PosterHeaderProps {
  mode: AppMode;
  onModeChange: (m: AppMode) => void;
  onOpenExport: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const PosterHeader: React.FC<PosterHeaderProps> = ({
  mode,
  onModeChange,
  onOpenExport,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-30 sticky top-0">
      {/* Left: Institution Logo & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors md:hidden"
          title="কাস্টমাইজেশন প্যানেল"
        >
          <Sliders className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl gold-metallic-bg flex items-center justify-center shadow-md border border-amber-200">
            <span className="text-amber-950 font-serif-bn font-black text-lg">দা</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base text-white font-serif-bn tracking-wide">
                দারুননাজাত মাদ্রাসা
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                ২০২৬ শিক্ষাবর্ষ
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-sans-bn hidden sm:block">
              ভর্তি পোস্টার ডিজাইন ও এক্সপোর্ট স্টুডিও
            </p>
          </div>
        </div>
      </div>

      {/* Center: Mode Switcher Tabs */}
      <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => onModeChange('showcase')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'showcase'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="প্রিমিয়াম লাইভ পোস্টার প্রিভিউ"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden md:inline">প্রিমিয়াম ভিউ</span>
        </button>

        <button
          onClick={() => onModeChange('fabric')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'fabric'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Fabric.js ক্যানভাস ইন্টারেক্টিভ এডিটর"
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Fabric.js এডিটর</span>
        </button>

        <button
          onClick={() => onModeChange('vector')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'vector'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="SVG.js ভেক্টর শেপ জেনারেটর"
        >
          <Shapes className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">SVG.js ভেক্টর</span>
        </button>
      </div>

      {/* Right: Actions (Print, Export Modal) */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => window.print()}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors hidden sm:flex items-center gap-1.5"
          title="সরাসরি প্রিন্ট করুন"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden lg:inline">প্রিন্ট</span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg transition-transform active:scale-95 border border-amber-300"
          title="PNG, SVG, PDF ডাউনলোড করুন"
        >
          <Download className="w-4 h-4" />
          <span>ডাউনলোড (PNG/SVG/PDF)</span>
        </button>
      </div>
    </header>
  );
};
