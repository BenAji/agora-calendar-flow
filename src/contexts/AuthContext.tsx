import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { msalService, MSALConfig, UserInfo } from '@/services/msalService';

export type UserRole = 'IR Admin' | 'Analyst Manager' | 'Investment Analyst';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company: string;
  tenantId?: string;
  objectId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (provider?: 'microsoft' | 'google' | 'guest') => Promise<void>;
  logout: () => Promise<void>;
  getUserRole: () => UserRole | null;
  msalInitialized: boolean;
  msalError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'agora_calendar_auth';

// MSAL Configuration
const msalConfig: MSALConfig = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID || 'your-client-id',
    authority: import.meta.env.VITE_MSAL_AUTHORITY || 'https://login.microsoftonline.com/common',
    redirectUri: import.meta.env.VITE_MSAL_REDIRECT_URI || 'http://localhost:3000',
    postLogoutRedirectUri: import.meta.env.VITE_MSAL_POST_LOGOUT_REDIRECT_URI || 'http://localhost:3000',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
  system: {
    allowRedirectInIframe: false,
  },
};

// Mock users for development/testing when MSAL is not available
const mockUsers: Record<UserRole, User> = {
  'IR Admin': {
    id: 'admin-1',
    email: 'sarah.chen@example.com',
    name: 'Sarah Chen',
    role: 'IR Admin',
    company: 'Apple Inc.'
  },
  'Analyst Manager': {
    id: 'manager-1',
    email: 'michael.rodriguez@investment.com',
    name: 'Michael Rodriguez',
    role: 'Analyst Manager',
    company: 'Goldman Sachs'
  },
  'Investment Analyst': {
    id: 'analyst-1',
    email: 'emma.thompson@investment.com',
    name: 'Emma Thompson',
    role: 'Investment Analyst',
    company: 'Goldman Sachs'
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [msalInitialized, setMsalInitialized] = useState(false);
  const [msalError, setMsalError] = useState<string | null>(null);

  // Initialize MSAL on component mount
  useEffect(() => {
    const initializeMSAL = async () => {
      try {
        await msalService.initialize(msalConfig);
        setMsalInitialized(true);
        
        // Handle redirect response if user is returning from auth
        const response = await msalService.handleRedirectResponse();
        if (response) {
          // User just completed authentication
          await handleMSALLogin();
        } else if (msalService.isAuthenticated()) {
          // User is already authenticated
          await handleMSALLogin();
        }
      } catch (error) {
        console.error('Failed to initialize MSAL:', error);
        setMsalError(error instanceof Error ? error.message : 'MSAL initialization failed');
        setMsalInitialized(true); // Set to true so app can continue in mock mode
      } finally {
        setIsLoading(false);
      }
    };

    initializeMSAL();
  }, []);

  // Check localStorage for saved user (fallback for mock mode)
  useEffect(() => {
    if (!msalInitialized) return;

    const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedUser && !msalService.isAuthenticated()) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        setUser(parsedUser);
        console.log('AuthContext - Restored user from localStorage:', parsedUser);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, [msalInitialized]);

  const handleMSALLogin = async () => {
    try {
      const userInfo = await msalService.getUserInfo();
      if (userInfo) {
        // Map MSAL UserInfo to our User format
        const mappedUser: User = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          role: userInfo.role,
          company: userInfo.company,
          tenantId: userInfo.tenantId,
          objectId: userInfo.objectId,
        };
        
        setUser(mappedUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mappedUser));
        console.log('AuthContext - MSAL user authenticated:', mappedUser);
      }
    } catch (error) {
      console.error('Failed to get MSAL user info:', error);
      setMsalError(error instanceof Error ? error.message : 'Failed to get user info');
    }
  };

  const login = async (provider: 'microsoft' | 'google' | 'guest' = 'microsoft') => {
    try {
      setIsLoading(true);
      setMsalError(null);

      if (provider === 'microsoft' && msalInitialized) {
        // Use MSAL for Microsoft authentication
        try {
          await msalService.loginPopup(['User.Read', 'Calendars.ReadWrite']);
          await handleMSALLogin();
        } catch (error) {
          console.error('MSAL login failed:', error);
          // Fallback to mock login for development
          await mockLogin('IR Admin');
        }
      } else if (provider === 'google') {
        // Mock Google login for now
        await mockLogin('Analyst Manager');
      } else if (provider === 'guest') {
        // Mock guest login
        await mockLogin('Investment Analyst');
      } else {
        // Fallback to mock login
        await mockLogin('Investment Analyst');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setMsalError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const mockLogin = async (role: UserRole) => {
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = mockUsers[role];
    console.log('AuthContext - Mock login with role:', role);
    setUser(mockUser);
    
    // Save to localStorage
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
    console.log('AuthContext - User saved to localStorage');
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      if (msalService.isAuthenticated()) {
        // Logout from MSAL
        await msalService.logout();
      }
      
      // Clear local state
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      console.log('AuthContext - User logged out');
    } catch (error) {
      console.error('Logout failed:', error);
      setMsalError(error instanceof Error ? error.message : 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRole = (): UserRole | null => {
    if (!user) return null;
    return user.role;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    getUserRole,
    msalInitialized,
    msalError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 