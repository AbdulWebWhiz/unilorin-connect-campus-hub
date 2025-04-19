
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, Plus, MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const Marketplace = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'Used',
    image: ''
  });
  
  // Load items from localStorage on mount
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
    setItems(storedItems);
  }, []);
  
  const handleSaveItem = () => {
    if (!newItem.title || !newItem.price || !newItem.category) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    const itemToSave = {
      ...newItem,
      id: Date.now().toString(),
      seller: {
        id: currentUser.id,
        name: currentUser.name
      },
      createdAt: new Date().toISOString(),
      image: newItem.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80' // Placeholder image if none provided
    };
    
    // Add to state and localStorage
    const updatedItems = [itemToSave, ...items];
    setItems(updatedItems);
    localStorage.setItem('marketplaceItems', JSON.stringify(updatedItems));
    
    // Reset form and close dialog
    setNewItem({
      title: '',
      description: '',
      price: '',
      category: '',
      condition: 'Used',
      image: ''
    });
    
    setIsDialogOpen(false);
    
    toast({
      title: 'Item listed',
      description: 'Your item has been successfully listed in the marketplace'
    });
  };
  
  const handleContactSeller = (item) => {
    // In a real app, this would navigate to chat with the seller
    // For now, just show a toast
    toast({
      title: 'Contact initiated',
      description: `A message has been sent to ${item.seller.name} about "${item.title}"`
    });
  };
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category ? item.category === category : true;
    
    return matchesSearch && matchesCategory;
  });
  
  const categories = [
    'Books & Study Materials',
    'Electronics',
    'Furniture',
    'Clothing',
    'Services',
    'Other'
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600 mt-1">Buy and sell items with other students</p>
        </div>
        
        <Button
          className="mt-4 md:mt-0 bg-uniblue-500 hover:bg-uniblue-600"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          List an Item
        </Button>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search items..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-64">
          <Select value={category} onValueChange={setCategory}>
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
      </div>
      
      {/* Item Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={item.image} 
                alt={item.title} 
                className="h-48 w-full object-cover"
              />
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                  <Badge variant="outline" className="bg-uniblue-50 text-uniblue-700 border-uniblue-200">
                    {item.condition}
                  </Badge>
                </div>
                <p className="text-xl font-bold text-uniblue-500 mb-2">₦{item.price}</p>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{item.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Posted by {item.seller.name}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-uniblue-500 border-uniblue-200"
                    onClick={() => handleContactSeller(item)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" /> Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <p className="text-lg text-gray-500">No items found. Adjust your search or filters.</p>
          <Button 
            variant="link" 
            className="mt-2 text-uniblue-500"
            onClick={() => {
              setSearchTerm('');
              setCategory('');
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
      
      {/* Add New Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>List a New Item</DialogTitle>
            <DialogDescription>
              Enter the details of the item you want to sell or trade.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g., Calculus Textbook"
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
                placeholder="Describe your item, condition, etc."
                className="col-span-3"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (₦) *
              </Label>
              <Input
                id="price"
                placeholder="e.g., 5000"
                className="col-span-3"
                value={newItem.price}
                onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category *
              </Label>
              <Select 
                value={newItem.category} 
                onValueChange={(value) => setNewItem({...newItem, category: value})}
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="condition" className="text-right">
                Condition
              </Label>
              <Select 
                value={newItem.condition} 
                onValueChange={(value) => setNewItem({...newItem, condition: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Like New">Like New</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Used">Used</SelectItem>
                </SelectContent>
              </Select>
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
              className="bg-uniblue-500 hover:bg-uniblue-600"
            >
              List Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketplace;
