import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { importEventsFromCSV, validateEventCSV, CSVEvent } from '@/utils/csvUtils';

interface CSVImportModalProps {
  onImport: (events: CSVEvent[]) => void;
  trigger?: React.ReactNode;
}

export const CSVImportModal: React.FC<CSVImportModalProps> = ({ onImport, trigger }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
  } | null>(null);
  const [importedEvents, setImportedEvents] = useState<CSVEvent[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsLoading(true);
    setValidationResult(null);
    setImportedEvents([]);

    try {
      const text = await selectedFile.text();
      const validation = await validateEventCSV(text);
      setValidationResult(validation);

      if (validation.isValid) {
        const events = await importEventsFromCSV(text);
        setImportedEvents(events);
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (importedEvents.length > 0) {
      onImport(importedEvents);
      setOpen(false);
      setFile(null);
      setValidationResult(null);
      setImportedEvents([]);
    }
  };

  const downloadTemplate = () => {
    const template = `title,company,type,date,startTime,endTime,location,marketCap,description
Q4 Earnings Call,Apple Inc.,earnings,2024-01-15,10:00 AM,11:00 AM,Virtual,Large Cap,Fourth quarter earnings conference call
Analyst Meeting,Microsoft Corp.,meeting,2024-01-18,2:00 PM,3:30 PM,Seattle WA,Large Cap,One-on-one analyst meeting
Roadshow Presentation,Tesla Inc.,roadshow,2024-01-20,11:30 AM,12:30 PM,New York NY,Large Cap,Investor roadshow presentation`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'event_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Events
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Import Events from CSV</span>
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple events at once
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* File Upload */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">Select CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <FileText className="h-4 w-4 mr-2" />
                Download Template
              </Button>
              <span className="text-sm text-muted-foreground">
                Use our template to ensure proper formatting
              </span>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm">Processing CSV file...</span>
            </div>
          )}

          {/* Validation Results */}
          {validationResult && (
            <div className="space-y-4">
              {validationResult.isValid ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    CSV file is valid! Found {importedEvents.length} events to import.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p>CSV file has validation errors:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {validationResult.errors.map((error, index) => (
                          <li key={index} className="text-sm">{error}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Preview Imported Events */}
          {importedEvents.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Preview ({importedEvents.length} events)</h4>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {importedEvents.slice(0, 5).map((event, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.company} • {event.type} • {event.date}
                    </div>
                  </div>
                ))}
                {importedEvents.length > 5 && (
                  <div className="text-sm text-muted-foreground text-center">
                    ... and {importedEvents.length - 5} more events
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleImport}
              disabled={!validationResult?.isValid || importedEvents.length === 0}
            >
              Import {importedEvents.length > 0 ? `(${importedEvents.length})` : ''} Events
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 