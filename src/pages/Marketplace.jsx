
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import MarketplaceSearch from '@/components/marketplace/MarketplaceSearch';
import MarketplaceItem from '@/components/marketplace/MarketplaceItem';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categories = [
  'Books & Study Materials',
  'Electronics',
  'Furniture',
  'Clothing',
  'Services',
  'Other'
];

const Marketplace = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
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
      image: newItem.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
    };
    
    const updatedItems = [itemToSave, ...items];
    setItems(updatedItems);
    localStorage.setItem('marketplaceItems', JSON.stringify(updatedItems));
    
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
    toast({
      title: 'Contact initiated',
      description: `A message has been sent to ${item.seller.name} about "${item.title}"`
    });
  };
  
  const handleDeleteItem = (itemId) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    localStorage.setItem('marketplaceItems', JSON.stringify(updatedItems));
    
    toast({
      title: 'Item deleted',
      description: 'Your item has been successfully removed from the marketplace'
    });
  };
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' ? true : item.category === category;
    
    return matchesSearch && matchesCategory;
  });

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600 mt-1">Buy and sell items with other students</p>
        </div>
        
        <Button
          className="mt-4 md:mt-0 bg-uniblue-500 hover:bg-uniblue-600"
          onClick={handleOpenDialog}
        >
          <Plus className="mr-2 h-4 w-4" />
          List an Item
        </Button>
      </div>
      
      <MarketplaceSearch 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        category={category}
        setCategory={setCategory}
      />
      
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MarketplaceItem 
              key={item.id} 
              item={item}
              onContactSeller={handleContactSeller}
              onDelete={handleDeleteItem}
            />
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
              setCategory('all');
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
      
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
