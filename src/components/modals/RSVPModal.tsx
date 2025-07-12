import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { User, Event } from '../AgoraCalendar';

interface RSVPModalProps {
  event: Event;
  currentUser: User;
  onClose: () => void;
  onRSVP: (eventId: string, response: 'accepted' | 'declined' | 'tentative') => void;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({
  event,
  currentUser,
  onClose,
  onRSVP,
}) => {
  const currentRSVP = event.rsvps[currentUser.id];

  const handleRSVP = (response: 'accepted' | 'declined' | 'tentative') => {
    onRSVP(event.id, response);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'earnings': return 'bg-earnings';
      case 'roadshow': return 'bg-roadshow';
      case 'conference': return 'bg-conference';
      case 'meeting': return 'bg-meeting';
      default: return 'bg-muted';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
            {event.title}
          </DialogTitle>
          <DialogDescription>
            Respond to this event invitation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/20 border border-border">
              <p className="text-foreground mb-3">{event.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{event.company}</span>
                </div>
              </div>
              
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="outline" className="capitalize">{event.type}</Badge>
                <Badge variant="secondary">{event.purpose}</Badge>
              </div>
            </div>
          </div>

          {/* Current RSVP Status */}
          {currentRSVP && (
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                {currentRSVP === 'accepted' && <CheckCircle className="h-5 w-5 text-success" />}
                {currentRSVP === 'declined' && <XCircle className="h-5 w-5 text-destructive" />}
                {currentRSVP === 'tentative' && <AlertCircle className="h-5 w-5 text-warning" />}
                <span className="font-medium">
                  Current Response: <span className="capitalize">{currentRSVP}</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                You can change your response at any time before the event.
              </p>
            </div>
          )}

          {/* RSVP Actions */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">
              {currentRSVP ? 'Update your response:' : 'Please respond to this invitation:'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant={currentRSVP === 'accepted' ? 'success' : 'outline'}
                onClick={() => handleRSVP('accepted')}
                className="justify-start"
              >
                <CheckCircle className="h-4 w-4" />
                Accept
              </Button>
              
              <Button
                variant={currentRSVP === 'tentative' ? 'warning' : 'outline'}
                onClick={() => handleRSVP('tentative')}
                className="justify-start"
              >
                <AlertCircle className="h-4 w-4" />
                Tentative
              </Button>
              
              <Button
                variant={currentRSVP === 'declined' ? 'destructive' : 'outline'}
                onClick={() => handleRSVP('declined')}
                className="justify-start"
              >
                <XCircle className="h-4 w-4" />
                Decline
              </Button>
            </div>
          </div>

          {/* Additional Actions for Analyst Manager */}
          {currentUser.role === 'analyst-manager' && (
            <div className="pt-4 border-t border-border">
              <h4 className="font-medium text-foreground mb-3">Team Management</h4>
              <Button variant="manager" className="w-full">
                Assign to Team Members
              </Button>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Event created by {event.company} IR Team
            </div>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};