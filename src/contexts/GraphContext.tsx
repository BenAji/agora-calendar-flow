import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { graphService, GraphCalendarEvent, GraphUser, GraphConflict } from '@/services/graphService';
import { useAuth } from './AuthContext';

interface GraphContextType {
  // Calendar Events
  getCalendarEvents: (startDate: Date, endDate: Date, calendarId?: string) => Promise<GraphCalendarEvent[]>;
  createCalendarEvent: (event: Omit<GraphCalendarEvent, 'id'>, calendarId?: string) => Promise<GraphCalendarEvent>;
  updateCalendarEvent: (eventId: string, updates: Partial<GraphCalendarEvent>, calendarId?: string) => Promise<GraphCalendarEvent>;
  deleteCalendarEvent: (eventId: string, calendarId?: string) => Promise<void>;
  
  // User Management
  getCurrentUser: () => Promise<GraphUser>;
  getManager: () => Promise<GraphUser | null>;
  getDirectReports: () => Promise<GraphUser[]>;
  getProfilePhoto: () => Promise<string | null>;
  
  // Conflict Detection
  detectConflicts: (startTime: Date, endTime: Date, excludeEventId?: string) => Promise<GraphConflict[]>;
  findFreeTime: (startDate: Date, endDate: Date, durationMinutes?: number) => Promise<Array<{ start: Date; end: Date }>>;
  
  // Availability
  getAvailability: (startTime: Date, endTime: Date, attendees?: string[]) => Promise<any>;
  
  // Calendars
  getCalendars: () => Promise<Array<{ id: string; name: string; color: string; isDefaultCalendar: boolean }>>;
  
  // Mail
  getMessages: (top?: number, filter?: string) => Promise<any[]>;
  sendEmail: (toRecipients: string[], subject: string, body: string, isHtml?: boolean) => Promise<void>;
  
  // State
  isLoading: boolean;
  error: string | null;
  isGraphAvailable: boolean;
  clearError: () => void;
}

const GraphContext = createContext<GraphContextType | undefined>(undefined);

interface GraphProviderProps {
  children: ReactNode;
}

export const GraphProvider: React.FC<GraphProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGraphAvailable, setIsGraphAvailable] = useState(false);

  // Check Graph API availability when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setIsGraphAvailable(true);
    } else {
      setIsGraphAvailable(false);
    }
  }, [isAuthenticated, user]);

  const clearError = () => {
    setError(null);
  };

  const handleGraphOperation = async <T,>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    if (!isGraphAvailable) {
      throw new Error('Microsoft Graph API is not available. Please ensure you are authenticated.');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await operation();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to ${operationName}`;
      setError(errorMessage);
      console.error(`Graph API Error (${operationName}):`, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Calendar Events
  const getCalendarEvents = async (startDate: Date, endDate: Date, calendarId: string = 'primary') => {
    return handleGraphOperation(
      () => graphService.getCalendarEvents(startDate, endDate, calendarId),
      'get calendar events'
    );
  };

  const createCalendarEvent = async (event: Omit<GraphCalendarEvent, 'id'>, calendarId: string = 'primary') => {
    return handleGraphOperation(
      () => graphService.createCalendarEvent(event, calendarId),
      'create calendar event'
    );
  };

  const updateCalendarEvent = async (eventId: string, updates: Partial<GraphCalendarEvent>, calendarId: string = 'primary') => {
    return handleGraphOperation(
      () => graphService.updateCalendarEvent(eventId, updates, calendarId),
      'update calendar event'
    );
  };

  const deleteCalendarEvent = async (eventId: string, calendarId: string = 'primary') => {
    return handleGraphOperation(
      () => graphService.deleteCalendarEvent(eventId, calendarId),
      'delete calendar event'
    );
  };

  // User Management
  const getCurrentUser = async () => {
    return handleGraphOperation(
      () => graphService.getCurrentUser(),
      'get current user'
    );
  };

  const getManager = async () => {
    return handleGraphOperation(
      () => graphService.getManager(),
      'get manager'
    );
  };

  const getDirectReports = async () => {
    return handleGraphOperation(
      () => graphService.getDirectReports(),
      'get direct reports'
    );
  };

  const getProfilePhoto = async () => {
    return handleGraphOperation(
      () => graphService.getProfilePhoto(),
      'get profile photo'
    );
  };

  // Conflict Detection
  const detectConflicts = async (startTime: Date, endTime: Date, excludeEventId?: string) => {
    return handleGraphOperation(
      () => graphService.detectConflicts(startTime, endTime, excludeEventId),
      'detect conflicts'
    );
  };

  const findFreeTime = async (startDate: Date, endDate: Date, durationMinutes: number = 60) => {
    return handleGraphOperation(
      () => graphService.findFreeTime(startDate, endDate, durationMinutes),
      'find free time'
    );
  };

  // Availability
  const getAvailability = async (startTime: Date, endTime: Date, attendees: string[] = []) => {
    return handleGraphOperation(
      () => graphService.getAvailability(startTime, endTime, attendees),
      'get availability'
    );
  };

  // Calendars
  const getCalendars = async () => {
    return handleGraphOperation(
      () => graphService.getCalendars(),
      'get calendars'
    );
  };

  // Mail
  const getMessages = async (top: number = 10, filter?: string) => {
    return handleGraphOperation(
      () => graphService.getMessages(top, filter),
      'get messages'
    );
  };

  const sendEmail = async (toRecipients: string[], subject: string, body: string, isHtml: boolean = true) => {
    return handleGraphOperation(
      () => graphService.sendEmail(toRecipients, subject, body, isHtml),
      'send email'
    );
  };

  const value: GraphContextType = {
    // Calendar Events
    getCalendarEvents,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    
    // User Management
    getCurrentUser,
    getManager,
    getDirectReports,
    getProfilePhoto,
    
    // Conflict Detection
    detectConflicts,
    findFreeTime,
    
    // Availability
    getAvailability,
    
    // Calendars
    getCalendars,
    
    // Mail
    getMessages,
    sendEmail,
    
    // State
    isLoading,
    error,
    isGraphAvailable,
    clearError,
  };

  return (
    <GraphContext.Provider value={value}>
      {children}
    </GraphContext.Provider>
  );
};

export const useGraph = (): GraphContextType => {
  const context = useContext(GraphContext);
  if (context === undefined) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
}; 