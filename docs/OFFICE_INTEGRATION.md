# Office.js Integration for AgoraCalendar

This document explains the Office.js integration implemented in AgoraCalendar for Microsoft Outlook Add-in functionality.

## Overview

AgoraCalendar is designed as a Microsoft Outlook Add-in that provides advanced calendar and event management for Investor Relations teams and Investment Analysts. The Office.js integration enables seamless interaction with Outlook calendar data and provides a native add-in experience.

## Architecture

### Core Components

1. **OfficeService** (`src/services/officeService.ts`)
   - Handles Office.js initialization and API calls
   - Provides calendar event management
   - Manages user authentication and context

2. **OfficeContext** (`src/contexts/OfficeContext.tsx`)
   - React context for Office.js functionality
   - Provides Office state throughout the app
   - Handles Office.js initialization lifecycle

3. **OfficeStatus** (`src/components/common/OfficeStatus.tsx`)
   - UI component showing Office integration status
   - Displays platform information and available features

### Key Features

#### 1. Calendar Integration
- **Read Calendar Events**: Fetch events from Outlook calendar
- **Create Events**: Add new events to Outlook calendar
- **Update Events**: Modify existing calendar events
- **Delete Events**: Remove events from Outlook calendar

#### 2. User Context
- **Get User Email**: Retrieve current user's email from Outlook
- **Platform Detection**: Identify if running in desktop, web, or mobile Outlook
- **Authentication**: Handle Office.js authentication tokens

#### 3. Navigation
- **Date Navigation**: Navigate to specific dates in Outlook calendar
- **Date Range Selection**: Get selected date range from calendar view

#### 4. Notifications
- **Office Notifications**: Show notifications within Outlook interface
- **Status Updates**: Provide feedback for user actions

## Usage

### Basic Setup

The Office.js integration is automatically initialized when the app starts:

```typescript
// App.tsx
<OfficeProvider config={officeConfig}>
  <AuthWrapper>
    {/* Your app components */}
  </AuthWrapper>
</OfficeProvider>
```

### Using Office Context

```typescript
import { useOffice } from '@/contexts/OfficeContext';

const MyComponent = () => {
  const { 
    isOfficeAvailable, 
    isInitialized, 
    getCalendarEvents,
    createCalendarEvent,
    showNotification 
  } = useOffice();

  const handleCreateEvent = async () => {
    if (isOfficeAvailable) {
      const eventId = await createCalendarEvent({
        subject: 'New Event',
        start: new Date(),
        end: new Date(),
        location: 'Virtual',
        isAllDay: false
      });
      
      await showNotification('Event created successfully!', 'success');
    }
  };

  return (
    <div>
      {isOfficeAvailable ? 'Running in Outlook' : 'Standalone mode'}
    </div>
  );
};
```

### Office Status Component

The `OfficeStatus` component automatically displays:
- Connection status (Connected/Standalone)
- Platform information (Desktop/Web/Mobile)
- Current user email
- Available features

## Development

### Running in Outlook

1. **Development Server**: Start the development server
   ```bash
   npm run dev
   ```

2. **Office Add-in**: Use the manifest file to sideload the add-in
   - Copy `public/manifest.xml` to your Office Add-in development environment
   - Update URLs to point to your development server
   - Sideload the add-in in Outlook

3. **Testing**: The app will detect Office.js availability and adapt accordingly

### Standalone Mode

When Office.js is not available (e.g., running in browser), the app runs in standalone mode:
- All Office.js functions return mock data or null
- UI adapts to show standalone status
- Full functionality is preserved for development/testing

## Configuration

### Environment Variables

```env
VITE_OFFICE_CLIENT_ID=your-client-id
VITE_OFFICE_REDIRECT_URI=http://localhost:3000
```

### Office Service Configuration

```typescript
const officeConfig = {
  clientId: process.env.VITE_OFFICE_CLIENT_ID || 'your-client-id',
  redirectUri: process.env.VITE_OFFICE_REDIRECT_URI || 'http://localhost:3000'
};
```

## API Reference

### OfficeService Methods

#### `initialize(config?: OfficeServiceConfig): Promise<void>`
Initialize Office.js integration.

#### `isOfficeAvailable(): boolean`
Check if Office.js is available and initialized.

#### `getCurrentUserEmail(): Promise<string | null>`
Get the current user's email from Outlook.

#### `getCalendarEvents(startDate: Date, endDate: Date): Promise<OfficeCalendarEvent[]>`
Fetch calendar events for a date range.

#### `createCalendarEvent(event: Omit<OfficeCalendarEvent, 'id'>): Promise<string | null>`
Create a new calendar event.

#### `updateCalendarEvent(eventId: string, event: Partial<OfficeCalendarEvent>): Promise<boolean>`
Update an existing calendar event.

#### `deleteCalendarEvent(eventId: string): Promise<boolean>`
Delete a calendar event.

#### `getSelectedDateRange(): Promise<{ start: Date; end: Date } | null>`
Get the currently selected date range from Outlook.

#### `navigateToDate(date: Date): Promise<void>`
Navigate to a specific date in Outlook calendar.

#### `showNotification(message: string, type?: 'info' | 'success' | 'warning' | 'error'): Promise<void>`
Show a notification in Outlook.

#### `getOfficeContext(): 'desktop' | 'web' | 'mobile' | 'unknown'`
Get the current Office platform context.

### OfficeContext Hook

The `useOffice()` hook provides access to all Office.js functionality:

```typescript
const {
  isOfficeAvailable,
  isInitialized,
  officeContext,
  currentUserEmail,
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getSelectedDateRange,
  navigateToDate,
  showNotification,
  initialize
} = useOffice();
```

## Error Handling

The Office.js integration includes comprehensive error handling:

- **Graceful Degradation**: App works in standalone mode when Office.js is unavailable
- **Initialization Errors**: Proper error handling during Office.js initialization
- **API Failures**: Fallback behavior for failed Office.js API calls
- **User Feedback**: Notifications and status updates for user actions

## Testing

### Unit Tests

```typescript
// Test Office.js availability
const { isOfficeAvailable } = useOffice();
expect(isOfficeAvailable).toBe(false); // In test environment

// Test mock data
const events = await getCalendarEvents(new Date(), new Date());
expect(events).toEqual([]); // Returns empty array in standalone mode
```

### Integration Tests

1. **Office.js Available**: Test with Office.js environment
2. **Standalone Mode**: Test without Office.js
3. **Error Scenarios**: Test API failures and edge cases

## Deployment

### Production Setup

1. **Update Manifest**: Modify `public/manifest.xml` with production URLs
2. **Environment Variables**: Set production Office.js configuration
3. **Build**: Create production build with Office.js support
4. **Deploy**: Deploy to hosting service with HTTPS
5. **Sideload**: Install add-in in production Outlook environment

### Office Store Deployment

1. **Manifest Validation**: Validate manifest against Office Add-in requirements
2. **Security Review**: Ensure compliance with Office security policies
3. **Store Submission**: Submit to Office Add-in store
4. **Distribution**: Make available through Office store

## Troubleshooting

### Common Issues

1. **Office.js Not Available**
   - Check if running in Outlook environment
   - Verify manifest configuration
   - Ensure HTTPS is enabled

2. **Authentication Issues**
   - Verify client ID and redirect URI
   - Check Office.js permissions
   - Validate token handling

3. **Calendar Access**
   - Ensure proper permissions in manifest
   - Verify Microsoft Graph API access
   - Check calendar event format

### Debug Mode

Enable debug logging:

```typescript
// In officeService.ts
console.log('Office.js status:', this.isOfficeAvailable());
console.log('Office context:', this.getOfficeContext());
```

## Future Enhancements

1. **Real-time Sync**: Implement real-time calendar synchronization
2. **Advanced Permissions**: Add granular permission management
3. **Offline Support**: Enable offline functionality with sync
4. **Multi-platform**: Extend to other Office applications
5. **Advanced Analytics**: Integrate with Office analytics APIs 