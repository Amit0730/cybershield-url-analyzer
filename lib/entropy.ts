import { EntropyDetails } from './types';

/**
 * Calculates the Shannon Entropy of a string.
 * H(X) = - sum(P(x) * log2(P(x)))
 * Normal English/domain text typically has an entropy of ~2.5 - 3.5.
 * DGA domains and obfuscated tokens often exceed 4.0 - 4.5.
 */
export function calculateShannonEntropy(str: string): number {
  if (!str || str.length === 0) return 0;

  const frequencies: Record<string, number> = {};
  const len = str.length;

  for (let i = 0; i < len; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  let entropy = 0;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }

  return Number(entropy.toFixed(3));
}

/**
 * Analyzes entropy for both domain and path segments of a URL.
 */
export function analyzeUrlEntropy(hostname: string, pathname: string): EntropyDetails {
  // Strip TLD for domain entropy calculation to focus on SLD/subdomains
  const cleanDomain = hostname.toLowerCase().replace(/^www\./, '');
  const domainParts = cleanDomain.split('.');
  const primaryName = domainParts.length > 1 ? domainParts.slice(0, -1).join('.') : cleanDomain;

  const domainEntropy = calculateShannonEntropy(primaryName);
  const pathEntropy = calculateShannonEntropy(pathname.replace(/^\//, ''));

  const charSet = new Set((hostname + pathname).split(''));

  // Thresholds: DGA or random character chains
  const isHighEntropy = (primaryName.length > 8 && domainEntropy > 3.85) || (pathname.length > 20 && pathEntropy > 4.4);

  return {
    domainEntropy,
    pathEntropy,
    isHighEntropy,
    characterSetSize: charSet.size,
  };
}
