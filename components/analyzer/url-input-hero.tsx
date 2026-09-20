'use client';

import React, { useState } from 'react';
import { Search, ShieldAlert, Clipboard, X, ArrowRight, Sparkles, Check } from 'lucide-react';
import { SAMPLE_PRESETS } from '@/lib/sample-data';
import { PresetSample } from '@/lib/types';

interface UrlInputHeroProps {
  onAnalyze: (url: string) => void;
  isLoading?: boolean;
  initialUrl?: string;
  className?: string;
}

export function UrlInputHero({
  onAnalyze,
  isLoading = false,
  initialUrl = '',
  className = '',
}: UrlInputHeroProps) {
  const [url, setUrl] = useState(initialUrl);
  const [copiedPreset, setCopiedPreset] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setInputError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setInputError('Please enter a website or URL to inspect.');
      return;
    }

    if (
      trimmed.toLowerCase().startsWith('javascript:') ||
      trimmed.toLowerCase().startsWith('data:') ||
      trimmed.toLowerCase().startsWith('file:')
    ) {
      setInputError('Unsafe pseudo-protocols (javascript:, data:, file:) are prohibited.');
      return;
    }

    onAnalyze(trimmed);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setInputError(null);
      }
    } catch {
      // clipboard permission denied or not supported
    }
  };

  const handleClear = () => {
    setUrl('');
    setInputError(null);
  };

  const handleSelectPreset = (preset: PresetSample) => {
    setUrl(preset.url);
    setInputError(null);
    setCopiedPreset(preset.id);
    setTimeout(() => setCopiedPreset(null), 1500);
    onAnalyze(preset.url);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-4 ${className}`}>
      {/* Search Bar Form */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center rounded-2xl bg-slate-900/90 border-2 border-cyan-500/30 group-hover:border-cyan-400/60 focus-within:border-cyan-400 focus-within:shadow-[0_0_35px_rgba(6,182,212,0.25)] transition-all overflow-hidden p-2 sm:p-2.5 backdrop-blur-xl">
          {/* Prefix Icon */}
          <div className="flex items-center justify-center pl-3 pr-2 text-cyan-400">
            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          {/* Input field */}
          <input
            type="text"
            value={url}
            onChange={e => {
              setUrl(e.target.value);
              if (inputError) setInputError(null);
            }}
            placeholder="Paste suspicious URL (e.g. xn--appl-43d.com, paypal.com.billing-auth.xyz, or ip address)..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base font-mono focus:outline-none px-2 py-2 disabled:opacity-50"
            spellCheck={false}
            autoCapitalize="none"
          />

          {/* Action buttons inside input */}
          <div className="flex items-center gap-1.5 pr-1">
            {url && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-xl transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {!url && (
              <button
                type="button"
                onClick={handlePaste}
                disabled={isLoading}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-cyan-300 hover:text-white bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800/50 rounded-xl transition-all"
                title="Paste from clipboard"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Paste</span>
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
                  <span>Analyze URL</span>
                  <ArrowRight className="w-3.5 h-3.5 hidden sm:inline-block" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Input Error Message */}
      {inputError && (
        <div className="flex items-center gap-2 text-rose-400 text-xs sm:text-sm font-mono bg-rose-950/40 border border-rose-900/60 rounded-xl px-4 py-2.5 animate-fadeIn">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{inputError}</span>
        </div>
      )}

      {/* Preset attack vectors & examples */}
      <div className="pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick Test Presets (Phishing, Homoglyphs & Legitimate):</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SAMPLE_PRESETS.map(preset => {
            const isSelected = copiedPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                disabled={isLoading}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  preset.category === 'legitimate'
                    ? 'bg-emerald-950/30 text-emerald-300 border-emerald-800/40 hover:border-emerald-500/60 hover:bg-emerald-900/40'
                    : preset.category === 'homoglyph'
                    ? 'bg-rose-950/30 text-rose-300 border-rose-800/40 hover:border-rose-500/60 hover:bg-rose-900/40'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/90'
                }`}
              >
                {isSelected ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      preset.category === 'legitimate'
                        ? 'bg-emerald-400'
                        : preset.category === 'homoglyph'
                        ? 'bg-rose-400'
                        : 'bg-amber-400'
                    }`}
                  />
                )}
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
