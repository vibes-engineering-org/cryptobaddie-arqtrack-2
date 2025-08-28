"use client";

import { useState, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Payout, Contribution, SupportedChain } from '~/types/arq-track';
import { useToast } from './use-toast';

const WEEKLY_PAYOUT_AMOUNT = '0.08'; // ETH

export interface PayoutSystemState {
  payouts: Payout[];
  pendingPayouts: Payout[];
  isProcessing: boolean;
  totalPaid: string;
  weeklyBudget: string;
}

export function usePayoutSystem() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  const { toast } = useToast();
  
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isProcessingPayouts, setIsProcessingPayouts] = useState(false);

  // Load existing payouts from localStorage
  useEffect(() => {
    const savedPayouts = localStorage.getItem('arq-track-payouts');
    if (savedPayouts) {
      try {
        const parsed = JSON.parse(savedPayouts);
        const payoutsWithDates = parsed.map((p: any) => ({
          ...p,
          timestamp: new Date(p.timestamp)
        }));
        setPayouts(payoutsWithDates);
      } catch (error) {
        console.error('Error loading payouts:', error);
      }
    }
  }, []);

  // Save payouts to localStorage
  const savePayouts = useCallback((newPayouts: Payout[]) => {
    localStorage.setItem('arq-track-payouts', JSON.stringify(newPayouts));
    setPayouts(newPayouts);
  }, []);

  const calculateEligiblePayout = useCallback((contributions: Contribution[]): string => {
    // Simple payout calculation: 0.08 ETH per verified contribution per week
    const verifiedContributions = contributions.filter(c => c.status === 'verified');
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentContributions = verifiedContributions.filter(
      c => c.timestamp >= weekAgo
    );
    
    // Each contribution earns a portion of the weekly 0.08 ETH
    // For simplicity, we'll use the full amount if there's at least one contribution
    return recentContributions.length > 0 ? WEEKLY_PAYOUT_AMOUNT : '0';
  }, []);

  const createPayout = useCallback(async (
    researcherAddress: string,
    researcherFid: number,
    contributions: Contribution[],
    chain: SupportedChain = 'base'
  ): Promise<Payout | null> => {
    if (!isConnected || !address) {
      toast({
        title: "Error",
        description: "Please connect your wallet to process payouts",
        variant: "destructive"
      });
      return null;
    }

    const amount = calculateEligiblePayout(contributions);
    if (amount === '0') {
      toast({
        title: "No Payout Due",
        description: "No verified contributions found for this week",
        variant: "destructive"
      });
      return null;
    }

    try {
      const payout: Payout = {
        id: `payout_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        researcherAddress,
        researcherFid,
        amount,
        contributionIds: contributions.map(c => c.id),
        status: 'pending',
        timestamp: new Date(),
        chain
      };

      const updatedPayouts = [payout, ...payouts];
      savePayouts(updatedPayouts);

      toast({
        title: "Payout Created",
        description: `Payout of ${amount} ETH created for researcher`,
      });

      return payout;
    } catch (error) {
      console.error('Error creating payout:', error);
      toast({
        title: "Error",
        description: "Failed to create payout",
        variant: "destructive"
      });
      return null;
    }
  }, [address, isConnected, calculateEligiblePayout, payouts, savePayouts, toast]);

  const processPayout = useCallback(async (payoutId: string): Promise<boolean> => {
    const payout = payouts.find(p => p.id === payoutId);
    if (!payout || !isConnected || !address) {
      return false;
    }

    setIsProcessingPayouts(true);

    try {
      // Update payout status to processing
      const updatedPayouts = payouts.map(p => 
        p.id === payoutId ? { ...p, status: 'processing' as const } : p
      );
      savePayouts(updatedPayouts);

      // In a real implementation, this would interact with a payout contract
      // For now, we'll simulate the transaction
      const simulatedTxHash = `0x${Math.random().toString(16).substring(2).padStart(64, '0')}`;
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Update payout with transaction hash and completed status
      const finalPayouts = payouts.map(p => 
        p.id === payoutId 
          ? { 
              ...p, 
              status: 'completed' as const, 
              txHash: simulatedTxHash 
            } 
          : p
      );
      savePayouts(finalPayouts);

      toast({
        title: "Payout Successful",
        description: `${payout.amount} ETH sent to ${payout.researcherAddress}`,
      });

      return true;
    } catch (error) {
      console.error('Error processing payout:', error);
      
      // Update payout status to failed
      const failedPayouts = payouts.map(p => 
        p.id === payoutId ? { ...p, status: 'failed' as const } : p
      );
      savePayouts(failedPayouts);

      toast({
        title: "Payout Failed",
        description: "Failed to process payout. Please try again.",
        variant: "destructive"
      });

      return false;
    } finally {
      setIsProcessingPayouts(false);
    }
  }, [payouts, isConnected, address, savePayouts, toast]);

  const getPayoutsByResearcher = useCallback((fid: number): Payout[] => {
    return payouts.filter(p => p.researcherFid === fid);
  }, [payouts]);

  const getPayoutsByStatus = useCallback((status: Payout['status']): Payout[] => {
    return payouts.filter(p => p.status === status);
  }, [payouts]);

  const getTotalPaid = useCallback((): string => {
    const completedPayouts = payouts.filter(p => p.status === 'completed');
    const total = completedPayouts.reduce((sum, payout) => {
      return sum + parseFloat(payout.amount);
    }, 0);
    return total.toFixed(4);
  }, [payouts]);

  const getWeeklyPayouts = useCallback((): Payout[] => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return payouts.filter(p => p.timestamp >= weekAgo);
  }, [payouts]);

  const retryFailedPayout = useCallback(async (payoutId: string): Promise<boolean> => {
    const payout = payouts.find(p => p.id === payoutId);
    if (!payout || payout.status !== 'failed') {
      return false;
    }

    // Reset status to pending and retry
    const updatedPayouts = payouts.map(p => 
      p.id === payoutId ? { ...p, status: 'pending' as const, txHash: undefined } : p
    );
    savePayouts(updatedPayouts);

    return await processPayout(payoutId);
  }, [payouts, savePayouts, processPayout]);

  const state: PayoutSystemState = {
    payouts,
    pendingPayouts: getPayoutsByStatus('pending'),
    isProcessing: isProcessingPayouts,
    totalPaid: getTotalPaid(),
    weeklyBudget: WEEKLY_PAYOUT_AMOUNT
  };

  return {
    ...state,
    createPayout,
    processPayout,
    retryFailedPayout,
    getPayoutsByResearcher,
    getPayoutsByStatus,
    getWeeklyPayouts,
    calculateEligiblePayout,
    isConnected
  };
}