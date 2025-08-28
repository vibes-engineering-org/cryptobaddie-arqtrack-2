"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useContributionTracker } from '~/hooks/use-contribution-tracker';
import { usePayoutSystem } from '~/hooks/use-payout-system';
import { useDashboardMetrics } from '~/hooks/use-dashboard-metrics';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  ExternalLink,
  User,
  Calendar,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';

export default function ProgressTracker() {
  const { contributions } = useContributionTracker();
  const { payouts } = usePayoutSystem();
  const { ecologicalSystem } = useDashboardMetrics();

  const recentContributions = contributions
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  const recentPayouts = payouts
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const engagementProgress = ecologicalSystem.growthSignals.engagementRate;
  const systemHealthScore = ecologicalSystem.systemHealth === 'thriving' ? 100 :
                            ecologicalSystem.systemHealth === 'growing' ? 75 :
                            ecologicalSystem.systemHealth === 'stable' ? 50 : 25;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Funder Progress Tracker</h2>
        <p className="text-muted-foreground">
          Real-time visibility into research impact and capital flow efficiency
        </p>
      </div>

      {/* System Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{engagementProgress}%</div>
              <Progress value={engagementProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Verified contributions / Total submissions
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold capitalize">{ecologicalSystem.systemHealth}</div>
              <Progress value={systemHealthScore} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Overall ecosystem vitality score
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {ecologicalSystem.growthSignals.contributionGrowth > 0 ? '+' : ''}
                {ecologicalSystem.growthSignals.contributionGrowth}%
              </div>
              <Progress 
                value={Math.max(0, 50 + ecologicalSystem.growthSignals.contributionGrowth)} 
                className="h-2" 
              />
              <p className="text-xs text-muted-foreground">
                Week-over-week contribution growth
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Contributions Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Recent Research Contributions
          </CardTitle>
          <CardDescription>
            Latest submissions from researchers with attestation status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-4">
              {recentContributions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No contributions yet. Waiting for researchers to start submitting...
                </div>
              ) : (
                recentContributions.map((contribution) => (
                  <div key={contribution.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(contribution.status)}
                          <h4 className="font-medium">{contribution.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {contribution.description}
                        </p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={getStatusColor(contribution.status)}
                      >
                        {contribution.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(contribution.timestamp, 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Impact: {contribution.impactScore}/10
                      </div>
                    </div>

                    {contribution.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {contribution.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-muted-foreground">
                        FID: {contribution.researcherFid}
                        {contribution.easAttestationId && (
                          <span className="ml-2 text-green-600">✓ Attested</span>
                        )}
                      </div>
                      {contribution.farcasterPostUrl && (
                        <a
                          href={contribution.farcasterPostUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                        >
                          View Post <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Recent Payouts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Recent Payouts
          </CardTitle>
          <CardDescription>
            Automated weekly payments to researchers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPayouts.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No payouts processed yet. Payouts are triggered weekly for verified contributions.
              </div>
            ) : (
              recentPayouts.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(payout.status)}
                    <div>
                      <div className="font-medium">{payout.amount} ETH</div>
                      <div className="text-sm text-muted-foreground">
                        FID: {payout.researcherFid} • {format(payout.timestamp, 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={getStatusColor(payout.status)}
                    >
                      {payout.status}
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      {payout.chain}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Impact Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Capital Allocation Impact</CardTitle>
          <CardDescription>
            Demonstrating the efficiency gains from automated coordination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Friction Reduction</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Automated contribution tracking</li>
                <li>• EAS attestations for transparency</li>
                <li>• Reduced manual feedback loops (25-30%)</li>
                <li>• Multi-chain optimization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Value Unlocked</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 10× researcher throughput potential</li>
                <li>• $100-$150/week TVF target</li>
                <li>• Transparent capital distribution</li>
                <li>• Builder trust through attestations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}