export interface Contribution {
  id: string;
  researcherAddress: string;
  researcherFid: number;
  title: string;
  description: string;
  farcasterPostUrl?: string;
  timestamp: Date;
  easAttestationId?: string;
  status: 'pending' | 'verified' | 'paid';
  tags: string[];
  impactScore: number;
}

export interface Payout {
  id: string;
  researcherAddress: string;
  researcherFid: number;
  amount: string; // in ETH
  contributionIds: string[];
  txHash?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: Date;
  chain: 'base' | 'celo' | 'arbitrum';
}

export interface Researcher {
  fid: number;
  address: string;
  username: string;
  displayName: string;
  avatar?: string;
  totalContributions: number;
  totalEarned: string;
  weeklyEarnings: string;
  joinDate: Date;
  status: 'active' | 'inactive';
}

export interface DashboardMetrics {
  totalContributions: number;
  totalPayouts: string;
  totalValueFlow: string;
  activeResearchers: number;
  weeklyContributions: number;
  weeklyPayouts: string;
  pendingAttestations: number;
  chainDistribution: {
    base: number;
    celo: number;
    arbitrum: number;
  };
}

export interface EcologicalSystem {
  nutrientFlows: {
    contributions: number;
    attestations: number;
    payouts: number;
  };
  growthSignals: {
    newResearchers: number;
    contributionGrowth: number;
    engagementRate: number;
  };
  systemHealth: 'thriving' | 'growing' | 'stable' | 'declining';
}

export interface SemanticDefinition {
  term: string;
  definition: string;
  context: 'contribution' | 'payout' | 'attestation' | 'system';
  examples: string[];
}

export type SupportedChain = 'base' | 'celo' | 'arbitrum';

export interface ChainConfig {
  id: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  easContractAddress?: string;
  payoutContractAddress?: string;
}