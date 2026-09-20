import React from 'react';
import { ActionRecommendation } from '@/lib/types';
import { ShieldAlert, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

export function RecommendationCard({ rec }: { rec: ActionRecommendation }) {
  const getConfig = () => {
    switch (rec.priority) {
      case 'urgent':
        return {
          icon: ShieldAlert,
          badge: 'Urgent Action',
          border: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
          badgeClass: 'bg-rose-950 border-rose-500/60 text-rose-300',
        };
      case 'caution':
        return {
          icon: AlertTriangle,
          badge: 'Exercise Caution',
          border: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
          badgeClass: 'bg-amber-950 border-amber-500/60 text-amber-300',
        };
      case 'best_practice':
      default:
        return {
          icon: CheckCircle,
          badge: 'Best Practice',
          border: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-300',
          badgeClass: 'bg-cyan-950 border-cyan-500/50 text-cyan-300',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-2xl border ${config.border} space-y-2 transition-all hover:bg-slate-900/60`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 shrink-0" />
          <h4 className="text-sm font-semibold text-white tracking-tight">{rec.action}</h4>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border shrink-0 ${config.badgeClass}`}>
          {config.badge}
        </span>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed pl-6">{rec.explanation}</p>
    </div>
  );
}
