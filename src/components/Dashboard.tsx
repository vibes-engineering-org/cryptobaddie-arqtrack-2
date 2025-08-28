"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';
import { Button } from '~/components/ui/button';
import { useDashboardMetrics } from '~/hooks/use-dashboard-metrics';
import { useContributionTracker } from '~/hooks/use-contribution-tracker';
import { usePayoutSystem } from '~/hooks/use-payout-system';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  DollarSign, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';

export default function Dashboard() {
  const { 
    metrics, 
    ecologicalSystem, 
    getSystemHealthColor, 
    getSystemHealthDescription, 
    getTVFProgress,
    getWeeklyTVF,
    targetTVF 
  } = useDashboardMetrics();
  
  const { currentResearcher, getContributionsByStatus } = useContributionTracker();
  const { processPayout, getPayoutsByStatus } = usePayoutSystem();

  const pendingContributions = getContributionsByStatus('pending');
  const pendingPayouts = getPayoutsByStatus('pending');

  const handleProcessPayouts = async () => {
    for (const payout of pendingPayouts) {
      await processPayout(payout.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">ARQ Track Dashboard</h1>
        <p className="text-muted-foreground">
          Cookie Jar Raid OS - Automating research coordination and value flow
        </p>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Ecological System Health
          </CardTitle>
          <CardDescription>
            Living system model based on Gitcoin ecological analogies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System Status</span>
                <Badge 
                  className={getSystemHealthColor(ecologicalSystem.systemHealth)}
                  variant="outline"
                >
                  {ecologicalSystem.systemHealth}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {getSystemHealthDescription(ecologicalSystem.systemHealth)}
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Nutrient Flows (This Week)</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Contributions:</span>
                  <span className="font-medium">{ecologicalSystem.nutrientFlows.contributions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Attestations:</span>
                  <span className="font-medium">{ecologicalSystem.nutrientFlows.attestations}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payouts:</span>
                  <span className="font-medium">{ecologicalSystem.nutrientFlows.payouts}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalContributions}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.weeklyContributions} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Researchers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeResearchers}</div>
            <p className="text-xs text-muted-foreground">
              {ecologicalSystem.growthSignals.newResearchers} new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalPayouts} ETH</div>
            <p className="text-xs text-muted-foreground">
              {metrics.weeklyPayouts} ETH this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value Flow</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalValueFlow}</div>
            <p className="text-xs text-muted-foreground">
              ${getWeeklyTVF()} this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TVF Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly TVF Progress</CardTitle>
          <CardDescription>
            Targeting ${targetTVF}/week to unlock 10× researcher throughput
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Week</span>
              <span>${getWeeklyTVF()} / ${targetTVF}</span>
            </div>
            <Progress value={getTVFProgress()} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {getTVFProgress().toFixed(0)}% of weekly target achieved
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Growth Signals */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Signals</CardTitle>
          <CardDescription>
            Weekly growth indicators using ecological system metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {ecologicalSystem.growthSignals.contributionGrowth > 0 ? '+' : ''}
                {ecologicalSystem.growthSignals.contributionGrowth}%
              </div>
              <p className="text-sm text-muted-foreground">Contribution Growth</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {ecologicalSystem.growthSignals.engagementRate}%
              </div>
              <p className="text-sm text-muted-foreground">Engagement Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {ecologicalSystem.growthSignals.newResearchers}
              </div>
              <p className="text-sm text-muted-foreground">New Researchers</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      {(pendingContributions.length > 0 || pendingPayouts.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Actions
            </CardTitle>
            <CardDescription>
              Items requiring attention to maintain system flow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.pendingAttestations > 0 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">
                      {metrics.pendingAttestations} contributions need attestation
                    </span>
                  </div>
                </div>
              )}
              
              {pendingPayouts.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">
                      {pendingPayouts.length} payouts ready for processing
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={handleProcessPayouts}
                    disabled={pendingPayouts.length === 0}
                  >
                    Process Payouts
                  </Button>
                </div>
              )}

              {pendingContributions.length === 0 && pendingPayouts.length === 0 && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">All systems operational</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Multi-Chain Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Chain Distribution</CardTitle>
          <CardDescription>
            Payout distribution across Base, Celo, and Arbitrum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(metrics.chainDistribution).map(([chain, count]) => (
              <div key={chain} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    chain === 'base' ? 'bg-blue-500' :
                    chain === 'celo' ? 'bg-green-500' : 'bg-purple-500'
                  }`} />
                  <span className="text-sm font-medium capitalize">{chain}</span>
                </div>
                <span className="text-sm text-muted-foreground">{count} payouts</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentResearcher && (
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Research activity and earnings summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Username</div>
                <div className="font-medium">@{currentResearcher.username}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge variant={currentResearcher.status === 'active' ? 'default' : 'secondary'}>
                  {currentResearcher.status}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Contributions</div>
                <div className="font-medium">{currentResearcher.totalContributions}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Earned</div>
                <div className="font-medium">{currentResearcher.totalEarned} ETH</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}