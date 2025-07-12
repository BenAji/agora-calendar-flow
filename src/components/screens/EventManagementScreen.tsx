import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Search,
  Filter, 
  Download, 
  Upload, 
  Edit, 
  Trash2, 
  Users,
  Calendar,
  Building2,
  Clock,
  MapPin,
  Eye,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { CreateEventModal } from '@/components/modals/CreateEventModal';
import { CSVImportModal } from '@/components/modals/CSVImportModal';
import { RSVPModal } from '@/components/modals/RSVPModal';
import { exportEventsToCSV, exportRSVPsToCSV, downloadCSV, CSVEvent } from '@/utils/csvUtils';

// Event types as specified in the development plan
export type EventType = 'earnings' | 'meeting' | 'conference' | 'roadshow';

export interface Event {
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
  status: 'active' | 'upcoming' | 'completed';
  rsvps: Record<string, 'accepted' | 'declined' | 'tentative'>;
  createdBy: string;
  createdAt: string;
}

// Mock data for demonstration
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Q4 Earnings Call',
    company: 'Apple Inc.',
    type: 'earnings',
    date: '2024-01-15',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    location: 'Virtual',
    marketCap: 'Large Cap',
    description: 'Fourth quarter earnings conference call',
    status: 'upcoming',
    rsvps: {
      'analyst.manager@company.com': 'accepted',
      'investment.analyst@company.com': 'tentative'
    },
    createdBy: 'ir.admin@company.com',
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    title: 'Analyst Meeting',
    company: 'Microsoft Corp.',
    type: 'meeting',
    date: '2024-01-18',
    startTime: '2:00 PM',
    endTime: '3:30 PM',
    location: 'Seattle, WA',
    marketCap: 'Large Cap',
    description: 'One-on-one analyst meeting',
    status: 'upcoming',
    rsvps: {
      'analyst.manager@company.com': 'accepted'
    },
    createdBy: 'ir.admin@company.com',
    createdAt: '2024-01-12'
  },
  {
    id: '3',
    title: 'Roadshow Presentation',
    company: 'Tesla Inc.',
    type: 'roadshow',
    date: '2024-01-20',
    startTime: '11:30 AM',
    endTime: '12:30 PM',
    location: 'New York, NY',
    marketCap: 'Large Cap',
    description: 'Investor roadshow presentation',
    status: 'upcoming',
    rsvps: {
      'investment.analyst@company.com': 'declined'
    },
    createdBy: 'ir.admin@company.com',
    createdAt: '2024-01-14'
  },
  {
    id: '4',
    title: 'Conference Call',
    company: 'Amazon.com Inc.',
    type: 'conference',
    date: '2024-01-22',
    startTime: '9:00 AM',
    endTime: '10:00 AM',
    location: 'Virtual',
    marketCap: 'Large Cap',
    description: 'Annual conference call',
    status: 'upcoming',
    rsvps: {},
    createdBy: 'ir.admin@company.com',
    createdAt: '2024-01-16'
  }
];

export const EventManagementScreen: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [rsvpDialogOpen, setRsvpDialogOpen] = useState(false);

  const companies = useMemo(() => 
    Array.from(new Set(events.map(event => event.company))).sort(),
    [events]
  );

  const eventTypes = useMemo(() => 
    Array.from(new Set(events.map(event => event.type))).sort(),
    [events]
  );

  const statuses = useMemo(() => 
    Array.from(new Set(events.map(event => event.status))).sort(),
    [events]
  );

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      // For IR Admin, don't filter by company since they only belong to one company
      const matchesCompany = user?.role === 'IR Admin' ? true : (selectedCompany === 'all' || event.company === selectedCompany);
      const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
      const matchesType = selectedType === 'all' || event.type === selectedType;
      
      return matchesSearch && matchesCompany && matchesStatus && matchesType;
    });
  }, [events, searchTerm, selectedCompany, selectedStatus, selectedType, user?.role]);

  const getEventColor = (type: EventType) => {
    switch (type) {
      case 'earnings': return 'bg-earnings text-white';
      case 'meeting': return 'bg-meeting text-white';
      case 'conference': return 'bg-conference text-white';
      case 'roadshow': return 'bg-roadshow text-white';
      default: return 'bg-primary text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'upcoming': return 'bg-warning text-warning-foreground';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getRSVPCount = (rsvps: Record<string, string>) => {
    const total = Object.keys(rsvps).length;
    const accepted = Object.values(rsvps).filter(r => r === 'accepted').length;
    const declined = Object.values(rsvps).filter(r => r === 'declined').length;
    const tentative = Object.values(rsvps).filter(r => r === 'tentative').length;
    
    return { total, accepted, declined, tentative };
  };

  const handleCreateEvent = (eventData: Omit<Event, 'id' | 'createdBy' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdBy: user?.email || 'unknown',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleUpdateEvent = (eventId: string, eventData: Omit<Event, 'id' | 'createdBy' | 'createdAt'>) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, ...eventData }
        : event
    ));
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const handleImportEvents = (csvEvents: CSVEvent[]) => {
    const newEvents: Event[] = csvEvents.map((csvEvent, index) => ({
      id: `imported-${Date.now()}-${index}`,
      title: csvEvent.title,
      company: csvEvent.company,
      type: csvEvent.type,
      date: csvEvent.date,
      startTime: csvEvent.startTime,
      endTime: csvEvent.endTime,
      location: csvEvent.location,
      marketCap: csvEvent.marketCap,
      description: csvEvent.description,
      status: 'upcoming' as const,
      rsvps: {},
      createdBy: user?.email || 'unknown',
      createdAt: new Date().toISOString().split('T')[0]
    }));
    setEvents(prev => [...prev, ...newEvents]);
  };

  const handleExportEvents = () => {
    const csvContent = exportEventsToCSV(events);
    downloadCSV(csvContent, `events_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportRSVPs = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      const csvContent = exportRSVPsToCSV(event);
      downloadCSV(csvContent, `rsvps_${event.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  const handleViewRSVPs = (event: Event) => {
    setSelectedEvent(event);
    setRsvpDialogOpen(true);
  };

  const handleRSVP = (eventId: string, response: 'accepted' | 'declined' | 'tentative') => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            rsvps: { 
              ...event.rsvps, 
              [user?.email || '']: response 
            } 
          }
        : event
    ));
  };

  const handleAssignEvent = (eventId: string, analystEmail: string) => {
    // In a real app, this would send an invitation to the analyst
    console.log(`Assigning event ${eventId} to analyst ${analystEmail}`);
  };

  const getEventManagementContent = () => {
    if (!user) {
      return <div>No user found</div>;
    }

    switch (user.role) {
      case 'IR Admin':
  return (
          <div className="space-y-6">
            {/* Header with Actions */}
        <div className="flex items-center justify-between">
          <div>
                <h1 className="text-3xl font-bold text-foreground">Event Management</h1>
            <p className="text-muted-foreground">
                  Create, edit, and manage all events
            </p>
          </div>
          
              <div className="flex items-center space-x-2">
                <CSVImportModal onImport={handleImportEvents} />
                <CreateEventModal onSave={handleCreateEvent} />
                <Button variant="outline" size="sm" onClick={handleExportEvents}>
                  <Download className="h-4 w-4 mr-2" />
                  Export All
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        {statuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {eventTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
              </div>
            </div>
          </CardContent>
        </Card>

            {/* Events Table */}
            <Card>
              <CardHeader>
                <CardTitle>Events ({filteredEvents.length})</CardTitle>
                <CardDescription>
                  Manage all events and their RSVPs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>RSVPs</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => {
                      const rsvpCount = getRSVPCount(event.rsvps);
                      return (
                        <TableRow key={event.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{event.title}</div>
                              <div className="text-sm text-muted-foreground">{event.location}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span>{event.company}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{format(new Date(event.date), 'MMM d, yyyy')}</div>
                              <div className="text-sm text-muted-foreground">{event.startTime} - {event.endTime}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getEventColor(event.type)}>
                              {event.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(event.status)}>
                              {event.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{rsvpCount.total} total</div>
                              <div className="text-success">{rsvpCount.accepted} accepted</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewRSVPs(event)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleExportRSVPs(event.id)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <CreateEventModal 
                                event={event}
                                onSave={(eventData) => handleUpdateEvent(event.id, eventData)}
                                trigger={
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                }
                              />
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case 'Analyst Manager':
      case 'Investment Analyst':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Events</h1>
                <p className="text-muted-foreground">
                View and manage your assigned events
              </p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <label className="text-sm font-medium">Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {eventTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const rsvpCount = getRSVPCount(event.rsvps);
                const userRSVP = event.rsvps[user.email || ''];
              
              return (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <CardDescription>{event.company}</CardDescription>
                        </div>
                        <Badge className={getEventColor(event.type)}>
                          {event.type}
                            </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(event.date), 'EEEE, MMM d, yyyy')}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{event.startTime} - {event.endTime}</span>
                          </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{rsvpCount.total} RSVPs</span>
                      </div>
                      
                        {userRSVP && (
                          <div className="pt-2">
                            <Badge 
                              variant={userRSVP === 'accepted' ? 'default' : 
                                     userRSVP === 'tentative' ? 'secondary' : 'destructive'}
                            >
                              Your RSVP: {userRSVP}
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            View Details
                          </Button>
                          <RSVPModal 
                            event={event}
                            onRSVP={handleRSVP}
                            onAssign={user?.role === 'Analyst Manager' ? handleAssignEvent : undefined}
                            trigger={
                              <Button size="sm" className="flex-1">
                            RSVP
                          </Button>
                            }
                          />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
              })}
            </div>
          </div>
        );

      default:
        return <div>Unknown role: {user.role}</div>;
    }
  };

  return (
    <>
      {getEventManagementContent()}
      
      {/* RSVP Details Dialog */}
      <Dialog open={rsvpDialogOpen} onOpenChange={setRsvpDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>RSVP Details</DialogTitle>
            <DialogDescription>
              View and manage RSVPs for this event
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                <p className="text-muted-foreground">{selectedEvent.company}</p>
              </div>
              
              <div className="space-y-2">
                {Object.entries(selectedEvent.rsvps).map(([email, response]) => (
                  <div key={email} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{email}</span>
                    <Badge 
                      variant={response === 'accepted' ? 'default' : 
                             response === 'tentative' ? 'secondary' : 'destructive'}
                    >
                      {response}
                    </Badge>
                  </div>
                ))}
                
                {Object.keys(selectedEvent.rsvps).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No RSVPs yet
                  </p>
          )}
        </div>
      </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};