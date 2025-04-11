
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import UserSearch from '@/components/UserSearch';
import ConnectionRequests from '@/components/ConnectionRequests';

const Network = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-8">Network</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Manage Network</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/connections">Connections</a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/network">Connection Requests</a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/messages">Messages</a>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="search">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="search">Find People</TabsTrigger>
                <TabsTrigger value="requests">Connection Requests</TabsTrigger>
              </TabsList>
              
              <TabsContent value="search" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Find People</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UserSearch />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="requests" className="mt-6">
                <ConnectionRequests />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Network;
