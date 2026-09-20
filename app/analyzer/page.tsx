'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';
import { UrlInputHero } from '@/components/analyzer/url-input-hero';
import { AnalysisLoader } from '@/components/analyzer/analysis-loader';
import { ResultsDashboard } from '@/components/analyzer/results-dashboard';
import { URLAnalysisResult } from '@/lib/types';
import { analyzeUrl } from '@/lib/url-analyzer-engine';
import { saveScanToHistory } from '@/lib/utils';

function AnalyzerContent() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get('url') || '';

  const [targetUrl, setTargetUrl] = useState<string>(urlParam);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<URLAnalysisResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    if (urlParam && urlParam.trim().length > 0) {
      handleAnalyze(urlParam.trim());
    }
  }, [urlParam]);

  const handleAnalyze = async (url: string) => {
    setTargetUrl(url);
    setIsScanning(true);
    setScanError(null);

    try {
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
          resultData = await analyzeUrl(url);
        }
      } catch {
        resultData = await analyzeUrl(url);
      }

      setTimeout(() => {
        setCurrentResult(resultData);
        setIsScanning(false);
        saveScanToHistory(resultData);
      }, 1400);
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
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>Deep Heuristic URL Inspector</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          CyberShield URL Security Analyzer
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-light">
          Submit any suspicious link, domain, or IP address to receive a detailed breakdown of homoglyph confusables, Shannon entropy, and high-risk TLDs.
        </p>
      </div>

      {/* URL Input Bar */}
      <div className="w-full">
        <UrlInputHero
          onAnalyze={handleAnalyze}
          isLoading={isScanning}
          initialUrl={targetUrl}
        />
      </div>

      {/* Loading state */}
      {isScanning && <AnalysisLoader targetUrl={targetUrl} />}

      {/* Error state */}
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

      {/* Results Dashboard */}
      {currentResult && !isScanning && (
        <div className="my-8">
          <ResultsDashboard result={currentResult} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}

export default function AnalyzerPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-mono text-slate-500">Loading analyzer workbench...</div>}>
      <AnalyzerContent />
    </Suspense>
  );
}
