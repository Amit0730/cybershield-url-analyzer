'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Cpu, 
  Search, 
  AlertTriangle, 
  Fingerprint, 
  Layers, 
  Globe, 
  ArrowRight, 
  ExternalLink, 
  Database,
  History,
  CheckCircle2
} from 'lucide-react';
import { UrlInputHero } from '@/components/analyzer/url-input-hero';
import { AnalysisLoader } from '@/components/analyzer/analysis-loader';
import { ResultsDashboard } from '@/components/analyzer/results-dashboard';
import { URLAnalysisResult, ScanHistoryItem } from '@/lib/types';
import { analyzeUrl } from '@/lib/url-analyzer-engine';
import { saveScanToHistory, getScanHistory, formatDate, getRiskColor } from '@/lib/utils';

export default function HomePage() {
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<URLAnalysisResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [recentScans, setRecentScans] = useState<ScanHistoryItem[]>([]);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentScans(getScanHistory().slice(0, 4));
  }, []);

  const handleAnalyze = async (url: string) => {
    setTargetUrl(url);
    setIsScanning(true);
    setScanError(null);

    // Smooth scroll down to analyzer viewport
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      // First try server API route, with graceful client-side fallback
      let resultData: URLAnalysisResult;
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });

        const json = await res.json();
        if (res.ok && json.success && json.data) {
          resultData = json.data;
        } else {
          // Fallback to local engine
          resultData = await analyzeUrl(url);
        }
      } catch {
        // Fallback to direct client-side analysis
        resultData = await analyzeUrl(url);
      }

      // Add slight simulation delay for polished radar visualizer
      setTimeout(() => {
        setCurrentResult(resultData);
        setIsScanning(false);
        const updated = saveScanToHistory(resultData);
        setRecentScans(updated.slice(0, 4));

        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }, 1600);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Analysis failed. Please check the URL syntax.';
      setScanError(message);
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setCurrentResult(null);
    setTargetUrl('');
    setScanError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-teal-400/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-8">
          {/* Top Engine Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Multi-Vector URL Threat Heuristics • v2.4</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Instant URL Security &{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Phishing Risk Intelligence
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
              Detect deceptive brand homoglyphs, Punycode tricks, malicious redirects, high-entropy DGA domains, and abusive TLDs before you click.
            </p>
          </div>

          {/* Central URL Analyzer Search Bar */}
          <div className="w-full pt-4">
            <UrlInputHero
              onAnalyze={handleAnalyze}
              isLoading={isScanning}
              initialUrl={targetUrl}
            />
          </div>

          {/* Quick Value Props */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-6 text-xs sm:text-sm font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Zero Browser Execution</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Shannon Entropy Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-amber-400" />
              <span>100+ Brand Confusable Dictionaries</span>
            </div>
          </div>
        </div>
      </section>

      {/* Anchor for Analysis Results / Loader */}
      <div ref={resultsRef} className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 scroll-mt-20">
        {isScanning && <AnalysisLoader targetUrl={targetUrl} />}

        {scanError && (
          <div className="max-w-2xl mx-auto my-8 p-6 rounded-3xl bg-rose-950/40 border border-rose-800 text-rose-300 space-y-2 text-center">
            <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Analysis Could Not Complete</h3>
            <p className="text-xs font-mono text-rose-300/90">{scanError}</p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-3 px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-white border border-slate-700"
            >
              Try Another URL
            </button>
          </div>
        )}

        {currentResult && !isScanning && (
          <div className="my-10">
            <ResultsDashboard result={currentResult} onReset={handleReset} />
          </div>
        )}
      </div>

      {/* Feature Capabilities Grid */}
      <section className="w-full py-20 bg-slate-950/60 border-t border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Multi-Layered Detection Vectors
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Engineered to Expose Invisible Attack Vectors
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Traditional blocklists struggle against newly registered zero-day domains. CyberShield utilizes deep structural, lexical, and mathematical heuristics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-rose-950/50 border border-rose-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Fingerprint className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Punycode & Homoglyph Attacks
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Decodes Internationalized Domain Names (`xn--`) and confusable Cyrillic/Greek Unicode glyphs designed to visually mimic brands like Apple, Google, and PayPal.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Shannon Entropy & DGA Scoring
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates mathematical information density to detect Domain Generation Algorithms (DGA), randomized botnet nodes, and encrypted tracking tokens.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/50 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                TLD Abuse & Risk Intelligence
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Classifies Top-Level Domains against global threat intelligence registries, penalizing high-abuse extensions (`.zip`, `.top`, `.buzz`, `.country`).
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/50 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Open Redirect & Parameter Auditing
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Identifies nested redirection parameters (`?redirect=`, `?url=`, `?next=`) and base64-encoded strings leveraged in sneaky routing traps.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Raw IP Hostname & SSRF Protection
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Flags raw decimal, hex, or dotted IPv4/IPv6 endpoints and blocks internal RFC 1918 subnets commonly targeted by SSRF probes.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Multi-Feed Reputation Integration
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Combines offline statistical rules with Google Safe Browsing and VirusTotal APIs with graceful, transparent fallbacks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How CyberShield Works: 4-Stage Flow */}
      <section className="w-full py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Architecture & Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              How CyberShield Analyzes Every URL
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Our four-stage inspection pipeline guarantees safe, transparent, and privacy-preserving evaluations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
              <span className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center">
                01
              </span>
              <h4 className="text-base font-bold text-white">Safe Lexical Parsing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deconstructs scheme, subdomains, apex domain, port, path depth, and query parameters without executing code or rendering HTML.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
              <span className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center">
                02
              </span>
              <h4 className="text-base font-bold text-white">Confusable & Brand Matching</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluates Levenshtein distance and character substitution maps against 100+ monitored financial, crypto, and technology brands.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
              <span className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center">
                03
              </span>
              <h4 className="text-base font-bold text-white">Statistical Risk Synthesis</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates Shannon entropy, TLD penalties, and security keywords to formulate a calibrated 0–100 risk score.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
              <span className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center">
                04
              </span>
              <h4 className="text-base font-bold text-white">Actionable Remediation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Emits human-readable evidence, security warnings, positive indicators, and recommended mitigation actions for users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Local Scans Section */}
      {recentScans.length > 0 && (
        <section className="w-full py-16 bg-slate-950/80 border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-bold text-white tracking-tight">Recent Scans on this Device</h3>
              </div>
              <Link
                href="/history"
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>View Full History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentScans.map(scan => {
                const colors = getRiskColor(scan.riskLevel);
                return (
                  <div
                    key={scan.id}
                    onClick={() => {
                      setCurrentResult(scan.result);
                      setTargetUrl(scan.url);
                      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`p-4 rounded-2xl bg-slate-900/80 border ${colors.border} hover:bg-slate-900 cursor-pointer transition-all space-y-2`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-bold uppercase ${colors.text}`}>
                        {scan.riskLevel} Risk
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {formatDate(scan.timestamp)}
                      </span>
                    </div>

                    <p className="font-mono text-xs font-semibold text-white truncate">
                      {scan.hostname || scan.url}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                      <span className="text-slate-400">Score: {scan.overallScore}/100</span>
                      <span className="text-cyan-400 hover:underline">Re-inspect</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Security Disclaimer Banner */}
      <section className="w-full py-12 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Automated Security Assessment Notice</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            CyberShield performs automated heuristic and threat intelligence correlation. No automated scanner can guarantee 100% safety against compromised legitimate services or zero-day phishing infrastructure. Always exercise caution before entering credentials.
          </p>
        </div>
      </section>
    </div>
  );
}
