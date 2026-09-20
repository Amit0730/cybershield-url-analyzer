import {
  URLAnalysisResult,
  URLStructure,
  ThreatFlag,
  PositiveIndicator,
  ActionRecommendation,
  RiskLevel,
} from './types';
import { analyzeUrlEntropy } from './entropy';
import { detectHomoglyphsAndBrandSpoofing } from './homoglyphs';
import { evaluateTLDRisk } from './tld-intelligence';
import { reputationAggregator } from './reputation';

// Recognized private/loopback IP patterns for SSRF and hostname detection
const IPV4_REGEX = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
const IPV6_REGEX = /^(\[)?[0-9a-fA-F:]+(\])?$/;

// Suspicious URL keywords associated with phishing and social engineering
const SUSPICIOUS_PATH_KEYWORDS = [
  'login', 'signin', 'sign-in', 'log-in', 'verify', 'verification', 'authenticate', 'auth',
  'account-update', 'billing', 'invoice', 'banking', 'secure-login', 'wallet-connect',
  'restore-access', 'security-alert', 'confirm-identity', 'passcode', 'credential', 'unlock-account',
  'kyc-verification', 'support-portal', 'session-expired', 'reactivate', 'claim-reward', 'airdrop'
];

const OPEN_REDIRECT_PARAMS = [
  'redirect', 'redirect_uri', 'redirect_url', 'return', 'return_url', 'url', 'next', 'dest',
  'destination', 'target', 'link', 'goto', 'r', 'u', 'forward'
];

export interface ParseResult {
  parsedUrl: URL;
  structure: URLStructure;
}

/**
 * Safely parses and normalizes a user-submitted URL string.
 */
export function sanitizeAndParseUrl(rawInput: string): ParseResult {
  if (!rawInput || typeof rawInput !== 'string') {
    throw new Error('Please enter a valid URL.');
  }

  let cleaned = rawInput.trim();

  // Block dangerous pseudo-protocols
  const lower = cleaned.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:') ||
    lower.startsWith('vbscript:')
  ) {
    throw new Error('Unsupported or unsafe protocol detected.');
  }

  // Prepend https:// if protocol is omitted
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }

  let parsed: URL;
  try {
    parsed = new URL(cleaned);
  } catch {
    throw new Error('Malformed URL structure. Please check syntax.');
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.toLowerCase();
  const pathname = parsed.pathname || '/';
  const port = parsed.port || undefined;
  const hash = parsed.hash || undefined;

  // Detect IP address usage
  let isIpAddress = false;
  let ipType: URLStructure['ipType'] = undefined;

  if (IPV4_REGEX.test(hostname)) {
    isIpAddress = true;
    const parts = hostname.split('.').map(Number);
    if (parts[0] === 127) {
      ipType = 'loopback';
    } else if (
      parts[0] === 10 ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168)
    ) {
      ipType = 'private';
    } else {
      ipType = 'ipv4';
    }
  } else if (IPV6_REGEX.test(hostname) && hostname.includes(':')) {
    isIpAddress = true;
    ipType = hostname === '::1' || hostname === '[::1]' ? 'loopback' : 'ipv6';
  }

  // Break down host parts
  const hostParts = hostname.split('.');
  let tld = '';
  let domain = hostname;
  let subdomains: string[] = [];

  if (!isIpAddress && hostParts.length >= 2) {
    tld = hostParts[hostParts.length - 1];
    // Check compound ccTLD e.g. co.uk, com.au
    if (hostParts.length >= 3 && ['co', 'com', 'org', 'gov', 'edu', 'net', 'ac'].includes(hostParts[hostParts.length - 2])) {
      tld = `${hostParts[hostParts.length - 2]}.${tld}`;
      domain = hostParts.slice(-3).join('.');
      subdomains = hostParts.slice(0, -3);
    } else {
      domain = hostParts.slice(-2).join('.');
      subdomains = hostParts.slice(0, -2);
    }
  }

  // Path depth calculation
  const pathSegments = pathname.split('/').filter(Boolean);
  const pathDepth = pathSegments.length;

  // Search parameters analysis
  const searchParams: URLStructure['searchParams'] = [];
  parsed.searchParams.forEach((value, key) => {
    const isRedirect = OPEN_REDIRECT_PARAMS.includes(key.toLowerCase());
    const isBase64Like = value.length > 24 && /^[A-Za-z0-9+/=]+$/.test(value);
    const hasEmbeddedUrl = /^https?:\/\//i.test(value) || value.includes('www.');
    const isSuspicious = isRedirect || isBase64Like || hasEmbeddedUrl;

    searchParams.push({
      key,
      value: value.length > 80 ? value.substring(0, 80) + '...' : value,
      isSuspicious,
    });
  });

  const structure: URLStructure = {
    rawUrl: rawInput,
    normalizedUrl: parsed.toString(),
    protocol,
    hostname,
    domain,
    tld,
    subdomains,
    port,
    pathname,
    pathDepth,
    searchParams,
    hash,
    isIpAddress,
    ipType,
    urlLength: rawInput.length,
  };

  return { parsedUrl: parsed, structure };
}

/**
 * Main URL Security Analyzer Engine.
 */
export async function analyzeUrl(rawUrl: string): Promise<URLAnalysisResult> {
  const startTime = Date.now();
  const { structure } = sanitizeAndParseUrl(rawUrl);

  const threatFlags: ThreatFlag[] = [];
  const positiveIndicators: PositiveIndicator[] = [];
  const recommendations: ActionRecommendation[] = [];

  let riskScore = 0;

  // 1. Homoglyphs and Brand Spoofing Check
  const homoglyphDetails = detectHomoglyphsAndBrandSpoofing(structure.hostname, structure.pathname);

  if (homoglyphDetails.isPunycode) {
    riskScore += 45;
    threatFlags.push({
      id: 'punycode_idn',
      category: 'homoglyph_spoofing',
      severity: 'critical',
      title: 'Punycode Internationalized Domain (IDN)',
      description: 'The domain uses an encoded Internationalized Domain Name (xn-- prefix). Attackers frequently abuse IDN characters to visually mimic reputable websites.',
      evidence: `Raw Hostname: "${structure.hostname}" (Decoded: "${homoglyphDetails.decodedHostname}")`,
      remediation: 'Do not enter credentials or sensitive information. Verify the address character-by-character.',
    });
  }

  if (homoglyphDetails.spoofedBrand) {
    const brand = homoglyphDetails.spoofedBrand;
    const isCritical = brand.impersonationType === 'homoglyph' || brand.impersonationType === 'subdomain_spoof';
    riskScore += isCritical ? 55 : 40;

    threatFlags.push({
      id: 'brand_impersonation',
      category: 'brand_impersonation',
      severity: isCritical ? 'critical' : 'high',
      title: `Potential Brand Impersonation: ${brand.brandName}`,
      description: `The URL appears to impersonate ${brand.brandName} (${brand.impersonationType.replace('_', ' ')}). The official legitimate domain is ${brand.officialDomain}.`,
      evidence: `Impersonation Type: ${brand.impersonationType} | Target: ${brand.brandName} (${brand.officialDomain})`,
      remediation: `Navigate directly to the verified official website (${brand.officialDomain}) instead of following this link.`,
    });

    recommendations.push({
      id: 'rec_brand_spoof',
      priority: 'urgent',
      action: `Do not log into ${brand.brandName} on this page`,
      explanation: `This domain is not operated by ${brand.brandName}. Any credentials entered here may be harvested by attackers.`,
    });
  }

  // 2. IP Address as Hostname Check
  if (structure.isIpAddress) {
    const isPrivate = structure.ipType === 'private' || structure.ipType === 'loopback';
    riskScore += isPrivate ? 50 : 42;

    threatFlags.push({
      id: 'ip_hostname',
      category: 'ip_hostname',
      severity: isPrivate ? 'critical' : 'high',
      title: isPrivate ? 'Private / Internal Network IP Address' : 'Raw IP Address Used as Hostname',
      description: isPrivate
        ? 'The URL targets a private/local RFC 1918 or loopback address. If received from an external source, this may be an SSRF or internal network exploit probe.'
        : 'Legitimate services use registered domain names with TLS certificates. Direct IP addresses are commonly used to host short-lived malicious payloads and bypass domain reputation filters.',
      evidence: `IP Target: ${structure.hostname} (${structure.ipType?.toUpperCase()})`,
      remediation: 'Avoid accessing raw IP endpoints unless connecting to an explicitly known local development server.',
    });

    recommendations.push({
      id: 'rec_ip_host',
      priority: 'urgent',
      action: 'Avoid submitting data to raw IP addresses',
      explanation: 'Raw IP hosts lack standard public identity verification and domain certificate protections.',
    });
  }

  // 3. Top-Level Domain (TLD) Risk Evaluation
  const tldRisk = evaluateTLDRisk(structure.tld);
  if (tldRisk.riskScorePenalty > 0) {
    riskScore += tldRisk.riskScorePenalty;
    threatFlags.push({
      id: `tld_${tldRisk.tld}`,
      category: 'suspicious_tld',
      severity: tldRisk.riskLevel === 'very_high' ? 'high' : 'medium',
      title: `High-Risk Top-Level Domain (.${tldRisk.tld})`,
      description: `The .${tldRisk.tld} TLD has elevated rates of spam, malware delivery, and phishing registrations in threat intelligence records.`,
      evidence: `TLD Category: ${tldRisk.category} | ${tldRisk.abuseNotes || ''}`,
      remediation: 'Exercise heightened caution before downloading files or submitting payment information on this TLD.',
    });
  } else if (['gov', 'edu', 'mil'].includes(structure.tld)) {
    positiveIndicators.push({
      id: 'pos_restricted_tld',
      title: `Regulated Institution TLD (.${structure.tld})`,
      description: `This TLD requires official government, educational, or military verification to register.`,
    });
  }

  // 4. Insecure HTTP Protocol Check
  const hasCredentialKeywords = SUSPICIOUS_PATH_KEYWORDS.some(kw =>
    structure.normalizedUrl.toLowerCase().includes(kw)
  );

  if (structure.protocol === 'http:') {
    const penalty = hasCredentialKeywords ? 35 : 20;
    riskScore += penalty;

    threatFlags.push({
      id: 'insecure_http',
      category: 'insecure_protocol',
      severity: hasCredentialKeywords ? 'high' : 'medium',
      title: 'Unencrypted HTTP Connection',
      description: hasCredentialKeywords
        ? 'The URL uses unencrypted HTTP while referencing authentication/account keywords. Passwords and sensitive data transmitted over HTTP can be intercepted via Man-in-the-Middle (MitM) attacks.'
        : 'The URL does not enforce TLS encryption (HTTPS). Traffic can be monitored or modified in transit.',
      evidence: `Protocol: ${structure.protocol}// (Insecure)`,
      remediation: 'Ensure the website supports HTTPS before entering credentials or sensitive data.',
    });
  } else if (structure.protocol === 'https:') {
    positiveIndicators.push({
      id: 'pos_https',
      title: 'HTTPS Encryption Enforced',
      description: 'The connection uses TLS/HTTPS protocol to protect transit data from eavesdropping.',
    });
  }

  // 5. Excessive Subdomains & Hyphenation
  if (structure.subdomains.length >= 3) {
    riskScore += 22;
    threatFlags.push({
      id: 'excessive_subdomains',
      category: 'excessive_subdomains',
      severity: 'medium',
      title: 'Excessive Subdomain Depth',
      description: 'The domain contains 3 or more subdomain tiers. Multi-layered subdomains are frequently engineered to disguise the true root domain on mobile browsers.',
      evidence: `Subdomains (${structure.subdomains.length}): ${structure.subdomains.join('.')}`,
      remediation: `Inspect the actual root domain (${structure.domain}) rather than the prefixed subdomains.`,
    });
  }

  const hyphenCount = (structure.hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    riskScore += 15;
    threatFlags.push({
      id: 'excessive_hyphens',
      category: 'brand_impersonation',
      severity: 'low',
      title: 'High Hyphen Density in Domain',
      description: 'Multiple hyphens in domain names are frequently used to combine trusted keywords with deceptive terms (e.g., brand-security-update-center).',
      evidence: `Hostname contains ${hyphenCount} hyphens: ${structure.hostname}`,
      remediation: 'Verify whether the organization genuinely operates with multi-hyphenated domain formats.',
    });
  }

  // 6. Suspicious Keywords in Path or Subdomain
  const matchedKeywords = SUSPICIOUS_PATH_KEYWORDS.filter(kw => {
    const regex = new RegExp(`(^|[/_.-])${kw}([/_.-]|$)`, 'i');
    return regex.test(structure.pathname) || structure.subdomains.some(sub => sub.toLowerCase().includes(kw));
  });

  if (matchedKeywords.length >= 2 && !['gov', 'edu'].includes(structure.tld)) {
    riskScore += 20;
    threatFlags.push({
      id: 'suspicious_path_keywords',
      category: 'suspicious_keywords',
      severity: 'medium',
      title: 'Multiple High-Risk Security/Auth Keywords',
      description: 'The URL path and subdomains combine sensitive keywords commonly found in phishing lures.',
      evidence: `Matched keywords: [${matchedKeywords.join(', ')}] in "${structure.pathname}"`,
      remediation: 'Verify you navigated to this page intentionally, rather than clicking an unsolicited email or SMS link.',
    });
  }

  // 7. Open Redirect & Suspicious Query Parameters
  const suspiciousParams = structure.searchParams.filter(p => p.isSuspicious);
  if (suspiciousParams.length > 0) {
    riskScore += 20;
    const redirectParam = suspiciousParams.find(p => OPEN_REDIRECT_PARAMS.includes(p.key.toLowerCase()));

    threatFlags.push({
      id: 'open_redirect_vector',
      category: 'open_redirect_risk',
      severity: 'medium',
      title: redirectParam ? 'Potential Open Redirect Target' : 'Suspicious Payload Parameter',
      description: redirectParam
        ? `The parameter "${redirectParam.key}" contains an external redirect target. Attackers exploit open redirects on legitimate sites to route victims to phishing destinations.`
        : 'The query string contains obfuscated data or nested URLs.',
      evidence: `Query Params: ${suspiciousParams.map(p => `${p.key}=${p.value}`).join(', ')}`,
      remediation: 'Examine the destination parameter carefully before clicking or proceeding through the redirect.',
    });
  }

  // 8. Shannon Entropy Analysis
  const entropy = analyzeUrlEntropy(structure.hostname, structure.pathname);
  if (entropy.isHighEntropy) {
    riskScore += 18;
    threatFlags.push({
      id: 'high_entropy_obfuscation',
      category: 'obfuscation_entropy',
      severity: 'medium',
      title: 'High Shannon Entropy (Algorithmic / Obfuscated String)',
      description: 'The hostname or path exhibits elevated character randomness, characteristic of Domain Generation Algorithms (DGA), temporary CDN tracking tokens, or obfuscated malware payloads.',
      evidence: `Domain Entropy: ${entropy.domainEntropy} bits/char | Path Entropy: ${entropy.pathEntropy} bits/char`,
      remediation: 'Ensure the link originates from a known, verified communication channel.',
    });
  } else {
    positiveIndicators.push({
      id: 'pos_entropy',
      title: 'Natural Lexical Distribution',
      description: `The domain name and path follow normal natural language character distribution (Entropy: ${entropy.domainEntropy} bits/char).`,
    });
  }

  // 9. Non-Standard Web Port Check
  if (structure.port && !['80', '443'].includes(structure.port)) {
    riskScore += 15;
    threatFlags.push({
      id: 'non_standard_port',
      category: 'suspicious_port',
      severity: 'low',
      title: `Non-Standard Network Port (:${structure.port})`,
      description: 'Standard public web services run on port 80 (HTTP) or 443 (HTTPS). Non-standard ports are often used in temporary phishing kits, compromised IoT hosts, or command-and-control backdoors.',
      evidence: `Explicit Port: :${structure.port}`,
      remediation: 'Confirm that this service is intended to operate on a custom port.',
    });
  }

  // 10. URL Length Analysis
  if (structure.urlLength > 150) {
    riskScore += 12;
    threatFlags.push({
      id: 'extreme_url_length',
      category: 'unusual_url_length',
      severity: 'low',
      title: `Abnormally Long URL (${structure.urlLength} characters)`,
      description: 'Extremely long URLs are often used to conceal deceptive domain structures on mobile screens or encode tracking and victim-specific exploitation payloads.',
      evidence: `Total Length: ${structure.urlLength} characters`,
      remediation: 'Inspect the full URL in an expanded window to see the true host and destination.',
    });
  }

  // 11. Positive Indicators for well-structured URLs
  if (threatFlags.length === 0) {
    positiveIndicators.push({
      id: 'pos_clean_structure',
      title: 'Standard URL Anatomy',
      description: 'Domain structure, subdomain hierarchy, and query parameters align with standard web conventions.',
    });
    positiveIndicators.push({
      id: 'pos_no_spoof',
      title: 'No Homoglyph / Impersonation Detected',
      description: 'Zero Unicode confusable characters or unauthorized brand keyword combinations found.',
    });
  }

  // Query External Threat Intelligence Feeds
  let reputationProviders: import('./types').ReputationProviderResult[];
  try {
    reputationProviders = await reputationAggregator.runAllChecks(structure.normalizedUrl);
    for (const provider of reputationProviders) {
      if (provider.status === 'threat_detected') {
        riskScore = Math.max(riskScore, 90);
        threatFlags.unshift({
          id: `rep_${provider.providerId}`,
          category: 'reputation_blacklist',
          severity: 'critical',
          title: `Threat Flagged by ${provider.providerName}`,
          description: provider.details,
          evidence: `External Feed: ${provider.providerName} (Flagged)`,
          remediation: 'Do not access this URL. It has been actively flagged in global cybersecurity threat databases.',
        });
      }
    }
  } catch {
    reputationProviders = [];
  }

  // Clamp risk score to 0 - 100
  const overallScore = Math.min(100, Math.max(0, riskScore));

  // Determine Risk Category & Classification
  let riskLevel: RiskLevel;
  let riskLabel: string;

  if (overallScore <= 25) {
    riskLevel = 'low';
    riskLabel = 'Low Risk — No Obvious Phishing Red Flags';
  } else if (overallScore <= 55) {
    riskLevel = 'moderate';
    riskLabel = 'Moderate Risk — Suspicious Characteristics Detected';
  } else if (overallScore <= 80) {
    riskLevel = 'high';
    riskLabel = 'High Risk — Strong Phishing / Security Anomalies';
  } else {
    riskLevel = 'critical';
    riskLabel = 'Critical Risk — Severe Threat / Impersonation Detected';
  }

  // Determine Confidence Level
  const confidence = reputationProviders.some(p => p.isConfigured) ? 'high' : 'medium';

  // Generate Action Recommendations if not already present
  if (recommendations.length === 0) {
    if (riskLevel === 'critical' || riskLevel === 'high') {
      recommendations.push({
        id: 'rec_high_risk_general',
        priority: 'urgent',
        action: 'Do not enter passwords, credit cards, or personal information',
        explanation: 'The analyzed URL demonstrates multiple strong indicators of fraudulent or malicious intent.',
      });
      recommendations.push({
        id: 'rec_report_abuse',
        priority: 'caution',
        action: 'Report the URL to your organization or registrar',
        explanation: 'Submitting suspicious links helps security feeds protect other users across the internet.',
      });
    } else if (riskLevel === 'moderate') {
      recommendations.push({
        id: 'rec_moderate_caution',
        priority: 'caution',
        action: 'Verify the source of this link before interacting',
        explanation: 'While not definitively malicious, this URL exhibits anomalous characteristics (such as high entropy, uncommon TLD, or redirection parameters).',
      });
    } else {
      recommendations.push({
        id: 'rec_low_practice',
        priority: 'best_practice',
        action: 'Always verify TLS certificates in your browser bar',
        explanation: 'Even clean URLs should be approached with general cybersecurity hygiene, especially when prompted for authentication.',
      });
    }
  }

  // Build Executive Summary
  let summary = '';
  if (riskLevel === 'critical') {
    summary = `CRITICAL ALERT: This URL presents extreme security risks (Risk Score: ${overallScore}/100). Strong indicators of deceptive brand spoofing, homoglyph attack, or confirmed threat intelligence listings were identified. Do NOT enter credentials or download files from this location.`;
  } else if (riskLevel === 'high') {
    summary = `HIGH RISK DETECTED: This URL exhibits multiple high-confidence phishing indicators (Risk Score: ${overallScore}/100), including suspicious domain structures, unencrypted credential paths, or raw IP hostnames. Access is strongly discouraged.`;
  } else if (riskLevel === 'moderate') {
    summary = `MODERATE CAUTION: The analyzer detected notable anomalies (Risk Score: ${overallScore}/100), such as an elevated-abuse TLD, unusual subdomain depth, or redirect parameters. Review technical indicators before proceeding.`;
  } else {
    summary = `LOW RISK: No prominent phishing or spoofing patterns were detected in the URL structure (Risk Score: ${overallScore}/100). Standard HTTPS and legitimate naming conventions were observed. Note: automated score is an automated assessment and not a guarantee of safety.`;
  }

  const scanDurationMs = Date.now() - startTime;

  return {
    id: `scan_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date().toISOString(),
    url: rawUrl,
    overallScore,
    riskLevel,
    riskLabel,
    confidence,
    summary,
    threatFlags,
    positiveIndicators,
    technicalDetails: {
      structure,
      homoglyphs: homoglyphDetails,
      entropy,
      tldRisk: {
        tld: tldRisk.tld,
        riskLevel: tldRisk.riskLevel,
        category: tldRisk.category,
        abuseNotes: tldRisk.abuseNotes,
      },
      redirectAnalysis: {
        containsRedirectParam: suspiciousParams.some(p => OPEN_REDIRECT_PARAMS.includes(p.key.toLowerCase())),
        targetUrl: suspiciousParams.find(p => OPEN_REDIRECT_PARAMS.includes(p.key.toLowerCase()))?.value,
      },
      securityHeadersHint: {
        isHttps: structure.protocol === 'https:',
        defaultPort: !structure.port || ['80', '443'].includes(structure.port),
      },
    },
    reputationProviders,
    recommendations,
    scanDurationMs,
    engineVersion: 'CyberShield Heuristics v2.4.0',
  };
}
