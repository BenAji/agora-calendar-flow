import { 
  PublicClientApplication, 
  Configuration, 
  AuthenticationResult, 
  AccountInfo,
  SilentRequest,
  PopupRequest,
  RedirectRequest,
  InteractionRequiredAuthError,
  BrowserAuthError
} from '@azure/msal-browser';

export interface MSALConfig {
  auth: {
    clientId: string;
    authority: string;
    redirectUri: string;
    postLogoutRedirectUri?: string;
  };
  cache: {
    cacheLocation: 'sessionStorage' | 'localStorage';
    storeAuthStateInCookie: boolean;
  };
  system: {
    allowRedirectInIframe: boolean;
  };
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: 'IR Admin' | 'Analyst Manager' | 'Investment Analyst';
  company: string;
  tenantId?: string;
  objectId?: string;
}

class MSALService {
  private msalInstance: PublicClientApplication | null = null;
  private config: MSALConfig | null = null;
  private isInitialized = false;

  /**
   * Initialize MSAL with configuration
   */
  async initialize(config: MSALConfig): Promise<void> {
    try {
      this.config = config;
      
      const msalConfig: Configuration = {
        auth: {
          clientId: config.auth.clientId,
          authority: config.auth.authority,
          redirectUri: config.auth.redirectUri,
          postLogoutRedirectUri: config.auth.postLogoutRedirectUri || config.auth.redirectUri,
        },
        cache: {
          cacheLocation: config.cache.cacheLocation,
          storeAuthStateInCookie: config.cache.storeAuthStateInCookie,
        },
        system: {
          allowRedirectInIframe: config.system.allowRedirectInIframe,
        },
      };

      this.msalInstance = new PublicClientApplication(msalConfig);
      
      // Handle redirect response
      await this.msalInstance.handleRedirectPromise();
      
      this.isInitialized = true;
      console.log('MSAL initialized successfully');
    } catch (error) {
      console.error('Failed to initialize MSAL:', error);
      throw error;
    }
  }

  /**
   * Check if MSAL is initialized
   */
  isMSALInitialized(): boolean {
    return this.isInitialized && this.msalInstance !== null;
  }

  /**
   * Get the MSAL instance
   */
  getMSALInstance(): PublicClientApplication | null {
    return this.msalInstance;
  }

  /**
   * Get current account
   */
  getCurrentAccount(): AccountInfo | null {
    if (!this.msalInstance) return null;
    
    const currentAccounts = this.msalInstance.getAllAccounts();
    if (currentAccounts.length === 0) return null;
    
    // Return the first account (in a real app, you might want to handle multiple accounts)
    return currentAccounts[0];
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentAccount() !== null;
  }

  /**
   * Login with popup
   */
  async loginPopup(scopes: string[] = ['User.Read', 'Calendars.ReadWrite']): Promise<AuthenticationResult> {
    if (!this.msalInstance) {
      throw new Error('MSAL not initialized');
    }

    const loginRequest: PopupRequest = {
      scopes: scopes,
      prompt: 'select_account',
    };

    try {
      const response = await this.msalInstance.loginPopup(loginRequest);
      console.log('Login successful:', response);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Login with redirect
   */
  async loginRedirect(scopes: string[] = ['User.Read', 'Calendars.ReadWrite']): Promise<void> {
    if (!this.msalInstance) {
      throw new Error('MSAL not initialized');
    }

    const loginRequest: RedirectRequest = {
      scopes: scopes,
      prompt: 'select_account',
    };

    try {
      await this.msalInstance.loginRedirect(loginRequest);
    } catch (error) {
      console.error('Login redirect failed:', error);
      throw error;
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    if (!this.msalInstance) {
      throw new Error('MSAL not initialized');
    }

    const account = this.getCurrentAccount();
    if (!account) {
      console.log('No account to logout');
      return;
    }

    try {
      await this.msalInstance.logoutPopup({
        account: account,
        postLogoutRedirectUri: this.config?.auth.postLogoutRedirectUri || this.config?.auth.redirectUri,
      });
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  /**
   * Get access token silently
   */
  async getAccessToken(scopes: string[] = ['User.Read', 'Calendars.ReadWrite']): Promise<string | null> {
    if (!this.msalInstance) {
      throw new Error('MSAL not initialized');
    }

    const account = this.getCurrentAccount();
    if (!account) {
      console.log('No account found');
      return null;
    }

    const silentRequest: SilentRequest = {
      account: account,
      scopes: scopes,
    };

    try {
      const response = await this.msalInstance.acquireTokenSilent(silentRequest);
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        console.log('Silent token acquisition failed, user interaction required');
        return null;
      }
      console.error('Token acquisition failed:', error);
      throw error;
    }
  }

  /**
   * Get access token with popup if silent fails
   */
  async getAccessTokenWithPopup(scopes: string[] = ['User.Read', 'Calendars.ReadWrite']): Promise<string | null> {
    try {
      const token = await this.getAccessToken(scopes);
      if (token) return token;

      // If silent acquisition fails, try popup
      const response = await this.msalInstance!.acquireTokenPopup({
        scopes: scopes,
        account: this.getCurrentAccount()!,
      });
      return response.accessToken;
    } catch (error) {
      console.error('Token acquisition with popup failed:', error);
      throw error;
    }
  }

  /**
   * Get user information from Microsoft Graph
   */
  async getUserInfo(): Promise<UserInfo | null> {
    try {
      const token = await this.getAccessTokenWithPopup(['User.Read']);
      if (!token) return null;

      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user info: ${response.statusText}`);
      }

      const userData = await response.json();
      
      // Map Microsoft Graph user data to our UserInfo format
      // In a real app, you might want to fetch role information from your backend
      const userInfo: UserInfo = {
        id: userData.id,
        name: userData.displayName || userData.userPrincipalName,
        email: userData.mail || userData.userPrincipalName,
        role: 'Investment Analyst', // Default role, should be fetched from your backend
        company: userData.companyName || 'Unknown Company',
        tenantId: userData.tenantId,
        objectId: userData.id,
      };

      return userInfo;
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  }

  /**
   * Get user roles from your backend (placeholder)
   */
  async getUserRoles(userId: string): Promise<string[]> {
    // In a real implementation, this would call your backend API
    // to get the user's roles based on their Azure AD object ID
    try {
      const token = await this.getAccessTokenWithPopup(['User.Read']);
      if (!token) return [];

      // Mock implementation - replace with actual backend call
      const response = await fetch(`/api/users/${userId}/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const roles = await response.json();
        return roles;
      }

      // Fallback to mock roles for development
      return ['Investment Analyst'];
    } catch (error) {
      console.error('Failed to get user roles:', error);
      return ['Investment Analyst'];
    }
  }

  /**
   * Handle redirect response (call this in your app initialization)
   */
  async handleRedirectResponse(): Promise<AuthenticationResult | null> {
    if (!this.msalInstance) {
      throw new Error('MSAL not initialized');
    }

    try {
      const response = await this.msalInstance.handleRedirectPromise();
      if (response) {
        console.log('Redirect response handled:', response);
      }
      return response;
    } catch (error) {
      console.error('Failed to handle redirect response:', error);
      throw error;
    }
  }

  /**
   * Get authentication state
   */
  getAuthState() {
    return {
      isAuthenticated: this.isAuthenticated(),
      account: this.getCurrentAccount(),
      isInitialized: this.isInitialized,
    };
  }
}

// Export a singleton instance
export const msalService = new MSALService(); 