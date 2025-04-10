
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare, Calendar, Star, User, CheckCircle2 } from 'lucide-react';

const Notifications = () => {
  // Sample notification data
  const notifications = [
    {
      id: 1,
      type: 'message',
      title: 'New message from Alex Wang',
      description: 'Are we still on for tomorrow?',
      time: '10 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'session',
      title: 'Upcoming session reminder',
      description: 'JavaScript Basics with Alex Wang starts in 1 hour',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'review',
      title: 'New review received',
      description: 'Sarah Johnson gave you 5 stars for your Cooking Basics session',
      time: '1 day ago',
      read: true
    },
    {
      id: 4,
      type: 'user',
      title: 'New follower',
      description: 'Maria Rodriguez is now following your profile',
      time: '2 days ago',
      read: true
    },
    {
      id: 5,
      type: 'system',
      title: 'Welcome to SkillSync!',
      description: 'Thanks for joining our community. Start exploring skills now!',
      time: '1 week ago',
      read: true
    }
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-skillsync-blue" />;
      case 'session':
        return <Calendar className="h-5 w-5 text-skillsync-purple" />;
      case 'review':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'user':
        return <User className="h-5 w-5 text-green-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <Button variant="outline" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Mark All as Read
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <span className="ml-2 bg-skillsync-blue text-white text-xs rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Notifications</CardTitle>
                <CardDescription>Stay updated with your activity on SkillSync</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border ${
                        !notification.read ? 'bg-muted/50' : ''
                      }`}
                    >
                      <div className="rounded-full bg-muted p-2 flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-skillsync-blue"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="unread">
            <Card>
              <CardHeader>
                <CardTitle>Unread Notifications</CardTitle>
                <CardDescription>Notifications you haven't seen yet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.filter(n => !n.read).length > 0 ? (
                    notifications
                      .filter(notification => !notification.read)
                      .map(notification => (
                        <div 
                          key={notification.id}
                          className="flex items-start gap-4 p-4 rounded-lg border bg-muted/50"
                        >
                          <div className="rounded-full bg-muted p-2 flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                            <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-skillsync-blue"></div>
                        </div>
                      ))
                  ) : (
                    <p className="text-center py-6 text-muted-foreground">No unread notifications</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="read">
            <Card>
              <CardHeader>
                <CardTitle>Read Notifications</CardTitle>
                <CardDescription>Notifications you've already seen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications
                    .filter(notification => notification.read)
                    .map(notification => (
                      <div 
                        key={notification.id}
                        className="flex items-start gap-4 p-4 rounded-lg border"
                      >
                        <div className="rounded-full bg-muted p-2 flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Notifications;
