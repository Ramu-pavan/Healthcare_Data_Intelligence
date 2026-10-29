import React from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Clock, 
  Layers, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function ClinicDetailModal({
  clinic,
  isOpen,
  onClose
}) {
  if (!isOpen || !clinic) return null;

  const raw = clinic.rawRecord || {};
  const isComplete = !clinic.hasMissingPhone && !clinic.hasMissingWebsite;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/10 text-brand-300 border border-white/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold">
                  {clinic.clinicName}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/30 text-brand-200 border border-brand-400/30">
                  {clinic.id}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {clinic.city}, {clinic.state} • {clinic.practiceType}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs sm:text-sm">
          
          {/* Quality Status Pill Banner */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            isComplete ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-center space-x-2 font-semibold">
              {isComplete ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 text-amber-600" />}
              <span>{isComplete ? "Audit Passed: Complete Contact Record" : "Quality Warning: Missing Contact Information"}</span>
            </div>
            <span className="font-bold text-xs uppercase tracking-wider">
              Score: {clinic.completenessScore}/100
            </span>
          </div>

          {/* Contact Verification Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Phone Block */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                  <Phone className="h-3 w-3 mr-1 text-slate-400" />
                  Telephone Number
                </span>
                <div className="mt-1.5 font-bold text-slate-800 text-sm">
                  {clinic.phone || <span className="text-amber-600 font-normal">Missing / Unparseable</span>}
                </div>
              </div>
              {clinic.phone && (
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-medium">Valid AU Format</span>
                  <a 
                    href={`tel:${clinic.phone.replace(/[^\d+]/g, '')}`}
                    className="text-brand-600 hover:underline font-semibold"
                  >
                    Call Test
                  </a>
                </div>
              )}
            </div>

            {/* Website Block */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                  <Globe className="h-3 w-3 mr-1 text-slate-400" />
                  Website URL
                </span>
                <div className="mt-1.5 font-bold text-slate-800 text-sm truncate">
                  {clinic.website ? (
                    <a 
                      href={clinic.website} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-brand-600 hover:underline flex items-center space-x-1"
                    >
                      <span className="truncate">{clinic.website}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-amber-600 font-normal">Missing / No Domain Scraped</span>
                  )}
                </div>
              </div>
              {clinic.website && (
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-medium">HTTPS Protocol</span>
                  <span className="text-slate-400">DNS Verified</span>
                </div>
              )}
            </div>

          </div>

          {/* Raw Scrape vs Engine Cleaned Diff */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 font-bold text-xs text-slate-700 flex items-center justify-between">
              <span>Cleansing Engine Audit Comparison</span>
              <span className="text-[10px] text-slate-500 font-normal">Before vs After Processing</span>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="p-3 grid grid-cols-3 gap-2">
                <span className="font-medium text-slate-500">Clinic Name</span>
                <span className="text-slate-600 font-mono bg-rose-50/70 px-2 py-0.5 rounded truncate">
                  "{raw.clinicName || clinic.clinicName}"
                </span>
                <span className="text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded truncate font-bold">
                  "{clinic.clinicName}"
                </span>
              </div>
              <div className="p-3 grid grid-cols-3 gap-2">
                <span className="font-medium text-slate-500">City / State</span>
                <span className="text-slate-600 font-mono bg-rose-50/70 px-2 py-0.5 rounded">
                  {raw.city || clinic.city}, {raw.state || clinic.state}
                </span>
                <span className="text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  {clinic.city}, {clinic.state}
                </span>
              </div>
              <div className="p-3 grid grid-cols-3 gap-2">
                <span className="font-medium text-slate-500">Phone Raw</span>
                <span className="text-slate-600 font-mono bg-rose-50/70 px-2 py-0.5 rounded truncate">
                  "{raw.phone || 'N/A'}"
                </span>
                <span className="text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  {clinic.phone || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Source Metadata */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center space-x-1.5">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              <span>Source Bot: <strong className="text-slate-700">{clinic.scrapedSource}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Scraped: <strong className="text-slate-700">{clinic.scrapeTimestamp}</strong></span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
