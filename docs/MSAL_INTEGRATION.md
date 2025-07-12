# MSAL Authentication Integration

This document explains the Microsoft Authentication Library (MSAL) integration implemented in AgoraCalendar for secure Azure AD authentication.

## Overview

AgoraCalendar uses MSAL.js to provide secure authentication with Microsoft Azure Active Directory (Azure AD). This enables single sign-on (SSO) for enterprise users and secure access to Microsoft Graph API resources.

## Architecture

### Core Components

1. **MSALService** (`src/services/msalService.ts`)
   - Handles MSAL initialization and configuration
   - Manages authentication flows (popup, redirect)
   - Provides token acquisition and management
   - Integrates with Microsoft Graph API

2. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - React context for authentication state
   - Integrates MSAL with React components
   - Handles user session management
   - Provides fallback to mock authentication

3. **LoginScreen** (`src/components/screens/LoginScreen.tsx`)
   - Updated to use MSAL authentication
   - Supports multiple authentication providers
   - Displays MSAL status and errors

## Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# MSAL Configuration
VITE_MSAL_CLIENT_ID=your-azure-ad-client-id
VITE_MSAL_AUTHORITY=https://login.microsoftonline.com/common
VITE_MSAL_REDIRECT_URI=http://localhost:3000
VITE_MSAL_POST_LOGOUT_REDIRECT_URI=http://localhost:3000

# Office.js Configuration
VITE_OFFICE_CLIENT_ID=your-office-client-id
VITE_OFFICE_REDIRECT_URI=http://localhost:3000

# Microsoft Graph API Configuration
VITE_GRAPH_API_ENDPOINT=https://graph.microsoft.com/v1.0

# Development Settings
VITE_APP_ENV=development
VITE_DEBUG_MSAL=true
```

### Azure AD App Registration

1. **Register Application**
   - Go to Azure Portal > Azure Active Directory > App registrations
   - Click "New registration"
   - Enter app name: "AgoraCalendar"
   - Select supported account types
   - Set redirect URI: `http://localhost:3000`

2. **Configure Authentication**
   - Add platform: Single-page application (SPA)
   - Add redirect URI: `http://localhost:3000`
   - Enable implicit grant: Access tokens, ID tokens

3. **API Permissions**
   - Microsoft Graph > Delegated permissions
   - Add permissions:
     - `User.Read` - Read user profile
     - `Calendars.ReadWrite` - Read/write calendar events
     - `Mail.Read` - Read mail (for Outlook integration)

4. **Get Client ID**
   - Copy the Application (client) ID
   - Use as `VITE_MSAL_CLIENT_ID`

## Usage

### Basic Authentication Flow

```typescript
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { login, logout, user, isAuthenticated, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login('microsoft'); // Use MSAL
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Microsoft</button>
      )}
    </div>
  );
};
```

### Authentication Providers

The login function supports multiple providers:

```typescript
// Microsoft (MSAL)
await login('microsoft');

// Google (Mock for now)
await login('google');

// Guest (Mock for development)
await login('guest');
```

### Token Management

```typescript
import { msalService } from '@/services/msalService';

// Get access token for Microsoft Graph
const token = await msalService.getAccessTokenWithPopup([
  'User.Read', 
  'Calendars.ReadWrite'
]);

// Use token for API calls
const response = await fetch('https://graph.microsoft.com/v1.0/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

## Features

### 1. Secure Authentication
- **Azure AD Integration**: Enterprise-grade authentication
- **Single Sign-On**: Seamless login with existing Microsoft accounts
- **Token Management**: Automatic token refresh and storage
- **Session Persistence**: Maintains login state across browser sessions

### 2. Multiple Authentication Flows
- **Popup Authentication**: Modern, user-friendly popup flow
- **Redirect Authentication**: Traditional redirect flow for older browsers
- **Silent Token Acquisition**: Background token refresh without user interaction

### 3. Error Handling
- **Graceful Degradation**: Falls back to mock authentication if MSAL fails
- **User Feedback**: Clear error messages and loading states
- **Retry Logic**: Automatic retry for transient failures

### 4. Development Support
- **Mock Mode**: Works without Azure AD configuration
- **Debug Logging**: Detailed logs for troubleshooting
- **Environment Switching**: Easy configuration for different environments

## API Reference

### MSALService Methods

#### `initialize(config: MSALConfig): Promise<void>`
Initialize MSAL with configuration.

#### `isMSALInitialized(): boolean`
Check if MSAL is properly initialized.

#### `isAuthenticated(): boolean`
Check if user is currently authenticated.

#### `loginPopup(scopes?: string[]): Promise<AuthenticationResult>`
Login using popup flow.

#### `loginRedirect(scopes?: string[]): Promise<void>`
Login using redirect flow.

#### `logout(): Promise<void>`
Logout current user.

#### `getAccessToken(scopes?: string[]): Promise<string | null>`
Get access token silently.

#### `getAccessTokenWithPopup(scopes?: string[]): Promise<string | null>`
Get access token with popup if silent fails.

#### `getUserInfo(): Promise<UserInfo | null>`
Get user information from Microsoft Graph.

#### `handleRedirectResponse(): Promise<AuthenticationResult | null>`
Handle redirect response after authentication.

### AuthContext Hook

```typescript
const {
  user,                    // Current user information
  isAuthenticated,         // Authentication status
  isLoading,              // Loading state
  login,                  // Login function
  logout,                 // Logout function
  getUserRole,            // Get user role
  msalInitialized,        // MSAL initialization status
  msalError              // MSAL error messages
} = useAuth();
```

## Error Handling

### Common Errors

1. **MSAL Initialization Failed**
   - Check environment variables
   - Verify Azure AD app registration
   - Ensure HTTPS in production

2. **Login Failed**
   - Check network connectivity
   - Verify redirect URI configuration
   - Check browser popup blockers

3. **Token Acquisition Failed**
   - Check API permissions
   - Verify scopes configuration
   - Check token expiration

### Debug Mode

Enable debug logging:

```typescript
// In msalService.ts
console.log('MSAL config:', config);
console.log('Authentication result:', response);
console.log('Token acquired:', token);
```

## Security Considerations

### 1. Token Security
- Tokens are stored securely in browser storage
- Automatic token refresh prevents expiration
- Proper logout clears all tokens

### 2. Redirect URI Validation
- Only configured redirect URIs are accepted
- HTTPS required in production
- Proper URI validation prevents attacks

### 3. Scope Management
- Minimal required permissions
- User consent for sensitive operations
- Proper error handling for denied permissions

## Development Workflow

### 1. Local Development
```bash
# Copy environment template
cp env.example .env

# Edit environment variables
# Add your Azure AD client ID

# Start development server
npm run dev
```

### 2. Testing
- Test with mock authentication
- Test with real Azure AD
- Test error scenarios
- Test token refresh

### 3. Production Deployment
- Configure production redirect URIs
- Set up proper Azure AD app registration
- Enable HTTPS
- Configure proper CORS settings

## Troubleshooting

### Common Issues

1. **"MSAL not initialized"**
   - Check environment variables
   - Verify MSAL configuration
   - Check browser console for errors

2. **"Login failed"**
   - Check Azure AD app registration
   - Verify redirect URI
   - Check network connectivity

3. **"Token acquisition failed"**
   - Check API permissions
   - Verify scopes
   - Check user consent

### Debug Steps

1. **Check Environment Variables**
   ```bash
   echo $VITE_MSAL_CLIENT_ID
   echo $VITE_MSAL_AUTHORITY
   ```

2. **Check Browser Console**
   - Look for MSAL-related errors
   - Check network requests
   - Verify token responses

3. **Test Azure AD Configuration**
   - Verify app registration
   - Check API permissions
   - Test redirect URI

## Future Enhancements

1. **Multi-Tenant Support**: Support for multiple Azure AD tenants
2. **Advanced Token Management**: Custom token storage and refresh logic
3. **Role-Based Access**: Integration with Azure AD roles and groups
4. **Conditional Access**: Support for Azure AD conditional access policies
5. **Device Authentication**: Support for device-based authentication flows 