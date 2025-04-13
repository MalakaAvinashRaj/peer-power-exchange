
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PendingConnection } from '@/types/connections';

export const useConnectionRequests = () => {
  // Initialize state values properly
  const [pendingConnections, setPendingConnections] = useState<PendingConnection[]>([]);
  const [isLoadingPendingConnections, setIsLoadingPendingConnections] = useState(false);
  const [hasPendingRequests, setHasPendingRequests] = useState(false);

  // Get pending connection requests
  const getPendingConnections = useCallback(async () => {
    try {
      setIsLoadingPendingConnections(true);
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      
      if (!user?.id) {
        setPendingConnections([]);
        setHasPendingRequests(false);
        return;
      }
      
      const response = await supabase
        .rpc('get_pending_connections', { 
          user_id_param: user.id 
        });

      if (response.error) throw response.error;
      
      console.log('Pending connections:', response.data);
      setPendingConnections(response.data || []);
      setHasPendingRequests((response.data || []).length > 0);
    } catch (error) {
      console.error('Error getting pending connections:', error);
      toast.error('Failed to get pending connection requests');
      setHasPendingRequests(false);
    } finally {
      setIsLoadingPendingConnections(false);
    }
  }, []);

  // Respond to a connection request (accept or decline)
  const respondToConnectionRequest = async (connectionId: string, status: 'accepted' | 'declined') => {
    try {
      if (status === 'declined') {
        // If declining, just delete the connection request
        const { error } = await supabase
          .from('connections')
          .delete()
          .eq('id', connectionId);
          
        if (error) throw error;
      } else {
        // If accepting, update status to accepted
        const response = await supabase
          .rpc('update_connection_status', { 
            connection_id_param: connectionId,
            status_param: status 
          });

        if (response.error) throw response.error;
      }
      
      setPendingConnections(prev => prev.filter(conn => conn.id !== connectionId));
      if (pendingConnections.length <= 1) {
        setHasPendingRequests(false);
      }
      
      // Emit the connection change event to update UI
      window.dispatchEvent(new CustomEvent('connection-change'));
      
      toast.success(`Connection request ${status === 'accepted' ? 'accepted' : 'declined'}`);
      return true;
    } catch (error) {
      console.error(`Error ${status} connection request:`, error);
      toast.error(`Failed to ${status} connection request`);
      return false;
    }
  };

  return {
    pendingConnections,
    isLoadingPendingConnections,
    hasPendingRequests,
    getPendingConnections,
    respondToConnectionRequest
  };
};
