import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  ShieldAlert, 
  Sparkles, 
  CopyX, 
  PhoneOff, 
  Download, 
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function QualityAuditModal({
  isOpen,
  onClose,
  auditLog = [],
  metrics = {},
  onExportJSON,
  onExportCSV
}) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Checks' },
    { id: 'Deduplication', label: 'Deduplications' },
    { id: 'Missing Contact Cell', label: 'Missing Contacts' },
    { id: 'Whitespace Cleaning', label: 'Whitespace Fixed' },
    { id: 'State Standardization', label: 'State Norms' },
    { id: 'URL Formatting', label: 'URL Format' },
  ];

  const filteredLog = auditLog.filter(item => {
    const matchesCat = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = searchQuery === '' || 
      item.clinicName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recordId?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'critical':
        return {
          icon: ShieldAlert,
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          label: 'Deduplicated'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          label: 'Missing Cell'
        };
      case 'info':
      default:
        return {
          icon: Sparkles,
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          label: 'Sanitized'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                Itemized Data Quality Audit Report
              </h2>
              <p className="text-xs text-slate-300">
                Rule-by-rule engine execution log • Australian Primary Care Directory Scrape
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

        {/* Executive Summary Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400">Total Checks Logged:</span>
            <div className="font-bold text-slate-800 text-sm">{auditLog.length}</div>
          </div>
          <div>
            <span className="text-slate-400">Duplicates Pruned:</span>
            <div className="font-bold text-rose-600 text-sm">{metrics.duplicatesRemovedCount || 0}</div>
          </div>
          <div>
            <span className="text-slate-400">Missing Contact Cells:</span>
            <div className="font-bold text-amber-600 text-sm">
              {(metrics.missingPhoneCount || 0) + (metrics.missingWebsiteCount || 0)}
            </div>
          </div>
          <div>
            <span className="text-slate-400">Quality Score:</span>
            <div className="font-bold text-emerald-600 text-sm">
              {metrics.qualityScore || 100}% ({metrics.qualityGrade || 'A+'})
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                  filterCategory === cat.id
                    ? 'bg-brand-600 text-white border-brand-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Query within Logs */}
          <div className="relative w-full sm:w-64">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit descriptions..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

        </div>

        {/* Itemized List Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5 bg-slate-50/50">
          {filteredLog.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No audit records match the selected category and search criteria.
            </div>
          ) : (
            filteredLog.map((item) => {
              const badge = getSeverityBadge(item.severity);
              const Icon = badge.icon;

              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className={`p-1.5 rounded-lg border shrink-0 ${badge.bg}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs sm:text-sm text-slate-800">
                            {item.clinicName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            [{item.recordId}]
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 uppercase tracking-wide ${badge.bg}`}>
                      {item.category}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer with Export Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Showing <strong>{filteredLog.length}</strong> of <strong>{auditLog.length}</strong> check events
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onExportJSON}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Download JSON Audit</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
