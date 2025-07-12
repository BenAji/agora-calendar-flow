import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Building2, Plus, Edit } from 'lucide-react';
import { Event, EventType } from '@/components/screens/EventManagementScreen';
import { useAuth } from '@/contexts/AuthContext';

interface CreateEventModalProps {
  event?: Event;
  onSave: (event: Omit<Event, 'id' | 'createdBy' | 'createdAt'>) => void;
  trigger?: React.ReactNode;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ 
  event, 
  onSave, 
  trigger 
}) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: event?.title || '',
    company: event?.company || '',
    type: event?.type || 'meeting' as EventType,
    date: event?.date || '',
    startTime: event?.startTime || '',
    endTime: event?.endTime || '',
    location: event?.location || '',
    marketCap: event?.marketCap || 'Large Cap',
    description: event?.description || '',
    status: event?.status || 'upcoming' as 'active' | 'upcoming' | 'completed'
  });

  // For IR Admin, automatically set company to their company and make it read-only
  useEffect(() => {
    if (user?.role === 'IR Admin' && user?.company && !event) {
      setFormData(prev => ({
        ...prev,
        company: user.company
      }));
    }
  }, [user, event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent = {
      ...formData,
      rsvps: event?.rsvps || {}
    };
    
    onSave(newEvent);
    setOpen(false);
    setFormData({
      title: '',
      company: '',
      type: 'meeting',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      marketCap: 'Large Cap',
      description: '',
      status: 'upcoming'
    });
  };

  const handleInputChange = (field: string, value: string) => {
    // Prevent company changes for IR Admin users
    if (field === 'company' && user?.role === 'IR Admin') {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {event ? 'Edit Event' : 'Create Event'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {event ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            <span>{event ? 'Edit Event' : 'Create New Event'}</span>
          </DialogTitle>
          <DialogDescription>
            {event ? 'Update event details and settings' : 'Create a new event for your calendar'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Q4 Earnings Call"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Apple Inc."
                required
                readOnly={user?.role === 'IR Admin'}
                className={user?.role === 'IR Admin' ? 'bg-muted cursor-not-allowed' : ''}
              />
              {user?.role === 'IR Admin' && (
                <p className="text-xs text-muted-foreground">
                  Company is automatically set to {user.company}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Event Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="earnings">Earnings Call</SelectItem>
                  <SelectItem value="meeting">Analyst Meeting</SelectItem>
                  <SelectItem value="conference">Conference Call</SelectItem>
                  <SelectItem value="roadshow">Roadshow</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="marketCap">Market Cap</Label>
              <Select value={formData.marketCap} onValueChange={(value) => handleInputChange('marketCap', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Large Cap">Large Cap</SelectItem>
                  <SelectItem value="Mid Cap">Mid Cap</SelectItem>
                  <SelectItem value="Small Cap">Small Cap</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Virtual or Physical Location"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Event description and details..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {event ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};