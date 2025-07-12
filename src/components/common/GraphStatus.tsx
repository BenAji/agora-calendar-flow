import React from 'react';
import { useGraph } from '@/contexts/GraphContext';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export const GraphStatus: React.FC = () => {
  const { isLoading, error, isGraphAvailable, clearError } = useGraph();

  if (!isGraphAvailable) {
    return (
      <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          Microsoft Graph API is not available. Please ensure you are authenticated with Microsoft.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Connecting to Microsoft Graph...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertDescription className="text-red-800 dark:text-red-200">
          <div className="flex items-center justify-between">
            <span>Graph API Error: {error}</span>
            <button
              onClick={clearError}
              className="text-xs underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      <Badge variant="secondary" className="text-xs">
        Connected to Microsoft Graph
      </Badge>
    </div>
  );
}; 