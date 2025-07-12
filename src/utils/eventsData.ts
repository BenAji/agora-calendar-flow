import { CalendarEvent, EventType } from '@/components/AgoraCalendar';

// Shared events data for July and August 2025 with conflicts
export const sharedEvents: CalendarEvent[] = [
    // July 2025 Events
    {
      id: '1',
      title: 'Q2 Earnings Call',
      company: 'Apple Inc.',
      type: 'earnings',
      date: '2025-07-15',
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      location: 'Virtual',
      marketCap: 'Large Cap',
      description: 'Second quarter earnings conference call',
      rsvps: {
        'analyst.manager@company.com': 'accepted',
        'investment.analyst@company.com': 'tentative'
      }
    },
    {
      id: '2',
      title: 'Analyst Meeting',
      company: 'Microsoft Corp.',
      type: 'meeting',
      date: '2025-07-15', // CONFLICT: Same day as Apple earnings
      startTime: '10:30 AM',
      endTime: '11:30 AM',
      location: 'Seattle, WA',
      marketCap: 'Large Cap',
      description: 'One-on-one analyst meeting',
      rsvps: {
        'analyst.manager@company.com': 'accepted'
      }
    },
    {
      id: '3',
      title: 'Roadshow Presentation',
      company: 'Tesla Inc.',
      type: 'roadshow',
      date: '2025-07-18',
      startTime: '11:30 AM',
      endTime: '12:30 PM',
      location: 'New York, NY',
      marketCap: 'Large Cap',
      description: 'Investor roadshow presentation',
      rsvps: {
        'investment.analyst@company.com': 'declined'
      }
    },
    {
      id: '4',
      title: 'Conference Call',
      company: 'Amazon.com Inc.',
      type: 'conference',
      date: '2025-07-22',
      startTime: '9:00 AM',
      endTime: '10:00 AM',
      location: 'Virtual',
      marketCap: 'Large Cap',
      description: 'Annual conference call',
      rsvps: {}
    },
    {
      id: '5',
      title: 'Earnings Call',
      company: 'Google LLC',
      type: 'earnings',
      date: '2025-07-16',
      startTime: '4:00 PM',
      endTime: '5:00 PM',
      location: 'Virtual',
      marketCap: 'Large Cap',
      description: 'Q2 earnings conference call',
      rsvps: {}
    },
    {
      id: '6',
      title: 'Analyst Briefing',
      company: 'Meta Platforms',
      type: 'meeting',
      date: '2025-07-17',
      startTime: '1:00 PM',
      endTime: '2:00 PM',
      location: 'Menlo Park, CA',
      marketCap: 'Large Cap',
      description: 'Product strategy briefing',
      rsvps: {}
    },
    {
      id: '7',
      title: 'Investor Day',
      company: 'Netflix Inc.',
      type: 'conference',
      date: '2025-07-19',
      startTime: '10:00 AM',
      endTime: '3:00 PM',
      location: 'Los Gatos, CA',
      marketCap: 'Large Cap',
      description: 'Annual investor day presentation',
      rsvps: {}
    },
    {
      id: '8',
      title: 'Q2 Earnings Call',
      company: 'NVIDIA Corp.',
      type: 'earnings',
      date: '2025-07-17', // CONFLICT: Same day as Meta briefing
      startTime: '1:30 PM',
      endTime: '2:30 PM',
      location: 'Virtual',
      marketCap: 'Large Cap',
      description: 'Second quarter earnings call',
      rsvps: {}
    },
    {
      id: '9',
      title: 'Analyst Meeting',
      company: 'Salesforce Inc.',
      type: 'meeting',
      date: '2025-07-25',
      startTime: '2:00 PM',
      endTime: '3:00 PM',
      location: 'San Francisco, CA',
      marketCap: 'Large Cap',
      description: 'Quarterly analyst meeting',
      rsvps: {}
    },
    {
      id: '10',
      title: 'Roadshow Presentation',
      company: 'Adobe Inc.',
      type: 'roadshow',
      date: '2025-07-28',
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      location: 'San Jose, CA',
      marketCap: 'Large Cap',
      description: 'Product roadshow presentation',
      rsvps: {}
    },
    {
      id: '11',
      title: 'Conference Call',
      company: 'Oracle Corp.',
      type: 'conference',
      date: '2025-07-28', // CONFLICT: Same day as Adobe roadshow
      startTime: '10:30 AM',
      endTime: '11:30 AM',
      location: 'Virtual',
      marketCap: 'Large Cap',
      description: 'Quarterly conference call',
      rsvps: {}
    },
    // August 2025 Events
    {
      id: '12',
      title: 'Q2 Earnings Call',
      company: 'Apple Inc.',
      type: 'earnings',
      date: '2025-08-05',
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      location: 'Virtual',
      marketCap: 'Large Cap',
      description: 'Second quarter earnings conference call',
      rsvps: {}
    },
    {
      id: '13',
      title: 'Analyst Meeting',
      company: 'Microsoft Corp.',
      type: 'meeting',
      date: '2025-08-08',
      startTime: '2:00 PM',
      endTime: '3:30 PM',
      location: 'Seattle, WA',
      marketCap: 'Large Cap',
      description: 'One-on-one analyst meeting',
      rsvps: {}
    },
    {
      id: '14',
      title: 'Roadshow Presentation',
      company: 'Tesla Inc.',
      type: 'roadshow',
      date: '2025-08-12',
      startTime: '11:30 AM',
      endTime: '12:30 PM',
      location: 'New York, NY',
      marketCap: 'Large Cap',
      description: 'Investor roadshow presentation',
      rsvps: {}
    },
    {
      id: '15',
      title: 'Conference Call',
      company: 'Amazon.com Inc.',
      type: 'conference',
      date: '2025-08-15',
      startTime: '9:00 AM',
      endTime: '10:00 AM',
      location: 'Virtual',
      marketCap: 'Large Cap',
      description: 'Annual conference call',
      rsvps: {}
    },
    {
      id: '16',
      title: 'Earnings Call',
      company: 'Google LLC',
      type: 'earnings',
      date: '2025-08-06',
      startTime: '4:00 PM',
      endTime: '5:00 PM',
      location: 'Virtual',
      marketCap: 'Large Cap',
      description: 'Q2 earnings conference call',
      rsvps: {}
    },
    {
      id: '17',
      title: 'Analyst Briefing',
      company: 'Meta Platforms',
      type: 'meeting',
      date: '2025-08-07',
      startTime: '1:00 PM',
      endTime: '2:00 PM',
      location: 'Menlo Park, CA',
      marketCap: 'Large Cap',
      description: 'Product strategy briefing',
      rsvps: {}
    },
    {
      id: '18',
      title: 'Investor Day',
      company: 'Netflix Inc.',
      type: 'conference',
      date: '2025-08-14',
      startTime: '10:00 AM',
      endTime: '3:00 PM',
      location: 'Los Gatos, CA',
      marketCap: 'Large Cap',
      description: 'Annual investor day presentation',
      rsvps: {}
    },
    {
      id: '19',
      title: 'Q2 Earnings Call',
      company: 'NVIDIA Corp.',
      type: 'earnings',
      date: '2025-08-07', // CONFLICT: Same day as Meta briefing
      startTime: '1:30 PM',
      endTime: '2:30 PM',
      location: 'Virtual',
      marketCap: 'Large Cap',
      description: 'Second quarter earnings call',
      rsvps: {}
    },
    {
      id: '20',
      title: 'Analyst Meeting',
      company: 'Salesforce Inc.',
      type: 'meeting',
      date: '2025-08-20',
      startTime: '2:00 PM',
      endTime: '3:00 PM',
      location: 'San Francisco, CA',
      marketCap: 'Large Cap',
      description: 'Quarterly analyst meeting',
      rsvps: {}
    },
    {
      id: '21',
      title: 'Roadshow Presentation',
      company: 'Adobe Inc.',
      type: 'roadshow',
      date: '2025-08-25',
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      location: 'San Jose, CA',
      marketCap: 'Large Cap',
      description: 'Product roadshow presentation',
      rsvps: {}
    },
    {
      id: '22',
      title: 'Conference Call',
      company: 'Oracle Corp.',
      type: 'conference',
      date: '2025-08-25', // CONFLICT: Same day as Adobe roadshow
      startTime: '10:30 AM',
      endTime: '11:30 AM',
      location: 'Virtual',
      marketCap: 'Large Cap',
      description: 'Quarterly conference call',
      rsvps: {}
    },
    {
      id: '23',
      title: 'Earnings Call',
      company: 'Intel Corp.',
      type: 'earnings',
      date: '2025-08-08', // CONFLICT: Same day as Microsoft meeting
      startTime: '2:30 PM',
      endTime: '3:30 PM',
      location: 'Virtual',
      marketCap: 'Large Cap',
      description: 'Q2 earnings conference call',
      rsvps: {}
    },
    {
      id: '24',
      title: 'Analyst Briefing',
      company: 'AMD Inc.',
      type: 'meeting',
      date: '2025-08-12', // CONFLICT: Same day as Tesla roadshow
      startTime: '11:00 AM',
      endTime: '12:00 PM',
      location: 'Santa Clara, CA',
      marketCap: 'Large Cap',
      description: 'Product strategy briefing',
      rsvps: {}
    }
];

// Helper function to detect conflicts
export const detectConflicts = (events: CalendarEvent[]): CalendarEvent[][] => {
  const conflicts: CalendarEvent[][] = [];
  
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const event1 = events[i];
      const event2 = events[j];
      
      // Check if events are on the same day
      if (event1.date === event2.date) {
        // Check for time overlap
        const start1 = new Date(`2025-01-01 ${event1.startTime}`);
        const end1 = new Date(`2025-01-01 ${event1.endTime}`);
        const start2 = new Date(`2025-01-01 ${event2.startTime}`);
        const end2 = new Date(`2025-01-01 ${event2.endTime}`);
        
        if (start1 < end2 && start2 < end1) {
          conflicts.push([event1, event2]);
        }
      }
    }
  }
  
  return conflicts;
};

// Helper function to get conflict summary
export const getConflictSummary = (events: CalendarEvent[]) => {
  const conflicts = detectConflicts(events);
  return {
    total: conflicts.length,
    hasConflicts: conflicts.length > 0,
    conflicts: conflicts
  };
}; 