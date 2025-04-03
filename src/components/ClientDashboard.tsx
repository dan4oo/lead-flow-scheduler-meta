
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  campaigns, 
  leads, 
  clients, 
  getCampaignsByClientId, 
  getLeadsByClientId,
  getLeadsByCampaign 
} from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, subDays } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getFacebookAdStats } from '@/services/FacebookAdsService';
import FacebookAdStatsCard from './FacebookAdStats';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { LeadStatus } from '@/types/crm';
import { Button } from '@/components/ui/button';
import { UserCircle, Users } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const ClientDashboard = () => {
  // In a real app, this would come from auth context
  // For this demo, we're using the clientId from localStorage
  const [clientId, setClientId] = useState('westside');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedCampaignLeads, setSelectedCampaignLeads] = useState<any[]>([]);
  
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
  
  // Update selected campaign leads when campaign changes
  useEffect(() => {
    if (selectedCampaignId) {
      const campaignMapping = {
        'campaign1': 'fb-camp-1',
        'campaign2': 'fb-camp-2',
        'campaign3': 'fb-camp-3',
      };
      
      // Find the original campaign ID from the Facebook campaign ID
      const originalCampaignId = Object.entries(campaignMapping).find(
        ([, fbId]) => fbId === selectedCampaignId
      )?.[0];
      
      if (originalCampaignId) {
        const campaignLeads = getLeadsByCampaign(originalCampaignId);
        setSelectedCampaignLeads(campaignLeads);
      }
    }
  }, [selectedCampaignId]);
  
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

  // Generate lead status distribution data
  const generateLeadStatusData = (leadsData) => {
    const statusCounts = {
      new: 0,
      contacted: 0,
      qualified: 0,
      appointment_scheduled: 0,
      closed_won: 0,
      closed_lost: 0
    };
    
    leadsData.forEach(lead => {
      statusCounts[lead.status]++;
    });
    
    // Filter out statuses with 0 count to prevent rendering issues
    return Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: count,
        status
      }));
  };

  const allLeadsStatusData = generateLeadStatusData(clientLeads);
  
  // Generate selected campaign lead status data
  const selectedLeadsStatusData = generateLeadStatusData(selectedCampaignLeads);

  // Colors for charts
  const COLORS = ['#1976d2', '#009688', '#ff9800', '#f44336', '#9c27b0', '#673ab7'];
  const STATUS_COLORS = {
    new: '#3b82f6',
    contacted: '#8b5cf6', 
    qualified: '#10b981',
    appointment_scheduled: '#f59e0b',
    closed_won: '#22c55e',
    closed_lost: '#ef4444'
  };

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

  // Calculate appointments by campaign
  const appointmentsByCampaign = clientCampaigns.map(campaign => {
    const campaignLeads = clientLeads.filter(lead => lead.campaignId === campaign.id);
    const appointmentsCount = campaignLeads.filter(lead => 
      lead.status === 'appointment_scheduled' || lead.status === 'closed_won'
    ).length;
    
    return {
      name: campaign.name,
      appointments: appointmentsCount,
      count: campaignLeads.length,
      appointmentRate: campaignLeads.length ? Math.round((appointmentsCount / campaignLeads.length) * 100) : 0
    };
  });

  // Calculate billing information
  const getCurrentMonth = () => {
    const date = new Date();
    return format(date, 'MMMM yyyy');
  };

  const calculateBilling = () => {
    let totalSpend = 0;
    let totalLeads = 0;
    let totalAppointments = 0;
    
    clientCampaigns.forEach(campaign => {
      const fbCampaignId = campaign.id === 'campaign1' ? 'fb-camp-1' : 
                           campaign.id === 'campaign2' ? 'fb-camp-2' : 
                           campaign.id === 'campaign3' ? 'fb-camp-3' : null;
      
      // In a real app, we would fetch this data from the Facebook API
      if (fbCampaignId) {
        const stats = {
          'fb-camp-1': { spend: 1037.29, leads: 32 },
          'fb-camp-2': { spend: 642.72, leads: 15 },
          'fb-camp-3': { spend: 1487.7, leads: 41 }
        }[fbCampaignId];
        
        if (stats) {
          totalSpend += stats.spend;
          totalLeads += stats.leads;
        }
      }
      
      // Count appointments
      const campaignLeads = clientLeads.filter(lead => lead.campaignId === campaign.id);
      totalAppointments += campaignLeads.filter(lead => 
        lead.status === 'appointment_scheduled' || lead.status === 'closed_won'
      ).length;
    });
    
    const costPerLead = totalLeads ? (totalSpend / totalLeads).toFixed(2) : 0;
    const costPerAppointment = totalAppointments ? (totalSpend / totalAppointments).toFixed(2) : 0;
    
    return {
      totalSpend,
      totalLeads,
      totalAppointments,
      costPerLead,
      costPerAppointment,
      month: getCurrentMonth()
    };
  };

  const billingInfo = calculateBilling();

  // Handle client account switch
  const handleClientSwitch = (newClientId: string) => {
    setClientId(newClientId);
    setSelectedCampaignId(null);
    setSelectedCampaignLeads([]);
  };

  // Custom PieChart renderer to prevent rendering issues with empty data
  const SafePieChart = ({ data, dataKey, nameKey, children, ...props }) => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No data available</p>
        </div>
      );
    }

    return (
      <PieChart {...props}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          label={({name, percent}) => 
            percent > 0 ? `${name} (${(percent * 100).toFixed(0)}%)` : null
          }
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={STATUS_COLORS[entry.status] || COLORS[index % COLORS.length]} 
            />
          ))}
        </Pie>
        <RechartsTooltip />
      </PieChart>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{client?.name || 'Client'} Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your campaign performance dashboard</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Switch Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Select Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {clients.map(clientOption => (
              <DropdownMenuItem
                key={clientOption.id}
                onClick={() => handleClientSwitch(clientOption.id)}
                className={clientId === clientOption.id ? "bg-accent text-accent-foreground" : ""}
              >
                <Users className="mr-2 h-4 w-4" />
                {clientOption.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
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
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <p className="text-sm text-muted-foreground">Click on a campaign bar to view detailed Facebook metrics</p>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <CampaignBarChart />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Lead Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <SafePieChart
                      data={allLeadsStatusData}
                      dataKey="value"
                      nameKey="name"
                    />
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {selectedCampaignId && (
              <div className="col-span-1 md:col-span-2 mt-6">
                <FacebookAdStatsCard 
                  stats={campaignStats} 
                  isLoading={isLoadingStats} 
                />
              </div>
            )}
            
            {selectedCampaignId && selectedCampaignLeads.length > 0 && (
              <div className="col-span-1 md:col-span-2 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Lead Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <SafePieChart
                            data={selectedLeadsStatusData}
                            dataKey="value"
                            nameKey="name"
                          />
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Campaign Leads</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedCampaignLeads.slice(0, 5).map(lead => (
                              <TableRow key={lead.id}>
                                <TableCell>{lead.firstName} {lead.lastName}</TableCell>
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
                        {selectedCampaignLeads.length > 5 && (
                          <p className="text-sm text-center mt-2 text-muted-foreground">
                            Showing 5 of {selectedCampaignLeads.length} leads
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
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
                      <TableHead>Appointments</TableHead>
                      <TableHead>Appointment Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientCampaigns.map(campaign => {
                      const campaignData = appointmentsByCampaign.find(c => c.name === campaign.name);
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
                          <TableCell>{campaignData?.count || 0}</TableCell>
                          <TableCell>{campaignData?.appointments || 0}</TableCell>
                          <TableCell>{campaignData?.appointmentRate || 0}%</TableCell>
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
            
            {selectedCampaignId && selectedCampaignLeads.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Lead Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <SafePieChart
                          data={selectedLeadsStatusData}
                          dataKey="value"
                          nameKey="name"
                        />
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Campaign Leads</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedCampaignLeads.slice(0, 5).map(lead => (
                            <TableRow key={lead.id}>
                              <TableCell>{lead.firstName} {lead.lastName}</TableCell>
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
                      {selectedCampaignLeads.length > 5 && (
                        <p className="text-sm text-center mt-2 text-muted-foreground">
                          Showing 5 of {selectedCampaignLeads.length} leads
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
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
        
        <TabsContent value="billing">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Billing Period</CardTitle>
                <p className="text-sm text-muted-foreground">{billingInfo.month}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Total Ad Spend</p>
                      <p className="text-2xl font-bold">${billingInfo.totalSpend.toFixed(2)}</p>
                    </div>
                    
                    <div className="bg-muted rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Total Leads</p>
                      <p className="text-2xl font-bold">{billingInfo.totalLeads}</p>
                    </div>
                    
                    <div className="bg-muted rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Cost Per Lead</p>
                      <p className="text-2xl font-bold">${billingInfo.costPerLead}</p>
                    </div>
                    
                    <div className="bg-muted rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Cost Per Appointment</p>
                      <p className="text-2xl font-bold">${billingInfo.costPerAppointment}</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded-md p-4">
                    <p className="text-sm text-muted-foreground">Total Appointments</p>
                    <p className="text-2xl font-bold">{billingInfo.totalAppointments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Billing Breakdown by Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Spend</TableHead>
                      <TableHead>Leads</TableHead>
                      <TableHead>Cost/Lead</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientCampaigns.map(campaign => {
                      const fbCampaignId = campaign.id === 'campaign1' ? 'fb-camp-1' : 
                                           campaign.id === 'campaign2' ? 'fb-camp-2' : 
                                           campaign.id === 'campaign3' ? 'fb-camp-3' : null;
                      
                      const stats = fbCampaignId ? {
                        'fb-camp-1': { spend: 1037.29, leads: 32 },
                        'fb-camp-2': { spend: 642.72, leads: 15 },
                        'fb-camp-3': { spend: 1487.7, leads: 41 }
                      }[fbCampaignId] : null;
                      
                      return (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>${stats?.spend.toFixed(2) || '0.00'}</TableCell>
                          <TableCell>{stats?.leads || 0}</TableCell>
                          <TableCell>
                            ${stats?.leads ? (stats.spend / stats.leads).toFixed(2) : '0.00'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDashboard;
