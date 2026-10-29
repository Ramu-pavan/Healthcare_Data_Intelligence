import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { parseUploadedCSV, getSampleCSVContent } from '../services/csvService';

export default function UploadModal({
  isOpen,
  onClose,
  onUploadSuccess
}) {
  const [dragActive, setDragActive] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedPreview, setParsedPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setErrorMessage("Please upload a valid .csv file.");
      return;
    }

    setParsing(true);
    setErrorMessage(null);

    try {
      const result = await parseUploadedCSV(file);
      if (result.error) {
        setErrorMessage(result.error);
        setParsing(false);
        return;
      }

      if (result.records.length === 0) {
        setErrorMessage("CSV file appears to be empty or missing clinic records.");
        setParsing(false);
        return;
      }

      setParsedPreview({
        file,
        records: result.records,
        headers: result.headers,
        mapping: result.mapping
      });
    } catch (err) {
      setErrorMessage("Failed to read file: " + err.message);
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleConfirmUpload = () => {
    if (!parsedPreview) return;
    onUploadSuccess(parsedPreview.records, parsedPreview.file.name);
    onClose();
  };

  const handleDownloadSample = () => {
    const content = getSampleCSVContent();
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Australian_GP_Sample_Template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const requiredFields = [
    { key: 'clinicName', label: 'Clinic Name' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'phone', label: 'Phone' },
    { key: 'website', label: 'Website' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-brand-700 via-brand-600 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/10 text-white border border-white/20">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                Ingest Custom Healthcare CSV
              </h2>
              <p className="text-xs text-brand-100">
                Automatic column matching, whitespace cleansing & duplicate elimination
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Drag & Drop Area */}
          {!parsedPreview ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-brand-500 bg-brand-50/50"
                  : "border-slate-300 hover:border-brand-400 bg-slate-50/60 hover:bg-slate-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="p-3 bg-brand-50 text-brand-600 rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-3">
                <FileSpreadsheet className="h-6 w-6" />
              </div>

              <p className="text-sm font-bold text-slate-800">
                {parsing ? "Parsing CSV structure..." : "Drag & drop your CSV file here"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                or click to browse from your computer
              </p>
              
              <div className="mt-4 inline-flex items-center text-xs text-brand-600 font-semibold bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
                <Sparkles className="h-3 w-3 mr-1" />
                Auto-detects clinic name, city, state, phone & website columns
              </div>
            </div>
          ) : (
            /* Parsed File Preview & Column Mapping Summary */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {parsedPreview.file.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {parsedPreview.records.length} records detected • {(parsedPreview.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setParsedPreview(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Change file
                </button>
              </div>

              {/* Column Mapping Health */}
              <div>
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Auto-Detected Column Mapping
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {requiredFields.map(field => {
                    const mappedCol = parsedPreview.mapping[field.key];
                    return (
                      <div 
                        key={field.key} 
                        className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${
                          mappedCol 
                            ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' 
                            : 'bg-amber-50/50 border-amber-200 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-700">{field.label}</span>
                          {mappedCol ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 truncate">
                          {mappedCol ? `Mapped: "${mappedCol}"` : "Not detected"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Sample CSV Download Link */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Need a formatted file to test?</span>
            <button
              onClick={handleDownloadSample}
              className="inline-flex items-center space-x-1 font-semibold text-brand-600 hover:text-brand-700 underline"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Australian GP CSV Template</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          
          {parsedPreview && (
            <button
              onClick={handleConfirmUpload}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-xs transition-colors"
            >
              <span>Process & Audit Records</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
