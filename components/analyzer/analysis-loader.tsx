'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle2, Lock, Cpu, Database, Fingerprint, Search } from 'lucide-react';

interface AnalysisLoaderProps {
  targetUrl: string;
}

const SCAN_STEPS = [
  { label: 'Sanitizing URL & Extracting Syntax Anatomy', icon: Lock, duration: 250 },
  { label: 'Decoding Unicode Confusables & Punycode IDNs', icon: Fingerprint, duration: 400 },
  { label: 'Calculating Shannon Entropy & Lexical Distribution', icon: Cpu, duration: 350 },
  { label: 'Cross-referencing 100+ Monitored Brand Dictionaries', icon: Search, duration: 400 },
  { label: 'Querying TLD Intelligence & Reputation Matrices', icon: Database, duration: 350 },
  { label: 'Synthesizing Risk Verdict & Actionable Remediation', icon: ShieldAlert, duration: 250 },
];

export function AnalysisLoader({ targetUrl }: AnalysisLoaderProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < SCAN_STEPS.length) {
        setActiveStep(current);
      } else {
        clearInterval(interval);
      }
    }, 320);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto my-12 p-8 rounded-3xl bg-slate-950/90 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-xl">
      {/* Radar Animation Area */}
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <div className="relative flex items-center justify-center w-28 h-28 mb-4">
          {/* Outer radar ring */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-30" />
          <div className="absolute inset-2 rounded-full border border-cyan-500/50" />
          <div className="absolute inset-6 rounded-full border border-cyan-400/30" />
          
          {/* Radar Sweep Line */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-cyan-500/20 to-cyan-400/40 animate-radar origin-center" />
          </div>

          {/* Center Target Icon */}
          <div className="relative z-10 w-12 h-12 rounded-full bg-slate-900 border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)]">
            <ShieldAlert className="w-6 h-6 text-cyan-300 animate-pulse" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">
          Executing Multi-Vector Security Scan
        </h3>
        <p className="text-xs font-mono text-cyan-400/80 mt-1 max-w-md truncate px-4">
          Target: {targetUrl}
        </p>
      </div>

      {/* Step checklist */}
      <div className="space-y-2.5 max-w-xl mx-auto">
        {SCAN_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isDone = index < activeStep;
          const isCurrent = index === activeStep;

          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-mono transition-all duration-300 ${
                isDone
                  ? 'bg-slate-900/60 border-emerald-900/40 text-emerald-300'
                  : isCurrent
                  ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)] scale-[1.01]'
                  : 'bg-slate-900/20 border-slate-800/40 text-slate-500'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0" />
              ) : (
                <Icon className="w-4 h-4 text-slate-600 shrink-0" />
              )}

              <span className="flex-1">{step.label}</span>

              {isDone && (
                <span className="text-[10px] text-emerald-400 uppercase font-semibold">VERIFIED</span>
              )}
              {isCurrent && (
                <span className="text-[10px] text-cyan-400 uppercase font-semibold animate-pulse">INSPECTING</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
