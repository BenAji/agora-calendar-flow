import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NavigationHeader } from '../common/NavigationHeader';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  FileText, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
  Activity
} from 'lucide-react';
import { User, Event, Screen } from '../AgoraCalendar';

interface DashboardScreenProps {
  currentUser: User;
  events: Event[];
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  onEventUpdate: (event: Event) => void;
  onEventCreate: (event: Omit<Event, 'id'>) => void;
  onEventDelete: (eventId: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  currentUser,
  events,
  onNavigate,
  onLogout,
}) => {
  
  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  const getRSVPStats = () => {
    const totalRSVPs = events.reduce((acc, event) => {
      return acc + Object.keys(event.rsvps).length;
    }, 0);
    
    const acceptedRSVPs = events.reduce((acc, event) => {
      return acc + Object.values(event.rsvps).filter(rsvp => rsvp === 'accepted').length;
    }, 0);

    return { total: totalRSVPs, accepted: acceptedRSVPs };
  };

  const getQuickActions = () => {
    switch (currentUser.role) {
      case 'ir-admin':
        return [
          { label: 'Create Event', icon: Calendar, action: () => onNavigate('events'), variant: 'admin' },
          { label: 'View Analytics', icon: TrendingUp, action: () => onNavigate('analytics'), variant: 'default' },
          { label: 'Export RSVPs', icon: FileText, action: () => {}, variant: 'outline' }
        ];
      case 'analyst-manager':
        return [
          { label: 'View Calendar', icon: Calendar, action: () => onNavigate('calendar'), variant: 'manager' },
          { label: 'Manage Events', icon: Users, action: () => onNavigate('events'), variant: 'default' },
          { label: 'Team Analytics', icon: Activity, action: () => onNavigate('analytics'), variant: 'outline' }
        ];
      case 'investment-analyst':
        return [
          { label: 'My Calendar', icon: Calendar, action: () => onNavigate('calendar'), variant: 'analyst' },
          { label: 'Assigned Events', icon: Clock, action: () => onNavigate('events'), variant: 'default' }
        ];
      default:
        return [];
    }
  };

  const upcomingEvents = getUpcomingEvents();
  const rsvpStats = getRSVPStats();
  const quickActions = getQuickActions();

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        currentUser={currentUser} 
        currentScreen="dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-muted-foreground">
              {currentUser.role === 'ir-admin' && 'Manage your investor relations events and communications'}
              {currentUser.role === 'analyst-manager' && 'Coordinate your team and track investment opportunities'}
              {currentUser.role === 'investment-analyst' && 'Stay on top of your assigned events and research'}
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            {currentUser.company}
          </Badge>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features for your role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant as any}
                  onClick={action.action}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <action.icon className="h-6 w-6" />
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
              <p className="text-xs text-muted-foreground">
                {upcomingEvents.length} upcoming
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">RSVP Responses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rsvpStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {rsvpStats.accepted} accepted
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(e => {
                  const eventDate = new Date(e.date);
                  const today = new Date();
                  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return eventDate >= today && eventDate <= weekFromNow;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">events scheduled</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Your next scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming events scheduled</p>
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        event.type === 'earnings' ? 'bg-earnings' :
                        event.type === 'meeting' ? 'bg-meeting' :
                        event.type === 'conference' ? 'bg-conference' :
                        'bg-roadshow'
                      }`} />
                      <div>
                        <div className="font-medium text-foreground">{event.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {event.company} • {event.date} at {event.startTime}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};