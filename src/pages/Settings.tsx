
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const Settings = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <div>Loading...</div>;
  }

  const userInitials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile settings saved successfully!');
  };
  
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Notification settings saved successfully!');
  };
  
  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Account settings saved successfully!');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <form onSubmit={handleSaveProfile}>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information visible to other users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.avatar_url} alt={user.name} />
                      <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">Change Profile Picture</Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email} disabled />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea 
                        id="bio" 
                        className="w-full min-h-[100px] p-2 border rounded-md resize-y"
                        placeholder="Tell others about yourself..."
                      ></textarea>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="City, Country" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="teacher-mode">Teacher Mode</Label>
                        <Switch id="teacher-mode" defaultChecked={user.isTeacher} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Enable to offer your skills as a teacher
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <form onSubmit={handleSaveNotifications}>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how and when you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch id="email-notifications" defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">New Session Requests</h3>
                        <p className="text-sm text-muted-foreground">When someone wants to book a session</p>
                      </div>
                      <Switch id="session-notifications" defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Session Reminders</h3>
                        <p className="text-sm text-muted-foreground">Before your scheduled sessions</p>
                      </div>
                      <Switch id="reminder-notifications" defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">New Messages</h3>
                        <p className="text-sm text-muted-foreground">When you receive a new message</p>
                      </div>
                      <Switch id="message-notifications" defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Marketing Updates</h3>
                        <p className="text-sm text-muted-foreground">News and special offers</p>
                      </div>
                      <Switch id="marketing-notifications" defaultChecked={false} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Preferences</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <form onSubmit={handleSaveAccount}>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-4">Delete Account</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all of your data. This action cannot be undone.
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Update Password</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
