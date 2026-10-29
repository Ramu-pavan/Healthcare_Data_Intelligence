import React from 'react';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  Check, 
  AlertCircle, 
  PhoneOff, 
  Globe, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function FilterControls({
  searchTerm,
  onSearchChange,
  availableCities = [],
  selectedCities = [],
  onToggleCity,
  onSelectAllCities,
  onClearCities,
  activeQualityFilter,
  onSelectQualityFilter,
  viewMode,
  onViewModeChange,
  totalResultsCount = 0,
  isFiltered = false,
  onResetAllFilters
}) {
  const qualityOptions = [
    { id: 'all', label: 'All Records', icon: Layers },
    { id: 'complete', label: '100% Complete', icon: Sparkles, color: 'text-emerald-600' },
    { id: 'missing_phone', label: 'Missing Phone', icon: PhoneOff, color: 'text-amber-600' },
    { id: 'missing_website', label: 'Missing Website', icon: Globe, color: 'text-amber-600' },
    { id: 'incomplete', label: 'Any Incomplete', icon: AlertCircle, color: 'text-rose-600' },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      
      {/* Top Row: Search Input + View Mode Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Real-time Keyword Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search across clinic name, city, state, phone, website, or address..."
            className="block w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* View Mode Switcher (Cleaned vs Raw vs Duplicates) */}
        <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl self-start lg:self-auto shrink-0 border border-slate-200/70">
          <button
            onClick={() => onViewModeChange('cleaned')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'cleaned'
                ? 'bg-white text-brand-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cleaned Records
          </button>
          <button
            onClick={() => onViewModeChange('raw')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'raw'
                ? 'bg-white text-slate-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Raw Ingested
          </button>
        </div>

      </div>

      {/* Middle Row: Multi-select City Filter Chips */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1 flex items-center">
          <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
          Cities:
        </span>

        {/* "All" button */}
        <button
          onClick={onClearCities}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors border ${
            selectedCities.length === 0
              ? 'bg-brand-600 text-white border-brand-600 shadow-2xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          All Cities
        </button>

        {/* Individual City Multi-Select Chips */}
        {availableCities.map((city) => {
          const isSelected = selectedCities.includes(city);
          return (
            <button
              key={city}
              onClick={() => onToggleCity(city)}
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors border ${
                isSelected
                  ? 'bg-brand-50 text-brand-700 border-brand-300 ring-1 ring-brand-500/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {isSelected && <Check className="h-3 w-3 text-brand-600" />}
              <span>{city}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Row: Quality Audit Status Filter Buttons & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-slate-400 mr-1 hidden sm:inline">
            Quality Flag:
          </span>
          {qualityOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = activeQualityFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onSelectQualityFilter(opt.id)}
                className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                  isSelected
                    ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-3 w-3 ${isSelected ? 'text-brand-300' : opt.color || 'text-slate-400'}`} />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Count & Reset Filter */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900 font-bold">{totalResultsCount}</strong> clinics
          </span>
          {isFiltered && (
            <button
              onClick={onResetAllFilters}
              className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700 underline underline-offset-2"
            >
              Reset All
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
