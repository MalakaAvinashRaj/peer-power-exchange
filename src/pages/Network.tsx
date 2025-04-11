
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ConnectionRequests from '@/components/ConnectionRequests';
import ConnectionsList from '@/components/ConnectionsList';

const Network = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-8">My Network</h1>
        
        <Tabs defaultValue="connections" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="connections">My Connections</TabsTrigger>
            <TabsTrigger value="requests">Connection Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connections">
            <ConnectionsList />
          </TabsContent>
          
          <TabsContent value="requests">
            <ConnectionRequests />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Network;
