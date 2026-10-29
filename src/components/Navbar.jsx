import React, { useState } from 'react';
import { 
  Activity, 
  Upload, 
  Download, 
  FileText, 
  Layers, 
  CheckCircle2, 
  ChevronDown,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { DATASET_PRESETS } from '../data/sampleData';

export default function Navbar({
  selectedPresetId,
  onSelectPreset,
  onOpenUpload,
  onOpenAuditModal,
  onExportCSV,
  onExportJSON,
  auditCount = 0,
  isCustomData = false
}) {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [presetMenuOpen, setPresetMenuOpen] = useState(false);

  const activePreset = DATASET_PRESETS.find(p => p.id === selectedPresetId);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Product Title */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  AcuMed<span className="text-brand-600">.Audit</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200/70">
                  v2.4 Data Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Australian Healthcare Scraped Directory Intelligence & Cleansing
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* Preset Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setPresetMenuOpen(!presetMenuOpen);
                  setExportMenuOpen(false);
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors shadow-2xs"
              >
                <Layers className="h-4 w-4 text-brand-600" />
                <span className="max-w-[130px] sm:max-w-[180px] truncate">
                  {isCustomData ? "Custom CSV Upload" : (activePreset?.name.split(" (")[0] || "Select Dataset")}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {presetMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setPresetMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Pre-loaded Scrape Samples (AU)
                    </p>
                  </div>
                  {DATASET_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onSelectPreset(preset.id);
                        setPresetMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 hover:bg-slate-50 transition-colors flex flex-col ${
                        !isCustomData && selectedPresetId === preset.id ? "bg-brand-50/70 border-l-4 border-brand-600" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-semibold text-slate-800">
                          {preset.name}
                        </span>
                        {!isCustomData && selectedPresetId === preset.id && (
                          <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {preset.description}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Upload CSV Trigger Button */}
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors shadow-2xs hover:border-slate-300"
              title="Upload your own scraped CSV dataset"
            >
              <Upload className="h-4 w-4 text-brand-600" />
              <span className="hidden sm:inline">Upload CSV</span>
            </button>

            {/* Audit Log Modal Trigger */}
            <button
              onClick={onOpenAuditModal}
              className="relative inline-flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors shadow-2xs"
              title="View itemized data cleansing audit trail"
            >
              <FileText className="h-4 w-4 text-amber-600" />
              <span className="hidden sm:inline">Audit Log</span>
              {auditCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold leading-none text-white bg-amber-500 rounded-full">
                  {auditCount}
                </span>
              )}
            </button>

            {/* Export Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setExportMenuOpen(!exportMenuOpen);
                  setPresetMenuOpen(false);
                }}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-xs shadow-brand-600/30 transition-all"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-80" />
              </button>

              {exportMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setExportMenuOpen(false)}
                >
                  <button
                    onClick={() => {
                      onExportCSV();
                      setExportMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4 text-brand-600" />
                    <div>
                      <div className="font-semibold">Cleaned CSV</div>
                      <div className="text-[11px] text-slate-400">Deduplicated & sanitized dataset</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      onExportJSON();
                      setExportMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-600 transition-colors flex items-center space-x-2 border-t border-slate-100"
                  >
                    <FileText className="h-4 w-4 text-amber-600" />
                    <div>
                      <div className="font-semibold">Audit Quality JSON</div>
                      <div className="text-[11px] text-slate-400">Itemized log & metric scores</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
