import React, { useState } from 'react';
import { PosterData, ThemeId, AspectRatioId } from '../types/poster';
import { THEMES } from '../data/themes';
import {
  Palette,
  FileText,
  Sliders,
  Sparkles,
  Layout,
  Plus,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  Check,
  RefreshCw,
} from 'lucide-react';
import { DEFAULT_POSTER } from '../data/defaultPoster';

interface PosterCustomizerProps {
  poster: PosterData;
  onChange: (updated: PosterData) => void;
}

export const PosterCustomizer: React.FC<PosterCustomizerProps> = ({ poster, onChange }) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'content' | 'ornaments'>('theme');

  const updateField = <K extends keyof PosterData>(field: K, value: PosterData[K]) => {
    onChange({
      ...poster,
      [field]: value,
    });
  };

  const updateOrnament = (key: keyof PosterData['ornaments'], val: boolean) => {
    onChange({
      ...poster,
      ornaments: {
        ...poster.ornaments,
        [key]: val,
      },
    });
  };

  const handleFeatureChange = (index: number, val: string) => {
    const newFeatures = [...poster.features];
    newFeatures[index] = val;
    updateField('features', newFeatures);
  };

  const handleAddFeature = () => {
    if (poster.features.length >= 10) return;
    updateField('features', [...poster.features, 'নতুন বৈশিষ্ট্য যোগ করুন']);
  };

  const handleRemoveFeature = (index: number) => {
    if (poster.features.length <= 1) return;
    const newFeatures = poster.features.filter((_, i) => i !== index);
    updateField('features', newFeatures);
  };

  const handleResetToDefault = () => {
    onChange({ ...DEFAULT_POSTER });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-100 select-none">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white font-serif-bn">পোস্টার কাস্টমাইজেশন</h3>
            <p className="text-[11px] text-slate-400">রং, লেখা ও অলঙ্করণ পরিবর্তন</p>
          </div>
        </div>
        <button
          onClick={handleResetToDefault}
          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
          title="ডিফল্ট তথ্যে ফিরে যান"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/40 p-1">
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'theme'
              ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>থিম ও সাইজ</span>
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'content'
              ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>তথ্য ও বৈশিষ্ট্য</span>
        </button>
        <button
          onClick={() => setActiveTab('ornaments')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'ornaments'
              ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>অলঙ্করণ</span>
        </button>
      </div>

      {/* Tab Contents Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* TAB 1: THEME & ASPECT RATIO */}
        {activeTab === 'theme' && (
          <>
            {/* Color Themes */}
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-2">
                পোস্টার কালার থিম (Royal Themes)
              </label>
              <div className="space-y-2">
                {Object.values(THEMES).map((theme) => {
                  const isSelected = poster.themeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => updateField('themeId', theme.id as ThemeId)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/10 shadow-md ring-1 ring-amber-400'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Theme Color Preview Orb */}
                        <div
                          className="w-8 h-8 rounded-full border-2 border-amber-300/60 shadow-md flex-shrink-0"
                          style={{ background: theme.bgGradient }}
                        />
                        <div>
                          <div className="text-xs font-bold text-white font-serif-bn">
                            {theme.name}
                          </div>
                          <div className="text-[10px] text-slate-400">{theme.nameEn}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Poster Format / Aspect Ratio */}
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-2">
                পোস্টার সাইজ ও রেশিও (Format Presets)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'a4', name: 'A4 প্রিন্ট পোস্টার', sub: '210 x 297 mm' },
                  { id: 'portrait-4-5', name: 'সোশ্যাল মিডিয়া (4:5)', sub: 'ফেসবুক/ইনস্টাগ্রাম' },
                  { id: 'square-1-1', name: 'স্কয়ার পোস্টার (1:1)', sub: 'হোয়াটসঅ্যাপ/প্রোফাইল' },
                  { id: 'banner-16-9', name: 'ল্যান্ডস্কেপ ব্যানার', sub: 'ব্যানার/বিলবোর্ড' },
                ].map((item) => {
                  const isSelected = poster.aspectRatio === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => updateField('aspectRatio', item.id as AspectRatioId)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/15 text-amber-200'
                          : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: CONTENT & FEATURES */}
        {activeTab === 'content' && (
          <>
            {/* Madrasah Name */}
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1">মাদ্রাসার নাম</label>
              <input
                type="text"
                value={poster.madrasahName}
                onChange={(e) => updateField('madrasahName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-serif-bn focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1">উপ-শিরোনাম (Subtitle)</label>
              <input
                type="text"
                value={poster.subTitle}
                onChange={(e) => updateField('subTitle', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Admission Date */}
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1">ভর্তি শুরুর তারিখ</label>
              <div className="relative">
                <input
                  type="text"
                  value={poster.admissionDate}
                  onChange={(e) => updateField('admissionDate', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Features List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-amber-300">
                  আমাদের বৈশিষ্ট্যসমূহ ({poster.features.length} টি)
                </label>
                <button
                  onClick={handleAddFeature}
                  className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>নতুন যোগ</span>
                </button>
              </div>

              <div className="space-y-2">
                {poster.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 text-xs text-amber-400 font-mono text-center">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={() => handleRemoveFeature(idx)}
                      disabled={poster.features.length <= 1}
                      className="p-1 text-slate-500 hover:text-rose-400 disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Address */}
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1">ঠিকানা / স্থান</label>
              <input
                type="text"
                value={poster.location}
                onChange={(e) => updateField('location', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Phone Numbers */}
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1">যোগাযোগের নম্বরসমূহ</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={poster.phones[0]}
                  onChange={(e) => {
                    const newPhones = [...poster.phones];
                    newPhones[0] = e.target.value;
                    updateField('phones', newPhones);
                  }}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
                <input
                  type="text"
                  value={poster.phones[1]}
                  onChange={(e) => {
                    const newPhones = [...poster.phones];
                    newPhones[1] = e.target.value;
                    updateField('phones', newPhones);
                  }}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>
          </>
        )}

        {/* TAB 3: ORNAMENTS & TOGGLES */}
        {activeTab === 'ornaments' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400 mb-3">
              পোস্টারের ইসলামিক আর্ট ও আলঙ্কারিক উপাদানগুলো সক্রিয় বা নিষ্ক্রিয় করুন:
            </div>

            {[
              { key: 'showBismillah', label: 'বিসমিল্লাহ আরবি ক্যালিগ্রাফি', sub: 'শীর্ষে ক্যালিগ্রাফি প্রদর্শন' },
              { key: 'showRabbiZidni', label: 'রাব্বি যিদনী ইলমা ক্রেস্ট', sub: 'কুরআনের দোয়া ও অনুবাদ' },
              { key: 'showFoilBorder', label: 'রয়েল গোল্ডেন ফয়েল বর্ডার', sub: 'চারপাশে সোনালী রাজকীয় ফ্রেম' },
              { key: 'showCornerFiligrees', label: 'চার কোণার রাজকীয় নকশা', sub: 'আরবেস্ক কর্নার ফিলগ্রি' },
              { key: 'showGeometricBackground', label: 'ইসলামিক জ্যামিতিক নকশা', sub: 'ব্যাকগ্রাউন্ডে গিরিহ স্টার প্যাটার্ন' },
              { key: 'showGoldBadge', label: 'ভর্তি চলছে থ্রিডি ব্যাজ', sub: 'গোল্ডেন রোজেট সিলমোহর ফিতা' },
              { key: 'showQrCode', label: 'স্মার্ট কিউআর কোড', sub: 'স্ক্যান করে তথ্য জানার ব্যবস্থা' },
            ].map((item) => {
              const checked = poster.ornaments[item.key as keyof PosterData['ornaments']];
              return (
                <label
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-200">{item.label}</div>
                    <div className="text-[10px] text-slate-400">{item.sub}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      updateOrnament(item.key as keyof PosterData['ornaments'], e.target.checked)
                    }
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
