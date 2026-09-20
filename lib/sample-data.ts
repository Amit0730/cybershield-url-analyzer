import { PresetSample } from './types';

export const SAMPLE_PRESETS: PresetSample[] = [
  {
    id: 'sample_homoglyph',
    label: 'Homoglyph Punycode Spoof',
    url: 'https://xn--appl-43d.com/login/verify-appleid',
    category: 'homoglyph',
    description: 'Uses Cyrillic character substitution encoded via Punycode to visually impersonate Apple ID.',
    badge: 'Critical Attack Vector',
  },
  {
    id: 'sample_subdomain_phish',
    label: 'Deceptive Subdomain Impersonation',
    url: 'https://paypal.com.security-verification-center.xyz/signin/account-update',
    category: 'phishing',
    description: 'Embeds a trusted brand in the subdomain on a high-risk TLD to deceive mobile users.',
    badge: 'High Phishing Risk',
  },
  {
    id: 'sample_ip_scam',
    label: 'Raw IP Hostname & HTTP Insecure',
    url: 'http://185.220.101.5/banking/auth/login.php',
    category: 'ip_scam',
    description: 'Uses direct unencrypted IPv4 address hosting an uncertified credential harvesting form.',
    badge: 'Severe Red Flag',
  },
  {
    id: 'sample_open_redirect',
    label: 'Open Redirect & High Entropy Token',
    url: 'https://auth-gateway.click/verify?redirect=https%3A%2F%2Ftracker-token.buzz%2Fsession%3Fkey%3DYXNkZmFzZGYxMjM0NTY3OA%3D%3D',
    category: 'redirect',
    description: 'Combines open redirect routing with base64 encoded parameters on an abuse-heavy TLD.',
    badge: 'Redirect Vector',
  },
  {
    id: 'sample_legitimate_github',
    label: 'Legitimate SaaS Service (GitHub)',
    url: 'https://github.com/security/advisories',
    category: 'legitimate',
    description: 'Verified official domain with enforced HTTPS, clean entropy, and reputable TLD.',
    badge: 'Clean / Low Risk',
  },
  {
    id: 'sample_legitimate_bank',
    label: 'Official Financial Portal (Chase)',
    url: 'https://www.chase.com',
    category: 'legitimate',
    description: 'Official banking domain adhering to strict TLS and web standard conventions.',
    badge: 'Clean / Low Risk',
  },
];
