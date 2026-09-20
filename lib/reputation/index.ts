import { IReputationProvider } from './provider-interface';
import { LocalHeuristicProvider } from './local-heuristics';
import { GoogleSafeBrowsingProvider } from './google-safebrowsing';
import { VirusTotalProvider } from './virustotal';
import { ReputationProviderResult } from '../types';

export class ReputationAggregator {
  private providers: IReputationProvider[];

  constructor() {
    this.providers = [
      new LocalHeuristicProvider(),
      new GoogleSafeBrowsingProvider(),
      new VirusTotalProvider(),
    ];
  }

  async runAllChecks(url: string): Promise<ReputationProviderResult[]> {
    const promises = this.providers.map(provider => provider.checkUrl(url));
    return Promise.all(promises);
  }
}

export const reputationAggregator = new ReputationAggregator();
