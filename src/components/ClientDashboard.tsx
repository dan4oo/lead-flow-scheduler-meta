
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  campaigns, 
  leads, 
  clients, 
  getCampaignsByClientId, 
  getLeadsByClientId 
} from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, subDays } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getFacebookAdStats } from '@/services/FacebookAdsService';
import FacebookAdStatsCard from './FacebookAdStats';

const ClientDashboard = () => {
  // In a real app, this would come from auth context
  // For this demo, we're using the clientId from localStorage
  const [clientId, setClientId] = useState('westside');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  
  // Get the user role from localStorage (for the demo)
  useEffect(() => {
    const userRole = window.localStorage.getItem('userRole') || 'admin';
    if (userRole !== 'client') {
      window.localStorage.setItem('userRole', 'client');
    }
  }, []);

  // Get client data
  const client = clients.find(c => c.id === clientId);
  
  // Get campaigns and leads for the client
  const clientCampaigns = getCampaignsByClientId(clientId);
  const clientLeads = getLeadsByClientId(clientId);
  
  // Fetch Facebook Ad Stats for selected campaign
  const { data: campaignStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['facebookAdStats', selectedCampaignId],
    queryFn: () => selectedCampaignId ? getFacebookAdStats(selectedCampaignId) : null,
    enabled: !!selectedCampaignId,
  });
  
  // Data transformation for campaign performance
  const campaignLeadCounts = clientCampaigns.map(campaign => {
    const count = clientLeads.filter(lead => lead.campaignId === campaign.id).length;
    return {
      name: campaign.name,
      count,
      id: campaign.id,
      // Add Facebook campaign ID mapping
      facebookCampaignId: campaign.id === 'campaign1' ? 'fb-camp-1' : 
                          campaign.id === 'campaign2' ? 'fb-camp-2' : 
                          campaign.id === 'campaign3' ? 'fb-camp-3' : undefined
    };
  });
  
  // Calculate conversion metrics
  const totalLeads = clientLeads.length;
  const appointmentsScheduled = clientLeads.filter(lead => 
    lead.status === 'appointment_scheduled' || lead.status === 'closed_won'
  ).length;
  const closedWon = clientLeads.filter(lead => lead.status === 'closed_won').length;
  
  const conversionRate = totalLeads ? Math.round((closedWon / totalLeads) * 100) : 0;
  const appointmentRate = totalLeads ? Math.round((appointmentsScheduled / totalLeads) * 100) : 0;

  // Generate trend data for the last 30 days
  const generateTrendData = () => {
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = subDays(new Date(), i);
      // Count leads that were added on this date
      const leadsOnDate = clientLeads.filter(lead => 
        lead.dateAdded.getDate() === date.getDate() &&
        lead.dateAdded.getMonth() === date.getMonth() &&
        lead.dateAdded.getFullYear() === date.getFullYear()
      ).length;
      
      data.push({
        date: format(date, 'MMM dd'),
        leads: leadsOnDate,
      });
    }
    return data;
  };

  const trendData = generateTrendData();

  // Colors for charts
  const COLORS = ['#1976d2', '#009688', '#ff9800', '#f44336', '#9c27b0', '#673ab7'];

  // Format date for display
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle campaign click
  const handleCampaignClick = (campaignId: string) => {
    // Get Facebook campaign ID
    const campaign = campaignLeadCounts.find(c => c.id === campaignId);
    if (campaign?.facebookCampaignId) {
      setSelectedCampaignId(campaign.facebookCampaignId);
    }
  };

  // Campaign bar chart with clickable bars
  const CampaignBarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={campaignLeadCounts}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar 
          dataKey="count" 
          fill="#1976d2"
          onClick={(data) => handleCampaignClick(data.id)}
          cursor="pointer"
        />
      </BarChart>
    </ResponsiveContainer>
  );

  // Get campaign name for a lead
  const getCampaignName = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign?.name || 'Unknown Campaign';
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">{client?.name || 'Client'} Dashboard</h1>
      <p className="text-muted-foreground mb-6">Welcome to your campaign performance dashboard</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clientLeads.length}</div>
            <p className="text-sm text-muted-foreground">From all campaigns</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Appointment Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{appointmentRate}%</div>
            <p className="text-sm text-muted-foreground">Leads that scheduled appointments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{conversionRate}%</div>
            <p className="text-sm text-muted-foreground">Leads that completed treatment</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
          <TabsTrigger value="leads">Your Leads</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <p className="text-sm text-muted-foreground">Click on a campaign bar to view detailed Facebook metrics</p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <CampaignBarChart />
              </div>
              
              {selectedCampaignId && (
                <div className="mt-6">
                  <FacebookAdStatsCard 
                    stats={campaignStats} 
                    isLoading={isLoadingStats} 
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="campaigns">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Active Campaigns</CardTitle>
                <p className="text-sm text-muted-foreground">Click on a campaign to view detailed Facebook metrics</p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Leads</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientCampaigns.map(campaign => {
                      const campaignLeads = clientLeads.filter(lead => lead.campaignId === campaign.id);
                      return (
                        <TableRow 
                          key={campaign.id}
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => {
                            const mappedId = campaign.id === 'campaign1' ? 'fb-camp-1' : 
                                            campaign.id === 'campaign2' ? 'fb-camp-2' : 
                                            campaign.id === 'campaign3' ? 'fb-camp-3' : null;
                            if (mappedId) setSelectedCampaignId(mappedId);
                          }}
                        >
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>{campaign.platform}</TableCell>
                          <TableCell>
                            <Badge className={campaign.status === 'active' ? 'bg-green-100 text-green-800' : 
                                            campaign.status === 'paused' ? 'bg-amber-100 text-amber-800' : 
                                            'bg-blue-100 text-blue-800'}>
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{campaignLeads.length}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {selectedCampaignId && (
              <FacebookAdStatsCard 
                stats={campaignStats} 
                isLoading={isLoadingStats} 
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Your Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientLeads.slice(0, 10).map(lead => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.firstName} {lead.lastName}</TableCell>
                      <TableCell>{formatDate(lead.dateAdded)}</TableCell>
                      <TableCell>{getCampaignName(lead.campaignId)}</TableCell>
                      <TableCell>
                        <Badge className={
                          lead.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                          lead.status === 'contacted' ? 'bg-indigo-100 text-indigo-800' :
                          lead.status === 'qualified' ? 'bg-purple-100 text-purple-800' :
                          lead.status === 'appointment_scheduled' ? 'bg-amber-100 text-amber-800' :
                          lead.status === 'closed_won' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {lead.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Lead Trends (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="leads" stroke="#1976d2" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDashboard;
