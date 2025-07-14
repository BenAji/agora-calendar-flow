import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, TrendingUp } from 'lucide-react';
import { User, UserRole } from '../AgoraCalendar';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');

  const mockUsers = {
    'ir-admin': {
      id: 'admin-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      role: 'ir-admin' as UserRole,
      company: 'Apple Inc.'
    },
    'analyst-manager': {
      id: 'manager-1',
      name: 'Michael Rodriguez',
      email: 'michael.rodriguez@investment.com',
      role: 'analyst-manager' as UserRole,
      company: 'Goldman Sachs'
    },
    'investment-analyst': {
      id: 'analyst-1',
      name: 'Emma Thompson',
      email: 'emma.thompson@investment.com',
      role: 'investment-analyst' as UserRole,
      company: 'Goldman Sachs'
    }
  };

  const handleLogin = () => {
    if (selectedRole && mockUsers[selectedRole]) {
      onLogin(mockUsers[selectedRole]);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ir-admin': return <Building2 className="h-5 w-5" />;
      case 'analyst-manager': return <TrendingUp className="h-5 w-5" />;
      case 'investment-analyst': return <Calendar className="h-5 w-5" />;
      default: return null;
    }
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'ir-admin': return 'admin';
      case 'analyst-manager': return 'manager';
      case 'investment-analyst': return 'analyst';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-strong border-border/50">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Calendar className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">AgoraCalendar</CardTitle>
            <CardDescription className="text-muted-foreground">
              Outlook Add-in for Investor Relations
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Select Your Role
                </label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose your role to continue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ir-admin">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>IR Admin</span>
                        <Badge variant="outline" className="text-xs">Investor Relations</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="analyst-manager">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>Analyst Manager</span>
                        <Badge variant="outline" className="text-xs">Investor</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="investment-analyst">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Investment Analyst</span>
                        <Badge variant="outline" className="text-xs">Investor</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedRole && (
                <Card className="bg-muted/30 border-border/30">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3 mb-2">
                      {getRoleIcon(selectedRole)}
                      <div>
                        <div className="font-medium text-foreground">
                          {mockUsers[selectedRole].name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {mockUsers[selectedRole].email}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {mockUsers[selectedRole].company}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button 
                onClick={handleLogin}
                disabled={!selectedRole}
                className="w-full"
                variant={selectedRole ? getRoleVariant(selectedRole) as any : 'default'}
              >
                {getRoleIcon(selectedRole)}
                Access AgoraCalendar
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center space-y-1">
              <div>Demo Credentials - No authentication required</div>
              <div className="text-accent">Select any role to explore the interface</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};