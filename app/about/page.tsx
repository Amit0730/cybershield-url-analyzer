'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  Lock, 
  Fingerprint, 
  Globe, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    question: 'How does CyberShield calculate its 0–100 risk score?',
    answer:
      'CyberShield evaluates multiple structural, lexical, and statistical vectors simultaneously. Each detected anomaly (such as a Punycode homoglyph on a brand, raw IP host, insecure HTTP on sensitive paths, or high Shannon entropy) applies a calibrated penalty. Known legitimate structural patterns reduce score, and results are classified into Low (0-25), Moderate (26-55), High (56-80), and Critical (81-100).',
  },
  {
    question: 'Does CyberShield execute or visit suspicious URLs in my browser?',
    answer:
      'No. CyberShield enforces a strict zero-execution policy. Submitted URLs are safely parsed and analyzed purely via lexical, statistical, and server-side threat feed correlations. No client-side iframes, DOM rendering, or script executions occur.',
  },
  {
    question: 'What is a Punycode / Homoglyph attack?',
    answer:
      'Homoglyph attacks exploit lookalike characters from international alphabets (like Cyrillic "а" or Greek "о") that appear identical to Latin letters in standard fonts. When registered, these produce Punycode domains (e.g., `xn--appl-43d.com`). Attackers use these to disguise credential harvesting sites as official brands.',
  },
  {
    question: 'Why does Shannon entropy matter in URL analysis?',
    answer:
      'Shannon entropy measures the mathematical randomness of characters. Natural domain names typically have an entropy of 2.5–3.5 bits/character. Malware Domain Generation Algorithms (DGA) and tracking payloads generate high randomness (>3.85 domain, >4.4 path), providing an early signal of automated infrastructure.',
  },
  {
    question: 'Why is an automated score not a 100% guarantee of safety?',
    answer:
      'Cybersecurity is an adversarial domain. Attackers may compromise previously reputable, legitimate websites or abuse shared hosting providers. An automated scanner provides high-confidence structural assessment, but human vigilance and proper authentication hygiene are always essential.',
  },
  {
    question: 'Is my scanned URL data kept private?',
    answer:
      'Yes. Your scan history is stored exclusively in your local browser storage (`localStorage`). Server-side API processing strips sensitive authentication headers and never writes submitted credentials to a public log.',
  },
];

export default function AboutPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/40 text-xs font-mono text-cyan-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Security Architecture & Methodology</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Transparent, Multi-Vector URL Intelligence
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-light">
          CyberShield was engineered to provide explainable, privacy-first cybersecurity analysis that exposes modern social engineering, homoglyphs, and obfuscated phishing infrastructure.
        </p>
      </div>

      {/* Core Mission & Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Zero Execution Safety</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Never exposes users to malware or drive-by downloads. URLs are parsed as data structures rather than executed as browser targets.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Transparent Heuristics</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every risk penalty is accompanied by concrete evidence, lexical tokens, and plain-English remediation advice.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Honest Confidence</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Clearly separates local heuristics from external reputation feeds, never giving false assurances of 100% safety.
          </p>
        </div>
      </div>

      {/* Deep Dive into Heuristic Algorithms */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            Technical Specification
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Our Heuristic Engine Algorithms
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            CyberShield applies an ensemble of mathematical models, character normalization algorithms, and curated threat dictionaries.
          </p>
        </div>

        <div className="space-y-6">
          {/* Vector 1 */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-2">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-rose-400" />
              <h4 className="text-sm font-bold text-white">
                1. Homoglyphs & Levenshtein Brand Impersonation
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects Cyrillic, Greek, and numerical lookalike substitutions (e.g. Cyrillic `а` \u0430 for Latin `a`, `1` for `l`, `0` for `o`). Cross-references against 100+ high-profile target brands (PayPal, Microsoft, Apple, Google, Amazon, Chase, Binance, Steam) using character normalization and Levenshtein edit distance formulas.
            </p>
          </div>

          {/* Vector 2 */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">
                2. Shannon Entropy Information Density
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Computes Shannon Entropy $H(X) = -\sum P(x) \log_2 P(x)$ across domain and path tokens. Identifies automated Domain Generation Algorithms (DGA), fast-flux DNS nodes, and encrypted tracking parameters that deviate from standard linguistic patterns.
            </p>
          </div>

          {/* Vector 3 */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-bold text-white">
                3. TLD Abuse & Registry Threat Intelligence
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maintains an updated classification of Top-Level Domains categorized by malicious registration prevalence (e.g., `.zip`, `.top`, `.buzz`, `.country`, `.click`, `.surf`) versus highly regulated institutional spaces (`.gov`, `.edu`, `.mil`).
            </p>
          </div>

          {/* Vector 4 */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <h4 className="text-sm font-bold text-white">
                4. Open Redirect & Payload Parameter Traps
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scans query strings for external redirection vectors (`?url=`, `?redirect=`, `?next=`) and base64-encoded strings frequently abused in phishing campaigns to hijack trusted enterprise login gateways.
            </p>
          </div>
        </div>
      </div>

      {/* Limitations & Ethics */}
      <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/30 space-y-3 text-xs text-amber-200/90 leading-relaxed">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <AlertTriangle className="w-5 h-5" />
          <span>Ethics, Limitations, and Responsible Use</span>
        </div>
        <p>
          CyberShield is designed as a defensive security analysis tool to help users, security researchers, and developers understand deceptive link structures. An automated score is an automated assessment based on detectable indicators and does not guarantee complete absence of risk.
        </p>
        <p>
          Never utilize this platform to test or validate offensive phishing infrastructure. CyberShield promotes transparent cyber hygiene and defense-in-depth security.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400">
            Common questions regarding URL heuristics, privacy, and detection vectors.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-white hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-cyan-500/40 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          Ready to Analyze a Suspicious Link?
        </h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Test any website, login portal, or link to inspect homoglyphs and threat indicators.
        </p>
        <Link
          href="/analyzer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
        >
          <span>Open URL Analyzer</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
