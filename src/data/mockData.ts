
import { Campaign, Lead, LeadStatus, CommunicationMethod } from '../types/crm';
import { format, subDays, addDays } from 'date-fns';

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// Generate campaigns
export const campaigns: Campaign[] = [
  {
    id: 'campaign1',
    name: 'Summer Dental Promotion',
    platform: 'facebook',
    startDate: new Date(2023, 5, 1),
    budget: 5000,
    status: 'active',
  },
  {
    id: 'campaign2',
    name: 'Back to School Check-ups',
    platform: 'instagram',
    startDate: new Date(2023, 7, 15),
    endDate: new Date(2023, 8, 15),
    budget: 3500,
    status: 'completed',
  },
  {
    id: 'campaign3',
    name: 'Holiday Teeth Whitening',
    platform: 'facebook',
    startDate: new Date(2023, 11, 1),
    budget: 7500,
    status: 'active',
  },
];

// Communication history factory
const createCommunicationHistory = (method: CommunicationMethod, daysAgo: number) => ({
  id: generateId(),
  date: subDays(new Date(), daysAgo),
  method,
  notes: `Discussed our services and offerings`,
  outcome: 'Interested, follow up required',
});

// Generate leads
export const leads: Lead[] = [
  {
    id: 'lead1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    campaignId: 'campaign1',
    status: 'new',
    source: 'Facebook Ad',
    dateAdded: subDays(new Date(), 5),
    communicationHistory: [],
    notes: 'Interested in teeth whitening services',
  },
  {
    id: 'lead2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    campaignId: 'campaign1',
    status: 'contacted',
    source: 'Facebook Ad',
    dateAdded: subDays(new Date(), 10),
    lastContacted: subDays(new Date(), 3),
    communicationHistory: [
      createCommunicationHistory('phone', 3),
    ],
    notes: 'Requested more information about dental implants',
  },
  {
    id: 'lead3',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@example.com',
    phone: '555-456-7890',
    campaignId: 'campaign2',
    status: 'qualified',
    source: 'Instagram Ad',
    dateAdded: subDays(new Date(), 15),
    lastContacted: subDays(new Date(), 2),
    communicationHistory: [
      createCommunicationHistory('phone', 7),
      createCommunicationHistory('email', 2),
    ],
    notes: 'Has insurance coverage, interested in family dental plans',
  },
  {
    id: 'lead4',
    firstName: 'Emily',
    lastName: 'Williams',
    email: 'emily.williams@example.com',
    phone: '555-789-0123',
    campaignId: 'campaign3',
    status: 'appointment_scheduled',
    source: 'Facebook Ad',
    dateAdded: subDays(new Date(), 20),
    lastContacted: subDays(new Date(), 1),
    communicationHistory: [
      createCommunicationHistory('phone', 10),
      createCommunicationHistory('whatsapp', 5),
      createCommunicationHistory('phone', 1),
    ],
    appointmentInfo: {
      id: generateId(),
      date: addDays(new Date(), 3),
      clinic: 'Downtown Dental Clinic',
      notes: 'Initial consultation',
      reminderSent: false,
    },
    notes: 'Ready for initial consultation, confirmed appointment',
  },
  {
    id: 'lead5',
    firstName: 'Robert',
    lastName: 'Brown',
    email: 'robert.brown@example.com',
    phone: '555-234-5678',
    campaignId: 'campaign2',
    status: 'closed_won',
    source: 'Instagram Ad',
    dateAdded: subDays(new Date(), 30),
    lastContacted: subDays(new Date(), 5),
    communicationHistory: [
      createCommunicationHistory('email', 20),
      createCommunicationHistory('phone', 15),
      createCommunicationHistory('whatsapp', 10),
      createCommunicationHistory('phone', 5),
    ],
    appointmentInfo: {
      id: generateId(),
      date: subDays(new Date(), 2),
      clinic: 'Westside Dental',
      notes: 'Completed procedure',
      reminderSent: true,
      calendarEventId: 'calendar-event-123',
    },
    notes: 'Successfully completed treatment, scheduled follow-up in 6 months',
  },
];

// Get leads filtered by campaign
export const getLeadsByCampaign = (campaignId: string): Lead[] => {
  return leads.filter(lead => lead.campaignId === campaignId);
};

// Get lead by ID
export const getLeadById = (leadId: string): Lead | undefined => {
  return leads.find(lead => lead.id === leadId);
};

// Get campaign by ID
export const getCampaignById = (campaignId: string): Campaign | undefined => {
  return campaigns.find(campaign => campaign.id === campaignId);
};

// Generate array of all available clinics
export const clinics = [
  'Downtown Dental Clinic',
  'Westside Dental',
  'North Hills Medical Center',
  'Southgate Family Dentistry',
  'Central City Healthcare'
];
