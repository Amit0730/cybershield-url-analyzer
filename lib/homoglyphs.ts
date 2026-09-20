import { HomoglyphDetails } from './types';

// Map of common confusable Unicode homoglyphs to ASCII equivalents
const CONFUSABLE_MAP: Record<string, string> = {
  // Cyrillic
  '\u0430': 'a', // Cyrillic Small Letter A
  '\u0441': 'c', // Cyrillic Small Letter Es
  '\u0435': 'e', // Cyrillic Small Letter Ie
  '\u0456': 'i', // Cyrillic Small Letter Byelorussian-Ukrainian I
  '\u0458': 'j', // Cyrillic Small Letter Je
  '\u043E': 'o', // Cyrillic Small Letter O
  '\u0440': 'p', // Cyrillic Small Letter Er
  '\u0455': 's', // Cyrillic Small Letter Dze
  '\u0445': 'x', // Cyrillic Small Letter Ha
  '\u0443': 'y', // Cyrillic Small Letter U
  '\u0410': 'A',
  '\u0412': 'B',
  '\u0421': 'C',
  '\u0415': 'E',
  '\u041D': 'H',
  '\u0406': 'I',
  '\u0408': 'J',
  '\u041A': 'K',
  '\u041C': 'M',
  '\u041E': 'O',
  '\u0420': 'P',
  '\u0422': 'T',
  '\u0425': 'X',
  // Greek
  '\u03B1': 'a', // Greek Small Alpha
  '\u03BF': 'o', // Greek Small Omicron
  '\u03C1': 'p', // Greek Small Rho
  '\u03C5': 'u', // Greek Small Upsilon
  '\u03BD': 'v', // Greek Small Nu
  '\u0391': 'A',
  '\u0392': 'B',
  '\u0395': 'E',
  '\u0397': 'H',
  '\u0399': 'I',
  '\u039A': 'K',
  '\u039C': 'M',
  '\u039D': 'N',
  '\u039F': 'O',
  '\u03A1': 'P',
  '\u03A4': 'T',
  '\u03A7': 'X',
  '\u03A5': 'Y',
  '\u0396': 'Z',
  // Lookalikes / Numbers in text
  '0': 'o',
  '1': 'l',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '8': 'b',
  'vv': 'w',
  'rn': 'm',
  'cl': 'd',
};

// High-profile target brands frequently targeted by phishing campaigns
export interface MonitoredBrand {
  name: string;
  officialDomains: string[];
  keywords: string[];
}

export const TARGET_BRANDS: MonitoredBrand[] = [
  { name: 'PayPal', officialDomains: ['paypal.com', 'paypal.me'], keywords: ['paypal', 'paypaii', 'paypai'] },
  { name: 'Microsoft', officialDomains: ['microsoft.com', 'microsoftonline.com', 'live.com', 'outlook.com', 'office.com', 'office365.com'], keywords: ['microsoft', 'office365', 'outlook', 'onedrive', 'msft', 'azure'] },
  { name: 'Google', officialDomains: ['google.com', 'accounts.google.com', 'gmail.com', 'drive.google.com'], keywords: ['google', 'gmail', 'gsuite', 'googl'] },
  { name: 'Apple', officialDomains: ['apple.com', 'icloud.com'], keywords: ['apple', 'icloud', 'applestore', 'itunes', 'appleid'] },
  { name: 'Amazon', officialDomains: ['amazon.com', 'amazon.co.uk', 'amazon.de', 'aws.amazon.com'], keywords: ['amazon', 'amaz0n', 'aws', 'primevideo'] },
  { name: 'Netflix', officialDomains: ['netflix.com'], keywords: ['netflix', 'netfllx', 'netf1ix'] },
  { name: 'Facebook / Meta', officialDomains: ['facebook.com', 'meta.com', 'fb.com'], keywords: ['facebook', 'faceb00k', 'metaverse'] },
  { name: 'Instagram', officialDomains: ['instagram.com'], keywords: ['instagram', 'instagrarn'] },
  { name: 'WhatsApp', officialDomains: ['whatsapp.com', 'web.whatsapp.com'], keywords: ['whatsapp', 'whatsap'] },
  { name: 'Chase Bank', officialDomains: ['chase.com'], keywords: ['chase', 'chasebank'] },
  { name: 'Bank of America', officialDomains: ['bankofamerica.com', 'bofa.com'], keywords: ['bankofamerica', 'bofa'] },
  { name: 'Wells Fargo', officialDomains: ['wellsfargo.com'], keywords: ['wellsfargo'] },
  { name: 'Citibank', officialDomains: ['citi.com', 'citibank.com'], keywords: ['citibank', 'citi'] },
  { name: 'Coinbase', officialDomains: ['coinbase.com'], keywords: ['coinbase', 'coinbaise'] },
  { name: 'Binance', officialDomains: ['binance.com'], keywords: ['binance', 'binanace'] },
  { name: 'MetaMask', officialDomains: ['metamask.io'], keywords: ['metamask'] },
  { name: 'Steam', officialDomains: ['steampowered.com', 'steamcommunity.com'], keywords: ['steampowered', 'steamcommunity', 'steam'] },
  { name: 'GitHub', officialDomains: ['github.com'], keywords: ['github', 'githvb'] },
  { name: 'Dropbox', officialDomains: ['dropbox.com'], keywords: ['dropbox', 'dropb0x'] },
  { name: 'DocuSign', officialDomains: ['docusign.com', 'docusign.net'], keywords: ['docusign'] },
  { name: 'DHL', officialDomains: ['dhl.com'], keywords: ['dhl', 'dhl-express', 'dhlexpress'] },
  { name: 'FedEx', officialDomains: ['fedex.com'], keywords: ['fedex', 'fedex-tracking'] },
  { name: 'USPS', officialDomains: ['usps.com'], keywords: ['usps', 'usps-tracking', 'uspstracking'] },
];

/**
 * Basic punycode decoder for IDN domains (e.g. xn--appl-43d.com -> apple.com with Cyrillic e)
 */
export function decodePunycodeDomain(domain: string): string {
  if (!domain.includes('xn--')) return domain;

  try {
    // In modern JavaScript environments (Node.js & browsers), URL and URLSearchParams
    // handle IDN conversions or we can use domain name decoding
    // If running in environment with Intl / native punycode:
    return domain
      .split('.')
      .map(part => {
        if (!part.startsWith('xn--')) return part;
        try {
          // Check if decoded via URL host representation
          const url = new URL(`http://${part}`);
          return url.hostname;
        } catch {
          return part;
        }
      })
      .join('.');
  } catch {
    return domain;
  }
}

/**
 * Calculates Levenshtein Distance between two strings.
 */
export function calculateLevenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix: number[][] = [];
  for (let i = 0; i <= bn; i++) matrix[i] = [i];
  for (let j = 0; j <= an; j++) matrix[0][j] = j;

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1) // insertion / deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

/**
 * Normalize confusable characters to plain ASCII lowercase.
 */
export function normalizeConfusables(input: string): string {
  let normalized = '';
  for (const char of input) {
    normalized += CONFUSABLE_MAP[char] || char;
  }
  return normalized.toLowerCase();
}

/**
 * Analyzes a hostname for homoglyph attacks and brand impersonation.
 */
export function detectHomoglyphsAndBrandSpoofing(
  rawHostname: string,
  pathname: string = ''
): HomoglyphDetails {
  const isPunycode = rawHostname.toLowerCase().includes('xn--');
  const hasNonAscii = /[^\u0000-\u007F]/.test(rawHostname);
  const decodedHostname = decodePunycodeDomain(rawHostname);

  // Normalized ASCII representation
  const normalizedHost = normalizeConfusables(decodedHostname);
  const hostParts = normalizedHost.split('.');
  const rawParts = rawHostname.toLowerCase().split('.');

  // Extract base domain and subdomains
  const rootDomain = hostParts.length > 1 ? hostParts.slice(-2).join('.') : normalizedHost;
  const subdomains = hostParts.length > 2 ? hostParts.slice(0, -2) : [];
  const fullTargetString = `${normalizedHost} ${pathname}`.toLowerCase();

  let detectedSpoof: HomoglyphDetails['spoofedBrand'] | undefined = undefined;

  for (const brand of TARGET_BRANDS) {
    const isOfficialDomain = brand.officialDomains.some(
      official => rawHostname.toLowerCase() === official || rawHostname.toLowerCase().endsWith('.' + official)
    );

    // If it is genuinely the official domain, skip spoof detection
    if (isOfficialDomain) continue;

    // Check 1: Punycode / Homoglyph attack on brand name
    if (isPunycode || hasNonAscii) {
      for (const keyword of brand.keywords) {
        if (normalizedHost.includes(keyword) && !rawHostname.toLowerCase().includes(keyword)) {
          detectedSpoof = {
            brandName: brand.name,
            officialDomain: brand.officialDomains[0],
            similarityScore: 95,
            impersonationType: 'homoglyph',
          };
          break;
        }
      }
      if (detectedSpoof) break;
    }

    // Check 2: Brand in Subdomain with different root domain
    // e.g. "paypal.com.account-update.xyz" or "login.microsoftonline.com.phish.cc"
    for (const official of brand.officialDomains) {
      const officialClean = official.replace(/\.[^.]+$/, ''); // e.g. "paypal" or "microsoftonline"
      const subdomainJoined = subdomains.join('.');

      if (
        subdomainJoined.includes(officialClean) ||
        subdomainJoined.includes(brand.name.toLowerCase().replace(/\s+/g, ''))
      ) {
        detectedSpoof = {
          brandName: brand.name,
          officialDomain: brand.officialDomains[0],
          similarityScore: 90,
          impersonationType: 'subdomain_spoof',
        };
        break;
      }
    }
    if (detectedSpoof) break;

    // Check 3: Typosquatting / Levenshtein similarity on root domain SLD
    const sld = rootDomain.split('.')[0];
    for (const keyword of brand.keywords) {
      if (sld.length >= 4 && keyword.length >= 4) {
        const dist = calculateLevenshteinDistance(sld, keyword);
        // Distance of 1 or 2 edits on brand name (e.g., paypa1, amzn, googl)
        if (dist > 0 && dist <= (keyword.length > 7 ? 2 : 1)) {
          detectedSpoof = {
            brandName: brand.name,
            officialDomain: brand.officialDomains[0],
            similarityScore: 85,
            impersonationType: 'typosquat',
          };
          break;
        }
      }
    }
    if (detectedSpoof) break;

    // Check 4: Brand keyword combination with security/phishing triggers
    // e.g. "paypal-security-update.com" or "netflix-billing-reactivate.online"
    for (const keyword of brand.keywords) {
      const regex = new RegExp(`(^|[-_.])${keyword}([-_.])`, 'i');
      if (regex.test(sld) && !brand.officialDomains.includes(rootDomain)) {
        const suspiciousCombos = ['verify', 'security', 'login', 'account', 'billing', 'update', 'support', 'auth', 'recover', 'token'];
        if (suspiciousCombos.some(term => sld.includes(term))) {
          detectedSpoof = {
            brandName: brand.name,
            officialDomain: brand.officialDomains[0],
            similarityScore: 88,
            impersonationType: 'keyword_combo',
          };
          break;
        }
      }
    }
    if (detectedSpoof) break;
  }

  return {
    isPunycode,
    rawHostname,
    decodedHostname,
    hasNonAscii,
    spoofedBrand: detectedSpoof,
  };
}
