
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ConnectionRequests from '@/components/ConnectionRequests';
import ConnectionsList from '@/components/ConnectionsList';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Network = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('connections');
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);

  useEffect(() => {
    // Enable real-time for connections table
    const enableRealtimeForConnections = async () => {
      if (!user?.id) return;
      
      try {
        // Enable real-time for the connections table
        await supabase
          .from('connections')
          .select('id')
          .limit(1);
          
        console.log('Real-time enabled for connections table');
        setRealtimeEnabled(true);
      } catch (err) {
        console.error('Error setting up real-time:', err);
        toast.error('Error setting up real-time updates');
      }
    };
    
    if (user?.id) {
      enableRealtimeForConnections();
    }
    
    return () => {
      // Cleanup will be handled by individual components
    };
  }, [user?.id]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-8">My Network</h1>
        
        <Tabs 
          defaultValue={activeTab} 
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="connections">My Connections</TabsTrigger>
            <TabsTrigger value="requests">Connection Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connections">
            {realtimeEnabled && <ConnectionsList />}
          </TabsContent>
          
          <TabsContent value="requests">
            {realtimeEnabled && <ConnectionRequests />}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Network;
