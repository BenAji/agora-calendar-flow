import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { officeService, OfficeCalendarEvent, OfficeServiceConfig } from '@/services/officeService';

interface OfficeContextType {
  isOfficeAvailable: boolean;
  isInitialized: boolean;
  officeContext: 'desktop' | 'web' | 'mobile' | 'unknown';
  currentUserEmail: string | null;
  getCalendarEvents: (startDate: Date, endDate: Date) => Promise<OfficeCalendarEvent[]>;
  createCalendarEvent: (event: Omit<OfficeCalendarEvent, 'id'>) => Promise<string | null>;
  updateCalendarEvent: (eventId: string, event: Partial<OfficeCalendarEvent>) => Promise<boolean>;
  deleteCalendarEvent: (eventId: string) => Promise<boolean>;
  getSelectedDateRange: () => Promise<{ start: Date; end: Date } | null>;
  navigateToDate: (date: Date) => Promise<void>;
  showNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => Promise<void>;
  initialize: (config?: OfficeServiceConfig) => Promise<void>;
}

const OfficeContext = createContext<OfficeContextType | undefined>(undefined);

interface OfficeProviderProps {
  children: ReactNode;
  config?: OfficeServiceConfig;
}

export const OfficeProvider: React.FC<OfficeProviderProps> = ({ children, config }) => {
  const [isOfficeAvailable, setIsOfficeAvailable] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [officeContext, setOfficeContext] = useState<'desktop' | 'web' | 'mobile' | 'unknown'>('unknown');
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  // Initialize Office.js on component mount
  useEffect(() => {
    const initializeOffice = async () => {
      try {
        await officeService.initialize(config);
        setIsInitialized(true);
        setIsOfficeAvailable(officeService.isOfficeAvailable());
        setOfficeContext(officeService.getOfficeContext());
        
        // Get current user email if Office is available
        if (officeService.isOfficeAvailable()) {
          const email = await officeService.getCurrentUserEmail();
          setCurrentUserEmail(email);
        }
      } catch (error) {
        console.error('Failed to initialize Office.js:', error);
        setIsInitialized(true);
        setIsOfficeAvailable(false);
      }
    };

    initializeOffice();
  }, [config]);

  const getCalendarEvents = async (startDate: Date, endDate: Date): Promise<OfficeCalendarEvent[]> => {
    return officeService.getCalendarEvents(startDate, endDate);
  };

  const createCalendarEvent = async (event: Omit<OfficeCalendarEvent, 'id'>): Promise<string | null> => {
    return officeService.createCalendarEvent(event);
  };

  const updateCalendarEvent = async (eventId: string, event: Partial<OfficeCalendarEvent>): Promise<boolean> => {
    return officeService.updateCalendarEvent(eventId, event);
  };

  const deleteCalendarEvent = async (eventId: string): Promise<boolean> => {
    return officeService.deleteCalendarEvent(eventId);
  };

  const getSelectedDateRange = async (): Promise<{ start: Date; end: Date } | null> => {
    return officeService.getSelectedDateRange();
  };

  const navigateToDate = async (date: Date): Promise<void> => {
    return officeService.navigateToDate(date);
  };

  const showNotification = async (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): Promise<void> => {
    return officeService.showNotification(message, type);
  };

  const initialize = async (config?: OfficeServiceConfig): Promise<void> => {
    return officeService.initialize(config);
  };

  const value: OfficeContextType = {
    isOfficeAvailable,
    isInitialized,
    officeContext,
    currentUserEmail,
    getCalendarEvents,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    getSelectedDateRange,
    navigateToDate,
    showNotification,
    initialize
  };

  return (
    <OfficeContext.Provider value={value}>
      {children}
    </OfficeContext.Provider>
  );
};

export const useOffice = (): OfficeContextType => {
  const context = useContext(OfficeContext);
  if (context === undefined) {
    throw new Error('useOffice must be used within an OfficeProvider');
  }
  return context;
}; 