import React, { useEffect, useRef, useState } from 'react';
import { Canvas, IText, Rect, Circle, Shadow, FabricObject } from 'fabric';
import { PosterData } from '../types/poster';
import { THEMES } from '../data/themes';
import {
  Type,
  Square,
  Sparkles,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  RotateCcw,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
} from 'lucide-react';

interface FabricPosterEditorProps {
  poster: PosterData;
  onUpdatePoster?: (data: Partial<PosterData>) => void;
}

export const FabricPosterEditor: React.FC<FabricPosterEditorProps> = ({ poster }) => {
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#FEF08A');
  const [selectedFontSize, setSelectedFontSize] = useState<number>(24);
  const [zoomLevel, setZoomLevel] = useState<number>(0.75);
  const [statusMessage, setStatusMessage] = useState<string>('অবজেক্ট সিলেক্ট করে ড্র্যাগ বা সাইজ পরিবর্তন করুন');

  const theme = THEMES[poster.themeId] || THEMES['royal-emerald'];

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasElRef.current) return;

    // Create Canvas instance
    const canvas = new Canvas(canvasElRef.current, {
      width: 794,
      height: 1123,
      backgroundColor: poster.themeId === 'ivory-cream' ? '#fdfbf7' : '#042f24',
      selection: true,
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;

    // Selection events
    canvas.on('selection:created', (e) => {
      const obj = e.selected?.[0] || null;
      setSelectedObject(obj);
      if (obj && 'fontSize' in obj) {
        setSelectedFontSize((obj as any).fontSize || 24);
      }
      setStatusMessage('অবজেক্ট নির্বাচিত: সাইজ বা টেক্সট পরিবর্তন করুন');
    });

    canvas.on('selection:updated', (e) => {
      const obj = e.selected?.[0] || null;
      setSelectedObject(obj);
      if (obj && 'fontSize' in obj) {
        setSelectedFontSize((obj as any).fontSize || 24);
      }
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
      setStatusMessage('কোনো অবজেক্ট নির্বাচিত নেই');
    });

    // Populate Initial Poster Elements into Fabric
    loadPosterElements(canvas);

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [poster.themeId]);

  const loadPosterElements = (canvas: Canvas) => {
    canvas.clear();
    const isIvory = poster.themeId === 'ivory-cream';
    const bgFill = isIvory ? '#f8f5ed' : '#03261d';
    const primaryGold = theme.accentGold;
    const textFill = isIvory ? '#064e3b' : '#ffffff';

    // 1. Background Rectangle
    const bgRect = new Rect({
      left: 0,
      top: 0,
      width: 794,
      height: 1123,
      fill: bgFill,
      selectable: false,
      evented: false,
    });
    canvas.add(bgRect);

    // 2. Outer Ornamental Border
    const borderRect = new Rect({
      left: 20,
      top: 20,
      width: 754,
      height: 1083,
      rx: 12,
      ry: 12,
      fill: 'transparent',
      stroke: primaryGold,
      strokeWidth: 3,
      selectable: false,
      evented: false,
    });
    canvas.add(borderRect);

    const innerBorder = new Rect({
      left: 32,
      top: 32,
      width: 730,
      height: 1059,
      rx: 8,
      ry: 8,
      fill: 'transparent',
      stroke: '#fde047',
      strokeWidth: 1.2,
      strokeDashArray: [6, 4],
      selectable: false,
      evented: false,
    });
    canvas.add(innerBorder);

    // 3. Arabic Bismillah Calligraphy
    const bismillahText = new IText(poster.arabicHeader, {
      left: 397,
      top: 55,
      originX: 'center',
      fontFamily: 'Amiri, serif',
      fontSize: 28,
      fill: '#fde047',
      fontWeight: 'bold',
      shadow: new Shadow({ color: '#f59e0b', blur: 6, offsetX: 0, offsetY: 2 }),
    });
    canvas.add(bismillahText);

    // 4. Rabbi Zidni Ilma Crest
    const rabbiZidniText = new IText('رَبِّ زِدْنِي عِلْمًا — (হে প্রভু! আমার জ্ঞান বৃদ্ধি করে দিন)', {
      left: 397,
      top: 98,
      originX: 'center',
      fontFamily: 'Noto Serif Bengali, Amiri, serif',
      fontSize: 16,
      fill: '#fef08a',
    });
    canvas.add(rabbiZidniText);

    // 5. Main Title: দারুননাজাত মাদ্রাসা
    const titleText = new IText(poster.madrasahName, {
      left: 397,
      top: 135,
      originX: 'center',
      fontFamily: 'Noto Serif Bengali, serif',
      fontSize: 54,
      fontWeight: 'bold',
      fill: '#fef08a',
      shadow: new Shadow({ color: '#000000', blur: 10, offsetX: 0, offsetY: 4 }),
    });
    canvas.add(titleText);

    // 6. Subtitle
    const subtitleText = new IText(poster.subTitle, {
      left: 397,
      top: 208,
      originX: 'center',
      fontFamily: 'Hind Siliguri, sans-serif',
      fontSize: 18,
      fill: isIvory ? '#374151' : '#a7f3d0',
      textAlign: 'center',
    });
    canvas.add(subtitleText);

    // 7. Admission Open Highlight Box
    const badgeBg = new Rect({
      left: 397,
      top: 275,
      originX: 'center',
      originY: 'center',
      width: 480,
      height: 64,
      rx: 32,
      ry: 32,
      fill: '#f59e0b',
      stroke: '#ffffff',
      strokeWidth: 2,
      shadow: new Shadow({ color: 'rgba(0,0,0,0.4)', blur: 8, offsetX: 0, offsetY: 4 }),
    });
    canvas.add(badgeBg);

    const badgeText = new IText(`★ ${poster.admissionTitle} ★`, {
      left: 397,
      top: 275,
      originX: 'center',
      originY: 'center',
      fontFamily: 'Noto Serif Bengali, serif',
      fontSize: 34,
      fontWeight: 'bold',
      fill: '#451a03',
    });
    canvas.add(badgeText);

    // 8. Admission Start Date Pill
    const datePill = new Rect({
      left: 397,
      top: 340,
      originX: 'center',
      originY: 'center',
      width: 380,
      height: 40,
      rx: 20,
      ry: 20,
      fill: 'rgba(245, 158, 11, 0.25)',
      stroke: '#fde047',
      strokeWidth: 1.5,
    });
    canvas.add(datePill);

    const dateText = new IText(`📅 ${poster.admissionDate}`, {
      left: 397,
      top: 340,
      originX: 'center',
      originY: 'center',
      fontFamily: 'Hind Siliguri, sans-serif',
      fontSize: 18,
      fontWeight: 'bold',
      fill: '#fef08a',
    });
    canvas.add(dateText);

    // 9. Features Section Title
    const featuresHeader = new IText(`⚜️ ${poster.featuresTitle} ⚜️`, {
      left: 397,
      top: 395,
      originX: 'center',
      fontFamily: 'Noto Serif Bengali, serif',
      fontSize: 24,
      fontWeight: 'bold',
      fill: '#fde047',
    });
    canvas.add(featuresHeader);

    // 10. The 7 Features as editable cards
    const startY = 440;
    const cardHeight = 62;
    const cardGap = 12;

    poster.features.forEach((feature, idx) => {
      const isLeft = idx % 2 === 0;
      const row = Math.floor(idx / 2);
      const isSpecial = idx === 6;

      const cardWidth = isSpecial ? 680 : 330;
      const posX = isSpecial ? 397 : isLeft ? 215 : 580;
      const posY = startY + row * (cardHeight + cardGap);

      const fCard = new Rect({
        left: posX,
        top: posY,
        originX: 'center',
        originY: 'top',
        width: cardWidth,
        height: cardHeight,
        rx: 10,
        ry: 10,
        fill: isSpecial ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 0, 0, 0.35)',
        stroke: isSpecial ? '#f59e0b' : '#d97706',
        strokeWidth: 1.5,
      });
      canvas.add(fCard);

      const bengaliNums = ['১', '২', '৩', '৪', '৫', '৬', '৭'];
      const fText = new IText(`• ${bengaliNums[idx]}. ${feature}`, {
        left: posX - cardWidth / 2 + 20,
        top: posY + 18,
        fontFamily: 'Hind Siliguri, sans-serif',
        fontSize: 18,
        fontWeight: isSpecial ? 'bold' : 'normal',
        fill: isSpecial ? '#fef08a' : textFill,
      });
      canvas.add(fText);
    });

    // 11. Footer Location & Contacts
    const footerY = 820;

    const locationBox = new Rect({
      left: 397,
      top: footerY,
      originX: 'center',
      width: 680,
      height: 56,
      rx: 10,
      ry: 10,
      fill: 'rgba(0, 0, 0, 0.45)',
      stroke: '#f59e0b',
      strokeWidth: 1.5,
    });
    canvas.add(locationBox);

    const locationText = new IText(`📍 ${poster.location}`, {
      left: 397,
      top: footerY + 15,
      originX: 'center',
      fontFamily: 'Hind Siliguri, sans-serif',
      fontSize: 19,
      fontWeight: 'bold',
      fill: '#fef08a',
    });
    canvas.add(locationText);

    // Phones
    const phoneY = footerY + 75;
    const phone1 = new IText(`📞 ${poster.phones[0]}`, {
      left: 230,
      top: phoneY,
      originX: 'center',
      fontFamily: 'Hind Siliguri, sans-serif',
      fontSize: 22,
      fontWeight: 'bold',
      fill: '#f59e0b',
    });
    canvas.add(phone1);

    const phone2 = new IText(`📱 ${poster.phones[1]}`, {
      left: 560,
      top: phoneY,
      originX: 'center',
      fontFamily: 'Hind Siliguri, sans-serif',
      fontSize: 22,
      fontWeight: 'bold',
      fill: '#f59e0b',
    });
    canvas.add(phone2);

    // Urgent note
    const urgent = new IText(`📢 ${poster.urgentNote}`, {
      left: 397,
      top: phoneY + 50,
      originX: 'center',
      fontFamily: 'Hind Siliguri, sans-serif',
      fontSize: 15,
      fill: '#fef08a',
    });
    canvas.add(urgent);

    canvas.renderAll();
  };

  // Canvas Actions
  const handleAddText = () => {
    if (!fabricRef.current) return;
    const newText = new IText('নতুন বাংলা টেক্সট', {
      left: 397,
      top: 500,
      originX: 'center',
      fontFamily: 'Hind Siliguri, sans-serif',
      fontSize: 26,
      fill: selectedColor,
      fontWeight: 'bold',
    });
    fabricRef.current.add(newText);
    fabricRef.current.setActiveObject(newText);
    fabricRef.current.renderAll();
    setStatusMessage('নতুন টেক্সট যোগ করা হয়েছে। ডাবল ক্লিক করে লিখুন!');
  };

  const handleAddBadge = () => {
    if (!fabricRef.current) return;
    const seal = new Circle({
      left: 397,
      top: 400,
      originX: 'center',
      originY: 'center',
      radius: 40,
      fill: '#f59e0b',
      stroke: '#fef08a',
      strokeWidth: 3,
      shadow: new Shadow({ color: 'rgba(0,0,0,0.5)', blur: 6 }),
    });
    fabricRef.current.add(seal);
    fabricRef.current.setActiveObject(seal);
    fabricRef.current.renderAll();
    setStatusMessage('নতুন গোল্ডেন সিলমোহর যোগ করা হয়েছে');
  };

  const handleAddBox = () => {
    if (!fabricRef.current) return;
    const box = new Rect({
      left: 397,
      top: 450,
      originX: 'center',
      originY: 'center',
      width: 250,
      height: 60,
      rx: 12,
      ry: 12,
      fill: 'rgba(245, 158, 11, 0.2)',
      stroke: '#f59e0b',
      strokeWidth: 2,
    });
    fabricRef.current.add(box);
    fabricRef.current.setActiveObject(box);
    fabricRef.current.renderAll();
    setStatusMessage('নতুন ব্যানার বক্স যোগ করা হয়েছে');
  };

  const handleDelete = () => {
    if (!fabricRef.current || !selectedObject) return;
    fabricRef.current.remove(selectedObject);
    fabricRef.current.discardActiveObject();
    fabricRef.current.renderAll();
    setSelectedObject(null);
    setStatusMessage('অবজেক্ট মুছে ফেলা হয়েছে');
  };

  const handleBringForward = () => {
    if (!fabricRef.current || !selectedObject) return;
    fabricRef.current.bringObjectForward(selectedObject);
    fabricRef.current.renderAll();
    setStatusMessage('এক স্তর সামনে আনা হয়েছে');
  };

  const handleSendBackward = () => {
    if (!fabricRef.current || !selectedObject) return;
    fabricRef.current.sendObjectBackwards(selectedObject);
    fabricRef.current.renderAll();
    setStatusMessage('এক স্তর পেছনে নেওয়া হয়েছে');
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (!fabricRef.current || !selectedObject) return;
    if ('fill' in selectedObject) {
      selectedObject.set('fill', color);
      fabricRef.current.renderAll();
    }
  };

  const handleFontSizeChange = (delta: number) => {
    if (!fabricRef.current || !selectedObject) return;
    if ('fontSize' in selectedObject) {
      const newSize = Math.max(10, ((selectedObject as any).fontSize || 24) + delta);
      (selectedObject as any).set('fontSize', newSize);
      setSelectedFontSize(newSize);
      fabricRef.current.renderAll();
    }
  };

  const handleReset = () => {
    if (!fabricRef.current) return;
    loadPosterElements(fabricRef.current);
    setStatusMessage('পোস্টার রিসেট সম্পন্ন হয়েছে');
  };

  const handleDownloadPng = () => {
    if (!fabricRef.current) return;
    const dataUrl = fabricRef.current.toDataURL({
      format: 'png',
      multiplier: 2, // 2x high resolution
    });
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'darunnajat-madrasah-fabric-poster.png';
    link.click();
    setStatusMessage('ক্যানভাস ইমেজ ডাউনলোড শুরু হয়েছে!');
  };

  const handleDownloadSvg = () => {
    if (!fabricRef.current) return;
    const svgData = fabricRef.current.toSVG();
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'darunnajat-madrasah-fabric-vector.svg';
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage('ক্যানভাস এসভিজি ভেক্টর ডাউনলোড শুরু হয়েছে!');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Fabric Editor Top Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 p-3 flex flex-wrap items-center justify-between gap-2 z-10">
        {/* Left tools: Add elements */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleAddText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-colors"
            title="নতুন বাংলা লেখা যোগ করুন"
          >
            <Type className="w-3.5 h-3.5" />
            <span>টেক্সট যোগ</span>
          </button>
          <button
            onClick={handleAddBadge}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-colors"
            title="গোল্ডেন সিল যোগ করুন"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>সিল ব্যাজ</span>
          </button>
          <button
            onClick={handleAddBox}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            title="ব্যানার বক্স যোগ করুন"
          >
            <Square className="w-3.5 h-3.5" />
            <span>কার্ড বক্স</span>
          </button>
        </div>

        {/* Center: Selected Object Controls (Color, Font, Layer, Delete) */}
        {selectedObject && (
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
            {/* Color Swatches */}
            <div className="flex items-center gap-1">
              {['#FEF08A', '#F59E0B', '#FFFFFF', '#6EE7B7', '#F87171'].map((c) => (
                <button
                  key={c}
                  onClick={() => handleColorChange(c)}
                  className="w-4 h-4 rounded-full border border-slate-600 transition-transform hover:scale-125"
                  style={{ backgroundColor: c }}
                  title={`রং নির্বাচন: ${c}`}
                />
              ))}
            </div>

            {/* Font Size controls */}
            {'fontSize' in selectedObject && (
              <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
                <span className="text-[11px] text-slate-400 font-mono">{selectedFontSize}px</span>
                <button
                  onClick={() => handleFontSizeChange(2)}
                  className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 text-xs rounded"
                >
                  +
                </button>
                <button
                  onClick={() => handleFontSizeChange(-2)}
                  className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 text-xs rounded"
                >
                  -
                </button>
              </div>
            )}

            {/* Layer Controls */}
            <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
              <button
                onClick={handleBringForward}
                className="p-1 hover:bg-slate-700 text-slate-300 rounded"
                title="এক ধাপ সামনে আনুন"
              >
                <ArrowUpCircle className="w-4 h-4" />
              </button>
              <button
                onClick={handleSendBackward}
                className="p-1 hover:bg-slate-700 text-slate-300 rounded"
                title="এক ধাপ পেছনে নিন"
              >
                <ArrowDownCircle className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 hover:bg-rose-500/20 text-rose-400 rounded"
                title="মুছে ফেলুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Right tools: Zoom, Reset, Export */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.4, z - 0.1))}
              className="p-1 hover:text-amber-400"
              title="জুম আউট"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-300">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
              className="p-1 hover:text-amber-400"
              title="জুম ইন"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
            title="পোস্টার এলিমেন্ট রিসেট করুন"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDownloadPng}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md"
            title="Fabric ক্যানভাস থেকে সরাসরি PNG ডাউনলোড"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PNG</span>
          </button>
          <button
            onClick={handleDownloadSvg}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md"
            title="Fabric ক্যানভাস থেকে সরাসরি SVG ডাউনলোড"
          >
            <Download className="w-3.5 h-3.5" />
            <span>SVG</span>
          </button>
        </div>
      </div>

      {/* Info status strip */}
      <div className="bg-slate-900/60 px-4 py-1.5 border-b border-slate-800/80 text-xs flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{statusMessage}</span>
        </div>
        <div className="text-[11px] text-amber-400/90 font-sans-bn">
          💡 টিপস: যেকোনো লেখায় ডাবল ক্লিক করে সরাসরি টেক্সট সম্পাদনা করুন!
        </div>
      </div>

      {/* Fabric.js Canvas Scroll Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-slate-950 p-6 flex items-start justify-center"
      >
        <div
          className="shadow-2xl border border-slate-800 rounded-lg overflow-hidden transition-transform duration-200"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
          }}
        >
          <canvas ref={canvasElRef} />
        </div>
      </div>
    </div>
  );
};
