import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut, 
  Building2,
  Home,
  FileText,
  Users
} from 'lucide-react';
import { User, Screen } from '../AgoraCalendar';

interface NavigationHeaderProps {
  currentUser: User;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentUser,
  currentScreen,
  onNavigate,
  onLogout,
}) => {
  const getNavItems = () => {
    const common = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
    ];

    switch (currentUser.role) {
      case 'ir-admin':
        return [
          ...common,
          { id: 'events', label: 'Event Management', icon: FileText },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ];
      case 'analyst-manager':
        return [
          ...common,
          { id: 'calendar', label: 'Calendar', icon: Calendar },
          { id: 'events', label: 'Events', icon: FileText },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ];
      case 'investment-analyst':
        return [
          ...common,
          { id: 'calendar', label: 'Calendar', icon: Calendar },
          { id: 'events', label: 'My Events', icon: FileText },
        ];
      default:
        return common;
    }
  };

  const getRoleColor = () => {
    switch (currentUser.role) {
      case 'ir-admin': return 'admin';
      case 'analyst-manager': return 'manager';
      case 'investment-analyst': return 'analyst';
      default: return 'default';
    }
  };

  const navItems = getNavItems();

  return (
    <header className="bg-card border-b border-border shadow-soft">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">AgoraCalendar</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentScreen === item.id ? getRoleColor() as any : 'ghost'}
                size="sm"
                onClick={() => onNavigate(item.id as Screen)}
                className="flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Button>
            ))}
          </nav>

          {/* User Info and Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                <span className="hidden md:inline">{currentUser.company}</span>
              </Badge>
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-foreground">{currentUser.name}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {currentUser.role.replace('-', ' ')}
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};