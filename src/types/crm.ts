
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'appointment_scheduled' | 'closed_won' | 'closed_lost';

export type CommunicationMethod = 'phone' | 'email' | 'whatsapp';

export type CommunicationHistory = {
  id: string;
  date: Date;
  method: CommunicationMethod;
  notes: string;
  outcome: string;
};

export type Appointment = {
  id: string;
  date: Date;
  clinic: string;
  notes: string;
  calendarEventId?: string;
  reminderSent: boolean;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  clinics: string[];
  dateAdded: Date;
  status: 'active' | 'inactive';
};

export type Campaign = {
  id: string;
  name: string;
  platform: 'facebook' | 'instagram' | 'google' | 'other';
  startDate: Date;
  endDate?: Date;
  budget: number;
  status: 'active' | 'paused' | 'completed';
  clientId: string;
};

export type Lead = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  campaignId: string;
  status: LeadStatus;
  source: string;
  dateAdded: Date;
  lastContacted?: Date;
  communicationHistory: CommunicationHistory[];
  appointmentInfo?: Appointment;
  notes: string;
};
