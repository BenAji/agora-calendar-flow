import Papa from 'papaparse';
import { Event, EventType } from '@/components/screens/EventManagementScreen';

export interface CSVEvent {
  title: string;
  company: string;
  type: EventType;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  marketCap: string;
  description?: string;
}

export interface CSVRSVP {
  eventId: string;
  eventTitle: string;
  attendeeEmail: string;
  attendeeName: string;
  response: 'accepted' | 'declined' | 'tentative';
  responseDate: string;
}

// Import events from CSV
export const importEventsFromCSV = (csvText: string): Promise<CSVEvent[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
          return;
        }
        
        const events: CSVEvent[] = results.data.map((row: any) => ({
          title: row.title || '',
          company: row.company || '',
          type: (row.type as EventType) || 'meeting',
          date: row.date || '',
          startTime: row.startTime || '',
          endTime: row.endTime || '',
          location: row.location || '',
          marketCap: row.marketCap || '',
          description: row.description || ''
        }));
        
        resolve(events);
      },
      error: (error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`));
      }
    });
  });
};

// Export events to CSV
export const exportEventsToCSV = (events: Event[]): string => {
  const csvData = events.map(event => ({
    title: event.title,
    company: event.company,
    type: event.type,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location,
    marketCap: event.marketCap,
    description: event.description || '',
    status: event.status,
    createdBy: event.createdBy,
    createdAt: event.createdAt
  }));
  
  return Papa.unparse(csvData);
};

// Export RSVPs to CSV
export const exportRSVPsToCSV = (event: Event): string => {
  const rsvpData: CSVRSVP[] = Object.entries(event.rsvps).map(([email, response]) => ({
    eventId: event.id,
    eventTitle: event.title,
    attendeeEmail: email,
    attendeeName: email.split('@')[0], // Simple name extraction
    response: response,
    responseDate: new Date().toISOString().split('T')[0]
  }));
  
  return Papa.unparse(rsvpData);
};

// Download CSV file
export const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Validate CSV structure
export const validateEventCSV = (csvText: string): Promise<{ isValid: boolean; errors: string[] }> => {
  const errors: string[] = [];
  
  return new Promise((resolve) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length === 0) {
          errors.push('CSV file is empty');
        }
        
        const requiredFields = ['title', 'company', 'type', 'date', 'startTime', 'endTime', 'location'];
        const headers = results.meta.fields || [];
        
        requiredFields.forEach(field => {
          if (!headers.includes(field)) {
            errors.push(`Missing required field: ${field}`);
          }
        });
        
        // Validate data rows
        results.data.forEach((row: any, index: number) => {
          if (!row.title) errors.push(`Row ${index + 1}: Missing title`);
          if (!row.company) errors.push(`Row ${index + 1}: Missing company`);
          if (!row.date) errors.push(`Row ${index + 1}: Missing date`);
          if (!row.startTime) errors.push(`Row ${index + 1}: Missing start time`);
          if (!row.endTime) errors.push(`Row ${index + 1}: Missing end time`);
          
          // Validate event type
          const validTypes = ['earnings', 'meeting', 'conference', 'roadshow'];
          if (row.type && !validTypes.includes(row.type)) {
            errors.push(`Row ${index + 1}: Invalid event type '${row.type}'`);
          }
        });
        
        resolve({ isValid: errors.length === 0, errors });
      },
      error: (error) => {
        resolve({ isValid: false, errors: [`CSV parsing failed: ${error.message}`] });
      }
    });
  });
}; 