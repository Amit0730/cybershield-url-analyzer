'use client';

import React, { useState } from 'react';
import { URLAnalysisResult } from '@/lib/types';
import { ScoreGauge } from './score-gauge';
import { ThreatBadge, RiskCategoryBadge } from './threat-badge';
import { TechnicalBreakdown } from './technical-breakdown';
import { RecommendationCard } from './recommendation-card';
import { downloadJsonReport, formatDate, getRiskColor } from '@/lib/utils';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Download,
  RotateCcw,
  ExternalLink,
  Code,
  Check,
  AlertTriangle,
  Clock,
  Globe,
  Share2,
} from 'lucide-react';

interface ResultsDashboardProps {
  result: URLAnalysisResult;
  onReset?: () => void;
}

export function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const colors = getRiskColor(result.riskLevel);

  const handleCopySummary = async () => {
    try {
      const summaryText = `CyberShield URL Security Report
Target URL: ${result.url}
Overall Risk Score: ${result.overallScore}/100 (${result.riskLabel})
Threat Flags Detected: ${result.threatFlags.length}
Analyzed At: ${formatDate(result.timestamp)}
Summary: ${result.summary}
Scanned via CyberShield URL Security Analyzer`;

      await navigator.clipboard.writeText(summaryText);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      // clipboard fallback
    }
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch {
      // clipboard fallback
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <RiskCategoryBadge riskLevel={result.riskLevel} />
            <span className="flex items-center gap-1 text-xs font-mono text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {formatDate(result.timestamp)}
            </span>
            <span className="text-xs font-mono text-cyan-400/80 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Scan Time: {result.scanDurationMs}ms
            </span>
          </div>

          <div className="flex items-center gap-2 max-w-full">
            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-mono text-sm sm:text-base font-bold text-white truncate max-w-3xl">
              {result.url}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all"
            title="Copy formatted summary"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? 'Copied' : 'Copy Report'}</span>
          </button>

          <button
            type="button"
            onClick={() => downloadJsonReport(result)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/50 hover:border-cyan-700 transition-all"
            title="Download full JSON report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Scan Another URL</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Overview Grid: Score Gauge + Executive Summary Banner */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 sm:p-8 rounded-3xl bg-slate-950/90 border ${colors.border} ${colors.glow} backdrop-blur-xl`}>
        {/* Left Col: Circular Score Gauge */}
        <div className="flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800/80 pb-6 lg:pb-0 lg:pr-6">
          <ScoreGauge
            score={result.overallScore}
            riskLevel={result.riskLevel}
            confidence={result.confidence}
            size="lg"
          />
        </div>

        {/* Right 2 Cols: Executive Summary & Stat Pills */}
        <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono uppercase tracking-wider font-bold ${colors.text}`}>
                Automated Risk Assessment
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">
                {result.engineVersion}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {result.riskLabel}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              {result.summary}
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Threat Flags</span>
              <span className={`text-lg font-mono font-bold ${result.threatFlags.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {result.threatFlags.length}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Positive Marks</span>
              <span className="text-lg font-mono font-bold text-emerald-400">
                {result.positiveIndicators.length}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Hostname Type</span>
              <span className="text-xs font-mono font-bold text-cyan-300 truncate block mt-1">
                {result.technicalDetails.structure.isIpAddress ? 'Raw IP' : result.technicalDetails.structure.domain || 'Domain'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Protocol Status</span>
              <span className={`text-xs font-mono font-bold uppercase block mt-1 ${result.technicalDetails.structure.protocol === 'https:' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {result.technicalDetails.structure.protocol}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Threat Flags vs Positive Indicators Dual Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Detected Threat Flags */}
        <div className="rounded-3xl bg-slate-950/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Detected Security Flags ({result.threatFlags.length})
              </h3>
            </div>
            {result.threatFlags.length === 0 && (
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800">
                Clean Heuristics
              </span>
            )}
          </div>

          {result.threatFlags.length > 0 ? (
            <div className="space-y-3.5">
              {result.threatFlags.map(flag => (
                <div
                  key={flag.id}
                  className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-white tracking-tight">
                      {flag.title}
                    </h4>
                    <ThreatBadge severity={flag.severity} />
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {flag.description}
                  </p>

                  {flag.evidence && (
                    <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                      <span className="text-slate-500 block uppercase font-bold text-[9px]">Technical Evidence:</span>
                      <p className="text-cyan-300 break-all">{flag.evidence}</p>
                    </div>
                  )}

                  {flag.remediation && (
                    <div className="text-[11px] text-amber-300/90 flex items-start gap-1.5 pt-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{flag.remediation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center space-y-2 text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-sm font-medium text-slate-200">No red flags detected</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                The URL structure does not trigger any of our primary phishing, homoglyph, or deceptive pattern heuristics.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Positive Security Indicators & Recommendations */}
        <div className="space-y-6">
          {/* Positive Indicators */}
          <div className="rounded-3xl bg-slate-950/80 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Positive Security Indicators ({result.positiveIndicators.length})
              </h3>
            </div>

            <div className="space-y-2.5">
              {result.positiveIndicators.map(pos => (
                <div
                  key={pos.id}
                  className="p-3.5 rounded-xl bg-emerald-950/10 border border-emerald-900/30 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-semibold text-emerald-200">{pos.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{pos.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="rounded-3xl bg-slate-950/80 border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <AlertTriangle className="w-5 h-5 text-cyan-400" />
              <span>Recommended Security Actions</span>
            </h3>

            <div className="space-y-3">
              {result.recommendations.map(rec => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Deep Technical Breakdown Matrix */}
      <TechnicalBreakdown
        technicalDetails={result.technicalDetails}
        reputationProviders={result.reputationProviders}
      />

      {/* Raw JSON Inspector & Developer Mode */}
      <div className="rounded-3xl bg-slate-950/80 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-mono font-bold text-slate-300">
              Developer & Raw JSON Payload
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowRawJson(!showRawJson)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-800/50"
            >
              {showRawJson ? 'Collapse JSON' : 'Expand Raw JSON'}
            </button>
          </div>
        </div>

        {showRawJson && (
          <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-850 text-xs font-mono text-cyan-300/90 overflow-x-auto max-h-96 no-scrollbar">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
