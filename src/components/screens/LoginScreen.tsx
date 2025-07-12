import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Sun, Moon, Building2, TrendingUp, User, Mail, Lock, AlertCircle } from 'lucide-react';
import { UserRole } from '@/contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { FaMicrosoft } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';

export const LoginScreen: React.FC = () => {
  const { login, isLoading, msalInitialized, msalError } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (selectedRole) {
      // Use the selected role for login
      if (selectedRole === 'IR Admin') {
        await login('microsoft');
      } else if (selectedRole === 'Analyst Manager') {
        await login('google');
      } else if (selectedRole === 'Investment Analyst') {
        await login('guest');
      }
    }
  };

  const handleMicrosoftLogin = async () => {
    if (selectedRole) {
      await login('microsoft');
    } else {
      // Default to IR Admin for Microsoft login
      setSelectedRole('IR Admin');
      await login('microsoft');
    }
  };

  const handleGoogleLogin = async () => {
    if (selectedRole) {
      await login('google');
    } else {
      // Default to Analyst Manager for Google login
      setSelectedRole('Analyst Manager');
      await login('google');
    }
  };

  const handleGuestLogin = async () => {
    if (selectedRole) {
      await login('guest');
    } else {
      // Default to Investment Analyst for Guest login
      setSelectedRole('Investment Analyst');
      await login('guest');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* App Title and Subtitle */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-yellow-400 mb-2">AgoraCalendar</h1>
        <div className="text-lg text-muted-foreground font-medium">Investor Relations Event Management</div>
      </div>

      {/* MSAL Status Alert */}
      {!msalInitialized && (
        <Alert className="mb-4 max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Initializing Microsoft Authentication...
          </AlertDescription>
        </Alert>
      )}

      {/* MSAL Error Alert */}
      {msalError && (
        <Alert className="mb-4 max-w-md" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {msalError}
          </AlertDescription>
        </Alert>
      )}

      {/* Login Card */}
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground mb-1">Sign In</CardTitle>
          <CardDescription className="text-muted-foreground mb-2">
            Choose your authentication method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Role Dropdown */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Role</label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IR Admin">
                  <div className="flex flex-col items-start">
                    <span className="flex items-center gap-2 font-semibold"><Building2 className="h-4 w-4" /> IR Administrator</span>
                    <span className="text-xs text-muted-foreground">Manage company events and investor relations</span>
                  </div>
                </SelectItem>
                <SelectItem value="Analyst Manager">
                  <div className="flex flex-col items-start">
                    <span className="flex items-center gap-2 font-semibold"><TrendingUp className="h-4 w-4" /> Analyst Manager</span>
                    <span className="text-xs text-muted-foreground">Assign and review analyst meetings</span>
                  </div>
                </SelectItem>
                <SelectItem value="Investment Analyst">
                  <div className="flex flex-col items-start">
                    <span className="flex items-center gap-2 font-semibold"><User className="h-4 w-4" /> Investment Analyst</span>
                    <span className="text-xs text-muted-foreground">RSVP and attend assigned events</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email Field */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Sign In Button */}
          <Button
            onClick={handleLogin}
            disabled={!selectedRole || !email || !password || isLoading || !msalInitialized}
            className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-semibold"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          {/* API Login Options */}
          <div className="space-y-2 pt-2">
            <Button
              variant="outline"
              className="w-full flex items-center justify-start gap-3"
              onClick={handleMicrosoftLogin}
              disabled={isLoading || !msalInitialized}
            >
              <FaMicrosoft className="h-5 w-5 text-blue-700" />
              <span className="font-medium">Sign in with Microsoft</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-start gap-3"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <FcGoogle className="h-5 w-5" />
              <span className="font-medium">Sign in with Google</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-start gap-3"
              onClick={handleGuestLogin}
              disabled={isLoading}
            >
              <FaUser className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Continue as Guest</span>
            </Button>
          </div>

          {/* Demo Info */}
          <div className="text-xs text-muted-foreground text-center pt-2">
            {msalInitialized 
              ? 'Microsoft Authentication Ready' 
              : 'Initializing Microsoft Authentication...'
            }
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-muted-foreground">
        Built for Microsoft Outlook Integration
      </div>

      {/* Theme toggle */}
      <div className="fixed top-4 right-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="rounded-full w-10 h-10"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};