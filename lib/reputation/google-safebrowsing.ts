import { IReputationProvider } from './provider-interface';
import { ReputationProviderResult } from '../types';

export class GoogleSafeBrowsingProvider implements IReputationProvider {
  providerId = 'google_safe_browsing';
  providerName = 'Google Safe Browsing v4';

  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async checkUrl(url: string): Promise<ReputationProviderResult> {
    const timestamp = new Date().toISOString();

    if (!this.isConfigured()) {
      return {
        providerId: this.providerId,
        providerName: this.providerName,
        status: 'unconfigured',
        isConfigured: false,
        details: 'External Google Safe Browsing API key not configured in environment. Using local heuristics.',
        lastChecked: timestamp,
      };
    }

    try {
      const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${this.apiKey}`;
      const payload = {
        client: {
          clientId: 'cybershield-url-analyzer',
          clientVersion: '1.0.0',
        },
        threatInfo: {
          threatTypes: [
            'MALWARE',
            'SOCIAL_ENGINEERING',
            'UNWANTED_SOFTWARE',
            'POTENTIALLY_HARMFUL_APPLICATION',
          ],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url }],
        },
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        return {
          providerId: this.providerId,
          providerName: this.providerName,
          status: 'offline',
          isConfigured: true,
          details: `Safe Browsing API returned status HTTP ${res.status}. Falling back to local analysis.`,
          lastChecked: timestamp,
        };
      }

      const data = await res.json();
      const matches = data.matches || [];

      if (matches.length > 0) {
        const threatType = matches[0].threatType;
        return {
          providerId: this.providerId,
          providerName: this.providerName,
          status: 'threat_detected',
          isConfigured: true,
          maliciousCount: matches.length,
          details: `Flagged as ${threatType} by Google Safe Browsing threat feed.`,
          lastChecked: timestamp,
        };
      }

      return {
        providerId: this.providerId,
        providerName: this.providerName,
        status: 'verified_clean',
        isConfigured: true,
        details: 'No threats detected in Google Safe Browsing database.',
        lastChecked: timestamp,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Timeout or network failure';
      return {
        providerId: this.providerId,
        providerName: this.providerName,
        status: 'offline',
        isConfigured: true,
        details: `External feed unavailable: ${message}. Local heuristics active.`,
        lastChecked: timestamp,
      };
    }
  }
}
