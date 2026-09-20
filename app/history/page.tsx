'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  History, 
  Search, 
  Trash2, 
  Download, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  RotateCcw,
  Globe,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ScanHistoryItem, RiskLevel } from '@/lib/types';
import { 
  getScanHistory, 
  deleteScanFromHistory, 
  clearAllScanHistory, 
  formatDate, 
  getRiskColor 
} from '@/lib/utils';
import { ResultsDashboard } from '@/components/analyzer/results-dashboard';

export default function HistoryPage() {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [selectedScan, setSelectedScan] = useState<ScanHistoryItem | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setHistory(getScanHistory());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteScanFromHistory(id);
    setHistory(updated);
    if (selectedScan?.id === id) {
      setSelectedScan(null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your local scan history?')) {
      clearAllScanHistory();
      setHistory([]);
      setSelectedScan(null);
    }
  };

  const handleExportHistory = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `cybershield-history-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch {
      // ignore
    }
  };

  // Filter scans
  const filteredHistory = history.filter(item => {
    const matchesSearch =
      item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hostname.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRiskFilter === 'all' || item.riskLevel === selectedRiskFilter;
    return matchesSearch && matchesRisk;
  });

  if (!isClient) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-mono text-slate-500">
        Loading scan history...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Local Scan History
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Locally stored URL security assessments. Preserved in your browser storage for instant re-inspection.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={handleExportHistory}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/50 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export History JSON</span>
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Selected Scan Full View Modal / Inline */}
      {selectedScan && (
        <div className="space-y-4 p-6 rounded-3xl bg-slate-950 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Viewing Historical Report
            </h3>
            <button
              type="button"
              onClick={() => setSelectedScan(null)}
              className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1 bg-slate-900 rounded-lg border border-slate-800"
            >
              Close Detailed View
            </button>
          </div>

          <ResultsDashboard
            result={selectedScan.result}
            onReset={() => setSelectedScan(null)}
          />
        </div>
      )}

      {/* Search & Filter Controls */}
      {history.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter by domain or URL..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
            />
          </div>

          {/* Risk Level Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto overflow-x-auto max-w-full">
            {(['all', 'critical', 'high', 'moderate', 'low'] as const).map(risk => (
              <button
                key={risk}
                type="button"
                onClick={() => setSelectedRiskFilter(risk)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                  selectedRiskFilter === risk
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {risk === 'all' ? 'All Scans' : `${risk} Risk`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* History Grid */}
      {filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistory.map(item => {
            const colors = getRiskColor(item.riskLevel);
            const isSelected = selectedScan?.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedScan(item)}
                className={`p-5 rounded-2xl bg-slate-900/70 border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] bg-slate-900'
                    : `${colors.border} hover:border-cyan-500/50 hover:bg-slate-900/90`
                }`}
              >
                {/* Header: Risk badge & Date */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase border ${colors.badge}`}>
                    {item.riskLevel} Risk
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                    <Clock className="w-3 h-3 text-slate-600" />
                    {formatDate(item.timestamp)}
                  </span>
                </div>

                {/* Hostname & URL */}
                <div>
                  <h4 className="text-sm font-mono font-bold text-white truncate">
                    {item.hostname}
                  </h4>
                  <p className="text-xs font-mono text-slate-400 truncate mt-0.5">
                    {item.url}
                  </p>
                </div>

                {/* Summary snippet */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>

                {/* Footer stats & delete button */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-bold">
                      Score: {item.overallScore}/100
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className={item.threatCount > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                      {item.threatCount} Flags
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={e => handleDelete(item.id, e)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Delete scan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-cyan-400 font-semibold hover:underline">
                      Open &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : history.length > 0 ? (
        <div className="p-12 text-center space-y-3 bg-slate-900/30 border border-slate-800/60 rounded-3xl">
          <Search className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No matching scans found</h3>
          <p className="text-xs font-mono text-slate-400">
            No scans matched your search query or risk filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedRiskFilter('all');
            }}
            className="text-xs font-mono text-cyan-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="p-16 text-center space-y-4 bg-slate-950/60 border border-slate-900 rounded-3xl max-w-xl mx-auto">
          <History className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Scan History Yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            When you inspect URLs in CyberShield, results are saved locally in your browser so you can track and review previous assessments.
          </p>
          <Link
            href="/analyzer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <span>Start Your First Scan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
