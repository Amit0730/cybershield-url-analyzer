export interface TLDRiskInfo {
  tld: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
  category: string;
  abuseNotes?: string;
  riskScorePenalty: number;
}

// Curated database of TLDs based on global abuse statistics and phishing report registries
const TLD_RISK_MAP: Record<string, Omit<TLDRiskInfo, 'tld'>> = {
  // High / Very High Risk & Abuse Heavy TLDs
  zip: { riskLevel: 'very_high', category: 'File Extension Ambiguity / Deceptive TLD', abuseNotes: 'Frequent exploitation for malicious file disguise & direct payload traps.', riskScorePenalty: 28 },
  mov: { riskLevel: 'very_high', category: 'File Extension Ambiguity / Media Disguise', abuseNotes: 'Exploits media extension confusion to trick users into clicking executables.', riskScorePenalty: 28 },
  top: { riskLevel: 'very_high', category: 'High Abuse Spam & Phishing Domain', abuseNotes: 'Consistently ranked in top 3 abused TLDs by Spamhaus and APWG.', riskScorePenalty: 25 },
  buzz: { riskLevel: 'very_high', category: 'Spam / Phishing Vector', abuseNotes: 'High volume of disposable phishing redirectors.', riskScorePenalty: 24 },
  country: { riskLevel: 'very_high', category: 'Malware Delivery Hub', abuseNotes: 'Disproportionately used in low-cost automated credential theft campaigns.', riskScorePenalty: 25 },
  surf: { riskLevel: 'high', category: 'Disposable Landing Site', abuseNotes: 'Commonly registered via bulk cryptocurrency/anonymized registrars.', riskScorePenalty: 20 },
  click: { riskLevel: 'high', category: 'Phishing / Adware Lure', abuseNotes: 'Frequent scam and fake prize campaign host.', riskScorePenalty: 20 },
  gq: { riskLevel: 'high', category: 'Legacy Free Registrar Abuse (Freenom)', abuseNotes: 'Historically high abuse index with automated bot registrations.', riskScorePenalty: 22 },
  cf: { riskLevel: 'high', category: 'Legacy Free Registrar Abuse (Freenom)', abuseNotes: 'Historically high abuse index with automated bot registrations.', riskScorePenalty: 22 },
  ml: { riskLevel: 'high', category: 'Legacy Free Registrar Abuse (Freenom)', abuseNotes: 'Historically high abuse index with automated bot registrations.', riskScorePenalty: 22 },
  tk: { riskLevel: 'high', category: 'Legacy Free Registrar Abuse (Freenom)', abuseNotes: 'Historically high abuse index with automated bot registrations.', riskScorePenalty: 22 },
  ga: { riskLevel: 'high', category: 'Legacy Free Registrar Abuse (Freenom)', abuseNotes: 'Historically high abuse index with automated bot registrations.', riskScorePenalty: 22 },
  work: { riskLevel: 'high', category: 'Fake Job Scam & Phishing', abuseNotes: 'Frequent exploitation for fake recruitment / crypto task fraud.', riskScorePenalty: 18 },
  rest: { riskLevel: 'high', category: 'Scam Network', abuseNotes: 'Elevated abuse ratio across threat intelligence feeds.', riskScorePenalty: 18 },
  cam: { riskLevel: 'high', category: 'Adult / Fake Streaming Scam', abuseNotes: 'Frequent host for fake video players requiring credential input.', riskScorePenalty: 20 },
  sbs: { riskLevel: 'high', category: 'Cheap Bulk Registration Abuse', abuseNotes: 'High volume of short-lived phishing sites.', riskScorePenalty: 18 },
  icu: { riskLevel: 'high', category: 'Phishing Campaign Vector', abuseNotes: 'Elevated concentration of malicious URLs.', riskScorePenalty: 18 },
  monster: { riskLevel: 'high', category: 'Disposable Scam Domain', abuseNotes: 'Frequent use in fast-flux phishing networks.', riskScorePenalty: 18 },
  cfd: { riskLevel: 'high', category: 'Financial Fraud & Forex Scam', abuseNotes: 'Targeted abuse for fake crypto / trading platform scams.', riskScorePenalty: 22 },
  quest: { riskLevel: 'high', category: 'Phishing & Tech Support Scam', abuseNotes: 'Often used for fake antivirus or tech support popups.', riskScorePenalty: 18 },
  fit: { riskLevel: 'high', category: 'Low-reputation gTLD', abuseNotes: 'Elevated presence in malicious URL blocklists.', riskScorePenalty: 16 },

  // Moderate Risk TLDs (Generic cheap gTLDs with mixed legitimate/abuse profiles)
  xyz: { riskLevel: 'moderate', category: 'Generic gTLD (Elevated Web3/Phishing Incidence)', abuseNotes: 'Popular among startups and Web3, but also widely abused due to ultra-low registration costs.', riskScorePenalty: 10 },
  biz: { riskLevel: 'moderate', category: 'Generic Business TLD', abuseNotes: 'Moderate historical spam correlation.', riskScorePenalty: 8 },
  info: { riskLevel: 'moderate', category: 'Generic Info TLD', abuseNotes: 'Moderate abuse rates for fake blogs and ad redirection.', riskScorePenalty: 8 },
  live: { riskLevel: 'moderate', category: 'Streaming / Dynamic TLD', abuseNotes: 'Frequently abused for fake live-event streaming phishing.', riskScorePenalty: 10 },
  online: { riskLevel: 'moderate', category: 'Generic gTLD', abuseNotes: 'Moderate rate of credential-stealing portals.', riskScorePenalty: 8 },
  site: { riskLevel: 'moderate', category: 'Generic gTLD', abuseNotes: 'Widely used, moderate spam ratio.', riskScorePenalty: 8 },
  space: { riskLevel: 'moderate', category: 'Generic gTLD', abuseNotes: 'Moderate abuse ratio.', riskScorePenalty: 8 },
  tech: { riskLevel: 'moderate', category: 'Generic Tech gTLD', abuseNotes: 'Occasional use for fake tech support.', riskScorePenalty: 6 },
  club: { riskLevel: 'moderate', category: 'Generic Community gTLD', abuseNotes: 'Moderate spam frequency.', riskScorePenalty: 8 },
  vip: { riskLevel: 'moderate', category: 'Promotional gTLD', abuseNotes: 'Frequently used in fake lottery and VIP banking scams.', riskScorePenalty: 12 },
  fun: { riskLevel: 'moderate', category: 'Entertainment gTLD', abuseNotes: 'Occasional malware payload host.', riskScorePenalty: 10 },

  // Standard / Low Risk TLDs
  com: { riskLevel: 'low', category: 'Commercial Standard', abuseNotes: 'Standard global TLD with strict registrar compliance.', riskScorePenalty: 0 },
  org: { riskLevel: 'low', category: 'Organization Standard', abuseNotes: 'High-reputation top-level domain.', riskScorePenalty: 0 },
  net: { riskLevel: 'low', category: 'Network Infrastructure Standard', abuseNotes: 'Standard established global TLD.', riskScorePenalty: 0 },
  edu: { riskLevel: 'low', category: 'Accredited Educational Institution', abuseNotes: 'Strict verification requirements required for registration.', riskScorePenalty: -5 },
  gov: { riskLevel: 'low', category: 'Government Verified Entity', abuseNotes: 'Requires verified state/federal government credentials.', riskScorePenalty: -10 },
  mil: { riskLevel: 'low', category: 'Military Organization', abuseNotes: 'Restricted to verified military bodies.', riskScorePenalty: -10 },
  io: { riskLevel: 'low', category: 'Tech / Developer ccTLD', abuseNotes: 'Widely adopted standard for SaaS and developer tooling.', riskScorePenalty: 0 },
  dev: { riskLevel: 'low', category: 'Google Secure HSTS Built-in TLD', abuseNotes: 'Enforces HTTPS by default in all modern browsers.', riskScorePenalty: -2 },
  app: { riskLevel: 'low', category: 'Google Secure HSTS Built-in TLD', abuseNotes: 'Enforces HTTPS by default in all modern browsers.', riskScorePenalty: -2 },
  co: { riskLevel: 'low', category: 'Commercial Alternative', abuseNotes: 'Established commercial alternative.', riskScorePenalty: 0 },
  ai: { riskLevel: 'low', category: 'Artificial Intelligence / Tech ccTLD', abuseNotes: 'High-value premium tech standard.', riskScorePenalty: 0 },
};

/**
 * Evaluates the risk profile of a given Top-Level Domain (TLD).
 */
export function evaluateTLDRisk(tld: string): TLDRiskInfo {
  const cleanTld = tld.toLowerCase().replace(/^\./, '');

  if (TLD_RISK_MAP[cleanTld]) {
    return {
      tld: cleanTld,
      ...TLD_RISK_MAP[cleanTld],
    };
  }

  // Default for uncatalogued ccTLDs or modern gTLDs
  return {
    tld: cleanTld,
    riskLevel: 'low',
    category: 'Standard / Unflagged TLD',
    abuseNotes: 'No widespread anomalous abuse patterns registered for this TLD.',
    riskScorePenalty: 0,
  };
}
