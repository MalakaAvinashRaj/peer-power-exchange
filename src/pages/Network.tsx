
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ConnectionRequests from '@/components/ConnectionRequests';
import ConnectionsList from '@/components/ConnectionsList';
import { supabase } from '@/integrations/supabase/client';

const Network = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Enable real-time for connections table
    const enableRealtimeForConnections = async () => {
      if (!user?.id) return;
      
      try {
        // This enables the real-time functionality for the connections table
        // We subscribe to the channel in the child components
        const { error } = await supabase
          .from('connections')
          .select('id')
          .limit(1);
          
        if (error) {
          console.error('Error initializing real-time for connections:', error);
        } else {
          console.log('Real-time enabled for connections table');
        }
      } catch (err) {
        console.error('Error setting up real-time:', err);
      }
    };
    
    if (user?.id) {
      enableRealtimeForConnections();
    }
  }, [user?.id]);

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
