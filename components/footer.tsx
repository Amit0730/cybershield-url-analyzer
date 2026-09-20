import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, AlertTriangle, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-base font-bold text-white tracking-wide">CyberShield</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              CyberShield provides multi-vector URL security analysis, inspecting lexical structures, Shannon entropy, Punycode homoglyphs, and high-risk TLDs to detect phishing and brand impersonation attacks.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
                <Lock className="w-3 h-3 text-cyan-400" />
                Zero-Execution Safe Inspection
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Privacy Preserving
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  Home Analyzer
                </Link>
              </li>
              <li>
                <Link href="/analyzer" className="hover:text-cyan-400 transition-colors">
                  Deep URL Inspector
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-cyan-400 transition-colors">
                  Local Scan History
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                  Detection Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Security Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Security Ecosystem</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.cisa.gov/stop-phishing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                >
                  <span>CISA Phishing Guidance</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://apwg.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                >
                  <span>Anti-Phishing Working Group</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://safebrowsing.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                >
                  <span>Google Safe Browsing</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Amit0730/cybershield-url-analyzer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Security Disclaimer Banner */}
        <div className="pt-6 border-t border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2 max-w-3xl">
            <AlertTriangle className="w-4 h-4 text-amber-500/80 shrink-0" />
            <span>
              <strong>Disclaimer:</strong> CyberShield risk ratings are algorithmic assessments based on structural indicators and threat feeds. An automated score is not a guarantee of website safety. Never share passwords or private data on unverified websites.
            </span>
          </div>
          <div className="shrink-0 flex items-center gap-1">
            <span>Built with precision for Web Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
