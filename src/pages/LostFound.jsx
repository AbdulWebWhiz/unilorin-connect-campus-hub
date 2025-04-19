
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, MapPin, Calendar, Check, X, MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const LostFound = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [items, setItems] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'lost',
    image: '',
    contact: currentUser?.phone || ''
  });
  
  // Load items from localStorage on mount
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('lostFoundItems') || '[]');
    setItems(storedItems);
  }, []);
  
  const handleSaveItem = () => {
    if (!newItem.title || !newItem.location || !newItem.type) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    const itemToSave = {
      ...newItem,
      id: `item-${Date.now()}`,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reporterEmail: currentUser.email,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    
    // Add to state and localStorage
    const updatedItems = [itemToSave, ...items];
    setItems(updatedItems);
    localStorage.setItem('lostFoundItems', JSON.stringify(updatedItems));
    
    // Reset form and close dialog
    setNewItem({
      title: '',
      description: '',
      location: '',
      category: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'lost',
      image: '',
      contact: currentUser?.phone || ''
    });
    
    setIsDialogOpen(false);
    
    // Add notification for demo purposes
    addNotification({
      title: `${itemToSave.type === 'lost' ? 'Lost' : 'Found'} item reported`,
      message: `Your ${itemToSave.type === 'lost' ? 'lost' : 'found'} item report for "${itemToSave.title}" has been published`,
      type: 'info'
    });
    
    toast({
      title: 'Report submitted',
      description: `Your ${itemToSave.type === 'lost' ? 'lost' : 'found'} item has been reported successfully`
    });
  };
  
  const handleStatusChange = (itemId, newStatus) => {
    setItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            status: newStatus,
            resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : null
          };
        }
        return item;
      });
      
      localStorage.setItem('lostFoundItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
    
    toast({
      title: 'Status updated',
      description: `Item status has been updated to ${newStatus}`
    });
  };
  
  const handleContactReporter = (item) => {
    // In a real app, this would navigate to chat with the reporter
    // For now, just show a toast
    toast({
      title: 'Contact initiated',
      description: `A message has been sent to ${item.reporterName} about "${item.title}"`
    });
  };
  
  // Filter items based on search term and active tab
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'lost' && item.type === 'lost') ||
      (activeTab === 'found' && item.type === 'found') ||
      (activeTab === 'mine' && item.reporterId === currentUser.id);
    
    return matchesSearch && matchesTab;
  });
  
  // Sort items by date (most recent first)
  const sortedItems = [...filteredItems].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  // Predefined options for dropdowns
  const categoryOptions = [
    'Electronics',
    'ID/Cards',
    'Keys',
    'Bag/Backpack',
    'Books/Notes',
    'Clothing',
    'Jewelry',
    'Other'
  ];
  
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lost & Found</h1>
          <p className="text-gray-600 mt-1">Report lost items or help return found items to their owners</p>
        </div>
        
        <Button
          className="mt-4 md:mt-0 bg-uniblue-500 hover:bg-uniblue-600"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Report Item
        </Button>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="lost">Lost</TabsTrigger>
          <TabsTrigger value="found">Found</TabsTrigger>
          <TabsTrigger value="mine">My Reports</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search items, locations..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Items */}
      {sortedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
            <Card key={item.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${
              item.status === 'resolved' ? 'bg-gray-50 opacity-75' : ''
            }`}>
              <CardContent className="p-0">
                {item.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <Badge className={`${
                      item.type === 'lost' 
                        ? 'bg-red-100 text-red-800 border-red-200' 
                        : 'bg-green-100 text-green-800 border-green-200'
                    }`}>
                      {item.type === 'lost' ? 'Lost' : 'Found'}
                    </Badge>
                  </div>
                  
                  {item.status === 'resolved' && (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-2">
                      Resolved
                    </Badge>
                  )}
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {item.description || `No additional details provided for this ${item.type} item.`}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-uniblue-500" />
                      <span>{item.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-uniblue-500" />
                      <span>
                        {item.date ? format(new Date(item.date), 'PP') : format(new Date(item.createdAt), 'PP')}
                      </span>
                    </div>
                    
                    {item.category && (
                      <Badge variant="outline" className="bg-gray-50">
                        {item.category}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback className="bg-uniblue-200 text-uniblue-700">
                          {getInitials(item.reporterName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{item.reporterName}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(item.createdAt), 'PP')}
                        </p>
                      </div>
                    </div>
                    
                    {item.reporterId !== currentUser.id && item.status !== 'resolved' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-uniblue-500 border-uniblue-200"
                        onClick={() => handleContactReporter(item)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" /> Contact
                      </Button>
                    )}
                    
                    {item.reporterId === currentUser.id && item.status !== 'resolved' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-500 border-green-200"
                        onClick={() => handleStatusChange(item.id, 'resolved')}
                      >
                        <Check className="h-4 w-4 mr-1" /> Mark Resolved
                      </Button>
                    )}
                    
                    {item.reporterId === currentUser.id && item.status === 'resolved' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-gray-500 border-gray-200"
                        onClick={() => handleStatusChange(item.id, 'open')}
                      >
                        <X className="h-4 w-4 mr-1" /> Reopen
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-500">No items found</p>
          <p className="text-gray-500 mt-2">
            {activeTab === 'all' 
              ? "There are currently no lost or found items reported." 
              : activeTab === 'mine' 
                ? "You haven't reported any items yet." 
                : `There are no ${activeTab} items reported at the moment.`}
          </p>
          <Button 
            className="mt-6 bg-uniblue-500 hover:bg-uniblue-600"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Report an Item
          </Button>
        </div>
      )}
      
      {/* Report Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Report Lost or Found Item</DialogTitle>
            <DialogDescription>
              Provide details about the lost or found item to help with recovery.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Report Type *
              </Label>
              <div className="col-span-3 flex space-x-4">
                <Label
                  htmlFor="lost"
                  className={`flex items-center p-3 border rounded-md cursor-pointer ${
                    newItem.type === 'lost' ? 'bg-red-50 border-red-200' : ''
                  }`}
                >
                  <input
                    type="radio"
                    id="lost"
                    name="type"
                    className="sr-only"
                    checked={newItem.type === 'lost'}
                    onChange={() => setNewItem({...newItem, type: 'lost'})}
                  />
                  <span className={`mr-2 h-4 w-4 rounded-full border ${
                    newItem.type === 'lost' ? 'bg-red-500 border-red-500' : 'border-gray-300'
                  }`}>
                    {newItem.type === 'lost' && (
                      <span className="flex items-center justify-center h-full w-full">
                        <span className="h-2 w-2 rounded-full bg-white" />
                      </span>
                    )}
                  </span>
                  <span>I lost an item</span>
                </Label>
                
                <Label
                  htmlFor="found"
                  className={`flex items-center p-3 border rounded-md cursor-pointer ${
                    newItem.type === 'found' ? 'bg-green-50 border-green-200' : ''
                  }`}
                >
                  <input
                    type="radio"
                    id="found"
                    name="type"
                    className="sr-only"
                    checked={newItem.type === 'found'}
                    onChange={() => setNewItem({...newItem, type: 'found'})}
                  />
                  <span className={`mr-2 h-4 w-4 rounded-full border ${
                    newItem.type === 'found' ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {newItem.type === 'found' && (
                      <span className="flex items-center justify-center h-full w-full">
                        <span className="h-2 w-2 rounded-full bg-white" />
                      </span>
                    )}
                  </span>
                  <span>I found an item</span>
                </Label>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Item Name *
              </Label>
              <Input
                id="title"
                placeholder="e.g., Blue Laptop Bag"
                className="col-span-3"
                value={newItem.title}
                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Provide details about the item (brand, color, contents, etc.)"
                className="col-span-3"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select 
                value={newItem.category} 
                onValueChange={(value) => setNewItem({...newItem, category: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Not specified</SelectItem>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location *
              </Label>
              <Input
                id="location"
                placeholder={newItem.type === 'lost' ? "Where you lost it" : "Where you found it"}
                className="col-span-3"
                value={newItem.location}
                onChange={(e) => setNewItem({...newItem, location: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                className="col-span-3"
                value={newItem.date}
                onChange={(e) => setNewItem({...newItem, date: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                className="col-span-3"
                value={newItem.image}
                onChange={(e) => setNewItem({...newItem, image: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right">
                Contact Number
              </Label>
              <Input
                id="contact"
                placeholder="Your phone number (optional)"
                className="col-span-3"
                value={newItem.contact}
                onChange={(e) => setNewItem({...newItem, contact: e.target.value})}
              />
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
              onClick={handleSaveItem}
              className={newItem.type === 'lost' ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LostFound;
