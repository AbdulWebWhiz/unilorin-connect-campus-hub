
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import MarketplaceSearch from '@/components/marketplace/MarketplaceSearch';
import MarketplaceItem from '@/components/marketplace/MarketplaceItem';
import ListItemDialog from '@/components/marketplace/ListItemDialog';

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
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category ? item.category === category : true;
    
    return matchesSearch && matchesCategory;
  });

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
              setCategory('');
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
      
      <ListItemDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        newItem={newItem}
        setNewItem={setNewItem}
        onSave={handleSaveItem}
      />
    </div>
  );
};

export default Marketplace;
