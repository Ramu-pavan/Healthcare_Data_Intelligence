import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import MetricCards from './components/MetricCards';
import CityDistributionChart from './components/CityDistributionChart';
import FilterControls from './components/FilterControls';
import ClinicDataTable from './components/ClinicDataTable';
import QualityAuditModal from './components/QualityAuditModal';
import DuplicateReviewModal from './components/DuplicateReviewModal';
import UploadModal from './components/UploadModal';
import ClinicDetailModal from './components/ClinicDetailModal';

import { DATASET_PRESETS, AUSTRALIAN_GP_DATASET_DEFAULT } from './data/sampleData';
import { executeDataCleansingEngine } from './services/dataCleansingEngine';
import { exportToCSV, exportAuditReportJSON } from './services/csvService';
import { Sparkles, Database, FileSpreadsheet, Activity, CheckCircle, Info } from 'lucide-react';

export default function App() {
  // Dataset state
  const [selectedPresetId, setSelectedPresetId] = useState('preset-all-au');
  const [rawRecords, setRawRecords] = useState(AUSTRALIAN_GP_DATASET_DEFAULT);
  const [isCustomData, setIsCustomData] = useState(false);
  const [customDataName, setCustomDataName] = useState('');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [inspectedClinic, setInspectedClinic] = useState(null);

  // Filter & Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCities, setSelectedCities] = useState([]);
  const [activeQualityFilter, setActiveQualityFilter] = useState('all'); // 'all', 'complete', 'missing_phone', 'missing_website', 'incomplete'
  const [viewMode, setViewMode] = useState('cleaned'); // 'cleaned' or 'raw'
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Execute Cleansing Engine whenever raw data changes
  const engineResult = useMemo(() => {
    return executeDataCleansingEngine(rawRecords);
  }, [rawRecords]);

  // Handle Preset Selection
  const handleSelectPreset = (presetId) => {
    const preset = DATASET_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSelectedPresetId(presetId);
      setRawRecords(preset.data);
      setIsCustomData(false);
      setCustomDataName('');
      // Reset filters and page
      setSelectedCities([]);
      setSearchTerm('');
      setActiveQualityFilter('all');
      setCurrentPage(1);
    }
  };

  // Handle Custom CSV Ingestion
  const handleCustomUpload = (newRecords, filename) => {
    setRawRecords(newRecords);
    setIsCustomData(true);
    setCustomDataName(filename);
    setSelectedPresetId('');
    setSelectedCities([]);
    setSearchTerm('');
    setActiveQualityFilter('all');
    setCurrentPage(1);
  };

  // Extract all available cities dynamically from the current dataset
  const availableCities = useMemo(() => {
    const sourceRecords = viewMode === 'cleaned' ? engineResult.cleanedRecords : rawRecords;
    const citiesSet = new Set();
    sourceRecords.forEach(r => {
      const city = r.city || r.City || '';
      if (city.trim()) citiesSet.add(city.trim());
    });
    return Array.from(citiesSet).sort();
  }, [viewMode, engineResult.cleanedRecords, rawRecords]);

  // Toggle single city in multi-select
  const handleToggleCity = (city) => {
    setSelectedCities(prev => 
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
    setCurrentPage(1);
  };

  const handleClearCities = () => {
    setSelectedCities([]);
    setCurrentPage(1);
  };

  // Reset all filters
  const handleResetAllFilters = () => {
    setSearchTerm('');
    setSelectedCities([]);
    setActiveQualityFilter('all');
    setCurrentPage(1);
  };

  // Filter records based on View Mode, Search Term, Selected Cities, and Quality Filter
  const filteredRecords = useMemo(() => {
    const baseList = viewMode === 'cleaned' ? engineResult.cleanedRecords : rawRecords.map((r, i) => ({
      id: r.id || `RAW-${i + 1}`,
      clinicName: r.clinicName || r.ClinicName || '',
      city: r.city || r.City || '',
      state: r.state || r.State || '',
      phone: r.phone || r.Phone || '',
      website: r.website || r.Website || '',
      address: r.address || r.Address || '',
      postalCode: r.postalCode || r.PostalCode || '',
      practiceType: r.practiceType || r.PracticeType || 'General Practice',
      hasMissingPhone: !r.phone || r.phone.trim() === '' || ['n/a', 'null', '-'].includes(String(r.phone).trim().toLowerCase()),
      hasMissingWebsite: !r.website || r.website.trim() === '' || ['none', 'n/a', 'pending', '-'].includes(String(r.website).trim().toLowerCase()),
      completenessScore: 75,
      rawRecord: r
    }));

    return baseList.filter(rec => {
      // 1. Keyword search across all columns
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchName = rec.clinicName?.toLowerCase().includes(query);
        const matchCity = rec.city?.toLowerCase().includes(query);
        const matchState = rec.state?.toLowerCase().includes(query);
        const matchPhone = rec.phone?.toLowerCase().includes(query);
        const matchWeb = rec.website?.toLowerCase().includes(query);
        const matchAddr = rec.address?.toLowerCase().includes(query);
        const matchType = rec.practiceType?.toLowerCase().includes(query);

        if (!matchName && !matchCity && !matchState && !matchPhone && !matchWeb && !matchAddr && !matchType) {
          return false;
        }
      }

      // 2. Multi-select city filter
      if (selectedCities.length > 0) {
        if (!selectedCities.includes(rec.city)) {
          return false;
        }
      }

      // 3. Quality flag filter
      if (activeQualityFilter === 'complete') {
        if (rec.hasMissingPhone || rec.hasMissingWebsite) return false;
      } else if (activeQualityFilter === 'missing_phone') {
        if (!rec.hasMissingPhone) return false;
      } else if (activeQualityFilter === 'missing_website') {
        if (!rec.hasMissingWebsite) return false;
      } else if (activeQualityFilter === 'incomplete') {
        if (!rec.hasMissingPhone && !rec.hasMissingWebsite) return false;
      }

      return true;
    });
  }, [viewMode, engineResult.cleanedRecords, rawRecords, searchTerm, selectedCities, activeQualityFilter]);

  // Export handlers
  const handleExportCleanedCSV = () => {
    const filename = isCustomData 
      ? `Cleaned_${customDataName.replace(/\.csv$/i, '') || 'CustomData'}.csv`
      : 'Australian_Healthcare_Cleaned_Dataset.csv';
    exportToCSV(engineResult.cleanedRecords, filename);
  };

  const handleExportAuditJSON = () => {
    exportAuditReportJSON(engineResult);
  };

  const isFiltered = searchTerm !== '' || selectedCities.length > 0 || activeQualityFilter !== 'all';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Sticky Modern Navbar */}
      <Navbar
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onExportCSV={handleExportCleanedCSV}
        onExportJSON={handleExportAuditJSON}
        auditCount={engineResult.auditLog.length}
        isCustomData={isCustomData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Executive Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-brand-300 border border-white/15 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Australian GP Data Intelligence & Quality Engine</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                Healthcare Web Scraping Audit & Cleansing
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                Automated whitespace sanitation, duplicate resolution by clinic & city, 
                and contact cell completeness verification across Sydney, Melbourne, Brisbane, and Perth.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsAuditModalOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 bg-white hover:bg-slate-100 transition-colors shadow-xs"
              >
                <Activity className="h-4 w-4 text-brand-600" />
                <span>Quality Audit Trail ({engineResult.auditLog.length})</span>
              </button>
              <button
                onClick={handleExportCleanedCSV}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-colors shadow-xs shadow-brand-600/30"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Download Cleaned CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. Metric Cards (KPI summary) */}
        <MetricCards
          metrics={engineResult}
          onOpenDuplicateModal={() => setIsDuplicateModalOpen(true)}
          onOpenAuditModal={() => setIsAuditModalOpen(true)}
          onQuickFilterMissingPhone={() => {
            setActiveQualityFilter('missing_phone');
            setCurrentPage(1);
          }}
          onQuickFilterMissingWebsite={() => {
            setActiveQualityFilter('missing_website');
            setCurrentPage(1);
          }}
          activeFilter={activeQualityFilter}
        />

        {/* 2. Visual Geographic Breakdown (Bar / Progress Metrics) */}
        <CityDistributionChart
          cityDistribution={engineResult.cityDistribution}
          totalClinics={engineResult.cleanedCount}
          selectedCities={selectedCities}
          onToggleCityFilter={handleToggleCity}
          onResetCityFilter={handleClearCities}
        />

        {/* 3. Interactive UI Controls (Search, City Chips, Filters) */}
        <FilterControls
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          availableCities={availableCities}
          selectedCities={selectedCities}
          onToggleCity={handleToggleCity}
          onSelectAllCities={() => setSelectedCities([])}
          onClearCities={handleClearCities}
          activeQualityFilter={activeQualityFilter}
          onSelectQualityFilter={(val) => {
            setActiveQualityFilter(val);
            setCurrentPage(1);
          }}
          viewMode={viewMode}
          onViewModeChange={(val) => {
            setViewMode(val);
            setCurrentPage(1);
          }}
          totalResultsCount={filteredRecords.length}
          isFiltered={isFiltered}
          onResetAllFilters={handleResetAllFilters}
        />

        {/* 4. Responsive Clinic Data Table */}
        <ClinicDataTable
          records={filteredRecords}
          onSelectClinic={(clinic) => setInspectedClinic(clinic)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(val) => {
            setRowsPerPage(val);
            setCurrentPage(1);
          }}
        />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">AcuMed Healthcare Intelligence</span>
            <span>•</span>
            <span>Australian Primary Care Data Quality Engineering</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="hover:text-brand-600 transition-colors"
            >
              Upload CSV
            </button>
            <button 
              onClick={() => setIsAuditModalOpen(true)}
              className="hover:text-brand-600 transition-colors"
            >
              Audit Checks ({engineResult.auditLog.length})
            </button>
            <button 
              onClick={handleExportCleanedCSV}
              className="hover:text-brand-600 transition-colors font-medium text-brand-600"
            >
              Export Cleaned CSV
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Inspection Drawers */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleCustomUpload}
      />

      <QualityAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        auditLog={engineResult.auditLog}
        metrics={engineResult}
        onExportJSON={handleExportAuditJSON}
        onExportCSV={handleExportCleanedCSV}
      />

      <DuplicateReviewModal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        duplicateClusters={engineResult.duplicateClusters}
      />

      <ClinicDetailModal
        clinic={inspectedClinic}
        isOpen={!!inspectedClinic}
        onClose={() => setInspectedClinic(null)}
      />

    </div>
  );
}
