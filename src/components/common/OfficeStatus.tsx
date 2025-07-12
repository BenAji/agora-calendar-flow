import React from 'react';
import { useOffice } from '@/contexts/OfficeContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Monitor, 
  Globe, 
  Smartphone,
  Mail,
  Calendar
} from 'lucide-react';

export const OfficeStatus: React.FC = () => {
  const { 
    isOfficeAvailable, 
    isInitialized, 
    officeContext, 
    currentUserEmail 
  } = useOffice();

  const getStatusIcon = () => {
    if (!isInitialized) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
    return isOfficeAvailable 
      ? <CheckCircle className="h-4 w-4 text-green-500" /> 
      : <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = () => {
    if (!isInitialized) return 'Initializing...';
    return isOfficeAvailable ? 'Connected' : 'Standalone Mode';
  };

  const getContextIcon = () => {
    switch (officeContext) {
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      case 'web':
        return <Globe className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getContextText = () => {
    switch (officeContext) {
      case 'desktop':
        return 'Desktop Outlook';
      case 'web':
        return 'Outlook Web';
      case 'mobile':
        return 'Mobile Outlook';
      default:
        return 'Unknown Platform';
    }
  };

  if (!isInitialized) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Office Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm text-muted-foreground">{getStatusText()}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Office Integration
        </CardTitle>
        <CardDescription className="text-xs">
          Outlook Add-in Status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </div>

        {/* Platform */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Platform</span>
          <div className="flex items-center gap-2">
            {getContextIcon()}
            <span className="text-sm font-medium">{getContextText()}</span>
          </div>
        </div>

        {/* User Email */}
        {currentUserEmail && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">User</span>
            <span className="text-sm font-medium truncate max-w-32">
              {currentUserEmail}
            </span>
          </div>
        )}

        {/* Features Available */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Available Features</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              Calendar Sync
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Event Creation
            </Badge>
            {isOfficeAvailable && (
              <Badge variant="secondary" className="text-xs">
                Outlook Integration
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 