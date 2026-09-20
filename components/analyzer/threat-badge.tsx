import React from 'react';
import { Severity, RiskLevel } from '@/lib/types';
import { ShieldAlert, AlertTriangle, AlertCircle, Info, ShieldCheck } from 'lucide-react';

interface ThreatBadgeProps {
  severity: Severity;
  className?: string;
}

export function ThreatBadge({ severity, className = '' }: ThreatBadgeProps) {
  const getConfig = () => {
    switch (severity) {
      case 'critical':
        return {
          icon: ShieldAlert,
          label: 'Critical Risk',
          classes: 'bg-rose-950/60 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
        };
      case 'high':
        return {
          icon: AlertTriangle,
          label: 'High Severity',
          classes: 'bg-orange-950/60 text-orange-300 border-orange-500/40 shadow-[0_0_10px_rgba(249,115,22,0.2)]',
        };
      case 'medium':
        return {
          icon: AlertCircle,
          label: 'Medium Severity',
          classes: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
        };
      case 'low':
        return {
          icon: Info,
          label: 'Low Severity',
          classes: 'bg-blue-950/60 text-blue-300 border-blue-500/40',
        };
      case 'info':
      default:
        return {
          icon: Info,
          label: 'Informational',
          classes: 'bg-slate-900 text-slate-300 border-slate-700/50',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border font-mono tracking-wide ${config.classes} ${className}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}

export function RiskCategoryBadge({ riskLevel }: { riskLevel: RiskLevel }) {
  switch (riskLevel) {
    case 'critical':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono uppercase tracking-wider bg-rose-950 border border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          Critical Threat
        </span>
      );
    case 'high':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono uppercase tracking-wider bg-orange-950 border border-orange-500 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          High Risk
        </span>
      );
    case 'moderate':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono uppercase tracking-wider bg-amber-950 border border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          Moderate Caution
        </span>
      );
    case 'low':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono uppercase tracking-wider bg-emerald-950 border border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Low Risk
        </span>
      );
  }
}
