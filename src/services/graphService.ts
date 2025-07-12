import { msalService } from './msalService';

export interface GraphCalendarEvent {
  id: string;
  subject: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: {
    displayName: string;
  };
  body?: {
    content: string;
    contentType: string;
  };
  attendees?: Array<{
    emailAddress: {
      address: string;
      name: string;
    };
    status: {
      response: 'none' | 'organizer' | 'tentativelyAccepted' | 'accepted' | 'declined' | 'notResponded';
    };
  }>;
  isAllDay: boolean;
  categories?: string[];
  showAs: 'free' | 'tentative' | 'busy' | 'oof' | 'workingElsewhere';
  importance: 'low' | 'normal' | 'high';
  sensitivity: 'normal' | 'personal' | 'private' | 'confidential';
  recurrence?: any;
  seriesMasterId?: string;
  type: 'singleInstance' | 'occurrence' | 'exception' | 'seriesMaster';
}

export interface GraphUser {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
  jobTitle?: string;
  department?: string;
  companyName?: string;
  officeLocation?: string;
  businessPhones?: string[];
  mobilePhone?: string;
}

export interface GraphConflict {
  eventId: string;
  subject: string;
  startTime: string;
  endTime: string;
  conflictType: 'overlap' | 'adjacent' | 'travel_time';
  severity: 'low' | 'medium' | 'high';
}

export interface GraphServiceConfig {
  baseUrl: string;
  defaultTimeZone: string;
  maxEventsPerRequest: number;
}

class GraphService {
  private config: GraphServiceConfig;
  private baseUrl: string;

  constructor(config?: Partial<GraphServiceConfig>) {
    this.config = {
      baseUrl: 'https://graph.microsoft.com/v1.0',
      defaultTimeZone: 'UTC',
      maxEventsPerRequest: 100,
      ...config,
    };
    this.baseUrl = this.config.baseUrl;
  }

  /**
   * Get access token for Microsoft Graph API
   */
  private async getAccessToken(): Promise<string> {
    const token = await msalService.getAccessTokenWithPopup([
      'User.Read',
      'Calendars.ReadWrite',
      'Mail.Read',
    ]);
    
    if (!token) {
      throw new Error('Failed to acquire access token for Microsoft Graph API');
    }
    
    return token;
  }

  /**
   * Make authenticated request to Microsoft Graph API
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Graph API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<GraphUser> {
    return this.makeRequest<GraphUser>('/me');
  }

  /**
   * Get user's calendar events
   */
  async getCalendarEvents(
    startDate: Date,
    endDate: Date,
    calendarId: string = 'primary'
  ): Promise<GraphCalendarEvent[]> {
    const startDateTime = startDate.toISOString();
    const endDateTime = endDate.toISOString();

    const queryParams = new URLSearchParams({
      $filter: `start/dateTime ge '${startDateTime}' and end/dateTime le '${endDateTime}'`,
      $orderby: 'start/dateTime',
      $top: this.config.maxEventsPerRequest.toString(),
      $select: 'id,subject,start,end,location,body,attendees,isAllDay,categories,showAs,importance,sensitivity,recurrence,seriesMasterId,type',
    });

    const endpoint = `/me/calendars/${calendarId}/events?${queryParams}`;
    const response = await this.makeRequest<{ value: GraphCalendarEvent[] }>(endpoint);
    
    return response.value;
  }

  /**
   * Create a new calendar event
   */
  async createCalendarEvent(
    event: Omit<GraphCalendarEvent, 'id'>,
    calendarId: string = 'primary'
  ): Promise<GraphCalendarEvent> {
    const endpoint = `/me/calendars/${calendarId}/events`;
    
    return this.makeRequest<GraphCalendarEvent>(endpoint, {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  /**
   * Update an existing calendar event
   */
  async updateCalendarEvent(
    eventId: string,
    updates: Partial<GraphCalendarEvent>,
    calendarId: string = 'primary'
  ): Promise<GraphCalendarEvent> {
    const endpoint = `/me/calendars/${calendarId}/events/${eventId}`;
    
    return this.makeRequest<GraphCalendarEvent>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Delete a calendar event
   */
  async deleteCalendarEvent(
    eventId: string,
    calendarId: string = 'primary'
  ): Promise<void> {
    const endpoint = `/me/calendars/${calendarId}/events/${eventId}`;
    
    await this.makeRequest(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * Get user's calendars
   */
  async getCalendars(): Promise<Array<{
    id: string;
    name: string;
    color: string;
    isDefaultCalendar: boolean;
  }>> {
    const response = await this.makeRequest<{ value: any[] }>('/me/calendars');
    
    return response.value.map(calendar => ({
      id: calendar.id,
      name: calendar.name,
      color: calendar.color || '#000000',
      isDefaultCalendar: calendar.isDefaultCalendar || false,
    }));
  }

  /**
   * Get user's availability for a time period
   */
  async getAvailability(
    startTime: Date,
    endTime: Date,
    attendees: string[] = []
  ): Promise<{
    scheduleId: string;
    availabilityView: string;
    scheduleItems: Array<{
      start: { dateTime: string; timeZone: string };
      end: { dateTime: string; timeZone: string };
      status: string;
    }>;
  }> {
    const requestBody = {
      schedules: attendees.length > 0 ? attendees : [await this.getCurrentUser().then(u => u.mail)],
      startTime: {
        dateTime: startTime.toISOString(),
        timeZone: this.config.defaultTimeZone,
      },
      endTime: {
        dateTime: endTime.toISOString(),
        timeZone: this.config.defaultTimeZone,
      },
      availabilityViewInterval: 30, // 30-minute intervals
    };

    return this.makeRequest('/me/calendar/getSchedule', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  /**
   * Detect scheduling conflicts
   */
  async detectConflicts(
    startTime: Date,
    endTime: Date,
    excludeEventId?: string
  ): Promise<GraphConflict[]> {
    try {
      // Get user's events for the time period
      const events = await this.getCalendarEvents(startTime, endTime);
      
      // Filter out the event being checked (if updating)
      const relevantEvents = excludeEventId 
        ? events.filter(event => event.id !== excludeEventId)
        : events;

      const conflicts: GraphConflict[] = [];

      // Check for overlapping events
      for (const event of relevantEvents) {
        const eventStart = new Date(event.start.dateTime);
        const eventEnd = new Date(event.end.dateTime);

        // Check for overlap
        if (eventStart < endTime && eventEnd > startTime) {
          const overlapStart = new Date(Math.max(startTime.getTime(), eventStart.getTime()));
          const overlapEnd = new Date(Math.min(endTime.getTime(), eventEnd.getTime()));
          const overlapMinutes = (overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60);

          if (overlapMinutes > 0) {
            conflicts.push({
              eventId: event.id,
              subject: event.subject,
              startTime: event.start.dateTime,
              endTime: event.end.dateTime,
              conflictType: 'overlap',
              severity: overlapMinutes > 30 ? 'high' : overlapMinutes > 15 ? 'medium' : 'low',
            });
          }
        }

        // Check for adjacent events (less than 15 minutes apart)
        const timeBetweenEvents = Math.abs(
          (eventStart.getTime() - endTime.getTime()) / (1000 * 60)
        );
        
        if (timeBetweenEvents > 0 && timeBetweenEvents < 15) {
          conflicts.push({
            eventId: event.id,
            subject: event.subject,
            startTime: event.start.dateTime,
            endTime: event.end.dateTime,
            conflictType: 'adjacent',
            severity: 'medium',
          });
        }
      }

      return conflicts;
    } catch (error) {
      console.error('Failed to detect conflicts:', error);
      return [];
    }
  }

  /**
   * Find free time slots
   */
  async findFreeTime(
    startDate: Date,
    endDate: Date,
    durationMinutes: number = 60,
    workDays: number[] = [1, 2, 3, 4, 5] // Monday to Friday
  ): Promise<Array<{ start: Date; end: Date }>> {
    try {
      const events = await this.getCalendarEvents(startDate, endDate);
      const freeSlots: Array<{ start: Date; end: Date }> = [];

      // Create a timeline of busy periods
      const busyPeriods = events
        .filter(event => !event.isAllDay)
        .map(event => ({
          start: new Date(event.start.dateTime),
          end: new Date(event.end.dateTime),
        }))
        .sort((a, b) => a.start.getTime() - b.start.getTime());

      // Find free slots between busy periods
      let currentTime = new Date(startDate);
      currentTime.setHours(9, 0, 0, 0); // Start at 9 AM

      const endTime = new Date(endDate);
      endTime.setHours(17, 0, 0, 0); // End at 5 PM

      while (currentTime < endTime) {
        // Skip weekends if specified
        if (!workDays.includes(currentTime.getDay())) {
          currentTime.setDate(currentTime.getDate() + 1);
          currentTime.setHours(9, 0, 0, 0);
          continue;
        }

        // Find the next busy period
        const nextBusyPeriod = busyPeriods.find(
          period => period.start > currentTime
        );

        const slotEnd = nextBusyPeriod 
          ? new Date(Math.min(nextBusyPeriod.start.getTime(), currentTime.getTime() + durationMinutes * 60 * 1000))
          : new Date(currentTime.getTime() + durationMinutes * 60 * 1000);

        // Check if we have enough time for the requested duration
        const slotDuration = (slotEnd.getTime() - currentTime.getTime()) / (1000 * 60);
        
        if (slotDuration >= durationMinutes) {
          freeSlots.push({
            start: new Date(currentTime),
            end: new Date(currentTime.getTime() + durationMinutes * 60 * 1000),
          });
        }

        // Move to next potential slot
        currentTime = nextBusyPeriod 
          ? new Date(nextBusyPeriod.end.getTime())
          : new Date(currentTime.getTime() + 60 * 60 * 1000); // Move forward by 1 hour
      }

      return freeSlots;
    } catch (error) {
      console.error('Failed to find free time:', error);
      return [];
    }
  }

  /**
   * Get user's mailbox messages
   */
  async getMessages(
    top: number = 10,
    filter?: string
  ): Promise<Array<{
    id: string;
    subject: string;
    from: { emailAddress: { address: string; name: string } };
    receivedDateTime: string;
    isRead: boolean;
  }>> {
    const queryParams = new URLSearchParams({
      $top: top.toString(),
      $orderby: 'receivedDateTime desc',
    });

    if (filter) {
      queryParams.append('$filter', filter);
    }

    const endpoint = `/me/messages?${queryParams}`;
    const response = await this.makeRequest<{ value: any[] }>(endpoint);
    
    return response.value.map(message => ({
      id: message.id,
      subject: message.subject,
      from: message.from,
      receivedDateTime: message.receivedDateTime,
      isRead: message.isRead,
    }));
  }

  /**
   * Send email
   */
  async sendEmail(
    toRecipients: string[],
    subject: string,
    body: string,
    isHtml: boolean = true
  ): Promise<void> {
    const message = {
      subject,
      body: {
        contentType: isHtml ? 'HTML' : 'Text',
        content: body,
      },
      toRecipients: toRecipients.map(email => ({
        emailAddress: {
          address: email,
        },
      })),
    };

    await this.makeRequest('/me/sendMail', {
      method: 'POST',
      body: JSON.stringify({
        message,
        saveToSentItems: true,
      }),
    });
  }

  /**
   * Get user's profile photo
   */
  async getProfilePhoto(): Promise<string | null> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${this.baseUrl}/me/photo/$value`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Failed to get profile photo:', error);
      return null;
    }
  }

  /**
   * Get user's manager
   */
  async getManager(): Promise<GraphUser | null> {
    try {
      return await this.makeRequest<GraphUser>('/me/manager');
    } catch (error) {
      console.error('Failed to get manager:', error);
      return null;
    }
  }

  /**
   * Get user's direct reports
   */
  async getDirectReports(): Promise<GraphUser[]> {
    try {
      const response = await this.makeRequest<{ value: GraphUser[] }>('/me/directReports');
      return response.value;
    } catch (error) {
      console.error('Failed to get direct reports:', error);
      return [];
    }
  }
}

// Export a singleton instance
export const graphService = new GraphService(); 