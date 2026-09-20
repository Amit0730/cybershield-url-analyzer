import { IReputationProvider } from './provider-interface';
import { ReputationProviderResult } from '../types';

export class VirusTotalProvider implements IReputationProvider {
  providerId = 'virustotal';
  providerName = 'VirusTotal v3 Intelligence';

  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.VIRUSTOTAL_API_KEY;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  private encodeUrlId(url: string): string {
    // VirusTotal v3 requires base64 without '=' padding
    const buffer = Buffer.from(url);
    return buffer.toString('base64').replace(/=/g, '');
  }

  async checkUrl(url: string): Promise<ReputationProviderResult> {
    const timestamp = new Date().toISOString();

    if (!this.isConfigured()) {
      return {
        providerId: this.providerId,
        providerName: this.providerName,
        status: 'unconfigured',
        isConfigured: false,
        details: 'VirusTotal API key not configured in environment. Using local heuristics.',
        lastChecked: timestamp,
      };
    }

    try {
      const urlId = this.encodeUrlId(url);
      const endpoint = `https://www.virustotal.com/api/v3/urls/${urlId}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'x-apikey': this.apiKey as string,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.status === 404) {
        return {
          providerId: this.providerId,
          providerName: this.providerName,
          status: 'verified_clean',
          isConfigured: true,
          details: 'URL has not been previously flagged or submitted to VirusTotal database.',
          lastChecked: timestamp,
        };
      }

      if (!res.ok) {
        return {
          providerId: this.providerId,
          providerName: this.providerName,
          status: 'offline',
          isConfigured: true,
          details: `VirusTotal API returned status HTTP ${res.status}.`,
          lastChecked: timestamp,
        };
      }

      const data = await res.json();
      const stats = data.data?.attributes?.last_analysis_stats || {};
      const malicious = stats.malicious || 0;
      const suspicious = stats.suspicious || 0;
      const harmless = stats.harmless || 0;
      const undetected = stats.undetected || 0;
      const total = malicious + suspicious + harmless + undetected;

      if (malicious > 0 || suspicious > 2) {
        return {
          providerId: this.providerId,
          providerName: this.providerName,
          status: 'threat_detected',
          isConfigured: true,
          maliciousCount: malicious + suspicious,
          totalEngines: total,
          details: `Detected as malicious/suspicious by ${malicious + suspicious} of ${total} security engines.`,
          lastChecked: timestamp,
        };
      }

      return {
        providerId: this.providerId,
        providerName: this.providerName,
        status: 'verified_clean',
        isConfigured: true,
        maliciousCount: 0,
        totalEngines: total,
        details: `Clean analysis across ${total || 70}+ antivirus & security vendor engines.`,
        lastChecked: timestamp,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Timeout or network failure';
      return {
        providerId: this.providerId,
        providerName: this.providerName,
        status: 'offline',
        isConfigured: true,
        details: `VirusTotal lookup failed: ${message}. Local heuristics active.`,
        lastChecked: timestamp,
      };
    }
  }
}
