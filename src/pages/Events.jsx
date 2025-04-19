
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Calendar as CalendarIcon, MapPin, Clock, Users, Plus, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const Events = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: new Date(),
    time: '12:00',
    location: '',
    category: '',
    organizerName: currentUser?.name || '',
    organizerId: currentUser?.id || '',
  });
  
  // Load events from localStorage on mount
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('campusEvents') || '[]');
    setEvents(storedEvents);
  }, []);
  
  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.location || !newEvent.category) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    // Combine date and time
    const [hours, minutes] = newEvent.time.split(':').map(Number);
    const eventDate = new Date(newEvent.date);
    eventDate.setHours(hours, minutes);
    
    const eventToSave = {
      ...newEvent,
      id: Date.now().toString(),
      date: eventDate.toISOString(),
      attendees: [],
      createdAt: new Date().toISOString()
    };
    
    // Add to state and localStorage
    const updatedEvents = [eventToSave, ...events];
    setEvents(updatedEvents);
    localStorage.setItem('campusEvents', JSON.stringify(updatedEvents));
    
    // Reset form and close dialog
    setNewEvent({
      title: '',
      description: '',
      date: new Date(),
      time: '12:00',
      location: '',
      category: '',
      organizerName: currentUser?.name || '',
      organizerId: currentUser?.id || '',
    });
    
    setIsDialogOpen(false);
    
    toast({
      title: 'Event created',
      description: 'Your event has been successfully created'
    });
  };
  
  const handleRSVP = (eventId) => {
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => {
        if (event.id === eventId) {
          const isAttending = event.attendees.includes(currentUser.id);
          let updatedAttendees;
          
          if (isAttending) {
            // Remove user from attendees
            updatedAttendees = event.attendees.filter(id => id !== currentUser.id);
            toast({
              title: 'RSVP cancelled',
              description: `You are no longer attending "${event.title}"`
            });
          } else {
            // Add user to attendees
            updatedAttendees = [...event.attendees, currentUser.id];
            toast({
              title: 'RSVP confirmed',
              description: `You are now attending "${event.title}"`
            });
          }
          
          return {
            ...event,
            attendees: updatedAttendees
          };
        }
        return event;
      });
      
      localStorage.setItem('campusEvents', JSON.stringify(updatedEvents));
      return updatedEvents;
    });
  };
  
  // Filter events based on category and date
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const selectedDate = new Date(date);
    
    const dateMatches = 
      eventDate.getFullYear() === selectedDate.getFullYear() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getDate() === selectedDate.getDate();
    
    const categoryMatches = filterCategory ? event.category === filterCategory : true;
    
    return dateMatches && categoryMatches;
  });
  
  // Sort events by date (most recent first)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  
  const categories = [
    'Academic',
    'Social',
    'Sports',
    'Cultural',
    'Workshop',
    'Other'
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campus Events</h1>
          <p className="text-gray-600 mt-1">Stay updated with what's happening around campus</p>
        </div>
        
        <Button
          className="mt-4 md:mt-0 bg-uniblue-500 hover:bg-uniblue-600"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <div className="flex-grow">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="w-full md:w-64">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => {
            setDate(new Date());
            setFilterCategory('');
          }}
        >
          Reset Filters
        </Button>
      </div>
      
      {/* Events List */}
      {sortedEvents.length > 0 ? (
        <div className="space-y-6">
          {sortedEvents.map((event) => {
            const eventDate = new Date(event.date);
            const isAttending = event.attendees.includes(currentUser?.id);
            
            return (
              <Card key={event.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Organized by {event.organizerName}
                      </CardDescription>
                    </div>
                    <Badge className={cn(
                      "px-3 py-1",
                      event.category === "Academic" && "bg-blue-100 text-blue-800",
                      event.category === "Social" && "bg-purple-100 text-purple-800",
                      event.category === "Sports" && "bg-green-100 text-green-800",
                      event.category === "Cultural" && "bg-orange-100 text-orange-800",
                      event.category === "Workshop" && "bg-teal-100 text-teal-800",
                      event.category === "Other" && "bg-gray-100 text-gray-800"
                    )}>
                      {event.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2 text-uniblue-500" />
                      <span>{format(eventDate, "EEEE, MMMM d, yyyy")}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-2 text-uniblue-500" />
                      <span>{format(eventDate, "h:mm a")}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2 text-uniblue-500" />
                      <span>{event.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-2 text-uniblue-500" />
                      <span>{event.attendees.length} {event.attendees.length === 1 ? 'person' : 'people'} attending</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                  <Button 
                    className={cn(
                      "w-full",
                      isAttending ? "bg-green-500 hover:bg-green-600" : "bg-uniblue-500 hover:bg-uniblue-600"
                    )}
                    onClick={() => handleRSVP(event.id)}
                  >
                    {isAttending ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> 
                        You're Attending
                      </>
                    ) : (
                      <>
                        <Users className="mr-2 h-4 w-4" /> 
                        RSVP
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-500">No events on this date.</p>
          <p className="text-gray-500 mt-2">Try selecting a different date or create your own event!</p>
        </div>
      )}
      
      {/* Create Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create a New Event</DialogTitle>
            <DialogDescription>
              Enter the details of your campus event. Required fields are marked with *.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g., Engineering Workshop"
                className="col-span-3"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your event..."
                className="col-span-3"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date *
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newEvent.date ? format(newEvent.date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={newEvent.date}
                      onSelect={(date) => date && setNewEvent({...newEvent, date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time *
              </Label>
              <Input
                id="time"
                type="time"
                className="col-span-3"
                value={newEvent.time}
                onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location *
              </Label>
              <Input
                id="location"
                placeholder="e.g., Engineering Auditorium"
                className="col-span-3"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category *
              </Label>
              <Select 
                value={newEvent.category} 
                onValueChange={(value) => setNewEvent({...newEvent, category: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEvent}
              className="bg-uniblue-500 hover:bg-uniblue-600"
            >
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;
