import { MessageSquare, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const MarketplaceItem = ({ item, onContactSeller, onDelete }) => {
  const { currentUser } = useAuth();
  const isOwner = currentUser?.id === item.seller.id;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow relative">
      <img 
        src={item.image} 
        alt={item.title} 
        className="h-48 w-full object-cover"
      />
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
          {isOwner && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 absolute top-2 right-2 bg-white/80 hover:bg-white"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
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
            onClick={() => onContactSeller(item)}
          >
            <MessageSquare className="h-4 w-4 mr-1" /> Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketplaceItem;
