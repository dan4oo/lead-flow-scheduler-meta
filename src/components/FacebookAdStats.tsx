
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FacebookAdStats } from '@/types/crm';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

type FacebookAdStatsCardProps = {
  stats: FacebookAdStats;
  isLoading: boolean;
};

const FacebookAdStatsCard = ({ stats, isLoading }: FacebookAdStatsCardProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col space-y-1.5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm text-muted-foreground">No metrics found for this campaign.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col space-y-1.5">
            <span className="text-sm text-muted-foreground">Impressions</span>
            <span className="text-2xl font-bold">{stats.impressions.toLocaleString()}</span>
          </div>
          <div className="flex flex-col space-y-1.5">
            <span className="text-sm text-muted-foreground">Clicks</span>
            <span className="text-2xl font-bold">{stats.clicks.toLocaleString()}</span>
          </div>
          <div className="flex flex-col space-y-1.5">
            <span className="text-sm text-muted-foreground">CTR</span>
            <span className="text-2xl font-bold">{stats.ctr}%</span>
          </div>
          <div className="flex flex-col space-y-1.5">
            <span className="text-sm text-muted-foreground">CPC</span>
            <span className="text-2xl font-bold">${stats.cpc.toFixed(2)}</span>
          </div>
          <div className="flex flex-col space-y-1.5">
            <span className="text-sm text-muted-foreground">Leads</span>
            <span className="text-2xl font-bold">{stats.leads}</span>
          </div>
          <div className="flex flex-col space-y-1.5">
            <span className="text-sm text-muted-foreground">Calls</span>
            <span className="text-2xl font-bold">{stats.calls}</span>
          </div>
          <div className="flex flex-col space-y-1.5">
            <span className="text-sm text-muted-foreground">Total Spend</span>
            <span className="text-2xl font-bold">${stats.spend.toFixed(2)}</span>
          </div>
          <div className="flex flex-col space-y-1.5">
            <span className="text-sm text-muted-foreground">Last Updated</span>
            <span className="text-md font-medium">{format(stats.lastUpdated, 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacebookAdStatsCard;
