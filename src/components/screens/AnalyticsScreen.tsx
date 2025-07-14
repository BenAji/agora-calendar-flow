import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NavigationHeader } from '../common/NavigationHeader';
import { 
  TrendingUp, 
  Users, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { User, Event, Screen } from '../AgoraCalendar';

interface AnalyticsScreenProps {
  currentUser: User;
  events: Event[];
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  onEventUpdate: (event: Event) => void;
  onEventCreate: (event: Omit<Event, 'id'>) => void;
  onEventDelete: (eventId: string) => void;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  currentUser,
  events,
  onNavigate,
  onLogout,
}) => {
  
  const getAnalyticsData = () => {
    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length;
    const pastEvents = totalEvents - upcomingEvents;
    
    const allRSVPs = events.reduce((acc, event) => {
      const rsvps = Object.values(event.rsvps);
      return {
        total: acc.total + rsvps.length,
        accepted: acc.accepted + rsvps.filter(r => r === 'accepted').length,
        declined: acc.declined + rsvps.filter(r => r === 'declined').length,
        tentative: acc.tentative + rsvps.filter(r => r === 'tentative').length,
      };
    }, { total: 0, accepted: 0, declined: 0, tentative: 0 });

    const eventsByType = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCompanies = events.reduce((acc, event) => {
      acc[event.company] = (acc[event.company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEvents,
      upcomingEvents,
      pastEvents,
      rsvps: allRSVPs,
      eventsByType,
      topCompanies: Object.entries(topCompanies)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
    };
  };

  const analytics = getAnalyticsData();

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        currentUser={currentUser} 
        currentScreen="analytics"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into event performance and engagement
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.upcomingEvents} upcoming
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total RSVPs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.rsvps.total}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((analytics.rsvps.accepted / analytics.rsvps.total) * 100 || 0)}% acceptance rate
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted RSVPs</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{analytics.rsvps.accepted}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.rsvps.declined} declined, {analytics.rsvps.tentative} tentative
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(((analytics.rsvps.accepted + analytics.rsvps.tentative) / analytics.rsvps.total) * 100 || 0)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Positive response rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Types Distribution */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Events by Type
              </CardTitle>
              <CardDescription>Distribution of event categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analytics.eventsByType).map(([type, count]) => {
                  const percentage = Math.round((count / analytics.totalEvents) * 100);
                  const colorClass = 
                    type === 'earnings' ? 'bg-earnings' :
                    type === 'roadshow' ? 'bg-roadshow' :
                    type === 'conference' ? 'bg-conference' :
                    'bg-meeting';
                  
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${colorClass}`} />
                        <span className="text-sm font-medium capitalize">{type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{count} events</span>
                        <Badge variant="outline">{percentage}%</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* RSVP Breakdown */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                RSVP Breakdown
              </CardTitle>
              <CardDescription>Response distribution across all events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Accepted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{analytics.rsvps.accepted}</span>
                    <Badge variant="default" className="bg-success">
                      {Math.round((analytics.rsvps.accepted / analytics.rsvps.total) * 100 || 0)}%
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Tentative</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{analytics.rsvps.tentative}</span>
                    <Badge variant="secondary" className="bg-warning text-warning-foreground">
                      {Math.round((analytics.rsvps.tentative / analytics.rsvps.total) * 100 || 0)}%
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">Declined</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{analytics.rsvps.declined}</span>
                    <Badge variant="destructive">
                      {Math.round((analytics.rsvps.declined / analytics.rsvps.total) * 100 || 0)}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Companies */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Most Active Companies
            </CardTitle>
            <CardDescription>Companies with the most scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topCompanies.map(([company, count], index) => (
                <div key={company} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium">{company}</span>
                  </div>
                  <Badge variant="outline">{count} events</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};