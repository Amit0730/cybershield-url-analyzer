export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type ThreatCategory =
  | 'homoglyph_spoofing'
  | 'brand_impersonation'
  | 'suspicious_tld'
  | 'ip_hostname'
  | 'excessive_subdomains'
  | 'suspicious_keywords'
  | 'open_redirect_risk'
  | 'obfuscation_entropy'
  | 'insecure_protocol'
  | 'suspicious_port'
  | 'reputation_blacklist'
  | 'unusual_url_length';

export interface ThreatFlag {
  id: string;
  category: ThreatCategory;
  severity: Severity;
  title: string;
  description: string;
  evidence: string;
  remediation: string;
}

export interface PositiveIndicator {
  id: string;
  title: string;
  description: string;
}

export interface HomoglyphDetails {
  isPunycode: boolean;
  rawHostname: string;
  decodedHostname: string;
  hasNonAscii: boolean;
  spoofedBrand?: {
    brandName: string;
    officialDomain: string;
    similarityScore: number;
    impersonationType: 'homoglyph' | 'subdomain_spoof' | 'typosquat' | 'keyword_combo';
  };
}

export interface EntropyDetails {
  domainEntropy: number;
  pathEntropy: number;
  isHighEntropy: boolean;
  characterSetSize: number;
}

export interface URLStructure {
  rawUrl: string;
  normalizedUrl: string;
  protocol: 'https:' | 'http:' | string;
  hostname: string;
  domain: string;
  tld: string;
  subdomains: string[];
  port?: string;
  pathname: string;
  pathDepth: number;
  searchParams: { key: string; value: string; isSuspicious: boolean }[];
  hash?: string;
  isIpAddress: boolean;
  ipType?: 'ipv4' | 'ipv6' | 'private' | 'loopback';
  urlLength: number;
}

export interface ReputationProviderResult {
  providerId: string;
  providerName: string;
  status: 'verified_clean' | 'threat_detected' | 'unconfigured' | 'offline' | 'skipped';
  isConfigured: boolean;
  score?: number;
  maliciousCount?: number;
  totalEngines?: number;
  details: string;
  lastChecked: string;
}

export interface TechnicalDetails {
  structure: URLStructure;
  homoglyphs: HomoglyphDetails;
  entropy: EntropyDetails;
  tldRisk: {
    tld: string;
    riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
    category: string;
    abuseNotes?: string;
  };
  redirectAnalysis?: {
    containsRedirectParam: boolean;
    targetUrl?: string;
    isExternalTarget?: boolean;
  };
  securityHeadersHint?: {
    isHttps: boolean;
    defaultPort: boolean;
  };
}

export interface ActionRecommendation {
  id: string;
  priority: 'urgent' | 'caution' | 'best_practice';
  action: string;
  explanation: string;
}

export interface URLAnalysisResult {
  id: string;
  timestamp: string;
  url: string;
  overallScore: number; // 0 (Clean) to 100 (Max Danger)
  riskLevel: RiskLevel;
  riskLabel: string;
  confidence: 'high' | 'medium' | 'low';
  summary: string;
  threatFlags: ThreatFlag[];
  positiveIndicators: PositiveIndicator[];
  technicalDetails: TechnicalDetails;
  reputationProviders: ReputationProviderResult[];
  recommendations: ActionRecommendation[];
  scanDurationMs: number;
  engineVersion: string;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  url: string;
  hostname: string;
  overallScore: number;
  riskLevel: RiskLevel;
  riskLabel: string;
  threatCount: number;
  summary: string;
  result: URLAnalysisResult;
}

export interface PresetSample {
  id: string;
  label: string;
  url: string;
  category: 'phishing' | 'homoglyph' | 'ip_scam' | 'legitimate' | 'redirect';
  description: string;
  badge: string;
}
