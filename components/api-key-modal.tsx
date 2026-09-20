'use client';

import React from 'react';
import { X, ShieldCheck, Database, Key, CheckCircle2, Lock } from 'lucide-react';

interface ThreatConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThreatConfigModal({ isOpen, onClose }: ThreatConfigModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-950 border border-cyan-500/30 text-slate-100 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] p-6 sm:p-8 overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-950 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Threat Engine Architecture</h3>
              <p className="text-xs text-slate-400">Security Provider Configuration & Fallbacks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-emerald-200">Local Heuristic Engine: Always Active</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                CyberShield runs 100% offline-capable lexical parsing, Shannon entropy scoring, Punycode confusable decoding, and brand impersonation algorithms without requiring external API keys.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-400" />
              Optional External Feeds (Server Environment)
            </h4>
            <ul className="space-y-2 text-xs font-mono text-slate-300">
              <li className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-850">
                <span>GOOGLE_SAFE_BROWSING_API_KEY</span>
                <span className="text-emerald-400 text-[10px]">Supported</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-850">
                <span>VIRUSTOTAL_API_KEY</span>
                <span className="text-emerald-400 text-[10px]">Supported</span>
              </li>
            </ul>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When external API keys are omitted, CyberShield uses its robust statistical engine and gracefully marks external lookups as unconfigured.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
