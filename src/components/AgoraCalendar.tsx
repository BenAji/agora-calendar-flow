import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, ChevronLeft, ChevronRight, Search, Filter, Users, Clock, MapPin } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, startOfMonth, endOfMonth, eachWeekOfInterval, isSameMonth, addMonths, subMonths, startOfQuarter, endOfQuarter, eachMonthOfInterval, isSameQuarter, addQuarters, subQuarters } from 'date-fns';
import { sharedEvents } from '@/utils/eventsData';

// Event types as specified in the development plan
export type EventType = 'earnings' | 'meeting' | 'conference' | 'roadshow';

export interface CalendarEvent {
  id: string;
  title: string;
  company: string;
  type: EventType;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  marketCap: string;
  description?: string;
  rsvps: Record<string, 'accepted' | 'declined' | 'tentative'>;
}

// Use shared events data
const mockEvents = sharedEvents;

type ViewType = 'quarter' | 'month' | 'week';

export const AgoraCalendar: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date('2025-07-01')); // Start with July 2025
  const [viewType, setViewType] = useState<ViewType>('month');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedMarketCap, setSelectedMarketCap] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [rsvpDialogOpen, setRsvpDialogOpen] = useState(false);

  const companies = useMemo(() => 
    Array.from(new Set(mockEvents.map(event => event.company))).sort(),
    []
  );

  const marketCaps = useMemo(() => 
    Array.from(new Set(mockEvents.map(event => event.marketCap))).sort(),
    []
  );

  const filteredEvents = useMemo(() => {
    return mockEvents.filter(event => {
      const matchesCompany = selectedCompany === 'all' || event.company === selectedCompany;
      const matchesMarketCap = selectedMarketCap === 'all' || event.marketCap === selectedMarketCap;
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCompany && matchesMarketCap && matchesSearch;
    });
  }, [selectedCompany, selectedMarketCap, searchTerm]);

  const getEventColor = (type: EventType) => {
    switch (type) {
      case 'earnings': return 'bg-green-600 text-white';
      case 'meeting': return 'bg-blue-600 text-white';
      case 'conference': return 'bg-purple-600 text-white';
      case 'roadshow': return 'bg-orange-600 text-white';
      default: return 'bg-primary text-white';
    }
  };

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'earnings': return '💰';
      case 'meeting': return '🤝';
      case 'conference': return '📞';
      case 'roadshow': return '🚗';
      default: return '📅';
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    switch (viewType) {
      case 'quarter':
        setCurrentDate(direction === 'next' ? addQuarters(currentDate, 1) : subQuarters(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
        break;
    }
  };

  const getCalendarDays = () => {
    switch (viewType) {
      case 'quarter':
        const quarterStart = startOfQuarter(currentDate);
        const quarterEnd = endOfQuarter(currentDate);
        return eachMonthOfInterval({ start: quarterStart, end: quarterEnd });
      case 'month':
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        return eachWeekOfInterval({ start: monthStart, end: monthEnd });
      case 'week':
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        return eachDayOfInterval({ start: weekStart, end: weekEnd });
      default:
        return [];
    }
  };

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => 
      isSameDay(new Date(event.date), date)
    );
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setRsvpDialogOpen(true);
  };

  const handleRSVP = (response: 'accepted' | 'declined' | 'tentative') => {
    if (selectedEvent && user) {
      // In a real app, this would update the backend
      console.log(`User ${user.email} RSVP'd ${response} to event ${selectedEvent.id}`);
    }
    setRsvpDialogOpen(false);
    setSelectedEvent(null);
  };

  const canAssignAnalysts = user?.role === 'Analyst Manager';

  // Only show week view for resource calendar
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Get all companies (sorted)
  const companyList = useMemo(() => {
    // For demo, get unique companies from filteredEvents
    return Array.from(new Set(filteredEvents.map(e => e.company)))
      .map(company => {
        const event = filteredEvents.find(e => e.company === company);
        return {
          name: company,
          marketCap: event?.marketCap || '',
        };
      });
  }, [filteredEvents]);

  // Helper to get event for a company on a date
  const getEventForCompanyAndDate = (company: string, date: Date) => {
    return filteredEvents.find(e => e.company === company && isSameDay(new Date(e.date), date));
  };

  return (
    <div className="space-y-6">
      {/* Header and filters (unchanged) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your scheduled events
          </p>
        </div>


        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium text-foreground min-w-[120px] text-center">
            {format(currentDate, viewType === 'quarter' ? 'QQQ yyyy' : 
                   viewType === 'month' ? 'MMMM yyyy' : 'MMM d, yyyy')}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">View</label>
              <Select value={viewType} onValueChange={(value) => setViewType(value as ViewType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company</label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="All companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All companies</SelectItem>
                  {companies.map(company => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Market Cap</label>
              <Select value={selectedMarketCap} onValueChange={setSelectedMarketCap}>
                <SelectTrigger>
                  <SelectValue placeholder="All market caps" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All market caps</SelectItem>
                  {marketCaps.map(marketCap => (
                    <SelectItem key={marketCap} value={marketCap}>{marketCap}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Type Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            {(['earnings', 'meeting', 'conference', 'roadshow'] as EventType[]).map(type => (
              <div key={type} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getEventColor(type)}`} />
                <span className="text-sm text-muted-foreground capitalize">{type}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resource Calendar Table */}
      <Card>
        <CardContent className="pt-6">
          <table className="min-w-full table-fixed border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="bg-background sticky left-0 z-10 px-4 py-2 text-left text-sm font-semibold border-b border-border w-56">Companies</th>
                {weekDays.map(day => (
                  <th key={day.toISOString()} className="px-4 py-2 text-center text-sm font-semibold border-b border-border">
                    <div>{format(day, 'EEE')}</div>
                    <div className="text-xs text-muted-foreground">{format(day, 'MMM d')}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companyList.map(company => (
                <tr key={company.name}>
                  {/* Company name/market cap cell */}
                  <td className="bg-background sticky left-0 z-10 px-4 py-2 border-b border-border align-top">
                    <div className="font-semibold text-white">{company.name}</div>
                    <div className="text-xs text-muted-foreground">{company.marketCap} market cap</div>
                  </td>
                  {/* Event cells for each day */}
                  {weekDays.map(day => {
                    const event = getEventForCompanyAndDate(company.name, day);
                    return (
                      <td key={day.toISOString()} className="px-2 py-2 border-b border-border align-top min-w-[120px]">
                        {event ? (
                          <div
                            onClick={() => handleEventClick(event)}
                            className={`rounded-md px-3 py-2 cursor-pointer shadow-sm hover:shadow-md transition-all text-xs font-medium ${getEventColor(event.type)}`}
                            title={`${event.title} - ${event.startTime}`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{event.title}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-xs opacity-80">
                              <Clock className="h-3 w-3 inline-block mr-1" />
                              {event.startTime}
                            </div>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      {/* Legend (unchanged) */}
      {/* RSVP Dialog (unchanged) */}
      <Dialog open={rsvpDialogOpen} onOpenChange={setRsvpDialogOpen}>
        <DialogContent className="sm:max-w-md">
                  <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
          <DialogDescription>
            View event details and respond to the invitation
          </DialogDescription>
        </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                <p className="text-muted-foreground">{selectedEvent.company}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {selectedEvent.startTime} - {selectedEvent.endTime}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(new Date(selectedEvent.date), 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedEvent.location}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedEvent.marketCap}</span>
                </div>
              </div>
              
              {selectedEvent.description && (
                <div>
                  <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Badge className={getEventColor(selectedEvent.type)}>
                  {selectedEvent.type}
                </Badge>
              </div>
              
              {/* RSVP Actions */}
              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={() => handleRSVP('accepted')}
                  className="flex-1 bg-success hover:bg-success/90"
                >
                  Accept
                </Button>
                <Button
                  onClick={() => handleRSVP('tentative')}
                  variant="outline"
                  className="flex-1"
                >
                  Tentative
                </Button>
                <Button
                  onClick={() => handleRSVP('declined')}
                  variant="outline"
                  className="flex-1 text-destructive hover:text-destructive"
                >
                  Decline
                </Button>
              </div>
              
              {/* Analyst Assignment (Analyst Managers only) */}
              {canAssignAnalysts && (
                <div className="pt-4 border-t">
                  <label className="text-sm font-medium">Assign to Analyst</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select analyst" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analyst1">John Analyst</SelectItem>
                      <SelectItem value="analyst2">Jane Analyst</SelectItem>
                      <SelectItem value="analyst3">Bob Analyst</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};