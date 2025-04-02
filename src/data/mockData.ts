
import { Campaign, Lead, LeadStatus, CommunicationMethod, Client } from '../types/crm';
import { format, subDays, addDays } from 'date-fns';

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// Generate clients
export const clients: Client[] = [
  {
    id: 'westside',
    name: 'Westside Dental Clinic',
    email: 'contact@westsidedental.example.com',
    clinics: ['Westside Dental'],
    dateAdded: new Date(2023, 3, 15),
    status: 'active'
  },
  {
    id: 'downtown',
    name: 'Downtown Dental Group',
    email: 'info@downtowndental.example.com',
    clinics: ['Downtown Dental Clinic'],
    dateAdded: new Date(2023, 2, 10),
    status: 'active'
  }
];

// Generate campaigns
export const campaigns: Campaign[] = [
  {
    id: 'campaign1',
    name: 'Summer Dental Promotion',
    platform: 'facebook',
    startDate: new Date(2023, 5, 1),
    budget: 5000,
    status: 'active',
    clientId: 'westside'
  },
  {
    id: 'campaign2',
    name: 'Back to School Check-ups',
    platform: 'instagram',
    startDate: new Date(2023, 7, 15),
    endDate: new Date(2023, 8, 15),
    budget: 3500,
    status: 'completed',
    clientId: 'downtown'
  },
  {
    id: 'campaign3',
    name: 'Holiday Teeth Whitening',
    platform: 'facebook',
    startDate: new Date(2023, 11, 1),
    budget: 7500,
    status: 'active',
    clientId: 'westside'
  },
  {
    id: 'campaign4',
    name: 'Westside Spring Special',
    platform: 'facebook',
    startDate: new Date(2023, 2, 1),
    budget: 4200,
    status: 'active',
    clientId: 'westside'
  },
  {
    id: 'campaign5',
    name: 'Westside Family Plan Promo',
    platform: 'instagram',
    startDate: new Date(2023, 9, 1),
    budget: 3800,
    status: 'active',
    clientId: 'westside'
  }
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
      clinic: 'Westside Dental',
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
      clinic: 'Downtown Dental Clinic',
      notes: 'Completed procedure',
      reminderSent: true,
      calendarEventId: 'calendar-event-123',
    },
    notes: 'Successfully completed treatment, scheduled follow-up in 6 months',
  },
  // Additional leads for Westside Dental
  {
    id: 'lead6',
    firstName: 'Sarah',
    lastName: 'Miller',
    email: 'sarah.miller@example.com',
    phone: '555-333-7777',
    campaignId: 'campaign4',
    status: 'qualified',
    source: 'Facebook Ad',
    dateAdded: subDays(new Date(), 8),
    lastContacted: subDays(new Date(), 1),
    communicationHistory: [
      createCommunicationHistory('phone', 5),
      createCommunicationHistory('email', 1),
    ],
    notes: 'Interested in dental implants, has insurance',
  },
  {
    id: 'lead7',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@example.com',
    phone: '555-222-8888',
    campaignId: 'campaign3',
    status: 'contacted',
    source: 'Facebook Ad',
    dateAdded: subDays(new Date(), 12),
    lastContacted: subDays(new Date(), 2),
    communicationHistory: [
      createCommunicationHistory('phone', 8),
    ],
    notes: 'Asked about teeth whitening options',
  },
  {
    id: 'lead8',
    firstName: 'Jennifer',
    lastName: 'Garcia',
    email: 'jennifer.garcia@example.com',
    phone: '555-444-9999',
    campaignId: 'campaign4',
    status: 'appointment_scheduled',
    source: 'Facebook Ad',
    dateAdded: subDays(new Date(), 18),
    lastContacted: subDays(new Date(), 2),
    communicationHistory: [
      createCommunicationHistory('phone', 10),
      createCommunicationHistory('whatsapp', 6),
      createCommunicationHistory('email', 2),
    ],
    appointmentInfo: {
      id: generateId(),
      date: addDays(new Date(), 5),
      clinic: 'Westside Dental',
      notes: 'Family checkup - 4 people',
      reminderSent: true,
    },
    notes: 'Scheduled family appointment, needs insurance verification',
  },
  {
    id: 'lead9',
    firstName: 'Thomas',
    lastName: 'Anderson',
    email: 'thomas.anderson@example.com',
    phone: '555-777-1234',
    campaignId: 'campaign5',
    status: 'closed_won',
    source: 'Instagram Ad',
    dateAdded: subDays(new Date(), 45),
    lastContacted: subDays(new Date(), 10),
    communicationHistory: [
      createCommunicationHistory('email', 35),
      createCommunicationHistory('phone', 25),
      createCommunicationHistory('phone', 15),
      createCommunicationHistory('whatsapp', 10),
    ],
    appointmentInfo: {
      id: generateId(),
      date: subDays(new Date(), 8),
      clinic: 'Westside Dental',
      notes: 'Completed family plan signup',
      reminderSent: true,
      calendarEventId: 'calendar-event-456',
    },
    notes: 'Successfully signed up for annual family plan, scheduled next checkup',
  },
  {
    id: 'lead10',
    firstName: 'Jessica',
    lastName: 'Martinez',
    email: 'jessica.martinez@example.com',
    phone: '555-888-5555',
    campaignId: 'campaign5',
    status: 'new',
    source: 'Instagram Ad',
    dateAdded: subDays(new Date(), 2),
    communicationHistory: [],
    notes: 'Showed interest in teeth whitening special',
  }
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

// Get campaigns by client ID
export const getCampaignsByClientId = (clientId: string): Campaign[] => {
  return campaigns.filter(campaign => campaign.clientId === clientId);
};

// Get client by ID
export const getClientById = (clientId: string): Client | undefined => {
  return clients.find(client => client.id === clientId);
};

// Get leads by client ID
export const getLeadsByClientId = (clientId: string): Lead[] => {
  const clientCampaigns = getCampaignsByClientId(clientId);
  return leads.filter(lead => clientCampaigns.some(campaign => campaign.id === lead.campaignId));
};

// Generate array of all available clinics
export const clinics = [
  'Downtown Dental Clinic',
  'Westside Dental',
  'North Hills Medical Center',
  'Southgate Family Dentistry',
  'Central City Healthcare'
];
