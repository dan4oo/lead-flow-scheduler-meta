
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { campaigns, leads } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const ClientDashboard = () => {
  // Filter data for the specific client (in a real app, you'd filter by client ID)
  // For this example, we'll use the first campaign as the client's campaign
  const clientId = "acme"; // This would be dynamic in a real app
  const clientCampaigns = campaigns.filter(campaign => campaign.id.includes(clientId));
  const clientLeads = leads.filter(lead => clientCampaigns.some(campaign => campaign.id === lead.campaignId));
  
  // Data transformation for lead status chart
  const statusCounts = clientLeads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: count
  }));

  // Data transformation for campaign performance
  const campaignLeadCounts = clientCampaigns.map(campaign => {
    const count = clientLeads.filter(lead => lead.campaignId === campaign.id).length;
    return {
      name: campaign.name,
      count
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

  // Colors for the pie chart
  const COLORS = ['#1976d2', '#009688', '#ff9800', '#f44336', '#9c27b0', '#673ab7'];

  // Format date for display
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clientLeads.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Appointment Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{appointmentRate}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{conversionRate}%</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
          <TabsTrigger value="leads">Recent Leads</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignLeadCounts}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="campaigns">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
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
                        <TableRow key={campaign.id}>
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
            
            <Card>
              <CardHeader>
                <CardTitle>Lead Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientLeads.slice(0, 10).map(lead => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.firstName} {lead.lastName}</TableCell>
                      <TableCell>{formatDate(lead.dateAdded)}</TableCell>
                      <TableCell>{lead.source}</TableCell>
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
      </Tabs>
    </div>
  );
};

export default ClientDashboard;
