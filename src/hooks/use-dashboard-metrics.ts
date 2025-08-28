"use client";

import { useState, useCallback, useEffect } from 'react';
import { DashboardMetrics, EcologicalSystem } from '~/types/arq-track';
import { useContributionTracker } from './use-contribution-tracker';
import { usePayoutSystem } from './use-payout-system';

const TARGET_WEEKLY_TVF = 150; // $150 target weekly TVF
const ETH_TO_USD_RATE = 2500; // Approximate ETH price for TVF calculation

export function useDashboardMetrics() {
  const { contributions } = useContributionTracker();
  const { payouts, totalPaid } = usePayoutSystem();
  
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalContributions: 0,
    totalPayouts: '0.00',
    totalValueFlow: '0.00',
    activeResearchers: 0,
    weeklyContributions: 0,
    weeklyPayouts: '0.00',
    pendingAttestations: 0,
    chainDistribution: {
      base: 0,
      celo: 0,
      arbitrum: 0
    }
  });

  const [ecologicalSystem, setEcologicalSystem] = useState<EcologicalSystem>({
    nutrientFlows: {
      contributions: 0,
      attestations: 0,
      payouts: 0
    },
    growthSignals: {
      newResearchers: 0,
      contributionGrowth: 0,
      engagementRate: 0
    },
    systemHealth: 'stable'
  });

  const calculateMetrics = useCallback(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Weekly contributions
    const weeklyContributions = contributions.filter(
      c => c.timestamp >= weekAgo
    ).length;

    // Weekly payouts
    const weeklyPayoutList = payouts.filter(
      p => p.timestamp >= weekAgo
    );
    const weeklyPayoutAmount = weeklyPayoutList.reduce((sum, payout) => {
      return sum + (payout.status === 'completed' ? parseFloat(payout.amount) : 0);
    }, 0);

    // Active researchers (unique contributors in the last week)
    const activeResearchers = new Set(
      contributions
        .filter(c => c.timestamp >= weekAgo)
        .map(c => c.researcherFid)
    ).size;

    // Pending attestations
    const pendingAttestations = contributions.filter(
      c => c.status === 'pending' || !c.easAttestationId
    ).length;

    // Chain distribution
    const chainDistribution = payouts.reduce(
      (dist, payout) => {
        if (payout.status === 'completed') {
          dist[payout.chain]++;
        }
        return dist;
      },
      { base: 0, celo: 0, arbitrum: 0 }
    );

    // Calculate TVF (Total Value Flow) in USD
    const totalValueFlow = parseFloat(totalPaid) * ETH_TO_USD_RATE;

    const newMetrics: DashboardMetrics = {
      totalContributions: contributions.length,
      totalPayouts: totalPaid,
      totalValueFlow: totalValueFlow.toFixed(2),
      activeResearchers,
      weeklyContributions,
      weeklyPayouts: weeklyPayoutAmount.toFixed(4),
      pendingAttestations,
      chainDistribution
    };

    setMetrics(newMetrics);
  }, [contributions, payouts, totalPaid]);

  const calculateEcologicalSystem = useCallback(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Nutrient flows (current week activity)
    const weeklyContributions = contributions.filter(c => c.timestamp >= weekAgo);
    const weeklyAttestations = contributions.filter(
      c => c.timestamp >= weekAgo && c.easAttestationId
    );
    const weeklyPayouts = payouts.filter(
      p => p.timestamp >= weekAgo && p.status === 'completed'
    );

    // Growth signals (comparing this week to last week)
    const previousWeekContributions = contributions.filter(
      c => c.timestamp >= twoWeeksAgo && c.timestamp < weekAgo
    );
    
    const newResearchers = new Set(
      weeklyContributions.map(c => c.researcherFid)
    ).size;

    const contributionGrowth = previousWeekContributions.length > 0
      ? ((weeklyContributions.length - previousWeekContributions.length) / previousWeekContributions.length) * 100
      : weeklyContributions.length > 0 ? 100 : 0;

    // Engagement rate (verified contributions vs total contributions)
    const engagementRate = weeklyContributions.length > 0
      ? (weeklyAttestations.length / weeklyContributions.length) * 100
      : 0;

    // System health assessment
    let systemHealth: EcologicalSystem['systemHealth'] = 'stable';
    
    if (contributionGrowth > 20 && engagementRate > 80) {
      systemHealth = 'thriving';
    } else if (contributionGrowth > 0 && engagementRate > 60) {
      systemHealth = 'growing';
    } else if (contributionGrowth < -20 || engagementRate < 40) {
      systemHealth = 'declining';
    }

    const newEcologicalSystem: EcologicalSystem = {
      nutrientFlows: {
        contributions: weeklyContributions.length,
        attestations: weeklyAttestations.length,
        payouts: weeklyPayouts.length
      },
      growthSignals: {
        newResearchers,
        contributionGrowth: Math.round(contributionGrowth),
        engagementRate: Math.round(engagementRate)
      },
      systemHealth
    };

    setEcologicalSystem(newEcologicalSystem);
  }, [contributions, payouts]);

  // Update metrics when data changes
  useEffect(() => {
    calculateMetrics();
    calculateEcologicalSystem();
  }, [calculateMetrics, calculateEcologicalSystem]);

  const getSystemHealthColor = useCallback((health: EcologicalSystem['systemHealth']): string => {
    switch (health) {
      case 'thriving': return 'text-green-600';
      case 'growing': return 'text-blue-600';
      case 'stable': return 'text-yellow-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }, []);

  const getSystemHealthDescription = useCallback((health: EcologicalSystem['systemHealth']): string => {
    switch (health) {
      case 'thriving': return 'Excellent growth and engagement';
      case 'growing': return 'Positive growth trajectory';
      case 'stable': return 'Steady state operation';
      case 'declining': return 'Needs attention and optimization';
      default: return 'System status unknown';
    }
  }, []);

  const getTVFProgress = useCallback((): number => {
    const weeklyTVF = parseFloat(metrics.weeklyPayouts) * ETH_TO_USD_RATE;
    return Math.min((weeklyTVF / TARGET_WEEKLY_TVF) * 100, 100);
  }, [metrics.weeklyPayouts]);

  const getWeeklyTVF = useCallback((): string => {
    return (parseFloat(metrics.weeklyPayouts) * ETH_TO_USD_RATE).toFixed(2);
  }, [metrics.weeklyPayouts]);

  return {
    metrics,
    ecologicalSystem,
    getSystemHealthColor,
    getSystemHealthDescription,
    getTVFProgress,
    getWeeklyTVF,
    targetTVF: TARGET_WEEKLY_TVF,
    ethToUsdRate: ETH_TO_USD_RATE
  };
}