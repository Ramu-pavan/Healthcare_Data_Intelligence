import React from 'react';
import { 
  Database, 
  CheckCircle, 
  CopyX, 
  PhoneOff, 
  Globe, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function MetricCards({ 
  metrics,
  onOpenDuplicateModal,
  onOpenAuditModal,
  onQuickFilterMissingPhone,
  onQuickFilterMissingWebsite,
  activeFilter
}) {
  const {
    rawCount = 0,
    cleanedCount = 0,
    duplicatesRemovedCount = 0,
    missingPhoneCount = 0,
    missingWebsiteCount = 0,
    missingBothContactsCount = 0,
    whitespaceFixedCount = 0,
    qualityScore = 100,
    qualityGrade = "A+"
  } = metrics;

  const phoneMissingPct = cleanedCount > 0 ? Math.round((missingPhoneCount / cleanedCount) * 100) : 0;
  const websiteMissingPct = cleanedCount > 0 ? Math.round((missingWebsiteCount / cleanedCount) * 100) : 0;

  // Grade color helper
  const getGradeBadge = (score) => {
    if (score >= 90) return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", bar: "bg-emerald-500" };
    if (score >= 75) return { bg: "bg-blue-50 text-blue-700 border-blue-200", bar: "bg-blue-500" };
    if (score >= 60) return { bg: "bg-amber-50 text-amber-700 border-amber-200", bar: "bg-amber-500" };
    return { bg: "bg-rose-50 text-rose-700 border-rose-200", bar: "bg-rose-500" };
  };

  const gradeStyle = getGradeBadge(qualityScore);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      
      {/* 1. Raw Ingested Records */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Raw Scraped
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <Database className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              {rawCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">records</span>
          </div>
        </div>
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center">
            <Sparkles className="h-3 w-3 mr-1 text-brand-500" />
            Whitespace fixed:
          </span>
          <span className="font-semibold text-slate-700">{whitespaceFixedCount} rows</span>
        </div>
      </div>

      {/* 2. Deduplicated & Cleaned Dataset */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Cleaned & Verified
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {cleanedCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">clinics retained</span>
          </div>
        </div>
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Retention rate:</span>
          <span className="font-semibold text-slate-700">
            {rawCount > 0 ? Math.round((cleanedCount / rawCount) * 100) : 100}%
          </span>
        </div>
      </div>

      {/* 3. Duplicates Flagged & Pruned */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Duplicates Pruned
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <CopyX className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600">
              {duplicatesRemovedCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">redundant rows</span>
          </div>
        </div>
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Match rule:</span>
          <button 
            onClick={onOpenDuplicateModal}
            className="inline-flex items-center text-xs font-semibold text-rose-600 hover:text-rose-700 underline underline-offset-2"
          >
            Review clusters <ArrowRight className="h-3 w-3 ml-0.5" />
          </button>
        </div>
      </div>

      {/* 4. Missing Contact Cell Counts */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Missing Contacts
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <PhoneOff className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">
              {missingPhoneCount + missingWebsiteCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">cells absent</span>
          </div>
        </div>
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={onQuickFilterMissingPhone}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              activeFilter === 'missing_phone' ? 'bg-amber-200 text-amber-900 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Phone: <span className="font-semibold text-amber-700">{missingPhoneCount}</span>
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={onQuickFilterMissingWebsite}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              activeFilter === 'missing_website' ? 'bg-amber-200 text-amber-900 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Web: <span className="font-semibold text-amber-700">{missingWebsiteCount}</span>
          </button>
        </div>
      </div>

      {/* 5. Health & Completeness Score */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Data Quality Score
            </span>
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {qualityScore}
              </span>
              <span className="text-xs font-bold text-slate-400">/100</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${gradeStyle.bg}`}>
              {qualityGrade}
            </span>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-100">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${gradeStyle.bar}`}
              style={{ width: `${Math.min(100, Math.max(5, qualityScore))}%` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
