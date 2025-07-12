import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Activity
} from 'lucide-react';
import { sharedEvents, getConflictSummary } from '@/utils/eventsData';

export const AnalyticsScreen: React.FC = () => {
  const { user } = useAuth();

  // Calculate real data from shared events
  const totalEvents = sharedEvents.length;
  const totalRsvps = sharedEvents.reduce((sum, event) => sum + Object.keys(event.rsvps).length, 0);
  const acceptedRsvps = sharedEvents.reduce((sum, event) => 
    sum + Object.values(event.rsvps).filter(r => r === 'accepted').length, 0
  );
  const declinedRsvps = sharedEvents.reduce((sum, event) => 
    sum + Object.values(event.rsvps).filter(r => r === 'declined').length, 0
  );
  const tentativeRsvps = sharedEvents.reduce((sum, event) => 
    sum + Object.values(event.rsvps).filter(r => r === 'tentative').length, 0
  );

  // Get conflict summary
  const conflictSummary = getConflictSummary(sharedEvents);

  // Calculate RSVP data
  const rsvpData = [
    { name: 'Accepted', value: acceptedRsvps, color: '#10b981' },
    { name: 'Declined', value: declinedRsvps, color: '#ef4444' },
    { name: 'Tentative', value: tentativeRsvps, color: '#f59e0b' }
  ];

  const monthlyEvents = [
    { month: 'Jan', events: 24, rsvps: 156 },
    { month: 'Feb', events: 28, rsvps: 189 },
    { month: 'Mar', events: 32, rsvps: 234 },
    { month: 'Apr', events: 29, rsvps: 201 },
    { month: 'May', events: 35, rsvps: 267 },
    { month: 'Jun', events: 31, rsvps: 245 }
  ];

  const eventTypeData = [
    { type: 'Earnings', count: 45, percentage: 35 },
    { type: 'Meetings', count: 38, percentage: 29 },
    { type: 'Conferences', count: 28, percentage: 22 },
    { type: 'Roadshows', count: 18, percentage: 14 }
  ];

  const companyEngagement = [
    { company: 'Apple Inc.', events: 12, rsvps: 89, engagement: 92 },
    { company: 'Microsoft Corp.', events: 10, rsvps: 76, engagement: 88 },
    { company: 'Tesla Inc.', events: 8, rsvps: 54, engagement: 85 },
    { company: 'Amazon.com Inc.', events: 9, rsvps: 67, engagement: 90 },
    { company: 'Google LLC', events: 7, rsvps: 52, engagement: 87 }
  ];

  // Calculate conflict data by month
  const conflictData = [
    { month: 'Jul', conflicts: conflictSummary.conflicts.filter(c => c[0].date.startsWith('2025-07')).length, resolved: 0 },
    { month: 'Aug', conflicts: conflictSummary.conflicts.filter(c => c[0].date.startsWith('2025-08')).length, resolved: 0 }
  ];

  const getAnalyticsContent = () => {
    if (!user) return null;

    switch (user.role) {
      case 'IR Admin':
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalEvents}</div>
                  <p className="text-xs text-muted-foreground">
                    July & August 2025
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total RSVPs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalRsvps}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all events
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Accepted RSVPs</CardTitle>
                  <CheckCircle className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{acceptedRsvps}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalRsvps > 0 ? `${Math.round((acceptedRsvps / totalRsvps) * 100)}%` : '0%'} acceptance rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Event Conflicts</CardTitle>
                  <Clock className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{conflictSummary.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {conflictSummary.hasConflicts ? 'Need attention' : 'No conflicts'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* RSVP Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>RSVP Breakdown</CardTitle>
                  <CardDescription>
                    Distribution of RSVP responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={rsvpData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {rsvpData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                  <CardDescription>
                    Events and RSVPs over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyEvents}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="events" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="rsvps" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Event Types and Company Engagement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Types</CardTitle>
                  <CardDescription>
                    Distribution by event type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={eventTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Company Engagement</CardTitle>
                  <CardDescription>
                    Top companies by engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {companyEngagement.map((company, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{company.company}</p>
                          <p className="text-sm text-muted-foreground">
                            {company.events} events, {company.rsvps} RSVPs
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{company.engagement}%</p>
                          <Badge variant="outline" className="text-xs">
                            Engagement
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'Analyst Manager':
      case 'Investment Analyst':
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalEvents}</div>
                  <p className="text-xs text-muted-foreground">
                    July & August 2025
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">RSVP Breakdown</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{acceptedRsvps}/{totalRsvps}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalRsvps > 0 ? `${Math.round((acceptedRsvps / totalRsvps) * 100)}%` : '0%'} responded
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Event Conflicts</CardTitle>
                  <Clock className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{conflictSummary.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {conflictSummary.hasConflicts ? 'Need attention' : 'No conflicts'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Companies</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Array.from(new Set(sharedEvents.map(e => e.company))).length}</div>
                  <p className="text-xs text-muted-foreground">
                    Unique companies
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal RSVP Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>My RSVP Responses</CardTitle>
                  <CardDescription>
                    Your RSVP activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Accepted', value: 12, color: '#10b981' },
                          { name: 'Declined', value: 2, color: '#ef4444' },
                          { name: 'Tentative', value: 1, color: '#f59e0b' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Accepted', value: 12, color: '#10b981' },
                          { name: 'Declined', value: 2, color: '#ef4444' },
                          { name: 'Tentative', value: 1, color: '#f59e0b' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Conflict Resolution */}
              <Card>
                <CardHeader>
                  <CardTitle>Conflict Resolution</CardTitle>
                  <CardDescription>
                    Monthly scheduling conflicts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={conflictData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="conflicts" stroke="#ef4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Company Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Company Activity</CardTitle>
                <CardDescription>
                  Your interactions with companies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companyEngagement.slice(0, 5).map((company, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{company.company}</p>
                          <p className="text-sm text-muted-foreground">
                            {company.events} events attended
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{company.engagement}%</p>
                        <Badge variant="outline" className="text-xs">
                          Engagement
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">
          {user?.role === 'IR Admin' 
            ? 'Track engagement metrics and event performance'
            : 'Monitor your calendar activity and company interactions'
          }
        </p>
      </div>

      {getAnalyticsContent()}
    </div>
  );
};