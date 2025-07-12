// Office.js types are available globally when running in Office environment
// We'll use a conditional import approach

export interface OfficeCalendarEvent {
  id: string;
  subject: string;
  start: Date;
  end: Date;
  location?: string;
  body?: string;
  attendees?: string[];
  isAllDay: boolean;
  categories?: string[];
}

export interface OfficeServiceConfig {
  clientId: string;
  redirectUri: string;
}

// Declare Office as a global variable
declare global {
  interface Window {
    Office?: any;
  }
}

class OfficeService {
  private isInitialized = false;
  private config: OfficeServiceConfig | null = null;

  /**
   * Initialize Office.js for the Outlook Add-in
   */
  async initialize(config?: OfficeServiceConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Check if we're running in Office
        if (typeof window.Office === 'undefined') {
          console.warn('Office.js not available - running in standalone mode');
          this.isInitialized = true;
          resolve();
          return;
        }

        // Initialize Office.js
        window.Office.onReady((info: any) => {
          console.log('Office.js initialized:', info);
          this.isInitialized = true;
          this.config = config || null;
          resolve();
        });

        // Handle initialization errors
        window.Office.onReady(() => {
          // This will be called if Office.js is already ready
          this.isInitialized = true;
          this.config = config || null;
          resolve();
        });
      } catch (error) {
        console.error('Failed to initialize Office.js:', error);
        reject(error);
      }
    });
  }

  /**
   * Check if Office.js is available and initialized
   */
  isOfficeAvailable(): boolean {
    return typeof window.Office !== 'undefined' && this.isInitialized;
  }

  /**
   * Get the current user's email from Outlook
   */
  async getCurrentUserEmail(): Promise<string | null> {
    if (!this.isOfficeAvailable()) {
      return null;
    }

    return new Promise((resolve) => {
      window.Office.context.mailbox.getUserIdentityTokenAsync((result: any) => {
        if (result.status === window.Office.AsyncResultStatus.Succeeded) {
          // Parse the token to get user info
          try {
            const token = result.value;
            // In a real implementation, you would decode the JWT token
            // For now, we'll return a placeholder
            resolve('user@outlook.com');
          } catch (error) {
            console.error('Failed to parse user token:', error);
            resolve(null);
          }
        } else {
          console.error('Failed to get user identity token:', result.error);
          resolve(null);
        }
      });
    });
  }

  /**
   * Get calendar events from Outlook
   */
  async getCalendarEvents(startDate: Date, endDate: Date): Promise<OfficeCalendarEvent[]> {
    if (!this.isOfficeAvailable()) {
      console.warn('Office.js not available - returning empty events');
      return [];
    }

    return new Promise((resolve) => {
      // In a real implementation, you would use the Microsoft Graph API
      // to get calendar events. For now, we'll return mock data
      const mockEvents: OfficeCalendarEvent[] = [
        {
          id: '1',
          subject: 'Q4 Earnings Call',
          start: new Date('2025-01-15T10:00:00'),
          end: new Date('2025-01-15T11:00:00'),
          location: 'Virtual',
          body: 'Fourth quarter earnings conference call',
          attendees: ['analyst1@company.com', 'analyst2@company.com'],
          isAllDay: false,
          categories: ['earnings']
        },
        {
          id: '2',
          subject: 'Analyst Meeting',
          start: new Date('2025-01-15T10:30:00'),
          end: new Date('2025-01-15T11:30:00'),
          location: 'Seattle, WA',
          body: 'One-on-one analyst meeting',
          attendees: ['analyst.manager@company.com'],
          isAllDay: false,
          categories: ['meeting']
        }
      ];

      resolve(mockEvents);
    });
  }

  /**
   * Create a calendar event in Outlook
   */
  async createCalendarEvent(event: Omit<OfficeCalendarEvent, 'id'>): Promise<string | null> {
    if (!this.isOfficeAvailable()) {
      console.warn('Office.js not available - cannot create event');
      return null;
    }

    return new Promise((resolve) => {
      // In a real implementation, you would use the Microsoft Graph API
      // to create calendar events. For now, we'll return a mock ID
      const eventId = `event_${Date.now()}`;
      console.log('Created calendar event:', eventId, event);
      resolve(eventId);
    });
  }

  /**
   * Update a calendar event in Outlook
   */
  async updateCalendarEvent(eventId: string, event: Partial<OfficeCalendarEvent>): Promise<boolean> {
    if (!this.isOfficeAvailable()) {
      console.warn('Office.js not available - cannot update event');
      return false;
    }

    return new Promise((resolve) => {
      // In a real implementation, you would use the Microsoft Graph API
      // to update calendar events
      console.log('Updated calendar event:', eventId, event);
      resolve(true);
    });
  }

  /**
   * Delete a calendar event from Outlook
   */
  async deleteCalendarEvent(eventId: string): Promise<boolean> {
    if (!this.isOfficeAvailable()) {
      console.warn('Office.js not available - cannot delete event');
      return false;
    }

    return new Promise((resolve) => {
      // In a real implementation, you would use the Microsoft Graph API
      // to delete calendar events
      console.log('Deleted calendar event:', eventId);
      resolve(true);
    });
  }

  /**
   * Get the current selected date range from Outlook calendar
   */
  async getSelectedDateRange(): Promise<{ start: Date; end: Date } | null> {
    if (!this.isOfficeAvailable()) {
      return null;
    }

    return new Promise((resolve) => {
      // In a real implementation, you would get the selected date range
      // from the Outlook calendar view
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
      
      resolve({ start, end });
    });
  }

  /**
   * Navigate to a specific date in Outlook calendar
   */
  async navigateToDate(date: Date): Promise<void> {
    if (!this.isOfficeAvailable()) {
      console.warn('Office.js not available - cannot navigate to date');
      return;
    }

    return new Promise((resolve) => {
      // In a real implementation, you would use Office.js APIs
      // to navigate to a specific date in the calendar
      console.log('Navigating to date:', date);
      resolve();
    });
  }

  /**
   * Get the current Outlook context (desktop, web, mobile)
   */
  getOfficeContext(): 'desktop' | 'web' | 'mobile' | 'unknown' {
    if (!this.isOfficeAvailable()) {
      return 'unknown';
    }

    try {
      const platform = window.Office.context.platform;
      switch (platform) {
        case window.Office.PlatformType.PC:
          return 'desktop';
        case window.Office.PlatformType.OfficeOnline:
          return 'web';
        case window.Office.PlatformType.Mac:
          return 'desktop';
        default:
          return 'unknown';
      }
    } catch (error) {
      console.error('Failed to get Office context:', error);
      return 'unknown';
    }
  }

  /**
   * Show a notification in Outlook
   */
  async showNotification(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): Promise<void> {
    if (!this.isOfficeAvailable()) {
      console.log(`[${type.toUpperCase()}] ${message}`);
      return;
    }

    return new Promise((resolve) => {
      // In a real implementation, you would use Office.js notification APIs
      console.log(`Office notification [${type}]: ${message}`);
      resolve();
    });
  }
}

// Export a singleton instance
export const officeService = new OfficeService(); 