import React from 'react';
import { X, CopyX, CheckCircle, Trash2, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function DuplicateReviewModal({
  isOpen,
  onClose,
  duplicateClusters = []
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/10 text-white border border-white/20">
              <CopyX className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                Duplicate Clinic Cluster Review
              </h2>
              <p className="text-xs text-rose-200">
                Rule: Matched on normalized (Clinic Name + City). Retained richest contact record.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {duplicateClusters.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No duplicate clusters found in current dataset</p>
              <p className="text-xs text-slate-400">All clinic names within each city are unique.</p>
            </div>
          ) : (
            duplicateClusters.map((cluster, idx) => (
              <div 
                key={cluster.key || idx} 
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3"
              >
                {/* Cluster Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800 text-sm">
                      {cluster.clinicName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-slate-400" />
                      {cluster.city}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    {cluster.totalFound} instances detected
                  </span>
                </div>

                {/* Compare Retained vs Discarded */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  
                  {/* Retained Primary Record */}
                  <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200">
                    <div className="flex items-center space-x-1.5 text-emerald-700 font-bold mb-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Retained Primary Record</span>
                      <span className="text-[10px] text-emerald-600 font-mono">({cluster.chosenRecord.id})</span>
                    </div>
                    <div className="space-y-1 text-slate-700">
                      <div><strong>Cleaned Name:</strong> {cluster.chosenRecord.clinicName}</div>
                      <div><strong>Phone:</strong> {cluster.chosenRecord.phone || <em className="text-slate-400">Missing</em>}</div>
                      <div><strong>Website:</strong> {cluster.chosenRecord.website || <em className="text-slate-400">Missing</em>}</div>
                      <div><strong>Source:</strong> {cluster.chosenRecord.scrapedSource}</div>
                    </div>
                  </div>

                  {/* Discarded Duplicate(s) */}
                  <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200">
                    <div className="flex items-center space-x-1.5 text-rose-700 font-bold mb-2">
                      <Trash2 className="h-4 w-4 text-rose-600" />
                      <span>Pruned Duplicate Instance(s)</span>
                    </div>
                    <div className="space-y-2">
                      {cluster.discardedRecords.map((disc) => (
                        <div key={disc.id} className="pt-1 border-t border-rose-100 first:border-none first:pt-0 text-slate-700">
                          <div className="text-[10px] font-mono text-rose-600">ID: {disc.id}</div>
                          <div><strong>Raw Name:</strong> "{disc.rawRecord?.clinicName || disc.clinicName}"</div>
                          <div><strong>Phone:</strong> {disc.phone || <em className="text-slate-400">Missing</em>}</div>
                          <div><strong>Website:</strong> {disc.website || <em className="text-slate-400">Missing</em>}</div>
                          <div><strong>Source:</strong> {disc.scrapedSource}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
