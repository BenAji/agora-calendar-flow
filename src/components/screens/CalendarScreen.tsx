import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NavigationHeader } from '../common/NavigationHeader';
import { RSVPModal } from '../modals/RSVPModal';
import { 
  Calendar as CalendarIcon, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users
} from 'lucide-react';
import { User, Event, Screen } from '../AgoraCalendar';

interface CalendarScreenProps {
  currentUser: User;
  events: Event[];
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  onEventUpdate: (event: Event) => void;
  onEventCreate: (event: Omit<Event, 'id'>) => void;
  onEventDelete: (eventId: string) => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  currentUser,
  events,
  onNavigate,
  onLogout,
  onEventUpdate,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewType, setViewType] = useState<'week' | 'month'>('week');
  const [sortBy, setSortBy] = useState<'alphabetical' | 'market-cap'>('alphabetical');
  const [currentWeek, setCurrentWeek] = useState(0);

  // Mock company data for sorting
  const companies = [
    { name: 'Apple Inc.', marketCap: 3000, color: 'earnings' },
    { name: 'Microsoft Corp.', marketCap: 2800, color: 'roadshow' },
    { name: 'Tesla Inc.', marketCap: 800, color: 'conference' },
    { name: 'Amazon.com Inc.', marketCap: 1500, color: 'meeting' },
    { name: 'Google LLC', marketCap: 1700, color: 'earnings' },
  ].sort((a, b) => 
    sortBy === 'alphabetical' 
      ? a.name.localeCompare(b.name)
      : b.marketCap - a.marketCap
  );

  const getWeekDays = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (currentWeek * 7));
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getEventsForDateAndCompany = (date: Date, company: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => 
      event.date === dateStr && event.company === company
    );
  };

  const handleEventClick = (event: Event) => {
    if (currentUser.role !== 'ir-admin') {
      setSelectedEvent(event);
    }
  };

  const handleRSVP = (eventId: string, response: 'accepted' | 'declined' | 'tentative') => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      const updatedEvent = {
        ...event,
        rsvps: {
          ...event.rsvps,
          [currentUser.id]: response
        }
      };
      onEventUpdate(updatedEvent);
    }
    setSelectedEvent(null);
  };

  const weekDays = getWeekDays();

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        currentUser={currentUser} 
        currentScreen="calendar"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Controls */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Calendar View</h1>
            <p className="text-muted-foreground">Analyst Calendar View</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="market-cap">Market Cap</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentWeek(currentWeek - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentWeek(0)}
              >
                Today
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentWeek(currentWeek + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card className="shadow-medium">
          <CardContent className="p-0">
            {/* Calendar Header */}
            <div className="grid grid-cols-8 bg-grid-header border-b border-grid-line">
              <div className="p-3 border-r border-grid-line">
                <div className="text-sm font-semibold text-foreground">Companies</div>
              </div>
              {weekDays.map((day, index) => (
                <div key={index} className="p-3 border-r border-grid-line last:border-r-0 text-center">
                  <div className="text-xs text-muted-foreground">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="max-h-[600px] overflow-y-auto">
              {companies.map((company, companyIndex) => (
                <div key={company.name} className="grid grid-cols-8 border-b border-grid-line last:border-b-0">
                  {/* Company Name */}
                  <div className="p-3 border-r border-grid-line bg-muted/20 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">{company.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ${company.marketCap}B market cap
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      company.color === 'earnings' ? 'bg-earnings' :
                      company.color === 'roadshow' ? 'bg-roadshow' :
                      company.color === 'conference' ? 'bg-conference' :
                      'bg-meeting'
                    }`} />
                  </div>

                  {/* Days */}
                  {weekDays.map((day, dayIndex) => {
                    const dayEvents = getEventsForDateAndCompany(day, company.name);
                    return (
                      <div key={dayIndex} className="p-2 border-r border-grid-line last:border-r-0 min-h-[80px]">
                        <div className="space-y-1">
                          {dayEvents.map((event) => (
                            <button
                              key={event.id}
                              onClick={() => handleEventClick(event)}
                              className={`w-full p-2 rounded text-left text-xs transition-smooth hover:shadow-soft ${
                                event.type === 'earnings' ? 'bg-earnings/20 border border-earnings/30' :
                                event.type === 'roadshow' ? 'bg-roadshow/20 border border-roadshow/30' :
                                event.type === 'conference' ? 'bg-conference/20 border border-conference/30' :
                                'bg-meeting/20 border border-meeting/30'
                              }`}
                            >
                              <div className="font-medium text-foreground truncate">
                                {event.title}
                              </div>
                              <div className="text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {event.startTime}
                              </div>
                              {currentUser.role === 'analyst-manager' && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  Assign
                                </Badge>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-earnings" />
                <span className="text-sm">Earnings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-roadshow" />
                <span className="text-sm">Roadshow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-conference" />
                <span className="text-sm">Conference</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-meeting" />
                <span className="text-sm">Meeting</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RSVP Modal */}
      {selectedEvent && (
        <RSVPModal
          event={selectedEvent}
          currentUser={currentUser}
          onClose={() => setSelectedEvent(null)}
          onRSVP={handleRSVP}
        />
      )}
    </div>
  );
};