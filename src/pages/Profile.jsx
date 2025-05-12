import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Edit, 
  Save, 
  X, 
  ShoppingCart, 
  Calendar, 
  FileText, 
  MapPin, 
  Phone, 
  Mail, 
  School,
  Upload,
  UserRound
} from 'lucide-react';

// ImageUpload component for profile picture
const ImageUpload = ({ currentImage, onImageChange }) => {
  const fileInputRef = useRef(null);
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: 'destructive'
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: 'destructive'
      });
      return;
    }
    
    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onImageChange(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative group">
        <Avatar className="h-24 w-24 cursor-pointer" onClick={handleClick}>
          <AvatarImage src={currentImage} />
          <AvatarFallback className="bg-uniblue-200 text-uniblue-700 text-2xl">
            {!currentImage ? <UserRound className="h-10 w-10 text-uniblue-500" /> : null}
          </AvatarFallback>
          
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Upload className="h-8 w-8 text-white" />
          </div>
        </Avatar>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      
      <p className="text-sm text-gray-500 mt-1">
        Click to upload a profile picture
      </p>
    </div>
  );
};

// EditProfileForm component for reusability
const EditProfileForm = ({ profileData, setProfileData, onSubmit, onCancel }) => {
  const isMobile = useIsMobile();
  
  const departmentOptions = [
    'Agricultural & Environmental Engineering',
    'Chemical Engineering',
    'Civil Engineering',
    'Computer Science',
    'Electrical & Electronics Engineering',
    'Food Science & Engineering',
    'Mechanical Engineering',
    'Medicine',
    'Pharmacy',
    'Statistics',
    'Other'
  ];

  const facultyOptions = [
    'Engineering',
    'Science',
    'Medicine',
    'Arts',
    'Law',
    'Education',
    'Agriculture',
    'Business Administration',
    'Social Sciences',
    'Other'
  ];

  return (
    <form className="space-y-4">
      <div className="flex justify-center mb-6">
        <ImageUpload 
          currentImage={profileData.profilePic} 
          onImageChange={(image) => setProfileData({...profileData, profilePic: image})}
        />
      </div>
      
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={profileData.name}
            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            disabled
          />
          <p className="text-xs text-gray-500">Email cannot be changed</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="matric">Matric Number</Label>
          <Input
            id="matric"
            value={profileData.matric || ''}
            onChange={(e) => setProfileData({...profileData, matric: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="faculty">Faculty</Label>
          <Select 
            value={profileData.faculty || ''} 
            onValueChange={(value) => setProfileData({...profileData, faculty: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your faculty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Not specified</SelectItem>
              {facultyOptions.map((faculty) => (
                <SelectItem key={faculty} value={faculty}>{faculty}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select 
            value={profileData.department || ''} 
            onValueChange={(value) => setProfileData({...profileData, department: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Not specified</SelectItem>
              {departmentOptions.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={profileData.phone || ''}
            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell others about yourself..."
            value={profileData.bio || ''}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            rows={4}
          />
        </div>
      </div>

      <div className={`flex ${isMobile ? 'flex-col gap-2' : 'justify-end gap-4'} mt-6`}>
        <Button
          variant="outline"
          onClick={onCancel}
          className="w-full md:w-auto"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button
          className="w-full md:w-auto bg-green-500 hover:bg-green-600"
          onClick={onSubmit}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </form>
  );
};

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    matric: '',
    department: '',
    faculty: '',
    bio: '',
    phone: '',
    profilePic: ''
  });
  const [userListings, setUserListings] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [userResources, setUserResources] = useState([]);
  const [userLostItems, setUserLostItems] = useState([]);
  
  const isMobile = useIsMobile(); // Fix: Use useIsMobile instead of useMediaQuery
  
  // Load user data on mount
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        matric: currentUser.matric || '',
        department: currentUser.department || '',
        faculty: currentUser.faculty || '',
        bio: currentUser.bio || '',
        phone: currentUser.phone || '',
        profilePic: currentUser.profilePic || ''
      });
    }
    
    // Load user's marketplace listings
    const allListings = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
    setUserListings(allListings.filter(item => item.seller?.id === currentUser?.id));
    
    // Load user's events
    const allEvents = JSON.parse(localStorage.getItem('campusEvents') || '[]');
    setUserEvents(allEvents.filter(event => event.organizerId === currentUser?.id));
    
    // Load user's resources
    const allResources = JSON.parse(localStorage.getItem('campusResources') || '[]');
    setUserResources(allResources.filter(resource => resource.uploaderId === currentUser?.id));
    
    // Load user's lost/found items
    const allLostItems = JSON.parse(localStorage.getItem('lostFoundItems') || '[]');
    setUserLostItems(allLostItems.filter(item => item.reporterId === currentUser?.id));
  }, [currentUser]);
  
  const handleUpdateProfile = async () => {
    if (!profileData.name) {
      toast({
        title: 'Error',
        description: 'Name cannot be empty',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      await updateProfile(profileData);
      setIsEditing(false);
      setIsDialogOpen(false);
      setIsSheetOpen(false);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  
  const handleEditClick = () => {
    if (isMobile) {
      setIsSheetOpen(true);
    } else {
      setIsDialogOpen(true);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setIsDialogOpen(false);
    setIsSheetOpen(false);
    setProfileData({
      name: currentUser.name || '',
      email: currentUser.email || '',
      matric: currentUser.matric || '',
      department: currentUser.department || '',
      faculty: currentUser.faculty || '',
      bio: currentUser.bio || '',
      phone: currentUser.phone || '',
      profilePic: currentUser.profilePic || ''
    });
  };
  
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        
        {/* Edit Profile Button - Opens Dialog on Desktop, Sheet on Mobile */}
        <Button
          className="mt-4 md:mt-0 bg-uniblue-500 hover:bg-uniblue-600"
          onClick={handleEditClick}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>

        {/* Dialog for desktop edit form */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Your Profile</DialogTitle>
              <DialogDescription>
                Update your personal information and profile details
              </DialogDescription>
            </DialogHeader>
            <EditProfileForm 
              profileData={profileData}
              setProfileData={setProfileData}
              onSubmit={handleUpdateProfile}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>

        {/* Sheet for mobile edit form */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Edit Your Profile</SheetTitle>
              <SheetDescription>
                Update your personal information and profile details
              </SheetDescription>
            </SheetHeader>
            <div className="py-6">
              <EditProfileForm 
                profileData={profileData}
                setProfileData={setProfileData}
                onSubmit={handleUpdateProfile}
                onCancel={handleCancel}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2 text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileData.profilePic} />
                <AvatarFallback className="bg-uniblue-200 text-uniblue-700 text-2xl">
                  {getInitials(profileData.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>{profileData.name}</CardTitle>
            {profileData.department && (
              <CardDescription className="mt-1">{profileData.department}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {profileData.bio && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
                  <p className="text-gray-700">{profileData.bio}</p>
                </div>
              )}
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-uniblue-500" />
                  <span>{profileData.email}</span>
                </div>
                
                {profileData.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-uniblue-500" />
                    <span>{profileData.phone}</span>
                  </div>
                )}
                
                {profileData.matric && (
                  <div className="flex items-center text-gray-600">
                    <School className="h-4 w-4 mr-2 text-uniblue-500" />
                    <span>Matric: {profileData.matric}</span>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Activity</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-uniblue-500">{userListings.length}</p>
                    <p className="text-xs text-gray-500">Marketplace Listings</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-uniblue-500">{userEvents.length}</p>
                    <p className="text-xs text-gray-500">Events Created</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-uniblue-500">{userResources.length}</p>
                    <p className="text-xs text-gray-500">Resources Shared</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-uniblue-500">{userLostItems.length}</p>
                    <p className="text-xs text-gray-500">Lost/Found Reports</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* User Activity */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="marketplace" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="lostfound">Lost & Found</TabsTrigger>
            </TabsList>
            
            {/* Marketplace Listings */}
            <TabsContent value="marketplace">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2 text-uniblue-500" />
                    My Marketplace Listings
                  </CardTitle>
                  <CardDescription>Items you have listed for sale or trade</CardDescription>
                </CardHeader>
                <CardContent>
                  {userListings.length > 0 ? (
                    <div className="space-y-4">
                      {userListings.map(item => (
                        <div key={item.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="h-16 w-16 object-cover rounded mr-4"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-uniblue-500 font-semibold">₦{item.price}</p>
                            <p className="text-xs text-gray-500">
                              Posted on {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = `/marketplace`}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500">You haven't listed any items yet</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => window.location.href = '/marketplace'}
                      >
                        Go to Marketplace
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Events */}
            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-uniblue-500" />
                    My Events
                  </CardTitle>
                  <CardDescription>Events you have created or organized</CardDescription>
                </CardHeader>
                <CardContent>
                  {userEvents.length > 0 ? (
                    <div className="space-y-4">
                      {userEvents.map(event => (
                        <div key={event.id} className="p-4 border rounded-lg hover:bg-gray-50">
                          <h3 className="font-medium">{event.title}</h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <Calendar className="h-4 w-4 mr-1 text-uniblue-500" />
                            <span className="text-sm">
                              {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin className="h-4 w-4 mr-1 text-uniblue-500" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              {event.attendees.length} {event.attendees.length === 1 ? 'person' : 'people'} attending
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.location.href = `/events`}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500">You haven't created any events yet</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => window.location.href = '/events'}
                      >
                        Go to Events
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Resources */}
            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-uniblue-500" />
                    My Shared Resources
                  </CardTitle>
                  <CardDescription>Academic resources you have shared with others</CardDescription>
                </CardHeader>
                <CardContent>
                  {userResources.length > 0 ? (
                    <div className="space-y-4">
                      {userResources.map(resource => (
                        <div key={resource.id} className="p-4 border rounded-lg hover:bg-gray-50">
                          <h3 className="font-medium">{resource.title}</h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <FileText className="h-4 w-4 mr-1 text-uniblue-500" />
                            <span className="text-sm">{resource.category} • {resource.course}</span>
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              {resource.downloads} {resource.downloads === 1 ? 'download' : 'downloads'}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.location.href = `/resources`}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500">You haven't shared any resources yet</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => window.location.href = '/resources'}
                      >
                        Go to Resources
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Lost & Found */}
            <TabsContent value="lostfound">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-uniblue-500" />
                    My Lost & Found Reports
                  </CardTitle>
                  <CardDescription>Items you have reported as lost or found</CardDescription>
                </CardHeader>
                <CardContent>
                  {userLostItems.length > 0 ? (
                    <div className="space-y-4">
                      {userLostItems.map(item => (
                        <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{item.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                              {item.type === 'lost' ? 'Lost' : 'Found'}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin className="h-4 w-4 mr-1 text-uniblue-500" />
                            <span className="text-sm">{item.location}</span>
                          </div>
                          
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              Reported on {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.location.href = `/lost-found`}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500">You haven't reported any lost or found items yet</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => window.location.href = '/lost-found'}
                      >
                        Go to Lost & Found
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
