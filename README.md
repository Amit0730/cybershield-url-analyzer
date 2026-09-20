# 🛡️ CyberShield — URL Security & Phishing Risk Analyzer

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Deployment](https://img.shields.io/badge/Deployment-Live-cyan)](https://cybershield-url-analyzer.vercel.app)

**CyberShield** is a modern, production-grade cybersecurity web application that analyzes URLs for suspicious characteristics associated with phishing, credential harvesting, homoglyph brand impersonation, open redirects, and malicious payloads.

🌐 **Live Website**: [https://cybershield-url-analyzer.vercel.app](https://cybershield-url-analyzer.vercel.app)  
📦 **GitHub Repository**: [https://github.com/Amit0730/cybershield-url-analyzer](https://github.com/Amit0730/cybershield-url-analyzer)

---

## ✨ Key Features

- **🔍 Multi-Vector Lexical & Statistical Detection Engine**:
  - **Homoglyphs & Punycode IDNs**: Decodes `xn--` internationalized domains and confusable Cyrillic/Greek Unicode lookalikes (`а` vs `a`, `0` vs `o`) targeting top brands.
  - **Brand Impersonation Intelligence**: Uses Levenshtein distance and character normalization to detect typosquatting and deceptive subdomain structures targeting 100+ monitored financial, technology, and crypto brands (PayPal, Apple, Google, Microsoft, Amazon, Chase, Binance, Steam, etc.).
  - **Shannon Entropy Scoring**: Mathematical analysis of character randomness in hostnames and paths to detect automated Domain Generation Algorithms (DGA) and encrypted malware drops.
  - **High-Risk TLD Intelligence**: Classifies Top-Level Domains against global abuse metrics (`.zip`, `.top`, `.buzz`, `.country`, `.click`, `.surf` vs `.gov`, `.edu`, `.mil`).
  - **Open Redirect & Query Parameter Traps**: Detects nested routing targets (`?redirect=`, `?url=`, `?next=`) and base64 payloads.
  - **Raw IP Hostname & SSRF Protection**: Flags raw IPv4/IPv6 endpoints and blocks internal RFC 1918 subnets.
  - **Insecure HTTP Protocol Detection**: Penalizes unencrypted connections referencing sensitive authentication paths.

- **📊 Calibrated 0–100 Risk Score**:
  - **0–25 (Low Risk)**: Standard domain structure, valid HTTPS, reputable TLD, no spoofing detected.
  - **26–55 (Moderate Risk)**: Minor anomalies (uncommon TLD, long query strings, excessive hyphens).
  - **56–80 (High Risk)**: Multiple strong red flags (brand keyword in subdomain, IP address host, high entropy).
  - **81–100 (Critical Risk)**: Active homoglyph attack on top brands, Punycode spoofing, or reputation blacklist listings.

- **⚡ Transparent Security Architecture**:
  - Distinguishes clearly between locally computed heuristics and external reputation feeds (Google Safe Browsing v4, VirusTotal v3).
  - Explains every penalty with concrete technical evidence and actionable remediation steps.

- **💾 Client-Side Scan History**:
  - Persistent scan tracking via `localStorage`.
  - Filter by risk level, search by domain or URL, re-inspect past scans in 1 click, or export to JSON.

- **🛡️ Zero Execution & Privacy First**:
  - Never renders, executes, or iframes user-submitted URLs in the browser.
  - Zero password or credential logging.

---

## 🏛️ Architecture & Component Hierarchy

```
cybershield/
├── app/
│   ├── layout.tsx              # RootLayout with dark cyber styling, fonts, and OpenGraph metadata
│   ├── page.tsx                # Homepage (Hero, Analyzer, Features, How it Works, Recent Scans, Disclaimer)
│   ├── analyzer/
│   │   └── page.tsx            # Dedicated URL Analyzer workbench with URL query param support
│   ├── history/
│   │   └── page.tsx            # Scan History manager (search, filter, export, clear, re-inspect)
│   ├── about/
│   │   └── page.tsx            # Methodology, entropy math, homoglyph algorithms, ethics & FAQ
│   ├── sitemap.ts              # SEO dynamic sitemap
│   ├── robots.ts               # Search engine crawl directives
│   ├── globals.css             # Cyber grid, radar scan keyframes, glowing badges
│   └── api/
│       └── analyze/
│           └── route.ts        # Secure POST endpoint with SSRF protection & reputation engine
├── components/
│   ├── navbar.tsx              # Navigation with engine status badge, quick links, mobile drawer
│   ├── footer.tsx              # Cybersecurity footer with disclaimer, resources, and repo links
│   ├── theme-provider.tsx      # Dark mode default theme wrapper
│   └── analyzer/
│       ├── url-input-hero.tsx  # Hero search bar with presets, validation, and clipboard paste
│       ├── analysis-loader.tsx # Multi-step radar scanning visualizer
│       ├── results-dashboard.tsx # Full results view (score gauge, threat flags, positive indicators)
│       ├── score-gauge.tsx     # Animated SVG radial score gauge with glowing risk colors
│       ├── threat-badge.tsx    # Severity badges (Critical, High, Moderate, Low, Info)
│       ├── technical-breakdown.tsx # Deep URL anatomy, entropy, homoglyph matrix, and query params
│       └── recommendation-card.tsx # Actionable security advice & user warnings
├── lib/
│   ├── types.ts                # TypeScript interfaces for ScanResults, ThreatFlags, Providers
│   ├── url-analyzer-engine.ts  # Core heuristic & statistical detection engine
│   ├── entropy.ts              # Shannon entropy calculations for domains and paths
│   ├── homoglyphs.ts           # Confusable unicode / Punycode / Brand impersonation detection
│   ├── tld-intelligence.ts     # Curated high-risk TLD database & risk scoring
│   ├── utils.ts                # Formatting, date helpers, sanitizers, export helpers
│   ├── sample-data.ts          # Realistic test presets (Phishing, Homoglyph, IP obfuscated)
│   └── reputation/
│       ├── provider-interface.ts # Extensible security provider interface
│       ├── local-heuristics.ts  # Native offline heuristic provider
│       ├── google-safebrowsing.ts # Google Safe Browsing v4 API integration (with fallback)
│       ├── virustotal.ts       # VirusTotal v3 API integration (with fallback)
│       └── index.ts            # Multi-provider aggregator
└── public/
    └── favicon.ico             # CyberShield icon
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- npm or yarn or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Amit0730/cybershield-url-analyzer.git
   cd cybershield-url-analyzer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables (Optional)**:
   ```bash
   cp .env.example .env.local
   ```
   *(Note: CyberShield works 100% out of the box using its built-in heuristic engine without external API keys).*

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `GOOGLE_SAFE_BROWSING_API_KEY` | Optional | Google Safe Browsing API v4 key for external threat list lookups. |
| `VIRUSTOTAL_API_KEY` | Optional | VirusTotal v3 API key for multi-engine antivirus reputation lookups. |
| `NEXT_PUBLIC_APP_URL` | Optional | Production domain used for OpenGraph and sitemap generation. |

---

## 📡 API Reference

### `POST /api/analyze`

Analyzes a user-submitted URL and returns structured security intelligence.

#### Request Body:
```json
{
  "url": "https://xn--appl-43d.com/login/verify"
}
```

#### Response:
```json
{
  "success": true,
  "data": {
    "id": "scan_1726880000000_abc123",
    "timestamp": "2026-09-21T02:00:00.000Z",
    "url": "https://xn--appl-43d.com/login/verify",
    "overallScore": 95,
    "riskLevel": "critical",
    "riskLabel": "Critical Risk — Severe Threat / Impersonation Detected",
    "confidence": "high",
    "summary": "CRITICAL ALERT: This URL presents extreme security risks (Risk Score: 95/100)...",
    "threatFlags": [
      {
        "id": "punycode_idn",
        "category": "homoglyph_spoofing",
        "severity": "critical",
        "title": "Punycode Internationalized Domain (IDN)",
        "description": "The domain uses an encoded Internationalized Domain Name (xn-- prefix)...",
        "evidence": "Raw Hostname: \"xn--appl-43d.com\" (Decoded: \"apple.com\")",
        "remediation": "Do not enter credentials or sensitive information."
      }
    ],
    "positiveIndicators": [],
    "technicalDetails": { ... },
    "recommendations": [ ... ],
    "scanDurationMs": 4
  }
}
```

---

## 🔒 Security & Privacy Commitments

1. **Zero Execution Guarantee**: CyberShield never loads or executes untrusted third-party URLs. All evaluations are performed via lexical tokenization, regex, and statistical analysis.
2. **SSRF Mitigation**: Direct requests to private subnets (`127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`, `localhost`) are flagged and protected.
3. **No Credential Logging**: User inputs are not stored in any external database. Scan history is retained solely in the client's browser `localStorage`.
4. **Transparent Assessment**: The application never promises 100% safety and clearly marks automated assessments with disclaimers.

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).
