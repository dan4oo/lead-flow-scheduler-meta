
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { getLeadById, getCampaignById, clinics } from '@/data/mockData';
import { LeadStatus, CommunicationMethod } from '@/types/crm';
import { format } from 'date-fns';
import { Phone, Mail, MessageCircle, Calendar, User, Briefcase, Clock, MessageSquare, CalendarDays } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const statusColors: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-purple-100 text-purple-800',
  qualified: 'bg-green-100 text-green-800',
  appointment_scheduled: 'bg-amber-100 text-amber-800',
  closed_won: 'bg-emerald-100 text-emerald-800',
  closed_lost: 'bg-red-100 text-red-800'
};

const statusLabels: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  appointment_scheduled: 'Appointment Scheduled',
  closed_won: 'Closed (Won)',
  closed_lost: 'Closed (Lost)'
};

const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lead = getLeadById(id || '');
  const campaign = lead ? getCampaignById(lead.campaignId) : undefined;
  const { toast } = useToast();
  
  const [newStatus, setNewStatus] = useState<LeadStatus | ''>('');
  const [communicationDialogOpen, setCommunicationDialogOpen] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [communicationMethod, setCommunicationMethod] = useState<CommunicationMethod>('phone');
  const [communicationNotes, setCommunicationNotes] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentClinic, setAppointmentClinic] = useState(clinics[0]);
  const [appointmentNotes, setAppointmentNotes] = useState('');
  
  if (!lead) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Lead not found</h1>
        <Button onClick={() => navigate('/leads')}>Back to Leads</Button>
      </div>
    );
  }

  const handleStatusChange = (status: LeadStatus) => {
    setNewStatus(status);
    toast({
      title: "Status Updated",
      description: `Lead status changed to ${statusLabels[status]}`,
    });
  };

  const handleCommunicationSubmit = () => {
    setCommunicationDialogOpen(false);
    toast({
      title: "Communication Logged",
      description: `${communicationMethod} communication with ${lead.firstName} has been recorded`,
    });
    setCommunicationNotes('');
  };

  const handleAppointmentSubmit = () => {
    setAppointmentDialogOpen(false);
    toast({
      title: "Appointment Scheduled",
      description: `Appointment scheduled for ${appointmentDate} at ${appointmentTime}`,
    });
    // Reset the form
    setAppointmentDate('');
    setAppointmentTime('');
    setAppointmentNotes('');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/leads')}>
            Back
          </Button>
          <h1 className="text-3xl font-bold">
            {lead.firstName} {lead.lastName}
          </h1>
          <Badge variant="outline" className={statusColors[lead.status]}>
            {statusLabels[lead.status]}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Dialog open={communicationDialogOpen} onOpenChange={setCommunicationDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Log Communication</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Communication</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Method</label>
                  <Select value={communicationMethod} onValueChange={(value) => setCommunicationMethod(value as CommunicationMethod)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <Textarea 
                    value={communicationNotes} 
                    onChange={(e) => setCommunicationNotes(e.target.value)}
                    placeholder="Enter details about the communication"
                    rows={5}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setCommunicationDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCommunicationSubmit}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={appointmentDialogOpen} onOpenChange={setAppointmentDialogOpen}>
            <DialogTrigger asChild>
              <Button>Schedule Appointment</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Schedule Appointment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <Input 
                      type="date" 
                      value={appointmentDate} 
                      onChange={(e) => setAppointmentDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Time</label>
                    <Input 
                      type="time" 
                      value={appointmentTime} 
                      onChange={(e) => setAppointmentTime(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Clinic</label>
                  <Select value={appointmentClinic} onValueChange={setAppointmentClinic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select clinic" />
                    </SelectTrigger>
                    <SelectContent>
                      {clinics.map((clinic) => (
                        <SelectItem key={clinic} value={clinic}>{clinic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <Textarea 
                    value={appointmentNotes} 
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                    placeholder="Additional notes for the appointment"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setAppointmentDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAppointmentSubmit}>Schedule & Sync to Calendar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6 md:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="communication">Communication History</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <User size={18} className="text-gray-500" />
                        <h3 className="font-semibold">Personal Information</h3>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-500">Name:</span>
                          <p>{lead.firstName} {lead.lastName}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Email:</span>
                          <p>{lead.email}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Phone:</span>
                          <p>{lead.phone}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Briefcase size={18} className="text-gray-500" />
                        <h3 className="font-semibold">Campaign Information</h3>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-500">Campaign:</span>
                          <p>{campaign?.name || 'Unknown'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Source:</span>
                          <p>{lead.source}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Date Added:</span>
                          <p>{format(lead.dateAdded, 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={18} className="text-gray-500" />
                      <h3 className="font-semibold">Status Updates</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <Badge 
                          key={value} 
                          variant={lead.status === value ? "default" : "outline"}
                          className={`cursor-pointer ${lead.status === value ? 'bg-primary' : ''}`}
                          onClick={() => handleStatusChange(value as LeadStatus)}
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="communication" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Communication History</CardTitle>
                  <CardDescription>
                    All interactions with this lead
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {lead.communicationHistory.length > 0 ? (
                    <div className="space-y-4">
                      {lead.communicationHistory.map((communication, index) => (
                        <div key={index} className="flex gap-4 pb-4 border-b">
                          <div className="min-w-9 h-9 flex items-center justify-center rounded-full bg-primary/10">
                            {communication.method === 'phone' && <Phone size={16} className="text-primary" />}
                            {communication.method === 'email' && <Mail size={16} className="text-primary" />}
                            {communication.method === 'whatsapp' && <MessageCircle size={16} className="text-primary" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium capitalize">{communication.method}</p>
                              <p className="text-sm text-gray-500">
                                {format(communication.date, 'MMM d, yyyy h:mm a')}
                              </p>
                            </div>
                            <p className="mt-1">{communication.notes}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Outcome:</span> {communication.outcome}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="mx-auto h-10 w-10 opacity-20 mb-2" />
                      <p>No communication history yet</p>
                      <Button variant="outline" className="mt-4" onClick={() => setCommunicationDialogOpen(true)}>
                        Log First Communication
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appointments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Appointments</CardTitle>
                  <CardDescription>
                    Scheduled and past appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {lead.appointmentInfo ? (
                    <div className="space-y-4">
                      <div className="flex gap-4 p-4 border rounded-md">
                        <div className="min-w-9 h-9 flex items-center justify-center rounded-full bg-primary/10">
                          <Calendar size={16} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">{lead.appointmentInfo.clinic}</p>
                            <Badge variant={new Date() > lead.appointmentInfo.date ? 'outline' : 'default'}>
                              {new Date() > lead.appointmentInfo.date ? 'Completed' : 'Upcoming'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {format(lead.appointmentInfo.date, 'EEEE, MMMM d, yyyy h:mm a')}
                          </p>
                          <p className="mt-2">{lead.appointmentInfo.notes}</p>
                          {lead.appointmentInfo.calendarEventId && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Synced to Google Calendar</span>
                            </div>
                          )}
                          {!lead.appointmentInfo.reminderSent && new Date() < lead.appointmentInfo.date && (
                            <Button variant="outline" size="sm" className="mt-2">
                              Send Reminder
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarDays className="mx-auto h-10 w-10 opacity-20 mb-2" />
                      <p>No appointments scheduled yet</p>
                      <Button variant="outline" className="mt-4" onClick={() => setAppointmentDialogOpen(true)}>
                        Schedule Appointment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    defaultValue={lead.notes} 
                    placeholder="Add notes about this lead"
                    rows={8}
                    className="mb-4"
                  />
                  <div className="flex justify-end">
                    <Button onClick={() => {
                      toast({
                        title: "Notes Updated",
                        description: "Lead notes have been saved",
                      });
                    }}>
                      Save Notes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => setCommunicationDialogOpen(true)}
              >
                <Phone size={16} />
                Log Phone Call
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => {
                  setCommunicationMethod('email');
                  setCommunicationDialogOpen(true);
                }}
              >
                <Mail size={16} />
                Log Email
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => {
                  setCommunicationMethod('whatsapp');
                  setCommunicationDialogOpen(true);
                }}
              >
                <MessageCircle size={16} />
                Log WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => setAppointmentDialogOpen(true)}
              >
                <Calendar size={16} />
                Schedule Appointment
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100">
                  <Phone size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{lead.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100">
                  <Mail size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{lead.email}</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="secondary" className="flex-1 gap-1">
                  <Phone size={16} />
                  Call
                </Button>
                <Button variant="secondary" className="flex-1 gap-1">
                  <Mail size={16} />
                  Email
                </Button>
                <Button variant="secondary" className="flex-1 gap-1">
                  <MessageCircle size={16} />
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
