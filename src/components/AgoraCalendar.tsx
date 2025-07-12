import React, { useState } from 'react';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { EventManagementScreen } from './screens/EventManagementScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';

export type UserRole = 'ir-admin' | 'analyst-manager' | 'investment-analyst';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  purpose: string;
  company: string;
  type: 'earnings' | 'meeting' | 'conference' | 'roadshow';
  attendees: string[];
  rsvps: Record<string, 'accepted' | 'declined' | 'tentative'>;
  createdBy: string;
  assignedTo?: string[];
}

export type Screen = 'login' | 'dashboard' | 'calendar' | 'events' | 'analytics';

const AgoraCalendar = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Q4 Earnings Call',
      description: 'Quarterly earnings discussion and investor Q&A',
      date: '2025-07-15',
      startTime: '09:00',
      endTime: '10:00',
      location: 'Conference Room A',
      purpose: 'Earnings Report',
      company: 'Apple Inc.',
      type: 'earnings',
      attendees: [],
      rsvps: {},
      createdBy: 'ir-admin-1'
    },
    {
      id: '2',
      title: 'Strategic Roadshow',
      description: 'Investor relations roadshow presentation',
      date: '2025-07-16',
      startTime: '14:00',
      endTime: '15:30',
      location: 'Virtual Meeting',
      purpose: 'Investment Strategy',
      company: 'Microsoft Corp.',
      type: 'roadshow',
      attendees: [],
      rsvps: {},
      createdBy: 'ir-admin-2'
    },
    {
      id: '3',
      title: 'Tech Conference Panel',
      description: 'Panel discussion on emerging technologies',
      date: '2025-07-17',
      startTime: '11:00',
      endTime: '12:00',
      location: 'Grand Ballroom',
      purpose: 'Industry Insights',
      company: 'Tesla Inc.',
      type: 'conference',
      attendees: [],
      rsvps: {},
      createdBy: 'ir-admin-3'
    }
  ]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleEventUpdate = (updatedEvent: Event) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const handleEventCreate = (newEvent: Omit<Event, 'id'>) => {
    const event: Event = {
      ...newEvent,
      id: Date.now().toString(),
    };
    setEvents(prev => [...prev, event]);
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  if (currentScreen === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const commonProps = {
    currentUser,
    events,
    onNavigate: handleNavigate,
    onLogout: handleLogout,
    onEventUpdate: handleEventUpdate,
    onEventCreate: handleEventCreate,
    onEventDelete: handleEventDelete,
  };

  switch (currentScreen) {
    case 'dashboard':
      return <DashboardScreen {...commonProps} />;
    case 'calendar':
      return <CalendarScreen {...commonProps} />;
    case 'events':
      return <EventManagementScreen {...commonProps} />;
    case 'analytics':
      return <AnalyticsScreen {...commonProps} />;
    default:
      return <DashboardScreen {...commonProps} />;
  }
};

export default AgoraCalendar;