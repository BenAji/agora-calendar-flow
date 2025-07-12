import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOffice } from '@/contexts/OfficeContext';
import { UserRole } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Building2, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { getConflictSummary } from '@/utils/conflictDetection';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CreateEventModal } from '@/components/modals/CreateEventModal';
import { CSVImportModal } from '@/components/modals/CSVImportModal';
import { OfficeStatus } from '@/components/common/OfficeStatus';
import { GraphStatus } from '@/components/common/GraphStatus';

export const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const { isOfficeAvailable, showNotification } = useOffice();
  const navigate = useNavigate();
  

  
  // Mock events for conflict detection
  const mockEvents = [
    {
      id: '1',
      title: 'Q4 Earnings Call',
      company: 'Apple Inc.',
      type: 'earnings' as const,
      date: '2024-01-15',
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      location: 'Virtual',
      marketCap: 'Large Cap',
      status: 'upcoming' as const,
      rsvps: { 'analyst.manager@company.com': 'accepted' as const },
      createdBy: 'ir.admin@company.com',
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      title: 'Analyst Meeting',
      company: 'Microsoft Corp.',
      type: 'meeting' as const,
      date: '2024-01-15',
      startTime: '10:30 AM',
      endTime: '11:30 AM',
      location: 'Seattle, WA',
      marketCap: 'Large Cap',
      status: 'upcoming' as const,
      rsvps: { 'analyst.manager@company.com': 'accepted' as const },
      createdBy: 'ir.admin@company.com',
      createdAt: '2024-01-12'
    }
  ];

  const conflictSummary = getConflictSummary(mockEvents);

  const handleQuickAction = async (action: string) => {
    if (isOfficeAvailable) {
      await showNotification(`Executing ${action}...`, 'info');
    }
    
    switch (action) {
      case 'create-event':
        // This will be handled by the modal trigger
        break;
      case 'import-events':
        // This will be handled by the modal trigger
        break;
      case 'view-analytics':
        navigate('/analytics');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const getDashboardContent = () => {
    if (!user) {
      return <div>No user found</div>;
    }

    switch (user.role) {
      case 'IR Admin':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user.name}. Manage your investor relations events.
              </p>
            </div>

            {/* Office Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>
                      Common tasks for IR Administrators
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div 
                        className="p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => handleQuickAction('create-event')}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">Create New Event</h3>
                            <p className="text-xs text-muted-foreground">Schedule a new investor event</p>
                          </div>
                        </div>
                      </div>

                      <div 
                        className="p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => handleQuickAction('import-events')}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">Import Events</h3>
                            <p className="text-xs text-muted-foreground">Bulk import from CSV</p>
                          </div>
                        </div>
                      </div>

                      <div 
                        className="p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => handleQuickAction('view-analytics')}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">View Analytics</h3>
                            <p className="text-xs text-muted-foreground">Event performance metrics</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">24</p>
                          <p className="text-sm text-muted-foreground">Total Events</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Users className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">156</p>
                          <p className="text-sm text-muted-foreground">Total RSVPs</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">3</p>
                          <p className="text-sm text-muted-foreground">Conflicts</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Office Status Sidebar */}
              <div className="space-y-6">
                <OfficeStatus />
                <GraphStatus />
                
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Event "Q4 Earnings Call" created</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>5 RSVPs received for "Analyst Meeting"</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Conflict detected for "Roadshow Presentation"</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'Analyst Manager':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user.name}. Manage your analyst team and events.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Team Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border border-border rounded-lg">
                        <p className="text-2xl font-bold">8</p>
                        <p className="text-sm text-muted-foreground">Analysts</p>
                      </div>
                      <div className="text-center p-4 border border-border rounded-lg">
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-sm text-muted-foreground">Assigned Events</p>
                      </div>
                      <div className="text-center p-4 border border-border rounded-lg">
                        <p className="text-2xl font-bold">85%</p>
                        <p className="text-sm text-muted-foreground">Response Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <OfficeStatus />
                <GraphStatus />
              </div>
            </div>
          </div>
        );

      case 'Investment Analyst':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user.name}. View your assigned events and RSVPs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      My Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">Q4 Earnings Call</p>
                          <p className="text-sm text-muted-foreground">Apple Inc. • Jan 15, 2025</p>
                        </div>
                        <Badge className="bg-green-500">Accepted</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">Analyst Meeting</p>
                          <p className="text-sm text-muted-foreground">Microsoft Corp. • Jan 18, 2025</p>
                        </div>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <OfficeStatus />
                <GraphStatus />
              </div>
            </div>
          </div>
        );

      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="container mx-auto px-6 py-6">
      {getDashboardContent()}
      
      {/* Modals */}
      <CreateEventModal onSave={(event) => console.log('Event created:', event)} />
      <CSVImportModal onImport={(events) => console.log('Events imported:', events)} />
    </div>
  );
};