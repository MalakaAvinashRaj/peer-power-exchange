
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ConnectionStatus } from '@/types/connections';

// Connection change event definition
export const connectionChangeEvent = new CustomEvent('connection-change');

export const useConnectionActions = () => {
  // Send a connection request
  const sendConnectionRequest = async (receiverId: string) => {
    try {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      
      if (!user?.id) {
        toast.error('You must be logged in to send connection requests');
        return false;
      }
      
      // Now create a new connection request
      const response = await supabase
        .rpc('create_connection', { 
          sender_id_param: user.id,
          receiver_id_param: receiverId 
        });

      if (response.error) {
        if (response.error.message.includes('Connection request already exists')) {
          toast.error('Connection request already exists');
        } else {
          throw response.error;
        }
        return false;
      }

      // Emit the connection change event to update UI
      window.dispatchEvent(connectionChangeEvent);
      toast.success('Connection request sent');
      return true;
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast.error('Failed to send connection request');
      return false;
    }
  };

  // Get connection status between current user and another user
  const getConnectionStatus = async (otherUserId: string): Promise<ConnectionStatus> => {
    try {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      
      if (!user?.id) {
        return 'none';
      }
      
      const response = await supabase
        .rpc('get_connection_status', { 
          user_id_param: user.id,
          other_user_id_param: otherUserId 
        });

      if (response.error) throw response.error;
      
      // For declined status, return 'none' so user can re-request
      const status = response.data as string;
      if (status === 'declined') {
        return 'none';
      }
      
      return status as ConnectionStatus;
    } catch (error) {
      console.error('Error getting connection status:', error);
      return 'none';
    }
  };

  // Create subscription for real-time updates
  const subscribeToConnectionChanges = useCallback((userId: string) => {
    if (!userId) return undefined;
    
    console.log('Subscribing to connection changes for user:', userId);
    
    // Set up a channel to listen for real-time connection changes
    const channel = supabase
      .channel(`connection-changes-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'connections',
        filter: `sender_id=eq.${userId}`,
      }, () => {
        console.log('Connection change detected (as sender)');
        // Emit the connection change event to update UI
        window.dispatchEvent(connectionChangeEvent);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'connections',
        filter: `receiver_id=eq.${userId}`,
      }, () => {
        console.log('Connection change detected (as receiver)');
        // Emit the connection change event to update UI
        window.dispatchEvent(connectionChangeEvent);
      })
      .subscribe();
      
    return () => {
      console.log('Unsubscribing from connection changes');
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    sendConnectionRequest,
    getConnectionStatus,
    subscribeToConnectionChanges
  };
};
