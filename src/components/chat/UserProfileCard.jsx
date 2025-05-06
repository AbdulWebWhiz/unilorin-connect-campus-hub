
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const UserProfileCard = ({ user }) => {
  if (!user) return null;
  
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-16 w-16 mt-2">
            <AvatarImage src={user.profilePic} />
            <AvatarFallback className="bg-uniblue-200 text-uniblue-700 text-xl">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h3 className="font-semibold text-lg">{user.name}</h3>
            {user.matric && <p className="text-sm text-gray-600">{user.matric}</p>}
          </div>
          
          <div className="flex flex-col space-y-2 w-full">
            {user.faculty && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Faculty:</span>
                <Badge variant="outline">{user.faculty}</Badge>
              </div>
            )}
            
            {user.department && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Department:</span>
                <span className="text-sm">{user.department}</span>
              </div>
            )}
            
            {user.year && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Year:</span>
                <span className="text-sm">{user.year}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Joined:</span>
              <span className="text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
