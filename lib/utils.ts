import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RiskLevel, Severity, ScanHistoryItem, URLAnalysisResult } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | number): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Recently';
  }
}

export function getRiskColor(riskLevel: RiskLevel): {
  text: string;
  bg: string;
  border: string;
  glow: string;
  badge: string;
} {
  switch (riskLevel) {
    case 'critical':
      return {
        text: 'text-rose-400',
        bg: 'bg-rose-950/40',
        border: 'border-rose-500/40',
        glow: 'shadow-[0_0_25px_rgba(244,63,94,0.35)]',
        badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      };
    case 'high':
      return {
        text: 'text-orange-400',
        bg: 'bg-orange-950/40',
        border: 'border-orange-500/40',
        glow: 'shadow-[0_0_25px_rgba(249,115,22,0.35)]',
        badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
      };
    case 'moderate':
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-950/40',
        border: 'border-amber-500/40',
        glow: 'shadow-[0_0_25px_rgba(245,158,11,0.35)]',
        badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      };
    case 'low':
    default:
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-950/40',
        border: 'border-emerald-500/40',
        glow: 'shadow-[0_0_25px_rgba(16,185,129,0.35)]',
        badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      };
  }
}

export function getSeverityClasses(severity: Severity): string {
  switch (severity) {
    case 'critical':
      return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    case 'high':
      return 'bg-orange-500/15 text-orange-300 border-orange-500/30';
    case 'medium':
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    case 'low':
      return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
    case 'info':
    default:
      return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
  }
}

const HISTORY_STORAGE_KEY = 'cybershield_scan_history_v1';

export function getScanHistory(): ScanHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse scan history from localStorage:', err);
    return [];
  }
}

export function saveScanToHistory(result: URLAnalysisResult): ScanHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getScanHistory();
    const newItem: ScanHistoryItem = {
      id: result.id,
      timestamp: Date.now(),
      url: result.url,
      hostname: result.technicalDetails.structure.hostname,
      overallScore: result.overallScore,
      riskLevel: result.riskLevel,
      riskLabel: result.riskLabel,
      threatCount: result.threatFlags.length,
      summary: result.summary,
      result,
    };

    // Filter out duplicates of the same exact URL to keep history tidy, then prepend
    const updated = [newItem, ...current.filter(item => item.url !== result.url)].slice(0, 50);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save scan to history:', err);
    return [];
  }
}

export function deleteScanFromHistory(id: string): ScanHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getScanHistory();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearAllScanHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch {
    // silent
  }
}

export function downloadJsonReport(result: URLAnalysisResult): void {
  try {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const domainClean = result.technicalDetails.structure.hostname.replace(/[^a-zA-Z0-9.-]/g, '_');
    downloadAnchor.setAttribute('download', `cybershield-report-${domainClean}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (err) {
    console.error('Failed to download report:', err);
  }
}
