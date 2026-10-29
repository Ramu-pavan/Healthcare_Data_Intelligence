import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Copy, 
  Check,
  Sparkles
} from 'lucide-react';

export default function ClinicDataTable({
  records = [],
  onSelectClinic,
  currentPage,
  onPageChange,
  rowsPerPage = 10,
  onRowsPerPageChange
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [sortField, setSortField] = useState('clinicName');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort records
  const sortedRecords = [...records].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination calculation
  const totalRecords = sortedRecords.length;
  const totalPages = Math.ceil(totalRecords / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRecords = sortedRecords.slice(startIndex, startIndex + rowsPerPage);

  const getStateBadgeClass = (state) => {
    switch (state) {
      case 'NSW': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'VIC': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'QLD': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'WA': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      
      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              
              {/* Clinic Name Column */}
              <th 
                onClick={() => handleSort('clinicName')}
                className="py-3.5 px-4 sm:px-6 cursor-pointer hover:bg-slate-100/70 transition-colors select-none"
              >
                <div className="flex items-center space-x-1.5">
                  <span>General Practice Clinic</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>

              {/* City / State Column */}
              <th 
                onClick={() => handleSort('city')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors select-none"
              >
                <div className="flex items-center space-x-1.5">
                  <span>City & State</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>

              {/* Phone Column */}
              <th className="py-3.5 px-4">
                <span>Phone Contact</span>
              </th>

              {/* Website Column */}
              <th className="py-3.5 px-4">
                <span>Website Domain</span>
              </th>

              {/* Contact Status Column */}
              <th 
                onClick={() => handleSort('completenessScore')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors select-none text-center"
              >
                <div className="flex items-center justify-center space-x-1.5">
                  <span>Health Status</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>

              {/* Actions Column */}
              <th className="py-3.5 px-4 text-right">
                <span>Audit</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 bg-slate-100 rounded-full text-slate-400">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">No clinics match current filter</p>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Try clearing your search query or selecting "All Cities" to view all available records.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((clinic) => {
                const isFullyComplete = !clinic.hasMissingPhone && !clinic.hasMissingWebsite;
                const isBothMissing = clinic.hasMissingPhone && clinic.hasMissingWebsite;

                return (
                  <tr 
                    key={clinic.id} 
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    
                    {/* Clinic Name & Practice Type */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5 p-2 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors shrink-0">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors flex items-center space-x-1.5">
                            <span>{clinic.clinicName}</span>
                            {clinic.rawRecord?.clinicName !== clinic.clinicName && (
                              <span 
                                title="Whitespace trimmed & sanitized by engine"
                                className="inline-flex items-center p-0.5 rounded text-[10px] bg-sky-100 text-sky-700"
                              >
                                <Sparkles className="h-2.5 w-2.5" />
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 flex items-center space-x-2">
                            <span>{clinic.practiceType || "General Practice"}</span>
                            {clinic.address && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-400 truncate max-w-[200px] sm:max-w-[280px]" title={clinic.address}>
                                  {clinic.address}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* City & State */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-800">{clinic.city || "Unspecified"}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStateBadgeClass(clinic.state)}`}>
                          {clinic.state || "AU"}
                        </span>
                      </div>
                      {clinic.postalCode && (
                        <div className="text-[11px] text-slate-400 pl-5 mt-0.5">
                          Postcode: {clinic.postalCode}
                        </div>
                      )}
                    </td>

                    {/* Phone Contact */}
                    <td className="py-3.5 px-4">
                      {clinic.phone ? (
                        <div className="flex items-center space-x-1.5">
                          <a
                            href={`tel:${clinic.phone.replace(/[^\d+]/g, '')}`}
                            className="font-medium text-slate-800 hover:text-brand-600 hover:underline transition-colors flex items-center"
                          >
                            <Phone className="h-3 w-3 mr-1 text-slate-400" />
                            {clinic.phone}
                          </a>
                          <button
                            onClick={() => handleCopy(clinic.phone, `phone-${clinic.id}`)}
                            title="Copy phone"
                            className="text-slate-300 hover:text-slate-600 p-1 rounded"
                          >
                            {copiedId === `phone-${clinic.id}` ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Missing Phone
                        </span>
                      )}
                    </td>

                    {/* Website Domain */}
                    <td className="py-3.5 px-4">
                      {clinic.website ? (
                        <a
                          href={clinic.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 font-medium text-brand-600 hover:text-brand-700 hover:underline truncate max-w-[180px] sm:max-w-[220px]"
                          title={clinic.website}
                        >
                          <Globe className="h-3 w-3 shrink-0" />
                          <span className="truncate">{clinic.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                          <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-70" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Missing Website
                        </span>
                      )}
                    </td>

                    {/* Health Status Indicator */}
                    <td className="py-3.5 px-4 text-center">
                      {isFullyComplete ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                          100% Full Contact
                        </span>
                      ) : isBothMissing ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                          <AlertTriangle className="h-3.5 w-3.5 mr-1 text-rose-500" />
                          No Contact Data
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                          <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-500" />
                          Partial (50%)
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectClinic(clinic)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-brand-600 transition-colors border border-slate-200 shadow-2xs"
                        title="Inspect record data quality"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Inspect</span>
                      </button>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-slate-400">|</span>
          <span>
            Showing <strong className="text-slate-800">{totalRecords === 0 ? 0 : startIndex + 1}</strong> to{' '}
            <strong className="text-slate-800">{Math.min(startIndex + rowsPerPage, totalRecords)}</strong> of{' '}
            <strong className="text-slate-800">{totalRecords}</strong> entries
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <span className="font-semibold text-slate-700 px-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
