"use client";

import { useState, useCallback, useEffect } from 'react';
import { useMiniAppSdk } from './use-miniapp-sdk';
import { EASService } from '~/lib/eas-service';
import { Contribution, Researcher } from '~/types/arq-track';
import { useToast } from './use-toast';

export interface ContributionFormData {
  title: string;
  description: string;
  tags: string[];
  impactScore: number;
  farcasterPostUrl?: string;
}

export function useContributionTracker() {
  const { context, sdk, isSDKLoaded } = useMiniAppSdk();
  const { toast } = useToast();
  
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentResearcher, setCurrentResearcher] = useState<Researcher | null>(null);

  // Initialize researcher profile from Farcaster context
  useEffect(() => {
    if (context?.user) {
      const researcher: Researcher = {
        fid: context.user.fid,
        address: context.user.verifications?.[0] || '0x0000000000000000000000000000000000000000',
        username: context.user.username || 'unknown',
        displayName: context.user.displayName || 'Unknown User',
        avatar: context.user.pfpUrl,
        totalContributions: 0,
        totalEarned: '0.00',
        weeklyEarnings: '0.00',
        joinDate: new Date(),
        status: 'active'
      };
      setCurrentResearcher(researcher);
    }
  }, [context]);

  // Load existing contributions from localStorage
  useEffect(() => {
    const savedContributions = localStorage.getItem('arq-track-contributions');
    if (savedContributions) {
      try {
        const parsed = JSON.parse(savedContributions);
        const contributionsWithDates = parsed.map((c: any) => ({
          ...c,
          timestamp: new Date(c.timestamp)
        }));
        setContributions(contributionsWithDates);
      } catch (error) {
        console.error('Error loading contributions:', error);
      }
    }
  }, []);

  // Save contributions to localStorage
  const saveContributions = useCallback((newContributions: Contribution[]) => {
    localStorage.setItem('arq-track-contributions', JSON.stringify(newContributions));
    setContributions(newContributions);
  }, []);

  const submitContribution = useCallback(async (
    formData: ContributionFormData
  ): Promise<Contribution | null> => {
    if (!currentResearcher || !isSDKLoaded) {
      toast({
        title: "Error",
        description: "Please connect your Farcaster account first",
        variant: "destructive"
      });
      return null;
    }

    setIsSubmitting(true);
    
    try {
      // Create contribution object
      const contribution: Contribution = {
        id: `contrib_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        researcherAddress: currentResearcher.address,
        researcherFid: currentResearcher.fid,
        title: formData.title,
        description: formData.description,
        farcasterPostUrl: formData.farcasterPostUrl,
        timestamp: new Date(),
        status: 'pending',
        tags: formData.tags,
        impactScore: formData.impactScore
      };

      // If there's a Farcaster post URL, we can share it via SDK
      if (formData.farcasterPostUrl && sdk) {
        try {
          // In a real implementation, we might validate the post or extract data from it
          console.log('Farcaster post associated:', formData.farcasterPostUrl);
        } catch (error) {
          console.warn('Could not process Farcaster post:', error);
        }
      }

      // Create EAS attestation
      const easService = new EASService(8453); // Default to Base chain
      try {
        const attestationId = await easService.createContributionAttestation(
          contribution,
          currentResearcher.address
        );
        contribution.easAttestationId = attestationId;
        contribution.status = 'verified';
        
        toast({
          title: "Contribution Verified",
          description: "Your contribution has been recorded and attested on-chain",
        });
      } catch (error) {
        console.error('EAS attestation failed:', error);
        toast({
          title: "Warning",
          description: "Contribution saved but attestation failed. Will retry later.",
          variant: "destructive"
        });
      }

      // Save to local storage
      const updatedContributions = [contribution, ...contributions];
      saveContributions(updatedContributions);

      // Update researcher stats
      if (currentResearcher) {
        const updatedResearcher = {
          ...currentResearcher,
          totalContributions: currentResearcher.totalContributions + 1
        };
        setCurrentResearcher(updatedResearcher);
      }

      toast({
        title: "Success",
        description: "Contribution submitted successfully!",
      });

      return contribution;

    } catch (error) {
      console.error('Error submitting contribution:', error);
      toast({
        title: "Error",
        description: "Failed to submit contribution. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [currentResearcher, isSDKLoaded, contributions, saveContributions, sdk, toast]);

  const getContributionsByResearcher = useCallback((fid: number): Contribution[] => {
    return contributions.filter(c => c.researcherFid === fid);
  }, [contributions]);

  const getContributionsByStatus = useCallback((status: Contribution['status']): Contribution[] => {
    return contributions.filter(c => c.status === status);
  }, [contributions]);

  const updateContributionStatus = useCallback((
    contributionId: string, 
    status: Contribution['status']
  ) => {
    const updatedContributions = contributions.map(c => 
      c.id === contributionId ? { ...c, status } : c
    );
    saveContributions(updatedContributions);
  }, [contributions, saveContributions]);

  const retryAttestation = useCallback(async (contributionId: string) => {
    const contribution = contributions.find(c => c.id === contributionId);
    if (!contribution || !currentResearcher) return;

    try {
      const easService = new EASService(8453);
      const attestationId = await easService.createContributionAttestation(
        contribution,
        currentResearcher.address
      );
      
      updateContributionStatus(contributionId, 'verified');
      
      // Update the contribution with attestation ID
      const updatedContributions = contributions.map(c => 
        c.id === contributionId 
          ? { ...c, easAttestationId: attestationId, status: 'verified' as const }
          : c
      );
      saveContributions(updatedContributions);

      toast({
        title: "Success",
        description: "Attestation created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create attestation. Please try again.",
        variant: "destructive"
      });
    }
  }, [contributions, currentResearcher, updateContributionStatus, saveContributions, toast]);

  return {
    contributions,
    currentResearcher,
    isSubmitting,
    submitContribution,
    getContributionsByResearcher,
    getContributionsByStatus,
    updateContributionStatus,
    retryAttestation,
    isSDKLoaded
  };
}