
import { Appointment } from '@/types/crm';

/**
 * This is a mock service that simulates Google Calendar integration.
 * In a real application, this would use the Google Calendar API.
 */
export class GoogleCalendarService {
  /**
   * Checks if the user is authenticated with Google Calendar
   */
  static isAuthenticated(): boolean {
    // In a real app, check if we have valid OAuth credentials
    return localStorage.getItem('google_calendar_token') !== null;
  }
  
  /**
   * Authenticate with Google Calendar (mock)
   */
  static authenticate(): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        localStorage.setItem('google_calendar_token', 'mock_token_' + Date.now());
        resolve(true);
      }, 1000);
    });
  }
  
  /**
   * Create a new calendar event
   */
  static createEvent(appointment: Appointment, leadName: string): Promise<string> {
    return new Promise((resolve) => {
      if (!this.isAuthenticated()) {
        throw new Error('Not authenticated with Google Calendar');
      }
      
      // Simulate API call
      setTimeout(() => {
        // In a real app, this would create an actual Google Calendar event
        const eventId = 'event_' + Date.now();
        console.log('Created calendar event:', {
          summary: `Appointment with ${leadName}`,
          location: appointment.clinic,
          description: appointment.notes,
          start: appointment.date,
          end: new Date(appointment.date.getTime() + 60 * 60 * 1000), // 1 hour later
        });
        
        resolve(eventId);
      }, 1500);
    });
  }
  
  /**
   * Update an existing calendar event
   */
  static updateEvent(eventId: string, appointment: Appointment, leadName: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isAuthenticated()) {
        throw new Error('Not authenticated with Google Calendar');
      }
      
      // Simulate API call
      setTimeout(() => {
        console.log('Updated calendar event:', eventId, {
          summary: `Appointment with ${leadName}`,
          location: appointment.clinic,
          description: appointment.notes,
          start: appointment.date,
          end: new Date(appointment.date.getTime() + 60 * 60 * 1000), // 1 hour later
        });
        
        resolve();
      }, 1000);
    });
  }
  
  /**
   * Delete a calendar event
   */
  static deleteEvent(eventId: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isAuthenticated()) {
        throw new Error('Not authenticated with Google Calendar');
      }
      
      // Simulate API call
      setTimeout(() => {
        console.log('Deleted calendar event:', eventId);
        resolve();
      }, 800);
    });
  }
}
