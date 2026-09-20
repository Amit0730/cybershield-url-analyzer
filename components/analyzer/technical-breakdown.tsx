'use client';

import React, { useState } from 'react';
import { TechnicalDetails, ReputationProviderResult } from '@/lib/types';
import { 
  Globe, 
  Lock, 
  Layers, 
  Cpu, 
  Hash, 
  Server, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Code
} from 'lucide-react';

interface TechnicalBreakdownProps {
  technicalDetails: TechnicalDetails;
  reputationProviders: ReputationProviderResult[];
}

export function TechnicalBreakdown({ technicalDetails, reputationProviders }: TechnicalBreakdownProps) {
  const [activeTab, setActiveTab] = useState<'anatomy' | 'homoglyphs' | 'entropy' | 'reputation'>('anatomy');
  const [showRawParams, setShowRawParams] = useState(false);

  const { structure, homoglyphs, entropy, tldRisk } = technicalDetails;

  return (
    <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Technical Deep-Dive & Heuristic Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent breakdown of extracted lexical signals, confusable character maps, and threat provider queries.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab('anatomy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'anatomy'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            URL Anatomy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('homoglyphs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'homoglyphs'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Homoglyphs & Brands
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('entropy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'entropy'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Shannon Entropy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reputation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'reputation'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Reputation Feeds ({reputationProviders.length})
          </button>
        </div>
      </div>

      {/* Tab 1: URL Anatomy */}
      {activeTab === 'anatomy' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Protocol</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`font-mono text-sm font-semibold ${structure.protocol === 'https:' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {structure.protocol}//
                </span>
                {structure.protocol === 'https:' ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-950 text-emerald-300 font-mono">TLS</span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-950 text-rose-300 font-mono">INSECURE</span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Root Domain</span>
              <p className="font-mono text-sm font-semibold text-cyan-300 mt-1 truncate">
                {structure.domain || 'N/A'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Top-Level Domain (TLD)</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="font-mono text-sm font-semibold text-slate-200">
                  .{structure.tld || 'none'}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase ${
                    tldRisk.riskLevel === 'very_high' || tldRisk.riskLevel === 'high'
                      ? 'bg-rose-950 text-rose-300'
                      : tldRisk.riskLevel === 'moderate'
                      ? 'bg-amber-950 text-amber-300'
                      : 'bg-emerald-950 text-emerald-300'
                  }`}
                >
                  {tldRisk.riskLevel} Risk
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Host Type</span>
              <p className="font-mono text-sm font-semibold text-slate-200 mt-1">
                {structure.isIpAddress ? `IP Address (${structure.ipType?.toUpperCase()})` : 'FQDN Domain'}
              </p>
            </div>
          </div>

          {/* Subdomains & Path Depth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400">Subdomains ({structure.subdomains.length}):</span>
                {structure.subdomains.length >= 3 && (
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded">High Subdomain Depth</span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {structure.subdomains.length > 0 ? (
                  structure.subdomains.map((sub, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-mono">
                      {sub}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No subdomains (apex domain)</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400">Path Depth & Port:</span>
                <span className="font-mono text-slate-300 text-xs">
                  Depth: {structure.pathDepth} | Port: {structure.port || 'Default'}
                </span>
              </div>
              <p className="font-mono text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 truncate">
                {structure.pathname}
              </p>
            </div>
          </div>

          {/* Query Parameters list */}
          {structure.searchParams.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <button
                type="button"
                onClick={() => setShowRawParams(!showRawParams)}
                className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono font-medium">
                    Query Parameters ({structure.searchParams.length})
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <span>{showRawParams ? 'Hide' : 'Inspect'}</span>
                  {showRawParams ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>

              {showRawParams && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  {structure.searchParams.map((param, index) => (
                    <div
                      key={index}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg text-xs font-mono gap-1 ${
                        param.isSuspicious
                          ? 'bg-amber-950/30 border border-amber-800/50 text-amber-300'
                          : 'bg-slate-900/60 border border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="font-semibold text-slate-200">{param.key}</span>
                      <span className="truncate max-w-md text-slate-400">{param.value}</span>
                      {param.isSuspicious && (
                        <span className="text-[10px] text-amber-400 uppercase self-start sm:self-auto">
                          Potential Redirect / Payload
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Homoglyphs & Brand Spoofing */}
      {activeTab === 'homoglyphs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-400" />
                Punycode & Character Encoding
              </h4>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Punycode Encoding:</span>
                  <span className={homoglyphs.isPunycode ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {homoglyphs.isPunycode ? 'Detected (xn-- active)' : 'Clean (Standard ASCII)'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Non-ASCII Characters:</span>
                  <span className={homoglyphs.hasNonAscii ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {homoglyphs.hasNonAscii ? 'Present (Unicode Confusables)' : 'None'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Decoded Visual Representation:</span>
                  <span className="text-cyan-300 font-bold">{homoglyphs.decodedHostname}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Brand Impersonation Intelligence
              </h4>

              {homoglyphs.spoofedBrand ? (
                <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/60 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-rose-400 font-bold">Impersonated Target:</span>
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold">
                      {homoglyphs.spoofedBrand.brandName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Legitimate Official Domain:</span>
                    <span className="text-cyan-400 font-bold">{homoglyphs.spoofedBrand.officialDomain}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Impersonation Vector:</span>
                    <span className="uppercase text-amber-300 font-semibold">{homoglyphs.spoofedBrand.impersonationType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Algorithmic Confidence:</span>
                    <span className="text-rose-400 font-bold">{homoglyphs.spoofedBrand.similarityScore}% Match</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs font-mono text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No brand impersonation or typosquatting detected against 100+ monitored financial & tech brands.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Shannon Entropy */}
      {activeTab === 'entropy' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Domain Shannon Entropy</span>
                <span className={`text-sm font-mono font-bold ${entropy.domainEntropy > 3.85 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {entropy.domainEntropy} bits/char
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${entropy.domainEntropy > 3.85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, (entropy.domainEntropy / 5.0) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Standard natural domain names typically rate 2.5 - 3.5 bits/char. Scores above 3.85 suggest algorithmic domain generation (DGA).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Path Shannon Entropy</span>
                <span className={`text-sm font-mono font-bold ${entropy.pathEntropy > 4.4 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {entropy.pathEntropy} bits/char
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${entropy.pathEntropy > 4.4 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, (entropy.pathEntropy / 5.0) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                High path entropy above 4.4 bits/char often indicates encrypted malware drop tokens or obfuscated tracking payloads.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Reputation Feeds */}
      {activeTab === 'reputation' && (
        <div className="space-y-3">
          {reputationProviders.map(provider => (
            <div
              key={provider.providerId}
              className={`p-4 rounded-xl border text-xs font-mono transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                provider.status === 'threat_detected'
                  ? 'bg-rose-950/30 border-rose-800/60 text-rose-300'
                  : provider.status === 'verified_clean'
                  ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{provider.providerName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      provider.status === 'threat_detected'
                        ? 'bg-rose-950 text-rose-300 border border-rose-700'
                        : provider.status === 'verified_clean'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {provider.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{provider.details}</p>
              </div>

              <div className="text-[11px] text-slate-500 shrink-0 self-start sm:self-auto">
                Checked: {new Date(provider.lastChecked).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
