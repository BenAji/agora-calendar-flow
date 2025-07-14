import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { NavigationHeader } from '../common/NavigationHeader';
import { CreateEventModal } from '../modals/CreateEventModal';
import { 
  Plus, 
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { User, Event, Screen } from '../AgoraCalendar';

interface EventManagementScreenProps {
  currentUser: User;
  events: Event[];
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  onEventUpdate: (event: Event) => void;
  onEventCreate: (event: Omit<Event, 'id'>) => void;
  onEventDelete: (eventId: string) => void;
}

export const EventManagementScreen: React.FC<EventManagementScreenProps> = ({
  currentUser,
  events,
  onNavigate,
  onLogout,
  onEventCreate,
  onEventDelete,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getFilteredEvents = () => {
    let filteredEvents = events;
    
    // Role-based filtering
    if (currentUser.role === 'ir-admin') {
      filteredEvents = events.filter(event => event.createdBy === currentUser.id);
    } else if (currentUser.role === 'investment-analyst') {
      filteredEvents = events.filter(event => 
        event.assignedTo?.includes(currentUser.id) || 
        Object.keys(event.rsvps).includes(currentUser.id)
      );
    }

    // Search filtering
    if (searchTerm) {
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'earnings': return 'bg-earnings';
      case 'roadshow': return 'bg-roadshow';
      case 'conference': return 'bg-conference';
      case 'meeting': return 'bg-meeting';
      default: return 'bg-muted';
    }
  };

  const getRSVPCount = (event: Event) => {
    const rsvps = Object.values(event.rsvps);
    const accepted = rsvps.filter(r => r === 'accepted').length;
    const total = rsvps.length;
    return { accepted, total };
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        currentUser={currentUser} 
        currentScreen="events"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {currentUser.role === 'ir-admin' && 'Event Management'}
              {currentUser.role === 'analyst-manager' && 'Events & Assignments'}
              {currentUser.role === 'investment-analyst' && 'My Events'}
            </h1>
            <p className="text-muted-foreground">
              {currentUser.role === 'ir-admin' && 'Create, manage and track your investor relations events'}
              {currentUser.role === 'analyst-manager' && 'View events and assign them to your team'}
              {currentUser.role === 'investment-analyst' && 'View your assigned events and respond to invitations'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {currentUser.role === 'ir-admin' && (
              <>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4" />
                  Import CSV
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                  Export RSVPs
                </Button>
                <Button variant="admin" onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4" />
                  Create Event
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events by title, company, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="grid gap-4">
          {filteredEvents.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search criteria' : 'No events match your current filters'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEvents.map((event) => {
              const rsvpCount = getRSVPCount(event);
              const userRSVP = event.rsvps[currentUser.id];
              
              return (
                <Card key={event.id} className="shadow-soft hover:shadow-medium transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                          <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                          <Badge variant="outline" className="capitalize">{event.type}</Badge>
                          {userRSVP && (
                            <Badge 
                              variant={
                                userRSVP === 'accepted' ? 'default' :
                                userRSVP === 'declined' ? 'destructive' :
                                'secondary'
                              }
                              className="text-xs"
                            >
                              {userRSVP}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{rsvpCount.accepted}/{rsvpCount.total} attending</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            <strong>{event.company}</strong> • {event.purpose}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {currentUser.role === 'ir-admin' && event.createdBy === currentUser.id && (
                          <>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => onEventDelete(event.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        {currentUser.role === 'analyst-manager' && (
                          <Button variant="manager" size="sm">
                            Assign Team
                          </Button>
                        )}
                        
                        {(currentUser.role === 'analyst-manager' || currentUser.role === 'investment-analyst') && (
                          <Button variant="outline" size="sm">
                            RSVP
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          currentUser={currentUser}
          onClose={() => setShowCreateModal(false)}
          onCreateEvent={onEventCreate}
        />
      )}
    </div>
  );
};