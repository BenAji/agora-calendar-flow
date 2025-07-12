import { Event } from '@/components/screens/EventManagementScreen';

export interface Conflict {
  eventId: string;
  eventTitle: string;
  conflictingEventId: string;
  conflictingEventTitle: string;
  conflictType: 'overlap' | 'adjacent' | 'travel_time';
  severity: 'high' | 'medium' | 'low';
  description: string;
}

export interface ConflictCheckResult {
  hasConflicts: boolean;
  conflicts: Conflict[];
  totalConflicts: number;
}

// Check for scheduling conflicts between events
export const detectConflicts = (events: Event[], userEmail?: string): ConflictCheckResult => {
  const conflicts: Conflict[] = [];
  
  // Filter events for the specific user if provided
  const userEvents = userEmail 
    ? events.filter(event => event.rsvps[userEmail])
    : events;

  // Sort events by date and time
  const sortedEvents = userEvents.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.startTime}`);
    const dateB = new Date(`${b.date} ${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });

  // Check for overlapping events
  for (let i = 0; i < sortedEvents.length; i++) {
    for (let j = i + 1; j < sortedEvents.length; j++) {
      const eventA = sortedEvents[i];
      const eventB = sortedEvents[j];
      
      // Skip if events are on different days
      if (eventA.date !== eventB.date) continue;
      
      const startA = new Date(`${eventA.date} ${eventA.startTime}`);
      const endA = new Date(`${eventA.date} ${eventA.endTime}`);
      const startB = new Date(`${eventB.date} ${eventB.startTime}`);
      const endB = new Date(`${eventB.date} ${eventB.endTime}`);
      
      // Check for overlap
      if (startA < endB && startB < endA) {
        const overlapMinutes = Math.min(endA.getTime(), endB.getTime()) - Math.max(startA.getTime(), startB.getTime());
        const overlapHours = overlapMinutes / (1000 * 60);
        
        const conflict: Conflict = {
          eventId: eventA.id,
          eventTitle: eventA.title,
          conflictingEventId: eventB.id,
          conflictingEventTitle: eventB.title,
          conflictType: 'overlap',
          severity: overlapHours > 1 ? 'high' : overlapHours > 0.5 ? 'medium' : 'low',
          description: `Events overlap by ${overlapHours.toFixed(1)} hours`
        };
        
        conflicts.push(conflict);
      }
      
      // Check for adjacent events (less than 30 minutes apart)
      const timeBetween = Math.abs(startB.getTime() - endA.getTime()) / (1000 * 60);
      if (timeBetween > 0 && timeBetween < 30) {
        const conflict: Conflict = {
          eventId: eventA.id,
          eventTitle: eventA.title,
          conflictingEventId: eventB.id,
          conflictingEventTitle: eventB.title,
          conflictType: 'adjacent',
          severity: timeBetween < 15 ? 'high' : 'medium',
          description: `Events are ${timeBetween.toFixed(0)} minutes apart`
        };
        
        conflicts.push(conflict);
      }
      
      // Check for travel time conflicts (different locations)
      if (eventA.location !== eventB.location && 
          eventA.location !== 'Virtual' && 
          eventB.location !== 'Virtual') {
        const timeBetween = Math.abs(startB.getTime() - endA.getTime()) / (1000 * 60);
        if (timeBetween < 60) { // Less than 1 hour between events at different locations
          const conflict: Conflict = {
            eventId: eventA.id,
            eventTitle: eventA.title,
            conflictingEventId: eventB.id,
            conflictingEventTitle: eventB.title,
            conflictType: 'travel_time',
            severity: 'medium',
            description: `Insufficient travel time between ${eventA.location} and ${eventB.location}`
          };
          
          conflicts.push(conflict);
        }
      }
    }
  }

  return {
    hasConflicts: conflicts.length > 0,
    conflicts,
    totalConflicts: conflicts.length
  };
};

// Get conflict summary for dashboard
export const getConflictSummary = (events: Event[], userEmail?: string) => {
  const result = detectConflicts(events, userEmail);
  
  const highConflicts = result.conflicts.filter(c => c.severity === 'high').length;
  const mediumConflicts = result.conflicts.filter(c => c.severity === 'medium').length;
  const lowConflicts = result.conflicts.filter(c => c.severity === 'low').length;
  
  return {
    total: result.totalConflicts,
    high: highConflicts,
    medium: mediumConflicts,
    low: lowConflicts,
    hasConflicts: result.hasConflicts
  };
};

// Check if a specific event has conflicts
export const getEventConflicts = (event: Event, allEvents: Event[]): Conflict[] => {
  const conflicts: Conflict[] = [];
  
  for (const otherEvent of allEvents) {
    if (otherEvent.id === event.id) continue;
    
    // Skip if events are on different days
    if (event.date !== otherEvent.date) continue;
    
    const startA = new Date(`${event.date} ${event.startTime}`);
    const endA = new Date(`${event.date} ${event.endTime}`);
    const startB = new Date(`${otherEvent.date} ${otherEvent.startTime}`);
    const endB = new Date(`${otherEvent.date} ${otherEvent.endTime}`);
    
    // Check for overlap
    if (startA < endB && startB < endA) {
      const overlapMinutes = Math.min(endA.getTime(), endB.getTime()) - Math.max(startA.getTime(), startB.getTime());
      const overlapHours = overlapMinutes / (1000 * 60);
      
      conflicts.push({
        eventId: event.id,
        eventTitle: event.title,
        conflictingEventId: otherEvent.id,
        conflictingEventTitle: otherEvent.title,
        conflictType: 'overlap',
        severity: overlapHours > 1 ? 'high' : overlapHours > 0.5 ? 'medium' : 'low',
        description: `Conflicts with ${otherEvent.title} (overlap: ${overlapHours.toFixed(1)}h)`
      });
    }
  }
  
  return conflicts;
}; 