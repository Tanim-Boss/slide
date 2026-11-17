import React, { useState, useRef } from 'react';
import { PosterData, ThemeId } from './types/poster';
import { DEFAULT_POSTER } from './data/defaultPoster';
import { THEMES } from './data/themes';
import { PosterHeader, AppMode } from './components/PosterHeader';
import { PosterCustomizer } from './components/PosterCustomizer';
import { PremiumPoster } from './components/PremiumPoster';
import { FabricPosterEditor } from './components/FabricPosterEditor';
import { SvgVectorStudio } from './components/SvgVectorStudio';
import { ExportModal } from './components/ExportModal';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Palette,
  Download,
  Share2,
  Check,
} from 'lucide-react';

export const App: React.FC = () => {
  const [poster, setPoster] = useState<PosterData>(DEFAULT_POSTER);
  const [mode, setMode] = useState<AppMode>('showcase');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(0.85);

  const posterRef = useRef<HTMLDivElement>(null);

  const handleQuickThemeChange = (themeId: ThemeId) => {
    setPoster((prev) => ({ ...prev, themeId }));
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Application Navigation */}
      <PosterHeader
        mode={mode}
        onModeChange={setMode}
        onOpenExport={() => setIsExportOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar Customizer (Collapsible) */}
        <aside
          className={`w-80 md:w-88 flex-shrink-0 z-20 transition-all duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:-ml-88'
          }`}
        >
          <PosterCustomizer poster={poster} onChange={setPoster} />
        </aside>

        {/* Center / Right Content Canvas */}
        <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
          {/* Quick Toolbar above Canvas (Only in Showcase Mode) */}
          {mode === 'showcase' && (
            <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/80 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
              {/* Quick Theme Swatches */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5 hidden sm:flex">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>থিম:</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {Object.values(THEMES).map((thm) => (
                    <button
                      key={thm.id}
                      onClick={() => handleQuickThemeChange(thm.id as ThemeId)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        poster.themeId === thm.id
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-sm'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                      }`}
                      title={thm.name}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: thm.accentGold }}
                      />
                      <span className="hidden md:inline">{thm.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom & View Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setScale((s) => Math.max(0.4, Number((s - 0.1).toFixed(2))))}
                    className="p-1 hover:text-amber-400 text-slate-400 transition-colors"
                    title="জুম আউট"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[11px] text-slate-300 w-11 text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={() => setScale((s) => Math.min(1.4, Number((s + 0.1).toFixed(2))))}
                    className="p-1 hover:text-amber-400 text-slate-400 transition-colors"
                    title="জুম ইন"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setScale(0.85)}
                    className="p-1 hover:text-amber-400 text-slate-400 transition-colors border-l border-slate-800 ml-1 pl-1.5"
                    title="রিসেট জুম (ফিট)"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setIsExportOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>এক্সপোর্ট</span>
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Workspace based on Mode */}
          <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center">
            {mode === 'showcase' && (
              <div className="flex flex-col items-center">
                {/* Master Rendered Premium Poster */}
                <div className="relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden border border-amber-500/20">
                  <PremiumPoster ref={posterRef} poster={poster} scale={scale} />
                </div>

                {/* Bottom Quick Feature Highlights Indicator */}
                <div className="mt-6 mb-8 text-center text-xs text-slate-500 flex items-center gap-4">
                  <span>✦ দারুননাজাত মাদ্রাসা প্রিমিয়াম পোস্টার</span>
                  <span>•</span>
                  <span>৭টি প্রধান বৈশিষ্ট্য অন্তর্ভুক্ত</span>
                  <span>•</span>
                  <span>৩০০ DPI হাই-রেজোলিউশন আউটপুট</span>
                </div>
              </div>
            )}

            {mode === 'fabric' && (
              <div className="w-full h-full max-w-6xl">
                <FabricPosterEditor poster={poster} />
              </div>
            )}

            {mode === 'vector' && (
              <div className="w-full h-full max-w-6xl">
                <SvgVectorStudio poster={poster} />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Export Dialog Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        poster={poster}
      />
    </div>
  );
};
