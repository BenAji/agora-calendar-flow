import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, MapPin, Building2, Users, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/components/screens/EventManagementScreen';
import { format } from 'date-fns';

interface RSVPModalProps {
  event: Event;
  onRSVP: (eventId: string, response: 'accepted' | 'declined' | 'tentative') => void;
  onAssign?: (eventId: string, analystEmail: string) => void;
  trigger?: React.ReactNode;
}

// Mock analysts for assignment (in real app, this would come from API)
const mockAnalysts = [
  { email: 'analyst1@company.com', name: 'John Smith', role: 'Investment Analyst' },
  { email: 'analyst2@company.com', name: 'Sarah Johnson', role: 'Investment Analyst' },
  { email: 'analyst3@company.com', name: 'Mike Davis', role: 'Investment Analyst' },
  { email: 'analyst4@company.com', name: 'Lisa Wilson', role: 'Investment Analyst' }
];

export const RSVPModal: React.FC<RSVPModalProps> = ({ 
  event, 
  onRSVP, 
  onAssign, 
  trigger 
}) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = useState<string>('');
  const [userResponse, setUserResponse] = useState<'accepted' | 'declined' | 'tentative' | null>(null);

  const currentUserRSVP = event.rsvps[user?.email || ''];

  const handleRSVP = (response: 'accepted' | 'declined' | 'tentative') => {
    if (user?.email) {
      onRSVP(event.id, response);
      setUserResponse(response);
    }
  };

  const handleAssign = () => {
    if (selectedAnalyst && onAssign) {
      onAssign(event.id, selectedAnalyst);
      setSelectedAnalyst('');
    }
  };

  const getResponseColor = (response: string) => {
    switch (response) {
      case 'accepted': return 'bg-success text-success-foreground';
      case 'declined': return 'bg-destructive text-destructive-foreground';
      case 'tentative': return 'bg-warning text-warning-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getResponseIcon = (response: string) => {
    switch (response) {
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'declined': return <XCircle className="h-4 w-4" />;
      case 'tentative': return <ClockIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            RSVP
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Event RSVP</span>
          </DialogTitle>
          <DialogDescription>
            Respond to this event invitation or assign it to analysts
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Event Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-muted-foreground">{event.company}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{event.startTime} - {event.endTime}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{event.location}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{event.marketCap}</span>
              </div>
            </div>
            
            {event.description && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{event.description}</p>
              </div>
            )}
          </div>

          {/* Current RSVPs */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Current RSVPs ({Object.keys(event.rsvps).length})</span>
            </h4>
            
            {Object.keys(event.rsvps).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(event.rsvps).map(([email, response]) => (
                  <div key={email} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{email}</span>
                    <Badge className={getResponseColor(response)}>
                      <div className="flex items-center space-x-1">
                        {getResponseIcon(response)}
                        <span>{response}</span>
                      </div>
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No RSVPs yet</p>
            )}
          </div>

          {/* User RSVP Section */}
          {user && (
            <div className="space-y-3">
              <h4 className="font-medium">Your Response</h4>
              
              {currentUserRSVP ? (
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="text-sm">Your RSVP:</span>
                  <Badge className={getResponseColor(currentUserRSVP)}>
                    <div className="flex items-center space-x-1">
                      {getResponseIcon(currentUserRSVP)}
                      <span>{currentUserRSVP}</span>
                    </div>
                  </Badge>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleRSVP('accepted')}
                    className="flex-1"
                    variant="outline"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                  <Button 
                    onClick={() => handleRSVP('tentative')}
                    className="flex-1"
                    variant="outline"
                  >
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Tentative
                  </Button>
                  <Button 
                    onClick={() => handleRSVP('declined')}
                    className="flex-1"
                    variant="outline"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Decline
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Analyst Assignment (Analyst Managers Only) */}
          {user?.role === 'Analyst Manager' && onAssign && (
            <div className="space-y-3">
              <h4 className="font-medium">Assign to Analyst</h4>
              
              <div className="flex space-x-2">
                <Select value={selectedAnalyst} onValueChange={setSelectedAnalyst}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select analyst..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAnalysts.map(analyst => (
                      <SelectItem key={analyst.email} value={analyst.email}>
                        {analyst.name} ({analyst.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={handleAssign}
                  disabled={!selectedAnalyst}
                  size="sm"
                >
                  Assign
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};