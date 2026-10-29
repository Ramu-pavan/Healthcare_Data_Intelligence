import React from 'react';
import { MapPin, Phone, Globe, ChevronRight, BarChart3, Filter } from 'lucide-react';

export default function CityDistributionChart({
  cityDistribution = {},
  totalClinics = 0,
  selectedCities = [],
  onToggleCityFilter,
  onResetCityFilter
}) {
  const citiesArray = Object.values(cityDistribution).sort((a, b) => b.count - a.count);

  // Australian state badge color helper
  const getStateColor = (state) => {
    switch (state) {
      case 'NSW': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'VIC': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'QLD': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'WA': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getCityAccent = (index) => {
    const gradients = [
      'from-brand-600 to-cyan-500',
      'from-indigo-600 to-purple-500',
      'from-teal-600 to-emerald-500',
      'from-amber-500 to-orange-500',
      'from-rose-500 to-pink-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-slate-800">
              Geographic Distribution Breakdown
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Australian General Practices volume, percentage share & contact coverage per metropolitan cluster
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          {selectedCities.length > 0 && (
            <button
              onClick={onResetCityFilter}
              className="inline-flex items-center px-2.5 py-1 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium"
            >
              Reset Filter ({selectedCities.length} active)
            </button>
          )}
          <span className="text-slate-400 font-medium">Click city row to filter table</span>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {citiesArray.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No city distribution data available.
          </div>
        ) : (
          citiesArray.map((item, index) => {
            const percentage = totalClinics > 0 ? Math.round((item.count / totalClinics) * 100) : 0;
            const fullContactPct = item.count > 0 ? Math.round((item.fullContactsCount / item.count) * 100) : 0;
            const isSelected = selectedCities.includes(item.city);

            return (
              <div
                key={item.city}
                onClick={() => onToggleCityFilter(item.city)}
                className={`group cursor-pointer rounded-xl p-3 sm:p-3.5 transition-all duration-150 border ${
                  isSelected 
                    ? 'bg-brand-50/70 border-brand-300 ring-2 ring-brand-500/20 shadow-xs' 
                    : 'bg-slate-50/60 hover:bg-slate-100/70 border-transparent hover:border-slate-200'
                }`}
              >
                {/* Header row for city */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center space-x-2 sm:space-x-2.5">
                    <span className="font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
                      {item.city}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getStateColor(item.state)}`}>
                      {item.state}
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-600 text-white">
                        Filtered
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <span className="hidden md:inline-flex items-center">
                        <Phone className="h-3 w-3 mr-0.5 text-slate-400" />
                        {item.count - item.missingPhoneCount}/{item.count} phones
                      </span>
                      <span className="text-slate-300 hidden md:inline">|</span>
                      <span className="hidden md:inline-flex items-center">
                        <Globe className="h-3 w-3 mr-0.5 text-slate-400" />
                        {item.count - item.missingWebsiteCount}/{item.count} websites
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {fullContactPct}% full
                      </span>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                        {item.count}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">
                        ({percentage}%)
                      </span>
                    </div>

                    <ChevronRight className={`h-4 w-4 text-slate-400 group-hover:text-brand-600 transition-transform ${
                      isSelected ? 'rotate-90 text-brand-600' : 'group-hover:translate-x-0.5'
                    }`} />
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="mt-2.5 w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${getCityAccent(index)} transition-all duration-500`}
                    style={{ width: `${Math.max(6, percentage)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
