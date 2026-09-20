import { ReputationProviderResult } from '../types';

export interface IReputationProvider {
  providerId: string;
  providerName: string;
  isConfigured(): boolean;
  checkUrl(url: string): Promise<ReputationProviderResult>;
}
